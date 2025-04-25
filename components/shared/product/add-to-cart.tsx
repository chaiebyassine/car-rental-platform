'use client';

import { useRouter } from 'next/navigation';
import { Plus, Loader } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';

type Props = {
  cart?: Cart;
  item: CartItem;
  startDate?: string;
  endDate?: string;
};

const AddToCart = ({ cart, item, startDate, endDate }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const calculateReservation = () => {
    if (!startDate || !endDate) return { totalDays: 0, totalPrice: Number(item.price) };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const price = days * Number(item.price);

    return { totalDays: days, totalPrice: price };
  };

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      toast({ description: 'Sélectionnez une période de réservation.' });
      return;
    }

    const { totalDays, totalPrice } = calculateReservation();

    startTransition(async () => {
      const res = await addItemToCart({
        ...item,
        startDate,
        endDate,
        totalDays,
        totalPrice,
      });

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-primary text-white hover:bg-gray-800'
            altText='Go To Cart'
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  return (
    <Button className='w-full' onClick={handleAddToCart}>
      {isPending ? <Loader className='w-4 h-4 animate-spin' /> : <Plus className='w-4 h-4' />}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
