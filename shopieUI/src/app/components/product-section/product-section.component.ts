import {Component, Input} from '@angular/core';
import {Category, Product} from '../../interfaces/product.interface';
import {ProductCardComponent} from '../product-card/product-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product-section',
  imports: [
    ProductCardComponent,
    NgForOf
  ],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.scss'
})
export class ProductSectionComponent {
  @Input() title!: string;
  @Input() products!: Product[];
  @Input() categories!: Category[];

  selectedCategory = 'all';

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(product =>
      product.category.toLowerCase() === this.selectedCategory
    );
  }
}
