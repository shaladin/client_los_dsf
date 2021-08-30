import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
    selector: 'cessie-cancel-paging',
    templateUrl: './cessie-cancel-paging.component.html',
    styleUrls: []
})
export class CessieCancellationPagingComponent implements OnInit {
    inputPagingObj: UcPagingObj = new UcPagingObj();
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.inputPagingObj._url = "./assets/ucpaging/searchCessieCancelPaging.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCessieCancelPaging.json";

        this.inputPagingObj.enviromentUrl = environment.losUrl + '/v1',
        this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    }
    GetCallBack(ev) {
        if (ev.Key == "ViewProdOffering") {
          AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
        }
        if (ev.Key == "edit") {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.CESSIE_CANCEL_DETAIL], { "CessieHXId": ev.RowObj.CessieHXId});
        }
      }
}
