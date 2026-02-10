import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

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
  //categoryId: string = '';
  categorySelectItems!: ISelect[];
  cuisinSelectItems!: ISelect[];
  selectedCategory!: ISelect;
  selectedCuisin!: ISelect;

  public categoryStore: CategoryStore = inject(CategoryStore);
  public cuisineStore: CuisineStore = inject(CuisineStore);

  constructor() {}

  ngOnInit(): void {
    this.categoryStore.loadAll();
    this.cuisineStore.loadAll();

    this.categorySelectItems = this.categoryStore.categories().map((c) => {
      return {
        value: c.id,
        label: c.name,
      };
    });

    this.cuisinSelectItems = this.cuisineStore.cuisines().map((c) => {
      return {
        value: c.id!,
        label: c.name,
      };
    });
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
