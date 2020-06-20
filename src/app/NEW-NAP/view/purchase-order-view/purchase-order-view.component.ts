import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss']
})
export class PurchaseOrderViewComponent implements OnInit {
  POInfo: string;
  ADFinancialInfo: string;
  ARFinancialInfo: string;
  MrFirstInstTypeCode;
  ResponseAppAssetData;
  ResponsePurchaseOrderHData;
  PurchaseOrderHId: number;
  AgrmntId: number;
  inputGridObj: InputGridObj;
  result;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.PurchaseOrderHId = params["PurchaseOrderHId"];
      this.AgrmntId = params["AgrmntId"];
    });
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAssetPOView.json";

    this.POInfo = "./assets/ucviewgeneric/viewPOInfo.json";
    this.ADFinancialInfo = "./assets/ucviewgeneric/viewADFinancialInfo.json";
    this.ARFinancialInfo = "./assets/ucviewgeneric/viewARFinancialInfo.json";

    this.http.post(AdInsConstant.GetPurchaseOrderHDetailViewMultiAssetByAgrmntId, { PurchaseOrderHId: this.PurchaseOrderHId, AgrmntId: this.AgrmntId }).subscribe(
      (response) => {
        this.ResponsePurchaseOrderHData = response["ResponsePurchaseOrderHObj"];
        this.MrFirstInstTypeCode = response["MrFirstInstTypeCode"];
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ResponseAppAssetObj"]
        this.result = this.inputGridObj.resultData.Data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
