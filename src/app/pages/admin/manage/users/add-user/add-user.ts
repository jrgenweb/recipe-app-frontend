import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IAdminCreateUser, IUser } from '@recipe/shared';

import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../features/admin/features/users/services/user-service';
import { asyncImageValidator } from '../../../../../shared/validators/async-image-validator';
import { MatchValidator } from '../../../../../shared/validators/match-validator';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser implements OnInit {
  addUserForm!: FormGroup;
  serverError: string = '';
  isEditMode = signal(false);
  editingUserId: string = '';
  //user!: IUser;

  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user = signal<IUser | undefined>(undefined);

  constructor() {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.editingUserId = params['id'];
        this.loadUserData(params['id']);
      } else {
        this.initializeForm();
      }
    });
  }

  private loadUserData(userId: string) {
    // Assuming userService has a method to fetch single user
    // For now, we'll initialize form with empty password fields for edit mode
    this.userService.getById(userId).subscribe((user) => {
      this.user.set(user);
      this.initializeForm(true);
    });
  }

  private initializeForm(isEdit = false) {
    const passwordValidators = isEdit
      ? [Validators.minLength(6)]
      : [Validators.required, Validators.minLength(6)];

    this.addUserForm = new FormGroup(
      {
        email: new FormControl(this.user()?.email ?? '', [Validators.required, Validators.email]),
        picture: new FormControl(this.user()?.picture ?? '', [], [asyncImageValidator()]),
        name: new FormControl(this.user()?.name ?? '', [Validators.required]),
        role: new FormControl(this.user()?.role ?? 'USER', [Validators.required]),
        password: new FormControl('', passwordValidators),
        confirmpassword: new FormControl('', passwordValidators),
      },
      { validators: [MatchValidator.validate('password', 'confirmpassword')] },
    );
  }

  public onSubmit() {
    this.addUserForm.markAllAsTouched();
    if (this.addUserForm.valid) {
      const formValue = this.addUserForm.value;

      if (this.isEditMode()) {
        // Update mode
        const updateData: Partial<IAdminCreateUser> = {
          email: formValue.email,
          name: formValue.name,
          picture: formValue.picture,
          role: formValue.role,
        };
        // Only include password if it's not empty
        if (formValue.password) {
          updateData.password = formValue.password;
        }
        this.userService.update(this.editingUserId, updateData).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/manage/users']);
          },
          error: () => {
            this.serverError = 'Hiba a frissítés során!';
          },
        });
      } else {
        // Create mode
        const newUser: IAdminCreateUser = {
          email: formValue.email,
          name: formValue.name,
          password: formValue.password,
          picture: formValue.picture,
          role: formValue.role,
        };
        this.userService.create(newUser);
        this.router.navigate(['/dashboard/manage/users']);
      }
    }
  }
}
