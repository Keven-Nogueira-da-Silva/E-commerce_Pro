import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../../core/services/product.service';
import { ProductResponse, ProductRequest } from '../../../core/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatDialogModule, MatPaginatorModule, MatTooltipModule
  ],
  template: `
    <div class="admin-products">
      <div class="page-header">
        <div>
          <h1>Gerenciar Produtos</h1>
          <p>{{ totalElements }} produto(s) cadastrado(s)</p>
        </div>
        <button mat-flat-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Novo Produto
        </button>
      </div>

      <!-- FORM -->
      <mat-card class="product-form-card" *ngIf="showForm">
        <mat-card-header>
          <mat-card-title>{{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="product-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="flex-2">
                <mat-label>Nome do Produto *</mat-label>
                <input matInput formControlName="name">
                <mat-error *ngIf="productForm.get('name')?.hasError('required')">Nome obrigatório</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Categoria</mat-label>
                <mat-select formControlName="category">
                  <mat-option value="">Sem categoria</mat-option>
                  <mat-option value="Eletrônicos">Eletrônicos</mat-option>
                  <mat-option value="Roupas">Roupas</mat-option>
                  <mat-option value="Livros">Livros</mat-option>
                  <mat-option value="Casa">Casa</mat-option>
                  <mat-option value="Esportes">Esportes</mat-option>
                  <mat-option value="Outros">Outros</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descrição</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Preço (R$) *</mat-label>
                <input matInput type="number" formControlName="price" min="0" step="0.01">
                <mat-icon matPrefix>attach_money</mat-icon>
                <mat-error *ngIf="productForm.get('price')?.hasError('required')">Preço obrigatório</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Estoque</mat-label>
                <input matInput type="number" formControlName="stockQuantity" min="0">
                <mat-icon matPrefix>inventory</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-2">
                <mat-label>URL da Imagem</mat-label>
                <input matInput formControlName="imageUrl" placeholder="https://...">
                <mat-icon matPrefix>image</mat-icon>
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="closeForm()">Cancelar</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="productForm.invalid || saving">
                <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
                <span *ngIf="!saving">{{ editingProduct ? 'Salvar Alterações' : 'Criar Produto' }}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- TABLE -->
      <mat-card class="table-card">
        <div class="loading-center" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        <table mat-table [dataSource]="products" *ngIf="!loading" class="products-table">
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef>Imagem</th>
            <td mat-cell *matCellDef="let p">
              <img [src]="p.imageUrl || 'https://via.placeholder.com/48x48/e3f2fd/1565c0?text=P'" class="table-img">
            </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let p"><strong>{{ p.name }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Categoria</th>
            <td mat-cell *matCellDef="let p">
              <span class="category-chip" *ngIf="p.category">{{ p.category }}</span>
              <span class="no-cat" *ngIf="!p.category">—</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Preço</th>
            <td mat-cell *matCellDef="let p" class="price-cell">{{ p.price | currency:'BRL':'symbol':'1.2-2' }}</td>
          </ng-container>
          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef>Estoque</th>
            <td mat-cell *matCellDef="let p">
              <span class="stock-badge" [class.low]="p.stockQuantity <= 5" [class.out]="p.stockQuantity === 0">
                {{ p.stockQuantity }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button color="primary" (click)="editProduct(p)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(p)" matTooltip="Excluir">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

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
    .admin-products { }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .page-header h1 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 4px; }
    .page-header p { color: #777; margin: 0; font-size: 0.9rem; }
    .product-form-card { border-radius: 12px !important; margin-bottom: 20px; border-left: 4px solid #1565c0 !important; }
    .product-form { display: flex; flex-direction: column; gap: 8px; }
    .form-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .form-row mat-form-field { flex: 1; min-width: 160px; }
    .flex-2 { flex: 2 !important; }
    .full-width { width: 100%; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .table-card { border-radius: 12px !important; overflow: hidden; }
    .loading-center { display: flex; justify-content: center; padding: 40px; }
    .products-table { width: 100%; }
    .table-img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; }
    .category-chip { background: #e3f2fd; color: #1565c0; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .no-cat { color: #ccc; }
    .price-cell { font-weight: 700; color: #1565c0; }
    .stock-badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; background: #e8f5e9; color: #2e7d32; }
    .stock-badge.low { background: #fff3e0; color: #e65100; }
    .stock-badge.out { background: #ffebee; color: #c62828; }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingProduct: ProductResponse | null = null;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'actions'];

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0],
    imageUrl: [''],
    category: ['']
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void {
    this.editingProduct = null;
    this.productForm.reset({ stockQuantity: 0 });
    this.showForm = true;
  }

  editProduct(product: ProductResponse): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      category: product.category || ''
    });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingProduct = null;
    this.productForm.reset();
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    this.saving = true;
    const data = this.productForm.value as ProductRequest;
    const obs = this.editingProduct
      ? this.productService.update(this.editingProduct.id, data)
      : this.productService.create(data);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.loadProducts();
        this.snackBar.open(
          this.editingProduct ? 'Produto atualizado!' : 'Produto criado!',
          'Fechar', { duration: 3000 }
        );
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Erro ao salvar', 'Fechar', { duration: 3000 });
      }
    });
  }

  deleteProduct(product: ProductResponse): void {
    if (!confirm(`Deseja excluir "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.snackBar.open('Produto excluído!', 'Fechar', { duration: 3000 });
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Erro ao excluir', 'Fechar', { duration: 3000 })
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }
}
