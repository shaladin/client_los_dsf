import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-ltkm-verify-paging',
    templateUrl: './ltkm-verify-paging.component.html',
    styleUrls: []
})
export class LtkmVerifyPagingComponent implements OnInit {
    BizTemplateCode: string;
    inputPagingObj: UcPagingObj = new UcPagingObj();
    arrCrit: Array<any> = new Array();
    constructor(private route: ActivatedRoute, private cookieService: CookieService) {
        this.route.queryParams.subscribe(params => {
            if (params["BizTemplateCode"] != null) {
                this.BizTemplateCode = params["BizTemplateCode"];
                AdInsHelper.SetCookie(this.cookieService, CommonConstant.BIZ_TEMPLATE_CODE, this.BizTemplateCode);
            }
        });
    }

    ngOnInit() {
        this.inputPagingObj._url = "./assets/ucpaging/searchLtkmVerify.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmVerify.json";

        this.inputPagingObj.enviromentUrl = environment.losUrl;
        this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    }
    getEvent(ev: any) {
        if (ev.Key == "ltkmno") {
            AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
        }
    }

}
