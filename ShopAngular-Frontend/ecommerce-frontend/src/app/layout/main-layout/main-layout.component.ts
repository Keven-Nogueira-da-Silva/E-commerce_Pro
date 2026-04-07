import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatBadgeModule, MatMenuModule, MatDividerModule
  ],
  template: `
    <div class="app-wrapper">
      <!-- NAVBAR -->
      <mat-toolbar class="navbar" color="primary">
        <div class="navbar-inner">
          <a routerLink="/" class="brand">
            <mat-icon>storefront</mat-icon>
            <span>ShopAngular</span>
          </a>

          <nav class="nav-links">
            <a routerLink="/products" routerLinkActive="active" mat-button>
              <mat-icon>grid_view</mat-icon> Produtos
            </a>
          </nav>

          <div class="nav-actions">
            <a routerLink="/cart" mat-icon-button *ngIf="authService.isLoggedIn">
              <mat-icon [matBadge]="cartCount > 0 ? cartCount : null" matBadgeColor="accent">shopping_cart</mat-icon>
            </a>

            <ng-container *ngIf="authService.isLoggedIn; else loginBtn">
              <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
                <mat-icon>account_circle</mat-icon>
                <span>{{ authService.currentUser?.firstName }}</span>
                <mat-icon>arrow_drop_down</mat-icon>
              </button>
              <mat-menu #userMenu="matMenu">
                <a mat-menu-item routerLink="/orders">
                  <mat-icon>receipt_long</mat-icon> Meus Pedidos
                </a>
                <a mat-menu-item routerLink="/admin" *ngIf="authService.isAdmin">
                  <mat-icon>admin_panel_settings</mat-icon> Painel Admin
                </a>
                <mat-divider></mat-divider>
                <button mat-menu-item (click)="authService.logout()">
                  <mat-icon>logout</mat-icon> Sair
                </button>
              </mat-menu>
            </ng-container>

            <ng-template #loginBtn>
              <a routerLink="/auth/login" mat-stroked-button class="login-btn">
                <mat-icon>login</mat-icon> Entrar
              </a>
              <a routerLink="/auth/register" mat-flat-button color="accent" class="register-btn">
                Cadastrar
              </a>
            </ng-template>
          </div>
        </div>
      </mat-toolbar>

      <!-- CONTENT -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <mat-icon>storefront</mat-icon>
            <span>ShopAngular</span>
          </div>
          <p class="footer-copy">&copy; 2024 ShopAngular. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
    .navbar { position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .navbar-inner { display: flex; align-items: center; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 16px; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: white; font-size: 1.3rem; font-weight: 700; }
    .nav-links { display: flex; gap: 4px; flex: 1; }
    .nav-links a { color: rgba(255,255,255,0.85); border-radius: 8px; }
    .nav-links a.active, .nav-links a:hover { color: white; background: rgba(255,255,255,0.15); }
    .nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .user-btn { color: white; display: flex; align-items: center; gap: 4px; }
    .login-btn { color: white; border-color: rgba(255,255,255,0.5); }
    .register-btn { margin-left: 4px; }
    .main-content { flex: 1; background: #f5f5f5; }
    .footer { background: #1a1a2e; color: rgba(255,255,255,0.7); padding: 24px 16px; }
    .footer-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .footer-brand { display: flex; align-items: center; gap: 8px; color: white; font-weight: 600; font-size: 1.1rem; }
    .footer-copy { margin: 0; font-size: 0.85rem; }
  `]
})
export class MainLayoutComponent implements OnInit {
  cartCount = 0;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart?.totalItems ?? 0;
    });
    if (this.authService.isLoggedIn) {
      this.cartService.getCart().subscribe();
    }
  }
}
