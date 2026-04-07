import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartResponse } from '../../core/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatStepperModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatDividerModule, MatRadioModule
  ],
  template: `
    <div class="checkout-page">
      <div class="checkout-container">
        <div class="page-header">
          <a routerLink="/cart" mat-icon-button>
            <mat-icon>arrow_back</mat-icon>
          </a>
          <h1>Finalizar Compra</h1>
        </div>

        <div class="checkout-layout">
          <!-- STEPPER -->
          <div class="checkout-form">
            <mat-stepper [linear]="true" #stepper orientation="vertical">
              <!-- STEP 1: ENDEREÇO -->
              <mat-step [stepControl]="addressForm" label="Endereço de Entrega">
                <form [formGroup]="addressForm">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Endereço completo</mat-label>
                    <textarea matInput formControlName="shippingAddress" rows="3"
                      placeholder="Rua, número, bairro, cidade, estado, CEP"></textarea>
                    <mat-icon matPrefix>location_on</mat-icon>
                    <mat-error *ngIf="addressForm.get('shippingAddress')?.hasError('required')">
                      Endereço obrigatório
                    </mat-error>
                  </mat-form-field>
                  <div class="step-actions">
                    <button mat-flat-button color="primary" matStepperNext [disabled]="addressForm.invalid">
                      Continuar <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
                </form>
              </mat-step>

              <!-- STEP 2: PAGAMENTO -->
              <mat-step [stepControl]="paymentForm" label="Forma de Pagamento">
                <form [formGroup]="paymentForm">
                  <mat-radio-group formControlName="method" class="payment-methods">
                    <mat-card class="payment-option" [class.selected]="paymentForm.get('method')?.value === 'PIX'">
                      <mat-radio-button value="PIX">
                        <div class="payment-label">
                          <mat-icon>qr_code</mat-icon>
                          <div>
                            <strong>PIX</strong>
                            <span>Pagamento instantâneo</span>
                          </div>
                        </div>
                      </mat-radio-button>
                    </mat-card>
                    <mat-card class="payment-option" [class.selected]="paymentForm.get('method')?.value === 'CREDIT_CARD'">
                      <mat-radio-button value="CREDIT_CARD">
                        <div class="payment-label">
                          <mat-icon>credit_card</mat-icon>
                          <div>
                            <strong>Cartão de Crédito</strong>
                            <span>Em até 12x sem juros</span>
                          </div>
                        </div>
                      </mat-radio-button>
                    </mat-card>
                    <mat-card class="payment-option" [class.selected]="paymentForm.get('method')?.value === 'DEBIT_CARD'">
                      <mat-radio-button value="DEBIT_CARD">
                        <div class="payment-label">
                          <mat-icon>payment</mat-icon>
                          <div>
                            <strong>Cartão de Débito</strong>
                            <span>Débito à vista</span>
                          </div>
                        </div>
                      </mat-radio-button>
                    </mat-card>
                    <mat-card class="payment-option" [class.selected]="paymentForm.get('method')?.value === 'BILLET'">
                      <mat-radio-button value="BILLET">
                        <div class="payment-label">
                          <mat-icon>receipt</mat-icon>
                          <div>
                            <strong>Boleto Bancário</strong>
                            <span>Vence em 3 dias úteis</span>
                          </div>
                        </div>
                      </mat-radio-button>
                    </mat-card>
                  </mat-radio-group>

                  <!-- CARD FIELDS -->
                  <div class="card-fields" *ngIf="paymentForm.get('method')?.value === 'CREDIT_CARD' || paymentForm.get('method')?.value === 'DEBIT_CARD'">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nome no Cartão</mat-label>
                      <input matInput formControlName="cardHolderName" placeholder="NOME SOBRENOME">
                      <mat-icon matPrefix>person</mat-icon>
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Número do Cartão</mat-label>
                      <input matInput formControlName="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19">
                      <mat-icon matPrefix>credit_card</mat-icon>
                    </mat-form-field>
                    <div class="card-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Validade</mat-label>
                        <input matInput formControlName="expiryDate" placeholder="MM/AA" maxlength="5">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>CVV</mat-label>
                        <input matInput formControlName="cvv" placeholder="000" maxlength="4" type="password">
                      </mat-form-field>
                    </div>
                  </div>

                  <div class="step-actions">
                    <button mat-stroked-button matStepperPrevious>Voltar</button>
                    <button mat-flat-button color="primary" matStepperNext [disabled]="paymentForm.invalid">
                      Revisar Pedido <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
                </form>
              </mat-step>

              <!-- STEP 3: REVISÃO -->
              <mat-step label="Confirmar Pedido">
                <div class="review-section">
                  <div class="review-item">
                    <mat-icon>location_on</mat-icon>
                    <div>
                      <strong>Endereço de Entrega</strong>
                      <p>{{ addressForm.get('shippingAddress')?.value }}</p>
                    </div>
                  </div>
                  <div class="review-item">
                    <mat-icon>payment</mat-icon>
                    <div>
                      <strong>Forma de Pagamento</strong>
                      <p>{{ getPaymentLabel(paymentForm.get('method')?.value) }}</p>
                    </div>
                  </div>
                </div>
                <div class="step-actions">
                  <button mat-stroked-button matStepperPrevious>Voltar</button>
                  <button mat-flat-button color="primary" (click)="placeOrder()" [disabled]="loading">
                    <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                    <span *ngIf="!loading"><mat-icon>check_circle</mat-icon> Confirmar Pedido</span>
                  </button>
                </div>
              </mat-step>
            </mat-stepper>
          </div>

          <!-- ORDER SUMMARY -->
          <div class="order-summary" *ngIf="cart">
            <mat-card class="summary-card">
              <mat-card-header>
                <mat-card-title>Resumo</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="summary-item" *ngFor="let item of cart.items">
                  <span>{{ item.productName }} x{{ item.quantity }}</span>
                  <span>{{ item.subtotal | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
                <mat-divider></mat-divider>
                <div class="summary-total">
                  <strong>Total</strong>
                  <strong class="total-price">{{ cart.totalAmount | currency:'BRL':'symbol':'1.2-2' }}</strong>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { min-height: 100vh; background: #f5f5f5; padding: 24px 16px; }
    .checkout-container { max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    .page-header h1 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; margin: 0; }
    .checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
    .checkout-form { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .full-width { width: 100%; }
    .step-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
    .payment-methods { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
    .payment-option { border-radius: 8px !important; padding: 12px 16px !important; cursor: pointer; transition: all 0.2s; border: 2px solid transparent !important; }
    .payment-option.selected { border-color: #1565c0 !important; background: #e3f2fd !important; }
    .payment-label { display: flex; align-items: center; gap: 12px; }
    .payment-label mat-icon { color: #1565c0; font-size: 28px; width: 28px; height: 28px; }
    .payment-label strong { display: block; font-size: 0.95rem; }
    .payment-label span { font-size: 0.8rem; color: #777; }
    .card-fields { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .review-section { display: flex; flex-direction: column; gap: 16px; margin: 16px 0; }
    .review-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px; }
    .review-item mat-icon { color: #1565c0; margin-top: 2px; }
    .review-item strong { display: block; margin-bottom: 4px; }
    .review-item p { margin: 0; color: #555; font-size: 0.9rem; }
    .summary-card { border-radius: 12px !important; }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.9rem; color: #555; }
    .summary-total { display: flex; justify-content: space-between; padding: 12px 0 0; font-size: 1.1rem; }
    .total-price { color: #1565c0; font-size: 1.3rem; }
    @media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: CartResponse | null = null;
  loading = false;

  addressForm = this.fb.group({
    shippingAddress: ['', Validators.required]
  });

  paymentForm = this.fb.group({
    method: ['PIX', Validators.required],
    cardNumber: [''],
    cardHolderName: [''],
    expiryDate: [''],
    cvv: ['']
  });

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(cart => this.cart = cart);
  }

  getPaymentLabel(method: string | null | undefined): string {
    const labels: Record<string, string> = {
      PIX: 'PIX - Pagamento instantâneo',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      BILLET: 'Boleto Bancário'
    };
    return labels[method || ''] || method || '';
  }

  placeOrder(): void {
    this.loading = true;
    const paymentInfo = {
      method: this.paymentForm.get('method')?.value || 'PIX',
      cardNumber: this.paymentForm.get('cardNumber')?.value || undefined,
      cardHolderName: this.paymentForm.get('cardHolderName')?.value || undefined,
      expiryDate: this.paymentForm.get('expiryDate')?.value || undefined,
      cvv: this.paymentForm.get('cvv')?.value || undefined,
    };

    this.orderService.createOrder({
      shippingAddress: this.addressForm.get('shippingAddress')?.value || '',
      paymentInfo
    }).subscribe({
      next: (order) => {
        this.loading = false;
        this.cartService.clearLocal();
        this.snackBar.open('Pedido realizado com sucesso!', 'Fechar', { duration: 4000 });
        this.router.navigate(['/orders', order.id]);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Erro ao realizar pedido', 'Fechar', { duration: 4000 });
      }
    });
  }
}
