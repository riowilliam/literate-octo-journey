import { AbstractControl, ValidatorFn } from '@angular/forms';

export function quantityValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const items = control.value as Array<{
      formPaidQuantity: string;
      formRemainingQuantity: number;
    }>;

    const isInvalid = items.some((item) => {
      const paidQuantity = parseInt(item.formPaidQuantity, 10);
      const remainingQuantity = item.formRemainingQuantity;

      if (paidQuantity === 0 && remainingQuantity === 0) {
        return false;
      }

      return paidQuantity > remainingQuantity;
    });

    return isInvalid ? { quantityMismatch: { value: control.value } } : null;
  };
}
