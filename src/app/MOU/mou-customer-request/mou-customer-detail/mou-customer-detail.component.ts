import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from '../mou-cust-tc/mou-cust-tc.component';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-mou-customer-detail',
  templateUrl: './mou-customer-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerDetailComponent implements OnInit, AfterViewInit {
  private stepperGeneral: Stepper;
  private stepperFactoring: Stepper;
  @ViewChild("MouTcGeneral") public mouTcGeneral: MouCustTcComponent;
  @ViewChild("MouTcFactoring") public mouTcFactoring: MouCustTcComponent;
  mouType: string;
  mouCustId: number;
  currentStepIndex: number;
  mode: string;
  pageType: string;
  pageTitle: string;
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  link: any;
  resultData: MouCustObj;
  mouCustObject: MouCustObj = new MouCustObj();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('MOUType') != null) {
        this.mouType = params.get('MOUType');
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params['mouCustId'] != null) {
        this.mouCustId = params['mouCustId'];
      }
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
    });
    this.currentStepIndex = 1;
    // this.currentStepIndex = 5; //buat DMS Test sementara
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewMouHeader.json";
    this.viewGenericObj.viewEnvironment = environment.losUrl;
    this.viewGenericObj.ddlEnvironments = [
      {
        name: "MouCustNo",
        environment: environment.losR3Web
      },
    ];
    this.mouCustObject.MouCustId = this.mouCustId;
    this.httpClient.post(URLConstant.GetMouCustById, this.mouCustObject).subscribe(
      (response: MouCustObj) => {
        this.resultData = response;
        this.link = this.DMSIntegrationURL(response);
        if (this.resultData.MrMouTypeCode == CommonConstant.GENERAL) {
          this.pageTitle = "MOU General";
        }
        else if (this.resultData.MrMouTypeCode == CommonConstant.FACTORING) {
          this.pageTitle = "MOU Factoring";
        }
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral = new Stepper(document.querySelector('#stepperGeneral'), {
        linear: false,
        animation: true
      });
      this.stepperGeneral.to(this.currentStepIndex);
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring = new Stepper(document.querySelector('#stepperFactoring'), {
        linear: false,
        animation: true
      });
      this.stepperFactoring.to(this.currentStepIndex);
    }
  }

  DMSIntegrationURL(mouCustObj : MouCustObj) {
    if(mouCustObj != undefined){
      let k = "PYVPWOJGKS8A0URB";
      let iv = "1234567891234567";
      let  Obj :DMSObj = new DMSObj();
      Obj.User = "Admin";
      Obj.Role = "SUPUSR";
      Obj.ViewCode = "ConfinsMou";
      Obj.MetadataParent.push(new DMSLabelValueObj("No Customer", mouCustObj.CustNo));
      Obj.MetadataObject.push(new DMSLabelValueObj("Mou Id", mouCustObj.MouCustNo));
      let ObjFinalForm = "js="+JSON.stringify(Obj)+"&cftsv="+formatDate(new Date(),'dd-MM-yyyy HH:mm', 'en-US').toString();
      let prm = AdInsHelper.Encrypt128CBC(ObjFinalForm, k, iv);
      prm = encodeURIComponent(prm);
      console.log("Final Form : "+ObjFinalForm);
      console.log("http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm="+prm);
      return "http://sky.ad-ins.com/LiteDMS/Integration/ViewDoc.aspx?app=CONFINS&prm="+prm;
    }
  }

  // mouDetailGeneral(e){
  //   this.stepHandler(e);
  // }

  // mouDetailFactoring(e){
  //   this.stepHandler(e);
  // }

  // mouCustFee(e){
  //   this.stepHandler(e);
  // }

  // mouAddColl(e){
  //   this.stepHandler(e);
  // }

  getModeDetail(e) {
    if (e != null) {
      this.mode = e.mode;
    }
  }

  designatedStepHandler(idx) {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral.to(idx);
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring.to(idx);
    }
    this.currentStepIndex = idx;
  }

  // mouCustTc(e){
  //   this.stepHandler(e);
  // }

  saveMouTc() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.mouTcGeneral.Save();
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.mouTcFactoring.Save();
    }
  }

  backFromMouTc() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepHandlerGeneral({ StatusCode: "-1" });
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.stepHandlerFactoring({ StatusCode: "-1" });
    }
  }

  mouDocumentBack() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepperGeneral.previous();
      this.currentStepIndex--;
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.stepperFactoring.previous();
      this.currentStepIndex--;
    }
  }

  editMainInfoHandler() {
    if (this.pageType == "return") {
      this.router.navigate(["/Mou/Request/Detail"], { queryParams: { MouCustId: this.mouCustId, mode: "return", MrMouTypeCode: this.mouType } });
    }
    else {
      this.router.navigate(["/Mou/Request/Detail"], { queryParams: { MouCustId: this.mouCustId, mode: "edit", MrMouTypeCode: this.mouType } });
    }
  }

  cancelHandler() {
    if (this.pageType == "return") {
      this.router.navigate(["Mou/EditMouCustomer/Paging"]);
    }
    else {
      this.router.navigate(['/Mou/Request/Paging']);
    }
  }

  submitHandler() {
    if ((this.mouType == CommonConstant.GENERAL && this.currentStepIndex == 4) || (this.mouType == CommonConstant.FACTORING && this.currentStepIndex == 5)) {
      var mouObj = { MouCustId: this.mouCustId }
      this.httpClient.post(URLConstant.SubmitWorkflowMouRequest, mouObj).subscribe(
        () => {
          this.toastr.successMessage("Success");
          if (this.pageType == "return") {
            this.router.navigate(['/Mou/EditMouCustomer/Paging']);
          }
          else {
            this.router.navigate(['/Mou/Request/Paging']);
          }
        });
    }
    else {
      this.toastr.warningMessage("Please follow the steps first");
    }
  }

  stepHandlerGeneral(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepperGeneral.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepperGeneral.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          this.router.navigate(['/Mou/EditMouCustomer/Paging']);
        }
        else {
          this.router.navigate(['/Mou/Request/Paging']);
        }
        break;
      default:
        break;
    }
  }

  stepHandlerFactoring(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
        this.stepperFactoring.next();
        this.currentStepIndex++;
        break;

      case "-1":
        this.stepperFactoring.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          this.router.navigate(['/Mou/EditMouCustomer/Paging']);
        }
        else {
          this.router.navigate(['/Mou/Request/Paging']);
        }
        break;
      default:
        break;
    }
  }
  GetCallBack(event) {
    if (event.Key == "customer") {
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.httpClient.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        });
    }
  }
}
