import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import { FormBuilder } from '@angular/forms';
import Stepper from 'bs-stepper'
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { ReturnHandlingDObj } from 'app/shared/model/ReturnHandling/ReturnHandlingDObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {

  custType: string = CommonConstant.CustTypePersonal;
  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  @ViewChild('viewMainProd') ucViewMainProd: UcviewgenericComponent;
  AppStepIndex: number = 1;
  appId: number;
  wfTaskListId: number;
  mode: string;
  viewProdMainInfoObj: UcViewGenericObj = new UcViewGenericObj();
  NapObj: AppObj;
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  showCancel: boolean = true;
  IsLastStep: boolean = false;
  ReturnHandlingHId: number = 0;
  isMainCustMarried: boolean = false;

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

  AppStep = {
    "NEW": 1,
    "CUST": 1,
    "FAM": 2,
    "SHR": 2,
    "GUAR": 3,
    "REF": 4,
    "APP": 5,
    "COLL": 6,
    "INS": 7,
    "LFI": 8,
    "FIN": 9,
    "TC": 10,
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
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
        this.showCancel = false;
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.AppStepIndex = 1;
    this.viewProdMainInfoObj.viewInput = "./assets/ucviewgeneric/viewNapAppMainInformation.json";
    this.viewProdMainInfoObj.viewEnvironment = environment.losUrl;
    this.viewProdMainInfoObj.ddlEnvironments = [
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

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);    
    }
    else {
      this.http.post(URLConstant.GetAppById, this.NapObj).subscribe(
        (response: AppObj) => {
          if (response) {
            this.NapObj = response;
            if (this.NapObj.MrCustTypeCode != null)
              this.custType = this.NapObj.MrCustTypeCode;

            this.ChangeStepper();
            this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
            this.ChooseStep(this.AppStepIndex);
          }
        }
      );
    };
    
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

  stepperMode: string = CommonConstant.CustTypePersonal;
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
        "REF": 4,
        "APP": 5,
        "COLL": 6,
        "INS": 7,
        "LFI": 8,
        "FIN": 9,
        "TC": 10,
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
      "REF": 4,
      "APP": 5,
      "COLL": 6,
      "INS": 7,
      "LFI": 8,
      "FIN": 8,
      "TC": 9,
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
      case CommonConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepRef];
        break;
      case CommonConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepApp];
        break;
      case CommonConstant.AppStepColl:
        this.AppStepIndex = this.AppStep[CommonConstant.AppStepColl];
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
      }
    )
  }
  
  LastStepHandler() {
    this.NapObj.WfTaskListId = this.wfTaskListId;
    this.http.post(URLConstant.SubmitNAP, this.NapObj).subscribe(
      (response) => {
        AdInsHelper.RedirectUrl(this.router,["/Nap/CFRefinancing/Paging"], {});
      })
  }

  Submit() {
    if (this.ReturnHandlingHId > 0) {
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
  Cancel() {
    this.router.navigate(["Paging"], { relativeTo: this.route.parent, skipLocationChange: true, queryParams: { BizTemplateCode: CommonConstant.CFRFN4W } });
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

  GetCallback(ev) {
    AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
  }

  SubmitGuarantor(){
    this.http.post(URLConstant.SubmitNapCust, this.NapObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.NextStep(CommonConstant.AppStepRef);
      }
    );
  }
}