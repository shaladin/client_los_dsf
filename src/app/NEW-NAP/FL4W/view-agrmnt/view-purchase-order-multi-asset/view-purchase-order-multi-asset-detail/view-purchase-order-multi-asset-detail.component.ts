import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ReqGetPurchaseOrderHDetailObj } from 'app/shared/model/Request/PurchaseOrder/ReqPOObj.model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { AgrmntFinDataObj } from 'app/shared/model/AgrmntFinData.Model';

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
    await this.BindPOData();
  }

  ResponseAgrmntFinDataData: AgrmntFinDataObj;
  ResponseAppAssetData: Array<AppAssetObj>;
  ResponsePurchaseOrderHData: PurchaseOrderHObj;
 
  async BindPOData(){
     let GetPOObj = new ReqGetPurchaseOrderHDetailObj();
     GetPOObj.AgrmntId = this.agrmntId;
     GetPOObj.SupplCode = this.supplCode;
     GetPOObj.PurchaseOrderHId = this.PurchaseOrderHId;
    await this.http.post(URLConstant.GetPurchaseOrderHDetailViewMultiAssetByAgrmntId, GetPOObj).toPromise().then(
      (response) => {
        this.ResponseAgrmntFinDataData=response["ResponseAgrmntFinDataObj"];
        this.ResponseAppAssetData=response["ResponseAppAssetObj"];
        this.ResponsePurchaseOrderHData=response["ResponsePurchaseOrderHObj"]; 
      });     
  } 
  back(){
    var isView = false;
    this.IsView.emit(isView);
  }
}
