import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormArray, Validators, NgForm } from '@angular/forms';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { map, mergeMap } from 'rxjs/operators';
import { MouCustClauseObj } from 'app/shared/model/MouCustClauseObj.Model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mou-cust-tc',
  templateUrl: './mou-cust-tc.component.html',
  styleUrls: ['./mou-cust-tc.component.scss'],
  providers: [NGXToastrService]
})
export class MouCustTcComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustTc: EventEmitter<any> = new EventEmitter<any>();
  formSubmitted: boolean;

  MouCustTcForm = this.fb.group({
    MouCustTcList: this.fb.array([])
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) { 
    this.formSubmitted = false;
  }

  ngOnInit() {
    var datePipe = new DatePipe("en-US");
    var mouObj = new MouCustObj();
    mouObj.MouCustId = this.MouCustId;
    var mouCustObjData;
    this.httpClient.post(AdInsConstant.GetMouCustById, mouObj).pipe(
      map((response: MouCustObj) => {
        mouCustObjData = response;
        return response;
      }),
      mergeMap((response) => {
        var mouCustClause = new MouCustClauseObj();
        mouCustClause.MouCustId = this.MouCustId;
        return this.httpClient.post(AdInsConstant.GetMouCustClauseByMouCustId, mouCustClause);
      }),
      mergeMap((response) => {
        var mouCustClause = response;
        var mouTcObj;
        if(mouCustObjData["MrMouTypeCode"] == "GENERAL"){
          mouTcObj = { MouCustId: this.MouCustId, AssetTypeCode: mouCustClause["AssetTypeCode"], MrCustTypeCode: mouCustObjData["MrCustTypeCode"], RowVersion: ""};
        }
        else{
          mouTcObj = { MouCustId: this.MouCustId, AssetTypeCode: "", MrCustTypeCode: mouCustObjData["MrCustTypeCode"], RowVersion: ""};
        }
        return this.httpClient.post(AdInsConstant.GetMouCustTcFromRule, mouTcObj);
      })
    ).subscribe(
      (response: any) => {
        var formArray = this.MouCustTcForm.get('MouCustTcList') as FormArray;
        for(const item of response["MouCustTcObjs"]){
          var promiseDtValidation;
          var expiredDtValidation;
          if(item.IsMandatory){
            if(item.IsChecked){
              promiseDtValidation = [];
              expiredDtValidation = [Validators.required];
            }
            else{
              promiseDtValidation = [Validators.required];
              expiredDtValidation = [];
            }
          }
          else{
            promiseDtValidation = [];
            expiredDtValidation = [];
          }
          var formGroup = this.fb.group({
            MouCustTcId: [item.MouCustTcId, [Validators.required]],
            MouCustId: [this.MouCustId, [Validators.required]],
            TcCode: [item.TcCode],
            TcName: [item.TcName],
            IsChecked: [item.IsFromRule ? false : item.IsChecked],
            IsMandatory: [item.IsMandatory],
            PromisedDt: [item.IsFromRule ? '' : datePipe.transform(item.PromisedDt, "yyyy-MM-dd"), promiseDtValidation],
            CheckedDt: [item.IsFromRule ? '' : datePipe.transform(item.CheckedDt, "yyyy-MM-dd")],
            ExpiredDt: [item.IsFromRule ? '' : datePipe.transform(item.ExpiredDt, "yyyy-MM-dd"), expiredDtValidation],
            Notes: [item.IsFromRule ? '' : item.Notes],
            PriorTo: [item.PriorTo],
            RowVersion: ['']
          });
          formArray.push(formGroup);
        }
      }
    );
  }

  checkedHandler(e, i){
    var formArray = this.MouCustTcForm.get('MouCustTcList') as FormArray;
    if(e.target.checked == true){
      var mandatory = formArray.at(i).get("IsMandatory").value;
      if(mandatory == true){
        formArray.at(i).get("ExpiredDt").setValidators([Validators.required]);
        formArray.at(i).get("ExpiredDt").updateValueAndValidity();
        formArray.at(i).get("PromisedDt").clearValidators();
        formArray.at(i).get("PromisedDt").updateValueAndValidity();
      }
    }
    else{
      var mandatory = formArray.at(i).get("IsMandatory").value;
      if(mandatory == true){
        formArray.at(i).get("PromisedDt").setValidators([Validators.required]);
        formArray.at(i).get("PromisedDt").updateValueAndValidity();
        formArray.at(i).get("ExpiredDt").clearValidators();
        formArray.at(i).get("ExpiredDt").updateValueAndValidity();
      }
    }
  }

  mandatoryHandler(e, i){
    var formArray = this.MouCustTcForm.get('MouCustTcList') as FormArray;
    if(e.target.checked == true){
      var checked = formArray.at(i).get("IsChecked").value;
      if(checked == true){
        formArray.at(i).get("ExpiredDt").setValidators([Validators.required]);
        formArray.at(i).get("ExpiredDt").updateValueAndValidity();
        formArray.at(i).get("PromisedDt").clearValidators();
        formArray.at(i).get("PromisedDt").updateValueAndValidity();
      }
      else{
        formArray.at(i).get("PromisedDt").setValidators([Validators.required]);
        formArray.at(i).get("PromisedDt").updateValueAndValidity();
        formArray.at(i).get("ExpiredDt").clearValidators();
        formArray.at(i).get("ExpiredDt").updateValueAndValidity();
      }
    }
    else{
      formArray.at(i).get("PromisedDt").clearValidators();
      formArray.at(i).get("PromisedDt").updateValueAndValidity();
      formArray.at(i).get("ExpiredDt").clearValidators();
      formArray.at(i).get("ExpiredDt").updateValueAndValidity();
    }
  }

  Save(){
    this.formSubmitted = true;
    if(this.MouCustTcForm.valid){
      var formArray = this.MouCustTcForm.get('MouCustTcList') as FormArray;
      var formData = formArray.value;
      var formFinal = {MouCustTcObjs: formData};
  
      this.httpClient.post(AdInsConstant.EditListMouCustTc, formFinal).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.ResponseMouCustTc.emit(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  back(){
    this.ResponseMouCustTc.emit({StatusCode: "-1"});
  }

}
