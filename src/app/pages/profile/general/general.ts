import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';
import { asyncImageValidator } from '../../../shared/validators/async-image-validator';
import { ProfilePicture } from '../../../components/profile-picture/profile-picture';

@Component({
  selector: 'app-general',
  imports: [ReactiveFormsModule, ProfilePicture],
  templateUrl: './general.html',
  styleUrl: './general.scss',
})
export class General implements OnInit {
  generalForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  constructor() {}
  ngOnInit(): void {
    const user = this.authService.currentUser();

    this.generalForm = this.fb.group({
      name: [user?.name, Validators.required],
      picture: [user?.picture, Validators.required, [asyncImageValidator()]],
      email: [user?.email, [Validators.required, Validators.email]],
    });
  }
  onEdit() {
    this.generalForm.markAllAsTouched();

    if (this.generalForm.invalid) return;

    this.authService.updateUser(this.generalForm.value);
  }
}
