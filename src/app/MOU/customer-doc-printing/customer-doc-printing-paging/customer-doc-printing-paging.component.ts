import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  user: CurrentUserContext;
  MrMouTypeCode: string;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {    
    this.route.queryParams.subscribe(params => {
    if (params["MrMouTypeCode"] != null) {
      this.MrMouTypeCode = params["MrMouTypeCode"];
    }});
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";

    const addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "MC.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(addCritMouType);

    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
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
