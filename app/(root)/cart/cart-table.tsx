'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { removeItemFromCart } from '@/lib/actions/cart.actions';
import { Trash2 } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      const res = await removeItemFromCart(productId);
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      } else {
        router.refresh();
      }
    });
  };

  return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <div className='flex items-start gap-4'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                        />
                        <div>
                          <p className='font-semibold'>{item.name}</p>
                          <p className='text-sm text-gray-500'>
                            📅 Début : {item.startDate ? format(new Date(item.startDate), 'dd/MM/yyyy') : '—'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            📅 Fin : {item.endDate ? format(new Date(item.endDate), 'dd/MM/yyyy') : '—'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            ⏱️ Jours : {item.totalDays}
                          </p>
                          <p className='text-sm text-gray-800 font-bold'>
                            💰 Total : {item.totalPrice?.toFixed(2)} €
                          </p>
                          <Button
                            variant='ghost'
                            className='text-red-600 mt-2'
                            onClick={() => handleRemove(item.productId)}
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
              <div className='pb-3 text-xl'>
                Subtotal ({cart.items.length}):
                <span className='font-bold'>
                  {formatCurrency(cart.totalPrice)}
                </span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push('/shipping-address'))
                }
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
