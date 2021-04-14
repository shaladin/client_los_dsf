import { Component, OnInit } from "@angular/core";
import { UcPagingObj, WhereValueObj } from "app/shared/model/UcPagingObj.Model";

@Component({
  selector: 'app-prod-offering-deact-paging',
  templateUrl: './prod-offering-deact-paging.component.html'
})
export class ProdOfferingDeactPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: any;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";

    var WVProdOfferingStatObj = new WhereValueObj();
    WVProdOfferingStatObj.property = "ProdOfferingStat";
    WVProdOfferingStatObj.value = "ACT";
    this.inputPagingObj.whereValue.push(WVProdOfferingStatObj);
  }
}
