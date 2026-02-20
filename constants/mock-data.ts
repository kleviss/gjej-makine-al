export interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  transmission: string;
  fuelType: string;
  engineSize: string;
  power: string;
  description: string;
  features: string[];
  imageUrl: string;
  images: string[];
  seller: {
    name: string;
    phone: string;
    rating: number;
  };
}

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    title: 'Mercedes-Benz C-Class 2020',
    price: 35000,
    year: 2020,
    mileage: 45000,
    location: 'Tirana',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineSize: '2.0L',
    power: '194 hp',
    description:
      'Beautiful Mercedes-Benz C-Class in excellent condition. Full service history, one owner from new. Features include leather seats, panoramic roof, and the latest MBUX infotainment system.',
    features: [
      'Leather seats',
      'Panoramic roof',
      'Navigation',
      'Bluetooth',
      'Parking sensors',
      'LED headlights',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
    seller: {
      name: 'John Doe',
      phone: '+355 69 123 4567',
      rating: 4.8,
    },
  },
  {
    id: '2',
    title: 'BMW 3 Series 2019',
    price: 32000,
    year: 2019,
    mileage: 55000,
    location: 'Durres',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '2.0L',
    power: '184 hp',
    description:
      'Stunning BMW 3 Series with full BMW service history. Features include premium sound system, sport package, and advanced driver assistance systems.',
    features: [
      'Sport Package',
      'Premium Sound',
      'LED Lights',
      'Heated Seats',
      'Parking Assist',
      'Apple CarPlay',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800',
    ],
    seller: {
      name: 'Jane Smith',
      phone: '+355 69 987 6543',
      rating: 4.9,
    },
  },
  {
    id: '3',
    title: 'Audi A4 2021',
    price: 38000,
    year: 2021,
    mileage: 25000,
    location: 'Vlore',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engineSize: '2.0L',
    power: '204 hp',
    description:
      'Nearly new Audi A4 with remaining manufacturer warranty. Loaded with technology including virtual cockpit, Bang & Olufsen sound system, and matrix LED headlights.',
    features: [
      'Virtual Cockpit',
      'B&O Sound System',
      'Matrix LED',
      'Quattro AWD',
      'Sport Seats',
      'Wireless Charging',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800'],
    seller: {
      name: 'Alex Brown',
      phone: '+355 69 456 7890',
      rating: 4.7,
    },
  },
  {
    id: '4',
    title: 'Volkswagen Golf 8 2022',
    price: 28000,
    year: 2022,
    mileage: 18000,
    location: 'Shkoder',
    transmission: 'Manual',
    fuelType: 'Petrol',
    engineSize: '1.5L',
    power: '150 hp',
    description: 'Volkswagen Golf 8 in pristine condition with low mileage.',
    features: ['Digital Cockpit', 'ACC', 'Lane Assist', 'LED Lights'],
    imageUrl: 'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
    images: ['https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800'],
    seller: { name: 'Mark L', phone: '+355 69 111 2222', rating: 4.6 },
  },
  {
    id: '5',
    title: 'Toyota RAV4 2021',
    price: 34000,
    year: 2021,
    mileage: 32000,
    location: 'Elbasan',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    engineSize: '2.5L',
    power: '222 hp',
    description: 'Reliable Toyota RAV4 Hybrid with excellent fuel economy.',
    features: ['Hybrid', 'Safety Sense', 'Apple CarPlay', 'Heated Seats'],
    imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800',
    images: ['https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800'],
    seller: { name: 'Sara K', phone: '+355 69 333 4444', rating: 4.9 },
  },
  {
    id: '6',
    title: 'Range Rover Evoque 2020',
    price: 42000,
    year: 2020,
    mileage: 40000,
    location: 'Korce',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    engineSize: '2.0L',
    power: '180 hp',
    description: 'Luxury Range Rover Evoque with premium interior.',
    features: ['Panoramic Roof', 'Meridian Sound', 'Navigation', 'Leather'],
    imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
    images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800'],
    seller: { name: 'Andi M', phone: '+355 69 555 6666', rating: 4.8 },
  },
];

export const MOCK_VEHICLES = MOCK_CARS.map((car) => ({
  id: car.id,
  user_id: 'mock',
  title: car.title,
  make: car.title.split(' ')[0],
  model: car.title.split(' ').slice(1, -1).join(' '),
  year: car.year,
  price: car.price,
  mileage: car.mileage,
  transmission: car.transmission,
  fuel_type: car.fuelType,
  description: car.description,
  features: car.features,
  images: car.images,
  location: car.location,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));
