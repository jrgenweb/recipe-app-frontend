import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-manage',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './manage.html',
  styleUrl: './manage.scss',
})
export class Manage {}
