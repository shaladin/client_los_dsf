import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-doc-signer',
  templateUrl: './doc-signer.component.html',
  providers: [DecimalPipe]
})
export class DocSignerComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj>;
  user:any;
  
  constructor(private router: Router,  private http: HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != CommonConstant.HeadOffice) {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchMouCustDocSigner.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustDocSigner.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MOU.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
  
      this.arrCrit = new Array<CriteriaObj>();
      
      const addCritMouStat = new CriteriaObj();
      addCritMouStat.DataType = 'text';
      addCritMouStat.propName = 'MOU.MOU_STAT';
      addCritMouStat.restriction = AdInsConstant.RestrictionEq;
      addCritMouStat.value = CommonConstant.MouDocSigner;
      this.arrCrit.push(addCritMouStat);
  
      const addCritOfficeCode = new CriteriaObj();
      addCritOfficeCode.DataType = 'text';
      addCritOfficeCode.propName = 'WTL.OFFICE_CODE';
      addCritOfficeCode.restriction = AdInsConstant.RestrictionEq;
      addCritOfficeCode.value = CommonConstant.HeadOffice;
      this.arrCrit.push(addCritOfficeCode);
  
      this.inputPagingObj.addCritInput = this.arrCrit;
    }
  }

  getEvent(event){
    if(event.Key == "customer"){
        var link : string;
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            // link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
            // window.open(link, '_blank');
            AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
