import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-offering-paging',
  templateUrl: './prod-offering-paging.component.html'
})
export class ProdOfferingPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddLink: string = NavigationConstant.PROD_OFFERING_ADD;
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOffering.json";
    this.InputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOffering.json";

    let WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.InputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    let WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdOfferingStat";
    WVProdStatObj.value = "RET";
    this.InputPagingObj.whereValue.push(WVProdStatObj);
  }

  EditProdOfr(e) {
    if (e.RowObj.DraftProdOfferingHId == null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_ADD], { "ProdOfferingHId": e.RowObj.prodOfferingHId, "mode": "edit" });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_ADD], { "ProdOfferingHId": e.RowObj.DraftProdOfferingHId, "mode": "edit" });
    }
  }
}
