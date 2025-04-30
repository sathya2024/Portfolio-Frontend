import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-stocks-form',
  standalone: true,
  imports: [ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './stocks-form.component.html',
  styleUrls: ['./stocks-form.component.css'],
})
export class StocksFormComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      stockName: [''],
      demat: [''],
      date: [new Date().toISOString().substring(0, 10)],
      shares: [''],
      brokerage: ['0.100000'],
      price: [''],
    });
  }
  submit() {
    // Handle submit
  }
}
