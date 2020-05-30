import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { formatDate } from '@angular/common';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ListAppTCObj } from 'app/shared/model/ListAppTCObj.Model';
import { AppTCObj } from 'app/shared/model/AppTCObj.Model';
import { PreGoLiveMainObj } from 'app/shared/model/PreGoLiveMainObj.Model';
import { PreGoLiveObj } from 'app/shared/model/PreGoLiveObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-sharing-pre-go-live',
  templateUrl: './pre-go-live.component.html',
  styleUrls: ['./pre-go-live.component.scss']
})
export class PreGoLiveComponent implements OnInit {

  AppId: any;
  AgrmntId: any;
  AgrmntNo: any;
  result: any;
  viewObj: string;
  appTC: any;
  TaskListId: any;
  PreGoLiveMainObj: PreGoLiveMainObj = new PreGoLiveMainObj();
  PreGoLiveObj: PreGoLiveObj = new PreGoLiveObj();
  AgrmntObj: AgrmntObj = new AgrmntObj();

  IsCheckedAll: any;

  MainInfoForm = this.fb.group({
    AgrmntCreatedDt: ['', Validators.required],
    EffectiveDt: ['', Validators.required],
    Notes: ['', Validators.required],
    ApprovalStatus: ['']
  })
  listAppTCObj: ListAppTCObj;

  count1: number = 0;
  RfaLogObj: {
    RfaNo: any
  }
  ListRfaLogObj: any = new Array(this.RfaLogObj);
  inputObj2: any
  listPreGoLiveAppvrObj: any = new Array(this.inputObj2);
  TrxNo: any;


  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.TaskListId = params["TaskListId"];
    });
  }

  ngOnInit() {



    this.claimTask();
    console.log("");
    this.viewObj = "./assets/ucviewgeneric/viewAgrMainInfoPreGoLive.json";
    var agrmntObj = new AgrmntObj;
    agrmntObj.AppId = this.AppId;
    this.http.post(AdInsConstant.GetAgrmntByAppId, agrmntObj).subscribe(
      (response) => {
        this.result = response;
        this.MainInfoForm.patchValue({
          AgrmntCreatedDt: formatDate(this.result.AgrmntCreatedDt, 'yyyy-MM-dd', 'en-US'),
          EffectiveDt: formatDate(this.result.EffectiveDt, 'yyyy-MM-dd', 'en-US'),
        })
        this.AgrmntId = this.result.AgrmntId;
        this.AgrmntNo = this.result.AgrmntNo;
        console.log(this.AgrmntId);
      },
      (error) => {
        console.log(error);
      }
    );
    console.log("asdasd");

    this.http.post(AdInsConstant.GetRfaLogByTrxNoAndApvCategory, { TrxNo: "Product Offering Marvin 4", ApvCategory: "PRD_OFR_APV" }).subscribe(
      (response) => {
        this.result = response;
        this.ListRfaLogObj = response["ListRfaLogObj"];
        for (let i = 0; i < this.ListRfaLogObj.length; i++) {
          this.listPreGoLiveAppvrObj[i] = {
            approvalBaseUrl: environment.ApprovalR3Url,
            type: 'task',
            refId: this.ListRfaLogObj[i].RfaNo
          };
          console.log("asdasdasdasd123123123")
          console.log(this.listPreGoLiveAppvrObj[i])
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }
  ReceiveIsChecked(ev) {
    this.IsCheckedAll = ev;
  }

  RFA() {
    this.router.navigate(["/Nap/AdminProcess/PreGoLive/RequestApproval"], { queryParams: { "AppId": this.AppId, "AgrmntNo": this.AgrmntNo, "TaskListId" : this.TaskListId } });
  }

  SaveForm() {

    this.listAppTCObj = new ListAppTCObj();
    this.listAppTCObj.AppTCObj = new Array();

    for (var i = 0; i < this.MainInfoForm.value.TCList["length"]; i++) {
      this.appTC = new AppTCObj();
      this.appTC.AppId = this.MainInfoForm.value.TCList[i].AppId;
      this.appTC.AppTcId = this.MainInfoForm.value.TCList[i].AppTcId;
      this.appTC.TcCode = this.MainInfoForm.value.TCList[i].TcCode;
      this.appTC.TcName = this.MainInfoForm.value.TCList[i].TcName;
      this.appTC.PriorTo = this.MainInfoForm.value.TCList[i].PriorTo;
      this.appTC.IsChecked = this.MainInfoForm.value.TCList[i].IsChecked;
      this.appTC.ExpiredDt = this.MainInfoForm.value.TCList[i].ExpiredDt;
      this.appTC.IsMandatory = this.MainInfoForm.value.TCList[i].IsMandatory;
      this.appTC.PromisedDt = this.MainInfoForm.value.TCList[i].PromisedDt;
      this.appTC.CheckedDt = this.MainInfoForm.value.TCList[i].CheckedDt;
      this.appTC.Notes = this.MainInfoForm.value.TCList[i].Notes;
      this.appTC.RowVersion = this.MainInfoForm.value.TCList[i].RowVersion;
      this.listAppTCObj.AppTCObj.push(this.appTC);

    }
    console.log("isi nya gan");
    console.log(this.listAppTCObj);
    this.AgrmntObj = new AgrmntObj();
    this.AgrmntObj.AgrmntId = this.AgrmntId;
    this.AgrmntObj.EffectiveDt = this.MainInfoForm.controls.EffectiveDt.value;
    this.AgrmntObj.AgrmntCreatedDt = this.MainInfoForm.controls.AgrmntCreatedDt.value;

    this.PreGoLiveMainObj.AgrmntId = this.AgrmntId;
    this.PreGoLiveMainObj.AgrmntDt = this.MainInfoForm.controls.AgrmntCreatedDt.value;
    this.PreGoLiveMainObj.EffectiveDt = this.MainInfoForm.controls.EffectiveDt.value;
    this.PreGoLiveMainObj.Notes = this.MainInfoForm.controls.Notes.value;

    this.PreGoLiveObj.rAgrmntTC = this.AgrmntObj;
    this.PreGoLiveObj.rAppTcObj = this.listAppTCObj.AppTCObj;
    this.PreGoLiveObj.preGoLiveObj = this.PreGoLiveMainObj;
    this.PreGoLiveObj.TaskListId = this.TaskListId;

    console.log(this.PreGoLiveObj);

    this.http.post(AdInsConstant.AddPreGoLive, this.PreGoLiveObj).subscribe(
      (response) => {
        this.router.navigateByUrl('/Nap/AdminProcess/PreGoLive/Paging');
        this.toastr.successMessage(response['message']);
      },
      (error) => {
        console.log(error);
      });

  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.TaskListId;
    wfClaimObj.pUserID = currentUserContext["UserName"];
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

}
