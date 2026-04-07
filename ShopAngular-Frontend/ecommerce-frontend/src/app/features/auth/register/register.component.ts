import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <div class="card-header-content">
            <div class="icon-circle">
              <mat-icon>person_add</mat-icon>
            </div>
            <h2>Criar Conta</h2>
            <p>Preencha os dados para se cadastrar</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="register-form">
            <div class="name-row">
              <mat-form-field appearance="outline">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="firstName">
                <mat-icon matPrefix>person</mat-icon>
                <mat-error *ngIf="form.get('firstName')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Sobrenome</mat-label>
                <input matInput formControlName="lastName">
                <mat-error *ngIf="form.get('lastName')?.hasError('required')">Obrigatório</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput type="email" formControlName="email" placeholder="seu@email.com">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="form.get('email')?.hasError('required')">E-mail obrigatório</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">E-mail inválido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint>Mínimo 6 caracteres</mat-hint>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Senha obrigatória</mat-error>
              <mat-error *ngIf="form.get('password')?.hasError('minlength')">Mínimo 6 caracteres</mat-error>
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Criar Conta</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="login-link">
            Já tem conta? <a routerLink="/auth/login">Faça login</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container { width: 100%; max-width: 480px; }
    .register-card { border-radius: 16px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; overflow: hidden; }
    .card-header-content { text-align: center; width: 100%; padding: 24px 0 8px; }
    .icon-circle {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #1565c0, #42a5f5);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
    }
    .icon-circle mat-icon { color: white; font-size: 32px; width: 32px; height: 32px; }
    .card-header-content h2 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
    .card-header-content p { margin: 0; color: #666; }
    .register-form { display: flex; flex-direction: column; gap: 4px; padding: 16px 24px; }
    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .full-width { width: 100%; }
    .submit-btn { width: 100%; height: 48px; font-size: 1rem; font-weight: 600; border-radius: 8px !important; margin-top: 8px; }
    .login-link { text-align: center; margin: 0; padding: 16px; color: #666; }
    .login-link a { color: #1565c0; font-weight: 600; text-decoration: none; }
    .login-link a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.register(this.form.value as any).subscribe({
      next: (user) => {
        this.snackBar.open(`Conta criada! Bem-vindo, ${user.firstName}!`, 'Fechar', { duration: 3000 });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Erro ao criar conta', 'Fechar', { duration: 4000 });
      }
    });
  }
}
