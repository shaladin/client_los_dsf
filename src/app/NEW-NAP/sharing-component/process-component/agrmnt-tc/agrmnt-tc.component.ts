import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { AgrmntTcObj } from 'app/shared/model/agrmnt-tc/agrmnt-tc-obj.model';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';

@Component({
  selector: 'app-agrmnt-tc',
  templateUrl: './agrmnt-tc.component.html',
  styleUrls: ['./agrmnt-tc.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class AgrmntTcComponent implements OnInit {
  AgrmntTcList: Array<AgrmntTcObj> = [];
  totalCheckAll: number = 0;
  totalMandatory: number = 0;
  @Output() OutputValueIsCheckAll: EventEmitter<any> = new EventEmitter();
  @Output() OutputMode: EventEmitter<any> = new EventEmitter();
  @Input() IsCheckedAll: boolean = true;
  @Input() AgrmntId: number;
  @Input() parentForm: FormGroup;
  @Input() enjiForm: NgForm;
  @Input() identifier: string = "TCList";
  businessDt: Date;
  IsOpl: boolean = false;

  MinDate: Date;
  IsPromisedDtLowerThanBusinessDt: boolean = true;

  constructor(private http: HttpClient,
    private fb: FormBuilder, private cookieService: CookieService) { }

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    var listTC = this.parentForm.get(this.identifier) as FormArray;
    while (listTC.length !== 0) {​​​​​
      listTC.removeAt(0)
    }​​​​​
    var agrmntTcObj = {
      Id: this.AgrmntId
    }
    var agrmntObj = { Id: this.AgrmntId };
    this.http.post(URLConstant.GetAgrmntByAgrmntId, agrmntObj).subscribe(
      (responseAgrmnt: AgrmntObj) => {
        if(responseAgrmnt.BizTemplateCode === CommonConstant.OPL) {
          this.IsOpl = true;
        }
        this.http.post(URLConstant.GetListAgrmntTcbyAgrmntId, agrmntTcObj).subscribe(
          (response) => {
            this.AgrmntTcList = response["ReturnObject"];
            if (this.AgrmntTcList != null && this.AgrmntTcList.length != 0) {
              for (let i = 0; i < this.AgrmntTcList.length; i++) {
                var TCDetail = this.fb.group({
                  AgrmntTcId: this.AgrmntTcList[i].AgrmntTcId,
                  AgrmntId: this.AgrmntTcList[i].AgrmntId,
                  TcCode: this.AgrmntTcList[i].TcCode,
                  TcName: this.AgrmntTcList[i].TcName,
                  PriorTo: this.AgrmntTcList[i].PriorTo,
                  IsChecked: this.AgrmntTcList[i].IsChecked,
                  ExpiredDt: this.AgrmntTcList[i].ExpiredDt != null ? formatDate(this.AgrmntTcList[i].ExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
                  IsMandatory: this.AgrmntTcList[i].IsMandatory,
                  PromisedDt: this.AgrmntTcList[i].PromisedDt != null ? formatDate(this.AgrmntTcList[i].PromisedDt, 'yyyy-MM-dd', 'en-US') : "",
                  CheckedDt: this.AgrmntTcList[i].CheckedDt != null ? formatDate(this.AgrmntTcList[i].CheckedDt, 'yyyy-MM-dd', 'en-US') : "",
                  Notes: this.AgrmntTcList[i].Notes,
                  IsAdditional: this.AgrmntTcList[i].IsAdditional,
                  IsExpDtMandatory: this.AgrmntTcList[i].IsExpDtMandatory,
                  IsWaivable: this.AgrmntTcList[i].IsWaivable,
                  IsWaived: this.AgrmntTcList[i].IsWaived
                }) as FormGroup;
    
                if (this.AgrmntTcList[i].IsMandatory == true) {
                  if(this.AgrmntTcList[i].PriorTo == responseAgrmnt.AgrmntCurrStep) {
                    if(!this.AgrmntTcList[i].IsWaived) {
                      TCDetail.controls.PromisedDt.setValidators([Validators.required]);
                    }
                  }
                }
                if (!this.AgrmntTcList[i].IsWaivable) TCDetail.get("IsWaived").disable();

                if (this.AgrmntTcList[i].IsChecked == false && this.AgrmntTcList[i].IsMandatory == true) {
                  this.IsCheckedAll = false;
                }

                if (this.AgrmntTcList[i].IsChecked == false) {
                  TCDetail.controls.ExpiredDt.disable();
                }
                else {
                  TCDetail.controls.PromisedDt.disable();
                  TCDetail.controls.IsChecked.disable();
                  TCDetail.controls.IsWaived.disable();
                  if(!this.AgrmntTcList[i].IsExpDtMandatory){
                    TCDetail.controls.ExpiredDt.disable();
                  }
                }
    
                listTC.push(TCDetail);
                this.OutputValueIsCheckAll.emit(this.IsCheckedAll);
              }
    
              this.ReconstructForm();
              this.OutputMode.emit("edit");
            }
          }
        ); 
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
            item.get("ExpiredDt").enable();
            item.get("ExpiredDt").clearValidators();
            item.get("ExpiredDt").updateValueAndValidity();
          }
          item.get("PromisedDt").disable();
          item.get("PromisedDt").clearValidators();
          item.get("PromisedDt").updateValueAndValidity();
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
            this.IsCheckedAll = false;
          }
          item.get("ExpiredDt").disable();
          item.get("ExpiredDt").clearValidators();
          item.get("ExpiredDt").updateValueAndValidity();
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
            item.get("ExpiredDt").enable();
            item.get("ExpiredDt").clearValidators();
            item.get("ExpiredDt").updateValueAndValidity();
          }
          item.get("PromisedDt").disable();
          item.get("PromisedDt").clearValidators();
          item.get("PromisedDt").updateValueAndValidity();
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