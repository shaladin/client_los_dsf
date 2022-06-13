import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';

@Component({
  selector: 'app-nap-from-lead-paging',
  templateUrl: './nap-from-lead-paging.component.html'
})
export class NapFromLeadPagingComponent implements OnInit, OnDestroy {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array();
  userAccess: CurrentUserContext;
  BizTemplateCode: string;
  isReady: boolean = false;
  navigationSubscription;

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
      this.SubscribeParam();
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.RefetchData();
        }
      });
  }

  SubscribeParam(){
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.SetUcPaging();
  }

  RefetchData(){
    this.isReady = false;
    this.SubscribeParam();
    this.SetUcPaging();
    setTimeout (() => {
      this.isReady = true
    }, 10);
  }

  SetUcPaging() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.makeCriteria();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppFromLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromLead.json";
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.LOB_CODE';
    critObj.value = this.BizTemplateCode;
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'LEAD_STAT';
    critObj.value = 'RAPP';
    this.arrCrit.push(critObj);
  }

  AddApp(ev) {
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, { Code: this.userAccess.OfficeCode }).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_SHARING_FROM_LEAD_DETAIL], { "LeadId": ev.RowObj.LeadId });
        } else {
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

}
