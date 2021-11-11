import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/ref-office/center-grp-office-mbr-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html'
})
export class NapPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj>;
  userAccess: CurrentUserContext;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        localStorage.setItem("BizTemplateCode", params['BizTemplateCode']);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.makeCriteria();

    this.inputPagingObj._url = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria() {
    let critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "NAP_" + CommonConstant.FCTR;
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    if (this.userAccess.MrOfficeTypeCode != CommonConstant.CENTER_GROUP_CODE) {
      critObj.propName = 'a.ORI_OFFICE_CODE';
      critObj.listValue = [this.userAccess.OfficeCode];
    } else {
      critObj.propName = 'a.ORI_OFFICE_CODE';
      this.http.post(URLConstant.GetListCenterGrpMemberByCenterGrpCode, { Code: CommonConstant.CENTER_GROUP_CODE }).subscribe(
        (response) => {
          let CenterGrpOfficeMbrObjs: Array<CenterGrpOfficeMbrObj> = response["ListCenterGrpOfficeMbr"];

          let listDataTemp = new Array();
          for (let i = 0; i < CenterGrpOfficeMbrObjs.length; i++) {
            listDataTemp.push(CenterGrpOfficeMbrObjs[i].RefOfficeCode);
          }
          critObj.listValue = listDataTemp;
        })
    }
    this.arrCrit.push(critObj);
  }

  AddApp() {
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, { Code: this.userAccess.OfficeCode }).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_ADD], {});
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
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_FCTR_ADD_DETAIL], { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId });
    }
  }
}
