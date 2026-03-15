import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

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
  @Input() selectedCategory?: ISelect;
  @Input() selectedCuisine?: ISelect;
  @Input() searchString: string = '';

  public categoryStore: CategoryStore = inject(CategoryStore);
  public cuisineStore: CuisineStore = inject(CuisineStore);

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
