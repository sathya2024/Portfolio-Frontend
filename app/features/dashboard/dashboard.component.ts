import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink } from '@angular/router';
import { Investment } from '../../core/models/investment';
import { InvestmentService } from '../../core/services/investment.service';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule,FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  investments: Investment[] = [];
  loading = true;
  error = '';

  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;

  constructor(
    private investmentService: InvestmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.loading = true;
    this.investmentService.getUserInvestments().subscribe({
      next: (investments) => {
        this.investments = investments;
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }

  calculateTotals(): void {
    this.totalInvestmentValue = 0;
    this.totalInvestmentCost = 0;

    for (const investment of this.investments) {
      this.totalInvestmentValue += investment.currentValue || 0;
      this.totalInvestmentCost +=
        investment.purchasePrice * investment.quantity;
    }

    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      (this.totalGainLoss / this.totalInvestmentCost) * 100;
  }


  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']); 
  }
}
