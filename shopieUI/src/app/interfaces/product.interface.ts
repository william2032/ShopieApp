export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isHot?: boolean;
  category: string;
}

export interface Category {
  name: string;
  slug: string;
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  bgColor: string;
}
