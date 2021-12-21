import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { PurchaseOrderHObj } from 'app/shared/model/purchase-order-h-obj.model';
import { VendorBankAccObj } from 'app/shared/model/vendor-bank-acc.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-purchase-order-new-detail',
  templateUrl: './view-purchase-order-new-detail.component.html'
})
export class ViewPurchaseOrderNewDetailComponent implements OnInit {

  @Input() SupplCode: string;
  @Input() PurchaseOrderHId: number;
  @Input() AppId: number;
  @Input() AgrmntId: number;
  @Input() MouNo: string;
  
  vendorBankAccList: Array<Object>;
  PurchaseOrderH: PurchaseOrderHObj;
  VendorBankAcc: VendorBankAccObj;
  datePipe = new DatePipe("en-US");
  PurchaseOrderExpiredDt: Date;
  Notes: string = "";

  constructor(private httpClient: HttpClient, public activeModal: NgbActiveModal) { }

  async ngOnInit() {
    await this.getPODetailData();
  }

  async getPODetailData(){
      await this.httpClient.post<PurchaseOrderHObj>(URLConstant.GetPurchaseOrderByPurchaseOrderHIdForNewPO, { Id: this.PurchaseOrderHId }).toPromise().then(
        (response) => {

          this.PurchaseOrderH = response;
          this.PurchaseOrderExpiredDt = this.PurchaseOrderH.PurchaseOrderExpiredDt;
          this.Notes = this.PurchaseOrderH.Notes;
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
  }
}
