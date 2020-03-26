import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html',
  styleUrls: ['./delivery-order-detail.component.scss'],
  providers:[NGXToastrService]
})

export class DeliveryOrderDetailComponent implements OnInit {
  AgrmntId: any;
  result: any;
  resultData : any;
  AssetTypeCode: any;
  MrAssetConditionCode: any;
  
  constructor(private fb: FormBuilder, private http: HttpClient,
      private route: ActivatedRoute, private router: Router, private toastr:NGXToastrService) {
        this.route.queryParams.subscribe(params => {
          this.AgrmntId  = params['AgrmntId'];
        });
  }

  DeliveryOrderForm = this.fb.group({
    AssetStat: [''],
    SerialNo1: ['', Validators.required],
    SerialNo2: ['', Validators.required],
    SerialNo3: ['', Validators.required],
    ManufacturingYear: ['', Validators.required],
    TempRegisLettNo: [''],
    TempRegisLettDt: [''],
    IsReceived: [''],
    DocNo: [''],
    ACDExpiredDt: [''],
    DocNotes: [''],
    DeliveryNo: [''],
    RecipientName: [''],
    DeliveryDt: [''],
    DeliveryAddr: [''],
    MrCustRelationshipCode: [''],
    IsChecked: [''],
    PromisedDt: [''],
    ATExpiredDt: [''],
    Notes: [''],
  })

  ngOnInit() {
    var appAssetobj = {
      AgrmntId : this.AgrmntId
    }

    this.http.post(AdInsConstant.GetAppAssetByAgrmntId, appAssetobj).subscribe(
      (response) => {
        this.result = response;
        this.MrAssetConditionCode = this.result.MrAssetConditionCode;
        console.log(this.MrAssetConditionCode)
        
        var assetDocListobj = {
          AssetTypeCode: this.result.AssetTypeCode
        }
        this.http.post(AdInsConstant.GetListAssetDocListByAssetTypeCode, assetDocListobj).subscribe(
          (response) => {
            this.resultData = response["ReturnObject"];
            console.log(this.resultData);
          }
        ); 
      }
    ); 
  }


}
