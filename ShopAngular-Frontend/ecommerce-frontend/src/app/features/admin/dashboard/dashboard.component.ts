import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do seu e-commerce</p>
      </div>

      <div class="loading-center" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <ng-container *ngIf="!loading">
        <!-- KPI CARDS -->
        <div class="kpi-grid">
          <mat-card class="kpi-card products">
            <div class="kpi-icon"><mat-icon>inventory_2</mat-icon></div>
            <div class="kpi-info">
              <span class="kpi-value">{{ totalProducts }}</span>
              <span class="kpi-label">Produtos Cadastrados</span>
            </div>
            <a routerLink="/admin/products" mat-icon-button class="kpi-action">
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </mat-card>

          <mat-card class="kpi-card orders">
            <div class="kpi-icon"><mat-icon>receipt_long</mat-icon></div>
            <div class="kpi-info">
              <span class="kpi-value">{{ totalOrders }}</span>
              <span class="kpi-label">Pedidos no Sistema</span>
            </div>
            <a routerLink="/admin/orders" mat-icon-button class="kpi-action">
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </mat-card>

          <mat-card class="kpi-card revenue">
            <div class="kpi-icon"><mat-icon>attach_money</mat-icon></div>
            <div class="kpi-info">
              <span class="kpi-value">{{ totalRevenue | currency:'BRL':'symbol':'1.2-2' }}</span>
              <span class="kpi-label">Receita Total</span>
            </div>
          </mat-card>

          <mat-card class="kpi-card pending">
            <div class="kpi-icon"><mat-icon>hourglass_empty</mat-icon></div>
            <div class="kpi-info">
              <span class="kpi-value">{{ pendingOrders }}</span>
              <span class="kpi-label">Pedidos Pendentes</span>
            </div>
            <a routerLink="/admin/orders" mat-icon-button class="kpi-action">
              <mat-icon>arrow_forward</mat-icon>
            </a>
          </mat-card>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="section-title">Ações Rápidas</div>
        <div class="quick-actions">
          <mat-card class="action-card" routerLink="/admin/products">
            <mat-icon>add_box</mat-icon>
            <span>Adicionar Produto</span>
          </mat-card>
          <mat-card class="action-card" routerLink="/admin/orders">
            <mat-icon>manage_search</mat-icon>
            <span>Gerenciar Pedidos</span>
          </mat-card>
          <mat-card class="action-card" routerLink="/admin/payments">
            <mat-icon>payments</mat-icon>
            <span>Ver Pagamentos</span>
          </mat-card>
          <mat-card class="action-card" routerLink="/products">
            <mat-icon>storefront</mat-icon>
            <span>Ver Loja</span>
          </mat-card>
        </div>

        <!-- RECENT ORDERS -->
        <div class="section-title">Pedidos Recentes</div>
        <mat-card class="recent-orders-card">
          <div class="order-row header-row">
            <span>Pedido</span>
            <span>Data</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          <div class="order-row" *ngFor="let order of recentOrders">
            <span class="order-num">#{{ order.orderNumber || order.id }}</span>
            <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
            <span class="order-total">{{ order.totalAmount | currency:'BRL':'symbol':'1.2-2' }}</span>
            <span class="order-status" [class]="'status-' + order.status.toLowerCase()">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>
          <div class="no-orders" *ngIf="recentOrders.length === 0">
            <mat-icon>receipt_long</mat-icon>
            <span>Nenhum pedido encontrado</span>
          </div>
        </mat-card>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard-page { }
    .dashboard-header { margin-bottom: 28px; }
    .dashboard-header h1 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; }
    .dashboard-header p { color: #ffffff; margin: 0; }
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .kpi-card { border-radius: 12px !important; display: flex; align-items: center; gap: 16px; padding: 20px !important; position: relative; overflow: hidden; }
    .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
    .kpi-card.products::before { background: #1565c0; }
    .kpi-card.orders::before { background: #2e7d32; }
    .kpi-card.revenue::before { background: #e65100; }
    .kpi-card.pending::before { background: #6a1b9a; }
    .kpi-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-card.products .kpi-icon { background: #e3f2fd; }
    .kpi-card.products .kpi-icon mat-icon { color: #1565c0; }
    .kpi-card.orders .kpi-icon { background: #e8f5e9; }
    .kpi-card.orders .kpi-icon mat-icon { color: #2e7d32; }
    .kpi-card.revenue .kpi-icon { background: #fff3e0; }
    .kpi-card.revenue .kpi-icon mat-icon { color: #e65100; }
    .kpi-card.pending .kpi-icon { background: #f3e5f5; }
    .kpi-card.pending .kpi-icon mat-icon { color: #6a1b9a; }
    .kpi-info { flex: 1; }
    .kpi-value { display: block; font-size: 1.6rem; font-weight: 800; color: #1a1a2e; }
    .kpi-label { font-size: 0.8rem; color: #777; }
    .kpi-action { margin-left: auto; }
    .section-title { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin: 0 0 16px; }
    .quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-bottom: 32px; }
    .action-card { border-radius: 12px !important; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px !important; cursor: pointer; transition: all 0.2s; text-align: center; }
    .action-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.12) !important; background: #e3f2fd !important; }
    .action-card mat-icon { font-size: 32px; width: 32px; height: 32px; color: #1565c0; }
    .action-card span { font-size: 0.85rem; font-weight: 600; color: #333; }
    .recent-orders-card { border-radius: 12px !important; overflow: hidden; }
    .order-row { display: grid; grid-template-columns: 2fr 2fr 2fr 2fr; gap: 16px; padding: 12px 16px; align-items: center; border-bottom: 1px solid #f0f0f0; }
    .header-row { background: #f5f5f5; font-weight: 700; font-size: 0.85rem; color: #555; }
    .order-row:last-child { border-bottom: none; }
    .order-num { font-weight: 600; color: #1565c0; }
    .order-date { color: #777; font-size: 0.85rem; }
    .order-total { font-weight: 700; color: #1a1a2e; }
    .order-status { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-align: center; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-processing { background: #e3f2fd; color: #1565c0; }
    .status-shipped { background: #f3e5f5; color: #6a1b9a; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .no-orders { display: flex; align-items: center; gap: 8px; padding: 24px; color: #999; justify-content: center; }
  `]
})
export class DashboardComponent implements OnInit {
  loading = false;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  pendingOrders = 0;
  recentOrders: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      products: this.productService.getAll(0, 1),
      orders: this.orderService.getMyOrders(0, 10)
    }).subscribe({
      next: ({ products, orders }) => {
        this.totalProducts = products.totalElements;
        this.totalOrders = orders.totalElements;
        this.recentOrders = orders.content.slice(0, 5);
        this.totalRevenue = orders.content.reduce((sum, o) => sum + o.totalAmount, 0);
        this.pendingOrders = orders.content.filter(o => o.status === 'PENDING').length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', CONFIRMED: 'Confirmado', PROCESSING: 'Processando',
      SHIPPED: 'Enviado', DELIVERED: 'Entregue', CANCELLED: 'Cancelado'
    };
    return labels[status] || status;
  }
}
