import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-app-asset-view-asset-detail',
  templateUrl: './app-asset-view-asset-detail.component.html',
  styleUrls: []
})
export class AppAssetViewAssetDetailComponent implements OnInit {
  @Input() AppAssetId: number;
  
  @Input() BizTemplateCode: string;

  isReady: boolean = false;
  
  AttributeList: Array<any> = new Array<any>();
  AccessoriesList: Array<any> = new Array<any>();

  viewGenericSupplAssetObj: UcViewGenericObj = new UcViewGenericObj();
  viewGenericAddressObj: UcViewGenericObj = new UcViewGenericObj();

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.SetInfo();
    await this.SetAccessoriesListAndAttrList();
    
    this.isReady = true;
  }

  async SetInfo() {
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.viewGenericSupplAssetObj.viewInput = "./assets/ucviewgeneric/view/app-asset-view/view-application-asset-suppl-asset-information.json";
      this.viewGenericSupplAssetObj.viewEnvironment = environment.losUrl;

      this.viewGenericAddressObj.viewInput = "./assets/ucviewgeneric/view/app-asset-view/view-application-asset-address-information.json";
      this.viewGenericAddressObj.viewEnvironment = environment.losUrl;
    }
  }

  async SetAccessoriesListAndAttrList() {
    var requestAppAssetId = {
      Id: this.AppAssetId
    };

    await this.http.post(URLConstant.GetListAppAssetAccessoryAndAppAssetAttrByAppAssetId, requestAppAssetId).toPromise().then(
      (response) => {
        this.AccessoriesList = response["AppAssetAccesories"];
        this.AttributeList = response["AppAssetAttrs"];
      }
    );
  }
}