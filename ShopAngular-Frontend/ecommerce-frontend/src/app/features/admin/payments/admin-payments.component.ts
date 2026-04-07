import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentResponse } from '../../../core/models';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule
  ],
  template: `
    <div class="admin-payments">
      <div class="page-header">
        <div>
          <h1>Gerenciar Pagamentos</h1>
          <p>Consulte e gerencie pagamentos por ID</p>
        </div>
      </div>

      <!-- SEARCH -->
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title><mat-icon>search</mat-icon> Buscar Pagamento</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="searchPayment()" class="search-form">
            <mat-form-field appearance="outline">
              <mat-label>ID do Pagamento</mat-label>
              <input matInput type="number" formControlName="paymentId" placeholder="Ex: 1">
              <mat-icon matPrefix>tag</mat-icon>
              <mat-error *ngIf="searchForm.get('paymentId')?.hasError('required')">ID obrigatório</mat-error>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="searchForm.invalid || searching">
              <mat-spinner diameter="18" *ngIf="searching"></mat-spinner>
              <span *ngIf="!searching"><mat-icon>search</mat-icon> Buscar</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- PAYMENT DETAIL -->
      <mat-card class="payment-detail-card" *ngIf="payment">
        <mat-card-header>
          <div class="payment-header">
            <div class="payment-id">
              <mat-icon>payments</mat-icon>
              <div>
                <span class="payment-title">Pagamento #{{ payment.id }}</span>
                <span class="payment-date" *ngIf="payment.paymentDate">
                  {{ payment.paymentDate | date:'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
            </div>
            <div class="payment-status" [class]="'pay-' + payment.status.toLowerCase()">
              <mat-icon>{{ getStatusIcon(payment.status) }}</mat-icon>
              {{ getStatusLabel(payment.status) }}
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="payment-grid">
            <div class="payment-info-item">
              <span class="info-label">Valor</span>
              <span class="info-value amount">{{ payment.amount | currency:'BRL':'symbol':'1.2-2' }}</span>
            </div>
            <div class="payment-info-item">
              <span class="info-label">Método</span>
              <span class="info-value">{{ getMethodLabel(payment.method) }}</span>
            </div>
            <div class="payment-info-item">
              <span class="info-label">Status</span>
              <span class="info-value">
                <span class="status-badge" [class]="'pay-' + payment.status.toLowerCase()">
                  {{ getStatusLabel(payment.status) }}
                </span>
              </span>
            </div>
            <div class="payment-info-item" *ngIf="payment.transactionId">
              <span class="info-label">ID da Transação</span>
              <span class="info-value transaction-id">{{ payment.transactionId }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- REFUND ACTION -->
          <div class="refund-section" *ngIf="payment.status !== 'REFUNDED' && payment.status !== 'FAILED'">
            <div class="refund-info">
              <mat-icon>replay</mat-icon>
              <div>
                <strong>Solicitar Reembolso</strong>
                <p>Esta ação irá reverter o pagamento e notificar o cliente.</p>
              </div>
            </div>
            <button mat-stroked-button color="warn" (click)="refundPayment()" [disabled]="refunding">
              <mat-spinner diameter="18" *ngIf="refunding"></mat-spinner>
              <span *ngIf="!refunding"><mat-icon>money_off</mat-icon> Reembolsar</span>
            </button>
          </div>

          <div class="refunded-notice" *ngIf="payment.status === 'REFUNDED'">
            <mat-icon>check_circle</mat-icon>
            <span>Este pagamento já foi reembolsado.</span>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- EMPTY STATE -->
      <div class="empty-state" *ngIf="!payment && !searching">
        <mat-icon>payments</mat-icon>
        <h3>Nenhum pagamento selecionado</h3>
        <p>Use o campo acima para buscar um pagamento pelo ID</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-payments { }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; }
    .page-header p { color: #777; margin: 0; font-size: 0.9rem; }
    .search-card { border-radius: 12px !important; margin-bottom: 20px; }
    .search-card mat-card-title { display: flex; align-items: center; gap: 8px; }
    .search-form { display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap; }
    .search-form mat-form-field { flex: 1; min-width: 200px; max-width: 300px; }
    .search-form button { height: 56px; }
    .payment-detail-card { border-radius: 12px !important; margin-bottom: 20px; }
    .payment-header { display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 12px; }
    .payment-id { display: flex; align-items: center; gap: 10px; }
    .payment-id mat-icon { color: #1565c0; font-size: 28px; width: 28px; height: 28px; }
    .payment-title { display: block; font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
    .payment-date { font-size: 0.8rem; color: #777; }
    .payment-status { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .pay-completed { background: #e8f5e9; color: #2e7d32; }
    .pay-pending { background: #fff3e0; color: #e65100; }
    .pay-processing { background: #e3f2fd; color: #1565c0; }
    .pay-failed { background: #ffebee; color: #c62828; }
    .pay-refunded { background: #f3e5f5; color: #6a1b9a; }
    .payment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin: 16px 0; }
    .payment-info-item { }
    .info-label { display: block; font-size: 0.8rem; color: #777; margin-bottom: 4px; }
    .info-value { font-size: 1rem; font-weight: 600; color: #1a1a2e; }
    .info-value.amount { font-size: 1.4rem; color: #1565c0; }
    .status-badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .transaction-id { font-family: monospace; font-size: 0.85rem; color: #555; }
    .refund-section { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; flex-wrap: wrap; gap: 12px; }
    .refund-info { display: flex; align-items: flex-start; gap: 12px; }
    .refund-info mat-icon { color: #e65100; margin-top: 2px; }
    .refund-info strong { display: block; margin-bottom: 4px; }
    .refund-info p { margin: 0; font-size: 0.85rem; color: #777; }
    .refunded-notice { display: flex; align-items: center; gap: 8px; padding: 12px; background: #f3e5f5; border-radius: 8px; color: #6a1b9a; font-weight: 600; margin-top: 16px; }
    .empty-state { text-align: center; padding: 80px 24px; background: white; border-radius: 16px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: #bdbdbd; margin-bottom: 16px; }
    .empty-state h3 { font-size: 1.2rem; color: #333; margin: 0 0 8px; }
    .empty-state p { color: #777; margin: 0; }
  `]
})
export class AdminPaymentsComponent {
  payment: PaymentResponse | null = null;
  searching = false;
  refunding = false;

  searchForm = this.fb.group({
    paymentId: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  searchPayment(): void {
    const id = this.searchForm.get('paymentId')?.value;
    if (!id) return;
    this.searching = true;
    this.payment = null;
    this.paymentService.getPayment(id).subscribe({
      next: (p) => { this.payment = p; this.searching = false; },
      error: (err) => {
        this.searching = false;
        this.snackBar.open(err.error?.message || 'Pagamento não encontrado', 'Fechar', { duration: 3000 });
      }
    });
  }

  refundPayment(): void {
    if (!this.payment) return;
    if (!confirm('Confirmar reembolso deste pagamento?')) return;
    this.refunding = true;
    this.paymentService.refundPayment(this.payment.id).subscribe({
      next: (p) => {
        this.payment = p;
        this.refunding = false;
        this.snackBar.open('Reembolso realizado com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        this.refunding = false;
        this.snackBar.open(err.error?.message || 'Erro ao reembolsar', 'Fechar', { duration: 3000 });
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Pendente', PROCESSING: 'Processando', COMPLETED: 'Concluído',
      FAILED: 'Falhou', REFUNDED: 'Reembolsado'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      PENDING: 'hourglass_empty', PROCESSING: 'autorenew', COMPLETED: 'check_circle',
      FAILED: 'cancel', REFUNDED: 'replay'
    };
    return icons[status] || 'info';
  }

  getMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      CREDIT_CARD: 'Cartão de Crédito', DEBIT_CARD: 'Cartão de Débito',
      PIX: 'PIX', BILLET: 'Boleto Bancário'
    };
    return labels[method] || method;
  }
}
