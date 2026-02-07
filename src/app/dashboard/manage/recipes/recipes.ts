import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { RecipeFilter } from '../../../components/recipe-filter/recipe-filter';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RecipeService } from '../../../shared/services/recipe-service';
import { FavoriteService } from '../../../shared/services/favorite-service';
import { AuthService } from '../../../shared/services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IRecipeIngredient, IRecipeList } from '@recipe/shared';
import { RecipeCard } from '../../../components/recipe-card/recipe-card';
import { InfiniteScroll } from '../../../components/infinite-scroll/infinite-scroll';
import { ConfirmModal } from '../../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-recipes',
  imports: [RecipeFilter, RouterLink, RouterLinkActive, RecipeCard, InfiniteScroll, ConfirmModal],
  templateUrl: './recipes.html',
  styleUrl: './recipes.scss',
})
export class Recipes implements OnInit {
  // Signals a filter state-re
  categoryId = signal('');
  cuisinId = signal('');
  searchString = signal('');

  //Services
  private recipeService = inject(RecipeService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  recipes = toSignal(this.recipeService.recipes$, { initialValue: { data: [], total: 0 } });
  favoriteRecipeIds = toSignal(this.favoriteService.favoriteIds$, { initialValue: [] });
  ingredientIds = signal<string[]>([]);

  // Scroll signal – jelez, ha többet kell betölteni
  scrollSignal = signal(false);

  isShowDeleteConfirm = signal(false);
  selectedRecipe = signal<IRecipeList | null>(null);

  // Computed view model
  vm = computed(() => ({
    categoryId: this.categoryId(),
    cuisinId: this.cuisinId(),
    searchString: this.searchString(),
    recipes: this.recipes(),
    favoriteRecipes: this.favoriteRecipeIds(),
    loading: this.recipeService.loading,
    hasResults: this.recipeService.recipes$.value.data?.length > 0,
  }));

  // 🔥 Effect a filter változásokra
  private filterEffect = effect(() => {
    this.categoryId();
    this.cuisinId();
    this.searchString();
    this.ingredientIds();

    // minden változáskor reset + loadNext
    this.recipeService.reset();
    this.loadNext();
  });
  // 🔥 Effect a scroll signal-re
  private scrollEffect = effect(() => {
    if (this.scrollSignal()) {
      this.loadNext();
      this.scrollSignal.set(false); // reset jelzés
    }
  });
  constructor() {}

  ngOnInit(): void {
    // Alapadatok
    this.favoriteService.getAll();
  }

  // LoadNext mindig signalsból hívható
  loadNext() {
    this.recipeService.loadNext(
      this.searchString(),
      this.categoryId(),
      this.cuisinId(),
      this.ingredientIds(),
    );
  }

  // Setterek – ez triggereli az effect-et
  changeCategory(categoryId: string) {
    this.categoryId.set(categoryId);
  }

  changeCuisin(cuisinId: string) {
    this.cuisinId.set(cuisinId);
  }

  changeSearchString(searchString: string) {
    this.searchString.set(searchString);
  }

  onChangeIngredient(ingredients: IRecipeIngredient[]) {
    const ingredientIds = ingredients.map((i) => i.id);
    this.ingredientIds.set(ingredientIds);
  }
  onScroll(scroll: boolean) {
    if (scroll) {
      this.scrollSignal.set(true);
    }
  }
  showDeleteConfirm(recipe: IRecipeList) {
    this.selectedRecipe.set(recipe);
    if (this.selectedRecipe()) {
      this.isShowDeleteConfirm.set(true);
    }
  }
  onConfirmDelete(confirm: boolean) {
    if (confirm && this.selectedRecipe()) {
      //this.deleteRecipe(this.selectedRecipe()!.id);
    }
    this.isShowDeleteConfirm.set(false);
  }
}
