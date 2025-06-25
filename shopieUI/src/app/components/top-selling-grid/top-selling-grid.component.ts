import { Component } from '@angular/core';
import {Product} from '../../interfaces/product.interface';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-top-selling-grid',
  imports: [
    NgForOf
  ],
  templateUrl: './top-selling-grid.component.html',
  styleUrl: './top-selling-grid.component.scss'
})
export class TopSellingGridComponent {
  leftProducts: Product[] = [
    {
      id: 1,
      name: 'HeadPhones',
      price: 980,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
      rating: 5,
      category: 'smartphones'
    },
    {
      id: 2,
      name: 'Macbook',
      price: 980,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
      rating: 5,
      category: 'laptops'
    },
    {
      id: 3,
      name: 'HeadPhones',
      price: 980,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      rating: 5,
      category: 'accessories'
    }
  ];

  centerProducts: Product[] = [
    {
      id: 4,
      name: 'HeadPhone',
      price: 980,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      rating: 5,
      category: 'accessories'
    },
    {
      id: 5,
      name: 'Mackbook',
      price: 980,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
      rating: 5,
      category: 'laptops'
    },
    {
      id: 6,
      name: 'Camera',
      price: 980,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop',
      rating: 5,
      category: 'cameras'
    }
  ];

  rightProducts: Product[] = [
    {
      id: 7,
      name: 'HeadSet',
      price: 980,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
      rating: 5,
      category: 'smartphones'
    },
    {
      id: 8,
      name: 'HeadSet',
      price: 980,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      rating: 5,
      category: 'accessories'
    },
    {
      id: 9,
      name: 'Mac Book',
      price: 980,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
      rating: 5,
      category: 'laptops'
    }
  ];
}
