import { Component, OnInit, Input } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-purchase-order',
  templateUrl: './view-purchase-order.component.html'
})
export class ViewPurchaseOrderComponent implements OnInit {

  @Input() agrmntId: number = 0;
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

  ResponseAgrmntFinDataData;
  ResponseAppAssetData;
  ResponsePurchaseOrderHData;
  async BindPOData(){
    var obj = { AgrmntId: this.agrmntId };
    await this.http.post(URLConstant.GetPurchaseOrderHDetailViewByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAgrmntFinDataData=response["ResponseAgrmntFinDataObj"];
        this.ResponseAppAssetData=response["ResponseAppAssetObj"];
        this.ResponsePurchaseOrderHData=response["ResponsePurchaseOrderHObj"];
      });     
  }
}
