import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  deleteReservation,
  getAllReservations,
  updateReservationToDelivered,
  updateReservationToPaid,
} from '@/lib/actions/reservation.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { requireAdmin } from '@/lib/auth-guard';
import { differenceInHours } from 'date-fns'; 

export const metadata: Metadata = {
  title: 'Admin Reservations',
};

const AdminReservationPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = '1', query: searchText } = await props.searchParams;

  await requireAdmin();

  const reservations = await getAllReservations({
    page: Number(page),
    query: searchText,
  });

  for (const res of reservations.data) {
    const heuresPassees = differenceInHours(new Date(), new Date(res.createdAt));
    if (!res.isPaid && heuresPassees > 1) {
      await deleteReservation(res.id);
    }
  }

  const filteredReservations = reservations.data.filter(
    (res) => !(differenceInHours(new Date(), new Date(res.createdAt)) > 48 && !res.isPaid)
  );

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
        <h1 className='h2-bold'>Réservations</h1>
        {searchText && (
          <div>
            Filtré par <i>&quot;{searchText}&quot;</i>{' '}
            <Link href='/admin/reservation'>
              <Button variant='outline' size='sm'>
                Supprimer le filtre
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>CLIENT</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAYÉ</TableHead>
              <TableHead>LIVRÉ</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((res) => {
              const isFullyDone = res.isPaid && res.isDelivered;

              return (
                <TableRow
                  key={res.id}
                  className={isFullyDone ? 'bg-green-100' : ''}
                >
                  <TableCell>{formatId(res.id)}</TableCell>
                  <TableCell>{formatDateTime(res.createdAt).dateTime}</TableCell>
                  <TableCell>{res.user?.name || 'Utilisateur supprimé'}</TableCell>
                  <TableCell>{formatCurrency(res.totalPrice)}</TableCell>
                  <TableCell className={res.isPaid ? 'text-green-600' : 'text-red-600'}>
                    {res.isPaid && res.paidAt
                      ? formatDateTime(res.paidAt).dateTime
                      : 'Non payé'}
                  </TableCell>
                  <TableCell className={res.isDelivered ? 'text-green-600' : 'text-red-600'}>
                    {res.isDelivered && res.deliveredAt
                      ? formatDateTime(res.deliveredAt).dateTime
                      : 'Non livré'}
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col gap-2'>
                      {/* ✅ Bouton Détails */}
                      <Link href={`/reservation/${res.id}`}>
                        <Button variant='outline' size='sm'>Détails</Button>
                      </Link>

                      {!res.isPaid && (
                        <form action={updateReservationToPaid}>
                          <input type='hidden' name='id' value={res.id} />
                          <Button type='submit' variant='secondary' size='sm'>
                            Marquer Payé
                          </Button>
                        </form>
                      )}

                      {!res.isDelivered && (
                        <form action={updateReservationToDelivered}>
                          <input type='hidden' name='id' value={res.id} />
                          <Button type='submit' variant='secondary' size='sm'>
                            Marquer Livré
                          </Button>
                        </form>
                      )}

                      <DeleteDialog id={res.id} action={deleteReservation} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {reservations.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={reservations.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminReservationPage;
