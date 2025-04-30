import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5154'; 

  constructor(private http: HttpClient) {}

 
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  
  getInvestments(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/investments?userId=${userId}`);
  }

  
  getTransactions(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/transactions?userId=${userId}`);
  }


  searchStocks(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get(`${this.baseUrl}/api/StockSearch/search`, { params });
  }
}