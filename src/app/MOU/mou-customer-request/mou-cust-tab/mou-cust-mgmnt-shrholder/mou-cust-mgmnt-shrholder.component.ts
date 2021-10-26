import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate, KeyValue } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/MouCustCompanyMgmntShrholderObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CustSetData } from 'app/NEW-NAP/sharing-component/main-data-component/components/CustSetData.Service';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

@Component({
  selector: 'app-mou-cust-mgmnt-shrholder',
  templateUrl: './mou-cust-mgmnt-shrholder.component.html',
  styleUrls: ['./mou-cust-mgmnt-shrholder.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class MouCustMgmntShrholderComponent implements OnInit {

  @Input() listShareholder: Array<MouCustCompanyMgmntShrholderObj> = new Array<MouCustCompanyMgmntShrholderObj>();

  @Output() callbackSubmit: EventEmitter<Array<MouCustCompanyMgmntShrholderObj>> = new EventEmitter();

  mode: string;
  currentEditedIndex: number;
  selectedCustNo: string;
  selectedIndustryTypeCode: string;

  closeResult: any;
  appCustCompanyMgmntShrholderObj: MouCustCompanyMgmntShrholderObj;

  InputLookupCustomerObj: InputLookupObj;
  InputLookupIndustryTypeObj: InputLookupObj;

  CustTypeObj: Array<KeyValueObj>;
  defaultCustType: string;
  GenderObj: Array<KeyValueObj>;
  defaultGender: string;
  IdTypeObj: Array<KeyValueObj>;
  defaultIdType: string;
  JobPositionObj: Array<KeyValueObj>;
  defaultJobPosition: string;
  CompanyTypeObj: Array<KeyValueObj>;
  defaultCompanyType: string;
  isCust: boolean = false;
  selectedCustTypeName: string;
  selectedJobPositionName: string;
  defaultCustTypeName: string;
  defaultJobPositionName: string;



  CustShareholderForm = this.fb.group({
    MrCustTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrGenderCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrPositionSlikCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    BirthPlace: ['', Validators.maxLength(200)],
    BirthDt: ['', Validators.required],
    IdNo: ['', Validators.maxLength(50)],
    TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    IdExpiredDt: [''],
    MobilePhnNo: ['', Validators.maxLength(50)],
    Email: ['', [Validators.maxLength(50), Validators.pattern(CommonConstant.regexEmail)]],
    SharePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    MrJobPositionCode: ['', Validators.maxLength(50)],
    IsSigner: [false],
    IsOwner: [false],
    IsActive: [false],
    MrCompanyTypeCode: ['', Validators.maxLength(50)],
    EstablishmentDt: ['', Validators.required],
    IsGuarantor: [false]
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal, private cookieService: CookieService) {

  }

  UserAccess: CurrentUserContext;
  MaxDate: Date;
  Max17YO: Date;
  ngOnInit() {
    if (this.listShareholder == undefined) {
      this.listShareholder = new Array<MouCustCompanyMgmntShrholderObj>();
    }
    this.UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.MaxDate = new Date(this.UserAccess.BusinessDt);
    this.Max17YO = new Date(this.UserAccess.BusinessDt);
    this.Max17YO.setFullYear(this.MaxDate.getFullYear() - 17);

    this.initLookup();
    this.bindAllRefMasterObj();
  }
  SavePublicType(ev: { Key: string, Value: MouCustCompanyMgmntShrholderObj }) {
    if (ev.Key == "save") {
      if (this.mode == "add") this.listShareholder.push(ev.Value);
      else this.listShareholder[this.currentEditedIndex] = ev.Value;
    }
    this.callbackSubmit.emit(this.listShareholder);
    this.modalService.dismissAll();
    this.clearForm();
  }
  SaveForm() {
    this.appCustCompanyMgmntShrholderObj = new MouCustCompanyMgmntShrholderObj();
    if (this.setAppCustCompanyMgmntShrholder() == false) return;
    if (this.mode == "add") {
      if (this.checkSharePrcnt(-1) == false) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_PERCENTAGE_MUST_100);
        return;
      }
      this.listShareholder.push(this.appCustCompanyMgmntShrholderObj);
    }
    if (this.mode == "edit") {
      if (this.checkSharePrcnt(this.currentEditedIndex) == false) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_PERCENTAGE_MUST_100);
        return;
      }
      this.listShareholder[this.currentEditedIndex] = this.appCustCompanyMgmntShrholderObj;
    }
    this.callbackSubmit.emit(this.listShareholder);
    this.modalService.dismissAll();
    this.clearForm();
  }

  checkSharePrcnt(currentEditedIndex) {
    var sharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
    var totalPrcnt = 0;

    for (let i = 0; i < this.listShareholder.length; i++) {
      if (this.listShareholder[i].IsActive && (currentEditedIndex == -1 || currentEditedIndex != i)) {
        totalPrcnt += this.listShareholder[i].SharePrcnt;
      }
    }

    if (sharePrcnt + totalPrcnt > 100) {
      return false;
    }
    return true;
  }

  CustTypeChanged(event) {
    this.setCriteriaLookupCustomer(event.value);
    this.setValidator(event.value);
    this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == event.value).Value;
    this.CustShareholderForm.controls.MrGenderCode.enable();
    this.CustShareholderForm.controls.MrIdTypeCode.enable();
    this.CustShareholderForm.controls.IdExpiredDt.enable();
    this.CustShareholderForm.controls.IdNo.enable();
    this.CustShareholderForm.controls.BirthPlace.enable();
    this.CustShareholderForm.controls.BirthDt.enable();
    this.CustShareholderForm.controls.MrGenderCode.enable();
    this.CustShareholderForm.controls.TaxIdNo.enable();
    this.CustShareholderForm.controls.IdExpiredDt.enable();
    this.CustShareholderForm.controls.MrCompanyTypeCode.enable();
    this.CustShareholderForm.controls.EstablishmentDt.enable();
    this.CustShareholderForm.controls.TaxIdNo.enable();
    this.isCust = false;

  }

  JobPositionChanged(event) {
    this.selectedJobPositionName = event.target.options[event.target.options.selectedIndex].text;
  }

  setCriteriaLookupCustomer(custTypeCode) {
    this.initLookup();
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.InputLookupCustomerObj.addCritInput = arrCrit;
  }

  add(content) {
    this.mode = "add";
    this.clearForm();
    this.tempExisting = new MouCustCompanyMgmntShrholderObj();
    this.setCriteriaLookupCustomer(this.defaultCustType);
    this.open(content);
  }

  tempExisting: MouCustCompanyMgmntShrholderObj = new MouCustCompanyMgmntShrholderObj();
  edit(i: number, content) {
    this.clearForm();
    this.mode = "edit";
    this.currentEditedIndex = i;

    if (this.listShareholder[i].MrShrholderTypeCode == CommonConstant.CustTypePersonal) {
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: this.listShareholder[i].MrCustTypeCode,
        MrGenderCode: this.listShareholder[i].MrGenderCode,
        MrIdTypeCode: this.listShareholder[i].MrIdTypeCode,
        BirthPlace: this.listShareholder[i].BirthPlace,
        BirthDt: this.listShareholder[i].BirthDt ? formatDate(this.listShareholder[i].BirthDt, 'yyyy-MM-dd', 'en-US') : null,
        IdNo: this.listShareholder[i].IdNo,
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        IdExpiredDt: this.listShareholder[i].IdExpiredDt ? formatDate(this.listShareholder[i].IdExpiredDt, 'yyyy-MM-dd', 'en-US') : null,
        MobilePhnNo: this.listShareholder[i].MobilePhnNo,
        Email: this.listShareholder[i].Email,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        MrJobPositionCode: this.listShareholder[i].MrJobPositionCode,
        IsSigner: this.listShareholder[i].IsSigner,
        IsOwner: this.listShareholder[i].IsOwner,
        IsActive: this.listShareholder[i].IsActive,
        IsGuarantor: this.listShareholder[i].IsGuarantor,
        MrPositionSlikCode: this.listShareholder[i].MrPositionSlikCode,
      });
      if (this.listShareholder[i].CustNo != undefined && this.listShareholder[i].CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
        this.CustShareholderForm.controls.MrGenderCode.disable();
        this.CustShareholderForm.controls.MrIdTypeCode.disable();
        this.CustShareholderForm.controls.IdExpiredDt.disable();
        this.CustShareholderForm.controls.IdNo.disable();
        this.CustShareholderForm.controls.BirthPlace.disable();
        this.CustShareholderForm.controls.BirthDt.disable();
        this.CustShareholderForm.controls.MrGenderCode.disable();
        this.CustShareholderForm.controls.TaxIdNo.disable();
        this.CustShareholderForm.controls.IdExpiredDt.disable();
      }
      this.selectedJobPositionName = this.listShareholder[i].JobPositionName;
      this.selectedCustTypeName = this.listShareholder[i].CustTypeName;
      this.setCriteriaLookupCustomer(this.listShareholder[i].MrCustTypeCode);
    }

    if (this.listShareholder[i].MrShrholderTypeCode == CommonConstant.CustTypeCompany) {
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: this.listShareholder[i].MrCustTypeCode,
        MrCompanyTypeCode: this.listShareholder[i].MrCompanyTypeCode,
        EstablishmentDt: this.listShareholder[i].EstablishmentDt ? formatDate(this.listShareholder[i].EstablishmentDt, 'yyyy-MM-dd', 'en-US') : null,
        TaxIdNo: this.listShareholder[i].TaxIdNo,
        SharePrcnt: this.listShareholder[i].SharePrcnt,
        IsSigner: this.listShareholder[i].IsSigner,
        IsOwner: this.listShareholder[i].IsOwner,
        IsActive: this.listShareholder[i].IsActive,
        MrPositionSlikCode: this.listShareholder[i].MrPositionSlikCode,
        IsGuarantor: this.listShareholder[i].IsGuarantor
      });
      this.selectedCustTypeName = this.listShareholder[i].CustTypeName;
      this.selectedJobPositionName = this.defaultJobPositionName;
      this.selectedIndustryTypeCode = this.listShareholder[i].IndustryTypeCode;
      this.setIndustryTypeName(this.listShareholder[i].IndustryTypeCode);
      this.setCriteriaLookupCustomer(this.listShareholder[i].MrCustTypeCode);
      if (this.listShareholder[i].CustNo != undefined && this.listShareholder[i].CustNo != "") {
        this.InputLookupCustomerObj.isReadonly = true;
        this.CustShareholderForm.controls.MrCompanyTypeCode.disable();
        this.CustShareholderForm.controls.EstablishmentDt.disable();
        this.CustShareholderForm.controls.TaxIdNo.disable();
        this.isCust = true;
      }
    }

    if (this.listShareholder[i].MrShrholderTypeCode == CommonConstant.CustTypePublic) {
      this.CustShareholderForm.patchValue({
        MrCustTypeCode: CommonConstant.CustTypePublic,
      });
      this.tempExisting = this.listShareholder[i];
    }else{
      //#region patch positionSlik    
      let reqMasterObj: ReqRefMasterByTypeCodeAndMasterCodeObj = {
          MasterCode: this.listShareholder[i].MrPositionSlikCode,
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodePositionSlik
      };
      this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, reqMasterObj).subscribe(
          (response: RefMasterObj) => {
              this.positionSlikLookUpObj.nameSelect = response.Descr;
              this.positionSlikLookUpObj.jsonSelect = { Jabatan: response.Descr };
              this.positionSlikLookUpObj.isReady = true;
          }
      )
      //#endregion
    }
    this.InputLookupCustomerObj.nameSelect = this.listShareholder[i].MgmntShrholderName;
    this.InputLookupCustomerObj.jsonSelect = { CustName: this.listShareholder[i].MgmntShrholderName };
    this.selectedCustNo = this.listShareholder[i].CustNo;
    this.setValidator(this.listShareholder[i].MrCustTypeCode);
    this.open(content);
  }

  clearForm() {
    this.CustShareholderForm = this.fb.group({
      MrCustTypeCode: [this.defaultCustType, [Validators.required, Validators.maxLength(50)]],
      MrGenderCode: [this.defaultGender, [Validators.required, Validators.maxLength(50)]],
      MrIdTypeCode: [this.defaultIdType, Validators.maxLength(50)],
      BirthPlace: ['', Validators.maxLength(200)],
      BirthDt: ['', Validators.required],
      IdNo: ['', Validators.maxLength(50)],
      TaxIdNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
      IdExpiredDt: [''],
      MobilePhnNo: ['', Validators.maxLength(50)],
      Email: ['', [Validators.maxLength(50), Validators.pattern(CommonConstant.regexEmail)]],
      SharePrcnt: [0, [Validators.min(0), Validators.max(100)]],
      MrJobPositionCode: [this.defaultJobPosition, Validators.maxLength(50)],
      IsSigner: [false],
      IsOwner: [false],
      IsActive: [false],
      MrCompanyTypeCode: [this.defaultCompanyType, Validators.maxLength(50)],
      EstablishmentDt: ['', Validators.required],
      MrPositionSlikCode: ['', Validators.required],
      IsGuarantor: [false]
    });
    this.selectedCustNo = "";
    this.selectedJobPositionName = this.defaultJobPositionName;
    this.selectedCustTypeName = this.defaultCustTypeName;
    this.initLookup();
    this.setValidator(this.defaultCustType);
    this.isCust = false;
    this.onChangeIdType();
  }

  CopyCustomer(event) {
    this.selectedCustNo = event.CustNo;
    this.InputLookupCustomerObj.isReadonly = true;

    var url;

    if (event.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      url = URLConstant.GetCustPersonalForCopyMgmntShrholderByCustId;
    }
    else if (event.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      url = URLConstant.GetCustCompanyForCopyMgmntShrholderByCustId;
    }

    this.http.post(url, { Id: event.CustId }).subscribe(
      (response) => {
        if (event.MrCustTypeCode == CommonConstant.CustTypePersonal) {
          if (response["CustObj"] != undefined) {
            this.CustShareholderForm.patchValue({
              MrCustTypeCode: response["CustObj"].MrCustTypeCode,
              MrIdTypeCode: response["CustObj"].MrIdTypeCode,
              IdNo: response["CustObj"].IdNo,
              TaxIdNo: response["CustObj"].TaxIdNo,
              IdExpiredDt: response["CustObj"].IdExpiredDt != undefined ? formatDate(response["CustObj"].IdExpiredDt, 'yyyy-MM-dd', 'en-US') : null
            });
            this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == response["CustObj"].MrCustTypeCode).Value;
          }

          if (response["CustPersonalObj"] != undefined) {
            this.CustShareholderForm.patchValue({
              MrGenderCode: response["CustPersonalObj"].MrGenderCode,
              BirthPlace: response["CustPersonalObj"].BirthPlace,
              BirthDt: response["CustPersonalObj"].BirthDt != undefined ? formatDate(response["CustPersonalObj"].BirthDt, 'yyyy-MM-dd', 'en-US') : null,
              MobilePhnNo: response["CustPersonalObj"].MobilePhnNo1,
              Email: response["CustPersonalObj"].Email1
            });
          }

          if (response["CustPersonalJobDataObj"] != undefined) {
            this.CustShareholderForm.patchValue({
              MrJobPositionCode: response["CustPersonalJobDataObj"].MrJobPositionCode,
            });
            this.selectedJobPositionName = this.JobPositionObj.find(x => x.Key == response["CustPersonalJobDataObj"].MrJobPositionCode).Value;
          }

          this.CustShareholderForm.controls.MrGenderCode.disable();
          this.CustShareholderForm.controls.MrIdTypeCode.disable();
          this.CustShareholderForm.controls.IdExpiredDt.disable();
          this.CustShareholderForm.controls.IdNo.disable();
          this.CustShareholderForm.controls.BirthPlace.disable();
          this.CustShareholderForm.controls.BirthDt.disable();
          this.CustShareholderForm.controls.MrGenderCode.disable();
          this.CustShareholderForm.controls.TaxIdNo.disable();

        }

        if (event.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          if (response["CustObj"] != undefined) {
            this.CustShareholderForm.patchValue({
              MrCustTypeCode: response["CustObj"].MrCustTypeCode,
              TaxIdNo: response["CustObj"].TaxIdNo
            });
            this.selectedCustTypeName = this.CustTypeObj.find(x => x.Key == response["CustObj"].MrCustTypeCode).Value;

          }
          if (response["CustCompanyObj"] != undefined) {
            this.CustShareholderForm.patchValue({
              MrCompanyTypeCode: response["CustCompanyObj"].MrCompanyTypeCode,
              EstablishmentDt: formatDate(response["CustCompanyObj"].EstablishmentDt, 'yyyy-MM-dd', 'en-US'),
            });
          }
          this.selectedJobPositionName = "";
          this.selectedIndustryTypeCode = response["CustCompanyObj"].IndustryTypeCode;
          this.setIndustryTypeName(response["CustCompanyObj"].IndustryTypeCode);
          this.CustShareholderForm.controls.MrCompanyTypeCode.disable();
          this.CustShareholderForm.controls.EstablishmentDt.disable();
          this.CustShareholderForm.controls.TaxIdNo.disable();
          this.isCust = true;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setAppCustCompanyMgmntShrholder() {
    var flag: boolean = true;
    if (this.CustShareholderForm.controls.MrCustTypeCode.value == CommonConstant.CustTypePersonal) {
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.CustTypeName = this.selectedCustTypeName;
      this.appCustCompanyMgmntShrholderObj.MrGenderCode = this.CustShareholderForm.controls.MrGenderCode.value;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.MrIdTypeCode = this.CustShareholderForm.controls.MrIdTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.BirthPlace = this.CustShareholderForm.controls.BirthPlace.value;
      this.appCustCompanyMgmntShrholderObj.BirthDt = this.CustShareholderForm.controls.BirthDt.value;
      this.appCustCompanyMgmntShrholderObj.IdNo = this.CustShareholderForm.controls.IdNo.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.IdExpiredDt = this.CustShareholderForm.controls.IdExpiredDt.value;
      this.appCustCompanyMgmntShrholderObj.IsGuarantor = this.CustShareholderForm.controls.IsGuarantor.value;
      this.appCustCompanyMgmntShrholderObj.MrPositionSlikCode = this.CustShareholderForm.controls.MrPositionSlikCode.value;
      this.appCustCompanyMgmntShrholderObj.MrShrholderTypeCode = CommonConstant.CustTypePersonal;
      let d1 = new Date(this.appCustCompanyMgmntShrholderObj.IdExpiredDt);
      let d2 = new Date(this.MaxDate);
      let d3 = new Date(this.appCustCompanyMgmntShrholderObj.BirthDt);
      let d4 = new Date(this.Max17YO);
      if (d1 > d2) {
        this.toastr.warningMessage(ExceptionConstant.ID_EXPIRED_DATE_CANNOT_LESS_THAN + "Business Date");
        flag = false;
      }
      if (d3 > d4) {
        // this.toastr.warningMessage("Birth Date can not be more than " + this.Max17YO);
        this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
        flag = false;
      }
      this.appCustCompanyMgmntShrholderObj.MobilePhnNo = this.CustShareholderForm.controls.MobilePhnNo.value;
      this.appCustCompanyMgmntShrholderObj.Email = this.CustShareholderForm.controls.Email.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
      this.appCustCompanyMgmntShrholderObj.MrJobPositionCode = this.CustShareholderForm.controls.MrJobPositionCode.value;
      this.appCustCompanyMgmntShrholderObj.JobPositionName = this.selectedJobPositionName;
      this.appCustCompanyMgmntShrholderObj.IsSigner = this.CustShareholderForm.controls.IsSigner.value;
      this.appCustCompanyMgmntShrholderObj.IsOwner = this.CustShareholderForm.controls.IsOwner.value;
      this.appCustCompanyMgmntShrholderObj.IsActive = this.CustShareholderForm.controls.IsActive.value;
    }

    if (this.CustShareholderForm.controls.MrCustTypeCode.value == CommonConstant.CustTypeCompany) {
      this.appCustCompanyMgmntShrholderObj.MrCustTypeCode = this.CustShareholderForm.controls.MrCustTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.CustTypeName = this.selectedCustTypeName;
      this.appCustCompanyMgmntShrholderObj.MgmntShrholderName = this.CustShareholderForm.controls.lookupCustomerShareholder.value.value;
      this.appCustCompanyMgmntShrholderObj.CustNo = this.selectedCustNo;
      this.appCustCompanyMgmntShrholderObj.IndustryTypeCode = this.selectedIndustryTypeCode;
      this.appCustCompanyMgmntShrholderObj.MrCompanyTypeCode = this.CustShareholderForm.controls.MrCompanyTypeCode.value;
      this.appCustCompanyMgmntShrholderObj.EstablishmentDt = this.CustShareholderForm.controls.EstablishmentDt.value;
      this.appCustCompanyMgmntShrholderObj.TaxIdNo = this.CustShareholderForm.controls.TaxIdNo.value;
      this.appCustCompanyMgmntShrholderObj.SharePrcnt = this.CustShareholderForm.controls.SharePrcnt.value;
      this.appCustCompanyMgmntShrholderObj.IsGuarantor = this.CustShareholderForm.controls.IsGuarantor.value;
      this.appCustCompanyMgmntShrholderObj.IsSigner = this.CustShareholderForm.controls.IsSigner.value;
      this.appCustCompanyMgmntShrholderObj.IsOwner = this.CustShareholderForm.controls.IsOwner.value;
      this.appCustCompanyMgmntShrholderObj.IsActive = this.CustShareholderForm.controls.IsActive.value;
      this.appCustCompanyMgmntShrholderObj.MrPositionSlikCode = this.CustShareholderForm.controls.MrPositionSlikCode.value;
      this.appCustCompanyMgmntShrholderObj.MrShrholderTypeCode = CommonConstant.CustTypeCompany;
    }

    return flag;
  }

  GetIndustryType(event) {
    this.selectedIndustryTypeCode = event.IndustryTypeCode;
  }

  setIndustryTypeName(industryTypeCode: string) {
    if(!industryTypeCode) return;
    this.http.post(URLConstant.GetRefIndustryTypeByCode, { Code: industryTypeCode }).subscribe(
      (response) => {
        this.InputLookupIndustryTypeObj.nameSelect = response["IndustryTypeName"];
        this.InputLookupIndustryTypeObj.jsonSelect = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setValidator(custType) {
    if (custType == CommonConstant.CustTypePersonal) {
      this.CustShareholderForm.controls.BirthDt.setValidators(Validators.required);
      this.CustShareholderForm.controls.BirthDt.updateValueAndValidity();
      this.CustShareholderForm.controls.EstablishmentDt.clearValidators();
      this.CustShareholderForm.controls.EstablishmentDt.updateValueAndValidity();
      this.CustShareholderForm.controls.MrJobPositionCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.CustShareholderForm.controls.MrJobPositionCode.updateValueAndValidity();
    }

    if (custType == CommonConstant.CustTypeCompany) {
      this.CustShareholderForm.controls.BirthDt.clearValidators();
      this.CustShareholderForm.controls.BirthDt.updateValueAndValidity();
      this.CustShareholderForm.controls.EstablishmentDt.setValidators(Validators.required);
      this.CustShareholderForm.controls.EstablishmentDt.updateValueAndValidity();
      this.CustShareholderForm.controls.MrJobPositionCode.clearValidators();
      this.CustShareholderForm.controls.MrJobPositionCode.updateValueAndValidity();
    }
  }

  positionSlikLookUpObj: InputLookupObj = new InputLookupObj();
  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;

    this.InputLookupIndustryTypeObj = new InputLookupObj();
    this.InputLookupIndustryTypeObj.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupIndustryTypeObj.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.genericJson = "./assets/uclookup/lookupIndustryType.json";
    this.InputLookupIndustryTypeObj.isRequired = false;

    this.positionSlikLookUpObj = CustSetData.BindLookupPositionSlik();
  }
  getLookUpSlik(ev: { Code: string, Jabatan: string }) {
    let tempMrPositionSlikCode = this.CustShareholderForm.get("MrPositionSlikCode");
    tempMrPositionSlikCode.patchValue(ev.Code);
  }

  bindAllRefMasterObj() {
    this.bindCustTypeObj();
    this.bindGenderObj();
    this.bindIdTypeObj();
    this.bindJobPositionObj();
    this.bindCompanyTypeObj();
  }

  dictCustType: { [id: string]: string } = {};
  bindCustTypeObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeShareholderCustType }).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        if (this.CustTypeObj.length > 0) {
          for (let index = 0; index < this.CustTypeObj.length; index++) {
            const element = this.CustTypeObj[index];
            this.dictCustType[element.Key] = element.Value;
          }
          this.defaultCustType = this.CustTypeObj[0].Key;
          this.defaultCustTypeName = this.CustTypeObj[0].Value;
          this.setValidator(this.CustTypeObj[0].Key);
        }
      }
    );
  }

  bindGenderObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.defaultGender = this.GenderObj[0].Key
        }
      }
    );
  }

  bindIdTypeObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
        if (this.IdTypeObj.length > 0) {
          this.defaultIdType = this.IdTypeObj[0].Key
        }
      }
    );
  }

  bindJobPositionObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeJobPosition }).subscribe(
      (response) => {
        this.JobPositionObj = response[CommonConstant.ReturnObj];
        if (this.JobPositionObj.length > 0) {
          this.defaultJobPosition = this.JobPositionObj[0].Key;
          this.defaultJobPositionName = this.JobPositionObj[0].Value;
        }
      }
    );
  }

  bindCompanyTypeObj() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.defaultCompanyType = this.CompanyTypeObj[0].Key;
        }
      }
    );
  }

  onChangeIdType() {
    if (this.CustShareholderForm.value.MrIdTypeCode == CommonConstant.MrIdTypeCodeNPWP) {
      this.CustShareholderForm.controls.IdNo.setValidators([Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
    }
    else if (this.CustShareholderForm.value.MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
      this.CustShareholderForm.controls.IdNo.setValidators([Validators.maxLength(50), Validators.pattern("^[0-9]+$"), Validators.minLength(16), Validators.maxLength(16)]);
    }
    else {
      this.CustShareholderForm.controls.IdNo.setValidators(Validators.maxLength(50));
    }
    this.CustShareholderForm.controls.IdNo.updateValueAndValidity();
  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  cancel() {
    this.modalService.dismissAll();
  }

  clearExpDt() {
    if (this.CustShareholderForm.value.MrIdTypeCode == CommonConstant.MrIdTypeCodeEKTP) {
      this.CustShareholderForm.patchValue({
        IdExpiredDt: null
      });
    }
    this.onChangeIdType();
  }
}
