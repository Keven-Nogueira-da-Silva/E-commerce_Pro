import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { OrderService } from '../../../core/services/order.service';
import { OrderResponse } from '../../../core/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDividerModule, MatStepperModule
  ],
  template: `
    <div class="order-detail-page">
      <div class="order-detail-container">
        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="48"></mat-spinner>
        </div>

        <ng-container *ngIf="!loading && order">
          <!-- HEADER -->
          <div class="page-header">
            <a routerLink="/orders" mat-icon-button>
              <mat-icon>arrow_back</mat-icon>
            </a>
            <div>
              <h1>Pedido #{{ order.orderNumber || order.id }}</h1>
              <span class="order-date">Realizado em {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="order-status" [class]="'status-' + order.status.toLowerCase()">
              <mat-icon>{{ getStatusIcon(order.status) }}</mat-icon>
              {{ getStatusLabel(order.status) }}
            </div>
          </div>

          <!-- TRACKING -->
          <mat-card class="tracking-card">
            <mat-card-header>
              <mat-card-title><mat-icon>local_shipping</mat-icon> Acompanhamento</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="tracking-steps">
                <div class="tracking-step" *ngFor="let step of trackingSteps" [class.done]="isStepDone(step.status)" [class.current]="order.status === step.status">
                  <div class="step-icon">
                    <mat-icon>{{ step.icon }}</mat-icon>
                  </div>
                  <div class="step-info">
                    <span class="step-label">{{ step.label }}</span>
                  </div>
                  <div class="step-line" *ngIf="step !== trackingSteps[trackingSteps.length - 1]"></div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <div class="detail-grid">
            <!-- ITEMS -->
            <mat-card class="items-card">
              <mat-card-header>
                <mat-card-title><mat-icon>inventory_2</mat-icon> Itens do Pedido</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="order-item" *ngFor="let item of order.items">
                  <div class="item-image">
                    <img [src]="'https://via.placeholder.com/60x60/e3f2fd/1565c0?text=' + item.productName" [alt]="item.productName">
                  </div>
                  <div class="item-info">
                    <span class="item-name">{{ item.productName }}</span>
                    <span class="item-qty">Qtd: {{ item.quantity }}</span>
                  </div>
                  <div class="item-price">
                    <span class="unit-price">{{ item.unitPrice | currency:'BRL':'symbol':'1.2-2' }} / un.</span>
                    <span class="subtotal">{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
                <mat-divider></mat-divider>
                <div class="order-total-row">
                  <strong>Total do Pedido</strong>
                  <strong class="total-value">{{ order.totalAmount | currency:'BRL':'symbol':'1.2-2' }}</strong>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- DETAILS -->
            <div class="side-cards">
              <!-- SHIPPING -->
              <mat-card class="detail-card">
                <mat-card-header>
                  <mat-card-title><mat-icon>location_on</mat-icon> Entrega</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p class="address">{{ order.shippingAddress }}</p>
                </mat-card-content>
              </mat-card>

              <!-- PAYMENT -->
              <mat-card class="detail-card" *ngIf="order.payment">
                <mat-card-header>
                  <mat-card-title><mat-icon>payment</mat-icon> Pagamento</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="payment-info">
                    <div class="info-row">
                      <span>Método</span>
                      <span>{{ order.payment.method }}</span>
                    </div>
                    <div class="info-row">
                      <span>Status</span>
                      <span class="payment-status" [class]="'pay-' + order.payment.status.toLowerCase()">
                        {{ getPaymentStatusLabel(order.payment.status) }}
                      </span>
                    </div>
                    <div class="info-row" *ngIf="order.payment.transactionId">
                      <span>Transação</span>
                      <span class="transaction-id">{{ order.payment.transactionId }}</span>
                    </div>
                    <div class="info-row">
                      <span>Valor</span>
                      <strong>{{ order.payment.amount | currency:'BRL':'symbol':'1.2-2' }}</strong>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .order-detail-page { min-height: 100vh; background: #f5f5f5; padding: 24px 16px; }
    .order-detail-container { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
    .loading-center { display: flex; justify-content: center; padding: 64px; }
    .page-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .page-header h1 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 2px; }
    .order-date { font-size: 0.85rem; color: #777; }
    .order-status { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-left: auto; }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-processing { background: #e3f2fd; color: #1565c0; }
    .status-shipped { background: #f3e5f5; color: #6a1b9a; }
    .status-delivered { background: #e8f5e9; color: #1b5e20; }
    .status-cancelled { background: #ffebee; color: #c62828; }
    .tracking-card mat-card-title { display: flex; align-items: center; gap: 8px; }
    .tracking-steps { display: flex; align-items: flex-start; gap: 0; overflow-x: auto; padding: 16px 0; }
    .tracking-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; min-width: 80px; }
    .step-icon { width: 44px; height: 44px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; z-index: 1; }
    .tracking-step.done .step-icon { background: #1565c0; color: white; }
    .tracking-step.current .step-icon { background: #42a5f5; color: white; box-shadow: 0 0 0 4px rgba(66,165,245,0.3); }
    .step-icon mat-icon { color: #999; font-size: 22px; width: 22px; height: 22px; }
    .tracking-step.done .step-icon mat-icon, .tracking-step.current .step-icon mat-icon { color: white; }
    .step-label { font-size: 0.75rem; text-align: center; color: #777; }
    .tracking-step.done .step-label, .tracking-step.current .step-label { color: #1565c0; font-weight: 600; }
    .step-line { position: absolute; top: 22px; left: 50%; width: 100%; height: 2px; background: #e0e0e0; z-index: 0; }
    .tracking-step.done .step-line { background: #1565c0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
    .order-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
    .item-image { width: 60px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0; }
    .item-image img { width: 100%; height: 100%; object-fit: cover; }
    .item-info { flex: 1; }
    .item-name { display: block; font-weight: 600; color: #1a1a2e; }
    .item-qty { font-size: 0.85rem; color: #777; }
    .item-price { text-align: right; }
    .unit-price { display: block; font-size: 0.8rem; color: #999; }
    .subtotal { font-size: 1rem; font-weight: 700; color: #1565c0; }
    .order-total-row { display: flex; justify-content: space-between; padding: 12px 0 0; font-size: 1.1rem; }
    .total-value { color: #1565c0; font-size: 1.3rem; }
    .side-cards { display: flex; flex-direction: column; gap: 16px; }
    .detail-card mat-card-title { display: flex; align-items: center; gap: 8px; font-size: 1rem !important; }
    .address { color: #555; line-height: 1.5; margin: 0; }
    .payment-info { display: flex; flex-direction: column; gap: 10px; }
    .info-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
    .info-row span:first-child { color: #777; }
    .payment-status { padding: 2px 8px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; }
    .pay-completed { background: #e8f5e9; color: #2e7d32; }
    .pay-pending { background: #fff3e0; color: #e65100; }
    .pay-failed { background: #ffebee; color: #c62828; }
    .pay-refunded { background: #f3e5f5; color: #6a1b9a; }
    .transaction-id { font-size: 0.75rem; color: #999; font-family: monospace; }
    @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: OrderResponse | null = null;
  loading = false;

  trackingSteps = [
    { status: 'PENDING', label: 'Pendente', icon: 'hourglass_empty' },
    { status: 'CONFIRMED', label: 'Confirmado', icon: 'check_circle' },
    { status: 'PROCESSING', label: 'Processando', icon: 'autorenew' },
    { status: 'SHIPPED', label: 'Enviado', icon: 'local_shipping' },
    { status: 'DELIVERED', label: 'Entregue', icon: 'done_all' },
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => { this.order = order; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  isStepDone(status: string): boolean {
    if (!this.order) return false;
    const order = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return order.indexOf(this.order.status) >= order.indexOf(status);
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

  getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', PROCESSING: 'Processando', COMPLETED: 'Concluído',
      FAILED: 'Falhou', REFUNDED: 'Reembolsado'
    };
    return labels[status] || status;
  }
}
