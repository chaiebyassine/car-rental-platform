'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

const DealCountdown = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20 items-center">
      <div className="flex flex-col gap-4 px-6">
        <h3 className="text-3xl font-bold text-primary">Service de Livraison à Domicile</h3>
        <p className="text-muted-foreground text-lg">
          Pour plus de confort, nous livrons votre voiture de location directement chez vous,
          partout en Tunisie. Réservez en ligne et recevez votre véhicule à l'endroit de votre choix !
        </p>
        <div>
          <Button asChild>
            <Link href="/search">Voir les voitures</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/delivery-car.png" // ajoute cette image dans public/images
          alt="Livraison de voiture à domicile"
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default DealCountdown;

