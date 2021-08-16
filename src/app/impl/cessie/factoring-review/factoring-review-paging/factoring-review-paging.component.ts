import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute, Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CookieService } from 'ngx-cookie';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';

@Component({
    selector: 'app-factoring-review-paging',
    templateUrl: './factoring-review-paging.component.html',
    styleUrls: []
})
export class FactoringReviewPagingComponent implements OnInit {
    BizTemplateCode: string;
    inputPagingObj: UcPagingObj = new UcPagingObj();
    constructor(private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {

    }

    ngOnInit() {
        this.inputPagingObj._url = "./assets/ucpaging/searchCessieFactoringReviewPaging.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessieFactoringReviewPaging.json";

        this.inputPagingObj.enviromentUrl = environment.losUrl + '/v1';
        this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    }
    GetCallBack(ev) {
        if (ev.Key == "ViewProdOffering") {
          AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
        }
        if (ev.Key == "edit") {
          if(ev.RowObj.ProdOfferingCode != CommonConstantX.INIT_CRT_CESSIE_PROCESS_DEFAULT_STAT_NOT_YET_SET){
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_FACTORING_REVIEW_DETAIL], { "CessieHXId": ev.RowObj.CessieHXId, "WfTaskListId": ev.RowObj.WfTaskListId, "CessieNo": ev.RowObj.CessieNo, "OfficeCode": ev.RowObj.OfficeCode, "OfficeName": ev.RowObj.OfficeName, "CustNo": ev.RowObj.CustNo, "CustId": ev.RowObj.CustId});
          }else{
            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_FACTORING_REVIEW_ASSIGN_PROD], { "CessieHXId": ev.RowObj.CessieHXId, "WfTaskListId": ev.RowObj.WfTaskListId, "CessieNo": ev.RowObj.CessieNo, "OfficeCode": ev.RowObj.OfficeCode, "OfficeName": ev.RowObj.OfficeName ,"CustNo": ev.RowObj.CustNo, "CustId": ev.RowObj.CustId});
          }
        }
      }
}
