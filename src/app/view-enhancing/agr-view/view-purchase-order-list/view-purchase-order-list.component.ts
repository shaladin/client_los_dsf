import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcInputApprovalHistoryObj } from 'app/shared/model/uc-input-approval-history-obj.model';
import { ViewPurchaseOrderDetailComponent } from '../view-purchase-order-detail/view-purchase-order-detail.component';

@Component({
  selector: 'app-view-purchase-order-list',
  templateUrl: './view-purchase-order-list.component.html'
})
export class ViewPurchaseOrderListComponent implements OnInit {

  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  constructor(private http: HttpClient, private modalService: NgbModal) {

  }
  
  CrdApvRsltExtObj: UcInputApprovalHistoryObj;
  AppAssetList = [];
  IsHidden: boolean = true;
  AppId: number;
  SupplCode: string = "";
  IsCrdApvRsltExtReady: boolean = false;

  viewPurchaseOrderDetailHandler(item){

    const modalPODetail = this.modalService.open(ViewPurchaseOrderDetailComponent);
    modalPODetail.componentInstance.AgrmntId = item.AgrmntId;
    modalPODetail.componentInstance.AppId = item.AppId;
    modalPODetail.componentInstance.SupplCode = item.SupplCode;
    modalPODetail.componentInstance.LobCode = this.BizTemplateCode;
    modalPODetail.result.then().catch((error) => {
    });
  }

  async ngOnInit() {
    let reqAppAssetObj = {
      Id: this.AgrmntId
    }
    await this.http.post(URLConstant.GetAppAssetListByAgrmntId, reqAppAssetObj).toPromise().then(
    (response) => {
      this.AppAssetList = response[CommonConstant.ReturnObj];
    });

    this.CrdApvRsltExtObj = new UcInputApprovalHistoryObj();
    this.CrdApvRsltExtObj.PathUrl = "/Approval/GetTaskHistory";

    this.http.post(URLConstant.GetAgrmntByAgrmntId, { Id: this.AgrmntId }).subscribe(
      (response) => {
        let agrmntNo = response['AgrmntNo'];
        this.http.post(URLConstant.GetRfaLogByTrxNo, { TrxNo: agrmntNo }).subscribe(
          (response) => {
            for (let i = 0; i < response['ListRfaLogObj'].length; i++) {
              if (response['ListRfaLogObj'][i]['ApvCategory'] == CommonConstant.ApvCategoryCreditApprovalResultExtensionApproval) {
                this.CrdApvRsltExtObj.RequestId = response['ListRfaLogObj'][i]['RfaNo'];
              }
            }
            this.IsCrdApvRsltExtReady = true;
          });
      });
  }

  getValue(event){
    this.IsHidden = event;
  }

}
