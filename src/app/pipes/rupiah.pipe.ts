import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupiahPipe',
  standalone: true,
})
export class RupiahPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) return '';
    const parts = value.toString().split('.');
    const integerPart = parts[0];
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'Rp. ' + formattedInteger;
  }
}
