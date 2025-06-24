import { Injectable } from '@angular/core';
import {Category, Product} from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  getNewProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        originalPrice: 1200,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        rating: 5,
        category: 'laptops',
        isNew: true
      },
      {
        id: 2,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        originalPrice: 1100,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
        rating: 5,
        category: 'accessories',
        isHot: true
      },
      {
        id: 3,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        originalPrice: 1150,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        rating: 4,
        category: 'laptops'
      },
      {
        id: 4,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        originalPrice: 1050,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
        rating: 5,
        category: 'tablets'
      }
    ];
  }

  getTopSellingProducts(): Product[] {
    return [
      {
        id: 5,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        originalPrice: 1200,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        rating: 5,
        category: 'laptops',
        isHot: true
      },
      {
        id: 6,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
        rating: 4,
        category: 'smartphones',
        isHot: true
      },
      {
        id: 7,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
        rating: 5,
        category: 'laptops'
      },
      {
        id: 8,
        name: 'PRODUCT NAME GOES HERE',
        price: 980,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
        rating: 4,
        category: 'cameras'
      }
    ];
  }

  getCategories(): Category[] {
    return [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Cameras', slug: 'cameras' },
      { name: 'Accessories', slug: 'accessories' }
    ];
  }
}
