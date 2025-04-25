import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryDrawer from './category-drawer';
import SearchWrapper from './SearchWrapper';

const Header = () => {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="wrapper flex items-center justify-between py-4">
        {/* Logo + Nom */}
        <div className="flex items-center gap-4">
          <CategoryDrawer />
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={40}
              height={40}
              priority
            />
            <span className="text-xl font-bold hidden sm:block">{APP_NAME}</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 mx-6 hidden lg:block">
          <SearchWrapper />
        </div>

        {/* Menu (cart + login) */}
        <div className="flex items-center gap-4">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
