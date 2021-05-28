import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorCompanyObj } from 'app/shared/model/GuarantorCompanyObj.Model';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppGuarantorCompanyLegalDocObj } from 'app/shared/model/AppGuarantorCompanyLegalDocObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-guarantor-company-FL4W',
  templateUrl: './guarantor-company-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})

export class GuarantorCompanyFL4WComponent implements OnInit {
  @Input() AppId: number;
  @Input() AppGuarantorId: number;
  @Input() showCancel: boolean = true;
  @Input() mode: string;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() ListCustNoCompany: any[];
  criteria: CriteriaObj[] = [];
  CustCompanyIdObj: GenericObj;
  resultData: any;
  inputLookupObj: InputLookupObj;
  MrCompanyTypeCode: RefMasterObj;
  MrCustRelationshipCode: Array<KeyValueObj>;
  inputLookupObj1: InputLookupObj;
  MrJobPositionCode: RefMasterObj;
  inputFieldObj: InputFieldObj;
  AddrObj: AddrObj;
  appGuarantorCompanyObj: AppGuarantorCompanyObj;
  guarantorCompanyObj: GuarantorCompanyObj;
  AppGuarantorCompanyId: number;
  companyLegalDocObj: Array<AppCustCompanyLegalDocObj>;
  DocObjs: Array<RefMasterObj>;
  tempCustNo: string;
  defLegalDocType: string;
  legalDocObj: Array<AppCustCompanyLegalDocObj>;
  CompanyForm = this.fb.group({
    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    TaxIdNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    IndustryTypeCode: ['', [Validators.required, , Validators.maxLength(50)]],
    ContactName: ['', [Validators.maxLength(500)]],
    MrJobPositionCode: ['', [Validators.required, Validators.maxLength(50)]],
    MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50)]],
    ContactEmail: ['', [Validators.maxLength(50)]],
    MobilePhnNo2: ['', [Validators.maxLength(50)]],
    FaxArea: ['', [Validators.maxLength(20)]],
    Fax: ['', [Validators.maxLength(50)]],
    PhnArea1: ['', [Validators.required, Validators.maxLength(20)]],
    Phn1: ['', [Validators.required, Validators.maxLength(50)]],
    PhnExt1: ['', [Validators.required, Validators.maxLength(10)]],
    PhnArea2: ['', [Validators.maxLength(20)]],
    Phn2: ['', [Validators.maxLength(50)]],
    PhnExt2: ['', [Validators.maxLength(10)]],
    LegalDocForm: this.fb.array([])
  });
  businessDt: Date = new Date();
  selectedListLegalDocType: any = new Array();
  inputAddressObj: InputAddressObj;
  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private modalService: NgbModal, private cookieService: CookieService) {
  }

  async ngOnInit(): Promise<void> {
    this.inputAddressObj = new InputAddressObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showAllPhn = false;

    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);
    this.initLookup();
    this.initAddr();

    if (this.mode == "edit") {
      var guarantorCompanyObj = new GuarantorCompanyObj();
      guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      await this.http.post(URLConstant.GetAppGuarantorCompanyByAppGuarantorId, guarantorCompanyObj).toPromise().then(
        (response) => {
          this.resultData = response;
          this.AppGuarantorCompanyId = this.resultData.AppGuarantorCompanyObj.AppGuarantorCompanyId;
          this.inputLookupObj.jsonSelect = { CustName: this.resultData.AppGuarantorObj.GuarantorName };
          this.inputLookupObj.nameSelect = this.resultData.AppGuarantorObj.GuarantorName;
          this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
          this.inputLookupObj1.jsonSelect = response;
          this.inputLookupObj1.isReady = true;

          this.CompanyForm.patchValue({
            MrCustRelationshipCode: this.resultData.AppGuarantorObj.MrCustRelationshipCode,
            TaxIdNo: this.resultData.AppGuarantorObj.TaxIdNo,
            MrCompanyTypeCode: this.resultData.AppGuarantorCompanyObj.MrCompanyTypeCode,
            IndustryTypeCode: this.resultData.AppGuarantorCompanyObj.IndustryTypeCode,
            ContactName: this.resultData.AppGuarantorCompanyObj.ContactName,
            MrJobPositionCode: this.resultData.AppGuarantorCompanyObj.MrJobPositionCode,
            MobilePhnNo1: this.resultData.AppGuarantorCompanyObj.MobilePhnNo1,
            ContactEmail: this.resultData.AppGuarantorCompanyObj.ContactEmail,
            MobilePhnNo2: this.resultData.AppGuarantorCompanyObj.MobilePhnNo2,
            FaxArea: this.resultData.AppGuarantorCompanyObj.FaxArea,
            Fax: this.resultData.AppGuarantorCompanyObj.Fax,
            PhnArea1: this.resultData.AppGuarantorCompanyObj.PhnArea1,
            Phn1: this.resultData.AppGuarantorCompanyObj.Phn1,
            PhnExt1: this.resultData.AppGuarantorCompanyObj.PhnExt1,
            PhnArea2: this.resultData.AppGuarantorCompanyObj.PhnArea2,
            Phn2: this.resultData.AppGuarantorCompanyObj.Phn2,
            PhnExt2: this.resultData.AppGuarantorCompanyObj.PhnExt2
          })
          this.setIndustryTypeName(this.resultData.AppGuarantorCompanyObj.IndustryTypeCode);
          this.setAddrLegalObj();
          this.companyLegalDocObj = this.resultData.AppGuarantorCompanyObj.ListAppGuarantorCompanyLegalDoc;
          this.bindLegalDoc();
          if (this.resultData.AppGuarantorObj.CustNo != null) {
            this.tempCustNo = this.resultData.AppGuarantorObj.CustNo;
            this.inputLookupObj.isReadonly = true;
            this.CompanyForm.controls["MrCustRelationshipCode"].disable();
            this.CompanyForm.controls["TaxIdNo"].disable();
            this.CompanyForm.controls["MrCompanyTypeCode"].disable();
            this.CompanyForm.controls["IndustryTypeCode"].disable();
            this.CompanyForm.controls["ContactName"].disable();
            this.CompanyForm.controls["MrJobPositionCode"].disable();
            this.CompanyForm.controls["MobilePhnNo1"].disable();
            this.CompanyForm.controls["ContactEmail"].disable();
            this.CompanyForm.controls["MobilePhnNo2"].disable();
            this.CompanyForm.controls["FaxArea"].disable();
            this.CompanyForm.controls["Fax"].disable();
            this.CompanyForm.controls["PhnArea1"].disable();
            this.CompanyForm.controls["Phn1"].disable();
            this.CompanyForm.controls["PhnExt1"].disable();
            this.CompanyForm.controls["PhnArea2"].disable();
            this.CompanyForm.controls["Phn2"].disable();
            this.CompanyForm.controls["PhnExt2"].disable();
            this.CompanyForm.controls["AddrObj"]["controls"].Addr.disable();
            this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.disable();
            this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.disable();
          }

        });
    }
    else {
      this.ClearForm();
      this.inputLookupObj1.isReady = true;
    }

    var refCompObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType,
      MappingCode: null
    };

    var AppCust = {
      Id: this.AppId,
      RowVersion: null
    }
    this.http.post(URLConstant.GetAppCustByAppId, AppCust).subscribe(
      (response) => {

        if (response["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
          var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarPersonalRelationship,
            MappingCode: CommonConstant.CustTypeCompany,
          }
        } else {
          var refCustRelObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
            RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
            MappingCode: CommonConstant.CustTypeCompany,
          }
        }
        this.http.post(URLConstant.GetListActiveRefMasterWithMappingCodeAll, refCustRelObj).subscribe(
          (response) => {
            this.MrCustRelationshipCode = response[CommonConstant.ReturnObj];
            if (this.mode != "edit") {
              this.CompanyForm.patchValue({
                MrCustRelationshipCode: this.MrCustRelationshipCode[0].Key
              });
            }
          }
        );

      }
    );

    var refJobObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition,
      MappingCode: null
    }
    this.http.post(URLConstant.GetListActiveRefMaster, refCompObj).subscribe(
      (response) => {
        this.MrCompanyTypeCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.CompanyForm.patchValue({
            MrCompanyTypeCode: this.MrCompanyTypeCode[0].MasterCode
          });
        }
      }
    );

    this.http.post(URLConstant.GetListActiveRefMaster, refJobObj).subscribe(
      (response) => {
        this.MrJobPositionCode = response[CommonConstant.ReturnObj];
        if (this.mode != "edit") {
          this.CompanyForm.patchValue({
            MrJobPositionCode: this.MrJobPositionCode[0].MasterCode
          });
        }
      }
    );
    this.getDocType();
  }

  initLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.isReadonly = false;

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.isRequired = false;

    if (this.ListCustNoCompany.length > 0) {
      var arrCopyLookupCrit = new Array();
      var addCrit = new CriteriaObj();
      addCrit.DataType = "text";
      addCrit.propName = "CUST_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListCustNoCompany;
      arrCopyLookupCrit.push(addCrit);
      this.inputLookupObj.addCritInput = arrCopyLookupCrit;
    }
  }

  initAddr() {
    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();

  }

  lookupGuarantor(event) {
    this.inputLookupObj.isReadonly = true;
    this.tempCustNo = event.CustNo;
    this.http.post(URLConstant.GetCustByCustId, { Id: event.CustId }).subscribe(
      (response) => {
        this.resultData = response;
        this.CompanyForm.patchValue(
          {
            GuarantorName: event.CustName,
            TaxIdNo: this.resultData.TaxIdNo
          }
        );
        this.http.post(URLConstant.GetCustCompanyByCustId, { Id: event.CustId }).subscribe(
          (response) => {
            this.resultData = response;
            this.CompanyForm.patchValue({
              MrCompanyTypeCode: this.resultData.MrCompanyTypeCode
            });
            this.http.post(URLConstant.GetRefIndustryTypeByRefIndustryTypeId, { Id: this.resultData.RefIndustryTypeId }).subscribe(
              (response) => {
                this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
                this.inputLookupObj1.jsonSelect = response;
                this.CompanyForm.patchValue({
                  IndustryTypeCode: response["IndustryTypeCode"]
                });
              }
            );
            this.CustCompanyIdObj = new GenericObj();
            this.CustCompanyIdObj.Id = this.resultData.CustCompanyId;
            this.http.post(URLConstant.GetCustCompanyContactPersonByCustCompanyId, this.CustCompanyIdObj).subscribe(
              (response) => {
                this.resultData = response;
                this.CompanyForm.patchValue({
                  ContactName: this.resultData.ContactPersonName,
                  MrJobPositionCode: this.resultData.MrJobPositionCode,
                  MobilePhnNo1: this.resultData.MobilePhnNo1,
                  MobilePhnNo2: this.resultData.MobilePhnNo2,
                  ContactEmail: this.resultData.Email1
                });
              }
            );
          }
        );
        let reqObj: GenericObj = new GenericObj();
        reqObj.Id = event.CustId;
        reqObj.Code = CommonConstant.AddrTypeLegal;
        this.http.post(URLConstant.GetCustAddrByMrCustAddrType, reqObj).subscribe(
          (response) => {
            this.resultData = response;
            this.CompanyForm.patchValue({
              FaxArea: this.resultData.FaxArea,
              Fax: this.resultData.Fax,
              Phn1: this.resultData.Phn1,
              Phn2: this.resultData.Phn2,
              PhnArea1: this.resultData.PhnArea1,
              PhnArea2: this.resultData.PhnArea2,
              PhnExt1: this.resultData.PhnExt1,
              PhnExt2: this.resultData.PhnExt2
            });
            this.AddrObj = new AddrObj();
            this.AddrObj.Addr = this.resultData.Addr;
            this.AddrObj.AreaCode1 = this.resultData.AreaCode1;
            this.AddrObj.AreaCode2 = this.resultData.AreaCode2;
            this.AddrObj.AreaCode3 = this.resultData.AreaCode3;
            this.AddrObj.AreaCode4 = this.resultData.AreaCode4;
            this.AddrObj.City = this.resultData.City;
            this.AddrObj.Phn1 = this.resultData.Phn1;
            this.AddrObj.Phn2 = this.resultData.Phn2;
            this.AddrObj.PhnArea1 = this.resultData.PhnArea1;
            this.AddrObj.PhnArea2 = this.resultData.PhnArea2;
            this.AddrObj.PhnExt1 = this.resultData.PhnExt1;
            this.AddrObj.PhnExt2 = this.resultData.PhnExt2;
            this.AddrObj.Fax = this.resultData.Fax;
            this.AddrObj.FaxArea = this.resultData.FaxArea;
            this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.Zipcode;
            this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.Zipcode };
            this.inputAddressObj.default = this.AddrObj;
            this.inputAddressObj.inputField = this.inputFieldObj;
          }
        );
      }
    );
    this.CompanyForm.controls["MrCustRelationshipCode"].disable();
    this.CompanyForm.controls["TaxIdNo"].disable();
    this.CompanyForm.controls["MrCompanyTypeCode"].disable();
    this.CompanyForm.controls["IndustryTypeCode"].disable();
    this.CompanyForm.controls["ContactName"].disable();
    this.CompanyForm.controls["MrJobPositionCode"].disable();
    this.CompanyForm.controls["MobilePhnNo1"].disable();
    this.CompanyForm.controls["ContactEmail"].disable();
    this.CompanyForm.controls["MobilePhnNo2"].disable();
    this.CompanyForm.controls["FaxArea"].disable();
    this.CompanyForm.controls["Fax"].disable();
    this.CompanyForm.controls["PhnArea1"].disable();
    this.CompanyForm.controls["Phn1"].disable();
    this.CompanyForm.controls["PhnExt1"].disable();
    this.CompanyForm.controls["PhnArea2"].disable();
    this.CompanyForm.controls["Phn2"].disable();
    this.CompanyForm.controls["PhnExt2"].disable();
    this.CompanyForm.controls["AddrObj"]["controls"].Addr.disable();
    this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.disable();
    this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.disable();

  }

  handleOutput1(event) {
    this.CompanyForm.patchValue(
      {
        IndustryTypeCode: event.IndustryTypeCode
      }
    );
  }

  setAddrLegalObj() {
    this.AddrObj = new AddrObj();
    this.AddrObj.Addr = this.resultData.AppGuarantorCompanyObj.Addr;
    this.AddrObj.AreaCode1 = this.resultData.AppGuarantorCompanyObj.AreaCode1;
    this.AddrObj.AreaCode2 = this.resultData.AppGuarantorCompanyObj.AreaCode2;
    this.AddrObj.AreaCode3 = this.resultData.AppGuarantorCompanyObj.AreaCode3;
    this.AddrObj.AreaCode4 = this.resultData.AppGuarantorCompanyObj.AreaCode4;
    this.AddrObj.City = this.resultData.AppGuarantorCompanyObj.City;

    this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.AppGuarantorCompanyObj.Zipcode;
    this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.AppGuarantorCompanyObj.Zipcode };
    this.inputAddressObj.default = this.AddrObj;
    this.inputAddressObj.inputField = this.inputFieldObj;
  }

  Add() {
    this.setAppGuarantor();
    if (this.setAppGuarantorCompany() == false) return false;
    else true;
  }

  setAppGuarantor() {
    if (this.tempCustNo != null) {
      this.guarantorCompanyObj.AppGuarantorObj.CustNo = this.tempCustNo;
    }
    this.guarantorCompanyObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorObj.MrGuarantorTypeCode = CommonConstant.CustTypeCompany;
    this.guarantorCompanyObj.AppGuarantorObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorObj.MrCustRelationshipCode = this.CompanyForm.controls.MrCustRelationshipCode.value;
    this.guarantorCompanyObj.AppGuarantorObj.RowVersion = "";
    this.guarantorCompanyObj.AppGuarantorObj.AppId = this.AppId;
  }

  setAppGuarantorCompany() {
    this.selectedListLegalDocType = new Array();
    var flag: boolean = true;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrCompanyTypeCode = this.CompanyForm.controls.MrCompanyTypeCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.IndustryTypeCode = this.inputLookupObj1.jsonSelect.IndustryTypeCode;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactName = this.CompanyForm.controls.ContactName.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrJobPositionCode = this.CompanyForm.controls.MrJobPositionCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactEmail = this.CompanyForm.controls.ContactEmail.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo1 = this.CompanyForm.controls.MobilePhnNo1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo2 = this.CompanyForm.controls.MobilePhnNo2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.FaxArea = this.CompanyForm.controls.FaxArea.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Fax = this.CompanyForm.controls.Fax.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea1 = this.CompanyForm.controls.PhnArea1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn1 = this.CompanyForm.controls.Phn1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt1 = this.CompanyForm.controls.PhnExt1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea2 = this.CompanyForm.controls.PhnArea2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn2 = this.CompanyForm.controls.Phn2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt2 = this.CompanyForm.controls.PhnExt2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Addr = this.CompanyForm.controls["AddrObj"]["controls"].Addr.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode1 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode2 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode3 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode4 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.City = this.CompanyForm.controls["AddrObj"]["controls"].City.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Zipcode = this.inputFieldObj.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.RowVersion = "";
    this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs = new Array<AppGuarantorCompanyLegalDocObj>();
    var j = this.CompanyForm.controls["LegalDocForm"]["value"].length;

    for (let i = 0; i < j; i++) {
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i] = new AppGuarantorCompanyLegalDocObj();
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].MrLegalDocTypeCode = this.CompanyForm.controls["LegalDocForm"].value[i].MrLegalDocTypeCode;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].DocNo = this.CompanyForm.controls["LegalDocForm"].value[i].DocNo;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].DocDt = this.CompanyForm.controls["LegalDocForm"].value[i].DocDt;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].DocExpiredDt = this.CompanyForm.controls["LegalDocForm"].value[i].DocExpiredDt;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].DocNotes = this.CompanyForm.controls["LegalDocForm"].value[i].DocNotes;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].ReleaseBy = this.CompanyForm.controls["LegalDocForm"].value[i].ReleaseBy;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].ReleaseLocation = this.CompanyForm.controls["LegalDocForm"].value[i].ReleaseLocation;
      if (this.cekDuplicateDocType(i) == false) flag = false;
    }
    return flag;
  }

  cekDuplicateDocType(i) {
    if (this.selectedListLegalDocType.length > 0) {
      if (this.selectedListLegalDocType.find(x => x.Key == this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].MrLegalDocTypeCode)) {
        this.toastr.warningMessage("Legal Document Type " + this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].MrLegalDocTypeCode + " is duplicated ");
        return false;
      }
    }
    var keyValueObj = {
      Key: this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].MrLegalDocTypeCode,
      Value: this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs[i].LegalDocName,
    }
    this.selectedListLegalDocType.push(keyValueObj);
    return true;
  }

  SaveForm() {
    this.guarantorCompanyObj = new GuarantorCompanyObj();
    if (this.Add() == false) return;
    if (this.mode == "edit") {
      this.guarantorCompanyObj.RowVersion = this.resultData.RowVersion;
      this.guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.AppGuarantorCompanyId = this.AppGuarantorCompanyId;
      this.http.post(URLConstant.EditAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        });
    } else {
      this.http.post(URLConstant.AddAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        });
    }
  }

  ClearForm() {
    this.CompanyForm = this.fb.group({
      MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
      TaxIdNo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      IndustryTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      ContactName: ['', [Validators.maxLength(500)]],
      MrJobPositionCode: ['', [Validators.required, Validators.maxLength(50)]],
      MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50)]],
      ContactEmail: ['', [Validators.maxLength(50)]],
      MobilePhnNo2: ['', [Validators.maxLength(50)]],
      FaxArea: ['', [Validators.maxLength(20)]],
      Fax: ['', [Validators.maxLength(50)]],
      PhnArea1: ['', [Validators.required, Validators.maxLength(20)]],
      Phn1: ['', [Validators.required, Validators.maxLength(50)]],
      PhnExt1: ['', [Validators.required, Validators.maxLength(10)]],
      PhnArea2: ['', [Validators.maxLength(20)]],
      Phn2: ['', [Validators.maxLength(50)]],
      PhnExt2: ['', [Validators.maxLength(10)]],
      LegalDocForm: this.fb.array([])
    });
    this.initLookup();
    this.initAddr();
  }

  addLegalDoc() {
    var legalDocObjs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
    var length = this.CompanyForm.value["LegalDocForm"].length;
    var max = 0;
    if (length > 0) {
      max = this.CompanyForm.value["LegalDocForm"].length[length - 1];
    }
    legalDocObjs.push(this.addGroup(undefined, max + 1));
  }

  getDocType() {
    var legalDocObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType,
      MappingCode: null
    };
    this.http.post(URLConstant.GetListActiveRefMaster, legalDocObj).subscribe(
      (response) => {
        this.DocObjs = response[CommonConstant.ReturnObj];
        if (this.DocObjs.length > 0) {
          this.defLegalDocType = this.DocObjs[0].MasterCode;
        }
      }
    );
  }

  addGroup(legalDocObj, i) {
    if (legalDocObj == undefined) {
      return this.fb.group({
        MrLegalDocTypeCode: [this.defLegalDocType, [Validators.required, Validators.maxLength(50)]],
        DocNo: ['', [Validators.required, Validators.maxLength(50)]],
        DocDt: ['', [Validators.required]],
        DocExpiredDt: ['', [Validators.required]],
        DocNotes: ['', [Validators.maxLength(4000)]],
        ReleaseBy: ['', [Validators.required, Validators.maxLength(500)]],
        ReleaseLocation: ['', [Validators.required, Validators.maxLength(4000)]]
      })
    } else {
      return this.fb.group({
        No: [i],
        MrLegalDocTypeCode: [legalDocObj.MrLegalDocTypeCode, [Validators.required, Validators.maxLength(50)]],
        DocNo: [legalDocObj.DocNo, [Validators.required, Validators.maxLength(50)]],
        DocDt: [formatDate(legalDocObj.DocDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
        DocExpiredDt: [formatDate(legalDocObj.DocExpiredDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
        DocNotes: [legalDocObj.DocNotes, [Validators.maxLength(4000)]],
        ReleaseBy: [legalDocObj.ReleaseBy, [Validators.required, Validators.maxLength(500)]],
        ReleaseLocation: [legalDocObj.ReleaseLocation, [Validators.required, Validators.maxLength(4000)]]
      })
    }
  }

  deleteLegalDoc(i) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var legalDocObjs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
      legalDocObjs.removeAt(i);
    }
  }

  bindLegalDoc() {
    if (this.companyLegalDocObj != undefined) {
      for (let i = 0; i < this.companyLegalDocObj.length; i++) {
        var listLegalDocs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
        listLegalDocs.push(this.addGroup(this.companyLegalDocObj[i], i));
      }
    }
  }

  setIndustryTypeName(industryTypeCode) {
    var refIndustryObj = {
      IndustryTypeCode: ""
    };
    refIndustryObj.IndustryTypeCode = industryTypeCode;

    this.http.post(URLConstant.GetRefIndustryTypeByCode, {Code: industryTypeCode}).subscribe(
      (response) => {
        this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
        this.inputLookupObj1.jsonSelect = response;
        this.inputLookupObj1.isReady = true;
      });
  }

  cancel() {
    this.modalService.dismissAll();
  }
}
