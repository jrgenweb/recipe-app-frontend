import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { CategoryService } from '../../shared/services/category-service';

import { FormsModule } from '@angular/forms';
import { ISelect, Select, TSelect } from '../select/select';
import { CuisinService } from '../../shared/services/cuisine-service';

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

  public categoryService: CategoryService = inject(CategoryService);
  public cuisinService: CuisinService = inject(CuisinService);

  constructor() {}

  ngOnInit(): void {
    this.categoryService.getAll();
    this.cuisinService.getAll();

    this.categoryService.categories$.subscribe((resp) => {
      this.categorySelectItems = resp.map((c) => {
        return {
          value: c.id,
          label: c.name,
        };
      });
    });

    this.cuisinService.cuisines$.subscribe((resp) => {
      this.cuisinSelectItems = resp.map((c) => {
        return {
          value: c.id!,
          label: c.name,
        };
      });
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
