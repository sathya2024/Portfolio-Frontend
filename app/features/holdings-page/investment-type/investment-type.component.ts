// src/app/shared/components/investment-type-modal/investment-type-modal.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment-type-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investment-type.component.html',
  styleUrls: ['./investment-type.component.css'],
})
export class InvestmentTypeModalComponent {
  @Output() typeSelected = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  investmentTypes = [
    { id: 'stocks', name: 'Stocks', icon: 'bi-graph-up' },
    { id: 'bonds', name: 'Bonds & Other Fixed Income', icon: 'bi-cash-coin' },
    { id: 'mutual-funds', name: 'Mutual Funds', icon: 'bi-pie-chart' },
    { id: 'gold-bonds', name: 'Sovereign Gold Bonds', icon: 'bi-award' },
  ];

  selectType(type: string): void {
    this.typeSelected.emit(type);
  }

  close(): void {
    this.closeModal.emit();
  }
}
