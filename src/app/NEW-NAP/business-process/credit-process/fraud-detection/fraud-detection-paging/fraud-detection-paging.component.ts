import { Component, OnInit } from '@angular/core';
import { UcpagingModule } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fraud-detection-paging',
  templateUrl: './fraud-detection-paging.component.html',
  styleUrls: []
})
export class FraudDetectionPagingComponent implements OnInit {
  inputPagingObj: any;
  BizTemplateCode : string;

  constructor(private router: Router, private http: HttpClient,private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        this.BizTemplateCode = params['BizTemplateCode'];
        localStorage.setItem("BizTemplateCode",this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchFraudDetection.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "FRD_"+this.BizTemplateCode;
    arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = arrCrit;
  }

  ClaimTask(event){

    if (event.RowObj.BizTemplateCode == AdInsConstant.FL4W)
      this.router.navigate(['/Nap/CreditProcess/FraudVerifMultiAsset/Paging'], { queryParams: {"AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId} })
    else
      this.router.navigate(["/Nap/CreditProcess/FraudDetection/Detail"], { queryParams: { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId } });

    // var currentUserContext = JSON.parse(localStorage.getItem("UserAccess"));
    // var wfClaimObj = new ClaimWorkflowObj();
    // wfClaimObj.pWFTaskListID = event.RowObj.WfTaskListId;
    // wfClaimObj.pUserID = currentUserContext["UserName"];

    // this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
    //   (response) => {
    
  }

}
