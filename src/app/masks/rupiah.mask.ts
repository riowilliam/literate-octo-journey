import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupiahMask',
  standalone: true,
})
export class RupiahMaskPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null || value === '') return '';

    const numberValue =
      typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();

    const formattedValue = numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedValue}`;
  }
}
