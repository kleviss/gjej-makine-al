export interface Vehicle {
  id: string;
  user_id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  description: string;
  features: string[];
  images: string[];
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
}
