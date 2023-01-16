import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
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

  constructor(private http: HttpClient, private adInsHelperService: AdInsHelperService) { }

  ngOnInit() {
    this.SetUcPaging();
  }

  SetUcPaging(){
    this.InputPagingObj._url = "./assets/ucpaging/searchManagementInquiry.json";
    this.InputPagingObj.pagingJson = "./assets/ucpaging/searchManagementInquiry.json";

    this.InputPagingObj.enviromentUrl = environment.losUrl + "/v1";
    this.InputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQLForManagementInquiry;
    
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