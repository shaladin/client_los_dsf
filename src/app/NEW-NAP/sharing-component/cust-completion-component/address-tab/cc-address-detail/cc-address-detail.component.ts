import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/InputCustomAddrCustCmpltObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cc-address-detail',
  templateUrl: './cc-address-detail.component.html',
  styleUrls: ['./cc-address-detail.component.scss']
})
export class CcAddressDetailComponent implements OnInit {

  @Input() InputObj: InputCustomAddrCustCmpltObj;
  @Output() OutputTab: EventEmitter<InputCustomAddrCustCmpltObj> = new EventEmitter();
  AppCustAddrId: number;
  isUcAddressReady: boolean = false;
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  AddrObj: AddrObj = new AddrObj();
  appCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  copyAddressFromObj: any;
  AddressTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  AddressForm = this.fb.group({
    MrCustAddrTypeCode: [],
    CopyAddrFrom: []
  })

    constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.AddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.isUcAddressReady = true;

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAddrType, ReserveField1: this.InputObj.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany }).subscribe(
      (response) => {
        this.AddressTypeObj = response[CommonConstant.ReturnObj];
        this.AddressForm.patchValue({
          MrCustAddrTypeCode: this.AddressTypeObj[0].Key
        })
      });

    this.LoadAddrForCopy();
    this.CheckMode();
  }

  LoadAddrForCopy(){
    this.http.post(URLConstant.GetListAppCustAddrData, { AppCustId: this.InputObj.AppCustId }).subscribe(
      (response) => {
        this.copyAddressFromObj = response;
        this.AddressForm.patchValue({ CopyAddrFrom: response[0]['AppCustAddrId'] });
      });
  }

  CheckMode(){

  }

  Cancel(){
  }

  SaveForm(){

  }
}
