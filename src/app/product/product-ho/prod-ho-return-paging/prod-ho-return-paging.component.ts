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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  inputPagingObj;
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/product/searchProductHOReturn.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHOReturn.json";

    
    var WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.inputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    var WVProdStatObj = new WhereValueObj();
    WVProdStatObj.property = "ProdStat";
    WVProdStatObj.value = "RET";
    this.inputPagingObj.whereValue.push(WVProdStatObj);
  }

  EditButtonClick(e)
  {
    
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
