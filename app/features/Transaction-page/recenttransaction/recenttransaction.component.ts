import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recenttransaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recenttransaction.component.html',
  styleUrl: './recenttransaction.component.css'
})
export class RecenttransactionComponent {
  constructor() { }

  ngOnInit(): void {
  }
  @Input() transactions: any[] = [];
  @Input() onTransactionClick: (transaction: any) => void = () => {};

  getTransactionName(transaction: any): string {
    return transaction.symbol || transaction.name || transaction.scheme;
  }

  isRecent(date: Date): boolean {
    const transactionDate = new Date(date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return transactionDate >= sevenDaysAgo;
  }
}
