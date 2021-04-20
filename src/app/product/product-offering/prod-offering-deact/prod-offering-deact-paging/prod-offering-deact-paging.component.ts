import { Component, OnInit } from "@angular/core";
import { UcPagingObj, WhereValueObj } from "app/shared/model/UcPagingObj.Model";

@Component({
  selector: 'app-prod-offering-deact-paging',
  templateUrl: './prod-offering-deact-paging.component.html'
})
export class ProdOfferingDeactPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  
  constructor() { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingDeactivate.json";

    let WVProdOfferingStatObj = new WhereValueObj();
    WVProdOfferingStatObj.property = "ProdOfferingStat";
    WVProdOfferingStatObj.value = "ACT";
    this.InputPagingObj.whereValue.push(WVProdOfferingStatObj);
  }
}
