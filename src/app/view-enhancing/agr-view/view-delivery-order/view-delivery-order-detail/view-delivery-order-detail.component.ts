import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AssetListForDOMultiAssetObj } from 'app/shared/model/asset-list-for-do-multi-asset-obj.model';
import { DeliveryOrderHObj } from 'app/shared/model/delivery-order-h-obj.model';
import { ViewDeliveryOrderAssetSingleComponent } from './view-delivery-order-asset-single/view-delivery-order-asset-single.component';

@Component({
  selector: 'app-view-delivery-order-detail',
  templateUrl: './view-delivery-order-detail.component.html'
})
export class ViewDeliveryOrderDetailComponent implements OnInit {
  @Input() doDetailObj: DeliveryOrderHObj;
  @Input() showBackButton: boolean = false;
  @Input() appId: number;
  @Output() backButton: EventEmitter<boolean> = new EventEmitter();
  DOAssetList: Array<AssetListForDOMultiAssetObj>;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  async ngOnInit() {
    await this.http.post(URLConstant.GetAssetListForDOMultiAssetView, {Id: this.doDetailObj.DeliveryOrderHId}).toPromise().then(
      response => {
        this.DOAssetList = response["AssetListForDOMultiAssetObj"];
      }
    )
  }

  Back() {
    this.backButton.emit(false);
    
  }

  AssetHandler(appAssetId) {
    const modalAssetDetail = this.modalService.open(ViewDeliveryOrderAssetSingleComponent);
    modalAssetDetail.componentInstance.AppAssetId = appAssetId;
    modalAssetDetail.componentInstance.AppId = this.appId;
    modalAssetDetail.result.then().catch((error) => {
    });
  }
}
