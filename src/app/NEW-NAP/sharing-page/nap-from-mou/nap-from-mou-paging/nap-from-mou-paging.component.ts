import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-nap-from-mou-paging',
  templateUrl: './nap-from-mou-paging.component.html',
  styleUrls: ['./nap-from-mou-paging.component.scss']
})
export class NapFromMouPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array();
  userAccess: CurrentUserContext;
  BizTemplateCode: string;

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppFromMou.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromMou.json";
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.FCTR;
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MOU_STAT';
    critObj.value = 'ACT';
    this.arrCrit.push(critObj);
  }

  AddApp(ev) {
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, { Code: this.userAccess.OfficeCode }).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_SHARING_FROM_MOU_DETAIL], { "MouCustId": ev.RowObj.MouCustId });
        } else {
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }
}
