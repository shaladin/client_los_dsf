import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';


@Component({
  selector: 'app-prod-offering-return-paging',
  templateUrl: './prod-offering-return-paging.component.html'
})
export class ProdOfferingReturnPagingComponent implements OnInit {

  inputPagingObj: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/product/searchProductOfferingReturn.json";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductOfferingReturn.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.Prod_Offering_Stat",
        environment: environment.FoundationR3Url
      }
    ];

    var WVTrxTypeCodeObj = new WhereValueObj();
    WVTrxTypeCodeObj.property = "TrxTypeCode";
    WVTrxTypeCodeObj.value = "PROD";
    this.inputPagingObj.whereValue.push(WVTrxTypeCodeObj);

    var WVProdOfferingStatObj = new WhereValueObj();
    WVProdOfferingStatObj.property = "ProdOfferingStat";
    WVProdOfferingStatObj.value = "RET";
    this.inputPagingObj.whereValue.push(WVProdOfferingStatObj);
  }

  EditProdOfr(e)
  {
    if(e.RowObj.DraftProdOfferingHId == null)
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD],{ "ProdOfferingHId": e.RowObj.CurrentProdOfferingHId, "mode" : "edit", "source" : "return" });
    }
    else
    {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.PROD_OFFERING_ADD],{ "ProdOfferingHId": e.RowObj.DraftProdOfferingHId, "mode" : "edit", "source" : "return" });
    }
  }
}
