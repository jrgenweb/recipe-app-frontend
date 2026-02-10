import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  computed,
  signal,
  OnChanges,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ISelect {
  value: string | number;
  label: string;
}

export type TSelect = ISelect | ISelect[];

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrls: ['./select.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor, OnChanges {
  @Input() items: ISelect[] = [];
  @Input() multiple = true;
  @Output() changeSelectedEvt = new EventEmitter<TSelect>();

  allOption: ISelect = { label: 'Összes', value: 'all' };

  // Signals
  selected = signal<ISelect[]>([]);

  displayItems = signal<ISelect[]>([]);

  private selectedEffect = effect(() => {
    if (this.selected().length === 0) {
      this.selected.set([this.allOption]);
    }
  });
  // Computed
  isSelected = (item: ISelect) =>
    computed(() => this.selected().some((s) => s.value === item.value));

  // ControlValueAccessor callbacks
  private onChangeFn: (_val?: any) => void = (_val?: any) => {};
  private onTouchedFn: () => void = () => {};

  ngOnChanges() {
    this.displayItems.set(this.items.filter((i) => i.value !== this.allOption.value));
  }

  writeValue(obj: TSelect): void {
    if (obj) {
      this.selected.set(Array.isArray(obj) ? obj : [obj]);
    } else {
      this.selected.set([]);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  /*
  
  setDisabledState?(isDisabled: boolean): void {
    // opcionális
  }
    */

  onItemClick(item: ISelect) {
    let newSelected: ISelect[];

    if (this.multiple) {
      if (item.value === this.allOption.value) {
        newSelected = [item];
      } else {
        const filtered = this.selected().filter((s) => s.value !== this.allOption.value);
        const exists = filtered.findIndex((s) => s.value === item.value);
        if (exists !== -1) {
          // törlés
          newSelected = filtered.filter((s) => s.value !== item.value);
        } else {
          // hozzáadás
          newSelected = [...filtered, item];
        }
      }
    } else {
      newSelected = [item];
    }

    this.selected.set(newSelected);

    // emit + control value accessor
    this.changeSelectedEvt.emit(this.multiple ? newSelected : newSelected[0]);
    this.onChangeFn(this.multiple ? newSelected : newSelected[0]);
    this.onTouchedFn();
  }
}
