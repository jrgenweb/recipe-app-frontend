import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AdminCategoryStore } from '../../../categories/stores/admin-category.store';
import { AdminCuisineStore } from '../../../cuisines/stores/admin-cuisine.store';
import { ISelect } from '../../../../../recipes/components/select/select';
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

  categorySelectItems!: ISelect[];
  cuisinSelectItems!: ISelect[];

  public categoryStore = inject(AdminCategoryStore);
  public cuisineStore = inject(AdminCuisineStore);

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
