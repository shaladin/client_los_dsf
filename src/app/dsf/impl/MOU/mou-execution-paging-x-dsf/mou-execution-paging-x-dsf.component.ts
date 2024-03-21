import { Component, OnDestroy, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { String } from 'typescript-string-operations';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';

@Component({
  selector: 'app-mou-execution-paging-x-dsf',
  templateUrl: './mou-execution-paging-x-dsf.component.html',
  styleUrls: ['./mou-execution-paging-x-dsf.component.css']
})
export class MouExecutionPagingXDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  MrMouTypeCode: string;
  isReady: boolean = false;
  navigationSubscription;
  
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {
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
      if (params["MrMouTypeCode"] != null) {
        this.MrMouTypeCode = params["MrMouTypeCode"];
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
    let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.inputPagingObj.addCritInput = new Array();
    
    const addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "MOU.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(addCritMouType);

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/V2/searchMouRequestForExecXV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKey = String.Format(CommonConstant.WF_MOU, (this.MrMouTypeCode != CommonConstant.MOU_TYPE_DLFN ? this.MrMouTypeCode : CommonConstant.DF));
      this.requestTaskModel.TaskDefinitionKey = String.Format(CommonConstant.MOU_EXECUTION, this.MrMouTypeCode);
      this.requestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.ROLE_CODE],
                                               UserAccess[CommonConstant.OFFICE_CODE],
                                               UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];

      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
    else{
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchMouRequestForExecX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchMouRequestForExecX.json";
    }
  }

  getEvent(event) {
    console.log(event)
    if (event.Key == "exe") {
      var obj = {
        MouCustId: event.RowObj.MouCustId,
        MouCustNo: event.RowObj.MouCustNo
      }
      this.http.post(URLConstantX.CheckMouActiveR2, obj).subscribe(
        response => {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.MOU_EXECUTION_DETAIL_DSF], { "MouCustId": event.RowObj.MouCustId,  "WfTaskListId": environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId });
        }
      );
    } else if (event.Key == "customer") {
      let custObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }

}
