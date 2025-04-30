import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gold-bonds-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gold-bonds-form.component.html',
  styleUrls: ['./gold-bonds-form.component.scss'],
})
export class GoldBondsFormComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      date: [new Date().toISOString().substring(0, 10)],
      units: [''],
      price: [''],
      brokerage: ['0.100000'],
      coupon: [''],
      maturity: [''],
    });
  }
  submit() {}
}
