import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-doc-signer-paging-dsf',
  templateUrl: './doc-signer-paging-dsf.component.html',
  styleUrls: ['./doc-signer-paging-dsf.component.css']
})
export class DocSignerPagingDsfComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  userAccess: CurrentUserContext;

  constructor(private route: ActivatedRoute, private http: HttpClient, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    var pagingJsonPath = "./assets/dsf/ucpaging/searchDocSignerDsf.json";

    if (this.BizTemplateCode == CommonConstant.OPL) {
      pagingJsonPath = "./assets/ucpaging/opl/search-doc-signer-opl-paging.json"
    }

    this.inputPagingObj._url = pagingJsonPath;
    this.inputPagingObj.pagingJson = pagingJsonPath;

    if (this.BizTemplateCode == CommonConstant.OPL) {

      let arrCrit = new Array();
      let critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'WTL.ACT_CODE';
      critObj.value = "DOC_SIGN_" + this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj.addCritInput = arrCrit;
    }
    else {
      var whereValueObj = new WhereValueObj();
      whereValueObj.property = "BizTemplateCode";
      whereValueObj.value = this.BizTemplateCode;
      this.inputPagingObj.whereValue.push(whereValueObj);

      // let arrCritOffice = new Array();
      // let critOfficeObj = new CriteriaObj();
      // critOfficeObj.restriction = AdInsConstant.RestrictionLike;
      // critOfficeObj.propName = 'AG.OFFICE_CODE';
      // critOfficeObj.value = this.userAccess.OfficeCode;
      // arrCritOffice.push(critOfficeObj);

      // this.inputPagingObj.addCritInput = arrCritOffice;
    }
  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      let GetProduct = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response.Id);
        });
    } else if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
