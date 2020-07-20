import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-purchase-order-multi-asset-detail',
  templateUrl: './view-purchase-order-multi-asset-detail.component.html' 
})
export class ViewPurchaseOrderMultiAssetDetailComponent implements OnInit {


  @Input() agrmntId: number = 0;
  @Input() supplCode: string;
  @Input() PurchaseOrderHId: number = 0; 
  @Output() IsView: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private route: ActivatedRoute,
  private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
  ) { }

  async ngOnInit() {
    console.log("this view PO");
    console.log(this.agrmntId);
    await this.BindPOData();
    console.log("aaaaa");
  }

  ResponseAgrmntFinDataData;
  ResponseAppAssetData;
  ResponsePurchaseOrderHData;
 
  async BindPOData(){
    var obj = { 
      AgrmntId: this.agrmntId,
      SupplCode : this.supplCode,
      PurchaseOrderHId : this.PurchaseOrderHId
     };
    await this.http.post(URLConstant.GetPurchaseOrderHDetailViewMultiAssetByAgrmntId, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.ResponseAgrmntFinDataData=response["ResponseAgrmntFinDataObj"];
        this.ResponseAppAssetData=response["ResponseAppAssetObj"];
        this.ResponsePurchaseOrderHData=response["ResponsePurchaseOrderHObj"]; 
      },
      (error) => {
        console.log(error);
      }
    );     
  } 
  back(){
    var isView = false;
    this.IsView.emit(isView);
  }
}
