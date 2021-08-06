import { Output, EventEmitter, OnInit, Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { URLConstant } from "app/shared/constant/URLConstant";
import { PurchaseOrderHObj } from "app/shared/model/PurchaseOrderHObj.Model";

import { CommonConstant } from "app/shared/constant/CommonConstant";

@Component({
  selector: 'app-view-purchase-order-multi-asset',
  templateUrl: './view-purchase-order-multi-asset.component.html'
})
export class ViewPurchaseOrderMultiAssetComponent implements OnInit {
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Input() agrmntId: number = 0;

  isView: boolean;
  listPurchaseOrder: PurchaseOrderHObj;
  tempSupplCode: string;
  tempPurchaseOrderHId: number;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.isView = false;

    var PurchaseOrderObj = {
      Id: this.agrmntId
    }
    this.http.post(URLConstant.GetListPurchaseOrderHByAgrmntId, PurchaseOrderObj).subscribe(
      (response) => {
        this.listPurchaseOrder = response[CommonConstant.ReturnObj];
      }
    );
  }

  view(supplCode: string, PurchaseOrderHId: number) {
    this.tempSupplCode = supplCode;
    this.tempPurchaseOrderHId = PurchaseOrderHId;
    this.isView = true;
  }
  
  getIsView(event) {
    this.isView = event;
  }
}