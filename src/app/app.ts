import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './services/transaction.service';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div style="max-width: 600px; margin: auto; padding: 20px;">

      <mat-card>
        <h1>Expense Tracker</h1>

        <h3>Add / Edit Transaction</h3>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          
          <mat-form-field style="flex:1;">
            <input matInput [(ngModel)]="amount" placeholder="Amount" type="number">
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <input matInput [(ngModel)]="category" placeholder="Category">
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <mat-select [(ngModel)]="type">
              <mat-option value="expense">Expense</mat-option>
              <mat-option value="income">Income</mat-option>
            </mat-select>
          </mat-form-field>

        </div>

        <button mat-raised-button color="primary" (click)="save()">
          {{ editingId ? 'Update' : 'Add' }}
        </button>
      </mat-card>

      <br>

      <button mat-button (click)="load()">Load Transactions</button>

      <mat-form-field style="width:100%;">
        <input matInput [(ngModel)]="filterCategory" placeholder="Filter by category">
      </mat-form-field>

      <div *ngFor="let t of transactions.filter(t => t.category.toLowerCase().includes(filterCategory.toLowerCase()))">
        <mat-card style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
          
          <div>
            <b>{{ t.category }}</b> - {{ t.amount }} ({{ t.type }})
          </div>

          <div>
            <button mat-button (click)="edit(t)">Edit</button>
            <button mat-button color="warn" (click)="delete(t.id)">Delete</button>
          </div>

        </mat-card>
      </div>

    </div>
  `
})
export class App {

  amount = 0;
  category = '';
  type: 'income' | 'expense' = 'expense';

  editingId: string | null = null;
  transactions: any[] = [];

  filterCategory = '';

  constructor(private transactionService: TransactionService) {}

  async save() {
    if (this.editingId) {
      await this.transactionService.updateTransaction(this.editingId, {
        amount: this.amount,
        category: this.category,
        type: this.type
      });
      this.editingId = null;
    } else {
      await this.transactionService.addTransaction({
        amount: this.amount,
        category: this.category,
        date: new Date().toISOString(),
        type: this.type
      });
    }

    this.amount = 0;
    this.category = '';
    this.type = 'expense';

    this.load();
  }

  async load() {
    this.transactions = await this.transactionService.getTransactions();
  }

  edit(t: any) {
    this.amount = t.amount;
    this.category = t.category;
    this.type = t.type;
    this.editingId = t.id;
  }

  async delete(id: string) {
    await this.transactionService.deleteTransaction(id);
    this.load();
  }
}