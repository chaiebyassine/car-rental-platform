// app/user/reservations/page.tsx
import { Metadata } from 'next';
import { auth } from '@/auth'; // ⬅️ Ajoute l'import pour récupérer l'utilisateur
import { getMyReservations } from '@/lib/actions/reservation.actions';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'Mes Réservations',
};

const ReservationsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>Utilisateur non connecté.</p>;
  }

  const reservations = await getMyReservations(userId); // ✅ Corrigé ici

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Mes Réservations</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voiture</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.id}>
                <TableCell>{res.product?.name}</TableCell>
                <TableCell>{formatDateTime(res.startDate).dateOnly}</TableCell>
                <TableCell>{formatDateTime(res.endDate).dateOnly}</TableCell>
                <TableCell>{res.totalDays}</TableCell>
                <TableCell>{formatCurrency(res.totalPrice)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReservationsPage;
