import { UcviewgenericComponent } from '@adins/ucviewgeneric';
import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ReqSimpleLeadReturnDsfObj } from 'app/dsf/model/ReqSimpleLeadReturnDsfObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { ClaimTaskLeadDsf } from 'app/shared/model/claim-task-lead-dsf-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { DMSLabelValueObj } from 'app/shared/model/dms/dms-label-value-obj.model';
import { DMSObj } from 'app/shared/model/dms/dms-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { ReqLeadInputLeadDataDsfObj } from 'app/shared/model/request/lead/req-input-lead-data-dsf-obj.model';
import { ReqLeadInputLeadDataObj } from 'app/shared/model/request/lead/req-input-lead-data-obj.model';
import { ResSysConfigResultObj } from 'app/shared/model/response/res-sys-config-result-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import Stepper from 'bs-stepper';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-new-lead-qc-detail-dsf',
  templateUrl: './new-lead-qc-detail-dsf.component.html',
  styleUrls: ['./new-lead-qc-detail-dsf.component.css']
})
export class NewLeadQcDetailDsfComponent implements OnInit {

  LeadId: number;
  WfTaskListId: any;
  viewLeadHeaderMainInfo: UcViewGenericObj = new UcViewGenericObj();
  pageType: string;
  dmsObj: DMSObj;
  SysConfigResultObj: ResSysConfigResultObj = new ResSysConfigResultObj();
  @ViewChild("LeadMainInfo", { read: ViewContainerRef }) leadMainInfo: ViewContainerRef;
  customObj: any;
  isDmsReady: boolean = false;
  isDmsData: boolean;
  ReqLeadInputLeadDataObj: ReqLeadInputLeadDataObj = new ReqLeadInputLeadDataObj();
  isReturn:boolean = false;
  inputLookupObj: InputLookupObj;
  isInputLookupObj: boolean = false;
  resultResponse;
  arrAddCrit: Array<CriteriaObj>;
  DDLReasonReturn;
  ReqLeadInputLeadDataDsfObj: ReqLeadInputLeadDataDsfObj = new ReqLeadInputLeadDataDsfObj();
  ClaimTaskLeadDsf: ClaimTaskLeadDsf = new ClaimTaskLeadDsf();
  roleCode: string;
  officeCode: string;
  CurrentUserContext: any;
  ReqSimpleLeadReturnDsfObj: ReqSimpleLeadReturnDsfObj = new ReqSimpleLeadReturnDsfObj();

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cookieService: CookieService,
              private claimTaskService: ClaimTaskService,
              private toastr: NGXToastrService,
              private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["WfTaskListId"] != null) {
        this.WfTaskListId = params["WfTaskListId"];
      }
    });
  }

  SimpleLeadQCForm = this.fb.group({
    DPCUsername: [''],
    LeadId: [''],
    Reason: [''],
    Notes: [''],
    value: ['']
  });

  async ngOnInit() {
    this.DDLReasonReturn = new Array();
    this.CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
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
            this.dmsObj.Option.push(new DMSLabelValueObj(CommonConstant.DmsOverideSecurity, CommonConstant.DmsOverideUploadDownloadView));
            this.isDmsReady = true;
          }
          console.log('dmsobj = ', JSON.stringify(this.dmsObj));
        });

    if (environment.isCore) {
      if(this.WfTaskListId != "" && this.WfTaskListId != undefined){
        this.claimTaskService.ClaimTaskV2(this.WfTaskListId);
      }
    }
    else if(this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
    // Self Custom Changes
    this.viewLeadHeaderMainInfo.viewInput = "./assets/dsf/ucgridview/viewLeadHeaderDsf.json";
    // End Self Custom Changes
    this.viewLeadHeaderMainInfo.ddlEnvironments = [
      {
        name: "LeadNo",
        environment: environment.losR3Web
      },
    ];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UcviewgenericComponent);
    this.leadMainInfo.clear();
    const component = this.leadMainInfo.createComponent(componentFactory);
    component.instance.viewGenericObj = this.viewLeadHeaderMainInfo;

    await this.makeLookUpObj();
    await this.BindDDLReasonReturn();
  }

  async BindDDLReasonReturn() {
    var obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeCrdReview };
    await this.http.post(URLConstant.GetListActiveRefReason, obj).toPromise().then(
        (response) => {
            this.DDLReasonReturn = response[CommonConstant.ReturnObj];
        });
  } 

  async makeLookUpObj() {
    this.arrAddCrit = new Array<CriteriaObj>();

    let addCrit1 = new CriteriaObj();
    addCrit1.DataType = "text";
    addCrit1.propName = "rr.ROLE_CODE";
    addCrit1.restriction = AdInsConstant.RestrictionEq;
    addCrit1.value = "DPC";
    this.arrAddCrit.push(addCrit1);

    let addCrit2 = new CriteriaObj();
    addCrit2.DataType = "text";
    addCrit2.propName = "ro.OFFICE_CODE";
    addCrit2.restriction = AdInsConstant.RestrictionEq;
    addCrit2.value = this.CurrentUserContext.OfficeCode;
    this.arrAddCrit.push(addCrit2);
    
    // Lookup obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupEmpDsf.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupEmpDsf.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupEmpDsf.json";
    this.inputLookupObj.jsonSelect = this.resultResponse;
    this.inputLookupObj.addCritInput = this.arrAddCrit;

    this.isInputLookupObj = true;
  }

  getLookupEmployeeResponse(ev) {
    this.SimpleLeadQCForm.patchValue({
      DPCUsername: ev.Username,
      LeadId: this.LeadId,
      value: ev.Username
    });
    this.roleCode = ev.RoleCode;
    this.officeCode = ev.OfficeCode;
  }

  onChangeReason(ev) {

  }

  Return()
  {
    this.isReturn = true;
  }

  CancelReturn()
  {
    this.isReturn = false;
  }

  Cancel()
  {
    AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_QC_PAGING_DSF], {});
  }

  async Save()
  {
    // Save Claim
    // Error Message if DPC already have Task
    // CR Change Self Custom
    this.ClaimTaskLeadDsf.LeadId = this.LeadId;
    this.ClaimTaskLeadDsf.ActivityName = "NewLeadToBeFollowUpTask";
    this.ClaimTaskLeadDsf.ClaimBy = this.SimpleLeadQCForm.controls["DPCUsername"].value;
    this.ClaimTaskLeadDsf.ClaimDt = this.CurrentUserContext.BusinessDt;
    this.ClaimTaskLeadDsf.ClaimOffice = this.officeCode;
    this.ClaimTaskLeadDsf.ClaimRole = this.roleCode;
    this.ClaimTaskLeadDsf.IsDone = false;
    let IsValid = true;

    await this.http.post(URLConstantDsf.AddClaimTaskLeadDsf, this.ClaimTaskLeadDsf).toPromise().then(
      response => {
        if (response["TaskStatus"] == "OnTask")
          {
            this.toastr.warningMessage("User already on another task Lead No: " + response["LeadNoProcessed"]);
            IsValid = false;
            return false;
          }
      }
    )
    // CR Change Self Custom

    // Save Workflow
    this.ReqLeadInputLeadDataDsfObj.WfTaskListId = this.WfTaskListId;
    this.ReqLeadInputLeadDataDsfObj.ReturnValue = "APPROVE"
    this.http.post(URLConstantDsf.SubmitWorkflowLeadQCV2Dsf, this.ReqLeadInputLeadDataDsfObj).toPromise().then(
      (response) =>
        {
          this.toastr.successMessage("Success");
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_QC_PAGING_DSF], {});
        }
    )
  }

  async SaveReturn()
  {
    // Save Claim Return
    this.ReqSimpleLeadReturnDsfObj.LeadId = this.LeadId;
    this.ReqSimpleLeadReturnDsfObj.ReturnReason = this.SimpleLeadQCForm.controls["Reason"].value;
    this.ReqSimpleLeadReturnDsfObj.ReturnNotes = this.SimpleLeadQCForm.controls["Notes"].value;
    await this.http.post(URLConstantDsf.SimpleLeadReturnDsf, this.ReqSimpleLeadReturnDsfObj).toPromise().then(
      (response) =>
        {
          
        }
    )

    // Save Workflow Return
    this.ReqLeadInputLeadDataDsfObj.WfTaskListId = this.WfTaskListId;
    this.ReqLeadInputLeadDataDsfObj.ReturnValue = "RETURN"
    this.http.post(URLConstantDsf.SubmitWorkflowLeadQCV2Dsf, this.ReqLeadInputLeadDataDsfObj).toPromise().then(
      (response) =>
        {
          this.toastr.successMessage("Success");
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.SIMPLE_LEAD_QC_PAGING_DSF], {});
        }
    )
  }

}
