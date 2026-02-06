import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth-service';

@Component({
  selector: 'app-general',
  imports: [ReactiveFormsModule],
  templateUrl: './general.html',
  styleUrl: './general.scss',
})
export class General implements OnInit {
  generalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    const user = this.authService.currentUser();

    this.generalForm = this.fb.group({
      name: [user?.name, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
    });
  }
  onEdit() {}
}
