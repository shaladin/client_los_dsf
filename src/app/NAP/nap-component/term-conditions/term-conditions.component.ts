import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, FormGroup, FormArray, Validators, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TermConditionsComponent implements OnInit {
  AppTcList: any = [];
  listTempTCList: any = [];

  @Output() OutputValueIsCheckAll : EventEmitter<any> = new EventEmitter();
  @Input() IsCheckedAll : boolean = true;
  @Input() AppId: number;
  @Input() parentForm: FormGroup;
  @Input() enjiForm: NgForm;
  @Input() identifier: string = "TCList";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.IsCheckedAll);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    var listTC = this.parentForm.get(this.identifier) as FormArray;
    var appTcObj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetListTCbyAppId, appTcObj).subscribe(
      (response) => {
        this.AppTcList = response["AppTcs"];
        if (this.AppTcList != null && this.AppTcList["length"] != 0) {
          for (let i = 0; i < this.AppTcList["length"]; i++) {
            var TCDetail = this.fb.group({
              AppTcId: this.AppTcList[i].AppTcId,
              AppId: this.AppTcList[i].AppId,
              TcCode: this.AppTcList[i].TcCode,
              TcName: this.AppTcList[i].TcName,
              PriorTo: this.AppTcList[i].PriorTo,
              IsChecked: this.AppTcList[i].IsChecked,
              ExpiredDt: this.AppTcList[i].ExpiredDt,
              IsMandatory: this.AppTcList[i].IsMandatory,
              PromisedDt: formatDate(this.AppTcList[i].PromisedDt, 'yyyy-MM-dd', 'en-US'),
              CheckedDt: formatDate(this.AppTcList[i].CheckedDt, 'yyyy-MM-dd', 'en-US'),
              Notes: this.AppTcList[i].Notes,
            }) as FormGroup;

            if (this.AppTcList[i].IsMandatory == true) {
              TCDetail.controls.PromisedDt.setValidators([Validators.required]);
            }
            if (this.AppTcList[i].IsChecked == false || this.AppTcList[i].IsMandatory == true) {
              this.IsCheckedAll = false;
            }
            if (this.AppTcList[i].IsChecked == false) {
              TCDetail.controls.ExpiredDt.disable();
            } else {
              TCDetail.controls.PromisedDt.disable();
            }
            listTC.push(TCDetail);
            this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeValidation(arr) {
    if (this.parentForm.controls[this.identifier]["controls"][arr]["controls"].IsMandatory.value == true) {
      this.parentForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.setValidators([Validators.required]);
    }
    if (this.parentForm.controls[this.identifier]["controls"][arr]["controls"].IsChecked.value == false) {
      if (this.parentForm.controls[this.identifier]["controls"][arr]["controls"].IsMandatory.value == true) {
        this.IsCheckedAll = false;
      }
      this.parentForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.disable();
      this.parentForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.enable();
      console.log(this.IsCheckedAll);
      this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
    } else {
      this.IsCheckedAll = true;
      this.listTempTCList = this.parentForm.controls[this.identifier].value;

      this.parentForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.enable();
      this.parentForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.disable();

      for (let i = 0; i < this.listTempTCList.length; i++) {
        if (this.listTempTCList[i].IsChecked == false && this.listTempTCList[i].IsMandatory == true) {
          this.IsCheckedAll = false;
          break;
        }
      }
      this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
      console.log(this.IsCheckedAll);
    }

    this.parentForm.controls[this.identifier]["controls"][arr]["controls"].PromisedDt.updateValueAndValidity();
    this.parentForm.controls[this.identifier]["controls"][arr]["controls"].ExpiredDt.updateValueAndValidity();
  }
}