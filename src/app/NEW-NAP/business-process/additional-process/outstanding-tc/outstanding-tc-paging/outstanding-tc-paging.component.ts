import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-outstanding-tc-paging',
  templateUrl: './outstanding-tc-paging.component.html'
})
export class OutstandingTcPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchOutstandingTC.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchOutstandingTC.json";

    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critObj);
  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      let GetProduct = new GenericObj();
      GetProduct.Code = ev.RowObj.ProdOfferingCode;
      this.http.post<GenericObj>(URLConstant.GetProdOfferingHByCode, GetProduct).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response.Id)
        });
    } else if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }
}
