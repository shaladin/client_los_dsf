import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';

@Component({
  selector: 'app-mou-customer-approval',
  templateUrl: './mou-customer-approval.component.html',
})
export class MouCustomerApprovalComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  user: CurrentUserContext;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCustomerApproval.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerApproval.json";

    this.arrCrit = new Array<CriteriaObj>();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.MOU_STAT';
    critObj.value = 'MAP';
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchMouCustomerApprovalV2.json";

      this.arrCrit = new Array();
      var critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionIn;
      critObj.propName = 'TL.CATEGORY_CODE';
      critObj.listValue = ['MOUC_GEN_APV', 'MOUC_FCTR_APV'];
      this.arrCrit.push(critObj);
  
      critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'TL.CURRENT_USER_ID';
      critObj.value = this.user.UserName;
      this.arrCrit.push(critObj);
  
      critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionOr;
      critObj.propName = 'TL.MAIN_USER_ID';
      critObj.value = this.user.UserName;
      this.arrCrit.push(critObj);
  
      this.inputPagingObj.addCritInput = this.arrCrit
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
  }
}
