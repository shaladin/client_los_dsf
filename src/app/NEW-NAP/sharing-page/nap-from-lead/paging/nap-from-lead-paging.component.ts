import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-nap-from-lead-paging',
  templateUrl: './nap-from-lead-paging.component.html'
})
export class NapFromLeadPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<any> = new Array();
  userAccess: any;
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
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppFromLead.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromLead.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "RO.OFFICE_CODE",
        environment: environment.FoundationR3Url
      },
      {
        name: "L.MR_LEAD_SOURCE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
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
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, {Code : this.userAccess.OfficeCode}).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_SHARING_FROM_LEAD_DETAIL], { "LeadId": ev.RowObj.LeadId});
        }else{
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }

}
