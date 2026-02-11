import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth-service';
import { ProfilePicture } from '../../../../components/profile-picture/profile-picture';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [RouterLink, RouterLinkActive, ProfilePicture],
  templateUrl: './admin-nav-bar.html',
  styleUrl: './admin-nav-bar.scss',
})
export class AdminNavBar {
  public auth = inject(AuthService);

  onLogout(event: Event) {
    event.preventDefault();
    this.auth.logout();
  }
}
