import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecipeService } from '../../../shared/services/recipe-service';
import { AuthService } from '../../../shared/services/auth-service';
import { AsyncPipe } from '@angular/common';

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
  constructor(
    private recipeService: RecipeService,
    public authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.commentForm.markAllAsTouched();
    if (this.commentForm.valid) {
      //küldés
      this.recipeService
        .postComment(this.recipeId, this.commentForm.value.text)
        .subscribe((resp) => {
          this.onCommentEvt.emit(true);
        });
    }
  }
}
