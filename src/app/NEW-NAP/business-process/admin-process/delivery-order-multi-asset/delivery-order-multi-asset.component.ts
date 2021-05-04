import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-delivery-order-multi-asset',
  templateUrl: './delivery-order-multi-asset.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  bizTemplateCode: string;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.bizTemplateCode = params['BizTemplateCode'];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrderMultiAsset.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrderMultiAsset.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "AP.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'WF.ACT_CODE';
    critObj.value = "DO_" + this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critObj);

    var critBizTemplate = new CriteriaObj();
    critBizTemplate.restriction = AdInsConstant.RestrictionEq;
    critBizTemplate.propName = 'AP.BIZ_TEMPLATE_CODE';
    critBizTemplate.value = this.bizTemplateCode;

    this.inputPagingObj.addCritInput.push(critBizTemplate);
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
  }

}
