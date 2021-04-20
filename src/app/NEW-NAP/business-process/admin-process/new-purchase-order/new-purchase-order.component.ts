import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-purchase-order',
  templateUrl: './new-purchase-order.component.html',
  styles: []
})
export class NewPurchaseOrderComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  arrCrit: Array<CriteriaObj>;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.bizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.bizTemplateCode);
      }
      else {
        this.bizTemplateCode = CommonConstant.CFNA
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchNewPurchaseOrder.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewPurchaseOrder.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "PO_" + this.bizTemplateCode;
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critObj.value = this.bizTemplateCode;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    else if (ev.Key == "ViewAgrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }

}
