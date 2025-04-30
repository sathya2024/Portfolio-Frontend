import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Investment } from '../../../core/models/investment';
import { InvestmentService } from '../../../core/services/investment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from 'modal-popup-angular-18';
import { AddInvestmentModalComponent } from '.././add-investment-modal/add-investment-modal.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-holdings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
})
export class HoldingsComponent implements OnInit {
  investments: Investment[] = [];
  stockInvestments: Investment[] = [];
  bondInvestments: Investment[] = [];
  mutualFundInvestments: Investment[] = [];
  goldBondInvestments: Investment[] = [];

  activeTab: string = 'all'; 
  loading = true;
  error = '';

  totalInvestmentValue = 0;
  totalInvestmentCost = 0;
  totalGainLoss = 0;
  totalGainLossPercentage = 0;
  perDayGainLoss = 0;
  totalQuantity = 0;
  totalPurchasePrice = 0;
  totalCurrentPrice = 0;
  totalCurrentValue = 0;
  totalChange = 0;
  totalChangePercentage = 0;
  portfolioPercentage = 100;

  constructor(
    private investmentService: InvestmentService,
    private authService: AuthService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadInvestments(): void {
    this.loading = true;
    this.investmentService.getUserInvestments().subscribe({
      next: (investments) => {
        this.investments = investments;
        this.categorizeInvestments();
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load investments';
        this.loading = false;
      },
    });
  }

  categorizeInvestments(): void {
    this.stockInvestments = [];
    this.bondInvestments = [];
    this.mutualFundInvestments = [];
    this.goldBondInvestments = [];

    // Categorize investments by type
    for (const investment of this.investments) {
      switch (investment.type) {
        case 'stock':
          this.stockInvestments.push(investment);
          break;
        case 'bond':
          this.bondInvestments.push(investment);
          break;
        case 'mutual-fund':
          this.mutualFundInvestments.push(investment);
          break;
        case 'gold-bond':
          this.goldBondInvestments.push(investment);
          break;
      }
    }
  }

  calculateTotals(): void {
    this.totalInvestmentValue = 0;
    this.totalInvestmentCost = 0;
    this.perDayGainLoss = 0;
    this.totalQuantity = 0;
    this.totalCurrentValue = 0;
    this.totalChange = 0;

    for (const investment of this.investments) {
      // Calculate for summary cards
      this.totalInvestmentValue += investment.currentValue || 0;
      this.totalInvestmentCost +=
        investment.purchasePrice * investment.quantity;
      this.perDayGainLoss += investment.perDayChange || 0;

      // Calculate for table footer totals
      this.totalQuantity += investment.quantity || 0;
      this.totalCurrentValue += investment.currentValue || 0;
      this.totalChange += investment.change || 0;
    }

    // Calculate overall gain/loss percentages
    this.totalGainLoss = this.totalInvestmentValue - this.totalInvestmentCost;
    this.totalGainLossPercentage =
      this.totalInvestmentCost !== 0
        ? (this.totalGainLoss / this.totalInvestmentCost) * 100
        : 0;

    // Calculate average purchase price (weighted)
    this.totalPurchasePrice =
      this.totalQuantity !== 0
        ? this.totalInvestmentCost / this.totalQuantity
        : 0;

    // Calculate average change percentage
    this.totalChangePercentage =
      this.totalInvestmentCost !== 0
        ? (this.totalChange / this.totalInvestmentCost) * 100
        : 0;
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  getTypeTotalQuantity(type: string): number {
    return this.investments
      .filter((inv) => inv.type === type)
      .reduce((sum, inv) => sum + inv.quantity, 0);
  }

  getTypeTotalValue(type: string): number {
    return this.investments
      .filter((inv) => inv.type === type)
      .reduce((sum, inv) => sum + (inv.currentValue || 0), 0);
  }

  getTypeTotalChange(type: string): number {
    return this.investments
      .filter((inv) => inv.type === type)
      .reduce((sum, inv) => sum + (inv.change || 0), 0);
  }

  getTypeTotalChangePercentage(type: string): number {
    const totalCost = this.investments
      .filter((inv) => inv.type === type)
      .reduce((sum, inv) => sum + inv.purchasePrice * inv.quantity, 0);

    const totalChange = this.getTypeTotalChange(type);

    return totalCost !== 0 ? (totalChange / totalCost) * 100 : 0;
  }

  formatType(type: string): string {
    return type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  // Bond-specific calculations
  getMaturityDate(bond: Investment): Date {
    // Mock calculation: assuming bonds mature 5 years after purchase
    const maturityDate = new Date(bond.purchaseDate);
    maturityDate.setFullYear(maturityDate.getFullYear() + 5);
    return maturityDate;
  }

  getBondYield(bond: Investment): number {
    // Mock calculation for bond yield
    return bond.changePercentage || 0;
  }

  // Mutual Fund specific calculations
  getMutualFundCAGR(fund: Investment): number {
    // Calculate CAGR (Compound Annual Growth Rate)
    const purchaseDate = new Date(fund.purchaseDate);
    const today = new Date();
    const yearsHeld =
      (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (yearsHeld <= 0) return 0;

    const initialValue = fund.purchasePrice * fund.quantity;
    const finalValue = fund.currentValue || 0;

    return (Math.pow(finalValue / initialValue, 1 / yearsHeld) - 1) * 100;
  }

  // Gold Bond specific calculations
  getGoldBondInterestRate(goldBond: Investment): number {
    // Mock interest rate for gold bonds
    return 2.5; 
  }

  openAddInvestmentModal() {
    this.modal.open(AddInvestmentModalComponent, {
      title: 'Add Investment',
      size: { width: '600px' },
    });
  }
  exportActiveTabToExcel(): void {
    let dataToExport: Investment[] = [];
    let sheetName = '';
  
    // Determine the active tab and set the data and sheet name accordingly
    switch (this.activeTab) {
      case 'stock':
        dataToExport = this.stockInvestments;
        sheetName = 'Stocks';
        break;
      case 'bond':
        dataToExport = this.bondInvestments;
        sheetName = 'Bonds';
        break;
      case 'mutual-fund':
        dataToExport = this.mutualFundInvestments;
        sheetName = 'Mutual Funds';
        break;
      case 'gold-bond':
        dataToExport = this.goldBondInvestments;
        sheetName = 'Gold Bonds';
        break;
      case 'all':
      default:
        dataToExport = this.investments;
        sheetName = 'All Holdings';
        break;
    }
  
    // Call the exportToExcel method with the selected data and sheet name
    this.exportToExcel(dataToExport, sheetName);
  }
  
  private exportToExcel(data: Investment[], sheetName: string): void {
    // Map the data to a formatted structure
    const formattedData = data.map(investment => {
      switch (sheetName) {
        case 'Stocks':
          return {
            'Symbol': investment.ticker,
            'Quantity': investment.quantity,
            'Purchase Price': `₹${investment.purchasePrice.toFixed(2)}`,
            'Purchase Date': this.formatDateForExport(investment.purchaseDate),
            'Current Price': investment.currentPrice ? `₹${investment.currentPrice.toFixed(2)}` : '-',
            'Current Value': investment.currentValue ? `₹${investment.currentValue.toFixed(2)}` : '-',
            'Gain/Loss': investment.change ? `₹${investment.change.toFixed(2)}` : '-',
            'Change (%)': investment.changePercentage ? `${investment.changePercentage.toFixed(2)}%` : '-'
          };
        case 'Bonds':
          return {
            'Symbol': investment.ticker,
            'Quantity': investment.quantity,
            'Purchase Price': `₹${investment.purchasePrice.toFixed(2)}`,
            'Purchase Date': this.formatDateForExport(investment.purchaseDate),
            'Maturity Date': this.getMaturityDate(investment),
            'Current Price': investment.currentPrice ? `₹${investment.currentPrice.toFixed(2)}` : '-',
            'Current Value': investment.currentValue ? `₹${investment.currentValue.toFixed(2)}` : '-',
            'Yield (%)': this.getBondYield(investment).toFixed(2)
          };
        case 'Mutual Funds':
          return {
            'Name': investment.ticker,
            'Units': investment.quantity,
            'Purchase NAV': `₹${investment.purchasePrice.toFixed(2)}`,
            'Purchase Date': this.formatDateForExport(investment.purchaseDate),
            'Current NAV': investment.currentPrice ? `₹${investment.currentPrice.toFixed(2)}` : '-',
            'Current Value': investment.currentValue ? `₹${investment.currentValue.toFixed(2)}` : '-',
            'Gain/Loss': investment.change ? `₹${investment.change.toFixed(2)}` : '-',
            'CAGR (%)': this.getMutualFundCAGR(investment).toFixed(2)
          };
        case 'Gold Bonds':
          return {
            'Series': investment.ticker,
            'Units': investment.quantity,
            'Purchase Price': `₹${investment.purchasePrice.toFixed(2)}`,
            'Purchase Date': this.formatDateForExport(investment.purchaseDate),
            'Current Price': investment.currentPrice ? `₹${investment.currentPrice.toFixed(2)}` : '-',
            'Current Value': investment.currentValue ? `₹${investment.currentValue.toFixed(2)}` : '-',
            'Interest Rate (%)': this.getGoldBondInterestRate(investment).toFixed(2),
            'Gain/Loss': investment.change ? `₹${investment.change.toFixed(2)}` : '-'
          };
        default: // For "All Holdings" or unknown types
          return {
            'Symbol': investment.ticker,
            'Type': investment.type,
            'Quantity': investment.quantity,
            'Purchase Price': `₹${investment.purchasePrice.toFixed(2)}`,
            'Purchase Date': this.formatDateForExport(investment.purchaseDate),
            'Current Price': investment.currentPrice ? `₹${investment.currentPrice.toFixed(2)}` : '-',
            'Current Value': investment.currentValue ? `₹${investment.currentValue.toFixed(2)}` : '-',
            'Gain/Loss': investment.change ? `₹${investment.change.toFixed(2)}` : '-',
            'Change (%)': investment.changePercentage ? `${investment.changePercentage.toFixed(2)}%` : '-'
          };
      }
    });
  
    // Add totals row to the formatted data
    this.addTotalsRowToFormattedData(sheetName, formattedData);
  
    // Export to Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }
  
  private addTotalsRowToFormattedData(sheetName: string, formattedData: any[]): void {
    const totalsRow = this.getTotalsRow(sheetName);
    formattedData.push(totalsRow);
  }
  
  private getTotalsRow(sheetName: string): any {
    switch (sheetName) {
      case 'Stocks':
        return {
          'Symbol': 'Total',
          'Quantity': this.getTypeTotalQuantity('stock'),
          'Purchase Price': '-',
          'Purchase Date': '-',
          'Current Price': '-',
          'Current Value': `₹${this.getTypeTotalValue('stock').toFixed(2)}`,
          'Gain/Loss': `₹${this.getTypeTotalChange('stock').toFixed(2)}`,
          'Change (%)': `${this.getTypeTotalChangePercentage('stock').toFixed(2)}%`
        };
      case 'Bonds':
        return {
          'Symbol': 'Total',
          'Quantity': this.getTypeTotalQuantity('bond'),
          'Purchase Price': '-',
          'Purchase Date': '-',
          'Maturity Date': '-',
          'Current Price': '-',
          'Current Value': `₹${this.getTypeTotalValue('bond').toFixed(2)}`,
          'Yield (%)': '-'
        };
      case 'Mutual Funds':
        return {
          'Name': 'Total',
          'Units': this.getTypeTotalQuantity('mutual-fund'),
          'Purchase NAV': '-',
          'Purchase Date': '-',
          'Current NAV': '-',
          'Current Value': `₹${this.getTypeTotalValue('mutual-fund').toFixed(2)}`,
          'Gain/Loss': `₹${this.getTypeTotalChange('mutual-fund').toFixed(2)}`,
          'CAGR (%)': '-'
        };
      case 'Gold Bonds':
        return {
          'Series': 'Total',
          'Units': this.getTypeTotalQuantity('gold-bond'),
          'Purchase Price': '-',
          'Purchase Date': '-',
          'Current Price': '-',
          'Current Value': `₹${this.getTypeTotalValue('gold-bond').toFixed(2)}`,
          'Interest Rate (%)': '-',
          'Gain/Loss': `₹${this.getTypeTotalChange('gold-bond').toFixed(2)}`
        };
      default: // For "All Holdings"
        return {
          'Symbol': 'Total',
          'Type': '-',
          'Quantity': this.totalQuantity,
          'Purchase Price': '-',
          'Purchase Date': '-',
          'Current Price': '-',
          'Current Value': `₹${this.totalCurrentValue.toFixed(2)}`,
          'Gain/Loss': `₹${this.totalChange.toFixed(2)}`,
          'Change (%)': `${this.totalChangePercentage.toFixed(2)}%`
        };
    }
  }
  
  private formatDateForExport(date: any): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}