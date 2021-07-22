import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from "environments/environment";

@Component({
  selector: 'app-additional-tc-paging',
  templateUrl: './additional-tc-paging.component.html',
  styleUrls: []
})
export class AdditionalTcPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  isReady: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.inputPagingObj._url = "./assets/ucpaging/new-nap/business-process/additional-process/search-additional-tc-opl-paging.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/new-nap/business-process/additional-process/search-additional-tc-opl-paging.json";
    }
    else
    {
      this.inputPagingObj._url = "./assets/ucpaging/new-nap/business-process/additional-process/search-additional-tc-paging.json";
      this.inputPagingObj.pagingJson = "./assets/ucpaging/new-nap/business-process/additional-process/search-additional-tc-paging.json";
    }
    this.inputPagingObj.addCritInput = new Array();
    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      },
    ];
    this.isReady = true;
  }

  getEvent(event) {
    if (event.Key === "Application") {
      AdInsHelper.OpenAppViewByAppId(event.RowObj.AppId);
    }
    else if (event.Key === "Agreement") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(event.RowObj.AgrmntId);
    }
    else if (event.Key === "Product") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(event.RowObj.ProdOfferingCode, event.RowObj.ProdOfferingVersion);
    }
  }
}