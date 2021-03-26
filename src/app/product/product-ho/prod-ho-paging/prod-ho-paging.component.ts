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

  inputPagingObj: any;

  readonly AddLink: string = NavigationConstant.PRODUCT_HO_ADD;
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductHO.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL; 
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHO.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.Prod_Stat",
        environment: environment.FoundationR3Url
      }
    ];

    var WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.inputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    var WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdStat";
    WVProdStatObj.value = "RET";
    this.inputPagingObj.whereValue.push(WVProdStatObj); 

    var WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "searchProductHO";
    WVProdStatObj.value = null;
    this.inputPagingObj.whereValue.push(WVProdStatObj);
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
