import { environment } from "environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { DecimalPipe } from "@angular/common";
import { UcPagingObj } from "app/shared/model/UcPagingObj.Model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "phone-verification-paging",
  templateUrl: "./phone-verification-paging.component.html",
  providers: [DecimalPipe]
})

export class PhoneVerificationPagingComponent implements OnInit {
  inputPagingObj: any;
  arrCrit: any;
  lobCode : string;

  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params['LobCode'] != null) {
        this.lobCode = params['LobCode'];
        localStorage.setItem("LobCode",this.lobCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppPhoneVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppPhoneVerif.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BL_CODE';
    critObj.value = this.lobCode;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;

  }
}
