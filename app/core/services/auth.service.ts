import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { MockDataService } from './mock-data.service';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private mockDataService: MockDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.mockDataService.getUsers().pipe(
      tap((users) => {
        const user =
          users.find((u) => u.email === email && u.password === password) ||
          null;
        if (user && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      }),
      map(
        (users: User[]) =>
          users.find((u) => u.email === email && u.password === password) ||
          null
      )
    );
  }

  signup(user: User): Observable<User> {
    return this.mockDataService.addUser(user).pipe(
      tap((newUser) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(newUser));
        }
        this.currentUserSubject.next(newUser);
      })
    );
  }

  resetPassword(email: string): Observable<boolean> {
    return of(true);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
