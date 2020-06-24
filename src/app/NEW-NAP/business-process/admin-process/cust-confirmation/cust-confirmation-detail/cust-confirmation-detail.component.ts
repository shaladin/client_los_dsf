import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { VerfResultHObj } from 'app/shared/model/VerfResultH/VerfResultH.Model';
import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CustCnfrmObj } from 'app/shared/model/CustCnfrm/CustCnfrm.Model';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';

@Component({
  selector: 'app-cust-confirmation-detail',
  templateUrl: './cust-confirmation-detail.component.html',
  styleUrls: ['./cust-confirmation-detail.component.scss']
})
export class CustConfirmationDetailComponent implements OnInit {

  viewObj: string;
  arrValue = [];
  AgrmntId: number;
  AppId: number;
  TaskListId: any;
  AgrmntNo: string;
  VerfResultList = new Array<VerfResultHObj>();
  IsSkip: boolean = false;
  appObj: AppObj = new AppObj();
  verfResultObj: VerfResultObj = new VerfResultObj();
  CustCnfrmObj: CustCnfrmObj = new CustCnfrmObj();
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.AgrmntId = params["AgrmntId"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AgrmntNo"] != null) {
        this.AgrmntNo = params["AgrmntNo"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {
    this.claimTask();
    this.arrValue.push(this.AgrmntId);
    this.viewObj = "./assets/ucviewgeneric/viewCustConfirmInfo.json";

    this.GetVerfResult();
  }

  GetVerfResult(IsAdded: boolean = false) {
    this.http.post(AdInsConstant.GetVerfResultHsByTrxRefNo, { TrxRefNo: this.AgrmntNo }).subscribe(
      (response) => {
        this.VerfResultList = response["responseVerfResultHCustomObjs"];
        this.CustCnfrmObj.Phone = "-";
        this.CustCnfrmObj.MrCustCnfrmResultCode = "-";
        this.CustCnfrmObj.CnfmrNotes = "-";
        if (this.VerfResultList.length != 0) {
          this.CustCnfrmObj.Phone = this.VerfResultList[0].Phn;
          this.CustCnfrmObj.MrCustCnfrmResultCode = this.VerfResultList[0].MrVerfResultHStatCode;
          this.CustCnfrmObj.CnfmrNotes = this.VerfResultList[0].Notes;
        }
        this.CustCnfrmObj.AppId = this.AppId;
        this.CustCnfrmObj.AgrmntId = this.AgrmntId;
        if (this.VerfResultList.length == 0) {
          if (!IsAdded) {
            this.AddNewVerfResult();
          }
        }
      },
      (error) => {
        console.log(error);
      });
  }

  AddNewVerfResult() {
    var AppObj = {
      AppId: this.AppId
    }
    this.http.post<AppObj>(AdInsConstant.GetAppById, AppObj).subscribe(
      (response) => {
        console.log(response);
        this.appObj = response;

        this.verfResultObj.TrxRefNo = this.AgrmntNo;
        this.verfResultObj.EmpNo = "-";
        this.verfResultObj.MrVerfResultStatCode = "NEW";
        this.verfResultObj.MrVerfTrxTypeCode = "CUST_CNFRM";
        this.verfResultObj.LobCode = this.appObj.LobCode;
        this.verfResultObj.LobName = this.appObj.LobCode;
        this.verfResultObj.Notes = "-";
        this.http.post(AdInsConstant.AddVerfResultAndVerfResultH, this.verfResultObj).subscribe(
          (response) => {
            this.GetVerfResult(true);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm() {
    if (this.CustCnfrmObj.IsSkip == false) {
      for (var i = 0; i < this.VerfResultList.length; i++) {
        if (this.VerfResultList[i].MrVerfResultHStatCode == "FAIL" || this.VerfResultList[i].MrVerfResultHStatCode == "NEW") {
          this.toastr.errorMessage("Result can't be New or Failed");
          return;
        }
      }
      var CustCnfrmWFObj = {
        RequestCustCnfrmObj: this.CustCnfrmObj,
        wfTaskListId: this.TaskListId
      };
      this.http.post(AdInsConstant.AddCustCnfrm, CustCnfrmWFObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else if (this.CustCnfrmObj.IsSkip == true) {
      this.toastr.successMessage("Success !");
      this.router.navigate(["/Nap/AdminProcess/CustConfirmation/Paging"], { queryParams: { "BizTemplateCode": this.BizTemplateCode } });
    }
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