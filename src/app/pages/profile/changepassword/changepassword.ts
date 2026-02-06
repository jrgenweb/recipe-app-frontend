import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatchValidator } from '../../../shared/validators/match-validator';

@Component({
  selector: 'app-changepassword',
  imports: [ReactiveFormsModule],
  templateUrl: './changepassword.html',
  styleUrl: './changepassword.scss',
})
export class Changepassword implements OnInit {
  changePwForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
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

  onSubmit() {}
}
