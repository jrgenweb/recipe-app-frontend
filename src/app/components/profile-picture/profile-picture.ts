import { Component, Input } from '@angular/core';
import { onImageError } from '../../shared/functions';

@Component({
  selector: 'app-profile-picture',
  imports: [],
  templateUrl: './profile-picture.html',
  styleUrl: './profile-picture.scss',
})
export class ProfilePicture {
  @Input() src?: string;
  @Input() title = '';
  @Input() size: 'md' | 'sm' | 'lg' = 'md';

  constructor() {}

  onImageError(event: Event) {
    onImageError(event, '/no-user.avif');
  }
}
