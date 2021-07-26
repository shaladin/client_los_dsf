import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[type=text], input',
  host: {
    '(input)': '$event'
  }
})
export class UpperCaseDirective {

  lastValue: string;
  @Input("IsUpperCase") IsUpperCase: boolean = true;

  constructor(public ref: ElementRef) { }

  @HostListener('input', ['$event']) onInput($event) {
    if (this.IsUpperCase) {
      let start = $event.target.selectionStart;
      let end = $event.target.selectionEnd;
      $event.target.value = $event.target.value.toUpperCase();
      $event.target.setSelectionRange(start, end);
      $event.preventDefault();

      if (!this.lastValue || (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)) {
        this.lastValue = this.ref.nativeElement.value = $event.target.value;
        // Propagation
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('input', false, true);
        $event.target.dispatchEvent(evt);
      }
    }
  }
}