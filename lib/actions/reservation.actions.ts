'use server';

import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { formatError } from '../utils';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { ShippingAddress } from '@/types';
import { PaymentResult } from '@/types';
import { Prisma } from '@prisma/client';

export async function createReservation() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Utilisateur non authentifié');

    const cart = await getMyCart();
    const user = await getUserById(session.user.id);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Votre panier est vide.',
        redirectTo: '/cart',
      };
      
    }

    if (!user.address) {
      return {
        success: false,
        message: 'Adresse de livraison manquante.',
        redirectTo: '/shipping-address',
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'Méthode de paiement manquante.',
        redirectTo: '/payment-method',
      };
    }

    // Crée une réservation pour chaque item
    const reservations = await Promise.all(
      cart.items.map(async (item) => {
        return prisma.reservation.create({
          data: {
            userId: session.user.id,
            productId: item.productId,
            startDate: new Date(item.startDate!),
            endDate: new Date(item.endDate!),
            totalDays: item.totalDays!,
            totalPrice: item.totalPrice!,
            paymentMethod: user.paymentMethod!,
            address: user.address as ShippingAddress,
            isPaid: false,
          },
        });
      })
    );

    // Vide le panier
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      },
    });

    return {
      success: true,
      message: 'Réservations créées avec succès.',
      redirectTo: `/reservation/${reservations[0].id}`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
export async function getReservationById(id: string) {
  return await prisma.reservation.findFirst({
    where: { id },
    include: {
      product: true,
    },
  });
}

export async function markReservationAsPaid(id: string, paymentResult: PaymentResult) {
  return await prisma.reservation.update({
    where: { id },
    data: {
      isPaid: true,
      paidAt: new Date(),
      paymentResult,
    },
  });
}

export async function deliverOrder(id: string) {
  try {
    await prisma.reservation.update({
      where: { id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/reservation/${id}`);

    return {
      success: true,
      message: 'Réservation marquée comme livrée',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
export async function getReservedDates(productId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { productId },
    select: {
      startDate: true,
      endDate: true,
    },
  });

  return reservations;
}
export async function getMyReservations(userId: string) {
  return await prisma.reservation.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
// lib/actions/reservation.actions.ts


import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function getReservationSummary() {
  // Total sales
  const totalSales = await prisma.reservation.aggregate({
    _sum: { totalPrice: true },
  });

  // Count of reservations
  const ordersCount = await prisma.reservation.count();

  // Count of users
  const usersCount = await prisma.user.count();

  // Count of products
  const productsCount = await prisma.product.count();

  // Recent reservations
  const latestSales = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true },
  });

  // Sales data grouped by month
  const rawSalesData = await prisma.reservation.findMany({
    where: { isPaid: true },
    select: {
      totalPrice: true,
      createdAt: true,
    },
  });

  const salesDataMap: Record<string, number> = {};

  rawSalesData.forEach((res) => {
    const month = format(res.createdAt, 'MMM');
    salesDataMap[month] = (salesDataMap[month] || 0) + Number(res.totalPrice);
  });

  const salesData = Object.entries(salesDataMap).map(([month, totalSales]) => ({
    month,
    totalSales,
  }));
// Réservations non payées ou non livrées
const pendingReservations = await prisma.reservation.findMany({
  where: {
    OR: [{ isPaid: false }, { isDelivered: false }],
  },
  orderBy: { createdAt: 'desc' },
  include: { user: true },
  take: 5,
});

return {
  totalSales,
  ordersCount,
  usersCount,
  productsCount,
  latestSales: pendingReservations,
  salesData,
};

}

export async function getAllReservations({
  page = 1,
  query,
}: {
  page?: number;
  query?: string;
}) {
  const pageSize = 10;

  const where = query?.trim()
    ? {
        OR: [
          {
            product: {
              name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
          {
            user: {
              name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      }
    : {};

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      product: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalCount = await prisma.reservation.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: reservations,
    totalPages,
  };
}



export async function deleteReservation(id: string) {
  try {
    await prisma.reservation.delete({ where: { id } });
    return { success: true, message: 'Réservation supprimée avec succès.' };
  } catch (error) {
    return { success: false, message: 'Erreur lors de la suppression.' };
  }
}
export async function updateReservationToPaid(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  await prisma.reservation.update({
    where: { id },
    data: {
      isPaid: true,
      paidAt: new Date(),
    },
  });

  revalidatePath('/admin/reservation');
}

export async function updateReservationToDelivered(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  await prisma.reservation.update({
    where: { id },
    data: {
      isDelivered: true,
      deliveredAt: new Date(),
    },
  });

  revalidatePath('/admin/reservation');
}
