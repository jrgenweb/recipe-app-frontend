import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IAdminCreateUser, IUser } from '@recipe/shared';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { asyncImageValidator } from '../../../../../shared/validators/async-image-validator';
import { MatchValidator } from '../../../../../shared/validators/match-validator';
import { AdminUserStore } from '../../../../../features/admin/features/users/stores/user.store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  addUserForm!: FormGroup;
  serverError: string = '';
  isEditMode = signal(false);
  editingUserId: string = '';

  public userStore = inject(AdminUserStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user = signal<IUser | undefined>(undefined);

  constructor() {
    effect(() => {
      const user = this.userStore.selectedUser();
      if (user) {
        this.user.set(user);
        this.initializeForm(true);
      }
    });
    toObservable(this.userStore.selectedUser)
      .pipe(
        filter((user): user is IUser => !!user),
        take(1), // automatikus unsubscribe!
      )
      .subscribe((user) => {
        this.user.set(user);
        console.log(user);
        this.initializeForm(true);
      });
  }
  ngOnInit(): void {
    this.initializeForm();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode.set(true);
        this.editingUserId = params['id'];
        this.loadUserData(params['id']);
      }
    });
  }

  private loadUserData(userId: string) {
    this.userStore.getById(userId);
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
        this.userStore.update(this.editingUserId, updateData);
      } else {
        // Create mode
        const newUser: IAdminCreateUser = {
          email: formValue.email,
          name: formValue.name,
          password: formValue.password,
          picture: formValue.picture,
          role: formValue.role,
        };
        this.userStore.create(newUser);
        this.router.navigate(['/dashboard/manage/users']);
      }
    }
  }
}
