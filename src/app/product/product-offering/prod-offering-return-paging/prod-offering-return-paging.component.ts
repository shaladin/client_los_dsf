import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-offering-return-paging',
  templateUrl: './prod-offering-return-paging.component.html'
})
export class ProdOfferingReturnPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private router: Router) { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingReturn.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingReturn.json";

    let WVProdOfferingStatObj = new WhereValueObj();
    WVProdOfferingStatObj.property = "ProdOfferingStat";
    WVProdOfferingStatObj.value = "RET";
    this.InputPagingObj.whereValue.push(WVProdOfferingStatObj);
  }

  EditProdOfr(e) {
    if (e.RowObj.DraftProdOfferingHId == null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_ADD], { "ProdOfferingHId": e.RowObj.CurrentProdOfferingHId, "mode": "edit", "source": "return" });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PROD_OFFERING_ADD], { "ProdOfferingHId": e.RowObj.DraftProdOfferingHId, "mode": "edit", "source": "return" });
    }
  }
}
