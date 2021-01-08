import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompany/AppCustCompanyContactPersonObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-company-contact-info',
  templateUrl: './new-nap-cust-company-contact-info.component.html',
  styles: []
})
export class NewNapCustCompanyContactInfoComponent implements OnInit {
  @Input() ParentForm: FormGroup;
  @Input() AppCustId: number;
  @Input() IsContactInfoSubmitted: boolean;
  @Output() ResponseTempContactPerson: EventEmitter<any> = new EventEmitter<any>();
  inputAddressObjForCc: InputAddressObj;
  inputFieldCcObj: InputFieldObj = new InputFieldObj();
  CcAddrObj: AddrObj = new AddrObj();
  CcCustAddrObj: AppCustAddrObj;
  IsUcAddrReady: boolean = false;
  TempAppCustCompanyContactPersonObj: AppCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
  DictRefMaster: any = {};
  BusinessDate: Date;
  readonly MasterIdTypeCode: string = CommonConstant.RefMasterTypeCodeIdType;
  readonly MasterGenderCode: string = CommonConstant.RefMasterTypeCodeGender;
  readonly MasterJobPosCode: string = CommonConstant.RefMasterTypeCodeJobPosition;
  readonly MasterCustRelationCode: string = CommonConstant.RefMasterTypeCodeCustRelationship;
  readonly IdTypeNpwp: string = CommonConstant.MrIdTypeCodeNPWP;
  readonly IdTypeKitas: string = CommonConstant.MrIdTypeCodeKITAS;
  readonly IdTypeSim: string = CommonConstant.MrIdTypeCodeSIM;
  readonly InputAddressObjForCc_Identifier: string = "CcDataAddr";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService
  ) { 
    this.IsContactInfoSubmitted = false;
  }

  async ngOnInit() {
    let UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.BusinessDate = new Date(formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US'));

    this.SetAddrForm();
    await this.GetListActiveRefMaster(this.MasterGenderCode);
    await this.GetListActiveRefMaster(this.MasterIdTypeCode);
    await this.GetListActiveRefMaster(this.MasterJobPosCode);
    await this.GetListActiveRefMaster(this.MasterCustRelationCode);
    await this.GetAppCustCompanyContactPersonByAppCustId();
  }

  CopyCustCompanyContactPerson(contactInfoObj){
    this.ParentForm.patchValue({
      ContactPersonName: contactInfoObj.ContactPersonName,
      MrGenderCode: contactInfoObj.MrGenderCode,
      JobTitleName: contactInfoObj.JobTitleName,
      MrJobPositionCode: contactInfoObj.MrJobPositionCode,
      MrIdTypeCode: contactInfoObj.MrIdTypeCode,
      IdNo: contactInfoObj.IdNo,
      IdExpiredDt: contactInfoObj.IdExpiredDt,
      BirthPlace: contactInfoObj.BirthPlace,
      BirthDt: formatDate(contactInfoObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
      MrCustRelationshipCode: contactInfoObj.MrCustRelationshipCode,
      MobilePhnNo1: contactInfoObj.MobilePhnNo1,
      MobilePhnNo2: contactInfoObj.MobilePhnNo2,
      Email1: contactInfoObj.Email1,
      Email2: contactInfoObj.Email2,
      PhnArea1: contactInfoObj.PhnArea1,
      PhnArea2: contactInfoObj.PhnArea2,
      Phn1: contactInfoObj.Phn1,
      Phn2: contactInfoObj.Phn2,
      PhnExt1: contactInfoObj.PhnExt1,
      PhnExt2: contactInfoObj.PhnExt2,
    });
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    await this.http.post<any>(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": RefMasterTypeCode }).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response["ReturnObject"];
      }
    );
  }

  async GetAppCustCompanyContactPersonByAppCustId() {
    await this.http.post<AppCustCompanyContactPersonObj>(URLConstant.GetAppCustCompanyContactPersonByAppCustId, { "appCustId": this.AppCustId }).toPromise().then(
      (response) => {
        if (response.AppCustCompanyContactPersonId != 0) {
          this.TempAppCustCompanyContactPersonObj = response;
          this.ResponseTempContactPerson.emit(this.TempAppCustCompanyContactPersonObj);
          this.ParentForm.patchValue({
            ContactPersonName: response.ContactPersonName,
            MrGenderCode: response.MrGenderCode,
            JobTitleName: response.JobTitleName,
            MrJobPositionCode: response.MrJobPositionCode,
            MrIdTypeCode: response.MrIdTypeCode,
            IdNo: response.IdNo,
            IdExpiredDt: response.IdExpiredDt != null ? formatDate(response.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
            BirthPlace: response.BirthPlace,
            BirthDt: response.BirthDt != null ? formatDate(response.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MrCustRelationshipCode: response.MrCustRelationshipCode,
            MobilePhnNo1: response.MobilePhnNo1,
            MobilePhnNo2: response.MobilePhnNo2,
            Email1: response.Email1,
            Email2: response.Email2,
            PhnArea1: response.PhnArea1,
            PhnArea2: response.PhnArea2,
            Phn1: response.Phn1,
            Phn2: response.Phn2,
            PhnExt1: response.PhnExt1,
            PhnExt2: response.PhnExt2,
          });

          if (response.AppCustAddrObj != null) {
            this.inputFieldCcObj = new InputFieldObj();
            this.inputFieldCcObj.inputLookupObj = new InputLookupObj();

            this.CcAddrObj.Addr = response.AppCustAddrObj.Addr;
            this.CcAddrObj.PhnExt1 = response.AppCustAddrObj.PhnExt1;
            this.CcAddrObj.PhnExt2 = response.AppCustAddrObj.PhnExt2;
            this.CcAddrObj.Phn1 = response.AppCustAddrObj.Phn1;
            this.CcAddrObj.Phn2 = response.AppCustAddrObj.Phn2;
            this.CcAddrObj.PhnArea1 = response.AppCustAddrObj.PhnArea1;
            this.CcAddrObj.PhnArea2 = response.AppCustAddrObj.PhnArea2;
            this.CcAddrObj.Fax = response.AppCustAddrObj.Fax;
            this.CcAddrObj.FaxArea = response.AppCustAddrObj.FaxArea;
            this.CcAddrObj.AreaCode1 = response.AppCustAddrObj.AreaCode1;
            this.CcAddrObj.AreaCode2 = response.AppCustAddrObj.AreaCode2;
            this.CcAddrObj.AreaCode3 = response.AppCustAddrObj.AreaCode3;
            this.CcAddrObj.AreaCode4 = response.AppCustAddrObj.AreaCode4;
            this.CcAddrObj.City = response.AppCustAddrObj.City;
            this.CcAddrObj.SubZipcode = response.AppCustAddrObj.SubZipcode;

            this.inputFieldCcObj.inputLookupObj.nameSelect = response.AppCustAddrObj.Zipcode;
            this.inputFieldCcObj.inputLookupObj.jsonSelect = { Zipcode: response.AppCustAddrObj.Zipcode };
            this.inputAddressObjForCc.default = this.CcAddrObj;
            this.inputAddressObjForCc.inputField = this.inputFieldCcObj;
          }
          this.ChangeIdType(true);
        }
        this.IsUcAddrReady = true;
      }
    );
  }

  SetAddrForm() {
    this.inputAddressObjForCc = new InputAddressObj();
    this.inputAddressObjForCc.showSubsection = true;
    this.inputAddressObjForCc.showPhn3 = false;
  }

  ChangeIdType(FirstInit: boolean = false) {
    let IdTypeCode = this.ParentForm.get("MrIdTypeCode").value;
    if (IdTypeCode == this.IdTypeNpwp) {
      this.ParentForm.get("IdNo").setValidators(Validators.required);
    } else {
      this.ParentForm.get("IdNo").clearValidators();
    }
    this.ParentForm.get("IdNo").updateValueAndValidity();

    if (IdTypeCode == this.IdTypeKitas || IdTypeCode == this.IdTypeSim) {
      this.ParentForm.get("IdExpiredDt").setValidators(Validators.required);
    } else {
      this.ParentForm.get("IdExpiredDt").clearValidators();
    }
    if(!FirstInit) this.ParentForm.controls.IdExpiredDt.patchValue("");
    this.ParentForm.get("IdExpiredDt").updateValueAndValidity();
  }
}
