import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetAccessoryObj } from 'app/shared/model/app-asset-accessory-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { CrdRvwCustInfoObj } from 'app/shared/model/credit-review/crd-rvw-cust-info-obj.model';
import { GenericListByIdObj } from 'app/shared/model/generic/generic-list-by-id-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';

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
    await this.GetListAppAssetAccessory();
  }

  async GetListAppAssetAccessory(){
    let reqById: GenericObj = new GenericObj();
    reqById.Id = this.crdRvwCustInfoObj.AppId
    await this.http.post(URLConstant.GetListAppAssetAccessoryByAppId, reqById).toPromise().then(
      response => {
        this.ListAppAssetAccessory = response[CommonConstant.ReturnObj];
      }
    )
  }

}
