import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputCustomAddrLtkmObj } from 'app/impl/shared/model/ltkm/input-custom-addr-ltkm-return-objX.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { LtkmCustAddrObj } from 'app/shared/model/ltkm/ltkm-cust-addr-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { AddressService } from 'app/shared/services/custAddr.service';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-cc-address-detail-x',
  templateUrl: './cc-address-detail-x.component.html'
})
export class CcAddressDetailLtkmXComponent implements OnInit {
  @Input() MrCustTypeCode: string;
  @Input() InputObj: InputCustomAddrLtkmObj;
  @Output() OutputTab: EventEmitter<Object> = new EventEmitter();
  isUcAddressReady: boolean = false;
  inputAddressObj: InputAddressObj = new InputAddressObj();
  inputFieldAddressObj: InputFieldObj = new InputFieldObj();;
  AddrObj: AddrObj = new AddrObj();
  LtkmCustAddrObj: LtkmCustAddrObj = new LtkmCustAddrObj();
  copyAddressFromObj: Array<LtkmCustAddrObj> = new Array();
  AddressTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  dllAddressTypeObj: UcDropdownListObj = new UcDropdownListObj();
  dllCopyAddressFromObj: UcDropdownListObj = new UcDropdownListObj();
  isDllAddressTypeReady: boolean = false;
  isDllCopyAddressFromReady: boolean = false;
  isAddrObjReady: boolean = false;
  HouseOwnershipName: string = '-';

  AddressForm = this.fb.group({
    MrCustAddrTypeCode: [],
    CopyAddrFrom: []
  })

  listAddrRequiredOwnership: Array<string> = new Array();

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private addressService: AddressService) { }

  async ngOnInit() {
    await this.getAddrTypeOwnershipRequired();
    this.AddrObj = new AddrObj();
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.showSubsection = false;
    this.inputAddressObj.showOwnership = true;
    this.inputAddressObj.showPhn3 = false;
    if (this.MrCustTypeCode === CommonConstant.CustTypeCompany) {
      this.inputAddressObj.requiredPhn1 = true;
    }
    this.isUcAddressReady = true;

    this.dllCopyAddressFromObj.ddlType = UcDropdownListConstant.DDL_TYPE_BLANK;
    this.dllCopyAddressFromObj.customKey = "AppCustAddrId";
    this.dllCopyAddressFromObj.customValue = "MrCustAddrTypeDescr";

    // let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCustAddrType, MappingCode: this.InputObj.MrCustTypeCode == CommonConstant.CustTypePersonal ? CommonConstant.CustTypePersonal : CommonConstant.CustTypeCompany };
    // await this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, tempReq).toPromise().then(
    //   async (response) => {
    //     let tempAddressType = response[CommonConstant.ReturnObj];
    //     let filterTempAddr = tempAddressType.filter(x => x.Key != CommonConstant.AddrTypeCompany && x.Key != CommonConstant.AddrTypeEmergency);
    //     this.AddressTypeObj = filterTempAddr;
    //     this.AddressTypeObj = await this.FilterAddr(this.AddressTypeObj);
    //     this.AddressForm.patchValue({
    //       MrCustAddrTypeCode: this.AddressTypeObj[0].Key
    //     })
    //     await this.LoadAddrForCopy();
    //     // this.ResetForm();
    //     this.isDllAddressTypeReady = true;
    //   }
    // );

    if (this.InputObj.LtkmCustAddrId != 0) {
      // await this.http.post<LtkmCustAddrObj>(URLConstant.GetLtkmCustAddrByLtkmCustAddrId, { Id: this.InputObj.LtkmCustAddrId }).toPromise().then(
      //   (response) => {
      //     this.AddrObj = response;
      //     this.AddressForm.patchValue({ MrCustAddrTypeCode: response.MrCustAddrTypeCode })
      //     this.LtkmCustAddrObj.MrCustAddrTypeCode = response.MrCustAddrTypeCode;
      //     this.LtkmCustAddrObj.RowVersion = response.RowVersion;
      //     this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
      //     this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
      //     this.inputAddressObj.default = this.AddrObj;
      //     this.isAddrObjReady = true;
      //   }
      // );

      this.AddrObj = this.InputObj.InputedAddr;
      this.AddressForm.patchValue({ MrCustAddrTypeCode: this.InputObj.InputedAddr.MrCustAddrTypeCode })
      this.LtkmCustAddrObj.MrCustAddrTypeCode = this.InputObj.InputedAddr.MrCustAddrTypeCode;
      this.LtkmCustAddrObj.RowVersion = this.InputObj.InputedAddr.RowVersion;
      this.inputAddressObj.inputField.inputLookupObj.nameSelect = this.InputObj.InputedAddr.Zipcode;
      this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: this.InputObj.InputedAddr.Zipcode };
      this.inputAddressObj.default = this.AddrObj;
      this.isAddrObjReady = true;
    }
    else {
      this.isAddrObjReady = true;
    }
    await this.setOwnership(this.AddressForm.controls.MrCustAddrTypeCode.value);
  }

  async FilterAddr(listAddr: Array<KeyValueObj>): Promise<Array<KeyValueObj>>{
    await this.http.post(URLConstant.GetGeneralSettingByCode, { Code: CommonConstant.GSCodeFilterAddr }).toPromise().then(
      (result: GeneralSettingObj) => {
        if (result.GsValue) {
          let listAddrToFilter: Array<string> = result.GsValue.split(';');
          for (let index = 0; index < listAddrToFilter.length; index++) {
            const element = listAddrToFilter[index];
            let idxFound = listAddr.findIndex(x => x.Key == element);
            if (idxFound >= 0) listAddr.splice(idxFound, 1);
          }
        }
      }
    );
    return listAddr;
  }

  async getEvent(event){
    await this.setOwnership(event.target.value);
  }

  async getAddrTypeOwnershipRequired(){
    this.listAddrRequiredOwnership = await this.addressService.GetListAddrTypeOwnershipMandatory();
  }

  async setOwnership(MrCustAddrTypeCode: string) {
    if(this.listAddrRequiredOwnership.find(addrType => addrType == MrCustAddrTypeCode)){
      this.inputAddressObj.requiredOwnership = true;
      return
    }
    this.inputAddressObj.requiredOwnership = false;
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

  // async LoadAddrForCopy() {
  //   await this.http.post<Array<LtkmCustAddrObj>>(URLConstant.GetListAppCustAddrDataForCopyByAppCustId, { Id: this.InputObj.LtkmCustId }).toPromise().then(
  //     (response) => {
  //       this.copyAddressFromObj = response[CommonConstant.ReturnObj];
  //       this.AddressForm.patchValue({ CopyAddrFrom: this.copyAddressFromObj[0]['AppCustAddrId'] });
  //       this.isDllCopyAddressFromReady = true;
  //     }
  //   );
  // }

  // CopyAddress() {
  //   if (this.copyAddressFromObj.length < 1) {
  //     return
  //   }

  //   this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, { Id: this.AddressForm.controls.CopyAddrFrom.value }).subscribe(
  //     (response) => {
  //       this.AddrObj.Addr = response["Addr"];
  //       this.AddrObj.AreaCode1 = response["AreaCode1"];
  //       this.AddrObj.AreaCode2 = response["AreaCode2"];
  //       this.AddrObj.AreaCode3 = response["AreaCode3"];
  //       this.AddrObj.AreaCode4 = response["AreaCode4"];
  //       this.AddrObj.City = response["City"];
  //       this.AddrObj.Fax = response["Fax"];
  //       this.AddrObj.FaxArea = response["FaxArea"];
  //       this.AddrObj.Phn1 = response["Phn1"];
  //       this.AddrObj.Phn2 = response["Phn2"];
  //       this.AddrObj.Phn3 = response["Phn3"];
  //       this.AddrObj.PhnArea1 = response["PhnArea1"];
  //       this.AddrObj.PhnArea2 = response["PhnArea2"];
  //       this.AddrObj.PhnArea3 = response["PhnArea3"];
  //       this.AddrObj.PhnExt1 = response["PhnExt1"];
  //       this.AddrObj.PhnExt2 = response["PhnExt2"];
  //       this.AddrObj.PhnExt3 = response["PhnExt3"];
  //       this.AddrObj.MrHouseOwnershipCode = response["MrBuildingOwnershipCode"];

  //       this.inputAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
  //       this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
  //       this.inputAddressObj.default = this.AddrObj;
  //     }
  //   );
  // }

  Cancel() {
    this.OutputTab.emit({ IsDetail: false, CustAddress: this.LtkmCustAddrObj, ListAddress: this.InputObj.ListInputedAddr, Save: false})
  }

  async SaveForm() {

    let Flag = false;

    if (this.InputObj.Mode == "Add") {
      if (this.InputObj.ListInputedAddr.find(x => x.MrCustAddrTypeCode == this.AddressForm.controls.MrCustAddrTypeCode.value)) {
        let ErrorOutput = this.AddressTypeObj.find(x => x.Key == this.AddressForm.controls.MrCustAddrTypeCode.value);
        this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Address")
        Flag = true;
      }
    }
    else if (this.InputObj.Mode == "Edit") {
      if (this.AddressForm.controls.MrCustAddrTypeCode.value != this.LtkmCustAddrObj.MrCustAddrTypeCode && this.InputObj.ListInputedAddr.find(x => x.MrCustAddrTypeCode == this.AddressForm.controls.MrCustAddrTypeCode.value)) {
        let ErrorOutput = this.AddressTypeObj.find(x => x.Key == this.AddressForm.controls.MrCustAddrTypeCode.value);
        this.toastr.warningMessage("There's Already " + ErrorOutput.Value + " Address")
        Flag = true
      }
    }

    if (!Flag) {

      // if (this.InputObj.Mode == "Add") {
      //   this.http.post(URLConstant.AddAppCustAddr, this.LtkmCustAddrObj).toPromise().then(
      //     (response) => {
      //       this.toastr.successMessage(response["message"]);
      //       this.OutputTab.emit({ IsDetail: false })
      //     },
      //     (error) => { }
      //   );
      // } else {
      //   this.http.post(URLConstant.EditAppCustAddr, this.LtkmCustAddrObj).toPromise().then(
      //     (response) => {
      //       this.toastr.successMessage(response["message"]);
      //       this.OutputTab.emit({ IsDetail: false })
      //     },
      //     (error) => { }
      //   );
      // }
      await this.GetAddress();
    }
  }

  async GetAddress(){
    this.http
      .post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeBuildingOwnership, MasterCode: this.AddressForm.controls["Address"]["controls"].MrHouseOwnershipCode.value
      })
      .toPromise().then((response) => {
        if(response["Descr"] != null || response["Descr"] != ""){this.HouseOwnershipName = response["Descr"];}
        this.LtkmCustAddrObj.LtkmCustAddrId = this.InputObj.LtkmCustAddrId;
        this.LtkmCustAddrObj.MrCustAddrTypeCode = this.AddressForm.controls.MrCustAddrTypeCode.value;
        this.LtkmCustAddrObj.CustAddrTypeName = this.InputObj.InputedAddr.CustAddrTypeName;
        this.LtkmCustAddrObj.LtkmCustId = this.InputObj.LtkmCustId;
        this.LtkmCustAddrObj.MrHouseOwnershipCode = this.AddressForm.controls["Address"]["controls"].MrHouseOwnershipCode.value;
        this.LtkmCustAddrObj.Addr = this.AddressForm.controls["Address"]["controls"].Addr.value;
        this.LtkmCustAddrObj.AreaCode1 = this.AddressForm.controls["Address"]["controls"].AreaCode1.value;
        this.LtkmCustAddrObj.AreaCode2 = this.AddressForm.controls["Address"]["controls"].AreaCode2.value;
        this.LtkmCustAddrObj.AreaCode3 = this.AddressForm.controls["Address"]["controls"].AreaCode3.value;
        this.LtkmCustAddrObj.AreaCode4 = this.AddressForm.controls["Address"]["controls"].AreaCode4.value;
        this.LtkmCustAddrObj.City = this.AddressForm.controls["Address"]["controls"].City.value;
        this.LtkmCustAddrObj.Zipcode = this.AddressForm.controls["AddressZipcode"]["value"].value;
        this.LtkmCustAddrObj.SubZipcode = this.AddressForm.controls["Address"]["controls"].SubZipcode.value;
        this.LtkmCustAddrObj.PhnArea1 = this.AddressForm.controls["Address"]["controls"].PhnArea1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea1.value;
        this.LtkmCustAddrObj.Phn1 = this.AddressForm.controls["Address"]["controls"].Phn1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn1.value;
        this.LtkmCustAddrObj.PhnExt1 = this.AddressForm.controls["Address"]["controls"].PhnExt1.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt1.value;
        this.LtkmCustAddrObj.PhnArea2 = this.AddressForm.controls["Address"]["controls"].PhnArea2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea2.value;
        this.LtkmCustAddrObj.Phn2 = this.AddressForm.controls["Address"]["controls"].Phn2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn2.value;
        this.LtkmCustAddrObj.PhnExt2 = this.AddressForm.controls["Address"]["controls"].PhnExt2.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt2.value;
        this.LtkmCustAddrObj.PhnArea3 = this.AddressForm.controls["Address"]["controls"].PhnArea3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnArea3.value;
        this.LtkmCustAddrObj.Phn3 = this.AddressForm.controls["Address"]["controls"].Phn3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].Phn3.value;
        this.LtkmCustAddrObj.PhnExt3 = this.AddressForm.controls["Address"]["controls"].PhnExt3.value == null ? "" : this.AddressForm.controls["Address"]["controls"].PhnExt3.value;
        this.LtkmCustAddrObj.FaxArea = this.AddressForm.controls["Address"]["controls"].FaxArea.value;
        this.LtkmCustAddrObj.Fax = this.AddressForm.controls["Address"]["controls"].Fax.value;
        this.LtkmCustAddrObj.FullAddr = this.LtkmCustAddrObj.Addr  + " RT/RW " + this.LtkmCustAddrObj.AreaCode4 + "/"
          + this.LtkmCustAddrObj.AreaCode3 + " " + this.LtkmCustAddrObj.AreaCode1 + " " + this.LtkmCustAddrObj.AreaCode2 + " "
          + this.LtkmCustAddrObj.City + " " + this.LtkmCustAddrObj.Zipcode;
        this.LtkmCustAddrObj.PhoneNo = this.LtkmCustAddrObj.PhnArea1 + " - " + this.LtkmCustAddrObj.Phn1 + " - " + this.LtkmCustAddrObj.PhnExt1;
        this.LtkmCustAddrObj.PhoneNo2 = this.LtkmCustAddrObj.PhnArea2 + " - " + this.LtkmCustAddrObj.Phn2 + " - " + this.LtkmCustAddrObj.PhnExt2;
        this.LtkmCustAddrObj.HouseOwnershipName = this.HouseOwnershipName;
        this.OutputTab.emit({ IsDetail: false, CustAddress: this.LtkmCustAddrObj, ListAddress: this.InputObj.ListInputedAddr, Save: true});
      });
  }
}
