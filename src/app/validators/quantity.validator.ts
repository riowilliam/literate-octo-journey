import { AbstractControl, ValidatorFn } from '@angular/forms';

export function quantityValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const items = control.value as Array<{
      formPaidQuantity: string;
      formRemainingQuantity: number;
    }>;

    const hasInvalidPaidQuantity = items.some((item) => {
      const paidQuantity = parseFloat(item.formPaidQuantity);
      const remainingQuantity = item.formRemainingQuantity;

      if (paidQuantity > remainingQuantity) {
        return true;
      }

      if (paidQuantity === 0 && remainingQuantity === 0) {
        return false;
      }

      if (paidQuantity === 0 && remainingQuantity > 0) {
        return false;
      }

      return false;
    });

    const allPaidQuantitiesZero = items.every((item) => {
      const paidQuantity = parseFloat(item.formPaidQuantity);
      return paidQuantity === 0;
    });

    const isInvalid = hasInvalidPaidQuantity || allPaidQuantitiesZero;

    return isInvalid ? { quantityMismatch: { value: control.value } } : null;
  };
}
