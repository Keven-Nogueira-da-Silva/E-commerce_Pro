import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { OrderResponse, OrderStatus } from '../../../core/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatSelectModule, MatPaginatorModule, MatTooltipModule, MatExpansionModule
  ],
  template: `
    <div class="admin-orders">
      <div class="page-header">
        <div>
          <h1>Gerenciar Pedidos</h1>
          <p>{{ totalElements }} pedido(s) no sistema</p>
        </div>
      </div>

      <mat-card class="table-card">
        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div class="empty-state" *ngIf="!loading && orders.length === 0">
          <mat-icon>receipt_long</mat-icon>
          <p>Nenhum pedido encontrado</p>
        </div>

        <mat-accordion *ngIf="!loading && orders.length > 0">
          <mat-expansion-panel *ngFor="let order of orders" class="order-panel">
            <mat-expansion-panel-header>
              <mat-panel-title class="panel-title">
                <mat-icon>tag</mat-icon>
                <strong>#{{ order.orderNumber || order.id }}</strong>
                <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </mat-panel-title>
              <mat-panel-description class="panel-desc">
                <span class="order-status" [class]="'status-' + order.status.toLowerCase()">
                  {{ getStatusLabel(order.status) }}
                </span>
                <strong class="order-total">{{ order.totalAmount | currency:'BRL':'symbol':'1.2-2' }}</strong>
              </mat-panel-description>
            </mat-expansion-panel-header>

            <div class="order-detail">
              <!-- ITEMS -->
              <div class="detail-section">
                <h4><mat-icon>inventory_2</mat-icon> Itens</h4>
                <div class="item-row" *ngFor="let item of order.items">
                  <span class="item-name">{{ item.productName }}</span>
                  <span class="item-qty">x{{ item.quantity }}</span>
                  <span class="item-price">{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
              </div>

              <!-- SHIPPING -->
              <div class="detail-section">
                <h4><mat-icon>location_on</mat-icon> Entrega</h4>
                <p>{{ order.shippingAddress }}</p>
              </div>

              <!-- PAYMENT -->
              <div class="detail-section" *ngIf="order.payment">
                <h4><mat-icon>payment</mat-icon> Pagamento</h4>
                <div class="payment-row">
                  <span>Método: <strong>{{ order.payment.method }}</strong></span>
                  <span>Status: <span class="payment-status" [class]="'pay-' + order.payment.status.toLowerCase()">{{ getPaymentLabel(order.payment.status) }}</span></span>
                  <span>Valor: <strong>{{ order.payment.amount | currency:'BRL':'symbol':'1.2-2' }}</strong></span>
                </div>
              </div>

              <!-- STATUS UPDATE -->
              <div class="status-update">
                <h4><mat-icon>update</mat-icon> Atualizar Status</h4>
                <div class="status-actions">
                  <mat-select [(ngModel)]="selectedStatus[order.id]" placeholder="Novo status">
                    <mat-option value="PENDING">Pendente</mat-option>
                    <mat-option value="CONFIRMED">Confirmado</mat-option>
                    <mat-option value="PROCESSING">Processando</mat-option>
                    <mat-option value="SHIPPED">Enviado</mat-option>
                    <mat-option value="DELIVERED">Entregue</mat-option>
                    <mat-option value="CANCELLED">Cancelado</mat-option>
                  </mat-select>
                  <button mat-flat-button color="primary"
                    [disabled]="!selectedStatus[order.id] || updatingOrder === order.id"
                    (click)="updateStatus(order)">
                    <mat-spinner diameter="18" *ngIf="updatingOrder === order.id"></mat-spinner>
                    <span *ngIf="updatingOrder !== order.id">Atualizar</span>
                  </button>
                </div>
              </div>
            </div>
          </mat-expansion-panel>
        </mat-accordion>

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageIndex]="currentPage"
          [pageSizeOptions]="[10, 25, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-orders { }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .page-header h1 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; }
    .page-header p { color: #777; margin: 0; font-size: 0.9rem; }
    .table-card { border-radius: 12px !important; overflow: hidden; }
    .loading-center { display: flex; justify-content: center; padding: 40px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px; color: #999; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .order-panel { margin-bottom: 4px !important; }
    .panel-title { display: flex; align-items: center; gap: 8px; }
    .panel-title mat-icon { color: #1565c0; font-size: 18px; width: 18px; height: 18px; }
    .order-date { font-size: 0.8rem; color: #777; margin-left: 8px; }
    .panel-desc { display: flex; align-items: center; gap: 16px; justify-content: flex-end; }
    .order-status { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-processing { background: #e3f2fd; color: #1565c0; }
    .status-shipped { background: #f3e5f5; color: #6a1b9a; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .order-total { color: #1565c0; font-size: 1rem; }
    .order-detail { padding: 16px 0; display: flex; flex-direction: column; gap: 20px; }
    .detail-section h4 { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 700; color: #333; margin: 0 0 10px; }
    .detail-section h4 mat-icon { font-size: 18px; width: 18px; height: 18px; color: #1565c0; }
    .item-row { display: flex; gap: 16px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    .item-name { flex: 1; }
    .item-qty { color: #777; }
    .item-price { font-weight: 700; color: #1565c0; }
    .detail-section p { margin: 0; color: #555; font-size: 0.9rem; }
    .payment-row { display: flex; gap: 24px; flex-wrap: wrap; font-size: 0.9rem; color: #555; }
    .payment-status { padding: 2px 8px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; }
    .pay-completed { background: #e8f5e9; color: #2e7d32; }
    .pay-pending { background: #fff3e0; color: #e65100; }
    .pay-failed { background: #ffebee; color: #c62828; }
    .pay-refunded { background: #f3e5f5; color: #6a1b9a; }
    .status-update h4 { display: flex; align-items: center; gap: 6px; font-size: 0.9rem; font-weight: 700; color: #333; margin: 0 0 10px; }
    .status-update h4 mat-icon { font-size: 18px; width: 18px; height: 18px; color: #1565c0; }
    .status-actions { display: flex; gap: 12px; align-items: center; }
    .status-actions mat-select { min-width: 200px; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = false;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  selectedStatus: Record<number, OrderStatus> = {};
  updatingOrder: number | null = null;

  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

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

  updateStatus(order: OrderResponse): void {
    const status = this.selectedStatus[order.id];
    if (!status) return;
    this.updatingOrder = order.id;
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx >= 0) this.orders[idx] = updated;
        this.updatingOrder = null;
        delete this.selectedStatus[order.id];
        this.snackBar.open('Status atualizado!', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        this.updatingOrder = null;
        this.snackBar.open(err.error?.message || 'Erro ao atualizar', 'Fechar', { duration: 3000 });
      }
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

  getPaymentLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', PROCESSING: 'Processando', COMPLETED: 'Concluído',
      FAILED: 'Falhou', REFUNDED: 'Reembolsado'
    };
    return labels[status] || status;
  }
}
