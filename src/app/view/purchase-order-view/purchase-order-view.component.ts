import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';

@Component({
  selector: 'app-purchase-order-view',
  templateUrl: './purchase-order-view.component.html',
  styleUrls: ['./purchase-order-view.component.scss'],
  providers : [NGXToastrService]
})
export class PurchaseOrderViewComponent implements OnInit {
  POInfo: UcViewGenericObj = new UcViewGenericObj();
  ADFinancialInfo: UcViewGenericObj = new UcViewGenericObj();
  ARFinancialInfo: UcViewGenericObj = new UcViewGenericObj();
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

    this.POInfo.viewInput = "./assets/ucviewgeneric/viewPOInfo.json";
    this.POInfo.viewEnvironment = environment.losUrl;

    this.ADFinancialInfo.viewInput = "./assets/ucviewgeneric/viewADFinancialInfo.json";
    this.ADFinancialInfo.viewEnvironment = environment.losUrl;

    this.ARFinancialInfo.viewInput = "./assets/ucviewgeneric/viewARFinancialInfo.json";
    this.ARFinancialInfo.viewEnvironment = environment.losUrl;

    this.http.post(URLConstant.GetPurchaseOrderHDetailViewMultiAssetByAgrmntId, { PurchaseOrderHId: this.PurchaseOrderHId, AgrmntId: this.AgrmntId }).subscribe(
      (response) => {
        this.ResponsePurchaseOrderHData = response["ResponsePurchaseOrderHObj"];
        this.MrFirstInstTypeCode = response["MrFirstInstTypeCode"];
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ResponseAppAssetObj"]
        this.result = this.inputGridObj.resultData.Data;
      });
  }
}
