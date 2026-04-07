import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductResponse } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatChipsModule
  ],
  template: `
    <div class="detail-page">
      <div class="loading-center" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div class="detail-container" *ngIf="!loading && product">
        <!-- BREADCRUMB -->
        <nav class="breadcrumb">
          <a routerLink="/products">Produtos</a>
          <mat-icon>chevron_right</mat-icon>
          <span *ngIf="product.category">
            <a (click)="null">{{ product.category }}</a>
            <mat-icon>chevron_right</mat-icon>
          </span>
          <span class="current">{{ product.name }}</span>
        </nav>

        <div class="detail-grid">
          <!-- IMAGE -->
          <div class="image-section">
            <div class="main-image-wrapper">
              <img
                [src]="product.imageUrl || 'https://via.placeholder.com/600x400/e3f2fd/1565c0?text=' + product.name"
                [alt]="product.name"
                class="main-image"
              >
              <div class="out-of-stock-overlay" *ngIf="product.stockQuantity === 0">
                <span>Esgotado</span>
              </div>
            </div>
          </div>

          <!-- INFO -->
          <div class="info-section">
            <div class="product-category" *ngIf="product.category">
              <mat-icon>label</mat-icon>{{ product.category }}
            </div>
            <h1 class="product-title">{{ product.name }}</h1>

            <div class="price-block">
              <span class="price">{{ product.price | currency:'BRL':'symbol':'1.2-2' }}</span>
              <span class="installments" *ngIf="product.price > 100">
                ou 12x de {{ product.price / 12 | currency:'BRL':'symbol':'1.2-2' }}
              </span>
            </div>

            <mat-divider></mat-divider>

            <div class="stock-info">
              <mat-icon [class.in-stock]="product.stockQuantity > 0" [class.out-stock]="product.stockQuantity === 0">
                {{ product.stockQuantity > 0 ? 'check_circle' : 'cancel' }}
              </mat-icon>
              <span [class.in-stock]="product.stockQuantity > 0" [class.out-stock]="product.stockQuantity === 0">
                {{ product.stockQuantity > 0 ? product.stockQuantity + ' em estoque' : 'Produto esgotado' }}
              </span>
            </div>

            <div class="description" *ngIf="product.description">
              <h3>Descrição</h3>
              <p>{{ product.description }}</p>
            </div>

            <!-- QUANTITY -->
            <div class="quantity-selector" *ngIf="product.stockQuantity > 0">
              <span>Quantidade:</span>
              <div class="qty-controls">
                <button mat-icon-button (click)="decreaseQty()" [disabled]="quantity <= 1">
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="qty-value">{{ quantity }}</span>
                <button mat-icon-button (click)="increaseQty()" [disabled]="quantity >= product.stockQuantity">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="action-buttons">
              <button
                mat-flat-button color="primary"
                class="add-cart-btn"
                [disabled]="product.stockQuantity === 0 || addingToCart"
                (click)="addToCart()"
              >
                <mat-icon>add_shopping_cart</mat-icon>
                {{ addingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho' }}
              </button>
              <a routerLink="/cart" mat-stroked-button color="primary" class="view-cart-btn">
                <mat-icon>shopping_cart</mat-icon>
                Ver Carrinho
              </a>
            </div>

            <!-- FEATURES -->
            <div class="features-grid">
              <div class="feature">
                <mat-icon>local_shipping</mat-icon>
                <span>Frete Grátis acima de R$ 200</span>
              </div>
              <div class="feature">
                <mat-icon>security</mat-icon>
                <span>Compra 100% Segura</span>
              </div>
              <div class="feature">
                <mat-icon>replay</mat-icon>
                <span>Devolução em 30 dias</span>
              </div>
              <div class="feature">
                <mat-icon>support_agent</mat-icon>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { min-height: 100vh; background: #f5f5f5; }
    .loading-center { display: flex; justify-content: center; align-items: center; height: 400px; }
    .detail-container { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    .breadcrumb { display: flex; align-items: center; gap: 4px; margin-bottom: 24px; font-size: 0.9rem; color: #666; }
    .breadcrumb a { color: #1565c0; text-decoration: none; cursor: pointer; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .breadcrumb .current { color: #333; font-weight: 500; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .image-section {}
    .main-image-wrapper { position: relative; border-radius: 12px; overflow: hidden; background: #f5f5f5; }
    .main-image { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
    .out-of-stock-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .out-of-stock-overlay span { background: #ef5350; color: white; padding: 8px 24px; border-radius: 8px; font-size: 1.2rem; font-weight: 700; }
    .product-category { display: flex; align-items: center; gap: 6px; color: #1565c0; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; }
    .product-category mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .product-title { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin: 0 0 20px; line-height: 1.2; }
    .price-block { margin-bottom: 20px; }
    .price { font-size: 2rem; font-weight: 800; color: #1565c0; }
    .installments { display: block; font-size: 0.9rem; color: #666; margin-top: 4px; }
    .stock-info { display: flex; align-items: center; gap: 8px; margin: 16px 0; font-weight: 500; }
    .in-stock { color: #2e7d32; }
    .out-stock { color: #c62828; }
    .description { margin: 20px 0; }
    .description h3 { font-size: 1rem; font-weight: 700; margin: 0 0 8px; color: #333; }
    .description p { color: #555; line-height: 1.6; margin: 0; }
    .quantity-selector { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
    .qty-controls { display: flex; align-items: center; gap: 8px; border: 2px solid #e0e0e0; border-radius: 8px; padding: 2px; }
    .qty-value { font-size: 1.1rem; font-weight: 700; min-width: 32px; text-align: center; }
    .action-buttons { display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
    .add-cart-btn { flex: 1; height: 48px; font-size: 1rem; font-weight: 600; border-radius: 8px !important; }
    .view-cart-btn { height: 48px; border-radius: 8px !important; }
    .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
    .feature { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #555; }
    .feature mat-icon { color: #1565c0; font-size: 20px; width: 20px; height: 20px; }
    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; gap: 24px; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponse | null = null;
  loading = false;
  quantity = 1;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (p) => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  decreaseQty(): void { if (this.quantity > 1) this.quantity--; }
  increaseQty(): void { if (this.product && this.quantity < this.product.stockQuantity) this.quantity++; }

  addToCart(): void {
    if (!this.authService.isLoggedIn) {
      this.snackBar.open('Faça login para adicionar ao carrinho', 'Fechar', { duration: 3000 });
      return;
    }
    this.addingToCart = true;
    this.cartService.addToCart({ productId: this.product!.id, quantity: this.quantity }).subscribe({
      next: () => {
        this.addingToCart = false;
        this.snackBar.open('Produto adicionado ao carrinho!', 'Ver Carrinho', { duration: 3000 });
      },
      error: (err) => {
        this.addingToCart = false;
        this.snackBar.open(err.error?.message || 'Erro ao adicionar', 'Fechar', { duration: 3000 });
      }
    });
  }
}
