import { Component, computed, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ISelect, Select, TSelect } from '../select/select';

import { CategoryStore } from '../../../categories/store/category.store';
import { CuisineStore } from '../../../cuisines/stores/cuisine.store';

@Component({
  selector: 'app-recipe-filter',
  imports: [FormsModule, Select],
  templateUrl: './recipe-filter.html',
  styleUrl: './recipe-filter.scss',
})
export class RecipeFilter implements OnInit {
  @Output() changeCategoryIdEvt = new EventEmitter<string>();
  @Output() changeCusinIdEvt = new EventEmitter<string>();
  @Output() changeSearchStringEvt = new EventEmitter<string>();

  searchString: string = '';

  public categoryStore: CategoryStore = inject(CategoryStore);
  public cuisineStore: CuisineStore = inject(CuisineStore);
  selectedCategory: ISelect = this.categoryStore.selectedCategory()
    ? {
        value: this.categoryStore.selectedCategory()!.id!,
        label: this.categoryStore.selectedCategory()!.name,
      }
    : { value: 'all', label: 'Összes' };
  selectedCuisin: ISelect = this.cuisineStore.selectedCuisine()
    ? {
        value: this.cuisineStore.selectedCuisine()!.id!,
        label: this.cuisineStore.selectedCuisine()!.name,
      }
    : { value: 'all', label: 'Összes' };
  categorySelectItems = computed(() =>
    this.categoryStore.categories().map((c) => ({ value: c.id, label: c.name })),
  );

  cuisinSelectItems = computed(() =>
    this.cuisineStore.cuisines().map((c) => ({ value: c.id!, label: c.name })),
  );

  constructor() {}

  ngOnInit(): void {}

  onCategoryChange(selected: TSelect) {
    selected = Array.isArray(selected) ? selected : [selected];
    this.categoryStore.addSelected(
      this.categoryStore.categories().find((c) => c.id === selected[0].value)!,
    );
    this.changeCategoryIdEvt.emit(String(selected[0].value) || '');
  }
  onCuisinChange(selected: TSelect) {
    selected = Array.isArray(selected) ? selected : [selected];
    this.cuisineStore.addSelected(
      this.cuisineStore.cuisines().find((c) => c.id === selected[0].value)!,
    );
    this.changeCusinIdEvt.emit(String(selected[0].value) || '');
  }
  onSearchStringChange() {
    this.changeSearchStringEvt.emit(this.searchString);
  }
}
