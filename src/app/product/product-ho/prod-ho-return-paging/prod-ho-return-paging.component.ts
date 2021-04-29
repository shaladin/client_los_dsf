import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UcPagingObj, WhereValueObj } from '../../../shared/model/UcPagingObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-ho-return-paging',
  templateUrl: './prod-ho-return-paging.component.html'
})
export class ProdHoReturnPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();

  constructor(private router: Router) { }

  ngOnInit() {
    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHOReturn.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReturn.json";

    let WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdStat";
    WVProdStatObj.value = "RET";
    this.InputPagingObj.whereValue.push(WVProdStatObj);
  }

  EditButtonClick(e) {
    if (e.RowObj.DraftProdHId == null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD], { "ProdHId": e.RowObj.CurrentProdHId, "mode": "edit", "source": "return" });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD], { "ProdHId": e.RowObj.DraftProdHId, "mode": "edit", "source": "return" });
    }
  }
}
