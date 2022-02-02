import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ViewPurchaseOrderNewDetailComponent } from 'app/view-enhancing/agr-view/view-purchase-order-new-detail/view-purchase-order-new-detail.component';
import {URLConstantX} from '../../../shared/constant/URLConstantX';

@Component({
  selector: 'app-view-purchase-order-new-list-x',
  templateUrl: './view-purchase-order-new-list-x.component.html'
})
export class ViewPurchaseOrderNewListXComponent implements OnInit {

  @Input() AgrmntId: number = 0;
  @Input() BizTemplateCode: string;
  @Input() AppId: number = 0;

  POList: Array<Object>;

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  async ngOnInit() {
    await this.http.post(URLConstantX.GetPurchaseOrderListForNewPOByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.POList = response["PurchaseOrderForNewPOObjXes"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  POEntryHandler(idx) {
    const modalPOEntry = this.modalService.open(ViewPurchaseOrderNewDetailComponent);
    modalPOEntry.componentInstance.SupplCode = this.POList[idx]["SupplCode"];
    modalPOEntry.componentInstance.PurchaseOrderHId = this.POList[idx]["PurchaseOrderHId"];
    modalPOEntry.componentInstance.AppId = this.AppId;
    modalPOEntry.componentInstance.AgrmntId = this.POList[idx]["AgrmntId"];
    modalPOEntry.componentInstance.MouNo = this.POList[idx]["MouNo"];
    modalPOEntry.result.then(
      (response) => {
        // this.spinner.show();
        this.http.post(URLConstantX.GetPurchaseOrderListForNewPOByAppId, { Id: this.AppId }).toPromise().then(
          (response) => {
            this.POList = response["PurchaseOrderForNewPOObjXes"];
          }
        ).catch(
          (error) => {
          }
        );
        // this.spinner.hide();
        // this.toastr.successMessage(response["message"]);
      }
    ).catch(
      (error) => {
      }
    );
  }

}
