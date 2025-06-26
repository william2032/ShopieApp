import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
    category: 'laptops'
  };

  // Edit modal properties
  isEditModalOpen = false;
  editingProduct: Product = { ...this.newProduct };
  editingProductId: string = '';

  // Image input type toggles
  newProductImageType: 'upload' | 'url' = 'upload';
  editProductImageType: 'upload' | 'url' = 'upload';

  private productsSubscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
  }

  loadProducts(): void {
    this.productsSubscription = this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Loaded products:', products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Failed to load products: ' + error.message);
      }
    });
  }

  createProduct(): void {
    if (!this.validateProduct(this.newProduct)) {
      return;
    }

    this.productService.createProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        console.log('Product created:', createdProduct);
        this.loadProducts();
        this.resetNewProductForm();
        alert('Product created successfully!');
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Failed to create product: ' + error.message);
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product }; // Create a copy to avoid direct mutation
    this.editingProductId = (product as any).id || (product as any)._id || ''; // Handle different ID field names

    // Determine if the current image is a URL or uploaded file
    this.editProductImageType = this.isImageUrl(product.image) ? 'url' : 'upload';

    this.isEditModalOpen = true;
  }

  updateProduct(): void {
    if (!this.validateProduct(this.editingProduct)) {
      return;
    }

    if (!this.editingProductId) {
      alert('Cannot update product.');
      return;
    }
    const productToUpdate: Partial<Product> = {
      name: this.editingProduct.name,
      description: this.editingProduct.description,
      price: this.editingProduct.price,
      image: this.editingProduct.image,
      totalStock: this.editingProduct.totalStock,
      availableStock: this.editingProduct.availableStock,
      reservedStock: this.editingProduct.reservedStock,
      category: this.editingProduct.category
    };

    this.productService.updateProduct(this.editingProductId, productToUpdate as Product).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.loadProducts();
        this.closeEditModal();
        alert('Product updated successfully!');
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + error.message);
      }
    });
  }

  deleteProduct(product: Product): void {
    const productId = (product as any).id || (product as any)._id;

    if (!productId) {
      alert('Product ID is missing. Cannot delete product.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product: ' + error.message);
        }
      });
    }
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingProduct = { ...this.newProduct };
    this.editingProductId = '';
    this.editProductImageType = 'upload';
  }

  // Image type toggle methods
  toggleNewProductImageType(type: 'upload' | 'url'): void {
    this.newProductImageType = type;
    if (type === 'url') {
      // Clear any uploaded image data when switching to URL
      this.newProduct.image = '';
    }
  }

  toggleEditProductImageType(type: 'upload' | 'url'): void {
    this.editProductImageType = type;
    if (type === 'url') {
      // Keep existing image if it's already a URL, otherwise clear
      if (!this.isImageUrl(this.editingProduct.image)) {
        this.editingProduct.image = '';
      }
    }
  }

  // URL validation and helper methods
  onImageUrlChange(event: Event, isEdit: boolean = false): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const url = target.value;
      if (isEdit) {
        this.editingProduct.image = url;
      } else  {
        this.newProduct.image = url;
      }
    }
  }

  isImageUrl(url: string): boolean {
    return url.startsWith('https://') || url.startsWith('https://') || url.startsWith('data:image/');
  }

  isValidImageUrl(url: string): boolean {
    if (!url.trim()) return false;

    if (url.startsWith('data:image/')) return true;

    // Check if it's a valid HTTP/HTTPS URL
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  onNewProductImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processImageFile(file, (result) => {
        this.newProduct.image = result;
      });
    }
  }

  onEditProductImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processImageFile(file, (result) => {
        this.editingProduct.image = result;
      });
    }
  }

  private processImageFile(file: File, callback: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  private validateProduct(product: Product): boolean {
    if (!product.name.trim()) {
      alert('Product name is required.');
      return false;
    }
    if (!product.description.trim()) {
      alert('Product description is required.');
      return false;
    }
    if (product.price <= 0) {
      alert('Product price must be greater than 0.');
      return false;
    }
    if (product.totalStock < 0) {
      alert('Total stock cannot be negative.');
      return false;
    }
    if (!product.image.trim()) {
      alert('Product image is required.');
      return false;
    }
    if (!this.isValidImageUrl(product.image)) {
      alert('Please provide a valid image URL or upload an image file.');
      return false;
    }
    return true;
  }

  private resetNewProductForm(): void {
    this.newProduct = {
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
      category: 'laptops'
    };
    this.newProductImageType = 'upload';
  }
}
