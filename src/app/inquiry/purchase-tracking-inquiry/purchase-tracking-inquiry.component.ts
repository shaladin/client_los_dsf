import { environment } from "environments/environment";
import { Component, OnInit } from "@angular/core";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcPagingObj } from "app/shared/model/uc-paging-obj.model";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { URLConstant } from "app/shared/constant/URLConstant";
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from "app/shared/model/generic/generic-obj.model";
import { AdInsHelperService } from "app/shared/services/AdInsHelper.service";

@Component({
  selector: 'app-purchase-tracking-inquiry',
  templateUrl: './purchase-tracking-inquiry.component.html',
  styleUrls: []
})
export class PurchaseTrackingInquiryComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  CustNoObj: GenericObj = new GenericObj();
  isReady: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private AdInsHelperService: AdInsHelperService) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchPurchaseTrackingInquiry.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchPurchaseTrackingInquiry.json";

    this.inputPagingObj.addCritInput = new Array();
    let critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);

    this.isReady = true;
  }

  getEvent(event) {
    if (event.Key == "Application") {
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
    else if (event.Key == "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if (event.Key == "Customer") {
      this.CustNoObj.CustNo = event.RowObj.CustNo;
      this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
        response => {
          this.AdInsHelperService.OpenCustomerViewByCustId(response["CustId"]);
        }
      );
    }
    else if (event.Key == "AppAsset") {
      window.open(environment.losR3Web + "/View/AppAsset?AppId=" + event.RowObj.AppId + "&AppAssetId=" + event.RowObj.AppAssetId, "_blank");
    }
    else if (event.Key == "View") {
      window.open(environment.losR3Web + "/View/PurchaseTracking?AppId=" + event.RowObj.AppId + "&AppAssetId=" + event.RowObj.AppAssetId, "_blank");
    }
  }
}