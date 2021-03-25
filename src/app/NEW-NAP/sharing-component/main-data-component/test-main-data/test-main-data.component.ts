import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-test-main-data',
  templateUrl: './test-main-data.component.html',
  styleUrls: ['./test-main-data.component.scss']
})
export class TestMainDataComponent implements OnInit {

  private ucLookupExistingCust: UclookupgenericComponent;
  @ViewChild('LookupExistingCust') set content(content: UclookupgenericComponent) {
    if (content) { // initially setter gets called with undefined
      this.ucLookupExistingCust = content;
    }
  }
  @Input() custMainDataMode: string;
  @Input() appId: number;
  @Input() appCustId: number;
  @Input() bizTemplateCode: string = "";
  @Input() inputMode: string = "ADD";
  @Output() outputAfterSave: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  subjectTitle: string = 'Customer';
  MrCustTypeCode: string;
  isExisting: boolean = false;
  isIncludeCustRelation: boolean = false;
  custDataObj: CustDataObj = new CustDataObj();


  inputAddressObj: InputAddressObj = new InputAddressObj();
  InputLookupCustObj: InputLookupObj = new InputLookupObj();
  ArrAddCrit: Array<CriteriaObj> = new Array<CriteriaObj>();

  // RefMaster Obj
  CustTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  IdTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  GenderObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  MaritalStatObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  MrCustRelationshipObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  CompanyTypeObj: Array<KeyValueObj> = new Array<KeyValueObj>();

  CustMainDataForm = this.fb.group({
    MrCustTypeCode: [],
    MrRelationshipCustCode: ['', Validators.maxLength(50)],
    CustNo: [],
    CompanyType: [''],
    MrMaritalStatCode: ['', Validators.required],
    MrIdTypeCode: ['', Validators.required],
    IdNo: ['', Validators.required],
    IdExpiredDt: [''],
    TaxIdNo: ['', [Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]],
    MrGenderCode: ['', Validators.required],
    BirthPlace: ['', Validators.required],
    BirthDt: ['', Validators.required],
    MotherMaidenName: ['', Validators.required],
    MrCompanyTypeCode: [''],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    public formValidate: FormValidateService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["appId"];
    })
  }

  ngOnInit() {
    console.log("test");
    this.inputAddressObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressObj.title = "Address";
    this.inputAddressObj.showOwnership = true;
    this.initcustMainDataCategory();
    this.getRefMaster();

    if (this.inputMode != 'ADD') {
      this.getCustMainData();
    } else {
      this.setLookup();
    }
  }

  initcustMainDataCategory() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    if (this.appCustId) this.custDataObj.AppCustId = this.appCustId;

    switch (this.custMainDataMode) {
      case CommonConstant.CustMainDataModeCust:
        this.isIncludeCustRelation = false;
        this.custDataObj.IsCustomer = true;
        this.subjectTitle = 'Customer';
        this.CustMainDataForm.controls.MrRelationshipCustCode.clearValidators();
        break;
      case CommonConstant.CustMainDataModeGuarantor:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsGuarantor = true;
        this.subjectTitle = 'Guarantor';
        this.CustMainDataForm.controls.MrRelationshipCustCode.setValidators(Validators.required);
        break;
      case CommonConstant.CustMainDataModeFamily:
        this.isIncludeCustRelation = true;
        this.custDataObj.IsFamily = true;
        this.CustMainDataForm.controls.MrRelationshipCustCode.setValidators(Validators.required);
        break;
      default:
        this.isIncludeCustRelation = false;
        this.subjectTitle = 'Customer';
    }
  }

  setLookup(custType: string = CommonConstant.CustTypePersonal, isChange: boolean = false) {
    this.InputLookupCustObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustObj.isReadonly = false;
    this.InputLookupCustObj.isRequired = true;
    this.InputLookupCustObj.nameSelect = "";
    this.ArrAddCrit = new Array<CriteriaObj>();
    let critObj = new CriteriaObj();
    critObj.DataType = "text";
    critObj.propName = 'C.MR_CUST_TYPE_CODE';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.value = custType;
    this.ArrAddCrit.push(critObj);

    this.InputLookupCustObj.addCritInput = this.ArrAddCrit;

    if (isChange) {
      this.ucLookupExistingCust.setAddCritInput();
    } else {
      this.InputLookupCustObj.isReady = true;
    }
  }

  getRefMaster() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        this.MrCustTypeCode = this.CustTypeObj[0].Key;
        this.CustMainDataForm.patchValue({
          MrCustTypeCode: this.CustTypeObj[0].Key
        })
      });

    this.http.post(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { Code: CommonConstant.RefMasterTypeCodeIdType }).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.RefMasterObjs];
        if (this.IdTypeObj.length > 0) {
          let idxDefault = this.IdTypeObj.findIndex(x => x["IsDefaultValue"]);
          this.CustMainDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"]
          });
        }
        // this.clearExpDt();
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeGender }).subscribe(
      (response) => {
        this.GenderObj = response[CommonConstant.ReturnObj];
        if (this.GenderObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrGenderCode: this.GenderObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeMaritalStat }).subscribe(
      (response) => {
        this.MaritalStatObj = response[CommonConstant.ReturnObj];
        if (this.MaritalStatObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).subscribe(
      (response) => {
        this.CompanyTypeObj = response[CommonConstant.ReturnObj];
        if (this.CompanyTypeObj.length > 0) {
          this.CustMainDataForm.patchValue({
            MrCompanyTypeCode: this.CompanyTypeObj[0].Key
          });
        }
      });
  }

  custTypeChange(custType: string = CommonConstant.CustTypePersonal) {
    this.MrCustTypeCode = custType;

    if (custType == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.controls.MotherMaidenName.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthDt.setValidators(Validators.required);
      this.CustMainDataForm.controls.BirthPlace.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrIdTypeCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrGenderCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.MrMaritalStatCode.setValidators(Validators.required);
      this.CustMainDataForm.controls.IdNo.setValidators(Validators.required);
      this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
    } else {
      this.CustMainDataForm.controls.TaxIdNo.setValidators([Validators.required, Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)]);
      this.CustMainDataForm.controls.MotherMaidenName.clearValidators();
      this.CustMainDataForm.controls.BirthDt.clearValidators();
      this.CustMainDataForm.controls.BirthPlace.clearValidators();
      this.CustMainDataForm.controls.MrIdTypeCode.clearValidators();
      this.CustMainDataForm.controls.MrGenderCode.clearValidators();
      this.CustMainDataForm.controls.MrMaritalStatCode.clearValidators();
      this.CustMainDataForm.controls.IdNo.clearValidators();
    }
    this.resetInput();
    this.CustMainDataForm.updateValueAndValidity();
    this.setLookup(custType, true);
  }

  resetInput() {
    this.CustMainDataForm.reset();
    let idxDefault = this.IdTypeObj.findIndex(x => x["IsDefaultValue"]);
    this.CustMainDataForm.patchValue({
      MrCustTypeCode: this.MrCustTypeCode
    });
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.CustMainDataForm.patchValue({
        MrIdTypeCode: this.IdTypeObj[idxDefault]["MasterCode"],
        MrGenderCode: this.GenderObj[0].Key,
        MrMaritalStatCode: this.MaritalStatObj[0].Key,
      });
    } else {
      this.CustMainDataForm.patchValue({
        MrCompanyTypeCode: this.CompanyTypeObj[0].Key
      });
    }
  }

  clearExpDt() {
    this.CustMainDataForm.controls.IdExpiredDt.reset();
    this.CustMainDataForm.controls.IdExpiredDt.clearValidators();
  }

  getCustMainData() {
    this.http.post(URLConstant.GetAppCustMainDataByAppId, this.custDataObj).subscribe(
      (response) => {
        {
          if (response['AppCustObj']) {
            this.appCustId = response['AppCustObj']['AppCustId'];
            this.MrCustTypeCode = response['AppCustObj']['MrCustTypeCode'];
            this.setLookup(this.MrCustTypeCode);
            if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
              // this.setDataCustomerPersonal(response['AppCustObj'], response['AppCustPersonalObj'], response['AppCustAddrLegalObj']);
            }
            else {
              // this.setDataCustomerCompany(response['AppCustObj'], response['AppCustCompanyObj'], response['AppCustAddrLegalObj']);
            }

            if (response['AppCustObj']['IsExistingCust']) {
              this.disableInput();
            }
          }
        }
      });
  }

  disableInput() {
    this.isExisting = true;
    this.CustMainDataForm.controls.Address["controls"]["MrHouseOwnershipCode"].disable();
    this.inputAddressObj.isReadonly = true;
    this.InputLookupCustObj.isReadonly = true;
    this.inputAddressObj.inputField.inputLookupObj.isReadonly = true;
  }

  copyCustomerEvent(event) {
  }

  SaveForm() {
    console.log(this.CustMainDataForm.value);
    console.log(this.CustMainDataForm);
  }



  Next() {
    this.outputAfterSave.emit({ isMarried: false });
  }
}
