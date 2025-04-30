import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { RecenttransactionComponent } from '../recenttransaction/recenttransaction.component';

interface StockTransaction {
  date: Date;
  symbol: string;
  type: string;
  quantity: number;
  exchange: string;
  price: number;
  amount: number;
}

interface BondTransaction {
  date: Date;
  name: string;
  isin: string;
  type: string;
  price: number;
  units: number;
  InterestRate: number;
  quantity: number;
  faceValue: number;
  amount: number;
}

interface MutualFundTransaction {
  date: Date;
  scheme: string;
  folio: string;
  type: string;
  units: number;
  nav: number;
  amount: number;
}
 
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule,RecenttransactionComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})

export class TransactionsComponent implements OnInit {
  getDisplayedTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.activeTabTotalCount);
  }

  
  fromDate: string = '';
  toDate: string = '';
  selectedType: string = 'all';
  searchQuery: string = '';
  
  // Pagination controls
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  
  // Table tabs
  tabs = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'mutual-funds', label: 'Mutual Funds' }
  ];
  activeTab: string = 'stocks';
  
  // Sample data
  stocksData: StockTransaction[] = [
    { date: new Date('2023-01-15'), symbol: 'RELIANCE', type: 'Buy', quantity: 10, exchange: 'BSE', price: 2456.75, amount: 24567.50 },
    { date: new Date('2023-02-20'), symbol: 'TCS', type: 'Buy', quantity: 5, exchange: 'NSE', price: 3345.60, amount: 16728.00 },
    { date: new Date('2023-03-10'), symbol: 'HDFCBANK', type: 'Sell', quantity: 8, exchange: 'BSE', price: 1520.25, amount: 12162.00 },
    { date: new Date('2023-04-05'), symbol: 'INFY', type: 'Buy', quantity: 15, exchange: 'NSE', price: 1450.00, amount: 21750.00 },
    { date: new Date('2023-05-12'), symbol: 'ITC', type: 'Sell', quantity: 20, exchange: 'BSE', price: 400.50, amount: 8010.00 },
    { date: new Date('2023-06-18'), symbol: 'SBIN', type: 'Buy', quantity: 25, exchange: 'NSE', price: 550.75, amount: 13768.75 },
    { date: new Date('2023-07-22'), symbol: 'ADANIPORTS', type: 'Sell', quantity: 12, exchange: 'BSE', price: 750.00, amount: 9000.00 },
    { date: new Date('2023-08-30'), symbol: 'BAJFINANCE', type: 'Buy', quantity: 7, exchange: 'NSE', price: 6700.00, amount: 46900.00 },
    { date: new Date('2023-09-15'), symbol: 'HINDUNILVR', type: 'Sell', quantity: 10, exchange: 'BSE', price: 2500.00, amount: 25000.00 },
    { date: new Date('2023-10-01'), symbol: 'WIPRO', type: 'Buy', quantity: 18, exchange: 'NSE', price: 400.00, amount: 7200.00 }
  ];
  
  bondsData: BondTransaction[] = [
    { date: new Date('2023-01-05'), name: 'GOVT 7.25% 2033', isin: 'IN0020001234', type: 'Buy', price: 100, units:10, InterestRate: 7.25, quantity: 50, faceValue: 1000, amount: 49250.00 },
    { date: new Date('2023-02-15'), name: 'RELIANCE 8.5% 2028', isin: 'INE002A00025', type: 'Buy', price: 200, units:12, InterestRate: 8.5, quantity: 30, faceValue: 1000, amount: 30750.00 }
  ];
  
  mutualFundsData: MutualFundTransaction[] = [
    { date: new Date('2023-01-10'), scheme: 'Axis Bluechip Fund', folio: 'AXBLU1234', type: 'Purchase', units: 123.456, nav: 45.6789, amount: 5638.00 },
    { date: new Date('2023-03-05'), scheme: 'SBI Small Cap Fund', folio: 'SBISM5678', type: 'Purchase', units: 89.123, nav: 125.4567, amount: 11175.00 }
  ];
  
  // Sorting
  sortColumn: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  ngOnInit(): void {
    // Initialize with default sorting
    this.applyFilters();
  }

  // Filtered data getters
  get filteredStocks(): StockTransaction[] {
    const filteredData = this.applyFiltersToData([...this.stocksData], ['symbol', 'type']);
    return this.paginateData(filteredData);
  }

  get filteredBonds(): BondTransaction[] {
    const filteredData = this.applyFiltersToData([...this.bondsData], ['name', 'isin', 'type']);
    return this.paginateData(filteredData);
  }

  get filteredMutualFunds(): MutualFundTransaction[] {
    const filteredData = this.applyFiltersToData([...this.mutualFundsData], ['scheme', 'folio', 'type']);
    return this.paginateData(filteredData);
  }

  // Total counts for pagination
  get totalStocksCount(): number {
    return this.applyFiltersToData([...this.stocksData], ['symbol', 'type']).length;
  }

  get totalBondsCount(): number {
    return this.applyFiltersToData([...this.bondsData], ['name', 'isin', 'type']).length;
  }

  get totalMutualFundsCount(): number {
    return this.applyFiltersToData([...this.mutualFundsData], ['scheme', 'folio', 'type']).length;
  }

  // active tab's total count
  get activeTabTotalCount(): number {
    switch(this.activeTab) {
      case 'stocks': return this.totalStocksCount;
      case 'bonds': return this.totalBondsCount;
      case 'mutual-funds': return this.totalMutualFundsCount;
      default: return 0;
    }
  }

  // total pages for active tab
  get totalPages(): number {
    return Math.ceil(this.activeTabTotalCount / this.pageSize);
  }

  private applyFiltersToData<T extends { date: Date; type: string }>(data: T[], searchFields: string[]): T[] {
    // Date filter
    if (this.fromDate || this.toDate) {
      const fromDate = this.fromDate ? new Date(this.fromDate) : new Date(0);
      const toDate = this.toDate ? new Date(this.toDate) : new Date();
      data = data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Type filter
    if (this.selectedType !== 'all') {
      data = data.filter(item => item.type.toLowerCase() === this.selectedType);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      data = data.filter(item => 
        searchFields.some(field => 
          String((item as any)[field]).toLowerCase().includes(query)
      ));
    }

    // Sorting
    return this.sortData(data);
  }

  // pagination to data
  private paginateData<T>(data: T[]): T[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  private sortData<T>(data: T[]): T[] {
    return data.sort((a, b) => {
      const aValue = (a as any)[this.sortColumn];
      const bValue = (b as any)[this.sortColumn];

      if (typeof aValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return this.sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
    });
  }

  // Sorting handler
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortSymbol(column: string): string {
    return this.sortColumn === column 
      ? (this.sortDirection === 'asc' ? '↑' : '↓') 
      : '';
  }

  applyFilters(): void {
    // Resetting to first page when filters change
    this.currentPage = 1;
  }

  // Helper to format dates for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Pagination controls
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; // Resetting to first page
  }

  // Get array of page numbers for pagination controls
  get pageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
  }

  exportStocksToExcel(): void {
    
    const allFilteredStocks = this.applyFiltersToData([...this.stocksData], ['symbol', 'type']);
    
    // Prepare the worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      allFilteredStocks.map(stock => ({
        Date: this.formatDateForExport(stock.date),
        Symbol: stock.symbol,
        Exchange: stock.exchange,
        Type: stock.type,
        Quantity: stock.quantity,
        Price: `₹${stock.price.toFixed(2)}`,
        Amount: `₹${stock.amount.toFixed(2)}`
      }))
    );

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Date
      { wch: 10 }, // Symbol
      { wch: 12 }, // Exchange
      { wch: 10 }, // Type
      { wch: 8 },  // Quantity
      { wch: 10 }, // Price
      { wch: 12 }  // Amount
    ];

    // Create workbook and add worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stocks');

    // Generate Excel file and download
    XLSX.writeFile(wb, `Stocks_Transactions_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  private formatDateForExport(date: any): string {
    // Converting  date format to a readable Excel date
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  // export for bonds and mutual funds and all types
 

exportBondsToExcel(): void {
  // Get all filtered data 
  const allFilteredBonds = this.applyFiltersToData([...this.bondsData], ['name', 'isin', 'type']);
  
  // Prepare the worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
    allFilteredBonds.map(bond => ({
      Date: this.formatDateForExport(bond.date),
      'Bond Name': bond.name,
      ISIN: bond.isin,
      Type: bond.type,
      Price: `₹${bond.price.toFixed(2)}`,
      Units: bond.units,
      'Interest Rate': `${bond.InterestRate}%`,
      Quantity: bond.quantity,
      'Face Value': `₹${bond.faceValue.toFixed(2)}`,
      Amount: `₹${bond.amount.toFixed(2)}`
    }))
  );

  // Set column widths
  ws['!cols'] = [
    { wch: 12 },  // Date
    { wch: 25 },  // Bond Name
    { wch: 15 },  // ISIN
    { wch: 10 },  // Type
    { wch: 10 },  // Price
    { wch: 8 },   // Units
    { wch: 12 },  // Interest Rate
    { wch: 8 },   // Quantity
    { wch: 12 },  // Face Value
    { wch: 12 }   // Amount
  ];

  // Create workbook and add worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bonds');

  // Generate Excel file and download
  XLSX.writeFile(wb, `Bonds_Transactions_${new Date().toISOString().slice(0,10)}.xlsx`);
}

exportMutualFundsToExcel(): void {
  // Get all filtered data
  const allFilteredMFs = this.applyFiltersToData([...this.mutualFundsData], ['scheme', 'folio', 'type']);
  
  // Prepare the worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
    allFilteredMFs.map(mf => ({
      Date: this.formatDateForExport(mf.date),
      Scheme: mf.scheme,
      'Folio Number': mf.folio,
      Type: mf.type,
      Units: mf.units.toFixed(3),
      NAV: `₹${mf.nav.toFixed(4)}`,
      Amount: `₹${mf.amount.toFixed(2)}`
    }))
  );

  // Set column widths
  ws['!cols'] = [
    { wch: 12 },  // Date
    { wch: 30 },  // Scheme
    { wch: 15 },  // Folio Number
    { wch: 10 },  // Type
    { wch: 10 },  // Units
    { wch: 10 },  // NAV
    { wch: 12 }   // Amount
  ];

  // Create workbook and add worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'MutualFunds');

  // Generate Excel file and download
  XLSX.writeFile(wb, `MutualFunds_Transactions_${new Date().toISOString().slice(0,10)}.xlsx`);
}

//recent transactions

get recentTransactions(): any[] {
  // Combining all transactions with their type
  const allTransactions = [
    ...this.stocksData.map(t => ({ ...t, transactionType: 'stocks' })),
    ...this.bondsData.map(t => ({ ...t, transactionType: 'bonds' })),
    ...this.mutualFundsData.map(t => ({ ...t, transactionType: 'mutual-funds' }))
  ];
  
  // Sorting by date descending and taking first 5
  return allTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}

// method to handle navigation
navigateToTransaction(transaction: any): void {
  this.activeTab = transaction.transactionType;
  this.searchQuery = transaction.symbol || transaction.name || transaction.scheme;
  this.applyFilters();
}
//clear serach
clearSearch(): void {
  this.searchQuery = '';
  this.applyFilters();
}

}