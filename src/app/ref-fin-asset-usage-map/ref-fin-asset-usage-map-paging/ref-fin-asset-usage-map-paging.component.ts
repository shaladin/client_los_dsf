import { Component, OnInit } from '@angular/core';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';

@Component({
  selector: 'app-ref-fin-asset-usage-map-paging',
  templateUrl: './ref-fin-asset-usage-map-paging.component.html',
  styleUrls: ['./ref-fin-asset-usage-map-paging.component.css']
})
export class RefFinAssetUsageMapPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();

  readonly AddLink: string = NavigationConstant.REF_FIN_ASSET_USAGE_MAP_ADD_EDIT;

  constructor() { }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchRefFinAssetUsageMap.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchRefFinAssetUsageMap.json";
    this.inputPagingObj.deleteUrl = URLConstant.DeleteRefFinAssetUsageMapAndRefFinAssetUsageMapD;
  }

}
