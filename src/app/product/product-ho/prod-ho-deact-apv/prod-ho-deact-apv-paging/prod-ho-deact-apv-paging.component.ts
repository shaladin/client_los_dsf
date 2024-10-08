import { Component, OnInit } from '@angular/core';
import { ApprovalReqObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { ApprovalObj } from 'app/shared/model/approval/approval-obj.model';
import { String } from 'typescript-string-operations';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ApprovalTaskService } from 'app/shared/services/ApprovalTask.service';
@Component({
  selector: 'app-prod-ho-deact-apv-paging',
  templateUrl: './prod-ho-deact-apv-paging.component.html'
})
export class ProdHoDeactApvPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  apvReqObj: ApprovalReqObj = new ApprovalReqObj();
  integrationObj: IntegrationObj = new IntegrationObj();
  UserContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(private toastr: NGXToastrService, 
              private http: HttpClient, 
              private router: Router, 
              private cookieService: CookieService,
              private apvTaskService: ApprovalTaskService) { }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHODeactApv.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHODeactApv.json";

    if(environment.isCore){
      this.InputPagingObj._url = "./assets/ucpaging/product/V2/searchProductHODeactApvV2.json";
      this.InputPagingObj.pagingJson = "./assets/ucpaging/product/V2/searchProductHODeactApvV2.json";

      this.InputPagingObj.isJoinExAPI = true;

      this.apvReqObj.CategoryCode = CommonConstant.CAT_CODE_PRD_HO_DEACT_APV;
      this.apvReqObj.Username = this.UserContext.UserName;
      this.apvReqObj.RoleCode = this.UserContext.RoleCode;
      this.apvReqObj.OfficeCode = this.UserContext.OfficeCode;
      this.integrationObj.requestObj = this.apvReqObj;
      this.integrationObj.leftColumnToJoin = "ProdCode";
      this.integrationObj.rightColumnToJoin = "TransactionNo";
      this.integrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.InputPagingObj.integrationObj = this.integrationObj; 
    }

    let critObj = new CriteriaObj();
    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'PROD_STAT';
    critObj.value = CommonConstant.ProdStatReqDeact;
    this.ArrCrit.push(critObj);
    this.InputPagingObj.addCritInput = this.ArrCrit;
  }



  async CallBackHandler(ev) {
    var isRoleAssignment = ev.RowObj.IsRoleAssignment.toString();
    if (ev.Key == "Process") {
      if(isRoleAssignment != CommonConstant.TRUE){
        if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
          this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_PROCESS_TASK);
          return;
        } 
      }
      else if (ev.RowObj.CurrentUser == "-") {
        await this.apvTaskService.ClaimApvTask(ev.RowObj.TaskId);
      }

      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_DEACTIVATE_APPRV_DETAIL],{ "ProdHId": ev.RowObj.ProdHId, "TaskId" : ev.RowObj.TaskId, "ApvReqId": environment.isCore ? ev.RowObj.RequestId : ev.RowObj.ApvReqId });
    }
    else if (ev.Key == "HoldTask") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_HOLD);
      } 
      else{
        this.apvTaskService.HoldApvTask(ev.RowObj.TaskId);
      }
    }
    else if (ev.Key == "TakeBack") {
      if (String.Format("{0:L}", ev.RowObj.MainUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_TAKE_BACK);
      } else {
        this.apvTaskService.TakeBackApvTask(ev.RowObj.TaskId, ev.RowObj.MainUser);
      }
    }
    else if (ev.Key == "UnClaim") {
      if (String.Format("{0:L}", ev.RowObj.CurrentUser) != String.Format("{0:L}", this.UserContext.UserName)) {
        this.toastr.warningMessage(ExceptionConstant.NOT_ELIGIBLE_FOR_UNCLAIM);
      } else {
        this.apvTaskService.UnclaimApvTask(ev.RowObj.TaskId);
      }
    }
    else {
      this.toastr.warningMessage(String.Format(ExceptionConstant.ERROR_NO_CALLBACK_SETTING, ev.Key));
    }
  }
}
