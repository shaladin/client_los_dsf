import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-asset-allocation-paging',
  templateUrl: './asset-allocation-paging.component.html'
})
export class AssetAllocationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;
  constructor(private route: ActivatedRoute) {
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
    this.inputPagingObj._url = "./assets/ucpaging/searchAssetAllocation.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAssetAllocation.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "AST_ALO_" + this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critObj);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'A.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);
  }


  GetCallBack(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }
}
