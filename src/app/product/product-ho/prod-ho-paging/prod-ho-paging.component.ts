import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { WhereValueObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-ho-paging',
  templateUrl: './prod-ho-paging.component.html'
})
export class ProdHoPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddLink: string = NavigationConstant.PRODUCT_HO_ADD;
  
  constructor(private router: Router) { }

  ngOnInit() {
    let whereValueObj = new WhereValueObj();
    whereValueObj.property = "ProdStat";
    whereValueObj.value = "RET";
    this.InputPagingObj.whereValue.push(whereValueObj);

    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHO.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHO.json";
    this.InputPagingObj.ddlEnvironments = [
      {
        name: "A.PROD_STAT",
        environment: environment.FoundationR3Url
      }
    ];
  }

  EditButtonClick(e) {
    if (e.RowObj.DraftProdHId == null) {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD], { "ProdHId": e.RowObj.prodHId, "mode": "edit" });
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_ADD], { "ProdHId": e.RowObj.DraftProdHId, "mode": "edit" });
    }
  }
}
