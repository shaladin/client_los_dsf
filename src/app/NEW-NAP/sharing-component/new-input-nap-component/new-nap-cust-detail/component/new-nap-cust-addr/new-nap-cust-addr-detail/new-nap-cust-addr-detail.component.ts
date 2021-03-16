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

    this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAddrType, MappingCode: this.InputObj.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany }).subscribe(
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
          MrCustAddrTypeCode: this.AddressTypeObj[0].Key,
        });
        this.selectedAddrType = this.AddressTypeObj[0].Value;
        await this.LoadAddrForCopy();
        await this.ResetForm();

        if (this.InputObj.Mode == "Edit") {
          this.AddrObj = this.InputObj.InputedAddr;
          this.AddressForm.patchValue({ MrCustAddrTypeCode: this.InputObj.InputedAddr.MrCustAddrTypeCode, CustAddrTypeName: this.InputObj.InputedAddr.CustAddrTypeName });
          this.selectedAddrType = this.InputObj.InputedAddr.CustAddrTypeName;
          this.appCustAddrObj.MrCustAddrTypeCode = this.InputObj.InputedAddr.MrCustAddrTypeCode;
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
    this.AddrObj = new AddrObj();
    this.AddrObj.Addr = copiedAddr.Addr;
    this.AddrObj.AreaCode1 = copiedAddr.AreaCode1;
    this.AddrObj.AreaCode2 = copiedAddr.AreaCode2;
    this.AddrObj.AreaCode3 = copiedAddr.AreaCode3;
    this.AddrObj.AreaCode4 = copiedAddr.AreaCode4;
    this.AddrObj.City = copiedAddr.City;
    this.AddrObj.Fax = copiedAddr.Fax;
    this.AddrObj.FaxArea = copiedAddr.FaxArea;
    this.AddrObj.Phn1 = copiedAddr.Phn1;
    this.AddrObj.Phn2 = copiedAddr.Phn2;
    this.AddrObj.Phn3 = copiedAddr.Phn3;
    this.AddrObj.PhnArea1 = copiedAddr.PhnArea1;
    this.AddrObj.PhnArea2 = copiedAddr.PhnArea2;
    this.AddrObj.PhnArea3 = copiedAddr.PhnArea3;
    this.AddrObj.PhnExt1 = copiedAddr.PhnExt1;
    this.AddrObj.PhnExt2 = copiedAddr.PhnExt2;
    this.AddrObj.PhnExt3 = copiedAddr.PhnExt3;
    

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
      var addEditedAppCustAddrObj = new AppCustAddrObj();    
      addEditedAppCustAddrObj.MrCustAddrTypeCode = this.AddressForm.controls.MrCustAddrTypeCode.value;

      if(addEditedAppCustAddrObj.MrCustAddrTypeCode != CommonConstant.AddrTypeLegal){
        addEditedAppCustAddrObj.MrHouseOwnershipCode = this.AddressForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
      }

      addEditedAppCustAddrObj.Addr = this.AddressForm.controls["Address"]["controls"].Addr.value;
      addEditedAppCustAddrObj.AreaCode1 = this.AddressForm.controls["Address"]["controls"].AreaCode1.value;
      addEditedAppCustAddrObj.AreaCode2 = this.AddressForm.controls["Address"]["controls"].AreaCode2.value;
      addEditedAppCustAddrObj.AreaCode3 = this.AddressForm.controls["Address"]["controls"].AreaCode3.value;
      addEditedAppCustAddrObj.AreaCode4 = this.AddressForm.controls["Address"]["controls"].AreaCode4.value;
      addEditedAppCustAddrObj.City = this.AddressForm.controls["Address"]["controls"].City.value;
      addEditedAppCustAddrObj.Zipcode = this.AddressForm.controls["AddressZipcode"]["value"].value;
      addEditedAppCustAddrObj.SubZipcode = this.AddressForm.controls["Address"]["controls"].SubZipcode.value;
      addEditedAppCustAddrObj.PhnArea1 = this.AddressForm.controls["Address"]["controls"].PhnArea1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea1.value;
      addEditedAppCustAddrObj.Phn1 = this.AddressForm.controls["Address"]["controls"].Phn1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn1.value;
      addEditedAppCustAddrObj.PhnExt1 = this.AddressForm.controls["Address"]["controls"].PhnExt1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt1.value;
      addEditedAppCustAddrObj.PhnArea2 = this.AddressForm.controls["Address"]["controls"].PhnArea2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea2.value;
      addEditedAppCustAddrObj.Phn2 = this.AddressForm.controls["Address"]["controls"].Phn2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn2.value;
      addEditedAppCustAddrObj.PhnExt2 = this.AddressForm.controls["Address"]["controls"].PhnExt2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt2.value;
      addEditedAppCustAddrObj.PhnArea3 = this.AddressForm.controls["Address"]["controls"].PhnArea3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea3.value;
      addEditedAppCustAddrObj.Phn3 = this.AddressForm.controls["Address"]["controls"].Phn3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn3.value;
      addEditedAppCustAddrObj.PhnExt3 = this.AddressForm.controls["Address"]["controls"].PhnExt3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt3.value;
      addEditedAppCustAddrObj.FaxArea = this.AddressForm.controls["Address"]["controls"].FaxArea.value;
      addEditedAppCustAddrObj.Fax = this.AddressForm.controls["Address"]["controls"].Fax.value;
      addEditedAppCustAddrObj.PhoneNo = addEditedAppCustAddrObj.PhnArea1 + " - " + addEditedAppCustAddrObj.Phn1 + " - " + addEditedAppCustAddrObj.PhnExt1;
      addEditedAppCustAddrObj.PhoneNo2 = addEditedAppCustAddrObj.PhnArea2 + " - " + addEditedAppCustAddrObj.Phn2 + " - " + addEditedAppCustAddrObj.PhnExt2;
      addEditedAppCustAddrObj.CustAddrTypeName = this.selectedAddrType;
      addEditedAppCustAddrObj.HouseOwnershipName = addEditedAppCustAddrObj.MrHouseOwnershipCode;

      if(this.InputObj.Mode == "Edit"){
        this.InputObj.ListInputedAddr[this.InputObj.EditedIndex] = addEditedAppCustAddrObj;
      }else{
        this.InputObj.ListInputedAddr.push(addEditedAppCustAddrObj);
      }
      this.OutputTab.emit({ IsDetail: false, ListAddress: this.InputObj.ListInputedAddr });
      
    }
  }

}
