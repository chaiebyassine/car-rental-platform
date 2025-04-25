'use client';

import dynamic from 'next/dynamic';

// Chargement dynamique du composant client (avec calendrier, panier, etc.)
const ProductReservationClient = dynamic(() => import('./ProductReservationClient'), {
  ssr: false,
});

export default ProductReservationClient;
