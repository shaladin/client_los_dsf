import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';
import { GenericListByIdObj } from 'app/shared/model/Generic/GenericListByIdObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-crd-rvw-asset-acc',
  templateUrl: './crd-rvw-asset-acc.component.html',
  styleUrls: ['./crd-rvw-asset-acc.component.scss']
})
export class CrdRvwAssetAccComponent implements OnInit {
  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  listAppAssetIds: GenericListByIdObj = new GenericListByIdObj();
  ListAssetData: AppAssetObj[] = new Array<AppAssetObj>();
  ListAppAssetAccessory: AppAssetAccessoryObj[] = new Array<AppAssetAccessoryObj>()
  isMultiAsset: boolean = true;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    if(this.crdRvwCustInfoObj.BizTemplateCode == CommonConstant.CF4W){
      this.isMultiAsset = false;
    }

    await this.GetAppAssetData();
    console.log(this.listAppAssetIds);
    await this.GetListAppAssetAccessory();

    this.ListAppAssetAccessory.forEach(x => {
      // x.AssetSeqNo = this.ListAssetData.filter(y => y.AppAssetId = x.AppAssetId).map(y => y.AssetSeqNo);
      console.log(x.AppAssetId);
      console.log(this.ListAssetData.filter(y => y.AppAssetId = x.AppAssetId).map(y => y.AssetSeqNo));
    })
  }

  async GetAppAssetData(){
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.crdRvwCustInfoObj.AppId
    await this.http.post<Array<AppAssetObj>>(URLConstant.GetAppAssetListByAppId, reqById).toPromise().then(
      response => {
        this.ListAssetData = response[CommonConstant.ReturnObj];
        console.log(this.ListAssetData);
        this.listAppAssetIds.Ids = this.ListAssetData.map(x => x.AppAssetId);
      }
    )
  }

  async GetListAppAssetAccessory(){
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.crdRvwCustInfoObj.AppId
    await this.http.post(URLConstant.GetListAppAssetAccessoryByAppId, reqById).toPromise().then(
      response => {
        console.log(response);
        this.ListAppAssetAccessory = response[CommonConstant.ReturnObj];
      }
    )
  }

}
