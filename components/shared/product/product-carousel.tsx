'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';

const ProductCarousel = ({ data }: { data: Product[] }) => {
  // ❌ Exclure les produits sans bannière
  const validProducts = data.filter((product) => !!product.banner);

  return (
    <Carousel
      className='w-full mb-12'
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 1000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {validProducts.map((product: Product) => {
          const imageSrc = product.banner?.startsWith('/')
            ? product.banner
            : `/images/${product.banner}`;

          return (
            <CarouselItem key={product.id} className='basis-full'>
              <Link href={`/product/${product.slug}`}>
                <div className='relative mx-auto'>
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    width={1200}
                    height={400}
                    className='w-full h-[300px] object-cover rounded-md shadow'
                  />
                </div>
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;


