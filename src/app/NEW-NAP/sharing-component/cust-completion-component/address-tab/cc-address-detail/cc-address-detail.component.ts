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
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';
import { UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cc-address-detail',
  templateUrl: './cc-address-detail.component.html',
  styleUrls: ['./cc-address-detail.component.scss']
})
export class CcAddressDetailComponent implements OnInit {

  @Input() InputObj: InputCustomAddrCustCmpltObj;
  @Output() OutputTab: EventEmitter<Object> = new EventEmitter();
  isUcAddressReady: boolean = false;
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  AddrObj: AddrObj = new AddrObj();
  appCustAddrObj: AppCustAddrObj = new AppCustAddrObj();
  copyAddressFromObj: Array<AppCustAddrObj> = new Array();
  AddressTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  dllAddressTypeObj: UcDropdownListObj = new UcDropdownListObj();
  dllCopyAddressFromObj: UcDropdownListObj = new UcDropdownListObj();
  isDllAddressTypeReady: boolean = false;
  isDllCopyAddressFromReady: boolean = false;
  isAddrObjReady :boolean = false;

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
    this.inputAddressObj.showOwnership = true;
    this.isUcAddressReady = true;

    this.dllCopyAddressFromObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.dllCopyAddressFromObj.customKey = "AppCustAddrId";
    this.dllCopyAddressFromObj.customValue = "MrCustAddrTypeDescr";

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
          MrCustAddrTypeCode: this.AddressTypeObj[0].Key
        })
        this.LoadAddrForCopy();
        this.ResetForm();
        this.isDllAddressTypeReady = true;
      });

    if (this.InputObj.AppCustAddrId != 0) {
      this.http.post<AppCustAddrObj>(URLConstant.GetAppCustAddrByAppCustAddrId, { Id: this.InputObj.AppCustAddrId }).subscribe(
        (response) => {
          this.AddrObj = response;
          this.AddressForm.patchValue({ MrCustAddrTypeCode: response.MrCustAddrTypeCode })
          this.appCustAddrObj.MrCustAddrTypeCode = response.MrCustAddrTypeCode;
          this.appCustAddrObj.RowVersion = response.RowVersion;
          this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
          this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
          this.inputAddressObj.default = this.AddrObj;
          this.isAddrObjReady = true;
        });
    }
    else{
      this.isAddrObjReady = true;
    }
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
    this.http.post<Array<AppCustAddrObj>>(URLConstant.GetListAppCustAddrDataForCopyByAppCustId, { Id: this.InputObj.AppCustId }).subscribe(
      (response) => {
        this.copyAddressFromObj = response;
        this.AddressForm.patchValue({ CopyAddrFrom: response[0]['AppCustAddrId'] });
        this.isDllCopyAddressFromReady = true;
      });
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }

    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, { Id: this.AddressForm.controls.CopyAddrFrom.value }).subscribe(
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
        this.AddrObj.Phn3 = response["Phn3"];
        this.AddrObj.PhnArea1 = response["PhnArea1"];
        this.AddrObj.PhnArea2 = response["PhnArea2"];
        this.AddrObj.PhnArea3 = response["PhnArea3"];
        this.AddrObj.PhnExt1 = response["PhnExt1"];
        this.AddrObj.PhnExt2 = response["PhnExt2"];
        this.AddrObj.PhnExt3 = response["PhnExt3"];

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.inputAddressObj.default = this.AddrObj;
      });
  }

  Cancel() {
    this.OutputTab.emit({ IsDetail: false })
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
      this.appCustAddrObj.MrHouseOwnershipCode = this.AddressForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
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
  
      if (this.InputObj.Mode == "Add") {
        this.http.post(URLConstant.AddAppCustAddr, this.appCustAddrObj).toPromise().then(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.OutputTab.emit({ IsDetail: false })
          },
          (error) => {
          });
      } else {
        this.http.post(URLConstant.EditAppCustAddr, this.appCustAddrObj).toPromise().then(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.OutputTab.emit({ IsDetail: false })
          },
          (error) => {
          });
      }
    }
  }
}
