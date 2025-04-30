import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mutual-funds-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mutual-funds-form.component.html',
  styleUrls: ['./mutual-funds-form.component.css'],
})
export class MutualFundsFormComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      scheme: [''],
      folio: [''],
      date: [new Date().toISOString().substring(0, 10)],
      amount: [''],
      price: [''],
      unitType: ['Rupees'],
    });
  }
  submit() {}
}
