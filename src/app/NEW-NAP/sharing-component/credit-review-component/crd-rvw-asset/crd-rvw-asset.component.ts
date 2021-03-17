import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CrdRvwAssetObj } from 'app/shared/model/CreditReview/CrdRvwAssetObj.Model';
import { CrdRvwCustInfoObj } from 'app/shared/model/CreditReview/CrdRvwCustInfoObj.Model';

@Component({
  selector: 'app-crd-rvw-asset',
  templateUrl: './crd-rvw-asset.component.html',
  styleUrls: ['./crd-rvw-asset.component.scss']
})
export class CrdRvwAssetComponent implements OnInit {

  @Input() crdRvwCustInfoObj: CrdRvwCustInfoObj = new CrdRvwCustInfoObj();
  isMultiAsset: boolean = false;
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  readonly BizTemplateCF4W: string = CommonConstant.CF4W;

  crdRvwAssetObj: CrdRvwAssetObj = new CrdRvwAssetObj();
  ListCrdRvwAssetObj: Array<CrdRvwAssetObj> = new Array<CrdRvwAssetObj>();

  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwAssetData()
  }

  async GetCrdRvwAssetData() {
    if (this.crdRvwCustInfoObj.BizTemplateCode == this.BizTemplateCF4W) {
      this.isMultiAsset=false;
      await this.http.post<CrdRvwAssetObj>(URLConstant.GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
        (response) => {
          this.crdRvwAssetObj = response;
        }
      );
    } else {
      this.isMultiAsset=true;
      await this.http.post<{ ListCrdRvwAssetObj: Array<CrdRvwAssetObj> }>(URLConstant.GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId, { Id: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
        (response) => {
          this.ListCrdRvwAssetObj = response.ListCrdRvwAssetObj;
        }
      );
    }
  }
}
