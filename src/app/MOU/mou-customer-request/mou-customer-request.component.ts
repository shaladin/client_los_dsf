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

@Component({
  selector: 'app-mou-customer-request',
  templateUrl: './mou-customer-request.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class MouCustomerRequestComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: UcPagingObj;
  user: any;
  
  constructor(private http: HttpClient, private toastr: NGXToastrService, private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchMouCustomerRequest.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
      this.inputPagingObj.deleteUrl = "";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustomerRequest.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }

  customerView(ev){
    var custNo = ev.RowObj.CustNo;
    var custObj = {CustNo : custNo};
    var custId : number
    this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
      (response) => { 
        custId = response['CustId'];
        // window.open( environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + custId, "_blank");
        AdInsHelper.OpenCustomerViewByCustId(custId);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
