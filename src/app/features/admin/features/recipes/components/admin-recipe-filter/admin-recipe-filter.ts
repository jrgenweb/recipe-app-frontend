import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { AdminCategoryStore } from '../../../categories/stores/admin-category.store';
import { AdminCuisineStore } from '../../../cuisines/stores/admin-cuisine.store';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-recipe-filter',
  imports: [FormsModule],
  templateUrl: './admin-recipe-filter.html',
  styleUrl: './admin-recipe-filter.scss',
})
export class AdminRecipeFilter {
  @Output() changeCategoryIdEvt = new EventEmitter<string>();
  @Output() changeCusinIdEvt = new EventEmitter<string>();
  @Output() changeSearchStringEvt = new EventEmitter<string>();

  searchString: string = '';
  selectedCategoryId = '';
  selectedCuisineId = '';

  public categoryStore = inject(AdminCategoryStore);
  public cuisineStore = inject(AdminCuisineStore);

  categorySelectItems = computed(() =>
    this.categoryStore.categories().map((c) => ({ value: c.id, label: c.name })),
  );
  cuisinSelectItems = computed(() =>
    this.cuisineStore.cuisines().map((c) => ({ value: c.id, label: c.name })),
  );

  constructor() {}

  ngOnInit(): void {
    this.categoryStore.loadAll();
    this.cuisineStore.loadAll();
  }

  onCategoryChange() {
    this.changeCategoryIdEvt.emit(this.selectedCategoryId);
  }
  onCuisinChange() {
    this.changeCusinIdEvt.emit(this.selectedCuisineId);
  }
  onSearchStringChange() {
    this.changeSearchStringEvt.emit(this.searchString);
  }
}
