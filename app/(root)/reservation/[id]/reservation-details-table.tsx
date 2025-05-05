'use client';
import { ShippingAddress } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Reservation } from '@/types';
import Image from 'next/image';
import { deliverOrder } from '@/lib/actions/reservation.actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

const ReservationDetails = ({
  reservation,
  isAdmin,
  stripeClientSecret,
}: {
  reservation: Reservation;
  isAdmin: boolean;
  stripeClientSecret?: string | null;
}) => {
  const {
    id,
    product,
    address,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    paymentMethod,
    startDate,
    endDate,
    totalDays,
  } = reservation;
  const fullAddress = reservation.address as ShippingAddress;

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className='py-4 text-2xl'>Réservation {id.slice(0, 8)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4'>
          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Détails du véhicule</h2>
              <div className='flex items-center gap-4'>
                <Image src={product.images[0]} alt={product.name} width={60} height={60} />
                <div>
                  <p className='font-bold'>{product.name}</p>
                  <p>{product.brand}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Adresse de livraison</h2>
              <p>{fullAddress.fullName}</p>
<p>{fullAddress.streetAddress}, {fullAddress.city}, {fullAddress.postalCode}, {fullAddress.country}</p>
              {isDelivered ? (
                <Badge variant='secondary'>Livrée le {formatDateTime(deliveredAt!).dateTime}</Badge>
              ) : (
                <Badge variant='destructive'>Non livrée</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Période de réservation</h2>
              <p>Début : {formatDateTime(startDate).dateOnly}</p>
              <p>Fin : {formatDateTime(endDate).dateOnly}</p>
              <p>Durée : {totalDays} jour(s)</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className='p-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Prix total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Méthode de paiement</div>
                <div>{paymentMethod}</div>
              </div>
              {isPaid ? (
                <Badge variant='secondary'>Payée le {formatDateTime(paidAt!).dateTime}</Badge>
              ) : (
                <Badge variant='destructive'>Non payée</Badge>
              )}

              {isAdmin && !isDelivered && isPaid && (
                <Button
                  type='button'
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      const res = await deliverOrder(reservation.id);
                      toast({
                        variant: res.success ? 'default' : 'destructive',
                        description: res.message,
                      });
                    })
                  }
                >
                  {isPending ? 'Traitement...' : 'Marquer comme livrée'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ReservationDetails;
