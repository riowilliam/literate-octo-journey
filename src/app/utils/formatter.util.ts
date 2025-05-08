import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatterUtilService {
  roundToSignificantFigures(value: number, leadingDigitCount: number): number {
    const digitCount = Math.floor(Math.log10(value)) + 1;
    const zeroCount = digitCount - leadingDigitCount;
    const divisor = Math.pow(10, zeroCount);
    const leadingPart = Math.floor(value / divisor);
    const roundedLeading = Math.ceil(leadingPart / 100) * 100;
    return roundedLeading * divisor;
  }
  formatNumber(value: number): string {
    if (value >= 1e12)
      return (value / 1e12).toFixed(2).replace('.', ',') + ' Triliun';
    if (value >= 1e9)
      return (value / 1e9).toFixed(2).replace('.', ',') + ' Miliar';
    if (value >= 1e6)
      return (value / 1e6).toFixed(2).replace('.', ',') + ' Juta';
    return value.toString();
  }
}
