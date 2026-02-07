import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { IRecipeCategory } from '@recipe/shared';
import { CategoryService } from '../../../../shared/services/category-service';

@Component({
  selector: 'app-add-category-modal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-category-modal.html',
  styleUrl: './add-category-modal.scss',
})
export class AddCategoryModal implements OnChanges {
  categoryForm!: FormGroup;
  @Input() category?: IRecipeCategory;
  @Input() isOpen = false;
  @Output() confirmEvt = new EventEmitter<boolean>();

  private categoryService: CategoryService = inject(CategoryService);

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      // csak akkor inicializáljuk, ha megnyílik
      this.categoryForm = new FormGroup({
        name: new FormControl(this.category?.name || '', Validators.required),
      });
    }
  }
  onCancel() {
    this.category = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(false);
  }
  onSubmit() {
    this.categoryForm.markAllAsTouched();
    const categoryName = this.categoryForm.value.name;
    if (this.categoryForm.valid) {
      //update
      this.isOpen = false;
      if (this.category) {
        this.category.name = categoryName;
        this.categoryService.update(this.category);
      } else {
        //add

        this.categoryService.create(categoryName);
      }
    }
    this.category = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(true);
  }
}
