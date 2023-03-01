import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';

@Component({
  selector: 'app-ref-fin-asset-usage-map-detail',
  templateUrl: './ref-fin-asset-usage-map-detail.component.html',
  styleUrls: ['./ref-fin-asset-usage-map-detail.component.css']
})
export class RefFinAssetUsageMapDetailComponent implements OnInit {
  
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  inputPagingObj: UcPagingObj = new UcPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  MrAssetUsageCode: string;
  PurposeOfFinCode: string;

  readonly CancelLink: string = NavigationConstant.REF_FIN_ASSET_USAGE_MAP_PAGING;
  readonly AddLink: string = NavigationConstant.REF_FIN_ASSET_USAGE_MAP_DETAIL_ADD;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params["MrAssetUsageCode"] != null) {
        this.MrAssetUsageCode = params["MrAssetUsageCode"];
      }
      if (params["PurposeOfFinCode"] != null) {
        this.PurposeOfFinCode = params["PurposeOfFinCode"];
      }
    });
  }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewRefFinAssetUsageMapDetail.json";

    this.inputPagingObj._url = "./assets/ucpaging/searchRefFinAssetUsageMapDetail.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRefFinAssetUsageMapDetail.json";
    this.inputPagingObj.deleteUrl = URLConstant.DeleteRefFinAssetUsageMapD;

    this.inputPagingObj.isJoinExAPI = true
    
    this.IntegrationObj.baseUrl = URLConstant.GetListAssetCategoryAndAssetTypeForAssetUsageMap;
    this.IntegrationObj.leftColumnToJoin = "AssetCategoryCode";
    this.IntegrationObj.rightColumnToJoin = "AssetCategoryCode";
    this.inputPagingObj.integrationObj = this.IntegrationObj;

    this.inputPagingObj.addCritInput = new Array();
    var purposeOfFinCritObj = new CriteriaObj();
    purposeOfFinCritObj.propName = "P.PURPOSE_OF_FIN_CODE";
    purposeOfFinCritObj.restriction = AdInsConstant.RestrictionEq;
    purposeOfFinCritObj.value = this.PurposeOfFinCode;
    this.inputPagingObj.addCritInput.push(purposeOfFinCritObj);

    var mrAssetUsageCritObj = new CriteriaObj();
    mrAssetUsageCritObj.propName = "A.MR_ASSET_USAGE_CODE";
    mrAssetUsageCritObj.restriction = AdInsConstant.RestrictionEq;
    mrAssetUsageCritObj.value = this.MrAssetUsageCode;
    this.inputPagingObj.addCritInput.push(mrAssetUsageCritObj);
  }

}
