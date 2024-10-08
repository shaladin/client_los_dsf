import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-unfreeze-inquiry',
  templateUrl: './mou-unfreeze-inquiry.component.html'
})
export class MouUnfreezeInquiryComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  userContext: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

  constructor(
    private toastr: NGXToastrService, 
    private httpClient: HttpClient, 
    private router: Router,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchMouFeezeUnfreezeInqry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouFeezeUnfreezeInqry.json";
  }

  CallBackHandler(ev) {
    if (ev.Key == "View") {
        this.router.navigate([NavigationConstant.MOU_FREEZE_VIEW], { queryParams: {"MouCustId":ev.RowObj.MouCustId,"TrxId": ev.RowObj.TrxId, "TrxNo": ev.RowObj.TrxNo } });
    }
  }

}
