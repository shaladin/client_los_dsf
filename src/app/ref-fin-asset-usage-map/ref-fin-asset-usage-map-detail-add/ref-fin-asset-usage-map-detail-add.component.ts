import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { IntegrationObj } from 'app/shared/model/library/integration-obj.model';
import { RefFinAssetUsageMapObj } from 'app/shared/model/ref-fin-asset-usage-map-obj.model';
import { UcTempPagingObj } from 'app/shared/model/temp-paging/uc-temp-paging-obj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ref-fin-asset-usage-map-detail-add',
  templateUrl: './ref-fin-asset-usage-map-detail-add.component.html',
  styleUrls: ['./ref-fin-asset-usage-map-detail-add.component.css']
})
export class RefFinAssetUsageMapDetailAddComponent implements OnInit {

  MrAssetUsageCode: string;
  PurposeOfFinCode: string;
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();
  IntegrationObj: IntegrationObj = new IntegrationObj();
  listSelectedCode: Array<string> = new Array<string>();
  listAssetCategory: Array<string> = new Array<string>();
  RefFinAssetUsageMapObj: RefFinAssetUsageMapObj = new RefFinAssetUsageMapObj();
  tempDataExists = false;

  readonly CancelLink: string = NavigationConstant.REF_FIN_ASSET_USAGE_MAP_DETAIL;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
              private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params["MrAssetUsageCode"] != null) {
        this.MrAssetUsageCode = params["MrAssetUsageCode"];
      }

      if (params["PurposeOfFinCode"] != null) {
        this.PurposeOfFinCode = params["PurposeOfFinCode"];
      }
    });
  }

  async ngOnInit() {
    this.RefFinAssetUsageMapObj.PurposeOfFinCode = this.PurposeOfFinCode;
    this.RefFinAssetUsageMapObj.MrAssetUsageCode = this.MrAssetUsageCode;
    await this.http.post(URLConstant.GetRefFinAssetUsageMapDByPurposeOfFinCodeAndMrAssetUsageCode, this.RefFinAssetUsageMapObj).toPromise().then(
      (response) => {
        if (response['ReturnObject'] != null)
        {
          for(let i = 0; i < response['ReturnObject'].length; i++)
          {
            this.listAssetCategory.push(response['ReturnObject'][i]['AssetCategoryCode']);
          }
        }
      });

    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/assetCategoryForAssetUsageMapTempPaging.json";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/assetCategoryForAssetUsageMapTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url + "/v2"

    this.tempPagingObj.isReady = true;

    if (this.listAssetCategory.length > 0)
    {
      this.tempPagingObj.addCritInput = new Array();
      var critObj = new CriteriaObj();
      critObj.propName = "AC.ASSET_CATEGORY_CODE";
      critObj.restriction = AdInsConstant.RestrictionNotIn;
      critObj.listValue = this.listAssetCategory;
      this.tempPagingObj.addCritInput.push(critObj);
    }
  }

  getListTemp(ev) {
    this.listSelectedCode = ev.TempListId;
    this.tempDataExists = this.listSelectedCode && this.listSelectedCode.length > 0
  }

  Save()
  {
    if (this.listSelectedCode.length == 0) {
      this.toastr.errorMessage(ExceptionConstant.ADD_MIN_1_DATA);
      return;
    }

    var obj = {
      PurposeOfFinCode: this.PurposeOfFinCode,
      MrAssetUsageCode: this.MrAssetUsageCode,
      AssetCategoryCode: this.listSelectedCode
    }

    this.http.post(URLConstant.AddListRefFinAssetUsageMapD, obj).subscribe(
      (response) => {
        this.toastr.successMessage(response['message']);
        AdInsHelper.RedirectUrl(this.router,[NavigationConstant.REF_FIN_ASSET_USAGE_MAP_DETAIL],{ "PurposeOfFinCode": this.PurposeOfFinCode, "MrAssetUsageCode": this.MrAssetUsageCode });
      });
  }
}
