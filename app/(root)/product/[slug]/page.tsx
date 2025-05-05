import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';
import { getMyCart } from '@/lib/actions/cart.actions';
import ReviewList from './review-list';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';
import ProductReservationClient from '@/components/booking/ProductReservationWrapper';
import { getReservedDates } from '@/lib/actions/reservation.actions';

interface Props {
  params: { slug: string };
}

const ProductDetailsPage = async (props: Props) => {
  const { slug } = await props.params;

 const product = await getProductBySlug(slug);
  if (!product) notFound();

const reservedDates = await getReservedDates(product.id);

  const session = await auth();
  const userId = session?.user?.id;
  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          
          <div className='col-span-2'>
            <ProductImages images={product.images} />
          </div>

          
          <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>{product.brand} {product.category}</p>
              <h1 className='h3-bold'>{product.name}</h1>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} avis</p>
              <ProductPrice
                value={Number(product.price)}
                className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
              />
            </div>
            <div className='mt-10'>
              <p className='font-semibold'>Description</p>
              <p>{product.description}</p>
            </div>
          </div>

         
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Prix</div>
                  <ProductPrice value={Number(product.price)} />
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline'></Badge>
                  ) : (
                    <Badge variant='destructive'></Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <ProductReservationClient
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      images: product.images,
                      

                    }}
                    cart={cart}
                    reservedDates={reservedDates}

                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='mt-10'>
        <h2 className='h2-bold mb-5'>Avis des clients</h2>
        <ReviewList
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;
