import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompany/AppCustCompanyContactPersonObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cc-contact-information-tab',
  templateUrl: './cc-contact-information-tab.component.html',
  styleUrls: ['./cc-contact-information-tab.component.scss']
})
export class CcContactInformationTabComponent implements OnInit {

  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  inputAddressObjForCc: InputAddressObj;
  inputFieldCcObj: InputFieldObj = new InputFieldObj();
  CcAddrObj: AddrObj = new AddrObj();
  CcCustAddrObj: AppCustAddrObj;
  IsUcAddrReady: boolean = false;
  TempAppCustCompanyContactPersonObj: AppCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
  DictRefMaster: any = {};
  readonly MasterIdTypeCode: string = CommonConstant.RefMasterTypeCodeIdType;
  readonly MasterGenderCode: string = CommonConstant.RefMasterTypeCodeGender;
  readonly MasterJobPosCode: string = CommonConstant.RefMasterTypeCodeJobPosition;
  readonly MasterCustRelationCode: string = CommonConstant.RefMasterTypeCodeCustRelationship;
  readonly InputAddressObjForCc_Identifier: string = "CcDataAddr";
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {

  }


  CcForm = this.fb.group({
    ContactPersonName: ['', Validators.required],
    MrGenderCode: ['', Validators.required],
    JobTitleName: ['', Validators.required],
    MrJobPositionCode: ['', Validators.required],
    MrIdTypeCode: [''],
    IdNo: [''],
    IdExpiredDt: [''],
    BirthPlace: [''],
    BirthDt: [''],
    MrCustRelationshipCode: [''],
    MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    MobilePhnNo2: ['', Validators.pattern("^[0-9]*$")],
    Email1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    Email2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    PhnArea1: ['', Validators.pattern("^[0-9]*$")],
    PhnArea2: ['', Validators.pattern("^[0-9]*$")],
    Phn1: ['', Validators.pattern("^[0-9]*$")],
    Phn2: ['', Validators.pattern("^[0-9]*$")],
    PhnExt1: ['', Validators.pattern("^[0-9]*$")],
    PhnExt2: ['', Validators.pattern("^[0-9]*$")],
  });

  async ngOnInit() {
    this.SetAddrForm();
    await this.GetListActiveRefMaster(this.MasterGenderCode);
    await this.GetListActiveRefMaster(this.MasterIdTypeCode);
    await this.GetListActiveRefMaster(this.MasterJobPosCode);
    await this.GetListActiveRefMaster(this.MasterCustRelationCode);
    await this.GetAppCustCompanyContactPersonByAppCustId();
    console.log(this.DictRefMaster);
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    await this.http.post<any>(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": RefMasterTypeCode }).toPromise().then(
      (response) => {
        // console.log(response);
        this.DictRefMaster[RefMasterTypeCode] = response["ReturnObject"];
      }
    );
  }

  async GetAppCustCompanyContactPersonByAppCustId() {
    await this.http.post<AppCustCompanyContactPersonObj>(URLConstant.GetAppCustCompanyContactPersonByAppCustId, { "appCustId": this.AppCustId }).toPromise().then(
      (response) => {
        console.log(response);
        if (response.AppCustCompanyContactPersonId != 0) {
          this.TempAppCustCompanyContactPersonObj = response;
          this.CcForm.patchValue({
            ContactPersonName: response.ContactPersonName,
            MrGenderCode: response.MrGenderCode,
            JobTitleName: response.JobTitleName,
            MrJobPositionCode: response.MrJobPositionCode,
            MrIdTypeCode: response.MrIdTypeCode,
            IdNo: response.IdNo,
            IdExpiredDt: response.IdExpiredDt,
            BirthPlace: response.BirthPlace,
            BirthDt: response.BirthDt,
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

  async SaveForm() {
    console.log("save");
    console.log(this.CcForm.getRawValue());
    var temp = this.CcForm.getRawValue();
    console.log(temp);
    await this.SetReqCcObj(temp);
    await this.SetReqAddrObj(temp);

    this.OutputTab.emit();
  }

  async SetReqAddrObj(obj: any) {
    var TempAddr = obj[this.InputAddressObjForCc_Identifier];
    var TempZipVal = obj[this.InputAddressObjForCc_Identifier + "Zipcode"];
    console.log(TempAddr);

    var ReqAddr: AppCustAddrObj = new AppCustAddrObj();
    ReqAddr.Phn1 = TempAddr.Phn1;
    ReqAddr.Phn2 = TempAddr.Phn2;
    ReqAddr.PhnArea1 = TempAddr.PhnArea1;
    ReqAddr.PhnArea2 = TempAddr.PhnArea2;
    ReqAddr.PhnExt1 = TempAddr.PhnExt1;
    ReqAddr.PhnExt2 = TempAddr.PhnExt2;
    ReqAddr.Addr = TempAddr.Addr;
    ReqAddr.AppCustId = this.AppCustId;
    ReqAddr.AreaCode1 = TempAddr.AreaCode1;
    ReqAddr.AreaCode2 = TempAddr.AreaCode2;
    ReqAddr.AreaCode3 = TempAddr.AreaCode3;
    ReqAddr.AreaCode4 = TempAddr.AreaCode4;
    ReqAddr.City = TempAddr.City;
    ReqAddr.Fax = TempAddr.Fax;
    ReqAddr.FaxArea = TempAddr.FaxArea;
    ReqAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeCompanyContactInfo;
    ReqAddr.MrHouseOwnershipCode = "";
    ReqAddr.Zipcode = TempZipVal.value;
    ReqAddr.SubZipcode = TempAddr.SubZipcode;
    console.log(ReqAddr);

    let url: string = "";
    if (this.TempAppCustCompanyContactPersonObj.AppCustCompanyContactPersonId != 0) {
      ReqAddr.AppCustAddrId = this.TempAppCustCompanyContactPersonObj.AppCustAddrObj.AppCustAddrId;
      ReqAddr.RowVersion = this.TempAppCustCompanyContactPersonObj.AppCustAddrObj.RowVersion;
      url = URLConstant.EditAppCustAddr;
    } else {
      url = URLConstant.AddAppCustAddr;
    }

    await this.http.post(url, ReqAddr).toPromise().then(
      (response) => {
        this.toastr.successMessage(response["message"]);
      }
    );

  }

  async SetReqCcObj(obj: any) {
    var ReqCcObj: AppCustCompanyContactPersonObj = new AppCustCompanyContactPersonObj();
    ReqCcObj.AppCustId = this.AppCustId;
    ReqCcObj.AppCustCompanyId = this.TempAppCustCompanyContactPersonObj.AppCustCompanyId;
    ReqCcObj.AppCustCompanyContactPersonId = this.TempAppCustCompanyContactPersonObj.AppCustCompanyContactPersonId;
    ReqCcObj.RowVersion = this.TempAppCustCompanyContactPersonObj.RowVersion;
    ReqCcObj.BirthDt = obj.BirthDt
    ReqCcObj.BirthPlace = obj.BirthPlace;
    ReqCcObj.ContactPersonName = obj.ContactPersonName;
    ReqCcObj.Email1 = obj.Email1;
    ReqCcObj.Email2 = obj.Email2;
    ReqCcObj.IdExpiredDt = obj.IdExpiredDt;
    ReqCcObj.IdNo = obj.IdNo;
    ReqCcObj.JobTitleName = obj.JobTitleName;
    ReqCcObj.MobilePhnNo1 = obj.MobilePhnNo1;
    ReqCcObj.MobilePhnNo2 = obj.MobilePhnNo2;
    ReqCcObj.MrCustRelationshipCode = obj.MrCustRelationshipCode;
    ReqCcObj.MrGenderCode = obj.MrGenderCode;
    ReqCcObj.MrIdTypeCode = obj.MrIdTypeCode;
    ReqCcObj.MrJobPositionCode = obj.MrJobPositionCode;
    ReqCcObj.Phn1 = obj[this.InputAddressObjForCc_Identifier].Phn1;
    ReqCcObj.Phn2 = obj[this.InputAddressObjForCc_Identifier].Phn2;
    ReqCcObj.PhnArea1 = obj[this.InputAddressObjForCc_Identifier].PhnArea1;
    ReqCcObj.PhnArea2 = obj[this.InputAddressObjForCc_Identifier].PhnArea2;
    ReqCcObj.PhnExt1 = obj[this.InputAddressObjForCc_Identifier].PhnExt1;
    ReqCcObj.PhnExt2 = obj[this.InputAddressObjForCc_Identifier].PhnExt2;
    console.log(ReqCcObj);

    await this.http.post(URLConstant.AddOrEditAppCustCompanyContactPerson, ReqCcObj).toPromise().then(
      (response) => {
        this.toastr.successMessage(response["message"]);
      }
    );
  }
}
