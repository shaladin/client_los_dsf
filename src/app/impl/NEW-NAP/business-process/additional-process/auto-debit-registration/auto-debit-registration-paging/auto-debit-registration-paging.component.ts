import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-auto-debit-registration-paging',
  templateUrl: './auto-debit-registration-paging.component.html'
})
export class AutoDebitRegistrationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
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
    this.inputPagingObj._url = './assets/impl/ucpaging/searchAutoDebitRegistration.json';
    this.inputPagingObj.pagingJson = './assets/impl/ucpaging/searchAutoDebitRegistration.json';

    let WVBizTemplateCodeObj = new WhereValueObj();
    WVBizTemplateCodeObj.value = this.bizTemplateCode;

    this.inputPagingObj.whereValue.push(WVBizTemplateCodeObj);
  }

  GetCallBack(e: any) {
    if(e.Key == "Request")
    {
      if(confirm("Are You Sure You Want To Process This Data ?"))
      {
        let obj = 
        {
          TransactionNo: e.RowObj.TransactionNo,
          RowVersion: e.RowObj.RowVersion
        }
        this.http.post(URLConstantX.ProcessAutoDebitRegistration, obj).subscribe(
          (response) => {
            if(response["StatusCode"] != 200){
              throw this.toastr.errorMessage(response["Message"]);
            }
            else
            {
              this.toastr.successMessage(response["message"]);
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_AUTO_DEBIT_REGISTRATION_PAGING]);
            }
          }
        )
      }
    }
    else if (e.Key == "Customer") {
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
