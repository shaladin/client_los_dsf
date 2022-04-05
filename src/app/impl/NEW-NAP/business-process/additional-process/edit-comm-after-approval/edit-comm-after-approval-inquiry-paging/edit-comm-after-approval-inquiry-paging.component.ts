import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';

@Component({
  selector: 'app-edit-comm-after-approval-inquiry-paging',
  templateUrl: './edit-comm-after-approval-inquiry-paging.component.html',
  styleUrls: ['./edit-comm-after-approval-inquiry-paging.component.css']
})
export class EditCommAfterApprovalInquiryPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj;
  BizTemplateCode: string;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private adInsHelperService: AdInsHelperService
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
    this.inputPagingObj._url = "./assets/impl/ucpaging/searchEditCommAfterApprovalInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/impl/ucpaging/searchEditCommAfterApprovalInquiry.json";

    this.inputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  getEvent(event) {
    console.log(event)
    if(event.Key == "customer"){
      let CustNoObj = { CustNo: event.RowObj.CustNo };
      this.http.post(URLConstant.GetCustByCustNo, CustNoObj).subscribe(
        (response) => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        });
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
