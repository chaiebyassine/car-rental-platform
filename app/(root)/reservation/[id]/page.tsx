import { Metadata } from 'next'
import { getReservationById } from '@/lib/actions/reservation.actions'
import { notFound, redirect } from 'next/navigation'
import ReservationDetails from './reservation-details-table'
import { ShippingAddress } from '@/types'
import { auth } from '@/auth'
import Stripe from 'stripe'
import { Decimal } from '@prisma/client/runtime/library'

export const metadata: Metadata = {
  title: 'Détails de la réservation',
}

const ReservationDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const reservation = await getReservationById(id)
  if (!reservation) notFound()

  const session = await auth()

  // ✅ Sécuriser l'accès : propriétaire OU admin
  const isOwner = reservation.userId === session?.user.id
  const isAdmin = session?.user.role?.toLowerCase() === 'admin'

  if (!isOwner && !isAdmin) {
    return redirect('/unauthorized')
  }

  // ✅ Générer client_secret Stripe uniquement si nécessaire
  let client_secret = null
  if (reservation.paymentMethod === 'Stripe' && !reservation.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-11-20.acacia',
    })
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(reservation.totalPrice) * 100),
      currency: 'TND',
      metadata: { orderId: reservation.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
    <ReservationDetails
      reservation={{
        id: reservation.id,
        userId: reservation.userId,
        productId: reservation.productId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        totalDays: reservation.totalDays,
        totalPrice: Number(reservation.totalPrice),
        paymentMethod: reservation.paymentMethod,
        isPaid: reservation.isPaid,
        paidAt: reservation.paidAt ?? null,
        address: reservation.address as ShippingAddress,
        paymentResult: reservation.paymentResult,
        isDelivered: reservation.isDelivered,
        deliveredAt: reservation.deliveredAt ?? null,
        createdAt: reservation.createdAt,
        product: {
          id: reservation.product.id,
          name: reservation.product.name,
          slug: reservation.product.slug,
          category: reservation.product.category,
          images: reservation.product.images,
          brand: reservation.product.brand,
          description: reservation.product.description,
          stock: reservation.product.stock,
          price: Number(reservation.product.price),
          rating: Number(reservation.product.rating),
          numReviews: reservation.product.numReviews,
          isFeatured: reservation.product.isFeatured,
          banner: reservation.product.banner,
          createdAt: reservation.product.createdAt,
        },
      }}
      stripeClientSecret={client_secret}
      isAdmin={isAdmin}
    />
  )
}

export default ReservationDetailsPage
