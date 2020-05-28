import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-tc-data',
  templateUrl: './tc-data.component.html',
  styleUrls: []
})
export class TcDataComponent implements OnInit {

  @Input() AppId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();

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
        this.listAppTcObj = response["AppTcs"];
        if (this.listAppTcObj.length > 0) {
          this.mode = "edit";
          for (let j = 0; j < this.listAppTcObj.length; j++) {
            var fa_apptc = this.AppTcForm.get("AppTc") as FormArray;
            fa_apptc.push(this.AddTcControl(this.listAppTcObj[j]))
          }
          this.ReconstructForm();
        }
        else {
          this.http.post(AdInsConstant.GetListTCbyAppIdFromRule, this.AppIdObj).subscribe(
            (response) => {
              this.listAppTcObj = response["AppTcs"];
              console.log(this.result);
              // this.listAppTcObj = this.result;
              for (let i = 0; i < this.listAppTcObj.length; i++) {
                var fa_apptc = this.AppTcForm.get("AppTc") as FormArray;
                fa_apptc.push(this.AddTcControl(this.listAppTcObj[i]))
              }

              this.ReconstructForm();
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
      TcName: obj.TcName,
      TcCode: obj.TcCode,
      PriorTo: obj.PriorTo,
      IsChecked: obj.IsChecked,
      IsMandatory: obj.IsMandatory,
      PromisedDt: (obj.PromisedDt == null) ? null : formatDate(obj.PromisedDt, 'yyyy-MM-dd', 'en-US'),
      ExpiredDt: (obj.ExpiredDt == null) ? null : formatDate(obj.ExpiredDt, 'yyyy-MM-dd', 'en-US'),
      Notes: obj.Notes,
    })
  }

  EnablePromiseDt(i) {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    var item = fa_AppTc.at(i);
    item.get("PromisedDt").enable();
  }

  ReconstructForm() {
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let a = 0; a < fa_AppTc.length; a++) {
      var item = fa_AppTc.at(a);
      var isMandatory: Boolean = item.get("IsMandatory").value;
      var isChecked: Boolean = item.get("IsChecked").value;
      if (isMandatory && !isChecked) {
        item.patchValue({
          ExpiredDt: null
        });
        item.get("ExpiredDt").disable();
        item.get("PromisedDt").enable();
        item.get("PromisedDt").setValidators([Validators.required]);
      }
      else if (isChecked && isMandatory) {
        item.patchValue({
          PromisedDt: null
        });
        item.get("PromisedDt").disable();
        item.get("ExpiredDt").enable();
        item.get("ExpiredDt").setValidators([Validators.required]);
      } else if (isChecked && !isMandatory) {
        item.get("PromisedDt").enable();
        item.get("ExpiredDt").enable();
        item.get("ExpiredDt").setValidators([Validators.required]);
      }
      else {
        item.patchValue({
          PromisedDt: null
        });
        item.get("PromisedDt").disable();
        item.get("PromisedDt").clearValidators();
        item.patchValue({
          ExpiredDt: null
        });
        item.get("ExpiredDt").disable();
        item.get("ExpiredDt").clearValidators();
      }
    }
  }

  SaveData() {
    var businessDt = new Date(localStorage.getItem("BusinessDateRaw"));
    var fa_AppTc = this.AppTcForm.get("AppTc") as FormArray
    for (let i = 0; i < fa_AppTc.length; i++) {
      var item = fa_AppTc.at(i);
      var expDt = new Date(item.get("ExpiredDt").value);
      if(item.get("IsChecked").value && expDt < businessDt){
        this.toastr.errorMessage("Expired Date for " + item.get("TcName").value + " can't be lower than Business Date");
        return;
      }
      this.listAppTcObj[i].AppId = this.AppId;
      this.listAppTcObj[i].IsChecked = item.get("IsChecked").value;
      this.listAppTcObj[i].PromisedDt = item.get("PromisedDt").value;
      this.listAppTcObj[i].ExpiredDt = item.get("ExpiredDt").value;
      this.listAppTcObj[i].Notes = item.get("Notes").value;
    }
    this.ReqTCObj.ListAppTcObj = this.listAppTcObj;
    if (this.mode == "edit") {
      this.http.post(AdInsConstant.EditAppTc, this.ReqTCObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.outputTab.emit();
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
          this.outputTab.emit();
        },
        (error) => {
          console.log(error);
        }
      );

    }
  }

}
