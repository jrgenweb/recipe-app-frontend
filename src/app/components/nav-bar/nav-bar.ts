import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';
import { AsyncPipe } from '@angular/common';

import { ProfilePicture } from '../profile-picture/profile-picture';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, AsyncPipe, RouterLinkActive, ProfilePicture],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  public auth: AuthService = inject(AuthService);
  constructor() {}

  onLogout(event: Event) {
    event?.preventDefault();
    this.auth.logout(); //
  }
}
