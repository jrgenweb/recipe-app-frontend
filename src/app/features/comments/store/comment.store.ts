import { inject, Injectable, signal, computed } from '@angular/core';

import { IRecipeCategoryResponse, IRecipeCommentResponse } from '@recipe/shared';
import { finalize } from 'rxjs';

import { ToastService } from '../../../shared/services/toast-service';
import { CommentService } from '../services/comment.service';

export interface IRecipeCommessdntResponse {
  createdAt: string;
  id: string;
  recipeId: string;
  text: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    picture: string;
  };
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class CommentStore {
  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  // --- State ---
  private _comments = signal<IRecipeCommentResponse[]>([]);

  // --- Selectors ---

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // --- Selectors (Publikus readonly jelek) ---
  readonly comments = computed(() => this._comments());
  readonly total = computed(() => this._comments().length);
  readonly isLoading = computed(() => this._loading());

  // --- Actions ---

  /** Kezdeti betöltés vagy keresés */
  loadAll(recipeId: string) {
    this._loading.set(true);
    this.commentService.getAll(recipeId).subscribe({
      next: (resp) => {
        this._comments.set(resp.data);
      },
      error: (_err) => {
        this.toastService.add({ message: 'Szerver hiba', type: 'danger' });
      },
      complete: () => this._loading.set(false),
    });
  }

  /** Végtelen görgetéshez (Infinite Scroll) */
  loadNext(categoryId: string) {
    if (this._loading() || (this.total() > 0 && this.comments().length >= this.total())) return;
    this._loading.set(true);
    const skip = this.comments().length;
    this.commentService
      .fetchCategories(categoryId, skip, 20)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe((resp) => {
        this._comments.update((state) => {
          return [...state, ...resp.data];
        });
      });
  }
  create(recipeId: string, msg: string) {
    this.commentService.create(recipeId, msg).subscribe({
      next: (resp) => {
        this._comments.update((state) => {
          return [resp, ...state];
        });
      },
      error: () => {},
      complete: () => {},
    });
  }

  reset() {
    this._comments.set([]);
    this._loading.set(false);
  }
}
