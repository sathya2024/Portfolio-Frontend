import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as bcrypt from 'bcryptjs';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,NavComponent, ReactiveFormsModule, RouterModule,HttpClientModule,FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'] // optional
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  submitted = false;
  showModal = false;

  securityQuestions: string[] = [
    'What is your pet\'s name?',
    'What is your mother\'s maiden name?',
    'What was your first school?',
    'What is your favorite book?'
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      securityQuestion: ['', [Validators.required]],
      securityAnswer: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmNewPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = this.forgotPasswordForm.value;

    // Simulate reset password by finding the user and updating their password
    this.http.get<any[]>('http://localhost:3000/users').subscribe(users => {
      const user = users.find(u => u.email === formData.email && u.securityQuestion === formData.securityQuestion && u.securityAnswer === formData.securityAnswer);

      if (user) {

        const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(formData.newPassword, salt);

        this.http.patch(`http://localhost:3000/users/${user.id}`, { password: hashedPassword }).subscribe({
          next: (res) => {
            console.log('Password updated:', res);
            this.showModal = true;
          },
          error: (err) => {
            console.error('Error updating password:', err);
            alert('Something went wrong while updating password.');
          }
        });
      } else {
        alert('Incorrect email, security question, or answer.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  
  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
}