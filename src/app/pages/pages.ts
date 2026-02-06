import { Component } from '@angular/core';
import { NavBar } from '../components/nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';
import { Toast } from '../components/toast/toast';

@Component({
  selector: 'app-pages',
  imports: [NavBar, RouterOutlet, Toast],
  templateUrl: './pages.html',
  styleUrl: './pages.scss',
})
export class Pages {}
