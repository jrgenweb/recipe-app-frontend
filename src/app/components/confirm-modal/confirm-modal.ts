import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
//import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
  @Output() confirmEvt = new EventEmitter<boolean>();
  @Input() title: string = 'Cím';
  @Input() btnCloseTitle: string = 'Mégse';
  @Input() btnConfirmTitle: string = 'OK';
  @Input() isOpen = true;
  @Input() type: 'primary' | 'danger' | 'warning' | 'success' = 'primary';

  @ViewChild('confirmModal') confirmModal!: ElementRef;
  // modal!: bootstrap.Modal;

  onConfirm(state: boolean) {
    this.isOpen = false;
    this.confirmEvt.emit(state);
  }
}
