import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IRegister } from '@recipe/shared';
import { AuthService } from '../../../shared/services/auth-service';
import { asyncImageValidator } from '../../../shared/validators/async-image-validator';
import { MatchValidator } from '../../../shared/validators/match-validator';

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

  constructor() {}
  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        //lastname: new FormControl('', [Validators.required]),
        //firstname: new FormControl('', [Validators.required]),
        picture: new FormControl('', [], [asyncImageValidator()]),
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
        next: () => {},
        error: () => {
          this.serverError = 'Regisztrációs hiba a szerveren!';
        },
      });
    }
  }
}
