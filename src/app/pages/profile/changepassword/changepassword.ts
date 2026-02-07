import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatchValidator } from '../../../shared/validators/match-validator';
import { AuthService } from '../../../shared/services/auth-service';
import { RatingModal } from '../../../components/rating-modal/rating-modal';

@Component({
  selector: 'app-changepassword',
  imports: [ReactiveFormsModule, RatingModal],
  templateUrl: './changepassword.html',
  styleUrl: './changepassword.scss',
})
export class Changepassword implements OnInit {
  changePwForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  constructor() {}
  ngOnInit(): void {
    this.changePwForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        newConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: [MatchValidator.validate('newPassword', 'newConfirmPassword')] },
    );
  }

  onSubmit() {
    this.changePwForm.markAllAsTouched();
    if (this.changePwForm.invalid) return;

    const { oldPassword, newPassword } = this.changePwForm.value;
    this.authService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.changePwForm.reset();
      },
      error: () => {},
    });
  }
}
