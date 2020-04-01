import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ucinputnumber',
  templateUrl: './ucinputnumber.component.html',
  styles: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class UcinputnumberComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() identifier: string = "UcInputNumber";
  @Input() ucNumber: string = "";
  @Input() isRequired: boolean = true;
  @Input() enjiForm: NgForm;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log("ucinputnumber");
    this.parentForm.addControl(this.identifier, this.fb.control(''));
    this.ucNumber = this.ucNumber.toString();
    this.ucNumber = this.ucNumber.replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  CommaFormatted(event) {
    // skip for arrow keys
    if (event.which >= 37 && event.which <= 40) return;

    // format number
    if (this.ucNumber) {
      this.ucNumber = this.ucNumber.replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  NumberCheck(args) {
    if (args.key === 'e' || args.key === '+' || args.key === '-') {
      return false;
    } else {
      return true;
    }
  }
}
