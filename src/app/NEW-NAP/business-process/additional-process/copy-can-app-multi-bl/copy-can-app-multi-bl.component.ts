import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-copy-can-app-multi-bl',
  templateUrl: './copy-can-app-multi-bl.component.html',
  styleUrls: ['./copy-can-app-multi-bl.component.css']
})
export class CopyCanAppMultiBlComponent implements OnInit {
  @ViewChild(UcpagingComponent) paging: UcpagingComponent;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  IsNapVersionMainData: boolean = false;
  userAccess: CurrentUserContext;

  constructor(private http: HttpClient, private toastr: NGXToastrService, private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
      if (params["IsNapVersionMainData"] != null) {
        this.IsNapVersionMainData = params["IsNapVersionMainData"];
      }
    });
  }

  ngOnInit() {
    this.userAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, { Code: this.userAccess.OfficeCode }).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
        } else {
          AdInsHelper.RedirectUnauthorized(this.router);
        }
      });


    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
    
    this.inputPagingObj._url = "./assets/ucpaging/searchCancelledAppCrossBl.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCancelledAppCrossBl.json";

  }

  getEvent(ev) {
    if (ev.Key == "prodOff") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }
    // }else if(ev.Key == "copy"){
    //   if (confirm("Are you sure to copy this application?")) {
    //     var url = this.IsNapVersionMainData ? URLConstant.CopyCancelledAppForMainDataMultiBL : URLConstant.CopyCancelledApp;
    //     this.http.post(url, { AppId: ev.RowObj.AppId }).subscribe(
    //       response => {
    //         this.toastr.successMessage(response["message"]);
    //         this.paging.searchPagination(1);
    //       });
    //   }
    // }
  }

}
