import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsHelperService } from 'app/shared/services/AdInsHelper.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-management-inquiry',
  templateUrl: './management-inquiry.component.html'
})
export class ManagementInquiryComponent implements OnInit {
  InputPagingObj: UcPagingObj = new UcPagingObj();
  CustNoObj: GenericObj = new GenericObj();
  isReady: boolean = false;

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  async ngOnInit() {
    await this.SetUcPaging();
  }

  async SetUcPaging(){
    this.InputPagingObj._url = "./assets/ucpaging/searchManagementInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchManagementInquiry.json";

    this.InputPagingObj.enviromentUrl = environment.losUrl + "/v1";
    this.InputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQLForManagementInquiry;

    let keyLob = new Array<string>();
    await this.http.post(URLConstant.GetManagementInquiryLob, {}).toPromise().then(
      (response) => {
        response["ReturnObject"].forEach(x => {
          keyLob.push(x.Key)
        });
      });

    this.InputPagingObj.addCritInput = new Array();

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionIn;
    critLobObj.propName = 'APP_AGR.LOB_CODE';
    critLobObj.listValue = keyLob;
    this.InputPagingObj.addCritInput.push(critLobObj)
    
    this.isReady = true;
  }

  getEvent(event) {
    if(event.Key == "agreement"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if(event.Key == "application"){
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
    else if(event.Key == "customer"){
      this.CustNoObj.CustNo = event.RowObj.CustNo;      
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
            this.adInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
          }
          if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
            this.adInsHelperService.OpenCustomerCoyViewByCustId(response["CustId"]);
          }
        }
      );
    }
    else if(event.Key == "product"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode,event.RowObj.ProdOfferingVersion); 
    }
  }
}