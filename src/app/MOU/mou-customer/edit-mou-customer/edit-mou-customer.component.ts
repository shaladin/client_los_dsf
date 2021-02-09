import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-edit-mou-customer',
  templateUrl: './edit-mou-customer.component.html',
  providers: [NGXToastrService]
})
export class EditMouCustomerComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  user:any;
  
  constructor(private http: HttpClient, private toastr: NGXToastrService,private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    if (this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      AdInsHelper.RedirectUrl(this.router,[NavigationConstant.MOU_UNAUTHORIZED_PAGE],{});
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchEditMouCustomer.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchEditMouCustomer.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MOU.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
      this.arrCrit = new Array<CriteriaObj>();
      var critObj = new CriteriaObj();
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'MOU.MOU_STAT';
      critObj.value = 'RTN';
      this.arrCrit.push(critObj);
      this.inputPagingObj.addCritInput = this.arrCrit;
    }
  }

  getEvent(event){
    if(event.Key == "customer"){
        var link : string;
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(URLConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          }
        );
    }
  }
}