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
import { CuisinService, ICuisin } from '../../services/cuisine-service';

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

  private cuisinService: CuisinService = inject(CuisinService);

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
        this.cuisinService.update(this.cuisin);
      } else {
        //add

        this.cuisinService.create(cuisinName);
      }
    }
    this.cuisin = undefined;
    this.isOpen = false;
    this.confirmEvt.emit(true);
  }
}
