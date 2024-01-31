import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-auto-debit-registration-inquiry',
  templateUrl: './auto-debit-registration-inquiry.component.html'
})
export class AutoDebitRegistrationInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private adInsHelperService: AdInsHelperService
    ) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
      }
    });
   }

  ngOnInit() {
    this.inputPagingObj._url = './assets/impl/ucpaging/searchAutoDebitRegistrationInquiry.json';
    this.inputPagingObj.pagingJson = './assets/impl/ucpaging/searchAutoDebitRegistrationInquiry.json';

    let WVBizTemplateCodeObj = new WhereValueObj();
    WVBizTemplateCodeObj.value = this.bizTemplateCode;

    this.inputPagingObj.whereValue.push(WVBizTemplateCodeObj);
  }

  GetCallBack(e) {
    console.log(e);
    if (e.Key == "Customer") {
      this.http.post(URLConstant.GetCustByCustNo, { CustNo: e.RowObj.CustNo }).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
  }
}
