import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ISelect {
  value: string | number;
  label: string;
}

export type TSelect = ISelect | ISelect[];

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements OnChanges, ControlValueAccessor {
  @Input() items: ISelect[] = [];
  @Input() multiple = true;

  @Output() changeSelectedEvt = new EventEmitter<TSelect>();

  allOption: ISelect = { label: 'Összes', value: 'all' };
  displayItems: ISelect[] = [];

  // belső selected tárolás
  selected: ISelect[] = [];

  // ControlValueAccessor callbacks
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.displayItems = [this.allOption, ...(this.items || [])];
    }
  }

  writeValue(obj: TSelect): void {
    if (obj) {
      this.selected = Array.isArray(obj) ? obj : [obj];
    } else {
      this.selected = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // ha kell, pl. <select [disabled]="isDisabled">
  }

  isSelected(item: ISelect): boolean {
    return this.selected.some((s) => s.value === item.value);
  }

  onItemClick(item: ISelect) {
    if (this.multiple) {
      if (item.value === this.allOption.value) {
        // "Összes" kiválasztása
        if (!this.selected.some((s) => s.value === this.allOption.value)) {
          // Ha még nincs kiválasztva → beállítjuk
          this.selected = [item];
        }
        // Ha már ki van választva → semmit ne csináljunk
      } else {
        // Simán kiválasztott elem
        const filtered = this.selected.filter((s) => s.value !== this.allOption.value);
        const exists = filtered.findIndex((s) => s.value === item.value);

        if (exists !== -1) {
          // már kiválasztva → törlés
          this.selected = filtered.filter((s) => s.value !== item.value);
        } else {
          // új elem hozzáadása
          this.selected = [...filtered, item];
        }
      }
    } else {
      // Single select
      this.selected = [item];
    }

    // emit és ControlValueAccessor callback
    this.changeSelectedEvt.emit(this.multiple ? this.selected : this.selected[0]);
    this.onChangeFn(this.multiple ? this.selected : this.selected[0]);
    this.onTouchedFn();
  }
}
