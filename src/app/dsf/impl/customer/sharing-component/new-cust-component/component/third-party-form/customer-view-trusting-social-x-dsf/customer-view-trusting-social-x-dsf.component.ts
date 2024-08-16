import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { CustObj } from 'app/shared/model/cust-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ThirdPartyTsXObj } from 'app/impl/shared/model/third-party-rslt/third-party-ts-x-obj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-customer-view-trusting-social-x-dsf',
  templateUrl: './customer-view-trusting-social-x-dsf.component.html'
})
export class CustomerViewTrustingSocialXDsfComponent implements OnInit {

  @Input() ThirdPartyTrxNo: string = null;
  CustId: number;
  CustNo: string;
  ThirdPartyTsObjs: Array<ThirdPartyTsXObj> = new Array<ThirdPartyTsXObj>();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['CustId'] != null) {
        this.CustId = params['CustId'];
      }
      if (params['CustNo'] != null) {
        this.CustNo = params['CustNo'];
      }
    });
  }

  ngOnInit() {
    if (this.CustNo) {
      this.getCustByCustNoAndThirdPartyTsObj();
      return;
    }

    if (this.ThirdPartyTrxNo != null) {
      this.getThirdPartyTsObj(this.ThirdPartyTrxNo);
    }

    if (this.ThirdPartyTrxNo == null && this.CustId != null) {
      this.getCustAndThirdPartyTsObj();
    }
  }

  getCustAndThirdPartyTsObj() {
    var custObj = new CustObj();
    custObj.CustId = this.CustId;

    this.http.post(URLConstant.GetCustByCustId, { Id: this.CustId }).subscribe(
      responseCust => {
        this.getThirdPartyTsObj(responseCust["ThirdPartyTrxNo"]);
      });
  }

  getCustByCustNoAndThirdPartyTsObj() {
    this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.CustNo }).subscribe(
      responseCust => {
        this.getThirdPartyTsObj(responseCust["ThirdPartyTrxNo"]);
      });
  }

  getThirdPartyTsObj(thirdPartyTrxNo) {
    // Rework BATCH-DSL-056
    this.http.post(URLConstantDsf.GetTrustingSocialListByTrxNoDsf, { TrxNo: thirdPartyTrxNo }).subscribe(
    // End Rework BATCH-DSL-056
    responseThirdParty => {
        this.ThirdPartyTsObjs = responseThirdParty["ReturnObject"];
      });
  }
}
