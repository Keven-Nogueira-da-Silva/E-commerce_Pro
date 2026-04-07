import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductResponse } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatChipsModule,
    MatProgressSpinnerModule, MatPaginatorModule, MatSnackBarModule, MatBadgeModule
  ],
  template: `
    <div class="product-list-page">
      <!-- HERO BANNER -->
      <div class="hero-banner">
        <div class="hero-content">
          <h1>Descubra Produtos Incríveis</h1>
          <p>Encontre o que você precisa com a melhor qualidade e preço</p>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar produtos...</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Ex: camiseta, notebook...">
            <mat-icon matPrefix>search</mat-icon>
            <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>
        </div>
      </div>

      <div class="page-body">
        <!-- CATEGORIES -->
        <div class="categories-bar">
          <span class="cat-label">Categorias:</span>
          <div class="cat-chips">
            <button
              *ngFor="let cat of categories"
              [class.active]="selectedCategory === cat.value"
              (click)="filterByCategory(cat.value)"
              class="cat-chip"
            >
              <mat-icon>{{ cat.icon }}</mat-icon>
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- RESULTS INFO -->
        <div class="results-info" *ngIf="!loading">
          <span>{{ totalElements }} produto(s) encontrado(s)</span>
          <span *ngIf="selectedCategory" class="filter-tag">
            Categoria: {{ selectedCategory }}
            <button mat-icon-button (click)="filterByCategory(null)"><mat-icon>close</mat-icon></button>
          </span>
        </div>

        <!-- LOADING -->
        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Carregando produtos...</p>
        </div>

        <!-- PRODUCT GRID -->
        <div class="product-grid" *ngIf="!loading">
          <mat-card class="product-card" *ngFor="let product of products" [routerLink]="['/products', product.id]">
            <div class="product-image-wrapper">
              <img
                [src]="product.imageUrl || 'https://via.placeholder.com/300x200/e3f2fd/1565c0?text=' + product.name"
                [alt]="product.name"
                class="product-image"
              >
              <div class="product-badge" *ngIf="product.stockQuantity === 0">Esgotado</div>
              <div class="product-badge in-stock" *ngIf="product.stockQuantity > 0 && product.stockQuantity <= 5">
                Últimas {{ product.stockQuantity }} unid.
              </div>
            </div>
            <mat-card-content class="product-info">
              <div class="product-category" *ngIf="product.category">
                <mat-icon>label</mat-icon>{{ product.category }}
              </div>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description | slice:0:80 }}{{ product.description && product.description.length > 80 ? '...' : '' }}</p>
              <div class="product-footer">
                <span class="product-price">{{ product.price | currency:'BRL':'symbol':'1.2-2' }}</span>
                <button
                  mat-flat-button
                  color="primary"
                  class="add-cart-btn"
                  (click)="addToCart($event, product)"
                  [disabled]="product.stockQuantity === 0"
                >
                  <mat-icon>add_shopping_cart</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- EMPTY STATE -->
          <div class="empty-state" *ngIf="products.length === 0">
            <mat-icon>search_off</mat-icon>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente ajustar sua busca ou filtros</p>
            <button mat-flat-button color="primary" (click)="resetFilters()">Ver todos os produtos</button>
          </div>
        </div>

        <!-- PAGINATOR -->
        <mat-paginator
          *ngIf="totalElements > pageSize"
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageIndex]="currentPage"
          [pageSizeOptions]="[12, 24, 48]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .product-list-page { min-height: 100vh; }
    .hero-banner {
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 60%, #1a1a2e 100%);
      padding: 64px 24px; text-align: center; color: white;
    }
    .hero-content { max-width: 600px; margin: 0 auto; }
    .hero-content h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 12px; }
    .hero-content p { font-size: 1.1rem; opacity: 0.85; margin: 0 0 32px; }
    .search-field { width: 100%; max-width: 500px; }
    ::ng-deep .search-field .mat-mdc-form-field-flex { background: white !important; border-radius: 12px !important; }
    ::ng-deep .search-field .mat-mdc-text-field-wrapper { background: white !important; border-radius: 12px !important; }
    .page-body { max-width: 1280px; margin: 0 auto; padding: 24px 16px; }
    .categories-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .cat-label { font-weight: 600; color: #555; white-space: nowrap; }
    .cat-chips { display: flex; gap: 8px; flex-wrap: wrap; }
    .cat-chip {
      display: flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 20px;
      border: 2px solid #e0e0e0; background: white; cursor: pointer; font-size: 0.9rem;
      transition: all 0.2s; color: #555;
    }
    .cat-chip mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .cat-chip:hover { border-color: #1565c0; color: #1565c0; }
    .cat-chip.active { background: #1565c0; color: white; border-color: #1565c0; }
    .results-info { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: #666; font-size: 0.9rem; }
    .filter-tag { display: flex; align-items: center; background: #e3f2fd; color: #1565c0; border-radius: 16px; padding: 2px 8px; }
    .loading-center { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px; color: #666; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .product-card { border-radius: 12px !important; overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
    .product-image-wrapper { position: relative; height: 200px; overflow: hidden; background: #f5f5f5; }
    .product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .product-card:hover .product-image { transform: scale(1.05); }
    .product-badge { position: absolute; top: 12px; left: 12px; background: #ef5350; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .product-badge.in-stock { background: #ff9800; }
    .product-info { padding: 16px !important; }
    .product-category { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #1565c0; font-weight: 600; text-transform: uppercase; margin-bottom: 6px; }
    .product-category mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .product-name { font-size: 1rem; font-weight: 700; margin: 0 0 6px; color: #1a1a2e; line-height: 1.3; }
    .product-description { font-size: 0.85rem; color: #777; margin: 0 0 12px; line-height: 1.4; min-height: 36px; }
    .product-footer { display: flex; align-items: center; justify-content: space-between; }
    .product-price { font-size: 1.2rem; font-weight: 800; color: #1565c0; }
    .add-cart-btn { min-width: 40px !important; width: 40px; height: 40px; border-radius: 50% !important; padding: 0 !important; }
    .empty-state { grid-column: 1/-1; text-align: center; padding: 64px; color: #999; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 1.3rem; margin: 0 0 8px; }
  `]
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  loading = false;
  totalElements = 0;
  currentPage = 0;
  pageSize = 12;
  selectedCategory: string | null = null;
  searchControl = new FormControl('');

  categories = [
    { value: null, label: 'Todos', icon: 'apps' },
    { value: 'Eletrônicos', label: 'Eletrônicos', icon: 'devices' },
    { value: 'Roupas', label: 'Roupas', icon: 'checkroom' },
    { value: 'Livros', label: 'Livros', icon: 'menu_book' },
    { value: 'Casa', label: 'Casa', icon: 'home' },
    { value: 'Esportes', label: 'Esportes', icon: 'sports_soccer' },
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.currentPage = 0;
      if (value && value.trim()) {
        this.searchProducts(value.trim());
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    const obs = this.selectedCategory
      ? this.productService.getByCategory(this.selectedCategory, this.currentPage, this.pageSize)
      : this.productService.getAll(this.currentPage, this.pageSize);

    obs.subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  searchProducts(name: string): void {
    this.loading = true;
    this.productService.search(name, this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.currentPage = 0;
    this.searchControl.setValue('', { emitEvent: false });
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.searchControl.setValue('');
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  addToCart(event: Event, product: ProductResponse): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Faça login para adicionar ao carrinho', 'Entrar', { duration: 3000 })
        .onAction().subscribe(() => {});
      return;
    }
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => this.snackBar.open(`"${product.name}" adicionado ao carrinho!`, 'Ver Carrinho', { duration: 3000 }),
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao adicionar', 'Fechar', { duration: 3000 })
    });
  }
}
