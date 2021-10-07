import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';
import { IntegrationObj } from 'app/shared/model/library/IntegrationObj.model';
import { RequestTaskModelObj } from 'app/shared/model/Workflow/V2/RequestTaskModelObj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-ltkm-verify-paging',
    templateUrl: './ltkm-verify-paging.component.html',
    styleUrls: []
})
export class LtkmVerifyPagingComponent implements OnInit {
    BizTemplateCode: string;
    inputPagingObj: UcPagingObj = new UcPagingObj();
    IntegrationObj: IntegrationObj = new IntegrationObj();
    RequestTaskModel: RequestTaskModelObj = new RequestTaskModelObj();
    CustNoObj: GenericObj = new GenericObj();
    
    constructor(private route: ActivatedRoute, private cookieService: CookieService, private http: HttpClient) {
        this.route.queryParams.subscribe(params => {
            if (params["BizTemplateCode"] != null) {
                this.BizTemplateCode = params["BizTemplateCode"];
                AdInsHelper.SetCookie(this.cookieService, CommonConstant.BIZ_TEMPLATE_CODE, this.BizTemplateCode);
            }
        });
    }

    ngOnInit() {
        let UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        
        this.inputPagingObj._url = "./assets/ucpaging/searchLtkmVerify.json";
        this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLtkmVerify.json";

        if(environment.isCore){
            this.inputPagingObj._url = "./assets/ucpaging/V2/searchLtkmVerifyV2.json";
            this.inputPagingObj.pagingJson = "./assets/ucpaging/V2/searchLtkmVerifyV2.json";
            this.inputPagingObj.isJoinExAPI = true
      
            this.RequestTaskModel.ProcessKeys = [CommonConstant.WF_LTKM_REQ_MANUAL, CommonConstant.WF_LTKM_REQ_AUTO];
            this.RequestTaskModel.TaskDefinitionKey = CommonConstant.LTKM_VERIFY;
            this.RequestTaskModel.OfficeRoleCodes = [UserAccess[CommonConstant.OFFICE_CODE],
                                                     UserAccess[CommonConstant.ROLE_CODE],
                                                     UserAccess[CommonConstant.ROLE_CODE] + "-" + UserAccess[CommonConstant.OFFICE_CODE]];
            
            this.IntegrationObj.baseUrl = URLConstant.GetAllTaskWorkflow;
            this.IntegrationObj.requestObj = this.RequestTaskModel;
            this.IntegrationObj.leftColumnToJoin = "LtkmNo";
            this.IntegrationObj.rightColumnToJoin = "ProcessInstanceBusinessKey";
            this.inputPagingObj.integrationObj = this.IntegrationObj;
        }
    }

    getEvent(ev: any) {
        if(ev.Key == "customer"){
        this.CustNoObj.CustNo = ev.RowObj.CustNo;      
        this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            response => {
            if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
                AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
            }
            if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
                AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
            }
            }
        );
        }
        else if (ev.Key == "ltkmno") {
            AdInsHelper.OpenLtkmViewByLtkmCustId(ev.RowObj.LtkmCustId);
        }
    }

}
