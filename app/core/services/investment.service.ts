// core/services/investment.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Investment, Transaction } from '../models/investment';
import { MockDataService } from './mock-data.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  constructor(
    private mockDataService: MockDataService,
    private AuthService: AuthService
  ) {}

  getUserInvestments(): Observable<Investment[]> {
    const userId = this.AuthService.currentUser?.id;
    if (!userId) {
      return new Observable<Investment[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.mockDataService.getInvestments(userId);
  }

  getUserTransactions(): Observable<Transaction[]> {
    const userId = this.AuthService.currentUser?.id;
    if (!userId) {
      return new Observable<Transaction[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.mockDataService.getTransactions(userId);
  }

  // In a real application, this would make API calls to get real-time stock prices
  refreshPrices(): void {
    console.log('Refreshing stock prices...');
    // This would update currentPrice, currentValue, change, and changePercentage for all holdings
  }
}
