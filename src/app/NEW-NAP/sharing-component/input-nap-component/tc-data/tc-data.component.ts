import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AppIdObj } from 'app/shared/model/app-id-obj.model';
import { AppTCObj } from 'app/shared/model/app-tc-obj.model';
import { formatDate } from '@angular/common';
import { ReqTCObj } from 'app/shared/model/req-tc-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-tc-data',
  templateUrl: './tc-data.component.html',
  styleUrls: []
})
export class TcDataComponent implements OnInit {

  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();


  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  AppTcForm = this.fb.group({

  });


  AppIdObj: AppIdObj = new AppIdObj();
  AppTcCodeObj = {
    TcCode: new Array(),
    RowVersion: ""
  }
  DocName = new Array();
  listAppTcObj: Array<AppTCObj> = new Array<AppTCObj>();
  mode: string = "add";
  ReqTCObj = new ReqTCObj();

  ngOnInit() {
    this.AppIdObj.AppId = this.AppId;
    // this.http.post(URLConstant.GetListTCbyAppId, this.AppIdObj).subscribe(
    //   (response) => {
    //     this.listAppTcObj = response["AppTcs"];
    //     if (this.listAppTcObj.length > 0) {
    //       this.mode = "edit";
    //       for (let j = 0; j < this.listAppTcObj.length; j++) {
    //         var fa_apptc = this.AppTcForm.get("TCList") as FormArray;
    //         fa_apptc.push(this.AddTcControl(this.listAppTcObj[j]))
    //       }
    //       this.ReconstructForm();
    //     }
    //     else {
    //       this.http.post(URLConstant.GetListTCbyAppIdFromRule, this.AppIdObj).subscribe(
    //         (response) => {
    //           this.listAppTcObj = response["AppTcs"];
    //           for (let i = 0; i < this.listAppTcObj.length; i++) {
    //             var fa_apptc = this.AppTcForm.get("TCList") as FormArray;
    //             fa_apptc.push(this.AddTcControl(this.listAppTcObj[i]))
    //           }

    //           this.ReconstructForm();
    //         }
    //       );
    //     }
    //   }
    // );
  }

  AddTcControl(obj: AppTCObj) {
    return this.fb.group({
      TcName: obj.TcName,
      TcCode: obj.TcCode,
      PriorTo: obj.PriorTo,
      IsChecked: obj.IsChecked,
      IsMandatory: obj.IsMandatory,
      IsWaived: obj.IsWaived,
      IsExpDtMandatory: obj.IsExpDtMandatory,
      PromisedDt: (obj.PromisedDt == null) ? '' : formatDate(obj.PromisedDt, 'yyyy-MM-dd', 'en-US'),
      ExpiredDt: (obj.ExpiredDt == null) ? '' : formatDate(obj.ExpiredDt, 'yyyy-MM-dd', 'en-US'),
      Notes: obj.Notes,
    })
  }

  EnablePromiseDt(i) {
    var fa_AppTc = this.AppTcForm.get("TCList") as FormArray
    var item = fa_AppTc.at(i);
    item.get("PromisedDt").enable();
  }

  ReconstructForm() {
    var fa_AppTc = this.AppTcForm.get("TCList") as FormArray;
    for (let a = 0; a < fa_AppTc.length; a++) {
      var item = fa_AppTc.at(a);
      var isMandatory: Boolean = item.get("IsMandatory").value;
      var isChecked: Boolean = item.get("IsChecked").value;

      item.patchValue({
        PromisedDt: null,
        ExpiredDt: null,
      });
      if (isMandatory) {
        if (isChecked) {
          item.get("ExpiredDt").enable();
          item.get("PromisedDt").disable();
          item.get("ExpiredDt").setValidators([Validators.required]);
          item.get("ExpiredDt").updateValueAndValidity();
        } else {
          item.get("ExpiredDt").disable();
          item.get("PromisedDt").enable();
          item.get("PromisedDt").setValidators([Validators.required]);
          item.get("PromisedDt").updateValueAndValidity();
        }

      } else {
        if (isChecked) {
          item.get("ExpiredDt").enable();
          item.get("PromisedDt").disable();
          item.get("ExpiredDt").setValidators([Validators.required]);
          item.get("ExpiredDt").updateValueAndValidity();
        } else {
          item.get("ExpiredDt").disable();
          item.get("PromisedDt").enable();
          item.get("PromisedDt").updateValueAndValidity();
        }
      }
    }
    fa_AppTc.updateValueAndValidity();
  }

  Test() {
    this.getFormValidationErrors();
  }

  getFormValidationErrors() {
    const invalid = [];
    const controls = this.AppTcForm.controls.TCList["controls"];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
  }

  SaveData() {
    //var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray;
    //this.listAppTcObj = new Array<AppTCObj>();
    //for (let i = 0; i < fa_AppTc.length; i++) {
    //  var item = fa_AppTc.at(i);
    // var expDt = new Date(item.get("ExpiredDt").value);
    // var prmsDt = new Date(item.get("PromisedDt").value);
    // var expDtForm = item.get("ExpiredDt").value;
    // var prmsDtForm = item.get("PromisedDt").value;
    // if(item.get("IsChecked").value){
    //   if(expDtForm != null){
    //     if(expDt < businessDt){
    //       this.toastr.warningMessage("Expired Date for " + item.get("TcName").value + " can't be lower than Business Date");
    //       return;
    //     }
    //   }
    // }
    // if (item.get("IsChecked").value == false) {
    //   if(prmsDtForm != null){
    //     if(prmsDt < businessDt){
    //       this.toastr.warningMessage("Promise Date for " + item.get("TcName").value + " can't be lower than Business Date");
    //       return;
    //     }
    //   }
    // }
    //var appTcObj : AppTCObj = new AppTCObj();
    //appTcObj.AppId = this.AppId;
    //appTcObj.IsChecked = item.get("IsChecked").value;
    //appTcObj.PromisedDt = item.get("PromisedDt").value;
    // appTcObj.ExpiredDt = item.get("ExpiredDt").value;
    //appTcObj.Notes = item.get("Notes").value;
    // this.listAppTcObj.push(appTcObj);
    //}
    if (this.AppTcForm.value.TCList["length"] <= 0) {
      this.toastr.warningMessage("Term & Conditions not found");
      return;
    }

    var businessDt = new Date(AdInsHelper.GetCookie(this.cookieService, CommonConstant.BUSINESS_DATE_RAW));
    this.listAppTcObj = new Array<AppTCObj>();
    for (var i = 0; i < this.AppTcForm.value.TCList["length"]; i++) {
      var appTC = new AppTCObj();
      appTC.AppId = this.AppId;
      appTC.AppTcId = this.AppTcForm.value.TCList[i].AppTcId;
      appTC.TcCode = this.AppTcForm.value.TCList[i].TcCode;
      appTC.TcName = this.AppTcForm.value.TCList[i].TcName;
      appTC.PriorTo = this.AppTcForm.value.TCList[i].PriorTo;
      appTC.IsChecked = this.AppTcForm.getRawValue().TCList[i].IsChecked;
      appTC.ExpiredDt = this.AppTcForm.getRawValue().TCList[i].ExpiredDt;
      appTC.IsMandatory = this.AppTcForm.value.TCList[i].IsMandatory;
      appTC.PromisedDt = this.AppTcForm.getRawValue().TCList[i].PromisedDt;
      appTC.CheckedDt = this.AppTcForm.value.TCList[i].CheckedDt;
      appTC.Notes = this.AppTcForm.value.TCList[i].Notes;
      appTC.IsAdditional = this.AppTcForm.value.TCList[i].IsAdditional;
      appTC.IsExpDtMandatory = this.AppTcForm.value.TCList[i].IsExpDtMandatory;
      appTC.IsWaivable = this.AppTcForm.value.TCList[i].IsWaivable;
      appTC.IsWaived = this.AppTcForm.value.TCList[i].IsWaived;
      appTC.RowVersion = this.AppTcForm.value.TCList[i].RowVersion;

      var prmsDt = new Date(appTC.PromisedDt);
      var prmsDtForm = this.AppTcForm.value.TCList[i].PromisedDt;

      if (appTC.IsChecked == false) {
        if (prmsDtForm != null) {
          if (prmsDt < businessDt) {
            this.toastr.warningMessage("Promise Date for " + appTC.TcName + " can't be lower than Business Date");
            return;
          }
        }
      }
      this.listAppTcObj.push(appTC);
    }
    this.ReqTCObj.ListAppTcObj = this.listAppTcObj;

    
    var objGetMou={
      Id:this.AppId
    }
    this.http.post(URLConstant.GetMouCustByAppId, objGetMou).subscribe(
      (responseMou) => {
        if (responseMou["MouCustId"] != null && responseMou["MouCustId"] != 0) {
          if (responseMou["EndDt"] != null) {
            var ExpDt = new Date(responseMou["EndDt"]);
            if (ExpDt < businessDt || responseMou["MouStat"] == CommonConstant.MouStatCancel) {
              this.toastr.warningMessage(ExceptionConstant.MOU_EXP_DT_OR_MOU_STAT_CANCEL);
              return;
            }
          } else {
            if (responseMou["MouStat"] == CommonConstant.MouStatCancel) {
              this.toastr.warningMessage(ExceptionConstant.MOU_EXP_DT_OR_MOU_STAT_CANCEL);
              return;
            }
          }
        }

        if (this.mode == "edit") {
          this.http.post(URLConstant.EditAppTc, this.ReqTCObj).subscribe(
            (response) => {
              // this.toastr.successMessage(response["message"]);
              this.outputTab.emit();
            });
        } else {
          this.http.post(URLConstant.AddAppTc, this.ReqTCObj).subscribe(
            (response) => {
              // this.toastr.successMessage(response["message"]);
              this.outputTab.emit();
            });
        }
      }
    );
    
  }

  Cancel() {
    this.outputCancel.emit();
  }

  SetMode(event) {
    this.mode = event;
  }

}
