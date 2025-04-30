// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { NavComponent } from "./features/nav/nav.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,NavComponent,HomeComponent,DashboardComponent],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'portfolio-tracker';
}



