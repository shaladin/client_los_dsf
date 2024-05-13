import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';


@Component({
  selector: 'app-credit-review-paging-x-dsf',
  templateUrl: './credit-review-paging-x-dsf.component.html',
  styleUrls: ['./credit-review-paging-x-dsf.component.css']
})
export class CreditReviewPagingXDsfComponent implements OnInit, OnDestroy  {
  BizTemplateCode: string;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
  userAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isReady: boolean = false;
  navigationSubscription;

  constructor(private route: ActivatedRoute, private cookieService: CookieService, private router: Router,
  private toastr: ToastrService) {
    this.SubscribeParam();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.RefetchData();
      }
    });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchCreditReviewCr.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchCreditReviewCr.json";

    let arrCrit = new Array();
    if(environment.isCore){
      this.inputPagingObj._url = "./assets/impl/ucpaging/V2/searchCreditReviewCrV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/V2/searchCreditReviewCrV2.json";
      this.inputPagingObj.isJoinExAPI = true
  
      //Self Cust CR PIC Credit Review
      this.RequestTaskModel.UserName = this.userAccess[CommonConstant.USER_NAME];

      if((this.BizTemplateCode == CommonConstant.FL4W || this.BizTemplateCode == CommonConstant.CF4W) && this.userAccess[CommonConstant.ROLE_CODE] == CommonConstantDsf.DPCSPV){
        console.log(CommonConstantDsf.DPCSPV)
        var critRoleCode = new CriteriaObj()
        critRoleCode.restriction = AdInsConstant.RestrictionEq;
        critRoleCode.propName = 'TaskRoleCode';
        critRoleCode.value = this.userAccess[CommonConstant.ROLE_CODE];
        critRoleCode.isCriteriaDataTable = true;
        arrCrit.push(critRoleCode);
        
        this.RequestTaskModel.UserName = "";
      }

      //End Self Cust CR PIC Credit Review
      this.RequestTaskModel.ProcessKey = CommonConstant.WF_CODE_CRP_MD + this.BizTemplateCode;
      this.RequestTaskModel.TaskDefinitionKey = CommonConstant.ACT_CODE_RVW + this.BizTemplateCode;
      this.RequestTaskModel.OfficeRoleCodes = [this.userAccess[CommonConstant.ROLE_CODE],
                                               this.userAccess[CommonConstant.OFFICE_CODE], 
                                               this.userAccess[CommonConstant.ROLE_CODE] + "-" + this.userAccess[CommonConstant.OFFICE_CODE]];
  
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "AppNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
      
      var critCurrStep = new CriteriaObj();
      critCurrStep.restriction = AdInsConstant.RestrictionEq;
      critCurrStep.propName = 'a.APP_CURR_STEP';
      critCurrStep.value = CommonConstant.AppStepRvw;
      arrCrit.push(critCurrStep);
    }else{
      let critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "RVW_" + this.BizTemplateCode;
      arrCrit.push(critObj);
    }
    this.inputPagingObj.addCritInput = arrCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    else if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_CRD_PRCS_CRD_REVIEW_CR_DETAIL_X], { "AppId": ev.RowObj.AppId, "WfTaskListId": environment.isCore ? ev.RowObj.Id : ev.RowObj.WfTaskListId });
    }
    else if (ev.Key == "CaptureStat") {
      this.toastr.warning(ExceptionConstant.PLEASE_WAIT_A_MINUTE_UNTIL_CAPTURE_DATA_IS_FINISHED);
      return;
    }
  }

}
