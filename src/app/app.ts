import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CuisineStore } from './features/cuisines/stores/cuisine.store';
import { CategoryStore } from './features/categories/store/category.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  public categoryStore: CategoryStore = inject(CategoryStore);
  public cuisineStore: CuisineStore = inject(CuisineStore);
  constructor() {
    this.categoryStore.loadAll();
    this.cuisineStore.loadAll();
  }
}
