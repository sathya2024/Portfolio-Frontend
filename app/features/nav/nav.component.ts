import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  currentUrl: string = '';
  userInitial: string = '';

  constructor(public router: Router, private userService: UserService) {} 
  ngOnInit() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });

      // Subscribe to email changes from UserService
    this.userService.email$.subscribe(email => {
      this.setUserInitial(email);
    });

    // Also load initial value from localStorage (for page refresh case)
    const email = localStorage.getItem('email');

      this.setUserInitial(email);

  }
  
  logout() {
    localStorage.clear();   
    this.userService.clearEmail();
    this.router.navigate(['']);  
  }

  shouldShowAvatarAndLogout(): boolean {
    const hideOnRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
  return !hideOnRoutes.includes(this.currentUrl);
  }

  setUserInitial(email: string | null) {
   
    // const email = localStorage.getItem('email');
    
    console.log('Email from localStorage:', email);  // Debugging line
    if (email && email.length > 0) {
      this.userInitial = email.charAt(0).toUpperCase();  // Get first character and capitalize
    } else {
    }
  }

}
