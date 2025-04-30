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
}
