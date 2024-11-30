import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowDotOnly]',
  standalone: true,
})
export class AllowDotOnlyDirective {
  private regex: RegExp = /^[0-9.]*$/;
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Enter',
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    const current: string = (event.target as HTMLInputElement).value;
    const next: string = current.concat(event.key);

    if (!this.regex.test(next)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const inputElement = event.target as HTMLInputElement;

    let value = inputElement.value.replace(/,/g, '.');

    value = value.replace(/[^0-9.]/g, '');

    if ((value.match(/\./g) || []).length > 1) {
      value = value.replace(/\.(?=.*\.)/g, '');
    }

    inputElement.value = value;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    let pastedInput = clipboardData.getData('text');

    pastedInput = pastedInput.replace(/,/g, '.').replace(/[^0-9.]/g, '');

    const inputElement = event.target as HTMLInputElement;
    inputElement.value = pastedInput;
    event.preventDefault();
  }
}
