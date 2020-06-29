import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ResponseTaxDetailObj } from 'app/shared/model/Tax/ResponseTaxDetail.Model';
import { ResponseTaxObj } from 'app/shared/model/Tax/ResponseTax.Model';
import { TaxTrxDObj } from 'app/shared/model/Tax/TaxTrxD.Model';
import { VendorBankAccObj } from 'app/shared/model/VendorBankAcc.Model';

@Component({
  selector: 'app-form-commission-generate',
  templateUrl: './form-commission-generate.component.html',
  styleUrls: ['./form-commission-generate.component.scss']
})
export class FormCommissionGenerateComponent implements OnInit {

  
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() FormInputObj: any = {};
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,) { }

  initData(){
    this.parentForm.addControl(this.identifier, this.fb.group({
      arr: this.fb.array([])
    }));
  }

  ngOnInit() {
    this.initData();
  }

}
