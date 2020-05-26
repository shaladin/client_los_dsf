import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

import { VerfResultObj } from 'app/shared/model/VerfResult/VerfResult.Model';
import { DatePipe } from '@angular/common';
import { ReturnHandlingDObj } from '../../../../../shared/model/ReturnHandling/ReturnHandlingDObj.Model';



@Component({
  selector: "phone-verification-subject",
  templateUrl: "./phone-verification-subject.component.html",
  providers: [NGXToastrService]
})
export class PhoneVerificationSubjectComponent implements OnInit {


  getPhoneVerifSubjUrl: any;
  getVerfResultUrl: any;
  getAppUrl: any;
  addVerfResultUrl: any;
  rtnHandlingDUrl: any;
  editRtnHandlingDUrl: any;

  isReturnHandling: boolean = false;

  ReturnHandlingForm = this.fb.group({
    IsAnyUpdate: [''],
    UpdateNotes: ['', Validators.maxLength(4000)],
    ExecNotes: ['', Validators.maxLength(4000)],
  });
  viewObj: any;

  appId: any;
  returnHandlingDId: any;
  wfTaskListId: any;

  appObj = {
    AppId: 0,
  };

  rtnHandlingDObj = {
    ReturnHandlingDId: 0,
  };

  verfResObj =
    {
      TrxRefNo: "",
      MrVerfTrxTypeCode: "PHN_VERIF",
    };
  phoneVerifObj: any;
  AppObj: any;
  verifResultObj: any;
  addVerifResultObj: VerfResultObj;
  returnHandlingDObj: any;
  ReturnHandlingDData: ReturnHandlingDObj;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private router: Router) {

    this.route.queryParams.subscribe(params => {
      if (params['AppId'] != null) {
        this.appId = params['AppId'];
      }
      if (params['ReturnHandlingDId'] != null) {
        this.returnHandlingDId = params['ReturnHandlingDId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    });
  }

  initUrl() {
    this.getPhoneVerifSubjUrl = AdInsConstant.GetAppPhoneVerifSubjectListByAppId;
    this.getAppUrl = AdInsConstant.GetAppById;
    this.getVerfResultUrl = AdInsConstant.GetVerfResultByTrxRefNoAndVerfTrxTypeCode;
    this.addVerfResultUrl = AdInsConstant.AddVerfResult;
    this.rtnHandlingDUrl = AdInsConstant.GetReturnHandlingDByReturnHandlingDId;
    this.editRtnHandlingDUrl = AdInsConstant.EditReturnHandlingD;
  }

  async ngOnInit(): Promise<void> {
    if (this.wfTaskListId != null || this.wfTaskListId != undefined)
      this.claimTask();

    this.initUrl();
    this.appObj.AppId = this.appId;
    this.viewObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    await this.GetAppData();
    await this.GetVerfResultData();
    await this.GetPhnVerfSubjData();
    if (this.isReturnHandling == true) {
      this.GetReturnHandlingD();
    }
  }

  SaveForm() {

    var reqObj = {
      WFTaskId: this.wfTaskListId,
      isReturnHandling: this.isReturnHandling,
      AppId: this.appId
    };
    this.http.post(AdInsConstant.CompleteAppPhoneVerif, reqObj).subscribe(
      (response) => {

        this.toastr.successMessage(response["message"]);
        var lobCode = localStorage.getItem("LobCode")
        this.router.navigate(["/Nap/CreditProcess/PhoneVerification/Paging"], { queryParams: { "LobCode": lobCode } });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setReturnHandlingD() {
    this.ReturnHandlingDData = new ReturnHandlingDObj();
    this.ReturnHandlingDData.ReturnHandlingDId = this.returnHandlingDObj.ReturnHandlingDId;
    this.ReturnHandlingDData.ReturnHandlingHId = this.returnHandlingDObj.ReturnHandlingHId;
    this.ReturnHandlingDData.MrReturnTaskCode = this.returnHandlingDObj.MrReturnTaskCode;
    this.ReturnHandlingDData.ReturnStat = "DONE";
    this.ReturnHandlingDData.ReturnHandlingNotes = this.returnHandlingDObj.ReturnHandlingNotes;
    this.ReturnHandlingDData.ReturnHandlingExecNotes = this.ReturnHandlingForm.controls["ExecNotes"].value;
    this.ReturnHandlingDData.WfTaskListId = this.wfTaskListId;
    this.ReturnHandlingDData.RowVersion = this.returnHandlingDObj.RowVersion;
  }

  async GetAppData() {
    await this.http.post(this.getAppUrl, this.appObj).toPromise().then(
      (response) => {

        console.log(response);
        this.AppObj = response;
        this.verfResObj.TrxRefNo = this.AppObj.AppNo;
      }
    );
  }

  GetPhnVerfSubjData() {
    this.http.post(this.getPhoneVerifSubjUrl, this.appObj).subscribe(
      (response) => {
        this.phoneVerifObj = response;
        console.log(this.phoneVerifObj);
      }
    );
  }

  async GetVerfResultData() {
    await this.http.post(this.getVerfResultUrl, this.verfResObj).toPromise().then(
      (response) => {
        console.log(response);
        this.verifResultObj = response;

      }
    );
    if (this.verifResultObj == "") {
      var Business_Date = localStorage.getItem('BusinessDate');
      var datePipe = new DatePipe("en-US");
      var value = datePipe.transform(Business_Date, "yyyy-MM-dd");
      var businessDt = new Date(value);

      var useraccess = localStorage.getItem('UserAccess');
      console.log(useraccess);
      this.addVerifResultObj = new VerfResultObj();

      this.addVerifResultObj.TrxRefNo = this.AppObj.AppNo;
      this.addVerifResultObj.VerfDt = businessDt;
      this.addVerifResultObj.EmpNo = "-";
      this.addVerifResultObj.MrVerfResultStatCode = "NEW";
      this.addVerifResultObj.MrVerfTrxTypeCode = "PHN_VERIF";
      this.addVerifResultObj.LobCode = this.AppObj.LobCode;
      this.addVerifResultObj.LobName = this.AppObj.LobCode;
      this.addVerifResultObj.Notes = "-";

      await this.http.post(this.addVerfResultUrl, this.addVerifResultObj).toPromise().then(
        (response) => {
          console.log(response);
        }
      );
    }
  }

  async GetReturnHandlingD() {
    this.rtnHandlingDObj.ReturnHandlingDId = this.returnHandlingDId;
    await this.http.post(this.rtnHandlingDUrl, this.rtnHandlingDObj).toPromise().then(
      (response) => {
        console.log(response);
        this.returnHandlingDObj = response;

      }
    );
  }

  View(VerifResultHid, SubjectName) {
    console.log(this.phoneVerifObj);
    window.open("/Nap/CreditProcess/PhoneVerification/Subject/View?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName, "_blank");
  }

  Verif(VerifResultHid, SubjectName, SubjectType, IdSource) {
    if (this.isReturnHandling == false) {
      this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject/Verif?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName + "&Type=" + SubjectType + "&Source=" + IdSource + "&WfTaskListId=" + this.wfTaskListId);
    }
    if (this.isReturnHandling == true) {
      this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Subject/Verif?AppId=" + this.appId + "&VerfResultHId=" + VerifResultHid + "&Name=" + SubjectName + "&Type=" + SubjectType + "&Source=" + IdSource + "&ReturnHandlingDId=" + this.returnHandlingDId + "&WfTaskListId=" + this.wfTaskListId);
    }
  }

  async claimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = {
      pWFTaskListID: this.wfTaskListId,
      pUserID: currentUserContext["UserName"],
      isLoading: false
    };
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  back() {
    if (this.isReturnHandling == false) {
      this.router.navigateByUrl("/Nap/CreditProcess/PhoneVerification/Paging");
    }
    if (this.isReturnHandling == true) {
      this.router.navigateByUrl("/Nap/AdditionalProcess/ReturnHandlingPhoneVerif/Paging");
    }
    
  }
}
