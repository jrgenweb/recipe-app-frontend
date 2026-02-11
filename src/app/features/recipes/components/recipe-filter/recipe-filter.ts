import { Component, computed, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ISelect, Select, TSelect } from '../select/select';

import { CategoryStore } from '../../../categories/store/category.store';
import { CuisineStore } from '../../../cuisines/stores/cuisine.store';
import { toObservable } from '@angular/core/rxjs-interop';

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

  selectedCategory!: ISelect;
  selectedCuisin!: ISelect;

  categorySelectItems = computed(() =>
    this.categoryStore.categories().map((c) => ({ value: c.id, label: c.name })),
  );

  cuisinSelectItems = computed(() =>
    this.cuisineStore.cuisines().map((c) => ({ value: c.id!, label: c.name })),
  );
  public categoryStore: CategoryStore = inject(CategoryStore);
  public cuisineStore: CuisineStore = inject(CuisineStore);

  constructor() {}

  ngOnInit(): void {
    this.categoryStore.loadAll();
    this.cuisineStore.loadAll();
  }

  onCategoryChange(selected: TSelect) {
    selected = Array.isArray(selected) ? selected : [selected];
    this.changeCategoryIdEvt.emit(String(selected[0].value) || '');
  }
  onCuisinChange(selected: TSelect) {
    selected = Array.isArray(selected) ? selected : [selected];
    this.changeCusinIdEvt.emit(String(selected[0].value) || '');
  }
  onSearchStringChange() {
    this.changeSearchStringEvt.emit(this.searchString);
  }
}
