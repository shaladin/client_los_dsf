import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqMouForEditConfirmCancelObj } from 'app/shared/model/request/mou/req-mou-for-edit-confirm-cancel-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/workflow/v2/request-task-model-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';

@Component({
  selector: 'app-mou-cancel',
  templateUrl: './mou-cancel.component.html'
})
export class MouCancelComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  user: CurrentUserContext;
  RequestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj : IntegrationObj = new IntegrationObj();
  MrMouTypeCode :string;
  HeadOfficeCode : string;
  IsReady: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router, 
    private cookieService: CookieService,
    private AdInsHelperService: AdInsHelperService
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['MrMouTypeCode'] != null) {
        this.MrMouTypeCode = params['MrMouTypeCode'];
      }
     });
  }

  async ngOnInit() {

    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCancel.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCancel.json";
      
    let critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'MC.MR_MOU_TYPE_CODE';
    critLobObj.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
    
    if(environment.isCore) {

      await this.http.post(URLConstant.GetHeadOffice,{}).toPromise().then(
        (response) => {
          this.HeadOfficeCode = response["OfficeCode"];
        });

      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchMouCancelV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchMouCancelV2.json";
      this.inputPagingObj.isJoinExAPI = true;
      
      this.RequestTaskModel.ProcessKey = this.getMouWorkflowCode();
      this.RequestTaskModel.OfficeCode = "";
      if(this.user[CommonConstant.OFFICE_CODE] != this.HeadOfficeCode)
        this.RequestTaskModel.OfficeCode = this.user[CommonConstant.OFFICE_CODE];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllWorkflowInstance;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "BusinessKey";
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }

    this.IsReady = true;
  }

  getMouWorkflowCode() {
    switch(this.MrMouTypeCode) {
      case CommonConstant.MOU_TYPE_GENERAL:
        return CommonConstant.WF_MOU_GENERAL;
      case CommonConstant.MOU_TYPE_FACTORING:
        return CommonConstant.WF_MOU_FACTORING;
      default:
        return CommonConstant.WF_MOU_DLFN;
    }
  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          else if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
    else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
        let mouCancel =  new ReqMouForEditConfirmCancelObj();
        mouCancel.MouStat = CommonConstant.MouStatCancel;
        mouCancel.MouCustId = event.RowObj.MouCustId;
        mouCancel.WfTaskListId = environment.isCore ? event.RowObj.Id : event.RowObj.WfTaskListId;
        mouCancel.RowVersion = event.RowObj.RowVersions;

        let EditMouForCancelByMouIdUrl = environment.isCore ? URLConstant.EditMouForCancelByMouIdV2 : URLConstant.EditMouForCancelByMouId;
        this.http.post(EditMouForCancelByMouIdUrl, mouCancel).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_CANCEL], {"MrMouTypeCode" : this.MrMouTypeCode});
            });
          }
        );
      }
    }
  }

}
