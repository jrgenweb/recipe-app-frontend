import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IRegister } from '@recipe/shared';
import { AuthService } from '../../../shared/services/auth-service';
import { asyncImageValidator } from '../../../shared/validators/async-image-validator';
import { MatchValidator } from '../../../shared/validators/match-validator';
import { ToastService } from '../../../shared/services/toast-service';
import { Router } from '@angular/router';
import { AsyncEmailValidator } from '../../../shared/validators/async-email.validator';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp implements OnInit {
  signUpForm!: FormGroup;
  serverError: string = '';
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  private asyncEmailValidator = inject(AsyncEmailValidator);

  constructor() {}
  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        email: new FormControl(
          '',
          [Validators.required, Validators.email],
          this.asyncEmailValidator.validate(),
        ),
        //lastname: new FormControl('', [Validators.required]),
        //firstname: new FormControl('', [Validators.required]),
        picture: new FormControl('', [Validators.required], [asyncImageValidator()]),
        name: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      },
      { validators: [MatchValidator.validate('password', 'confirmpassword')] },
    );
  }

  public onSignUp() {
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.valid) {
      // service hívás
      const formValue = this.signUpForm.value;
      const newUser: IRegister = {
        email: formValue.email,
        name: formValue.name,
        password: formValue.password,
        picture: formValue.picture,
      };
      this.authService.register(newUser).subscribe({
        next: (resp) => {
          if (resp.user) {
            this.toastService.add({ message: 'Sikeres regisztráció!', type: 'success' });
            this.router.navigate(['/login']);
          } else {
            this.toastService.add({ message: 'Hiba történt', type: 'danger' });
          }
        },
        error: () => {
          this.serverError = 'Hiba történt!';
        },
      });
    }
  }
}
