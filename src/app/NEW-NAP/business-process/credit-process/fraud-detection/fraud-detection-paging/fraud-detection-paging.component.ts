import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fraud-detection-paging',
  templateUrl: './fraud-detection-paging.component.html',
  styleUrls: []
})
export class FraudDetectionPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudDetection.json";
  }

  ClaimTask(event){

    this.router.navigate(["/Nap/CreditProcess/FraudDetection/Detail"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });

    // var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    // var wfClaimObj = new ClaimWorkflowObj();
    // wfClaimObj.pWFTaskListID = event.RowObj.WfTaskListId;
    // wfClaimObj.pUserId = currentUserContext["UserName"];

    // this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
    //   (response) => {
    
  }

}
