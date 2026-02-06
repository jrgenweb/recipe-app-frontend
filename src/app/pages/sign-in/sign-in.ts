import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn implements OnInit {
  loginForm!: FormGroup;

  invalidLogin = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Vali', this.loginForm.value);

      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          this.invalidLogin = false;
          this.router.navigate(['/recipes']);
        },
        error: (err) => {
          this.invalidLogin = true;
          console.log(err);
        },
      });
    }
  }
}
