import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Expense Tracker</h1>

    <h3>Add / Edit Transaction</h3>

    <input [(ngModel)]="amount" placeholder="Amount" type="number">
    <input [(ngModel)]="category" placeholder="Category">

    <select [(ngModel)]="type">
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>

    <button (click)="save()">
      {{ editingId ? 'Update' : 'Add' }}
    </button>

    <hr>

    <button (click)="load()">Load Transactions</button>

    <div *ngFor="let t of transactions">
      {{ t.category }} - {{ t.amount }} ({{ t.type }})

      <button (click)="edit(t)">Edit</button>
      <button (click)="delete(t.id)">Delete</button>
    </div>
  `
})
export class App {

  amount = 0;
  category = '';
  type: 'income' | 'expense' = 'expense';

  editingId: string | null = null;

  transactions: any[] = [];

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