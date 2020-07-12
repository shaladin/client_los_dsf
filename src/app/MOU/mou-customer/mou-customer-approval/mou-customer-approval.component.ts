import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-customer-approval',
  templateUrl: './mou-customer-approval.component.html',
})
export class MouCustomerApprovalComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  user: any;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url="./assets/ucpaging/mou/searchMouCustomerApproval.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/mou/searchMouCustomerApproval.json";
  
      this.arrCrit = new Array<CriteriaObj>();
      var critObj = new CriteriaObj();
      critObj.DataType = 'text';
      critObj.restriction = AdInsConstant.RestrictionEq;
      critObj.propName = 'A.MOU_STAT';
      critObj.value = 'MAP';
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
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
