import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Toast } from '../components/toast/toast';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, Toast],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
