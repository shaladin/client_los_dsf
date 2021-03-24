import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';

@Component({
  selector: 'app-requisition-decision-paging',
  templateUrl: './requisition-decision-paging.component.html',
  styleUrls: []
})
export class RequisitionDecisionPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  isReady: boolean = false;
  arrCrit: any;
  token: any = localStorage.getItem(CommonConstant.TOKEN);

  constructor(private router: Router,
    private toastr: NGXToastrService,
    private http: HttpClient) { }

  makeCriteria() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "REQU_DEC_" + CommonConstant.OPL;
    this.arrCrit.push(critObj);
  }

  async ngOnInit() {
    this.arrCrit = new Array();
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/requisition-decision/search-requisition-decision-paging.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/requisition-decision/search-requisition-decision-paging.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "A.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.arrCrit;

    this.isReady = true;
  }

  getCallBack(event: any) {
    if (event.Key === "ProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
    }
    if (event.Key === "Edit") {
      // this.http.post(URLConstant.CheckGoLivePayment, { AgrmntNo: event.RowObj.AgrmntNo }).subscribe(
      //   (response) => {
      //     if(response["IsPaid"]) {
            AdInsHelper.RedirectUrl(this.router,[NavigationConstant.REQUISITION_DECISION_DETAIL], { "AppId": event.RowObj.AppId, "WfTaskListId": event.RowObj.WfTaskListId });
        //   }
        //   else {
        //     this.toastr.errorMessage("Security Deposit has not been paid yet!");
        //   }
        // },
        // (error) => {
        //   this.toastr.warningMessage("Agreement not found!");
        // }
      // );
    }
  }
}