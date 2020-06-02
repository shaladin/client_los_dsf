import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, FormGroup, FormArray, Validators, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TermConditionsComponent implements OnInit {
  AppTcList: any = [];
  listTempTCList: any = [];

  @Output() OutputValueIsCheckAll: EventEmitter<any> = new EventEmitter();
  @Input() IsCheckedAll: boolean = true;
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
        console.log(response);
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
              ExpiredDt: this.AppTcList[i].ExpiredDt != null ? formatDate(this.AppTcList[i].ExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
              IsMandatory: this.AppTcList[i].IsMandatory,
              PromisedDt: this.AppTcList[i].PromisedDt != null ? formatDate(this.AppTcList[i].PromisedDt, 'yyyy-MM-dd', 'en-US') : "",
              CheckedDt: this.AppTcList[i].CheckedDt != null ? formatDate(this.AppTcList[i].CheckedDt, 'yyyy-MM-dd', 'en-US') : "",
              Notes: this.AppTcList[i].Notes,
              IsAdditional: this.AppTcList[i].IsAdditional,
              RowVersion: this.AppTcList[i].RowVersion
            }) as FormGroup;

            // if (this.AppTcList[i].IsMandatory == true) {
            //   TCDetail.controls.PromisedDt.setValidators([Validators.required]);
            // }
            // if (this.AppTcList[i].IsChecked == false && this.AppTcList[i].IsMandatory == true) {
            //   this.IsCheckedAll = false;
            // }
            // if (this.AppTcList[i].IsChecked == false) {
            //   TCDetail.controls.ExpiredDt.disable();
            // } else {
            //   TCDetail.controls.PromisedDt.disable();
            // }
            listTC.push(TCDetail);
            this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
          }
          this.ReconstructForm();
          console.log(this.parentForm);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  totalCheckAll: number =0;
  ReconstructForm() {
    console.log("ReconstructForm");
    var listTC = this.parentForm.get(this.identifier) as FormArray
    for (let i = 0; i < listTC.length; i++) {
      var item = listTC.at(i);
      console.log(item);
      var isMandatory: Boolean = item.get("IsMandatory").value;
      var isChecked: Boolean = item.get("IsChecked").value;

      if (isMandatory) {
        if (isChecked) {
          item.patchValue({
            PromisedDt: null
          });
          item.get("ExpiredDt").enable();
          item.get("PromisedDt").disable();
          item.get("ExpiredDt").setValidators([Validators.required]);
          this.totalCheckAll++;
        } else {
          item.patchValue({
            ExpiredDt: null
          });
          item.get("ExpiredDt").disable();
          item.get("PromisedDt").enable();
          item.get("PromisedDt").setValidators([Validators.required]);
        }

      } else {
        if (isChecked) {
          item.patchValue({
            PromisedDt: null
          });
          item.get("ExpiredDt").enable();
          item.get("PromisedDt").disable();
          item.get("ExpiredDt").setValidators([Validators.required]);
        } else {
          item.patchValue({
            ExpiredDt: null
          });
          item.get("ExpiredDt").disable();
          item.get("PromisedDt").enable();
        }
      }
      console.log(item.get("ExpiredDt"));

    }
    listTC.updateValueAndValidity();
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