import { Component, Input } from '@angular/core';
import { ToastService } from '../../shared/services/toast-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  constructor(public toastService: ToastService) {}
}
