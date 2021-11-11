import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-nap-from-simple-lead',
  templateUrl: './nap-from-simple-lead.component.html',
  styles: []
})
export class NapFromSimpleLeadComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<CriteriaObj> = new Array();
  userAccess: CurrentUserContext;
  BizTemplateCode: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { 
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchAppFromSimpleLead.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromSimpleLead.json";

    if(environment.isCore){
      this.inputPagingObj._url="./assets/ucpaging/V2/searchAppFromSimpleLeadV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchAppFromSimpleLeadV2.json";
    }

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "RO.OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.losUrl + "/v1"
      }
    ];
  }

  AddApp(ev){
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code: this.userAccess.OfficeCode}).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_SHARING_FROM_SIMPLE_LEAD_DETAIL], { "LeadId": ev.RowObj.LeadId});
        }else{
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

}
