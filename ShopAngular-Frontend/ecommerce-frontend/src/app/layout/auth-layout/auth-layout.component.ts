import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-left">
        <div class="auth-brand">
          <mat-icon>storefront</mat-icon>
          <h1>ShopAngular</h1>
          <p>A melhor experiência de compras online</p>
        </div>
        <div class="auth-features">
          <div class="feature">
            <mat-icon>local_shipping</mat-icon>
            <span>Entrega Rápida</span>
          </div>
          <div class="feature">
            <mat-icon>security</mat-icon>
            <span>Compra Segura</span>
          </div>
          <div class="feature">
            <mat-icon>support_agent</mat-icon>
            <span>Suporte 24/7</span>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <a routerLink="/" class="back-home">
          <mat-icon>arrow_back</mat-icon> Voltar à loja
        </a>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { display: flex; min-height: 100vh; }
    .auth-left {
      flex: 1; background: linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a1a2e 100%);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 48px; color: white; gap: 48px;
    }
    .auth-brand { text-align: center; }
    .auth-brand mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.9; }
    .auth-brand h1 { font-size: 2.5rem; font-weight: 800; margin: 16px 0 8px; }
    .auth-brand p { font-size: 1.1rem; opacity: 0.8; }
    .auth-features { display: flex; flex-direction: column; gap: 20px; }
    .feature { display: flex; align-items: center; gap: 16px; font-size: 1.05rem; }
    .feature mat-icon { background: rgba(255,255,255,0.2); border-radius: 50%; padding: 8px; }
    .auth-right {
      flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;
      padding: 48px; background: #fafafa; position: relative;
    }
    .back-home {
      position: absolute; top: 24px; left: 24px; display: flex; align-items: center; gap: 6px;
      color: #1565c0; text-decoration: none; font-weight: 500;
    }
    .back-home:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { padding: 24px; }
    }
  `]
})
export class AuthLayoutComponent {}
