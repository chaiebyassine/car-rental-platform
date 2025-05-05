'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Cart, CartItem } from '@/types';
import AddToCart from '@/components/shared/product/add-to-cart';

type ReservedDateRange = { startDate: Date; endDate: Date };

export default function ProductReservationClient({
  product,
  cart,
  reservedDates,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    images: string[];
  };
  cart: Cart | undefined;
  reservedDates: ReservedDateRange[]; // ✅ maintenant on accepte les plages
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]); // ✅ dates désactivées

  // Convertir les plages en dates individuelles
  useEffect(() => {
    const disabled: Date[] = [];

    reservedDates.forEach(({ startDate, endDate }) => {
      const current = new Date(startDate);
      const last = new Date(endDate);

      while (current <= last) {
        disabled.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    setDisabledDates(disabled);
  }, [reservedDates]);

  const getNbOfDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = getNbOfDays() * parseFloat(product.price);

  const item: CartItem = {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    qty: 1,
    image: product.images?.[0] || '',
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    totalDays: getNbOfDays(),
    totalPrice,
  };

  const highlightReserved = (date: Date): string => {
    const isReserved = disabledDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    return isReserved ? 'bg-red-500 text-white rounded-full' : '';
  };
  
  

  return (
    <div className='space-y-3'>
      <div>
        <label className='block text-sm font-medium'>Date de début</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
          excludeDates={disabledDates} // ✅ empêche de sélectionner
          placeholderText='Date début'
          className='w-full border px-2 py-1 rounded text-sm'
          dayClassName={highlightReserved}
          />
      </div>

      <div>
        <label className='block text-sm font-medium'>Date de fin</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || new Date()}
          excludeDates={disabledDates}
          placeholderText='Date fin'
          className='w-full border px-2 py-1 rounded text-sm'
          dayClassName={highlightReserved}
        />
      </div>

      {startDate && endDate && (
        <div className='text-sm font-semibold'>
          Prix total : {totalPrice.toFixed(2)} DT
        </div>
      )}

      <AddToCart
        cart={cart}
        item={item}
        startDate={item.startDate}
        endDate={item.endDate}
      />
    </div>
  );
}
