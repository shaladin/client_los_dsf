import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-credit-investigation-paging',
  templateUrl: './credit-investigation-paging.component.html'
})
export class CreditInvestigationPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  lobCode: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params["LobCode"] != null) {
        this.lobCode = params["LobCode"];
        localStorage.setItem("LobCode", this.lobCode);
      }
      
    });
  }
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCreditInvestigation.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCreditInvestigation.json";
    this.inputPagingObj.addCritInput = new Array();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'A.APP_CURR_STEP';
    critObj.value = "CINV";
    this.inputPagingObj.addCritInput.push(critObj);

    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'RL.LOB_CODE';
    critLobObj.value = localStorage.getItem("LobCode");
    this.inputPagingObj.addCritInput.push(critLobObj);

  }
}
