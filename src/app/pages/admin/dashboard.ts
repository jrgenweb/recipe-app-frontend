import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AdminNavBar } from '../../features/admin/components/admin-nav-bar/admin-nav-bar';
import { Toast } from '../../components/toast/toast';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, Toast, AdminNavBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
