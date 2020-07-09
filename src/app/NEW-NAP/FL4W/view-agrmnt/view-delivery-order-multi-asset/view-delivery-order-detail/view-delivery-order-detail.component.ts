import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DeliveryOrderHObj } from 'app/shared/model/DeliveryOrderHObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDeliveryOrderAssetDetailComponent } from '../view-delivery-order-asset-detail/view-delivery-order-asset-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-delivery-order-detail',
  templateUrl: './view-delivery-order-detail.component.html',
  styleUrls: ['./view-delivery-order-detail.component.scss']
})
export class ViewDeliveryOrderDetailComponent implements OnInit {
  GetListAppAssetByDOHId: string;
  DOHId: number;
  assetDetailList: Array<any>;
  GetDeliveryOrderHByDeliveryOrderHId: string;
  doData: Object;

  constructor(private route: ActivatedRoute, private http: HttpClient, private modalService: NgbModal, private spinner: NgxSpinnerService) {
    this.route.queryParams.subscribe(params => {
      if (params['DOHId'] != null) {
        this.DOHId = params['DOHId'];
      }
    });
  }

  async ngOnInit(){
    console.log('viewmultidetail')
    this.GetListAppAssetByDOHId = URLConstant.GetListAppAssetByDOHId;
    this.GetDeliveryOrderHByDeliveryOrderHId = URLConstant.GetDeliveryOrderHByDeliveryOrderHId;
    var doObj = new DeliveryOrderHObj();
    doObj.DeliveryOrderHId = this.DOHId;
    this.http.post(this.GetListAppAssetByDOHId, doObj).subscribe(
      (response) => { 
       this.assetDetailList = response["ReturnObject"];
      });

    this.http.post(this.GetDeliveryOrderHByDeliveryOrderHId, doObj).subscribe(
      (response) => { 
        this.doData = response;
      });
  }

  openModal(appAssetId) {
    const modalMouFee = this.modalService.open(ViewDeliveryOrderAssetDetailComponent);
    modalMouFee.componentInstance.AppAssetId = appAssetId;
    modalMouFee.result.then(
      (response) => {
        this.spinner.show();
        // this.spinner.hide();
      }
    ).catch((error) => {
      if (error != 0) {
        console.log(error);
      }
    });
  }
}
