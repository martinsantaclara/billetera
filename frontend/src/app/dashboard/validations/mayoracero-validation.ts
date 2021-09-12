import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, AbstractControl } from '@angular/forms';

export function mayoraceroValidation(): ValidatorFn {
  return (control: AbstractControl) => {
    const mayoraceroValidationDirective = new MayoraceroValidationDirective();
    return mayoraceroValidationDirective.validate(control);
  }
 }

@Directive({
  selector: '[mayoraceroValidation]',
  providers: [{provide: NG_VALIDATORS, useExisting: MayoraceroValidationDirective, multi: true}]

})
export class MayoraceroValidationDirective implements Validator {

  passwordsProhibidos = ['123456', 'querty', '123456789'];

  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors | null {
    const valor = <number>control.value;

    if (valor===0) {

      console.log('valor igual a cero');
      return {'mayoraceroValidation': {'message': 'Escoge un mejor password'}}
    }

    return null;

  }

}
