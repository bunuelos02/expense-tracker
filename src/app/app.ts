// SAME IMPORTS
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from './services/transaction.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';

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
    DashboardComponent,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
  <div style="max-width: 700px; margin:auto; padding:20px;">

    <!-- 🔐 LOGIN / REGISTER -->
    <div *ngIf="!user">

      <h2>Login / Register</h2>

      <input matInput [(ngModel)]="name" placeholder="Name">
      <input matInput [(ngModel)]="email" placeholder="Email">
      <input matInput [(ngModel)]="password" type="password" placeholder="Password">

      <br><br>

      <button mat-button (click)="register()">Register</button>
      <button mat-button (click)="login()">Login</button>

    </div>

    <!-- 🔓 MAIN APP -->
    <div *ngIf="user">

      <!-- PROFILE -->
      <h3>Profile</h3>
      <p>Name: {{ user?.displayName }}</p>
      <p>Email: {{ user?.email }}</p>

      <mat-form-field>
        <input matInput type="number" [(ngModel)]="budgetGoal" placeholder="Budget Goal">
      </mat-form-field>

      <button mat-button (click)="logout()">Logout</button>

      <!-- 🔥 YOUR ORIGINAL APP STARTS HERE -->

      <mat-card>
        <h1>Expense Tracker</h1>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">

          <mat-form-field style="flex:1;">
            <input matInput [(ngModel)]="amount" type="number" placeholder="Amount">
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <mat-select [(ngModel)]="category" placeholder="Category">
              <mat-option *ngFor="let c of categories" [value]="c">{{ c }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <mat-select [(ngModel)]="type">
              <mat-option value="expense">Expense</mat-option>
              <mat-option value="income">Income</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <input matInput [(ngModel)]="notes" placeholder="Notes">
          </mat-form-field>

          <mat-form-field style="flex:1;">
            <input matInput type="date" [(ngModel)]="date">
          </mat-form-field>

        </div>

        <button mat-raised-button color="primary" (click)="save()">
          {{ editingId ? 'Update' : 'Add' }}
        </button>
      </mat-card>

      <br>

      <!-- 🔄 REFRESH BUTTON -->
      <button mat-button (click)="refresh()">🔄 Refresh</button>

      <h3>Add Category</h3>
      <input matInput [(ngModel)]="newCategory" placeholder="New category">
      <button mat-button (click)="addCategory()">Add</button>

      <h3>Set Budget</h3>
      <mat-form-field>
        <mat-select [(ngModel)]="budgetCategory">
          <mat-option *ngFor="let c of categories" [value]="c">{{ c }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <input matInput type="number" [(ngModel)]="budgetAmount" placeholder="Budget">
      </mat-form-field>

      <button mat-button (click)="setBudget()">Set Budget</button>

      <mat-form-field style="width:100%;">
        <input matInput [(ngModel)]="filterCategory" placeholder="Filter by category">
      </mat-form-field>

      <div style="display:flex; gap:10px;">
        <input matInput type="number" [(ngModel)]="minAmount" placeholder="Min">
        <input matInput type="number" [(ngModel)]="maxAmount" placeholder="Max">
      </div>

      <div style="display:flex; gap:10px; margin-top:10px;">
        <input matInput type="date" [(ngModel)]="startDate">
        <input matInput type="date" [(ngModel)]="endDate">
      </div>

      <div *ngFor="let t of filteredTransactions">

        <mat-card style="margin-top:10px;">

          <b [style.color]="categoryColors[t.category] || 'black'">
            {{ t.category }}
          </b>
          - {{ t.amount }} ({{ t.type }})

          <br>
          <small>{{ t.date | date:'mediumDate' }}</small>

          <br>
          <small>{{ t.notes }}</small>

          <div *ngIf="budgets[t.category] && t.amount > budgets[t.category]" style="color:red;">
            Over budget!
          </div>

          <div *ngIf="budgets[t.category] && t.amount > budgets[t.category]*0.8 && t.amount <= budgets[t.category]" style="color:orange;">
            Nearing budget
          </div>

          <div>
            <button mat-button (click)="edit(t)">Edit</button>
            <button mat-button color="warn" (click)="delete(t.id)">Delete</button>
          </div>

        </mat-card>
      </div>

      <div style="margin-top:30px;">
        <app-dashboard [transactions]="transactions" [budgets]="budgets"></app-dashboard>
      </div>

    </div>

  </div>
  `
})
export class App implements OnInit {

  email = '';
  password = '';
  name = '';
  user: any = null;
  budgetGoal = 0;

  amount = 0;
  category = '';
  notes = '';
  date = new Date().toISOString().substring(0, 10);

  type: 'income' | 'expense' = 'expense';

  editingId: string | null = null;
  transactions: any[] = [];

  categories = ['Food', 'Rent', 'Travel', 'Wage', 'Other'];
  newCategory = '';

  budgets: any = {};
  budgetCategory = '';
  budgetAmount = 0;

  filterCategory = '';
  minAmount = 0;
  maxAmount = 999999;

  startDate = '';
  endDate = '';

  categoryColors: any = {
    Food: 'red',
    Rent: 'blue',
    Travel: 'green',
    Wage: 'purple',
    Other: 'gray'
  };

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();
    if (this.user) await this.load();
  }

  async register() {
    await this.authService.register(this.email, this.password, this.name);
    this.user = this.authService.getUser();
    await this.load();
  }

  async login() {
    await this.authService.login(this.email, this.password);
    this.user = this.authService.getUser();
    await this.load();
  }

  async logout() {
    await this.authService.logout();
    this.user = null;
  }

  async save() {
    if (!this.amount || !this.category) return;

    if (this.editingId) {
      await this.transactionService.updateTransaction(this.editingId, {
        amount: this.amount,
        category: this.category,
        notes: this.notes,
        date: this.date,
        type: this.type
      });
      this.editingId = null;
    } else {
      await this.transactionService.addTransaction({
        amount: this.amount,
        category: this.category,
        notes: this.notes,
        date: this.date,
        type: this.type
      });
    }

    this.amount = 0;
    this.category = '';
    this.notes = '';

    await this.load(); // 🔥 FIX
  }

  async load() {
    if (!this.user) return;
    this.transactions = await this.transactionService.getTransactions();
  }

  async refresh() {
    await this.load();
  }

  edit(t: any) {
    this.amount = t.amount;
    this.category = t.category;
    this.notes = t.notes;
    this.date = t.date;
    this.type = t.type;
    this.editingId = t.id;
  }

  async delete(id: string) {
    await this.transactionService.deleteTransaction(id);
    await this.load(); // 🔥 FIX
  }

  addCategory() {
    if (this.newCategory && !this.categories.includes(this.newCategory)) {
      this.categories.push(this.newCategory);
      this.newCategory = '';
    }
  }

  setBudget() {
    if (!this.budgetCategory) return;
    this.budgets[this.budgetCategory] = this.budgetAmount;
  }

  get filteredTransactions() {
    return this.transactions
      .filter(t =>
        t.category.toLowerCase().includes(this.filterCategory.toLowerCase())
      )
      .filter(t =>
        t.amount >= this.minAmount && t.amount <= this.maxAmount
      )
      .filter(t =>
        !this.startDate || new Date(t.date) >= new Date(this.startDate)
      )
      .filter(t =>
        !this.endDate || new Date(t.date) <= new Date(this.endDate)
      );
  }
}