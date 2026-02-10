import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AsyncPipe } from '@angular/common';
import { RecipeService } from '../../services/recipe-service';
import { AuthService } from '../../../../shared/services/auth-service';
import { CommentStore } from '../../../comments/store/comment.store';

@Component({
  selector: 'app-add-comment',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './add-comment.html',
  styleUrl: './add-comment.scss',
})
export class AddComment implements OnInit {
  commentForm!: FormGroup;
  @Input() recipeId!: string;
  @Output() onCommentEvt = new EventEmitter<boolean>();

  private commentStore = inject(CommentStore);
  public authService: AuthService = inject(AuthService);
  constructor() {}
  ngOnInit(): void {
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.commentForm.markAllAsTouched();
    if (this.commentForm.valid) {
      //küldés
      const msg = this.commentForm.value.text;
      this.commentStore.create(this.recipeId, msg);
    }
  }
}
