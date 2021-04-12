import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UcPagingObj, WhereValueObj } from '../../../shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
  selector: 'app-prod-ho-return-paging',
  templateUrl: './prod-ho-return-paging.component.html'
})
export class ProdHoReturnPagingComponent implements OnInit {

  inputPagingObj : UcPagingObj = new UcPagingObj();
  constructor(private router: Router) { }

  ngOnInit() {
    this.inputPagingObj._url="./assets/ucpaging/product/searchProductHOReturn.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReturn.json";

    var WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdStat";
    WVProdStatObj.value = "RET";
    this.inputPagingObj.whereValue.push(WVProdStatObj);
  }

  EditButtonClick(e){
    if(e.RowObj.DraftProdHId == null)
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD],{ "ProdHId": e.RowObj.CurrentProdHId, "mode" : "edit", "source" : "return" });
    }
    else
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PRODUCT_HO_ADD],{ "ProdHId": e.RowObj.DraftProdHId, "mode" : "edit", "source" : "return" });
    }
  }
}
