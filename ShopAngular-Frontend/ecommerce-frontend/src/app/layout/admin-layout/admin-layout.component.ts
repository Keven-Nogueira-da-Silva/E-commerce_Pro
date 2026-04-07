import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="admin-container">
      <mat-sidenav mode="side" opened class="admin-sidenav">
        <div class="sidenav-header">
          <mat-icon>admin_panel_settings</mat-icon>
          <div>
            <div class="admin-title">Painel Admin</div>
            <div class="admin-sub">{{ authService.currentUser?.firstName }}</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/admin/products" routerLinkActive="active-link">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Produtos</span>
          </a>
          <a mat-list-item routerLink="/admin/orders" routerLinkActive="active-link">
            <mat-icon matListItemIcon>receipt_long</mat-icon>
            <span matListItemTitle>Pedidos</span>
          </a>
          <a mat-list-item routerLink="/admin/payments" routerLinkActive="active-link">
            <mat-icon matListItemIcon>payments</mat-icon>
            <span matListItemTitle>Pagamentos</span>
          </a>
        </mat-nav-list>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/">
            <mat-icon matListItemIcon>storefront</mat-icon>
            <span matListItemTitle>Ver Loja</span>
          </a>
          <a mat-list-item (click)="authService.logout()" class="logout-item">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Sair</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="admin-content">
        <mat-toolbar class="admin-toolbar" color="primary">
          <span>Painel Administrativo</span>
        </mat-toolbar>
        <div class="admin-body">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container { height: 100vh; }
    .admin-sidenav {
      width: 260px; background: #003cff; color: white;
    }
    .sidenav-header {
      display: flex; align-items: center; gap: 12px; padding: 20px 16px;
      background: rgba(30, 11, 199, 0.05);
    }
    .sidenav-header mat-icon { font-size: 36px; width: 36px; height: 36px; color: #90caf9; }
    .admin-title { font-weight: 700; font-size: 1rem; color: white; }
    .admin-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
    ::ng-deep .admin-sidenav .mat-mdc-list-item { color: rgba(255, 255, 255, 0.8) !important; border-radius: 8px; margin: 2px 8px; }
    ::ng-deep .admin-sidenav .mat-mdc-list-item:hover { background: rgba(255,255,255,0.1) !important; color: white !important; }
    ::ng-deep .admin-sidenav .active-link { background: rgba(0, 183, 255, 0.2) !important; color: #90caf9 !important; }
    ::ng-deep .admin-sidenav .mat-icon { color: inherit !important; }
    .logout-item { cursor: pointer; }
    .logout-item:hover { color: #ef9a9a !important; }
    .admin-toolbar { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .admin-content { display: flex; flex-direction: column; }
    .admin-body { flex: 1; padding: 24px; background: #f5f5f5; overflow-y: auto; }
  `]
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}
}
