// features/auth/login/login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,NavComponent,FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.error = 'Invalid email or password';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'An error occurred during login';
        this.loading = false;
      },
    });
  }
}
