import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartService } from '../../core/services/cart.service';
import { CartResponse, CartItemResponse } from '../../core/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatDialogModule
  ],
  template: `
    <div class="cart-page">
      <div class="cart-container">
        <div class="page-header">
          <h1><mat-icon>shopping_cart</mat-icon> Meu Carrinho</h1>
          <span class="item-count" *ngIf="cart">{{ cart.totalItems }} item(s)</span>
        </div>

        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="48"></mat-spinner>
        </div>

        <!-- EMPTY CART -->
        <div class="empty-cart" *ngIf="!loading && (!cart || cart.items.length === 0)">
          <mat-icon>shopping_cart_checkout</mat-icon>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos para continuar comprando</p>
          <a routerLink="/products" mat-flat-button color="primary" class="shop-btn">
            <mat-icon>storefront</mat-icon> Explorar Produtos
          </a>
        </div>

        <!-- CART CONTENT -->
        <div class="cart-layout" *ngIf="!loading && cart && cart.items.length > 0">
          <!-- ITEMS -->
          <div class="cart-items">
            <mat-card class="cart-item-card" *ngFor="let item of cart.items">
              <div class="item-image">
                <img
                  [src]="'https://via.placeholder.com/80x80/e3f2fd/1565c0?text=' + item.productName"
                  [alt]="item.productName"
                >
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.productName }}</h3>
                <p class="item-price">{{ item.unitPrice | currency:'BRL':'symbol':'1.2-2' }} / unidade</p>
              </div>
              <div class="item-controls">
                <div class="qty-controls">
                  <button mat-icon-button (click)="updateQuantity(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button mat-icon-button (click)="updateQuantity(item, item.quantity + 1)">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
                <span class="item-subtotal">{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</span>
                <button mat-icon-button color="warn" (click)="removeItem(item)" class="remove-btn">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </mat-card>

            <div class="cart-actions">
              <button mat-stroked-button color="warn" (click)="clearCart()">
                <mat-icon>delete_sweep</mat-icon> Limpar Carrinho
              </button>
              <a routerLink="/products" mat-stroked-button>
                <mat-icon>arrow_back</mat-icon> Continuar Comprando
              </a>
            </div>
          </div>

          <!-- SUMMARY -->
          <div class="cart-summary">
            <mat-card class="summary-card">
              <mat-card-header>
                <mat-card-title>Resumo do Pedido</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="summary-row" *ngFor="let item of cart.items">
                  <span class="summary-item-name">{{ item.productName }} x{{ item.quantity }}</span>
                  <span>{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="summary-row shipping">
                  <span>Frete</span>
                  <span class="free-shipping" *ngIf="cart.totalAmount >= 200">Grátis</span>
                  <span *ngIf="cart.totalAmount < 200">{{ 15 | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="summary-row total">
                  <span>Total</span>
                  <span class="total-value">{{ getFinalTotal() | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
                <div class="free-shipping-bar" *ngIf="cart.totalAmount < 200">
                  <mat-icon>local_shipping</mat-icon>
                  <span>Faltam {{ 200 - cart.totalAmount | currency:'BRL':'symbol':'1.2-2' }} para frete grátis!</span>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <a routerLink="/checkout" mat-flat-button color="primary" class="checkout-btn">
                  <mat-icon>payment</mat-icon> Finalizar Compra
                </a>
              </mat-card-actions>
            </mat-card>

            <!-- SECURITY BADGES -->
            <div class="security-badges">
              <div class="badge">
                <mat-icon>lock</mat-icon>
                <span>Pagamento Seguro</span>
              </div>
              <div class="badge">
                <mat-icon>verified_user</mat-icon>
                <span>Dados Protegidos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { min-height: 100vh; background: #f5f5f5; padding: 24px 16px; }
    .cart-container { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .page-header h1 { display: flex; align-items: center; gap: 8px; font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin: 0; }
    .item-count { background: #1565c0; color: white; padding: 4px 12px; border-radius: 16px; font-size: 0.85rem; font-weight: 600; }
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .empty-cart { text-align: center; padding: 80px 24px; background: white; border-radius: 16px; }
    .empty-cart mat-icon { font-size: 80px; width: 80px; height: 80px; color: #bdbdbd; margin-bottom: 16px; }
    .empty-cart h2 { font-size: 1.5rem; color: #333; margin: 0 0 8px; }
    .empty-cart p { color: #777; margin: 0 0 24px; }
    .shop-btn { height: 48px; font-size: 1rem; border-radius: 8px !important; }
    .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: start; }
    .cart-items { display: flex; flex-direction: column; gap: 12px; }
    .cart-item-card { border-radius: 12px !important; padding: 16px !important; display: flex; align-items: center; gap: 16px; }
    .item-image { width: 80px; height: 80px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .item-info { flex: 1; }
    .item-name { font-size: 1rem; font-weight: 600; margin: 0 0 4px; color: #1a1a2e; }
    .item-price { font-size: 0.85rem; color: #777; margin: 0; }
    .item-controls { display: flex; align-items: center; gap: 16px; }
    .qty-controls { display: flex; align-items: center; gap: 4px; border: 2px solid #e0e0e0; border-radius: 8px; padding: 2px; }
    .qty-value { font-size: 1rem; font-weight: 700; min-width: 28px; text-align: center; }
    .item-subtotal { font-size: 1.1rem; font-weight: 700; color: #1565c0; min-width: 100px; text-align: right; }
    .remove-btn { color: #ef5350 !important; }
    .cart-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .summary-card { border-radius: 12px !important; }
    .summary-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 0.9rem; color: #555; }
    .summary-row.shipping { color: #333; }
    .summary-row.total { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
    .free-shipping { color: #2e7d32; font-weight: 600; }
    .total-value { color: #1565c0; font-size: 1.3rem; }
    .free-shipping-bar { display: flex; align-items: center; gap: 8px; background: #e8f5e9; color: #2e7d32; padding: 10px 12px; border-radius: 8px; font-size: 0.85rem; margin-top: 12px; }
    .checkout-btn { width: 100%; height: 52px; font-size: 1.05rem; font-weight: 700; border-radius: 8px !important; }
    .security-badges { display: flex; gap: 16px; margin-top: 12px; justify-content: center; }
    .badge { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #666; }
    .badge mat-icon { font-size: 18px; width: 18px; height: 18px; color: #2e7d32; }
    @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
    @media (max-width: 600px) { .cart-item-card { flex-wrap: wrap; } .item-controls { width: 100%; justify-content: space-between; } }
  `]
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  loading = false;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => { this.cart = cart; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  updateQuantity(item: CartItemResponse, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateItem(Number(item.id), quantity).subscribe({
      next: (cart) => { this.cart = cart; },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao atualizar', 'Fechar', { duration: 3000 })
    });
  }

  removeItem(item: CartItemResponse): void {
    this.cartService.removeItem(Number(item.id)).subscribe({
      next: () => this.loadCart(),
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao remover', 'Fechar', { duration: 3000 })
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => { this.cart = null; this.snackBar.open('Carrinho limpo!', 'Fechar', { duration: 2000 }); },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao limpar', 'Fechar', { duration: 3000 })
    });
  }

  getFinalTotal(): number {
    if (!this.cart) return 0;
    const shipping = this.cart.totalAmount >= 200 ? 0 : 15;
    return this.cart.totalAmount + shipping;
  }
}
