import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppObj } from 'app/shared/model/App/App.Model';
import Stepper from 'bs-stepper';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-nap-add-detail',
  templateUrl: './nap-add-detail.component.html',
  providers: [NGXToastrService]
})
export class NapAddDetailComponent implements OnInit {

  private stepperPersonal: Stepper;
  private stepperCompany: Stepper;
  wfTaskListId: number;
  ReturnHandlingHId: number = 0;
  AppStepIndex: number = 1;
  appId: number;
  mode: string;
  viewProdMainInfoObj: string;
  NapObj: AppObj = new AppObj();
  ResponseReturnInfoObj: any;
  OnFormReturnInfo: boolean = false;
  IsMultiAsset: boolean = false;
  ListAsset: any;
  custType: string = AdInsConstant.CustTypeCompany;
  getApp: any;
  token : any = localStorage.getItem("Token");

  FormReturnObj = this.fb.group({
    ReturnExecNotes: ['']
  });

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
    "TC": 9
  };

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.appId = params["AppId"];
        this.mode = params["Mode"];
      }
      if (params["WfTaskListId"] != null) {
        this.wfTaskListId = params["WfTaskListId"];
      }
      if (params["ReturnHandlingHId"] != null) {
        this.ReturnHandlingHId = params["ReturnHandlingHId"];
      }
    });
  }

  ngOnInit() {
    this.ClaimTask();
    this.viewProdMainInfoObj = "./assets/ucviewgeneric/viewNapAppFL4WMainInformation.json";
    this.NapObj.AppId = this.appId;

    if (this.ReturnHandlingHId > 0) {
      this.ChangeStepper();
      this.ChooseStep(this.AppStepIndex);
    } else {
      this.http.post(AdInsConstant.GetAppById, this.NapObj).subscribe(
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

  stepperMode: string = AdInsConstant.CustTypeCompany;
  ChangeStepper() {
    if (this.custType == AdInsConstant.CustTypePersonal) {
      this.stepperPersonal = new Stepper(document.querySelector('#stepperPersonal'), {
        linear: false,
        animation: true
      });
      this.stepperMode = AdInsConstant.CustTypePersonal;
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
    } else if (this.custType == AdInsConstant.CustTypeCompany) {
      this.stepperCompany = new Stepper(document.querySelector('#stepperCompany'), {
        linear: false,
        animation: true
      });
      this.stepperMode = AdInsConstant.CustTypeCompany;
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
    }
  }

  ChooseStep(idxStep: number) {
    if (this.custType == AdInsConstant.CustTypePersonal) {
      this.stepperPersonal.to(idxStep);
    } else if (this.custType == AdInsConstant.CustTypeCompany) {
      this.stepperCompany.to(idxStep);
    }
  }

  MakeViewReturnInfoObj() {
    if (this.mode == AdInsConstant.ModeResultHandling) {
      var obj = {
        AppId: this.appId,
        MrReturnTaskCode: AdInsConstant.ReturnHandlingEditApp
      }
      this.http.post(AdInsConstant.GetReturnHandlingDByAppIdAndMrReturnTaskCode, obj).subscribe(
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

  NextStep(Step) {
    if (this.ReturnHandlingHId > 0) {
      if (this.custType == AdInsConstant.CustTypePersonal) {
        this.stepperPersonal.next();
      } else if (this.custType == AdInsConstant.CustTypeCompany) {
        this.stepperCompany.next();
      }
    } else {
      this.UpdateAppStep(Step);
    }
  }

  UpdateAppStep(Step: string) {
    this.NapObj.AppCurrStep = Step;
    this.http.post<AppObj>(AdInsConstant.UpdateAppStepByAppId, this.NapObj).subscribe(
      (response) => {
        console.log("Step Change to, Curr Step : " + response.AppCurrStep + ", Last Step : " + response.AppLastStep);
        this.AppStepIndex = this.AppStep[this.NapObj.AppCurrStep];
        this.ChooseStep(this.AppStepIndex);
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
    } else {
      this.http.post(AdInsConstant.SubmitNAP, this.NapObj).subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(["/Nap/FinanceLeasing/Paging"], { queryParams: { BizTemplateCode: AdInsConstant.FL4W } })
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ChangeTab(AppStep) {
    switch (AppStep) {
      case AdInsConstant.AppStepCust:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepCust];
        break;
      case AdInsConstant.AppStepGuar:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepGuar];
        break;
      case AdInsConstant.AppStepRef:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepRef];
        break;
      case AdInsConstant.AppStepApp:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepApp];
        break;
      case AdInsConstant.AppStepAsset:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepAsset];
        break;
      case AdInsConstant.AppStepIns:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepIns];
        break;
      case AdInsConstant.AppStepLIns:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepLIns];
        break;
      case AdInsConstant.AppStepFin:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepFin];
        break;
      case AdInsConstant.AppStepTC:
        this.AppStepIndex = this.AppStep[AdInsConstant.AppStepTC];
        break;
      default:
        break;
    }
  }

  Submit() {
    this.ClaimTask();
    if (this.mode == AdInsConstant.ModeResultHandling) {
      var obj = {
        ReturnHandlingDId: this.ResponseReturnInfoObj.ReturnHandlingDId,
        ReturnHandlingNotes: this.ResponseReturnInfoObj.ReturnHandlingNotes,
        ReturnHandlingExecNotes: this.FormReturnObj.value.ReturnExecNotes,
        RowVersion: this.ResponseReturnInfoObj.RowVersion
      };

      this.http.post(AdInsConstant.EditReturnHandlingD, obj).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  ClaimTask() {
    var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    var wfClaimObj = new AppObj();
    wfClaimObj.AppId = this.appId;
    wfClaimObj.Username = currentUserContext["UserName"];
    wfClaimObj.WfTaskListId = this.wfTaskListId;

    this.http.post(AdInsConstant.ClaimTaskNap, wfClaimObj).subscribe(
      () => {
      });
  }

  GetCallback(ev){
    var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.ViewObj.ProdOfferingCode + "&prodOfferingVersion=" + ev.ViewObj.ProdOfferingVersion + "&Token=" + this.token;
    this.router.navigate([]).then(result => { window.open(link, '_blank'); });
  }
}
