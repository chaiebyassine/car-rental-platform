
const sampleData = {
  users: [
    {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'test123',
      role: 'USER',
    },
  ],
  
  products: [
    {
      name: 'fiat 500',
      slug: 'fiat 500',
      category: "citadines",
      description: 'Petites voitures compactes, faciles à manœuvrer en ville',
      images: [
        '/images/sample-products/ph1.jpg',
      ],
      price: 70,
      brand: 'FIAT',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'clio 5',
      slug: ' clio 5',
      category: "Berlines ",
      description: ' voitures à 4 portes avec un coffre séparé de l habitacle',
      images: [
        '/images/sample-products/ph2.jpg',
      ],
      price: 90,
      brand: 'Renaut',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      name: 'Golf 7',
      slug: 'GOLF 7',
      category: "Berlines",
      description: 'voitures à 4 portes avec un coffre séparé de l habitacle',
      images: [
        '/images/sample-products/ph3.jpg',
        
      ],
      price: 90,
      brand: 'volkswagen',
      rating: 4.9,
      numReviews: 3,
      stock: 5,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'AUDI Q3',
      slug: 'AUDI Q3',
      category: "4*4",
      description: ' modèles haut de gamme combinant performance tout-terrain et confort premium',
      images: [
        '/images/sample-products/ph6.jpg',
        
      ],
      price: 160,
      brand: 'AUDI',
      rating: 5,
      numReviews: 5,
      stock: 5,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Mercedes GLS SUV',
      slug: 'Mercedes GLS SUV',
      category: "4*4",
      description: ' modèles haut de gamme combinant performance tout-terrain et confort premium',
      images: [
        '/images/sample-products/ph8.jpg',
        
      ],
      price: 200,
      brand: 'Mercedes',
      rating: 5,
      numReviews: 18,
      stock: 5,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Mercedes VITO',
      slug: 'Mercedes VITO',
      category: "Fourgonnette familiale",
      description: 'transporter jusqu à 8 passagers avec un confort accru.',
      images: [
        '/images/sample-products/ph7.jpg',
      
      ],
      price: 250,
      brand: 'Mercedes',
      rating: 4.6,
      numReviews: 12,
      stock: 3,
      isFeatured: true,
      banner: null,
    },
  ],
};

export default sampleData;
