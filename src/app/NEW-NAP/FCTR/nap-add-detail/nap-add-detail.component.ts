import { Component, OnInit, ViewChild } from '@angular/core';
import { AppObj } from 'app/shared/model/App/App.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html'
})
export class NapAddDetailComponent implements OnInit {
  @ViewChild('viewMainProd') ucViewMainProd: UcviewgenericComponent;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  custType: string = CommonConstant.CustTypePersonal;
  isMainCustMarried: boolean = false;
  stepperMode: string = CommonConstant.CustTypePersonal;


  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "FAM": 2,
    "SHR": 2,
    "GUAR": 3,
    "APP": 4,
    "INVOICE": 5,
    "COLL": 6,
    "INS": 7,
    "FIN": 8,
    "TC": 9
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
        this.CheckMultiAsset();
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
    });
  }

  ngOnInit() {
    
    this.ClaimTask();
    this.AppStepIndex = 0;
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppFctrMainInformation.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "AppNo",
        environment: environment.losR3Web
      },
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.NapObj = new AppObj();
    this.NapObj.AppId = this.appId;
    this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
      (response: AppObj) => {
        this.NapObj = response;
        if (this.NapObj.MrCustTypeCode != null)
        this.custType = this.NapObj.MrCustTypeCode;

        this.ChangeStepper();
        this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
        this.ChooseStep(this.AppStepIndex);
      }
    );

    this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, this.NapObj).subscribe(
      (response) => {
        if (response.AppCustObj) 
        {
          this.isMainCustMarried = response.AppCustPersonalObj != undefined && response.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;
        }
      }
    );
    this.MakeViewReturnInfoObj();
  }

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
        "FAM": 2,
        "SHR": 2,
        "GUAR": 3,
        "APP": 4,
        "INVOICE": 5,
        "COLL": 6,
        "INS": 7,
        "FIN": 8,
        "TC": 9
      };
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
        "FAM": 2,
        "SHR": 2,
        "GUAR": 3,
        "APP": 4,
        "INVOICE": 5,
        "COLL": 6,
        "INS": 7,
        "FIN": 8,
        "TC": 9
      };
    }
  }

  ChooseStep(idxStep: number) {
    if (this.custType == CommonConstant.CustTypePersonal) {
      this.stepperPersonal.to(idxStep);
    } else if (this.custType == CommonConstant.CustTypeCompany) {
      this.stepperCompany.to(idxStep);
    }
  }

  Cancel() {
    AdInsHelper.RedirectUrl(this.router,["/Nap/Factoring/Paging"], { });
  }

  MakeViewReturnInfoObj() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      var obj = {
        AppId: this.appId,
        MrReturnTaskCode: CommonConstant.ReturnHandlingEditApp
      }
      this.http.post(URLConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, obj).subscribe(
        (response) => {
          this.ResponseReturnInfoObj = response;
          this.FormReturnObj.patchValue({
            ReturnExecNotes: this.ResponseReturnInfoObj.ReturnHandlingExecNotes
          });
          this.OnFormReturnInfo = true;
        });
    }
  }

  CheckMultiAsset() {
    var appObj = { AppId: this.appId }
    this.http.post(URLConstant.GetAppAssetListByAppId, appObj).subscribe(
      (response) => {
        this.ListAsset = response['ReturnObject'];
        if (this.ListAsset != undefined && this.ListAsset != null) {
          if (this.ListAsset.length > 1)
            this.IsMultiAsset = true;
          else
            this.IsMultiAsset = false;
        }
        else
          this.IsMultiAsset = false;
      })
  }

  ChangeTab(AppStep) {
    switch (AppStep) {
      case CommonConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepCust];
        break;
      case CommonConstant.AppStepFamily:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepFamily];
        break;
      case CommonConstant.AppStepShr:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepShr];
        break;
      case CommonConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepGuar];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
        case CommonConstant.AppStepInvoice:
          this.AppStepIndex = this.AppStep[CommonConstant.AppStepInvoice];
          break;
      case CommonConstant.AppStepColl:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepColl];
        break;
      case CommonConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepIns];
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
    this.ucViewMainProd.initiateForm();
  }

  NextStep(Step) {
    this.UpdateAppStep(Step);
  
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
      }
    )
  }

  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,["/Nap/Factoring/Paging"], {});
      })
  }

  Submit() {
    if (this.mode == CommonConstant.ModeResultHandling) {
      var obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };

      this.http.post(URLConstant.EditReturnHandlingD, obj).subscribe(
        (response) => {
        })
    }
  }
  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext[CommonConstant.USER_NAME];
    wfClaimObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.ClaimTaskNap, wfClaimObj).subscribe(
      (response) => {

      });
  }

  CheckCustType(ev) {
    this.isMainCustMarried = ev.MrMaritalStatCode != undefined && ev.MrMaritalStatCode == 'MARRIED'? true : false;
    this.custType = ev.MrCustTypeCode != undefined? ev.MrCustTypeCode : CommonConstant.CustTypePersonal;
    this.ChangeStepper();
    if(this.custType == CommonConstant.CustTypePersonal){
      this.NextStep(CommonConstant.AppStepFamily);
    }else{
      this.NextStep(CommonConstant.AppStepShr);
    }
  }

  GetCallback(ev){ 
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }

  SubmitGuarantor(){
    this.http.post(URLConstant.SubmitNapCust, this.NapObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.NextStep(CommonConstant.AppStepApp);
      }
    );
  }
}