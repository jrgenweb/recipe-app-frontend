import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-delete',
  imports: [FormsModule],
  templateUrl: './delete.html',
  styleUrl: './delete.scss',
})
export class Delete {
  password: string = '';

  authService = inject(AuthService);

  onDelete() {
    if (this.password.length === 0) return;
    this.authService.deleteUser(this.password);
  }
}
