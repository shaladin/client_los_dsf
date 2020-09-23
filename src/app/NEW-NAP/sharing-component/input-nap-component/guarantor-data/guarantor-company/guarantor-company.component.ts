import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorCompanyObj } from 'app/shared/model/GuarantorCompanyObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppGuarantorCompanyLegalDocObj } from 'app/shared/model/AppGuarantorCompanyLegalDocObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-guarantor-company',
  templateUrl: './guarantor-company.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})

export class GuarantorCompanyComponent implements OnInit {

  @Input() AppGuarantorId: any;
  @Input() mode: any;
  @Input() AppId: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  param: any;
  key: any;
  criteria: CriteriaObj[] = [];
  resultData: any;
  inputLookupObj: any;
  MrCompanyTypeCode: any;
  MrCustRelationshipCode: any;
  inputLookupObj1: any;
  MrJobPositionCode: any;
  inputFieldObj: InputFieldObj;
  AddrObj: AddrObj;
  appGuarantorCompanyObj: AppGuarantorCompanyObj;
  guarantorCompanyObj: GuarantorCompanyObj = new GuarantorCompanyObj();
  AppGuarantorCompanyId: any;
  listLegalDoc: Array<AppGuarantorCompanyLegalDocObj> = new Array<AppGuarantorCompanyLegalDocObj>();
  DocObjs: any;
  defLegalDocType: string;
  appLegalDoc: any = new Array();
  isReady: boolean = false;
  tempCustNo: string;
  isContactMandatory: boolean = false;

  CompanyForm = this.fb.group({
    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    TaxIdNo: ['', [Validators.required, Validators.maxLength(50)]],
    MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    ContactName: ['', [Validators.maxLength(500)]],
    MrJobPositionCode: ['', [Validators.maxLength(50)]],
    MobilePhnNo1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    ContactEmail: ['', [Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    FaxArea: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
    Fax: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    PhnArea1: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
    Phn1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    PhnExt1: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
    PhnArea2: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
    Phn2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    PhnExt2: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]+$")]]
  });
  inputAddressObjForCoy: InputAddressObj;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService, private modalService: NgbModal) {
  }

  UserAccess: any;
  MaxDate: Date;
  async ngOnInit(): Promise<void> {
    this.inputAddressObjForCoy = new InputAddressObj();
    this.inputAddressObjForCoy.title = "Address";
    this.inputAddressObjForCoy.showAllPhn = false;

    this.UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.initLookup();
    this.initAddr();
    this.CompanyForm.removeControl("LegalDocForm");
    this.CompanyForm.addControl("LegalDocForm", this.fb.array([]));

    if (this.mode == "edit") {
      this.isReady = true;
      var guarantorCompanyObj = new GuarantorCompanyObj();
      guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      await this.http.post(URLConstant.GetAppGuarantorCompanyByAppGuarantorId, guarantorCompanyObj).toPromise().then(
        (response) => {
          this.resultData = response;
          this.AppGuarantorCompanyId = this.resultData.AppGuarantorCompanyObj.AppGuarantorCompanyId;
          this.inputLookupObj.jsonSelect = { CustName: this.resultData.AppGuarantorObj.GuarantorName };
          this.inputLookupObj.nameSelect = this.resultData.AppGuarantorObj.GuarantorName;
          this.inputLookupObj1.jsonSelect = { IndustryTypeName: this.resultData.AppGuarantorCompanyObj.IndustryTypeCode };
          this.CompanyForm.patchValue({
            MrCustRelationshipCode: this.resultData.AppGuarantorObj.MrCustRelationshipCode,
            TaxIdNo: this.resultData.AppGuarantorObj.TaxIdNo,
            MrCompanyTypeCode: this.resultData.AppGuarantorCompanyObj.MrCompanyTypeCode,
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
          });
          this.tempCustNo = this.resultData.AppGuarantorObj.CustNo;
          this.setIndustryTypeName(this.resultData.AppGuarantorCompanyObj.IndustryTypeCode);
          this.setAddrLegalObj();
          this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs = this.resultData.AppGuarantorCompanyObj.ListAppGuarantorCompanyLegalDoc;
          this.listLegalDoc = this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs;
          this.ChangeContactInfo();
        });
        // if (this.resultData.AppGuarantorObj.CustNo) {
        //   this.tempCustNo = this.resultData.AppGuarantorObj.CustNo;
        //   this.inputLookupObj.isReadonly = true;
        //   this.CompanyForm.controls["MrCustRelationshipCode"].disable();
        //   this.CompanyForm.controls["TaxIdNo"].disable();
        //   this.CompanyForm.controls["MrCompanyTypeCode"].disable();
        //   this.CompanyForm.controls["ContactName"].disable();
        //   this.CompanyForm.controls["MrJobPositionCode"].disable();
        //   this.CompanyForm.controls["MobilePhnNo1"].disable();
        //   this.CompanyForm.controls["ContactEmail"].disable();
        //   this.CompanyForm.controls["MobilePhnNo2"].disable();
        //   this.CompanyForm.controls["FaxArea"].disable();
        //   this.CompanyForm.controls["Fax"].disable();
        //   this.CompanyForm.controls["PhnArea1"].disable();
        //   this.CompanyForm.controls["Phn1"].disable();
        //   this.CompanyForm.controls["PhnExt1"].disable();
        //   this.CompanyForm.controls["PhnArea2"].disable();
        //   this.CompanyForm.controls["Phn2"].disable();
        //   this.CompanyForm.controls["PhnExt2"].disable();
        //   this.CompanyForm.controls["AddrObj"]["controls"].Addr.disable();
        //   this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.disable();
        //   this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.disable();
        // }
    } else {
      this.ClearForm();
      this.inputLookupObj1.isReady = true;
    }


    var refCompObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType,
      RowVersion: ""
    } 
    var refJobObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition,
      RowVersion: ""
    }
    var AppCust = {
      AppId: this.AppId,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetAppCustByAppId, AppCust).subscribe(
      (response) => {  

        if( response["MrCustTypeCode"] ==  CommonConstant.CustTypePersonal){ 
          var refCustRelObj = {
            RefMasterTypeCode:  CommonConstant.RefMasterTypeCodeGuarPersonalRelationship,
            ReserveField1:  CommonConstant.CustTypeCompany,
            RowVersion: ""
          }
        }else{
          var refCustRelObj = {
            RefMasterTypeCode:  CommonConstant.RefMasterTypeCodeGuarCompanyRelationship,
            ReserveField1: CommonConstant.CustTypeCompany,
            RowVersion: ""
          }
        }

        this.http.post(URLConstant.GetListActiveRefMasterWithReserveFieldAll, refCustRelObj).subscribe(
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
        //if(this.mode != "edit"){
        //  this.CompanyForm.patchValue({
        //    MrJobPositionCode: this.MrJobPositionCode[0].MasterCode
        //  });
        //}
      }
    );
    this.isReady = true;
  }

  setCriteriaLookupCustomer(custTypeCode) {
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.inputLookupObj.addCritInput = arrCrit;
  }

  initLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.isReadonly = false;
    this.setCriteriaLookupCustomer(CommonConstant.CustTypeCompany);

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupIndustryType.json";

  }

  initAddr() {

    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();

  }

  // GuarantorName="";
  lookupGuarantor(event) {
    this.tempCustNo = event.CustNo;
    this.inputLookupObj.isReadonly = true;
    this.http.post(URLConstant.GetCustByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        this.resultData = response;
        this.CompanyForm.patchValue(
          {
            GuarantorName: event.CustName,
            TaxIdNo: this.resultData.TaxIdNo
          }
        );
        this.http.post(URLConstant.GetCustCompanyByCustId, { CustId: event.CustId }).subscribe(
          (response) => {
            this.resultData = response;
            this.CompanyForm.patchValue({
              MrCompanyTypeCode: this.resultData.MrCompanyTypeCode
            });

            if (this.resultData.RefIndustryTypeId != null) {
              this.http.post(URLConstant.GetRefIndustryTypeByRefIndustryTypeId, { RefIndustryTypeId: this.resultData.RefIndustryTypeId }).subscribe(
                (response) => {
                  this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
                  this.inputLookupObj1.jsonSelect = response;
                }
              );
            } else {
              this.inputLookupObj1.nameSelect = "";
              this.inputLookupObj1.jsonSelect = {};
            }

            this.http.post(URLConstant.GetCustCompanyContactPersonByCustCompanyId, { CustCompanyId: this.resultData.CustCompanyId }).subscribe(
              (response) => {
                this.resultData = response;
                this.CompanyForm.patchValue({
                  ContactName: this.resultData.ContactPersonName,
                  MrJobPositionCode: this.resultData.MrJobPositionCode,
                  MobilePhnNo1: this.resultData.MobilePhnNo1,
                  MobilePhnNo2: this.resultData.MobilePhnNo2,
                  ContactEmail: this.resultData.Email1,
                  Phn1: this.resultData.Phn1,
                  Phn2: this.resultData.Phn2,
                  PhnArea1: this.resultData.PhnArea1,
                  PhnArea2: this.resultData.PhnArea2,
                  PhnExt1: this.resultData.PhnExt1,
                  PhnExt2: this.resultData.PhnExt2
                });
                if (this.resultData.ContactPersonName != '' && this.resultData.ContactPersonName != null) {
                  this.setValidatorContactInfo();
                }
              }
            );
          }
        );
        this.http.post(URLConstant.GetCustAddrByMrCustAddrType, { CustId: event.CustId, MrCustAddrTypeCode: "LEGAL" }).subscribe(
          (response) => {
            this.resultData = response;
            this.CompanyForm.patchValue({
              FaxArea: this.resultData.FaxArea,
              Fax: this.resultData.Fax
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
            
            this.inputAddressObjForCoy.default = this.AddrObj;
            this.inputAddressObjForCoy.inputField = this.inputFieldObj;
          }
        );
      }
    ); 

    this.CompanyForm.controls["MrCustRelationshipCode"].disable();
    this.CompanyForm.controls["TaxIdNo"].disable();
    this.CompanyForm.controls["MrCompanyTypeCode"].disable();
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

  // IndustryTypeCode="";
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
    
    this.inputAddressObjForCoy.default = this.AddrObj;
    this.inputAddressObjForCoy.inputField = this.inputFieldObj;
  }

  Add() {
    this.setAppGuarantor();
    this.setAppGuarantorCompany();
  }

  setAppGuarantor() {
    if (this.tempCustNo != null) {
      this.guarantorCompanyObj.AppGuarantorObj.CustNo = this.tempCustNo;
    }

    this.guarantorCompanyObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorObj.MrGuarantorTypeCode = CommonConstant.GuarantorTypeCodeCompany;
    this.guarantorCompanyObj.AppGuarantorObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorObj.MrCustRelationshipCode = this.CompanyForm.controls.MrCustRelationshipCode.value;
    this.guarantorCompanyObj.AppGuarantorObj.RowVersion = "";
    this.guarantorCompanyObj.AppGuarantorObj.AppId = this.AppId;
  }

  setAppGuarantorCompany() {
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
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Zipcode = this.CompanyForm.value.AddrObjZipcode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.RowVersion = "";

    this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs = this.listLegalDoc;
  }

  getAppGuarantorLegalDoc(event) {
    this.listLegalDoc = event;
  }

  SaveForm() {
    this.guarantorCompanyObj = new GuarantorCompanyObj();
    this.Add();
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
      TaxIdNo: ['', [Validators.required, Validators.maxLength(50)]],
      MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      ContactName: ['', [Validators.maxLength(500)]],
      MrJobPositionCode: ['', [Validators.maxLength(50)]],
      MobilePhnNo1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      ContactEmail: ['', [Validators.maxLength(50),Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      MobilePhnNo2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      FaxArea: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
      Fax: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      PhnArea1: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
      Phn1: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      PhnExt1: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
      PhnArea2: ['', [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]],
      Phn2: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
      PhnExt2: ['', [Validators.maxLength(10), Validators.pattern("^[0-9]+$")]],
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
    // this.getDocType(max);

  }

  cek() {
  }

  getDocType() {
    var legalDocObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLegalDocType,
      RowVersion: ""
    }
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


  setIndustryTypeName(industryTypeCode) {
    var refIndustryObj = {
      IndustryTypeCode: ""
    };
    refIndustryObj.IndustryTypeCode = industryTypeCode;

    this.http.post(URLConstant.GetRefIndustryTypeByCode, refIndustryObj).subscribe(
      (response) => {
        this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
        this.inputLookupObj1.jsonSelect = response;
        this.inputLookupObj1.isReady = true;
      });
  }

  cancel() {
    this.modalService.dismissAll();
  }

  setValidatorContactInfo() {
    this.isContactMandatory = true;
    this.CompanyForm.controls.ContactName.setValidators([Validators.required, Validators.maxLength(50)]);
    this.CompanyForm.controls.ContactName.updateValueAndValidity();
    this.CompanyForm.controls.MrJobPositionCode.setValidators([Validators.required, Validators.maxLength(50)]);
    this.CompanyForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.CompanyForm.controls.MobilePhnNo1.setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]);
    this.CompanyForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.CompanyForm.controls.ContactEmail.setValidators([Validators.required, Validators.maxLength(50), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]);
    this.CompanyForm.controls.ContactEmail.updateValueAndValidity();
    this.CompanyForm.controls.PhnArea1.setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]);
    this.CompanyForm.controls.PhnArea1.updateValueAndValidity();
    this.CompanyForm.controls.Phn1.setValidators([Validators.required, Validators.maxLength(50), Validators.pattern("^[0-9]+$")]);
    this.CompanyForm.controls.Phn1.updateValueAndValidity();
  }
  clearValidatorContactInfo() {
    this.isContactMandatory = false;
    this.CompanyForm.controls.ContactName.clearValidators();
    this.CompanyForm.controls.ContactName.updateValueAndValidity();
    this.CompanyForm.controls.MrJobPositionCode.clearValidators();
    this.CompanyForm.controls.MrJobPositionCode.updateValueAndValidity();
    this.CompanyForm.controls.MobilePhnNo1.clearValidators();
    this.CompanyForm.controls.MobilePhnNo1.updateValueAndValidity();
    this.CompanyForm.controls.ContactEmail.clearValidators();
    this.CompanyForm.controls.ContactEmail.updateValueAndValidity();
    this.CompanyForm.controls.PhnArea1.clearValidators();
    this.CompanyForm.controls.PhnArea1.updateValueAndValidity();
    this.CompanyForm.controls.Phn1.clearValidators();
    this.CompanyForm.controls.Phn1.updateValueAndValidity();
  }

  ChangeContactInfo(){
    if (
      this.CompanyForm.controls.ContactName.value == '' && 
      this.CompanyForm.controls.MobilePhnNo1.value == '' &&
      this.CompanyForm.controls.ContactEmail.value == '' &&
      this.CompanyForm.controls.MrJobPositionCode.value == '' &&
      this.CompanyForm.controls.PhnArea1.value == '' &&
      this.CompanyForm.controls.Phn1.value == ''
    )
      this.clearValidatorContactInfo();
    else if(!this.isContactMandatory)
      this.setValidatorContactInfo();
  }
}
