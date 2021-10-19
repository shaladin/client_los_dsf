import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { environment } from 'environments/environment';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-doc-signer',
  templateUrl: './doc-signer.component.html',
  providers: [DecimalPipe]
})
export class DocSignerComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  arrCrit: Array<CriteriaObj>;
  requestTaskModel : RequestTaskModelObj = new RequestTaskModelObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  user: CurrentUserContext;

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService, private AdInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustDocSigner.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustDocSigner.json";
    this.arrCrit = new Array<CriteriaObj>();

    const addCritMouStat = new CriteriaObj();
    addCritMouStat.DataType = 'text';
    addCritMouStat.propName = 'MOU.MOU_STAT';
    addCritMouStat.restriction = AdInsConstant.RestrictionEq;
    addCritMouStat.value = CommonConstant.MouDocSigner;
    this.arrCrit.push(addCritMouStat);

    if(environment.isCore){
      this.inputPagingObj._url = "./assets/ucpaging/V2/searchMouCustDocSignerV2.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchMouCustDocSignerV2.json";

      this.inputPagingObj.isJoinExAPI = true;

      this.requestTaskModel.ProcessKeys = [CommonConstant.WF_MOU_GENERAL, CommonConstant.WF_MOU_FACTORING, CommonConstant.WF_MOU_DLFN];
      this.requestTaskModel.TaskDefinitionKeys = [CommonConstant.MOU_DOC_SIGNER + CommonConstant.MOU_TYPE_GENERAL, CommonConstant.MOU_DOC_SIGNER + CommonConstant.MOU_TYPE_FACTORING, CommonConstant.MOU_DOC_SIGNER + CommonConstant.MOU_TYPE_DLFN];
      this.requestTaskModel.OfficeRoleCodes = [this.user[CommonConstant.ROLE_CODE],
                                               this.user[CommonConstant.OFFICE_CODE], 
                                               this.user[CommonConstant.ROLE_CODE] + "-" + this.user[CommonConstant.OFFICE_CODE]];
      
      this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
      this.IntegrationObj.requestObj = this.requestTaskModel;
      this.IntegrationObj.leftColumnToJoin = "MouCustNo";
      this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
      this.IntegrationObj.joinType = CommonConstant.JOIN_TYPE_INNER;
      this.inputPagingObj.integrationObj = this.IntegrationObj;
    }

    this.inputPagingObj.addCritInput = this.arrCrit;

  }

  getEvent(event) {
    if (event.Key == "customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.AdInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
    }
  }
}
