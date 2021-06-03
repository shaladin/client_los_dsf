import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: []
})
export class NapPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array();
  userAccess: CurrentUserContext;
  Token: string = AdInsHelper.GetCookie(this.cookieService, CommonConstant.TOKEN);
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router, private cookieService: CookieService) {
  }

  makeCriteria() {
    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "NAP_" + CommonConstant.CF4W;
    this.arrCrit.push(critObj);
  }

  async ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.makeCriteria();
    this.inputPagingObj._url = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  AddApp() {
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code : this.userAccess.OfficeCode}).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CF4W_ADD], {});
        } else {
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.prodOfferingCode, ev.RowObj.prodOfferingVersion);
    }
    if (ev.Key == "Edit") {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_CF4W_ADD_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
    }
  }
}
