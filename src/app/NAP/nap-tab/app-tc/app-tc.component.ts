import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppIdObj } from 'app/shared/model/AppIdObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { formatDate } from '@angular/common';
import { ReqTCObj } from 'app/shared/model/ReqTCObj.Model';

@Component({
  selector: 'app-app-tc',
  templateUrl: './app-tc.component.html',
  styleUrls: []
})
export class AppTcComponent implements OnInit {

  @Input() AppId: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
    })
  }

  AppTcForm = this.fb.group({
    AppTc: this.fb.array([])
  });


  AppIdObj: any = new AppIdObj();
  AppTcCodeObj = {
    TcCode: new Array(),
    RowVersion: ""
  }
  result: any;
  DocName = new Array();
  listAppTcObj: Array<AppTCObj> = new Array<AppTCObj>();
  mode: any = "add";
  ReqTCObj = new ReqTCObj();

  ngOnInit() {
    this.AppIdObj.AppId = this.AppId;
    console.log(this.AppIdObj);
    this.http.post(AdInsConstant.GetListTCbyAppId, this.AppIdObj).subscribe(
      (response) => {
        console.log("check");
        console.log(response);
        this.result = response;
        if (this.result.length > 0) {
          this.mode = "edit";
          this.listAppTcObj = this.result;
          console.log(this.mode);
          console.log(this.listAppTcObj);
          for (let j = 0; j < Object.keys(this.result).length; j++) {
            var fa_apptc = this.AppTcForm.get("AppTc") as FormArray;
            fa_apptc.push(this.TcControlEdit(this.listAppTcObj[j]))
            this.DocName.push(this.listAppTcObj[j].TcCode);
            this.AppTcCodeObj.TcCode[j] = this.DocName[j];
          }
          this.http.post(AdInsConstant.GetListRefTcByTcCode, this.AppTcCodeObj).subscribe(
            (response) => {
              for (var i = 0; i < Object.keys(response).length; i++) {
                this.DocName[i] = response[i]["TcName"];
              }
            }
          );
          this.DisableDate();

          var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
          for (let a = 0; a < fa_AppTc.length; a++) {
            var item = fa_AppTc.at(a);
            var isMandatory: Boolean = item.get("IsMandatory").value;
            if (isMandatory) {
              this.EnablePromiseDt(a);
              item.get("PromisedDt").setValidators([Validators.required]);
            }
          }
          for (let i = 0; i < this.listAppTcObj.length; i++) {
            var fa_apptc = this.AppTcForm.get("AppTc") as FormArray
            var item = fa_apptc.at(i);
            item.patchValue({
              IsChecked: [this.listAppTcObj[i].IsChecked],
              Notes: [this.listAppTcObj[i].Notes],
            })
            var isChecked: Boolean = item.get("IsChecked").value;
            if (isChecked) {
              item.get("PromisedDt").disable();
              item.get("ExpiredDt").enable();
              item.patchValue({
                ExpiredDt: formatDate(this.listAppTcObj[i].ExpiredDt, 'yyyy-MM-dd', 'en-US')
              })
            } else {
              item.get("ExpiredDt").disable();
              item.get("PromisedDt").enable();
              item.patchValue({
                PromisedDt: formatDate(this.listAppTcObj[i].PromisedDt, 'yyyy-MM-dd', 'en-US')
              })
            }
          }
        }
        else {
          this.http.post(AdInsConstant.CreateTCRule, this.AppIdObj).subscribe(
            (response) => {
              this.result = response;
              console.log(this.result);
              // this.listAppTcObj = this.result;
              for (let i = 0; i < Object.keys(this.result).length; i++) {
                var appTcObj = new AppTCObj();
                appTcObj.IsMandatory = this.result[i].TCMandatory;
                appTcObj.PriorTo = this.result[i].TCPriorTo;
                appTcObj.TcCode = this.result[i].TCCode;
                this.listAppTcObj.push(appTcObj);
                var fa_apptc = this.AppTcForm.get("AppTc") as FormArray;
                fa_apptc.push(this.AddTcControl(this.listAppTcObj[i]))
                this.DocName.push(this.result[i].TCCode);
                this.AppTcCodeObj.TcCode[i] = this.DocName[i];
              }
              this.http.post(AdInsConstant.GetListRefTcByTcCode, this.AppTcCodeObj).subscribe(
                (response) => {
                  for (var i = 0; i < Object.keys(response).length; i++) {
                    this.DocName[i] = response[i]["TcName"];
                  }
                }
              );
              this.DisableDate();

              var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
              for (let i = 0; i < fa_AppTc.length; i++) {
                var item = fa_AppTc.at(i);
                var isMandatory: Boolean = item.get("IsMandatory").value;
                if (isMandatory) {
                  this.EnablePromiseDt(i);
                  item.get("PromisedDt").setValidators([Validators.required]);
                }
              }
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    );
  }

  AddTcControl(obj: AppTCObj) {
    return this.fb.group({
      TcCode: obj.TcCode,
      PriorTo: obj.PriorTo,
      IsChecked: false,
      IsMandatory: obj.IsMandatory,
      PromisedDt: [''],
      ExpiredDt: [''],
      Notes: "",
    })
  }
  TcControlEdit(obj: AppTCObj) {
    return this.fb.group({
      TcCode: obj.TcCode,
      PriorTo: obj.PriorTo,
      IsChecked: obj.IsChecked,
      IsMandatory: obj.IsMandatory,
      PromisedDt: obj.PromisedDt,
      ExpiredDt: obj.ExpiredDt,
      Notes: obj.Notes,
    })
  }

  DisableDate() {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length; i++) {
      var item = fa_AppTc.at(i);
      item.get("ExpiredDt").disable();
      item.get("PromisedDt").disable();
    }
  }

  EnablePromiseDt(i) {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    var item = fa_AppTc.at(i);
    item.get("PromisedDt").enable();
  }

  ObjSelected() {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length; i++) {
      var item = fa_AppTc.at(i);
      var isChecked: Boolean = item.get("IsChecked").value;
      var isMandatory: Boolean = item.get("IsMandatory").value;
      if (isChecked && isMandatory) {
        item.get("PromisedDt").disable();
        item.get("ExpiredDt").enable();
        // item.get("IsChecked").disable();
      }
      else if (isChecked) {
        item.get("ExpiredDt").enable();
        // item.get("IsChecked").disable();
      }
      else {
        item.get("ExpiredDt").disable();
        if (isMandatory) {
          item.get("PromisedDt").enable();
        }
      }
    }
  }

  SaveData() {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length; i++) {
      var item = fa_AppTc.at(i);
      this.listAppTcObj[i].AppId = this.AppId;
      this.listAppTcObj[i].IsChecked = item.get("IsChecked").value;
      this.listAppTcObj[i].PromisedDt = item.get("PromisedDt").value;
      this.listAppTcObj[i].ExpiredDt = item.get("ExpiredDt").value;
      this.listAppTcObj[i].Notes = item.get("Notes").value;
      // this.listAppTcObj.push(appTcObj);
    }
    this.ReqTCObj.ListAppTcObj = this.listAppTcObj;
    if (this.mode == "edit") {
      this.http.post(AdInsConstant.EditAppTc, this.ReqTCObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.http.post(AdInsConstant.AddAppTc, this.ReqTCObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

}
