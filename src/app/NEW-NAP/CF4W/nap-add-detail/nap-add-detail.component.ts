import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {

  @ViewChild('viewMainProd') ucViewMainProd: UcviewgenericComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  viewProdMainInfoObj: string;
  viewReturnInfoObj: string = "";
  NapObj: AppObj;
  IsMultiAsset: string;
  ListAsset: any;
  ReturnHandlingHId: number = 0;
  showCancel: boolean = true;
  custType: string = CommonConstant.CustTypeCompany;
  token: any = localStorage.getItem("Token");
  IsLastStep: boolean = false;
  IsSavedTC: boolean = false;

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "GUAR": 2,
    "REF": 3,
    "APP": 4,
    "ASSET": 5,
    "INS": 6,
    "LFI": 7,
    "FIN": 8,
    "TC": 9,
  };

  ResponseReturnInfoObj: ReturnHandlingDObj;
  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });
  OnFormReturnInfo = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.showCancel = false;
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 1;
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;

    // this.ChangeStepper();

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    } else {
      this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
        (response: AppObj) => {
          console.log(response);
          if (response) {
            this.NapObj = response;
            if (this.NapObj.MrCustTypeCode != null)
              this.custType = this.NapObj.MrCustTypeCode;

            this.ChangeStepper();
            this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
            this.ChooseStep(this.AppStepIndex);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.MakeViewReturnInfoObj();
  }

  stepperMode: string = CommonConstant.CustTypeCompany;
  ChangeStepper() {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal = new Stepper(document.querySelector('#stepperPersonal'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypePersonal;
      document.getElementById('stepperPersonal').style.display = 'block';
      document.getElementById('stepperCompany').style.display = 'none';
      this.AppStep = {
        "NEW": 1,
        "CUST": 1,
        "GUAR": 2,
        "REF": 3,
        "APP": 4,
        "ASSET": 5,
        "INS": 6,
        "LFI": 7,
        "FIN": 8,
        "TC": 9,
      };
      // console.log(this.stepperPersonal);  
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany = new Stepper(document.querySelector('#stepperCompany'), {
        linear: false,
        animation: true
      });
      this.stepperMode = CommonConstant.CustTypeCompany;
      document.getElementById('stepperPersonal').style.display = 'none';
      document.getElementById('stepperCompany').style.display = 'block';
      this.AppStep = {
        "NEW": 1,
        "CUST": 1,
        "GUAR": 2,
        "REF": 3,
        "APP": 4,
        "ASSET": 5,
        "INS": 6,
        "LFI": 7,
        "FIN": 7,
        "TC": 8,
      };
      // console.log(this.stepperCompany);  
    }
  }

  ChooseStep(idxStep: number) {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.to(idxStep);
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.to(idxStep);
    }
  }

  MakeViewReturnInfoObj() {
    if (this.ReturnHandlingHId > 0) {
      var obj = {
        ReturnHandlingHId: this.ReturnHandlingHId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post<ReturnHandlingDObj>(URLConstant.GetLastReturnHandlingDByReturnHandlingHIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  CheckMultiAsset() {
    var appObj = { AppId: this.appId }
    this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        this.ListAsset = response['ReturnObject'];
        if (this.ListAsset != undefined && this.ListAsset != null) {
          if (this.ListAsset.length > 1)
            this.IsMultiAsset = 'True';
          else
            this.IsMultiAsset = 'False';
        }
        else
          this.IsMultiAsset = 'False';
      },
      (error) => {
        console.log(error);
      }
    )
  }

  ChangeTab(AppStep) {
    console.log(AppStep);
    this.IsSavedTC = false;
    switch (AppStep) {
      case CommonConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
        break;
      case CommonConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
        break;
      case CommonConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepRef];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepAsset:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepAsset];
        break;
      case CommonConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
        break;
      case CommonConstant.AppStepLIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepLIns];
        break;
      case CommonConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFin];
        break;
      case CommonConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepTC];
        break;

      default:
        break;
    }
    if (AppStep == CommonConstant.AppStepTC)
      this.IsLastStep = true;
    else
      this.IsLastStep = false;
      
     this.ucViewMainProd.initiateForm();
  }

  NextStep(Step) {
    if (this.ReturnHandlingHId > 0) {

    } else {
      this.UpdateAppStep(Step);
    }

    this.ChangeTab(Step);
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.next();
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.next();
    }
    this.ucViewMainProd.initiateForm();
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(URLConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        console.log("Step Change to, Curr Step : " + response.AppCurrStep + ", Last Step : " + response.AppLastStep);
      },
      (error) => {
        console.error("Error when updating AppStep");
        console.error(error);
      }
    )
  }

  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    if (this.ReturnHandlingHId > 0) {
      this.IsSavedTC = true;
    } else {
      this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["/Nap/ConsumerFinance/Paging"], { queryParams: { BizTemplateCode: CommonConstant.CF4W } })
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  Cancel() {
    this.router.navigate(["/Nap/ConsumerFinance/Paging"], { queryParams: { BizTemplateCode: CommonConstant.CF4W } });
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
      if (!this.IsSavedTC) {
        this.toastr.warningMessage(ExceptionConstant.SAVE_TC_DATA);
      }
      else {
        var ReturnHandlingResult: ReturnHandlingDObj = new ReturnHandlingDObj();
        ReturnHandlingResult.WfTaskListId = this.wfTaskListId;
        ReturnHandlingResult.ReturnHandlingDId = this.ResponseReturnInfoObj.ReturnHandlingDId;
        ReturnHandlingResult.MrReturnTaskCode = this.ResponseReturnInfoObj.MrReturnTaskCode;
        ReturnHandlingResult.ReturnStat = this.ResponseReturnInfoObj.ReturnStat;
        ReturnHandlingResult.ReturnHandlingNotes = this.ResponseReturnInfoObj.ReturnHandlingNotes;
        ReturnHandlingResult.ReturnHandlingExecNotes = this.FormReturnObj.controls['ReturnExecNotes'].value;
        ReturnHandlingResult.RowVersion = this.ResponseReturnInfoObj.RowVersion;

        this.http.post(URLConstant.EditReturnHandlingD, ReturnHandlingResult).subscribe(
          (response) => {
            console.log(response);
            this.toastr.successMessage(response["message"]);
            this.router.navigate(["/Nap/AddProcess/ReturnHandling/EditAppPaging"], { queryParams: { BizTemplateCode: CommonConstant.CF4W } })
          },
          (error) => {
            console.log(error);
          }
        )
      }
    }
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext["UserName"];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      () => {
      });
  }

  CheckCustType(ev: string) {
    this.custType = ev;
    this.ChangeStepper();
    this.NextStep(CommonConstant.AppStepGuar);
  }

  GetCallback(ev) { 
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion, this.token );
  }
}
