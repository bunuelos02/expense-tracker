import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dashboard</h2>

    <h3>Monthly Total: {{ monthlyTotal }}</h3>

    <div style="max-width:400px; margin:auto;">
      <canvas id="chart"></canvas>
    </div>

    <div style="max-width:400px; margin:auto;">
      <canvas id="chart2"></canvas>
    </div>

    <div style="max-width:400px; margin:auto;">
      <canvas id="chart3"></canvas>
    </div>
  `
})
export class DashboardComponent implements OnChanges {

  @Input() transactions: any[] = [];
  @Input() budgets: any = {};

  chart: any;
  chart2: any;
  chart3: any;

  monthlyTotal = 0;

  ngOnChanges() {
    if (!this.transactions.length) return;

    const currentMonth = new Date().getMonth();

    this.monthlyTotal = this.transactions
      .filter(t => new Date(t.date).getMonth() === currentMonth)
      .reduce((a,b) => a + b.amount, 0);

    const categoryTotals: any = {};

    this.transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    if (this.chart) this.chart.destroy();

    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{ data: Object.values(categoryTotals) }]
      }
    });

    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((a,b) => a + b.amount, 0);

    const expense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((a,b) => a + b.amount, 0);

    if (this.chart2) this.chart2.destroy();

    this.chart2 = new Chart('chart2', {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{ data: [income, expense] }]
      }
    });

    const totalBudget = Object.values(this.budgets).reduce((a: any, b: any) => a + b, 0);

    if (this.chart3) this.chart3.destroy();

    this.chart3 = new Chart('chart3', {
      type: 'bar',
      data: {
        labels: ['Budget', 'Spent'],
        datasets: [{ data: [totalBudget, expense] }]
      }
    });
  }
}