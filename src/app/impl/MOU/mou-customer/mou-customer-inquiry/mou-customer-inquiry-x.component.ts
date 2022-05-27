import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-customer-inquiry-x',
  templateUrl: './mou-customer-inquiry-x.component.html'
})
export class MouCustomerInquiryXComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  user: CurrentUserContext;
  MrMouTypeCode: string;

  constructor(private http: HttpClient, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService, private route: ActivatedRoute) {    
    this.route.queryParams.subscribe(params => {
    if (params["MrMouTypeCode"] != null) {
      this.MrMouTypeCode = params["MrMouTypeCode"];
    }});
  }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if(this.MrMouTypeCode != "FACTORING"){
      this.inputPagingObj._url = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerInquiry.json";
    }else{
      this.inputPagingObj._url = "./assets/impl/ucpaging/mou/searchMouCustomerInquiryFactoringX.json";
      this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/mou/searchMouCustomerInquiryFactoringX.json";
    }

    const addCritMouType = new CriteriaObj();
    addCritMouType.DataType = "text";
    addCritMouType.propName = "M.MR_MOU_TYPE_CODE";
    addCritMouType.restriction = AdInsConstant.RestrictionEq;
    addCritMouType.value = this.MrMouTypeCode;
    this.inputPagingObj.addCritInput.push(addCritMouType);
  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
    }else if(event.Key == "vendor") {
      this.CustNoObj.CustNo = event.RowObj.VendorCustNo;
    }
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
