import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import Stepper from 'bs-stepper';
import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { DMSObj } from 'app/shared/model/DMS/DMSObj.model';
import { DMSLabelValueObj } from 'app/shared/model/DMS/DMSLabelValueObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ResSysConfigResultObj } from 'app/shared/model/Response/ResSysConfigResultObj.model';
import { LeadInputLeadDataObj } from 'app/shared/model/LeadInputLeadDataObj.Model';
import { LeadAppObj } from 'app/shared/model/LeadAppObj.Model';

@Component({
  selector: 'app-lead-input-page',
  templateUrl: './lead-input-page.component.html',
  providers: [NGXToastrService],
})
export class LeadInputPageComponent implements OnInit {
  private stepper: Stepper;
  LeadId: number;
  CopyFrom: number;
  isCustData: boolean;
  isLeadData: boolean;
  TaskListId: number;
  titlePageType: string;
  viewLeadHeaderMainInfo: UcViewGenericObj = new UcViewGenericObj();
  pageType: string;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  @ViewChild("LeadMainInfo", { read: ViewContainerRef }) leadMainInfo: ViewContainerRef;
  AppStepIndex: number = 1;
  customObj: any;
  isDmsReady: boolean = false;
  isDmsData: boolean;


  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["TaskListId"] != null) {
        this.TaskListId = params["TaskListId"];
      }
      if (params["mode"] == "update") {
        this.pageType = params["mode"];
        this.titlePageType = "UPDATE";
      }
      else if (params["mode"] == "edit" || params["mode"] == undefined) {
        this.pageType = params["mode"];
        this.titlePageType = "INPUT";
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.http.post<ResSysConfigResultObj>(URLConstant.GetSysConfigPncplResultByCode, { Code: CommonConstant.ConfigCodeIsUseDms }).toPromise().then(
      (response) => {
        this.SysConfigResultObj = response
      });
    await this.http.post(URLConstant.GetLeadByLeadId, { Id: this.LeadId }).toPromise().then(
      (response) => {
        let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        if (this.SysConfigResultObj.ConfigValue == '1') {
          this.dmsObj = new DMSObj();
          this.dmsObj.User = currentUserContext.UserName;
          this.dmsObj.Role = currentUserContext.RoleCode;
          this.dmsObj.ViewCode = CommonConstant.DmsViewCodeLead;
          this.dmsObj.MetadataParent.push(new DMSLabelValueObj(CommonConstant.DmsNoCust, response["LeadNo"]));
          this.dmsObj.MetadataObject.push(new DMSLabelValueObj(CommonConstant.DmsLeadId, response["LeadNo"]));
          this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadView));
          this.isDmsReady = true;
        }
        console.log('dmsobj = ', JSON.stringify(this.dmsObj));
      });
    if (this.TaskListId > 0) {
      this.claimTask();
    }
    this.viewLeadHeaderMainInfo.viewInput = "./assets/ucviewgeneric/viewLeadHeader.json";
    this.viewLeadHeaderMainInfo.viewEnvironment = environment.losUrl;
    this.viewLeadHeaderMainInfo.ddlEnvironments = [
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
    this.EnterTab('custData');
    this.stepper.to(1);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    this.leadMainInfo.clear();
    const component = this.leadMainInfo.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewLeadHeaderMainInfo;

  }

  EnterTab(type) {
    if (type == "custData") {
      this.isCustData = true;
      this.isLeadData = false;
      this.isDmsData = false;
      this.AppStepIndex = 1;
    }
    if (type == "leadData") {
      this.isCustData = false;
      this.isLeadData = true;
      this.isDmsData = false;
      this.AppStepIndex = 2;
    }
    if (type == "uploadDocument") {
      this.isCustData = false;
      this.isLeadData = false;
      this.isDmsData = true;
      this.AppStepIndex = 3;
    }
  }

  editMainInfoHandler() {
    let modeName: string;
    if (this.pageType == undefined) {
      modeName = "edit";
    }
    else {
      modeName = this.pageType;
    }
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_INPUT_MAIN_INFO], { LeadId: this.LeadId, mode: modeName });
  }

  cancelHandler() {
    if (this.pageType == "update") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_UPDATE_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LEAD_PAGING], {});
    }
  }

  getValue(ev) {
    if (ev.stepMode != undefined) {
      if (ev.stepMode == "next") {
        this.stepper.next();
        this.AppStepIndex++;
        if (this.AppStepIndex == 2) {
          this.EnterTab("leadData");
          if (this.isLeadData == true) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
            this.leadMainInfo.clear();
            const component = this.leadMainInfo.createComponent(componentFactory);
            component.instance.viewGenericObj = this.viewLeadHeaderMainInfo;
          }
        }
        else if (this.AppStepIndex == 3) {
          this.customObj = ev;
          if (this.SysConfigResultObj.ConfigValue == '0') {
            this.endOfTab()
          } else {
            this.EnterTab("uploadDocument")
          }

        }

      }
      else {
        this.stepper.previous();
      }
    }
  }

  backTabToLeadData() {
    this.EnterTab("leadData");
    this.stepper.previous();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    this.leadMainInfo.clear();
    const component = this.leadMainInfo.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewLeadHeaderMainInfo;
  }

  async claimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    let wfClaimObj = { pWFTaskListID: this.TaskListId, pUserID: currentUserContext[CommonConstant.USER_NAME] };
    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }
  endOfTab() {
    this.http.post(URLConstant.GetLeadAssetByLeadId, { Id: this.customObj.LeadInputLeadDataObj.LeadAppObj.LeadId }).subscribe(
      (response) => {
        this.customObj.LeadInputLeadDataObj.LeadAssetObj.RowVersion = response["RowVersion"];
        this.http.post(URLConstant.GetLeadAppByLeadId, { Id: this.customObj.LeadInputLeadDataObj.LeadAppObj.LeadId }).subscribe(
          (response) => {
            this.customObj.LeadInputLeadDataObj.LeadAppObj.RowVersion = response["RowVersion"];
            let urlPost = this.customObj.urlPost;

            //Dari DSF
            if (this.customObj.typePage != "edit" || this.customObj.typePage != "update") {
              if (this.customObj.lobKta.includes(this.customObj.returnLobCode) == true) {
                urlPost = URLConstant.SubmitWorkflowLeadInputKta;
              }
            }

            this.http.post(urlPost, this.customObj.LeadInputLeadDataObj).subscribe(
              () => {
                AdInsHelper.RedirectUrl(this.router, [this.customObj.paging], {});
              }
            );
          });
      });
  }
}