import {Component, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Product} from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
