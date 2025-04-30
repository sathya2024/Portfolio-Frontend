import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Investment, Transaction } from '../models/investment';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private users: User[] = [
    {
      id: 1,
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
      name: 'sathya',
    },
    {
      id: 2,
      username: 'user2',
      email: 'user2@example.com',
      password: 'password123',
      name: 'User Two',
    },
  ];

  private investments: Investment[] = [
    // Stocks
    {
      id: 1,
      userId: 1,
      ticker: 'AAPL',
      quantity: 10,
      purchasePrice: 150.75,
      currentPrice: 175.5,
      currentValue: 1755.0,
      change: 247.5,
      changePercentage: 16.42,
      purchaseDate: new Date('2023-01-15'),
      type: 'stock',
    },
    {
      id: 2,
      userId: 1,
      ticker: 'MSFT',
      quantity: 5,
      purchasePrice: 245.5,
      currentPrice: 290.75,
      currentValue: 1453.75,
      change: 226.25,
      changePercentage: 18.43,
      purchaseDate: new Date('2023-02-10'),
      type: 'stock',
    },
    // Bonds
    {
      id: 3,
      userId: 1,
      ticker: 'US10Y',
      quantity: 10,
      purchasePrice: 1000,
      currentPrice: 1025,
      currentValue: 10250,
      change: 250,
      changePercentage: 2.5,
      purchaseDate: new Date('2023-03-01'),
      type: 'bond',
    },
    {
      id: 4,
      userId: 1,
      ticker: 'CORPBOND',
      quantity: 20,
      purchasePrice: 950,
      currentPrice: 970,
      currentValue: 19400,
      change: 400,
      changePercentage: 2.1,
      purchaseDate: new Date('2023-04-01'),
      type: 'bond',
    },
    {
      id: 5,
      userId: 1,
      ticker: 'VFIAX',
      quantity: 50,
      purchasePrice: 350,
      currentPrice: 375,
      currentValue: 18750,
      change: 1250,
      changePercentage: 6.67,
      purchaseDate: new Date('2023-02-15'),
      type: 'mutual-fund',
    },
    {
      id: 6,
      userId: 1,
      ticker: 'FXAIX',
      quantity: 30,
      purchasePrice: 400,
      currentPrice: 420,
      currentValue: 12600,
      change: 600,
      changePercentage: 5,
      purchaseDate: new Date('2023-03-10'),
      type: 'mutual-fund',
    },
    
    {
      id: 7,
      userId: 1,
      ticker: 'GOLDBOND1',
      quantity: 5,
      purchasePrice: 5000,
      currentPrice: 5200,
      currentValue: 26000,
      change: 1000,
      changePercentage: 4,
      purchaseDate: new Date('2023-01-20'),
      type: 'gold-bond',
    },
    {
      id: 8,
      userId: 1,
      ticker: 'GOLDBOND2',
      quantity: 3,
      purchasePrice: 4800,
      currentPrice: 5000,
      currentValue: 15000,
      change: 600,
      changePercentage: 4.17,
      purchaseDate: new Date('2023-02-25'),
      type: 'gold-bond',
    },
  ];

  private transactions: Transaction[] = [
    {
      id: 1,
      userId: 1,
      ticker: 'AAPL',
      quantity: 10,
      price: 150.75,
      date: new Date('2023-01-15'),
      type: 'buy',
      total: 1507.5,
    },
    {
      id: 2,
      userId: 1,
      ticker: 'MSFT',
      quantity: 5,
      price: 245.5,
      date: new Date('2023-02-10'),
      type: 'buy',
      total: 1227.5,
    },
    {
      id: 3,
      userId: 1,
      ticker: 'TSLA',
      quantity: 3,
      price: 670.0,
      date: new Date('2023-03-22'),
      type: 'buy',
      total: 2010.0,
    },
  ];

  
  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  addUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: this.users.length + 1,
    };
    this.users.push(newUser);
    return of(newUser);
  }

 
  getInvestments(userId: number): Observable<Investment[]> {
    return of(
      this.investments.filter((investment) => investment.userId === userId)
    );
  }

  
  getTransactions(userId: number): Observable<Transaction[]> {
    return of(
      this.transactions.filter((transaction) => transaction.userId === userId)
    );
  }
}
