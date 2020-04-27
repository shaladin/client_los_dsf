import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-order-multi-asset',
  templateUrl: './delivery-order-multi-asset.component.html',
  styles: []
})
export class DeliveryOrderMultiAssetComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  lobCode: string;
  
  constructor(
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['LobCode'] != null) {
        this.lobCode = params['LobCode'];
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDeliveryOrderMultiAsset.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDeliveryOrderMultiAsset.json";

    var criteriaList = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'AG.AGRMNT_CURR_STEP';
    critObj.value = "DELIVERY_ORDER";
    criteriaList.push(critObj);

    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'AP.LOB_CODE';
    critObj.value = this.lobCode;
    criteriaList.push(critObj);
    this.inputPagingObj.addCritInput = criteriaList;
  }

}
