import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-legal-review-paging',
  templateUrl: './legal-review-paging.component.html',
})
export class LegalReviewPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  arrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  user: any;

  constructor(private router: Router, private http : HttpClient) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchLegalReview.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchLegalReview.json";
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.losUrl
        }
      ];
  
      const addCritMouStat = new CriteriaObj();
      addCritMouStat.DataType = 'text';
      addCritMouStat.propName = 'MOU.MOU_STAT';
      addCritMouStat.restriction = AdInsConstant.RestrictionNotIn;
      addCritMouStat.value = 'LRV';
      this.arrCrit.push(addCritMouStat);
  
      const addCritOfficeCode = new CriteriaObj();
      addCritOfficeCode.DataType = 'text';
      addCritOfficeCode.propName = 'WTL.OFFICE_CODE';
      addCritOfficeCode.restriction = AdInsConstant.RestrictionNotIn;
      addCritOfficeCode.value = 'HO';
      this.arrCrit.push(addCritOfficeCode);
    }
  }
  getEvent(event){
    if(event.Key == "customer"){
        var link : string;
        var custObj = { CustNo: event.RowObj.CustNo };
        this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
          response => {
            link = environment.FoundationR3Web + "/Customer/CustomerView/Page?CustId=" + response["CustId"];
            window.open(link, '_blank');
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
