import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustEmrgncCnctObj } from 'app/shared/model/AppCustEmrgncCnctObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-emergency-contact-tab',
  templateUrl: './emergency-contact-tab.component.html',
  styleUrls: ['./emergency-contact-tab.component.scss']
})
export class EmergencyContactTabComponent implements OnInit {

  @Input() appId: number;
  @Input() AppCustId: number;
  @Input() isMarried: boolean;
  isUcAddressReady: boolean;
  isExisting: boolean = false;
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  InputUcAddressObj: InputAddressObj = new InputAddressObj();
  InputFieldUcAddressObj: InputFieldObj = new InputFieldObj();
  UcAddrObj: AddrObj = new AddrObj();
  IdTypeObj: Array<KeyValueObj> = new Array();
  GenderObj: Array<KeyValueObj> = new Array();
  MrCustRelationshipObj: Array<KeyValueObj> = new Array();
  ArrAddCrit: Array<CriteriaObj> = new Array();
  copyAddressFromObj: any;
  appCustEmrgncCntctObj: AppCustEmrgncCnctObj = new AppCustEmrgncCnctObj();

  EmergencyContactForm = this.fb.group({
    MrIdTypeCode: [''],
    MrGenderCode: ['', Validators.required],
    IdNo: [''],
    BirthPlace: [''],
    IdExpiredDt: [''],
    BirthDt: [''],
    MrCustRelationship: ['', Validators.required],
    MobilePhnNo1: ['', Validators.required],
    MobilePhnNo2: [''],
    Email1: [''],
    CopyAddrFrom: ['']
  })

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
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
  }

  setDropdown() {
    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["ReserveField2"] == CommonConstant.DEFAULT);
          this.EmergencyContactForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        this.clearExpDt();
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.EmergencyContactForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).subscribe(
      async (response) => {
        this.MrCustRelationshipObj = response[CommonConstant.ReturnObj];
        if (!this.isMarried) {
          await this.removeSpouse();
        }
        await this.EmergencyContactForm.patchValue({
          MrCustRelationship: this.MrCustRelationshipObj[0].Key
        });
      }
    );

    this.http.post(URLConstant.GetListAppCustAddrData, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.copyAddressFromObj = response;
        this.EmergencyContactForm.patchValue({ CopyAddrFrom: response[0]['AppCustAddrId'] });
      });
  }

  clearExpDt() {
    this.EmergencyContactForm.controls.IdExpiredDt.reset();
  }

  removeSpouse() {
    let SpouseRelationship = this.MrCustRelationshipObj[0]
    if (!this.isMarried && SpouseRelationship.Key == "SPOUSE") {
      this.MrCustRelationshipObj = this.MrCustRelationshipObj.slice(1, this.MrCustRelationshipObj.length);
    }
  }

  DisableInput() {
    this.isExisting = true;
    this.InputUcAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.InputUcAddressObj.inputField.inputLookupObj.isReadonly = true;
    this.InputUcAddressObj.inputField.inputLookupObj.isDisable = true;
  }

  copyCustomerEvent(event) {
    this.DisableInput();
    this.http.post(URLConstant.GetCustPersonalForCopyByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        if (response["CustObj"] != undefined) {
          this.EmergencyContactForm.patchValue({
            MrCustTypeCode: response["CustObj"].MrCustTypeCode,
            CustNo: response["CustObj"].CustNo,
            MrIdTypeCode: response["CustObj"].MrIdTypeCode,
            IdNo: response["CustObj"].IdNo,
            IdExpiredDt: formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US'),
          });
          this.InputLookupCustObj.nameSelect = response["CustObj"].CustName;
          this.InputLookupCustObj.jsonSelect = { CustName: response["CustObj"].CustName };
        }

        if (response["CustPersonalObj"] != undefined) {
          this.EmergencyContactForm.patchValue({
            MrGenderCode: response["CustPersonalObj"].MrGenderCode,
            BirthPlace: response["CustPersonalObj"].BirthPlace,
            BirthDt: formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US'),
            MobilePhnNo1: response["CustPersonalObj"].MobilePhnNo1,
            MobilePhnNo2: response["CustPersonalObj"].MobilePhnNo2,
            Email1: response["CustPersonalObj"].Email1,
          });
        }

        if (response["CustAddrLegalObj"] != undefined) {
          this.UcAddrObj.Addr = response["CustAddrLegalObj"].Addr;
          this.UcAddrObj.AreaCode1 = response["CustAddrLegalObj"].AreaCode1;
          this.UcAddrObj.AreaCode2 = response["CustAddrLegalObj"].AreaCode2;
          this.UcAddrObj.AreaCode3 = response["CustAddrLegalObj"].AreaCode3;
          this.UcAddrObj.AreaCode4 = response["CustAddrLegalObj"].AreaCode4;
          this.UcAddrObj.City = response["CustAddrLegalObj"].City;
          this.UcAddrObj.Phn1 = response["CustAddrLegalObj"].Phn1;
          this.UcAddrObj.Phn2 = response["CustAddrLegalObj"].Phn2;
          this.UcAddrObj.Phn3 = response["CustAddrLegalObj"].Phn3;
          this.UcAddrObj.PhnArea1 = response["CustAddrLegalObj"].PhnArea1;
          this.UcAddrObj.PhnArea2 = response["CustAddrLegalObj"].PhnArea2;
          this.UcAddrObj.PhnArea3 = response["CustAddrLegalObj"].PhnArea3;
          this.UcAddrObj.PhnExt1 = response["CustAddrLegalObj"].PhnExt1;
          this.UcAddrObj.PhnExt2 = response["CustAddrLegalObj"].PhnExt2;
          this.UcAddrObj.PhnExt3 = response["CustAddrLegalObj"].PhnExt3;

          this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response["CustAddrLegalObj"].Zipcode;
          this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["CustAddrLegalObj"].Zipcode };
          this.InputUcAddressObj.default = this.UcAddrObj;
        }
      });
  }

  CopyAddress() {
    if (this.copyAddressFromObj.length < 1) {
      return
    }

    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, { AppCustAddrId: this.EmergencyContactForm.controls.CopyAddrFrom.value }).subscribe(
      (response) => {
        this.UcAddrObj.Addr = response["Addr"];
        this.UcAddrObj.AreaCode1 = response["AreaCode1"];
        this.UcAddrObj.AreaCode2 = response["AreaCode2"];
        this.UcAddrObj.AreaCode3 = response["AreaCode3"];
        this.UcAddrObj.AreaCode4 = response["AreaCode4"];
        this.UcAddrObj.City = response["City"];
        this.UcAddrObj.Phn1 = response["Phn1"];
        this.UcAddrObj.Phn2 = response["Phn2"];
        this.UcAddrObj.PhnArea1 = response["PhnArea1"];
        this.UcAddrObj.PhnArea2 = response["PhnArea2"];
        this.UcAddrObj.PhnExt1 = response["PhnExt1"];
        this.UcAddrObj.PhnExt2 = response["PhnExt2"];

        this.InputUcAddressObj.inputField.inputLookupObj.nameSelect = response["Zipcode"];
        this.InputUcAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["Zipcode"] };
        this.InputUcAddressObj.default = this.UcAddrObj;
      });
  }

  SaveForm() {
    this.appCustEmrgncCntctObj.AppCustId = this.AppCustId;
    this.appCustEmrgncCntctObj.MrIdTypeCode = this.EmergencyContactForm.controls.MrIdTypeCode.value;
    this.appCustEmrgncCntctObj.MrGenderCode = this.EmergencyContactForm.controls.MrGenderCode.value;
    this.appCustEmrgncCntctObj.IdNo = this.EmergencyContactForm.controls.IdNo.value;
    this.appCustEmrgncCntctObj.BirthPlace = this.EmergencyContactForm.controls.BirthPlace.value;
    this.appCustEmrgncCntctObj.IdExpiredDt = this.EmergencyContactForm.controls.IdExpiredDt.value;
    this.appCustEmrgncCntctObj.BirthDt = this.EmergencyContactForm.controls.BirthDt.value;
    this.appCustEmrgncCntctObj.MrCustRelationship = this.EmergencyContactForm.controls.MrCustRelationship.value;
    this.appCustEmrgncCntctObj.MobilePhnNo1 = this.EmergencyContactForm.controls.MobilePhnNo1.value;
    this.appCustEmrgncCntctObj.MobilePhnNo2 = this.EmergencyContactForm.controls.MobilePhnNo2.value;
    this.appCustEmrgncCntctObj.Email = this.EmergencyContactForm.controls.Email1.value;
    this.appCustEmrgncCntctObj.Addr = this.UcAddrObj.Addr;
    this.appCustEmrgncCntctObj.AreaCode1 = this.UcAddrObj.AreaCode1;
    this.appCustEmrgncCntctObj.AreaCode2 = this.UcAddrObj.AreaCode2;
    this.appCustEmrgncCntctObj.AreaCode3 = this.UcAddrObj.AreaCode3;
    this.appCustEmrgncCntctObj.AreaCode4 = this.UcAddrObj.AreaCode4;
    this.appCustEmrgncCntctObj.City = this.UcAddrObj.City;
    this.appCustEmrgncCntctObj.Phn1 = this.UcAddrObj.Phn1;
    this.appCustEmrgncCntctObj.Phn2 = this.UcAddrObj.Phn2;
    this.appCustEmrgncCntctObj.Phn3 = this.UcAddrObj.Phn3;
    this.appCustEmrgncCntctObj.PhnArea1 = this.UcAddrObj.PhnArea1;
    this.appCustEmrgncCntctObj.PhnArea2 = this.UcAddrObj.PhnArea2;
    this.appCustEmrgncCntctObj.PhnArea3 = this.UcAddrObj.PhnArea3;
    this.appCustEmrgncCntctObj.PhnExt1 = this.UcAddrObj.PhnExt1;
    this.appCustEmrgncCntctObj.PhnExt2 = this.UcAddrObj.PhnExt2;
    this.appCustEmrgncCntctObj.PhnExt3 = this.UcAddrObj.PhnExt3;
    this.appCustEmrgncCntctObj.Zipcode = this.EmergencyContactForm.controls["AddressZipcode"]["controls"].value.value;

    console.log(this.appCustEmrgncCntctObj);
  }
}
