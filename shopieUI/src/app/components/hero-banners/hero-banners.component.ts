import { Component } from '@angular/core';
import {NgClass, NgForOf, NgOptimizedImage} from '@angular/common';
import {HeroBanner} from '../../interfaces/product.interface';

@Component({
  selector: 'app-hero-banners',
  imports: [
    NgForOf,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './hero-banners.component.html',
  styleUrl: './hero-banners.component.scss'
})
export class HeroBannersComponent {
  banners: HeroBanner[] = [
    {
      title: 'Laptop Collection',
      subtitle: 'SHOP NOW',
      buttonText: 'SHOP NOW',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    {
      title: 'Accessories Collection',
      subtitle: 'SHOP NOW',
      buttonText: 'SHOP NOW',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=150&fit=crop',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    {
      title: 'Cameras Collection',
      subtitle: 'SHOP NOW',
      buttonText: 'SHOP NOW',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=150&fit=crop',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600'
    }
  ];
}
