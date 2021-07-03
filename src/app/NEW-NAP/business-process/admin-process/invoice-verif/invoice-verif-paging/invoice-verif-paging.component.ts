import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-invoice-verif-paging',
  templateUrl: './invoice-verif-paging.component.html'
})
export class InvoiceVerifPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.BizTemplateCode = params["BizTemplateCode"];
    });
  }

  ngOnInit() {
    if (this.BizTemplateCode == "DLFN") {
      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerifDF.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerifDF.json";
    }
    else {
      var arrCrit = new Array();
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionLike;
      critObj.propName = 'A.BIZ_TEMPLATE_CODE';
      critObj.value = this.BizTemplateCode;
      arrCrit.push(critObj);

      this.inputPagingObj._url = "./assets/ucpaging/searchInvoiceVerif.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchInvoiceVerif.json";
      this.inputPagingObj.addCritInput = arrCrit;
    }

  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
