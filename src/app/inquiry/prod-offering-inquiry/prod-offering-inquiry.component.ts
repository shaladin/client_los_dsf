import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/uc-paging-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-prod-offering-inquiry',
  templateUrl: './prod-offering-inquiry.component.html'
})
export class ProdOfferingInquiryComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddLink: string = NavigationConstant.PROD_OFFERING_ADD;
  
  constructor() { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingInquiry.json";

    let WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.InputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    let WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdOfferingStat";
    WVProdStatObj.value = "RET";
    this.InputPagingObj.whereValue.push(WVProdStatObj);
  }

}
