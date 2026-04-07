import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { OrderService } from '../../../core/services/order.service';
import { OrderResponse } from '../../../core/models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, MatPaginatorModule, MatDividerModule
  ],
  template: `
    <div class="orders-page">
      <div class="orders-container">
        <div class="page-header">
          <h1><mat-icon>receipt_long</mat-icon> Meus Pedidos</h1>
          <a routerLink="/products" mat-stroked-button>
            <mat-icon>add_shopping_cart</mat-icon> Continuar Comprando
          </a>
        </div>

        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="48"></mat-spinner>
        </div>

        <div class="empty-orders" *ngIf="!loading && orders.length === 0">
          <mat-icon>receipt_long</mat-icon>
          <h2>Nenhum pedido encontrado</h2>
          <p>Você ainda não realizou nenhum pedido</p>
          <a routerLink="/products" mat-flat-button color="primary">Explorar Produtos</a>
        </div>

        <div class="orders-list" *ngIf="!loading && orders.length > 0">
          <mat-card class="order-card" *ngFor="let order of orders" [routerLink]="['/orders', order.id]">
            <div class="order-header">
              <div class="order-id">
                <mat-icon>tag</mat-icon>
                <div>
                  <span class="order-number">Pedido #{{ order.orderNumber || order.id }}</span>
                  <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </div>
              <div class="order-status" [class]="'status-' + order.status.toLowerCase()">
                <mat-icon>{{ getStatusIcon(order.status) }}</mat-icon>
                {{ getStatusLabel(order.status) }}
              </div>
            </div>
            <mat-divider></mat-divider>
            <div class="order-items-preview">
              <span *ngFor="let item of order.items.slice(0, 3)" class="item-chip">
                {{ item.productName }} x{{ item.quantity }}
              </span>
              <span *ngIf="order.items.length > 3" class="more-items">
                +{{ order.items.length - 3 }} mais
              </span>
            </div>
            <div class="order-footer">
              <div class="order-info">
                <span class="items-count">{{ order.items.length }} item(s)</span>
                <span class="shipping-addr">
                  <mat-icon>location_on</mat-icon>
                  {{ order.shippingAddress | slice:0:40 }}...
                </span>
              </div>
              <div class="order-total">
                <span class="total-label">Total</span>
                <span class="total-value">{{ order.totalAmount | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
            </div>
          </mat-card>
        </div>

        <mat-paginator
          *ngIf="totalElements > pageSize"
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageIndex]="currentPage"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { min-height: 100vh; background: #f5f5f5; padding: 24px 16px; }
    .orders-container { max-width: 900px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .page-header h1 { display: flex; align-items: center; gap: 8px; font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin: 0; }
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .empty-orders { text-align: center; padding: 80px 24px; background: white; border-radius: 16px; }
    .empty-orders mat-icon { font-size: 80px; width: 80px; height: 80px; color: #bdbdbd; margin-bottom: 16px; }
    .orders-list { display: flex; flex-direction: column; gap: 16px; }
    .order-card { border-radius: 12px !important; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; overflow: hidden; }
    .order-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; }
    .order-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; flex-wrap: wrap; gap: 12px; }
    .order-id { display: flex; align-items: center; gap: 10px; }
    .order-id mat-icon { color: #1565c0; }
    .order-number { display: block; font-weight: 700; font-size: 1rem; color: #1a1a2e; }
    .order-date { font-size: 0.8rem; color: #777; }
    .order-status { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-processing { background: #e3f2fd; color: #1565c0; }
    .status-shipped { background: #f3e5f5; color: #6a1b9a; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .order-items-preview { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 16px; }
    .item-chip { background: #f5f5f5; color: #555; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; }
    .more-items { color: #1565c0; font-size: 0.8rem; font-weight: 600; padding: 4px 8px; }
    .order-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #fafafa; flex-wrap: wrap; gap: 12px; }
    .order-info { display: flex; flex-direction: column; gap: 4px; }
    .items-count { font-size: 0.85rem; color: #777; }
    .shipping-addr { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #999; }
    .shipping-addr mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .order-total { text-align: right; }
    .total-label { display: block; font-size: 0.8rem; color: #777; }
    .total-value { font-size: 1.2rem; font-weight: 800; color: #1565c0; }
  `]
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = false;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.orders = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', CONFIRMED: 'Confirmado', PROCESSING: 'Processando',
      SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      PENDING: 'hourglass_empty', CONFIRMED: 'check_circle', PROCESSING: 'autorenew',
      SHIPPED: 'local_shipping', DELIVERED: 'done_all', CANCELLED: 'cancel'
    };
    return icons[status] || 'info';
  }
}
