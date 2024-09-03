import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenerateUtilService {
  generateYearLabels(startYear: number, endYear: number): string[] {
    const labels: string[] = [];
    for (let year = startYear; year <= endYear; year++) {
      labels.push(year.toString());
    }
    return labels;
  }

  generateRandomData(startYear: number, endYear: number): number[] {
    const data: number[] = [];
    const numYears = endYear - startYear + 1;
    for (let i = 0; i < numYears; i++) {
      data.push(Math.floor(Math.random() * 1000000001));
    }
    return data;
  }

  generateProjectLabels(startChar: string, endChar: string): string[] {
    const labels: string[] = [];
    for (
      let charCode = startChar.charCodeAt(0);
      charCode <= endChar.charCodeAt(0);
      charCode++
    ) {
      labels.push(`Project ${String.fromCharCode(charCode)}`);
    }
    return labels;
  }

  generateMonthLabels(year: number): string[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months.map((month) => `${month} ${year.toString().slice(-2)}`);
  }
}
