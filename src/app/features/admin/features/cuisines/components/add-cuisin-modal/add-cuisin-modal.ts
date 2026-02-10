import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICuisin } from '../../services/admin-cuisine-service';
import { CuisineStore } from '../../../../../cuisines/stores/cuisine.store';
import { AdminCuisineStore } from '../../stores/admin-cuisine.store';

@Component({
  selector: 'app-add-cuisin-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-cuisin-modal.html',
  styleUrl: './add-cuisin-modal.scss',
})
export class AddCuisinModal implements OnChanges {
  cuisinForm!: FormGroup;
  @Input() cuisin?: ICuisin;
  @Input() isOpen = false;
  @Output() confirmEvt = new EventEmitter<boolean>();

  public cusineStore = inject(AdminCuisineStore);

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      // csak akkor inicializáljuk, ha megnyílik
      this.cuisinForm = new FormGroup({
        name: new FormControl(this.cuisin?.name || '', Validators.required),
      });
    }
  }
  onCancel() {
    this.cuisin = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(false);
  }
  onSubmit() {
    this.cuisinForm.markAllAsTouched();
    const cuisinName = this.cuisinForm.value.name;
    if (this.cuisinForm.valid) {
      //update
      this.isOpen = false;
      if (this.cuisin) {
        this.cuisin.name = cuisinName;
        this.cusineStore.update(this.cuisin);
      } else {
        //add
        this.cusineStore.create(cuisinName);
      }
    }
    this.cuisin = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(true);
  }
}
