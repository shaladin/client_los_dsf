import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ControlContainer, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TermConditionsComponent implements OnInit {
  AppTcList: Array<AppTCObj> = [];
  totalCheckAll: number = 0;
  totalMandatory: number = 0;
  @Output() OutputValueIsCheckAll: EventEmitter<any> = new EventEmitter();
  @Output() OutputMode: EventEmitter<any> = new EventEmitter();
  @Input() IsCheckedAll: boolean = true;
  @Input() AppId: number;
  @Input() parentForm: FormGroup;
  @Input() enjiForm: NgForm;
  @Input() identifier: string = "TCList";
  @Input() IsNap: boolean = false;
  businessDt: Date;
  IsOpl: boolean = false;

  MinDate: Date;
  IsPromisedDtLowerThanBusinessDt: boolean = true;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private cookieService: CookieService) { }

  currStep: string = "";
  async ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    let listTC = this.parentForm.get(this.identifier) as FormArray;
    while (listTC.length !== 0) {
      listTC.removeAt(0)
    }
    let appTcObj = {
      Id: this.AppId
    }
    let appObj = { Id: this.AppId };
    await this.http.post(URLConstant.GetAppById, appObj).subscribe(
      async (responseApp: AppObj) => {
        this.currStep = responseApp.AppCurrStep;
        if (responseApp.BizTemplateCode === CommonConstant.OPL) {
          this.IsOpl = true;
        }
        await this.http.post(URLConstant.GetListTCbyAppId, appTcObj).toPromise().then(
          async (response) => {
            this.AppTcList = response["AppTcs"];
            if (this.AppTcList != null && this.AppTcList["length"] != 0) {
              for (let i = 0; i < this.AppTcList["length"]; i++) {
                let TCDetail = this.fb.group({
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
                  IsExpDtMandatory: this.AppTcList[i].IsExpDtMandatory,
                  IsWaivable: this.AppTcList[i].IsWaivable,
                  IsWaived: this.AppTcList[i].IsWaived,
                  RowVersion: this.AppTcList[i].RowVersion
                }) as FormGroup;

                if (this.AppTcList[i].IsMandatory == true) {
                  if (this.AppTcList[i].PriorTo == responseApp.AppCurrStep) {
                    if (!this.AppTcList[i].IsWaived) {
                      TCDetail.controls.PromisedDt.setValidators([Validators.required]);
                    }
                  }
                }
                if (!this.AppTcList[i].IsWaivable) TCDetail.get("IsWaived").disable();

                if (this.AppTcList[i].IsChecked == false && this.AppTcList[i].IsMandatory == true) {
                  this.IsCheckedAll = false;
                }

                if (this.AppTcList[i].IsChecked == false) {
                  TCDetail.controls.ExpiredDt.disable();
                }
                else if (this.AppTcList[i].IsChecked == true && this.IsNap == false) {
                  TCDetail.controls.PromisedDt.disable();
                  TCDetail.controls.IsChecked.disable();
                  if (!this.AppTcList[i].IsExpDtMandatory) {
                    TCDetail.controls.ExpiredDt.disable();
                  }
                }

                listTC.push(TCDetail);
                this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
              }

              this.ReconstructForm();
              this.OutputMode.emit("edit");
            }
            else {
              await this.http.post(URLConstant.GetListTCbyAppIdFromRule, appTcObj).toPromise().then(
                (response) => {
                  this.AppTcList = response["AppTcs"];
                  for (let i = 0; i < this.AppTcList["length"]; i++) {
                    let TCDetail = this.fb.group({
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
                      IsExpDtMandatory: this.AppTcList[i].IsExpDtMandatory,
                      IsWaivable: this.AppTcList[i].IsWaivable,
                      IsWaived: this.AppTcList[i].IsWaived,
                      RowVersion: this.AppTcList[i].RowVersion
                    }) as FormGroup;

                    if (this.AppTcList[i].IsMandatory == true) {
                      if (this.AppTcList[i].PriorTo == responseApp.AppCurrStep) {
                        if (!this.AppTcList[i].IsWaived) {
                          TCDetail.controls.PromisedDt.setValidators([Validators.required]);
                        }
                      }
                    }
                    if (!this.AppTcList[i].IsWaivable) TCDetail.get("IsWaived").disable();

                    if (this.AppTcList[i].IsChecked == false && this.AppTcList[i].IsMandatory == true) {
                      this.IsCheckedAll = false;
                    }

                    if (this.AppTcList[i].IsChecked == false) {
                      TCDetail.controls.ExpiredDt.disable();
                    }
                    else {
                      TCDetail.controls.PromisedDt.disable();
                      if (!this.AppTcList[i].IsExpDtMandatory) {
                        TCDetail.controls.ExpiredDt.disable();
                      }
                    }

                    listTC.push(TCDetail);
                    this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
                  }

                  this.ReconstructForm();
                  this.OutputMode.emit("add");
                }
              );
            }
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ResetPromisedAndExpiredDtToNull(index) {
    let listTC = this.parentForm.get(this.identifier) as FormArray
    let item = listTC.at(index);
    item.patchValue({
      ExpiredDt: null
    });
    this.ReconstructForm();
  }

  ReconstructForm() {
    this.totalCheckAll = 0;
    this.totalMandatory = 0;
    this.IsCheckedAll = true;
    let listTC = this.parentForm.get(this.identifier) as FormArray
    for (let i = 0; i < listTC.length; i++) {
      let item = listTC.at(i);
      let isMandatory: Boolean = item.get("IsMandatory").value;
      let isChecked: Boolean = item.get("IsChecked").value;
      let isExpDtMandatory: Boolean = item.get("IsExpDtMandatory").value;
      let isWaived: Boolean = item.get("IsWaived").value;
      let priorTo: string = item.get("PriorTo").value;
      let tempExpiredDt: AbstractControl = item.get("ExpiredDt") as AbstractControl;
      let tempPromisedDt: AbstractControl = item.get("PromisedDt") as AbstractControl;

      if (isMandatory) {
        //logic PriorTo
        if (priorTo != this.currStep && this.currStep != CommonConstant.AppStepPGLV) continue;
        if (isChecked) {
          tempExpiredDt.enable();
          if (isExpDtMandatory) {
            tempExpiredDt.setValidators([Validators.required]);
          }
          else {
            tempExpiredDt.clearValidators();
          }
          tempExpiredDt.updateValueAndValidity();
          tempPromisedDt.disable();
          tempPromisedDt.clearValidators();
          tempPromisedDt.updateValueAndValidity();
          this.totalCheckAll++;
        }
        else {
          if (isWaived) {
            tempPromisedDt.disable();
            tempPromisedDt.clearValidators();
          }
          else {
            tempPromisedDt.enable();
            tempPromisedDt.setValidators([Validators.required]);
            this.IsCheckedAll = false;
          }
          tempPromisedDt.updateValueAndValidity();
          tempExpiredDt.disable();
          tempExpiredDt.clearValidators();
          tempExpiredDt.updateValueAndValidity();
        }
      }
      else {
        if (isChecked) {
          tempExpiredDt.enable();
          if (isExpDtMandatory) {
            tempExpiredDt.setValidators([Validators.required]);
          }
          else {
            tempExpiredDt.clearValidators();
          }
          tempExpiredDt.updateValueAndValidity();
          tempPromisedDt.disable();
          tempPromisedDt.clearValidators();
          tempPromisedDt.updateValueAndValidity();
        }
        else {
          if (isWaived) {
            tempPromisedDt.disable();
          }
          else {
            tempPromisedDt.enable();
          }
          tempPromisedDt.clearValidators();
          tempPromisedDt.updateValueAndValidity();
          tempExpiredDt.disable();
          tempExpiredDt.clearValidators();
          tempExpiredDt.updateValueAndValidity();
        }
      }
    }
    this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
    listTC.updateValueAndValidity();
  }
}