import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WhereValueObj, UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-ho-paging',
  templateUrl: './prod-ho-paging.component.html'
})
export class ProdHoPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  readonly AddLink: string = NavigationConstant.PRODUCT_HO_ADD;
  constructor(private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    
    var whereValueObj = new WhereValueObj();
    whereValueObj.property = "ProdStat";
    whereValueObj.value = "RET";
    this.inputPagingObj.whereValue.push(whereValueObj);

    this.inputPagingObj._url= "./assets/ucpaging/product/searchProductHO.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHO.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.Prod_Stat",
        environment: environment.FoundationR3Url
      }
    ];
  }

  EditButtonClick(e) {
    if (e.RowObj.DraftProdHId == null) {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD],{ "ProdHId": e.RowObj.prodHId, "mode": "edit" });
    }
    else {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD],{ "ProdHId": e.RowObj.DraftProdHId, "mode": "edit" });
    }
  }
}
