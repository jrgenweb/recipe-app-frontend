import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenPipe',
  standalone: true,
})
export class ShortenPipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + '...';
  }
}
