import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  newProduct: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    totalStock: 0,
    availableStock: 0,
    reservedStock: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminId: '',
    category: 'laptops' // Default category
  };
  private productsSubscription?: Subscription;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
  }

  loadProducts(): void {
    this.productsSubscription = this.productService.getProducts().subscribe(
      products => {
        this.products = products;
      }
    );
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(
      () => {
        this.loadProducts();
        this.newProduct = { ...this.newProduct, name: '', description: '', price: 0, image: '', totalStock: 0 }; // Reset form
      }
    );
  }

  editProduct(product: Product): void {
    // Navigate to edit page or open edit form
    this.router.navigate(['/admin/edit', product.id], { state: { product } });
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newProduct.image = e.target?.result as string; // Sets the image as a base64 string
      };
      reader.readAsDataURL(file); // Converts the image to base64
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => this.loadProducts()
      );
    }
  }
}
