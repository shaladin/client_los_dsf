import { Component, OnInit, Input } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html',
  providers: [NGXToastrService]
})
export class ViewPurchaseOrderComponent implements OnInit {
  @Input() agrmntId: number = 0;
  @Input() BizTemplateCode: string;
  ResponseAgrmntFinDataData: any;
  ResponseAppAssetData: any;
  ResponsePurchaseOrderHData: any;
  ResponseAppLoanPurposeWithSupplierNameObj: any;
  AssetTypeObj: any;
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.BindPOData();
  }

  async BindPOData(){
    await this.http.post(URLConstant.GetPurchaseOrderHDetailViewByAgrmntId, { Id: this.agrmntId }).toPromise().then(
      (response) => {
        this.ResponseAgrmntFinDataData = response["ResponseAgrmntFinDataObj"];
        this.ResponseAppAssetData = response["ResponseAppAssetObj"];
        this.ResponsePurchaseOrderHData = response["ResponsePurchaseOrderHObj"];
        this.ResponseAppLoanPurposeWithSupplierNameObj = response["ResponseAppLoanPurposeWithSupplierNameObj"];
        
        this.http.post(URLConstant.GetAssetTypeByCode, {Code: this.ResponseAppAssetData.AssetTypeCode }).subscribe(
          (responseAsset: any) => {
            this.AssetTypeObj = responseAsset;
          }
        );
      }
    );
  }
}
