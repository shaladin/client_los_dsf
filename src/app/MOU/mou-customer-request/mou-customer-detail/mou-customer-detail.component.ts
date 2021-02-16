import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from '../mou-cust-tc/mou-cust-tc.component';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CustObj } from 'app/shared/model/CustObj.Model';

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
  link: any;
  resultData: MouCustObj;
  mouCustObject: MouCustObj = new MouCustObj();
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  custObj: CustObj = new CustObj();
  isDmsReady: boolean = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService, private cookieService: CookieService
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

  async ngOnInit() {
    this.mouCustObject.MouCustId = this.mouCustId;
    await this.httpClient.post(URLConstant.GetMouCustById, this.mouCustObject).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        if (this.resultData.MrMouTypeCode == CommonConstant.GENERAL) {
          this.pageTitle = "MOU General";
        }
        else if (this.resultData.MrMouTypeCode == CommonConstant.FACTORING) {
          this.pageTitle = "MOU Factoring";
        }
      }
    );

  }

  async initDms(){
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    await this.httpClient.post(URLConstant.GetMouCustById, this.mouCustObject).toPromise().then(
      (response: MouCustObj) => {
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;

        if(response['CustNo'] != null && response['CustNo'] != ""){
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['CustNo']));
        }
        else{
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response['ApplicantNo']));
        }
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, response.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
        this.isDmsReady = true;
      });
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
      AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Detail"], { MouCustId: this.mouCustId, mode: "return", MrMouTypeCode: this.mouType });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Detail"], { MouCustId: this.mouCustId, mode: "edit", MrMouTypeCode: this.mouType });
    }
  }

  cancelHandler() {
    if (this.pageType == "return") {
      AdInsHelper.RedirectUrl(this.router, ["Mou/EditMouCustomer/Paging"], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Paging"], {});
    }
  }

  submitHandler() {
    if ((this.mouType == CommonConstant.GENERAL && this.currentStepIndex >= 4) || (this.mouType == CommonConstant.FACTORING && this.currentStepIndex >= 5)) {
      var mouObj = { MouCustId: this.mouCustId }
      this.httpClient.post(URLConstant.SubmitWorkflowMouRequest, mouObj).subscribe(
        () => {
          this.toastr.successMessage("Success");
          if (this.pageType == "return") {
            AdInsHelper.RedirectUrl(this.router, ["/Mou/EditMouCustomer/Paging"], {});
          }
          else {
            AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Paging"], {});
          }
        });
    }
    else {
      this.toastr.warningMessage("Please follow the steps first");
    }
  }

  async stepHandlerGeneral(response) {
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
          AdInsHelper.RedirectUrl(this.router, ["/Mou/EditMouCustomer/Paging"], {});
        }
        else {
          AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Paging"], {});
        }
        break;
      default:
        break;
    }

    if(this.currentStepIndex == 5){
      await this.initDms();
    }
  }

  async stepHandlerFactoring(response) {
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
          AdInsHelper.RedirectUrl(this.router, ["/Mou/EditMouCustomer/Paging"], {});
        }
        else {
          AdInsHelper.RedirectUrl(this.router, ["/Mou/Request/Paging"], {});
        }
        break;
      default:
        break;
    }
    if(this.currentStepIndex == 6){
      await this.initDms();
    }
  }
  
  endOfTab() {
    this.toastr.successMessage("Success");
    this.router.navigate(["/Mou/Request/Paging"]);
  }
}
