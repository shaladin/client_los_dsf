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
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.scss']
})
export class AddressTabComponent implements OnInit {

  @Input() MrCustTypeCode: string;
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  mode: string = "add";
  AppCustAddrId: number;
  isDetail: boolean = false;
  inputGridObj: InputGridObj = new InputGridObj();
  isUcAddressReady: boolean = false;
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  AddrObj: AddrObj = new AddrObj();
  appCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  listAddress: Array<any>;
  copyAddressFromObj: any;
  AddressTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  AddressForm = this.fb.group({
    MrCustAddrTypeCode: [],
    CopyAddrFrom: []
  })

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionAddress.json";

    this.AddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.isUcAddressReady = true;

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAddrType, ReserveField1: this.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany }).subscribe(
      (response) => {
        this.AddressTypeObj = response[CommonConstant.ReturnObj];
        this.AddressForm.patchValue({
          MrCustAddrTypeCode: this.AddressTypeObj[0].Key
        })
      });

    this.http.post(URLConstant.GetListAppCustAddrData, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.copyAddressFromObj = response;
        this.AddressForm.patchValue({ CopyAddrFrom: response[0]['AppCustAddrId'] });
      });

    this.LoadListCustAddress();
  }

  ChangeAddrType(AddrType: string = CommonConstant.AddrTypeLegal){
    if(AddrType != CommonConstant.AddrTypeLegal) this.inputAddressObj.showOwnership = true;
    else this.inputAddressObj.showOwnership = false;
  }

  GetCallback(event) {
    this.ResetForm();
    this.isDetail = true;
    this.mode = "edit"
    this.isUcAddressReady = true;
    this.AppCustAddrId = event.RowObj.AppCustAddrId;
    this.AddressForm.patchValue({ MrCustAddrTypeCode: event.RowObj["MrCustAddrTypeCode"] })
    this.ChangeAddrType(event.RowObj["MrCustAddrTypeCode"]);
    this.AddrObj = event.RowObj;
    this.inputAddressObj.inputField.inputLookupObj.nameSelect = event.RowObj["Zipcode"];
    this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: event.RowObj["Zipcode"] };
    this.inputAddressObj.default = this.AddrObj;
    this.AddressForm.controls.MrCustAddrTypeCode.disable();
    this.AddressForm.updateValueAndValidity();
  }

  Add() {
    this.ResetForm();
    this.mode == "add"
    this.isDetail = true;
    this.isUcAddressReady = true;
  }

  async SaveForm() {
    this.appCustAddrObj.AppCustAddrId = this.AppCustAddrId;
    this.appCustAddrObj.MrCustAddrTypeCode = this.AddressForm.controls.MrCustAddrTypeCode.value;
    this.appCustAddrObj.AppCustId = this.AppCustId
    this.appCustAddrObj.MrHouseOwnershipCode = this.AddrObj.MrHouseOwnershipCode
    this.appCustAddrObj.Addr = this.AddrObj.Addr
    this.appCustAddrObj.AreaCode1 = this.AddrObj.AreaCode1
    this.appCustAddrObj.AreaCode2 = this.AddrObj.AreaCode2
    this.appCustAddrObj.AreaCode3 = this.AddrObj.AreaCode3
    this.appCustAddrObj.AreaCode4 = this.AddrObj.AreaCode4
    this.appCustAddrObj.City = this.AddrObj.City
    this.appCustAddrObj.Zipcode = this.AddressForm.controls["AddressZipcode"]["value"].value;
    this.appCustAddrObj.SubZipcode = this.AddrObj.SubZipcode
    this.appCustAddrObj.PhnArea1 = this.AddrObj.PhnArea1
    this.appCustAddrObj.Phn1 = this.AddrObj.Phn1
    this.appCustAddrObj.PhnExt1 = this.AddrObj.PhnExt1
    this.appCustAddrObj.PhnArea2 = this.AddrObj.PhnArea2
    this.appCustAddrObj.Phn2 = this.AddrObj.Phn2
    this.appCustAddrObj.PhnExt2 = this.AddrObj.PhnExt2
    this.appCustAddrObj.PhnArea3 = this.AddrObj.PhnArea3
    this.appCustAddrObj.Phn3 = this.AddrObj.Phn3
    this.appCustAddrObj.PhnExt3 = this.AddrObj.PhnExt3
    this.appCustAddrObj.FaxArea = this.AddrObj.FaxArea
    this.appCustAddrObj.Fax = this.AddrObj.Fax
    this.appCustAddrObj.StayLength = this.AddrObj.StayLength

    if(this.mode == "add"){
      await this.http.post(URLConstant.AddAppCustAddr, this.appCustAddrObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
        });
    }else{
      await this.http.post(URLConstant.EditAppCustAddr, this.appCustAddrObj).toPromise().then(
        (response) => {
          this.toastr.successMessage(response["message"]);
        },
        (error) => {
        });
    }
    this.isDetail = false;
    await this.LoadListCustAddress();
  }

  Cancel() {
    this.isDetail = false;
  }

  Continue() {
    if(this.listAddress.find(x=>x.MrCustAddrTypeCode == CommonConstant.AddrTypeLegal) != null && this.listAddress.find(x=>x.MrCustAddrTypeCode == CommonConstant.AddrTypeResidence) != null) {
      this.OutputTab.emit();
    }else{
      this.toastr.warningMessage("Please Input Legal Address or Residence Address Data!")
    }
  }

  LoadListCustAddress() {
    this.http.post(URLConstant.GetListAppCustAddrByAppCustId, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response;
        this.listAddress = this.inputGridObj.resultData.Data;
      }
    );
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }

    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, { AppCustAddrId: this.AddressForm.controls.CopyAddrFrom.value }).subscribe(
      (response) => {
        this.AddrObj.Addr = response["Addr"];
        this.AddrObj.AreaCode1 = response["AreaCode1"];
        this.AddrObj.AreaCode2 = response["AreaCode2"];
        this.AddrObj.AreaCode3 = response["AreaCode3"];
        this.AddrObj.AreaCode4 = response["AreaCode4"];
        this.AddrObj.City = response["City"];
        this.AddrObj.Fax = response["Fax"];
        this.AddrObj.FaxArea = response["FaxArea"];
        this.AddrObj.Phn1 = response["Phn1"];
        this.AddrObj.Phn2 = response["Phn2"];
        this.AddrObj.PhnArea1 = response["PhnArea1"];
        this.AddrObj.PhnArea2 = response["PhnArea2"];
        this.AddrObj.PhnExt1 = response["PhnExt1"];
        this.AddrObj.PhnExt2 = response["PhnExt2"];

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.inputAddressObj.default = this.AddrObj;
      });
  }

  ResetForm(){
    this.AddressForm.reset();
    this.AddressForm.patchValue({
      MrCustAddrTypeCode: this.AddressTypeObj[0].Key,
      CopyAddrFrom: this.copyAddressFromObj[0]['AppCustAddrId']
    });
    this.AddrObj = new AddrObj();
    this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: "" };
    this.inputAddressObj.default = this.AddrObj;
  }
}
