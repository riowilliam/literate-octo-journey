import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDotAfterThreeChars]',
  standalone: true,
})
export class DotAfterThreeCharsDirective {
  private previousValue: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    let input = event.target.value;

    if (input !== this.previousValue) {
      this.previousValue = input;

      const formattedInput = input;

      this.el.nativeElement.value = formattedInput;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedData = event.clipboardData?.getData('text') || '';
    const sanitizedData = pastedData.replace(/\D/g, '');
    document.execCommand('insertText', false, sanitizedData);
    event.preventDefault();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [8, 9, 46, 37, 38, 39, 40];
    if (allowedKeys.includes(event.keyCode)) {
      return;
    }

    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
