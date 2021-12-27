import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { WhereValueObj, UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-prod-ho-paging',
  templateUrl: './prod-ho-paging.component.html'
})
export class ProdHoPagingComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  readonly AddLink: string = NavigationConstant.PRODUCT_HO_ADD;
  
  constructor(private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    let context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context[CommonConstant.MR_OFFICE_TYPE_CODE] != CommonConstant.HeadOffice) {
      this.router.navigate([NavigationConstant.PROD_HO_UNAUTHORIZED], { queryParams: {}, skipLocationChange: false });
    }
    
    let whereValueObj = new WhereValueObj();
    whereValueObj.property = "ProdStat";
    whereValueObj.value = "RET";
    this.InputPagingObj.whereValue.push(whereValueObj);

    this.InputPagingObj._url = "./assets/ucpaging/product/searchProductHO.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/product/searchProductHO.json";
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
