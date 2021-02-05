import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-term-conditions',
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TermConditionsComponent implements OnInit {
  AppTcList: any = [];
  listTempTCList: any = [];

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

  MinDate: Date;
  IsPromisedDtLowerThanBusinessDt: boolean = true;

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) { }

  ngOnInit() {
    var context = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    var listTC = this.parentForm.get(this.identifier) as FormArray;
    
    var appTcObj = {
      AppId: this.AppId
    }
    this.http.post(URLConstant.GetAppById, appTcObj).subscribe(
      (responseApp: AppObj) => {
        this.http.post(URLConstant.GetListTCbyAppId, appTcObj).subscribe(
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
                  ExpiredDt: this.AppTcList[i].ExpiredDt != null ? formatDate(this.AppTcList[i].ExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
                  IsMandatory: this.AppTcList[i].IsMandatory,
                  PromisedDt: this.AppTcList[i].PromisedDt != null ? formatDate(this.AppTcList[i].PromisedDt, 'yyyy-MM-dd', 'en-US') : "",
                  CheckedDt: this.AppTcList[i].CheckedDt != null ? formatDate(this.AppTcList[i].CheckedDt, 'yyyy-MM-dd', 'en-US') : "",
                  Notes: this.AppTcList[i].Notes,
                  IsAdditional: this.AppTcList[i].IsAdditional,
                  IsExpDtMandatory: this.AppTcList[i].IsExpDtMandatory,
                  IsWaivable: this.AppTcList[i].IsWaivable,
                  IsWaived: [{value: this.AppTcList[i].IsWaived, disabled: this.AppTcList[i].IsWaivable}],
                  RowVersion: this.AppTcList[i].RowVersion
                }) as FormGroup;
    
                if (this.AppTcList[i].IsMandatory == true) {
                  if(this.AppTcList[i].PriorTo == responseApp.AppCurrStep){
                    if(!this.AppTcList[i].IsWaived){
                      TCDetail.controls.PromisedDt.setValidators([Validators.required]);
                    }
                  }
                }
                if (this.AppTcList[i].IsChecked == false && this.AppTcList[i].IsMandatory == true) {
                  this.IsCheckedAll = false;
                }
                if (this.AppTcList[i].IsChecked == false) {
                  TCDetail.controls.ExpiredDt.disable();
                } else if(this.AppTcList[i].IsChecked == true && this.IsNap == false) {
                  TCDetail.controls.PromisedDt.disable();
                  TCDetail.controls.IsChecked.disable();
                  if(!this.AppTcList[i].IsExpDtMandatory){
                    TCDetail.controls.ExpiredDt.disable();
                  }
                }
    
                listTC.push(TCDetail);
                this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
    
              }
    
              this.ReconstructForm();
              this.OutputMode.emit("edit");
            } else {
              this.http.post(URLConstant.GetListTCbyAppIdFromRule, appTcObj).subscribe(
                (response) => {
                  this.AppTcList = response["AppTcs"];
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
                      IsExpDtMandatory: this.AppTcList[i].IsExpDtMandatory,
                      IsWaivable: this.AppTcList[i].IsWaivable,
                      IsWaived: [{value: this.AppTcList[i].IsWaived, disabled: this.AppTcList[i].IsWaivable}],
                      RowVersion: this.AppTcList[i].RowVersion
                    }) as FormGroup;
    
                    if (this.AppTcList[i].IsMandatory == true) {
                      if(this.AppTcList[i].PriorTo == responseApp.AppCurrStep){
                        if(!this.AppTcList[i].IsWaived){
                          TCDetail.controls.PromisedDt.setValidators([Validators.required]);
                        }
                      }
                    }
                    if (this.AppTcList[i].IsChecked == false && this.AppTcList[i].IsMandatory == true) {
                      this.IsCheckedAll = false;
                    }
                  
                      if (this.AppTcList[i].IsChecked == false) {
                        TCDetail.controls.ExpiredDt.disable();
                      } else {
                        TCDetail.controls.PromisedDt.disable(); 
                        if(!this.AppTcList[i].IsExpDtMandatory){
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
          }); 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ResetPromisedAndExpiredDtToNull(index){
    var listTC = this.parentForm.get(this.identifier) as FormArray
    var item = listTC.at(index);
    item.patchValue({
      PromisedDt: null,
      ExpiredDt: null
    });
    this.ReconstructForm();
  }

  ReconstructForm() {
    this.totalCheckAll = 0;
    this.totalMandatory = 0;
    this.IsCheckedAll = true;
    var listTC = this.parentForm.get(this.identifier) as FormArray
    for (let i = 0; i < listTC.length; i++) {
      var item = listTC.at(i);
      var isMandatory: Boolean = item.get("IsMandatory").value;
      var isChecked: Boolean = item.get("IsChecked").value;
      var isExpDtMandatory: Boolean = item.get("IsExpDtMandatory").value;

      if (isMandatory) {
        if (isChecked) {
          if(isExpDtMandatory){
            item.get("ExpiredDt").enable();
            item.get("ExpiredDt").setValidators([Validators.required]);
            item.get("ExpiredDt").updateValueAndValidity();
          }
          else{
            item.get("ExpiredDt").disable();
            item.get("ExpiredDt").clearValidators();
            item.get("ExpiredDt").updateValueAndValidity();
          }
          item.get("PromisedDt").disable();
          item.get("PromisedDt").clearValidators();
          item.get("PromisedDt").updateValueAndValidity();
          // item.get("ExpiredDt").setValidators([Validators.required]);
          this.totalCheckAll++;
        } 
        else {
          if(item.get("IsWaived").value){
            item.get("PromisedDt").disable();
            item.get("PromisedDt").clearValidators();
            item.get("PromisedDt").updateValueAndValidity();
          }
          else{
            item.get("PromisedDt").enable();
            item.get("PromisedDt").setValidators([Validators.required]);
            item.get("PromisedDt").updateValueAndValidity();
          }
          item.get("ExpiredDt").disable();
          item.get("ExpiredDt").clearValidators();
          item.get("ExpiredDt").updateValueAndValidity();
          
          this.IsCheckedAll = false;
        }
      } 
      else {
        if (isChecked) {
          if(isExpDtMandatory){
            item.get("ExpiredDt").enable();
            item.get("ExpiredDt").setValidators([Validators.required]);
            item.get("ExpiredDt").updateValueAndValidity();
          }
          else{
            item.get("ExpiredDt").disable();
            item.get("ExpiredDt").clearValidators();
            item.get("ExpiredDt").updateValueAndValidity();
          }
          item.get("PromisedDt").disable();
          item.get("PromisedDt").clearValidators();
          item.get("PromisedDt").updateValueAndValidity();
          // item.get("ExpiredDt").setValidators([Validators.required]);
        } 
        else {
          if(item.get("IsWaived").value){
            item.get("PromisedDt").disable();
            item.get("PromisedDt").clearValidators();
            item.get("PromisedDt").updateValueAndValidity();
          }
          else{
            item.get("PromisedDt").enable();
            item.get("PromisedDt").clearValidators();
            item.get("PromisedDt").updateValueAndValidity();
          }
          item.get("ExpiredDt").disable();
          item.get("ExpiredDt").clearValidators();
          item.get("ExpiredDt").updateValueAndValidity();
        }
      }
    }
    this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
    listTC.updateValueAndValidity();
  }
}