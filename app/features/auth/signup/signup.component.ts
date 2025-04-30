import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';  // Removed Validators
import { RouterModule, Router } from '@angular/router';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import * as bcrypt from 'bcryptjs';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NavComponent } from '../../nav/nav.component';
 
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,FooterComponent,NavComponent,HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // optional if you're adding custom styles
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showModal = false;
  showPassword = false;
 
  securityQuestions: string[] = [
    'What is your pet\'s name?',
    'What is your mother\'s maiden name?',
    'What was your first school?',
    'What is your favorite book?'
  ];
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }
 
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)]],
      confirmPassword: ['', [Validators.required]],
      securityQuestion: ['', [Validators.required]],
      securityAnswer: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
 
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
 
  get f() {
    return this.registerForm.controls;
  }
 
  onSubmit(): void {
    this.submitted = true;
 
    if (this.registerForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
 
    const userData = this.registerForm.value;
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    userData.confirmPassword = userData.password; // store hashed confirm password also, optional
    delete userData.confirmPassword;
    console.log('Encrypted User Data:', userData);
   
    this.http.post('http://localhost:3000/users', userData).subscribe({
      next: (res) => {
        console.log('User registered:', res);
        this.registerForm.reset();
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error registering user:', err);
      }
    });
  }
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
  closeModal(): void {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
}
 