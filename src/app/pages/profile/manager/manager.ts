import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLinkWithHref,
  RouterLink,
  ActivatedRoute,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-manager',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './manager.html',
  styleUrl: './manager.scss',
})
export class Manager {
  constructor(private route: ActivatedRoute) {}
}
