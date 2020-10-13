import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cust-main-data-paging',
  templateUrl: './cust-main-data-paging.component.html',
  styleUrls: []
})
export class CustMainDataPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  bizTemplateCode: string;
  userAccess: any;
  token: string = localStorage.getItem(CommonConstant.TOKEN);
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute) 
  {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) this.bizTemplateCode = params["BizTemplateCode"];
    });
  }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "CUST_MD_" + this.bizTemplateCode;
    this.arrCrit.push(critObj);
  }

  async ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppCustMainData.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  AddApp() {
    if(!this.bizTemplateCode) return;
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, obj).subscribe(
      (response) => {
        if (response["IsAllowAppCreated"] == true) {
          this.router.navigate(["Nap/TestMainData/CustMainData/Add"], { queryParams: { "BizTemplateCode": this.bizTemplateCode } });
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
      this.router.navigate(["Nap/TestMainData/CustMainData/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId": ev.RowObj.WfTaskListId } });
    }
  }
}
