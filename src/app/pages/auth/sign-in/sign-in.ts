import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast-service';
import { toObservable } from '@angular/core/rxjs-interop';

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

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        this.router.navigate(['/recipes']);
      }
    });
  }
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
        next: () => {
          this.router.navigate(['/recipes']);
          this.invalidLogin.set(false);
        },
        error: () => {
          this.invalidLogin.set(true);
        },
      });
    }
  }
}
