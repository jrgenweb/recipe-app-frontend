import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav-bar.html',
  styleUrl: './admin-nav-bar.scss',
})
export class AdminNavBar {}
