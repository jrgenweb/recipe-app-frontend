import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
//import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
})
export class ConfirmModal implements AfterViewInit {
  @Output() onConfirmEvt = new EventEmitter<boolean>();
  @Input() title: string = 'Cím';
  @Input() btnCloseTitle: string = 'Mégse';
  @Input() btnConfirmTitle: string = 'OK';
  @Input() isOpen = true;

  @ViewChild('confirmModal') confirmModal!: ElementRef;
  // modal!: bootstrap.Modal;

  ngAfterViewInit() {
    // this.modal = new Modal(this.modalEl.nativeElement);
  }

  onConfirm(state: boolean) {
    this.onConfirmEvt.emit(state);
    this.isOpen = false;
  }
}
