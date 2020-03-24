import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-delivery-order-detail',
  templateUrl: './delivery-order-detail.component.html',
  styleUrls: ['./delivery-order-detail.component.scss']
})
export class DeliveryOrderDetailComponent implements OnInit {

  constructor(private fb: FormBuilder) { 

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
  }


}
