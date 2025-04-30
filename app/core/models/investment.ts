export interface Investment {
  id: number;
  userId: number;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice?: number;
  currentValue?: number;
  change?: number;
  changePercentage?: number;
  purchaseDate: Date;
  perDayChange?: number;
  type: 'stock' | 'bond' | 'mutual-fund' | 'gold-bond'; 
}

export interface Transaction {
  id: number;
  userId: number;
  ticker: string;
  quantity: number;
  price: number;
  date: Date;
  type: 'buy' | 'sell';
  total: number;
}


export interface Stock {
  id: number;
  ticker: string;
  companyName: string;
  sector: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  dividendYield?: number;
  marketCap?: number;
}

export interface Bond {
  id: number;
  bondName: string;
  issuer: string;
  faceValue: number;
  couponRate: number; 
  maturityDate: Date;
  purchaseDate: Date;
  quantity: number;
  purchasePrice: number;
  currentValue?: number;
}

export interface MutualFund {
  id: number;
  fundName: string;
  fundManager: string;
  nav: number; 
  units: number;
  purchaseDate: Date;
  expenseRatio?: number;
  category: string; 
}

export interface GoldBond {
  id: number;
  bondName: string;
  issuer: string;
  grams: number; 
  purchasePricePerGram: number;
  currentPricePerGram?: number;
  purchaseDate: Date;
  maturityDate: Date;
  interestRate?: number; 
}
