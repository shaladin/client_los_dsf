import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[type=text]',
})
export class UpperCaseDirective {

  @Input("IsUpperCase") IsUpperCase: boolean = true;

  @HostListener('input', ['$event']) onInputChange($event) {
    if(this.IsUpperCase) $event.target.value = $event.target.value.toUpperCase();
    console.log($event.target.value);
  }
}
 