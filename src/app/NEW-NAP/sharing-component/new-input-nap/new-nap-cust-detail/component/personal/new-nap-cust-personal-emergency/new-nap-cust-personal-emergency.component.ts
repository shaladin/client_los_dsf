import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustEmrgncCntctObj } from 'app/shared/model/AppCustEmrgncCntctObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustPersonalContactPersonObj } from 'app/shared/model/CustPersonalContactPersonObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { ResponseCustPersonalForCopyObj } from 'app/shared/model/ResponseCustPersonalForCopyObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-new-nap-cust-personal-emergency',
  templateUrl: './new-nap-cust-personal-emergency.component.html',
  styles: []
})
export class NewNapCustPersonalEmergencyComponent implements OnInit {
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() IsMarried: boolean;
  @Input() IsEmergencySubmitted: boolean;
  @Input() CopyAddressFromObj: Array<AppCustAddrObj>;
  isUcAddressReady: boolean;
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  InputUcAddressObj: InputAddressObj = new InputAddressObj();
  InputFieldUcAddressObj: InputFieldObj = new InputFieldObj();
  UcAddrObj: AddrObj = new AddrObj();
  IdTypeObj: Array<KeyValueObj> = new Array();
  GenderObj: Array<KeyValueObj> = new Array();
  MrCustRelationshipObj: Array<KeyValueObj> = new Array();
  MrCustRelationshipSpouseObj: KeyValueObj = new KeyValueObj();
  ArrAddCrit: Array<CriteriaObj> = new Array();
  appCustEmrgncCntctObj: AppCustEmrgncCntctObj = new AppCustEmrgncCntctObj();
  BusinessDt: Date;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) {
    this.IsEmergencySubmitted = false;
   }

  ngOnInit() {
    let UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDt = UserAccess.BusinessDt;

    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.addCritInput = new Array();
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;
    this.InputLookupCustObj.nameSelect = "";

    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = CommonConstant.CustTypePersonal;
    this.ArrAddCrit.push(critObj);
    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;
    this.InputLookupCustObj.isReady = true;

    this.InputUcAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.InputUcAddressObj.showSubsection = false;
    this.InputUcAddressObj.showFax = false;
    this.isUcAddressReady = true;

    this.setDropdown();
    if(this.AppCustId && this.AppCustId > 0){
      this.getData();
    }
  }

  setDropdown() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.ParentForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
          this.ChangeIdType(this.IdTypeObj[idxDefault]["MasterCode"]);
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.ParentForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).subscribe(
      async (response) => {
        this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
        this.MrCustRelationshipSpouseObj = this.MrCustRelationshipObj.find(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
        this.CheckIsMarried(this.IsMarried);
        
        this.ParentForm.patchValue({
          MrCustRelationshipCode: this.MrCustRelationshipObj[0].Key
        });
      }
    );

    if(this.CopyAddressFromObj != null && this.CopyAddressFromObj.length > 0){
      this.ParentForm.patchValue({ CopyAddrFrom: this.CopyAddressFromObj[0].MrCustAddrTypeCode });
    }
  }

  getData(){
    this.http.post<AppCustEmrgncCntctObj>(URLConstant.GetAppCustEmrgncCntctByAppCustId, {AppCustId: this.AppCustId}).subscribe(
      (response) => {
        if(response.AppCustEmrgncCntctId != 0){
          this.ParentForm.patchValue({
            MrIdTypeCode: response.MrIdTypeCode,
            MrGenderCode: response.MrGenderCode,
            IdNo: response.IdNo,
            BirthPlace: response.BirthPlace,
            IdExpiredDt: response.IdExpiredDt != null ? formatDate(response.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
            BirthDt: formatDate(response.BirthDt, 'yyyy-MM-dd', 'en-US'),
            MrCustRelationshipCode: response.MrCustRelationshipCode,
            MobilePhnNo1: response.MobilePhnNo1,
            MobilePhnNo2: response.MobilePhnNo2,
            Email: response.Email,
            RowVersion: response.RowVersion
          })
        }        
      this.InputLookupCustObj.nameSelect = response["ContactPersonName"];
      this.InputLookupCustObj.jsonSelect = { CustName: response["ContactPersonName"] };

      this.UcAddrObj.Addr = response["Addr"];
      this.UcAddrObj.AreaCode1 = response["AreaCode1"];
      this.UcAddrObj.AreaCode2 = response["AreaCode2"];
      this.UcAddrObj.AreaCode3 = response["AreaCode3"];
      this.UcAddrObj.AreaCode4 = response["AreaCode4"];
      this.UcAddrObj.City = response["City"];
      this.UcAddrObj.Fax = response["Fax"];
      this.UcAddrObj.FaxArea = response["FaxArea"];
      this.UcAddrObj.Phn1 = response["Phn1"];
      this.UcAddrObj.Phn2 = response["Phn2"];
      this.UcAddrObj.Phn3 = response["Phn3"];
      this.UcAddrObj.PhnArea1 = response["PhnArea1"];
      this.UcAddrObj.PhnArea2 = response["PhnArea2"];
      this.UcAddrObj.PhnArea3 = response["PhnArea3"];
      this.UcAddrObj.PhnExt1 = response["PhnExt1"];
      this.UcAddrObj.PhnExt2 = response["PhnExt2"];
      this.UcAddrObj.PhnExt3 = response["PhnExt3"];

      this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
      this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"]};
      this.InputUcAddressObj.default = this.UcAddrObj;
      },
      error => {
        console.log(error);
      });
  }

  CopyCustomerEmergency(custPersonalContactPersonObj: CustPersonalContactPersonObj){
    if(custPersonalContactPersonObj.CustPersonalContactPersonId != 0){
      this.ParentForm.patchValue({
        MrIdTypeCode: custPersonalContactPersonObj.MrIdTypeCode,
        MrGenderCode: custPersonalContactPersonObj.MrGenderCode,
        IdNo: custPersonalContactPersonObj.IdNo,
        BirthPlace: custPersonalContactPersonObj.BirthPlace,
        IdExpiredDt: custPersonalContactPersonObj.IdExpiredDt != null ? formatDate(custPersonalContactPersonObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
        BirthDt: formatDate(custPersonalContactPersonObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
        MrCustRelationshipCode: custPersonalContactPersonObj.MrCustRelationshipCode,
        MobilePhnNo1: custPersonalContactPersonObj.MobilePhnNo1,
        MobilePhnNo2: custPersonalContactPersonObj.MobilePhnNo2,
        Email: custPersonalContactPersonObj.Email
      })
    }
  this.ChangeIdType(custPersonalContactPersonObj.MrIdTypeCode);
  this.InputLookupCustObj.nameSelect = custPersonalContactPersonObj["ContactPersonName"];
  this.InputLookupCustObj.jsonSelect = { CustName: custPersonalContactPersonObj["ContactPersonName"] };

  this.UcAddrObj.Addr = custPersonalContactPersonObj["Addr"];
  this.UcAddrObj.AreaCode1 = custPersonalContactPersonObj["AreaCode1"];
  this.UcAddrObj.AreaCode2 = custPersonalContactPersonObj["AreaCode2"];
  this.UcAddrObj.AreaCode3 = custPersonalContactPersonObj["AreaCode3"];
  this.UcAddrObj.AreaCode4 = custPersonalContactPersonObj["AreaCode4"];
  this.UcAddrObj.City = custPersonalContactPersonObj["City"];
  this.UcAddrObj.Fax = custPersonalContactPersonObj["Fax"];
  this.UcAddrObj.FaxArea = custPersonalContactPersonObj["FaxArea"];
  this.UcAddrObj.Phn1 = custPersonalContactPersonObj["Phn1"];
  this.UcAddrObj.Phn2 = custPersonalContactPersonObj["Phn2"];
  this.UcAddrObj.Phn3 = custPersonalContactPersonObj["Phn3"];
  this.UcAddrObj.PhnArea1 = custPersonalContactPersonObj["PhnArea1"];
  this.UcAddrObj.PhnArea2 = custPersonalContactPersonObj["PhnArea2"];
  this.UcAddrObj.PhnArea3 = custPersonalContactPersonObj["PhnArea3"];
  this.UcAddrObj.PhnExt1 = custPersonalContactPersonObj["PhnExt1"];
  this.UcAddrObj.PhnExt2 = custPersonalContactPersonObj["PhnExt2"];
  this.UcAddrObj.PhnExt3 = custPersonalContactPersonObj["PhnExt3"];

  this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = custPersonalContactPersonObj["Zipcode"];
  this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: custPersonalContactPersonObj["Zipcode"]};
  this.InputUcAddressObj.default = this.UcAddrObj;
  }

  ChangeIdType(IdType: string){
    this.ParentForm.controls.IdExpiredDt.patchValue("");

    if(IdType == "KITAS" || IdType == "SIM"){
      this.ParentForm.controls.IdExpiredDt.setValidators([Validators.required]);
    }else{
      this.ParentForm.controls.IdExpiredDt.clearValidators();
    }

    this.ParentForm.controls.IdExpiredDt.updateValueAndValidity();
  }

  CheckIsMarried(isMarried: boolean) {
    if(!isMarried){
      let idxSpouse = this.MrCustRelationshipObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
      this.MrCustRelationshipObj.splice(idxSpouse, 1)
    }else{
      let idxSpouse = this.MrCustRelationshipObj.findIndex(x => x.Key == CommonConstant.MasteCodeRelationshipSpouse);
      if(idxSpouse == -1){
        this.MrCustRelationshipObj.push(this.MrCustRelationshipSpouseObj);
      }
    }
  }

  copyCustomerEvent(event) {
    this.http.post<ResponseCustPersonalForCopyObj>(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        if (response.CustObj != undefined) {
          this.ParentForm.patchValue({
            ContactPersonName: response.CustObj.CustName,
            ContactPersonCustNo: response.CustObj.CustNo,
            MrCustTypeCode: response.CustObj.MrCustTypeCode,
            MrIdTypeCode: response.CustObj.MrIdTypeCode,
            IdNo: response.CustObj.IdNo,
            IdExpiredDt: response.CustObj.IdExpiredDt != null ? formatDate(response.CustObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
          });
          this.InputLookupCustObj.nameSelect = response.CustObj.CustName;
          this.InputLookupCustObj.jsonSelect = { CustName: response.CustObj.CustName };
        }
        this.ChangeIdType(response.CustObj.MrIdTypeCode);
        
        if (response.CustPersonalObj != undefined) {
          this.ParentForm.patchValue({
            MrGenderCode: response.CustPersonalObj.MrGenderCode,
            BirthPlace: response.CustPersonalObj.BirthPlace,
            BirthDt: response.CustPersonalObj.BirthDt != null ? formatDate(response.CustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MobilePhnNo1: response.CustPersonalObj.MobilePhnNo1,
            MobilePhnNo2: response.CustPersonalObj.MobilePhnNo2,
            Email: response.CustPersonalObj.Email1,
          });
        }

        if (response.CustAddrObjs.length > 0) {
          var custAddrLegalObj = response.CustAddrObjs.find(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeLegal);
          this.UcAddrObj.Addr = custAddrLegalObj.Addr;
          this.UcAddrObj.AreaCode1 = custAddrLegalObj.AreaCode1;
          this.UcAddrObj.AreaCode2 = custAddrLegalObj.AreaCode2;
          this.UcAddrObj.AreaCode3 = custAddrLegalObj.AreaCode3;
          this.UcAddrObj.AreaCode4 = custAddrLegalObj.AreaCode4;
          this.UcAddrObj.City = custAddrLegalObj.City;
          this.UcAddrObj.Phn1 = custAddrLegalObj.Phn1;
          this.UcAddrObj.Phn2 = custAddrLegalObj.Phn2;
          this.UcAddrObj.Phn3 = custAddrLegalObj.Phn3;
          this.UcAddrObj.PhnArea1 = custAddrLegalObj.PhnArea1;
          this.UcAddrObj.PhnArea2 = custAddrLegalObj.PhnArea2;
          this.UcAddrObj.PhnArea3 = custAddrLegalObj.PhnArea3;
          this.UcAddrObj.PhnExt1 = custAddrLegalObj.PhnExt1;
          this.UcAddrObj.PhnExt2 = custAddrLegalObj.PhnExt2;
          this.UcAddrObj.PhnExt3 = custAddrLegalObj.PhnExt3;

          this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = custAddrLegalObj.Zipcode;
          this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: custAddrLegalObj.Zipcode };
          this.InputUcAddressObj.default = this.UcAddrObj;
        }
      });
  }

  CopyAddress() {
    if (this.CopyAddressFromObj.length < 1) {
      return
    }

    var copiedAddr = this.CopyAddressFromObj.find(x => x.MrCustAddrTypeCode == this.ParentForm.controls.CopyAddrFrom.value);

    this.UcAddrObj.Addr = copiedAddr["Addr"];
    this.UcAddrObj.AreaCode1 = copiedAddr["AreaCode1"];
    this.UcAddrObj.AreaCode2 = copiedAddr["AreaCode2"];
    this.UcAddrObj.AreaCode3 = copiedAddr["AreaCode3"];
    this.UcAddrObj.AreaCode4 = copiedAddr["AreaCode4"];
    this.UcAddrObj.City = copiedAddr["City"];
    this.UcAddrObj.Phn1 = copiedAddr["Phn1"];
    this.UcAddrObj.Phn2 = copiedAddr["Phn2"];
    this.UcAddrObj.PhnArea1 = copiedAddr["PhnArea1"];
    this.UcAddrObj.PhnArea2 = copiedAddr["PhnArea2"];
    this.UcAddrObj.PhnExt1 = copiedAddr["PhnExt1"];
    this.UcAddrObj.PhnExt2 = copiedAddr["PhnExt2"];

    this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = copiedAddr["Zipcode"];
    this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: copiedAddr["Zipcode"] };
    this.InputUcAddressObj.default = this.UcAddrObj;
  }
}
