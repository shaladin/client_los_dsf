import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { StgAutoDebitRegisLogObj } from 'app/impl/shared/model/auto-debit-registration/StgAutoDebitRegisLogObj.model';
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
    private adInsHelperService: AdInsHelperService,
    private toastr: NGXToastrService
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

    else if (e.Key == "Request"){
      if (confirm("Are You Sure You Want To Process This Data ?")) {
        //get auto debit regis berdasarkan trxno
        this.http.post(URLConstantX.ProcessAutoDebitAccInquiry, { TrxNo: e.RowObj.TransactionNo }).subscribe(
          response => {
            if(response["StatusCode"]=="200"){
              this.toastr.successMessage(response["Message"]);
            }


          }
        )
      }
    }

  }
}
