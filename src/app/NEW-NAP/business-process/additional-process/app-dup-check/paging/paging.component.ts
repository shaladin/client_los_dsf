import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { Router } from '@angular/router';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { HttpClient } from '@angular/common/http';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';


@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: []
})
export class PagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit: any;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchAppDupCheck.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppDupCheck.json";

    // var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    // var addCrit = new CriteriaObj();
    // addCrit.DataType = 'text';
    // addCrit.propName = 'WTL.USERNAME';
    // addCrit.restriction = AdInsConstant.RestrictionIn;
    // var arrayString = new Array<string>();
    // arrayString.push(currentUserContext["UserName"]);
    // arrayString.push("");
    // addCrit.listValue = arrayString;

    // this.inputPagingObj.addCritInput.push(addCrit);
  }

  NextScreen(event){
    // var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    // var wfClaimObj = new ClaimWorkflowObj();
    // wfClaimObj.pWFTaskListID = event.RowObj.WfTaskListId;
    // wfClaimObj.pUserId = currentUserContext["UserName"];

    // this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
    //   (response) => {
    
    //   });
    
    if(event.RowObj.CustTypeCode == AdInsConstant.CustTypePersonal && event.RowObj.IsExistingCust == false){
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if(event.RowObj.CustTypeCode == AdInsConstant.CustTypePersonal && event.RowObj.IsExistingCust == true){
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Personal"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if(event.RowObj.CustTypeCode == AdInsConstant.CustTypeCompany && event.RowObj.IsExistingCust == false){
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
    if(event.RowObj.CustTypeCode == AdInsConstant.CustTypeCompany && event.RowObj.IsExistingCust == true){
      this.router.navigate(["/Nap/AdditionalProcess/AppDupCheck/ApplicantExistingData/Company"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });
    }
  }

}
