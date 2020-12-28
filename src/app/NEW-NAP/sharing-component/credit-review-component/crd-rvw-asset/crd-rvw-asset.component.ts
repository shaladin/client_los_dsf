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
  readonly whiteIndicator: string = CommonConstant.WhiteIndicator;
  readonly BizTemplateCF4W: string = CommonConstant.CF4W;

  crdRvwAssetObj: CrdRvwAssetObj = new CrdRvwAssetObj();
  ListCrdRvwAssetObj: Array<CrdRvwAssetObj> = new Array<CrdRvwAssetObj>();

  constructor(
    // private route: ActivatedRoute,
    private http: HttpClient,
    // private fb: FormBuilder,
    // private router: Router
  ) { }

  async ngOnInit() {
    await this.GetCrdRvwAssetData()
  }

  async GetCrdRvwAssetData() {
    if (this.crdRvwCustInfoObj.BizTemplateCode == this.BizTemplateCF4W) {
      await this.http.post<CrdRvwAssetObj>(URLConstant.GetSingleAssetCrdRvwAssetByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
        (response) => {
          // console.log(response);
          this.crdRvwAssetObj = response;
        }
      );
    } else {
      await this.http.post<{ ListCrdRvwAssetObj: Array<CrdRvwAssetObj> }>(URLConstant.GetMultiAssetCrdRvwAssetByCrdRvwCustInfoId, { CrdRvwCustInfoId: this.crdRvwCustInfoObj.CrdRvwCustInfoId }).toPromise().then(
        (response) => {
          // console.log(response);
          this.ListCrdRvwAssetObj = response.ListCrdRvwAssetObj;
        }
      );
    }
  }
}
