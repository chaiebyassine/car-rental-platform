// components/shared/header/SearchWrapper.tsx
import Search from './search';
import { getAllCategories } from '@/lib/actions/product.actions';

export default async function SearchWrapper() {
    const rawCategories = await getAllCategories();
    const categories = rawCategories.map((cat) => ({
      category: cat.category,
    }));
    
  return <Search categories={categories} />;
}
