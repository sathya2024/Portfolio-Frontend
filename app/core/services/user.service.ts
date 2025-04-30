import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // So it's available everywhere automatically
})
export class UserService {
  private emailSubject = new BehaviorSubject<string | null>(this.getEmailFromStorage());

  // Observable for other components to subscribe to
  email$ = this.emailSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Get email from localStorage (browser-safe)
  private getEmailFromStorage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('email');
    } else {
      console.warn('localStorage is not available on the server.');
      return null;
    }
  }

  setEmail(email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('email', email);
      this.emailSubject.next(email);
    } else {
      console.warn('Cannot set email in localStorage on the server.');
    }
  }

  clearEmail(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('email');
      this.emailSubject.next(null);
    } else {
      console.warn('Cannot clear email from localStorage on the server.');
    }
  }

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    } else {
      console.warn(`localStorage is not available on the server for key: ${key}`);
      return null;
    }
  }
  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    } else {
      console.warn(`Cannot set key: ${key} in localStorage on the server.`);
    }
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    } else {
      console.warn(`Cannot remove key: ${key} from localStorage on the server.`);
    }
  }
}