import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { StocksFormComponent } from './features/holdings-page/stocks-form/stocks-form.component'; 
import { RouterModule } from '@angular/router'; 
import { TransactionsComponent } from './features/Transaction-page/transactions/transactions.component'; 
import { RecenttransactionComponent } from './features/Transaction-page/recenttransaction/recenttransaction.component'; 
@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent, 
  RecenttransactionComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule, 
    HttpClientModule, 
    RouterModule.forRoot([]), 
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule {}