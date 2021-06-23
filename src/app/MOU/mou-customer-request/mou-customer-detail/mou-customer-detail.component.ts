import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { MouCustTcComponent } from '../mou-cust-tc/mou-cust-tc.component';
import Stepper from 'bs-stepper';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { CustObj } from 'app/shared/model/CustObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { MouMainInfoComponent } from 'app/MOU/mou-main-info/mou-main-info.component';

@Component({
  selector: 'app-mou-customer-detail',
  templateUrl: './mou-customer-detail.component.html',
  providers: [NGXToastrService]
})
export class MouCustomerDetailComponent implements OnInit, AfterViewInit {
  private stepperGeneral: Stepper;
  private stepperFactoring: Stepper;
  private stepperFinancing: Stepper;
  @ViewChild("MouTcGeneral") public mouTcGeneral: MouCustTcComponent;
  @ViewChild("MouTcFactoring") public mouTcFactoring: MouCustTcComponent;
  @ViewChild("MouTcFinancing") public mouTcFinancing: MouCustTcComponent;
  @ViewChild("viewMouMainInfo") viewMouMainInfo: MouMainInfoComponent;
  mouType: string;
  mouCustId: number;
  currentStepIndex: number;
  mode: string;
  pageType: string;
  pageTitle: string;
  resultData: MouCustObj;
  UploadViewlink: string;
  Uploadlink: string;
  Viewlink: string;
  dmsObj: DMSObj;
  custObj: CustObj = new CustObj();
  isDmsReady: boolean = false;
  SysConfigResultObj : ResSysConfigResultObj = new ResSysConfigResultObj();
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['mouCustId'] != null) {
        this.mouCustId = params['mouCustId'];
      }
      if (params['mode'] != null) {
        this.pageType = params['mode'];
      }
      if (params['MOUType'] != null) {
        this.mouType = params['MOUType'];
      }
    });
    this.currentStepIndex = 1;
  }

  async ngOnInit() : Promise<void> {
    await this.httpClient.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms}).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    await this.httpClient.post(URLConstant.GetMouCustById, { Id: this.mouCustId }).toPromise().then(
      (response: MouCustObj) => {
        this.resultData = response;
        if (this.resultData.MrMouTypeCode == CommonConstant.GENERAL) {
          this.pageTitle = "MOU General";
        }
        else if (this.resultData.MrMouTypeCode == CommonConstant.FACTORING) {
          this.pageTitle = "MOU Factoring";
        }
        else if (this.resultData.MrMouTypeCode == CommonConstant.FINANCING) {
          this.pageTitle = "MOU Financing";
        }
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        this.dmsObj = new DMSObj();
        this.dmsObj.User = currentUserContext.UserName;
        this.dmsObj.Role = currentUserContext.RoleCode;
        this.dmsObj.ViewCode = CommonConstant.DmsViewCodeMou;
        this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, this.resultData['CustNo']));
        this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsMouId, this.resultData.MouCustNo));
        this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
      }
    );
  }

  async initDms() : Promise<void>{
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    await this.httpClient.post(URLConstant.GetMouCustById, { Id: this.mouCustId }).toPromise().then(
      (response: MouCustObj) => {
        if(this.SysConfigResultObj.ConfigValue == '1'){
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
        }
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
    else{
      this.stepperFinancing = new Stepper(document.querySelector('#stepperFinancing'), {
        linear: false,
        animation: true
      });
      this.stepperFinancing.to(this.currentStepIndex);
    }
  }

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
    else if (this.mouType == CommonConstant.FINANCING) {
      this.stepperFinancing.to(idx);
    }
    this.currentStepIndex = idx;

    this.viewMouMainInfo.ReloadUcViewGeneric();
  }

  saveMouTc() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.mouTcGeneral.Save();
      if(this.SysConfigResultObj.ConfigValue == '0'){
        this.endOfTab()
      }     
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.mouTcFactoring.Save();
      if(this.SysConfigResultObj.ConfigValue == '0'){
        this.endOfTab()
      }  
    }
    else if (this.mouType == CommonConstant.FINANCING) {
      this.mouTcFinancing.Save();
      if(this.SysConfigResultObj.ConfigValue == '0'){
        this.endOfTab()
      }  
    }
  }

  backFromMouTc() {
    if (this.mouType == CommonConstant.GENERAL) {
      this.stepHandlerGeneral({ StatusCode: "-1" });
    }
    else if (this.mouType == CommonConstant.FACTORING) {
      this.stepHandlerFactoring({ StatusCode: "-1" });
    }
    else if (this.mouType == CommonConstant.FINANCING) {
      this.stepHandlerFinancing({ StatusCode: "-1" });
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
    else if (this.mouType == CommonConstant.FINANCING) {
      this.stepperFinancing.previous();
      this.currentStepIndex--;
    }
  }

  editMainInfoHandler() {
    if (this.pageType == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_DETAIL], { MouCustId: this.mouCustId, mode: "return", MrMouTypeCode: this.mouType });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_DETAIL], { MouCustId: this.mouCustId, mode: "edit", MrMouTypeCode: this.mouType });
    }
  }

  cancelHandler() {
    if (this.pageType == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EDIT_CUST_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_PAGING], {});
    }
  }

  submitHandler() {
    if ((this.mouType == CommonConstant.GENERAL && this.currentStepIndex >= 4) || (this.mouType == CommonConstant.FACTORING && this.currentStepIndex >= 5) || (this.mouType == CommonConstant.FINANCING && this.currentStepIndex >= 5)) {
      
      var mouObj = { Id: this.mouCustId }
      this.httpClient.post(URLConstant.SubmitWorkflowMouRequest, mouObj).subscribe(
        () => {
          this.toastr.successMessage("Success");
          if (this.pageType == "return") {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EDIT_CUST_PAGING], {});
          }
          else {
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_PAGING], {});
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
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EDIT_CUST_PAGING], {});
        }
        else {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_PAGING], {});
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
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_EDIT_CUST_PAGING], {});
        }
        else {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_REQ_PAGING], {});
        }
        break;
      default:
        break;
    }
    if(this.currentStepIndex == 6){
      await this.initDms();
    }
  }

  async stepHandlerFinancing(response) {
    switch (response["StatusCode"].toString()) {
      case "200":
          this.stepperFinancing.next();
          this.currentStepIndex++;
        break;

      case "-1":
        this.stepperFinancing.previous();
        this.currentStepIndex--;
        break;

      case "-2":
        if (this.pageType == "return") {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_EDIT_CUST_PAGING],{});
        }
        else {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_REQ_PAGING],{});
        }
        break;
      default:
        break;
    }
    this.viewMouMainInfo.ReloadUcViewGeneric();
    if(this.currentStepIndex == 6){
      await this.initDms();
    }
  }
  
  endOfTab() {
    this.toastr.successMessage("Success");
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_REQ_PAGING],{});
  }
}
