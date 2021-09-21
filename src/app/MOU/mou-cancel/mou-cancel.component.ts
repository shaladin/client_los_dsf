import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqMouForEditConfirmCancelObj } from 'app/shared/model/Request/MOU/ReqMouForEditConfirmCancelObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

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

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router, private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCancel.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCancel.json";

    if(environment.isCore) {
      this.inputPagingObj._url = "./assets/ucpaging/mou/V2/searchMouCancelV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/V2/searchMouCancelV2.json";
      this.inputPagingObj.isJoinExAPI = true;
      
      this.RequestTaskModel.ProcessKeys = [CommonConstant.WF_MOU_GENERAL, CommonConstant.WF_MOU_FACTORING, CommonConstant.WF_MOU_DLFN];
      this.RequestTaskModel.OfficeRoleCodes = [this.user[CommonConstant.ROLE_CODE],
                                               this.user[CommonConstant.OFFICE_CODE],
                                               this.user[CommonConstant.ROLE_CODE] + "-" + this.user[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllWorkflowInstance;
      this.IntegrationObj.requestObj = this.RequestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "BusinessKey";
      this.IntegrationObj.joinType = AdInsConstant.JoinTypeLeft;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }
  }

  getEvent(event) {
    let custId: number;
    let mrCustTypeCode: string;
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          custId = response['CustId'];
          mrCustTypeCode = response['MrCustTypeCode'];

          if(mrCustTypeCode == CommonConstant.CustTypeCompany){
            AdInsHelper.OpenCustomerCoyViewByCustId(custId);
          }
          
          if(mrCustTypeCode == CommonConstant.CustTypePersonal){
            AdInsHelper.OpenCustomerViewByCustId(custId);
          }
        });
    }
    else if (event.Key == "cancel") {
      if (confirm("Are you sure to cancel this?")) {
        let mouCancel =  new ReqMouForEditConfirmCancelObj();
        mouCancel.MouStat = CommonConstant.MouStatCancel;
        mouCancel.MouCustId = event.RowObj.MouCustId;
        mouCancel.WfTaskListId = event.RowObj.WfTaskListId;
        mouCancel.RowVersion = event.RowObj.RowVersions;

        let EditMouForCancelByMouIdUrl = environment.isCore ? URLConstant.EditMouForCancelByMouIdV2 : URLConstant.EditMouForCancelByMouId;
        this.http.post(EditMouForCancelByMouIdUrl, mouCancel).subscribe(
          response => {
            this.toastr.successMessage(response["Message"]);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_CUST_CANCEL], {});
            });
          }
        );
      }
    }
  }

}
