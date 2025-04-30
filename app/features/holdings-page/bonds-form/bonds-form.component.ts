import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bonds-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bonds-form.component.html',
  styleUrls: ['./bonds-form.component.scss'],
})
export class BondsFormComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      date: [new Date().toISOString().substring(0, 10)],
      amount: [''],
      rate: [''],
      frequency: ['Quarterly'],
      maturity: [''],
      interestType: ['accrued'],
    });
  }
  submit() {}
}
