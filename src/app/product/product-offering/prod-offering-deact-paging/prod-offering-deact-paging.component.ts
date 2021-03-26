import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { UcPagingObj, WhereValueObj } from "app/shared/model/UcPagingObj.Model";
import { URLConstant } from "app/shared/constant/URLConstant";

@Component({
  selector: 'app-prod-offering-deact-paging',
  templateUrl: './prod-offering-deact-paging.component.html'
})
export class ProdOfferingDeactPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  constructor() { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";

    var WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.inputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    var WVProdOfferingStatObj = new WhereValueObj();
    WVProdOfferingStatObj.property = "ProdOfferingStat";
    WVProdOfferingStatObj.value = "ACT";
    this.inputPagingObj.whereValue.push(WVProdOfferingStatObj);
  }
}
