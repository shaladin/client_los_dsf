import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/InputCustomAddrCustCmpltObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-addr-detail',
  templateUrl: './new-nap-cust-addr-detail.component.html',
  styles: []
})
export class NewNapCustAddrDetailComponent implements OnInit {
  @Input() InputObj: InputCustomAddrCustCmpltObj;
  @Output() OutputTab: EventEmitter<Object> = new EventEmitter();
  isUcAddressReady: boolean = false;
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  AddrObj: AddrObj = new AddrObj();
  appCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  copyAddressFromObj: Array<AppCustAddrObj> = new Array();
  AddressTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  selectedAddrType: string;

  AddressForm = this.fb.group({
    MrCustAddrTypeCode: [],
    CopyAddrFrom: []
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { }

  ngOnInit() {
    this.AddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.inputAddressObj.showOwnership = true;
    this.isUcAddressReady = true;

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAddrType, ReserveField1: this.InputObj.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany }).subscribe(
      async (response) => {
        this.AddressTypeObj = response[CommonConstant.ReturnObj];
        if(this.InputObj.MrCustTypeCode == CommonConstant.CustTypeCompany){
          let idxCompany = this.AddressTypeObj.findIndex(x => x.Key == CommonConstant.AddrTypeCompany);
          if(idxCompany != -1) this.AddressTypeObj.splice(idxCompany, 1)
        }else{
          let idxEmergency = this.AddressTypeObj.findIndex(x => x.Key == CommonConstant.AddrTypeEmergency);
          if(idxEmergency != -1) this.AddressTypeObj.splice(idxEmergency, 1)
        }
        this.AddressForm.patchValue({
          MrCustAddrTypeCode: this.AddressTypeObj[0].Key
        })
        await this.LoadAddrForCopy();
        await this.ResetForm();

        if (this.InputObj.Mode == "Edit") {
          this.AddrObj = this.InputObj.InputedAddr;
          this.AddressForm.patchValue({ MrCustAddrTypeCode: this.InputObj.InputedAddr.MrCustAddrTypeCode, CustAddrTypeName: this.InputObj.InputedAddr.CustAddrTypeName });
          this.selectedAddrType = this.InputObj.InputedAddr.CustAddrTypeName;
          this.appCustAddrObj.MrCustAddrTypeCode = this.InputObj.InputedAddr.MrCustAddrTypeCode;
          this.appCustAddrObj.RowVersion = this.InputObj.InputedAddr.RowVersion;
          this.inputAddressObj.inputField.inputLookupObj.nameSelect = this.InputObj.InputedAddr.Zipcode;
          this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: this.InputObj.InputedAddr.Zipcode };
          this.inputAddressObj.default = this.AddrObj;
          this.SetShowOwnership(this.InputObj.InputedAddr.MrCustAddrTypeCode);
        }
      });
  }

  ResetForm() {
    this.AddressForm.reset();
    this.AddressForm.patchValue({
      MrCustAddrTypeCode: this.AddressTypeObj[0].Key
    });
    this.AddrObj = new AddrObj();
    this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: "" };
    this.inputAddressObj.default = this.AddrObj;
  }

  LoadAddrForCopy() {
    this.copyAddressFromObj = this.InputObj.ListInputedAddr;
    if(this.InputObj.ListInputedAddr.length > 0){
      this.AddressForm.patchValue({ CopyAddrFrom: this.InputObj.ListInputedAddr[0]['MrCustAddrTypeCode'] });
    }
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }
    var copiedAddr = this.InputObj.ListInputedAddr.find(x => x.MrCustAddrTypeCode == this.AddressForm.controls.CopyAddrFrom.value);
    this.AddrObj = copiedAddr;
    this.inputAddressObj.inputField.inputLookupObj.nameSelect = copiedAddr.Zipcode;
    this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: copiedAddr.Zipcode };
    this.inputAddressObj.default = this.AddrObj;
  }

  Cancel() {
    this.OutputTab.emit({ IsDetail: false, ListAddress: this.InputObj.ListInputedAddr })
  }

  AddrTypeChanged(event){
    this.selectedAddrType = event.target.options[event.target.options.selectedIndex].text;
    this.SetShowOwnership(event.target.value);
  }

  SetShowOwnership(mrCustAddrTypeCode){
    this.isUcAddressReady = false;

    if(mrCustAddrTypeCode == CommonConstant.AddrTypeLegal){
      this.inputAddressObj.showOwnership = false;
    }else{
      this.inputAddressObj.showOwnership = true;
    }
    this.isUcAddressReady = true;
  }

  SaveForm() {
    let Flag = false;
    if (this.InputObj.Mode == "Add") {
      if (this.InputObj.ListInputedAddr.find(x => x.MrCustAddrTypeCode == this.AddressForm.controls.MrCustAddrTypeCode.value)) {
        let ErrorOutput = this.AddressTypeObj.find(x => x.Key == this.AddressForm.controls.MrCustAddrTypeCode.value);
        this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Address")
        Flag = true;
      }
    } else if (this.InputObj.Mode == "Edit") {
      if (this.AddressForm.controls.MrCustAddrTypeCode.value != this.appCustAddrObj.MrCustAddrTypeCode && this.InputObj.ListInputedAddr.find(x => x.MrCustAddrTypeCode == this.AddressForm.controls.MrCustAddrTypeCode.value)) {
        let ErrorOutput = this.AddressTypeObj.find(x => x.Key == this.AddressForm.controls.MrCustAddrTypeCode.value);
        this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Address")
        Flag = true
      }
    }

    if(!Flag){
      this.appCustAddrObj.AppCustAddrId = this.InputObj.AppCustAddrId;
      this.appCustAddrObj.MrCustAddrTypeCode = this.AddressForm.controls.MrCustAddrTypeCode.value;
      this.appCustAddrObj.AppCustId = this.InputObj.AppCustId;
      if(this.appCustAddrObj.MrCustAddrTypeCode != CommonConstant.AddrTypeLegal){
        this.appCustAddrObj.MrHouseOwnershipCode = this.AddressForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
      }
      this.appCustAddrObj.Addr = this.AddressForm.controls["Address"]["controls"].Addr.value;
      this.appCustAddrObj.AreaCode1 = this.AddressForm.controls["Address"]["controls"].AreaCode1.value;
      this.appCustAddrObj.AreaCode2 = this.AddressForm.controls["Address"]["controls"].AreaCode2.value;
      this.appCustAddrObj.AreaCode3 = this.AddressForm.controls["Address"]["controls"].AreaCode3.value;
      this.appCustAddrObj.AreaCode4 = this.AddressForm.controls["Address"]["controls"].AreaCode4.value;
      this.appCustAddrObj.City = this.AddressForm.controls["Address"]["controls"].City.value;
      this.appCustAddrObj.Zipcode = this.AddressForm.controls["AddressZipcode"]["value"].value;
      this.appCustAddrObj.SubZipcode = this.AddressForm.controls["Address"]["controls"].SubZipcode.value;
      this.appCustAddrObj.PhnArea1 = this.AddressForm.controls["Address"]["controls"].PhnArea1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea1.value;
      this.appCustAddrObj.Phn1 = this.AddressForm.controls["Address"]["controls"].Phn1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn1.value;
      this.appCustAddrObj.PhnExt1 = this.AddressForm.controls["Address"]["controls"].PhnExt1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt1.value;
      this.appCustAddrObj.PhnArea2 = this.AddressForm.controls["Address"]["controls"].PhnArea2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea2.value;
      this.appCustAddrObj.Phn2 = this.AddressForm.controls["Address"]["controls"].Phn2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn2.value;
      this.appCustAddrObj.PhnExt2 = this.AddressForm.controls["Address"]["controls"].PhnExt2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt2.value;
      this.appCustAddrObj.PhnArea3 = this.AddressForm.controls["Address"]["controls"].PhnArea3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea3.value;
      this.appCustAddrObj.Phn3 = this.AddressForm.controls["Address"]["controls"].Phn3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn3.value;
      this.appCustAddrObj.PhnExt3 = this.AddressForm.controls["Address"]["controls"].PhnExt3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt3.value;
      this.appCustAddrObj.FaxArea = this.AddressForm.controls["Address"]["controls"].FaxArea.value;
      this.appCustAddrObj.Fax = this.AddressForm.controls["Address"]["controls"].Fax.value;
      this.appCustAddrObj.PhoneNo = this.appCustAddrObj.PhnArea1 + " - " + this.appCustAddrObj.Phn1 + " - " + this.appCustAddrObj.PhnExt1;
      this.appCustAddrObj.PhoneNo2 = this.appCustAddrObj.PhnArea2 + " - " + this.appCustAddrObj.Phn2 + " - " + this.appCustAddrObj.PhnExt2;
      this.appCustAddrObj.CustAddrTypeName = this.selectedAddrType;
      this.appCustAddrObj.HouseOwnershipName = this.appCustAddrObj.MrHouseOwnershipCode;

      if(this.InputObj.Mode == "Edit"){
        this.InputObj.ListInputedAddr[this.InputObj.EditedIndex] = this.appCustAddrObj;
      }else{
        this.InputObj.ListInputedAddr.push(this.appCustAddrObj);
      }
      this.OutputTab.emit({ IsDetail: false, ListAddress: this.InputObj.ListInputedAddr });
      
    }
  }

}
