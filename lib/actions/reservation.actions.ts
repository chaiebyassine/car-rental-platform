'use server';

import { prisma } from '@/db/prisma';

export async function getReservedDates(productId: string) {
  const reservations = await prisma.reservation.findMany({
    where: { productId },
    select: { startDate: true, endDate: true },
  });

  const dates: Date[] = [];

  for (const res of reservations) {
    const current = new Date(res.startDate);
    const end = new Date(res.endDate);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  return dates;
}
