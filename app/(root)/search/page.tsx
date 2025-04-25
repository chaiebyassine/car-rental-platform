// app/(root)/search/page.tsx
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.actions';
import Link from 'next/link';

const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $100', value: '51-100' },
  { name: '$101 to $200', value: '101-200' },
  { name: '$201 to $500', value: '201-500' },
  { name: '$501 to $1000', value: '501-1000' },
];

const ratings = [4, 3, 2, 1];
const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

const SearchPage = async ({
  searchParams,
}: {  searchParams: {

    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  };
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
    startDate = '',
    endDate = '',
  } = searchParams;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
    startDate,
    endDate,
  });

  const categories = await getAllCategories();

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      {/* Filter Sidebar */}
      <div className='filter-links'>
        {/* Category */}
        <div className='text-xl mb-2 mt-3'>Category</div>
        <ul className='space-y-1'>
          <li>
            <Link href={`/search?category=all`}>Any</Link>
          </li>
          {categories.map((x) => (
            <li key={x.category}>
              <Link href={`/search?category=${x.category}`}>{x.category}</Link>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className='text-xl mb-2 mt-8'>Price</div>
        <ul className='space-y-1'>
          {prices.map((p) => (
            <li key={p.value}>
              <Link href={`/search?price=${p.value}`}>{p.name}</Link>
            </li>
          ))}
        </ul>

        {/* Rating */}
        <div className='text-xl mb-2 mt-8'>Rating</div>
        <ul className='space-y-1'>
          {ratings.map((r) => (
            <li key={r}>
              <Link href={`/search?rating=${r}`}>{r} stars & up</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Products Grid */}
      <div className='md:col-span-4 space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
