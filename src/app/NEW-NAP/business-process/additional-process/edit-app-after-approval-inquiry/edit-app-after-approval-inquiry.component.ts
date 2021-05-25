import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-edit-app-after-approval-inquiry',
  templateUrl: './edit-app-after-approval-inquiry.component.html',
  styleUrls: ['./edit-app-after-approval-inquiry.component.css']
})
export class EditAppAfterApprovalInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  BizTemplateCode: any;

  constructor(    private http: HttpClient, 
    private route: ActivatedRoute,
    ) {
      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      });
     }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchEditAppAfterApprovalInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditAppAfterApprovalInquiry.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "EAAATH.EDIT_APP_AFT_APV_TRX_NO",
        environment: environment.FoundationR3Url
      },
      {
        name: "EAAATH.EDIT_APP_AFT_APV_TRX_STAT",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  getEvent(event) {
    if(event.Key == "customer"){
        let reqGetCustNo : GenericObj = new GenericObj();
        reqGetCustNo.CustNo = event.RowObj.custNo;
        this.http.post(URLConstant.GetCustByCustNo, reqGetCustNo).subscribe(
          response => {
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
        );
    }
    else if(event.Key == "editAppAftApvTrx"){
      AdInsHelper.OpenEditAppAfterApv(event.RowObj.EditAppAftApvTrxHId, event.RowObj.AgrmntId); 
    }
    else if(event.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
  }
}
