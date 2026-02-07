import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth-service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit {
  loginForm!: FormGroup;
  invalidLogin = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe({
        next: (resp) => {
          if (resp.user.role === 'ADMIN') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/']);
          }

          //this.toastService.add({ message: 'Hibás email vagy jelszó', type: 'danger' });
          this.invalidLogin.set(false);
        },
        error: () => {
          this.invalidLogin.set(true);
          //this.toastService.add({ message: 'Hibás email vagy jelszó', type: 'danger' });
        },
      });
    }
  }
}
