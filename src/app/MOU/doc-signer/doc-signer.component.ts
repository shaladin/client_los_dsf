import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-doc-signer',
  templateUrl: './doc-signer.component.html',
  providers: [DecimalPipe]
})
export class DocSignerComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  user: CurrentUserContext;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustDocSigner.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustDocSigner.json";
    this.arrCrit = new Array<CriteriaObj>();

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = 'text';
    addCritMouStat.propName = 'MOU.MOU_STAT';
    addCritMouStat.restriction = AdInsConstant.RestrictionEq;
    addCritMouStat.value = CommonConstant.MouDocSigner;
    this.arrCrit.push(addCritMouStat);

    this.inputPagingObj.addCritInput = this.arrCrit;

  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
  }
}
