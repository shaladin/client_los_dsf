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
  constructor(private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params['LobCode'] != null) {
        var lobCode = params['LobCode'];
        localStorage.setItem("LobCode",lobCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchAppPhoneVerif.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppPhoneVerif.json";

    
  }
}
