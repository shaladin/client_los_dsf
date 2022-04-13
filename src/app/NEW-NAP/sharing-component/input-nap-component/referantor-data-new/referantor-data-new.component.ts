import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/app/app.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GeneralSettingObj } from 'app/shared/model/general-setting-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { environment } from 'environments/environment';
import { String } from 'typescript-string-operations';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { VendorBankAccObj } from 'app/shared/model/vendor-bank-acc.model';
import { CustomBankAccObj } from 'app/shared/model/custom-obj/custom-bank-acc-obj.model';
import { CustBankAccObj } from 'app/shared/model/cust-bank-acc/cust-bank-acc-obj.model';
import { AppReferantorObj, ListAppReferantorObj } from 'app/shared/model/app-referantor/app-referantor-obj.model';
import { NapAppReferantorModel } from 'app/shared/model/nap-app-referantor.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AppReferantorTaxInfoObj } from 'app/shared/model/app-referantor/app-referantor-tax-info-obj.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferantorDataNewDetailComponent } from '../referantor-data-new-detail/referantor-data-new-detail.component';

@Component({
  selector: 'app-referantor-data-new',
  templateUrl: './referantor-data-new.component.html'
})
export class ReferantorDataNewComponent implements OnInit {

  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private modalService: NgbModal
  ) { }

  ReferantorOn = false;
  IsReady: boolean = false;
  ExistedData: boolean = false;
  OfficeCode: String;
  arrAddCrit;
  dictRefTypeLookup: { [key: string]: any; } = {};
  dictBank: { [id: string]: Array<CustomBankAccObj>; } = {};
  maxReferantor : number = 0;
  refCategory: Array<KeyValueObj> = new Array<KeyValueObj>();
  ListAppReferantors: Array<NapAppReferantorModel> = new Array<NapAppReferantorModel>();
  itemCalcMethodType: any;

  incrementFormNo: number = 0;
  InputLookupReferantorObj: InputLookupObj;
  appReferantorListObj: ListAppReferantorObj = new ListAppReferantorObj();

  NapAppReferantorForm = this.fb.group({
    CheckBoxAppReferantor: [false],
    AppReferantorObjs: this.fb.array([])
  });

  getFormAppReferantorObjs(){
    return this.NapAppReferantorForm.get('AppReferantorObjs') as FormArray;
  }

  async ngOnInit() {
    this.appReferantorListObj = new ListAppReferantorObj();
    this.ExistedData = false;
    await this.GetAppData();
    await this.bindReferantorDDLObj();
    await this.GetGSValueMaxReferantor();
    await this.getAppReferantorData();
  }

  TurnReferantor() {
    this.ReferantorOn = this.NapAppReferantorForm.controls.CheckBoxAppReferantor.value;
  }

  async getAppReferantorData() {
    let obj = {
      Id: this.appId,
      RowVersion: "",
    }

    await this.http.post(URLConstant.GetListAppReferantorWithDetailByAppId, obj).toPromise().then(
      (response) => {
        this.ListAppReferantors = response[CommonConstant.ReturnObj];
        if (this.ListAppReferantors.length != 0) {
          this.ReferantorOn = true;
          this.ExistedData = true;
          this.NapAppReferantorForm.patchValue({
            CheckBoxAppReferantor: true
          });
          this.setEditForm();
        }
    });
  }

  addReferantor(){
    let length = this.getFormAppReferantorObjs().length;

    if((length + 1) > this.maxReferantor){
      this.toastr.warningMessage(String.Format(ExceptionConstant.MAX_REFERANTOR_EXCEPTION, this.maxReferantor));
      return;
    }

    this.getFormAppReferantorObjs().push(this.addGroup(undefined));
    length = this.getFormAppReferantorObjs().length;
    let refNo = this.getFormAppReferantorObjs().at(length - 1).get("No").value;
    this.dictRefTypeLookup[refNo] = this.initLookupRefTypeAgency();
    this.dictBank[refNo] = this.initBankAcc();
  }

  removeReferantor(i: number){
    let refNo = this.getFormAppReferantorObjs().at(i).get("No").value;
    this.getFormAppReferantorObjs().removeAt(i);

    delete this.dictRefTypeLookup[refNo];
    delete this.dictBank[refNo];
    this.NapAppReferantorForm.removeControl("lookupReferantor"+refNo);
  }

  setEditForm(){
    this.NapAppReferantorForm.removeControl("AppReferantorObjs");
    this.NapAppReferantorForm.addControl("AppReferantorObjs", this.fb.array([]));

    for (let i = 0; i < this.ListAppReferantors.length; i++) {
      this.getFormAppReferantorObjs().push(this.addGroup(this.ListAppReferantors[i]));
    }
  }

  //Set Group Data
  addGroup(AppReferantorObjs) {
    let refNo = this.incrementFormNo++;
    if (AppReferantorObjs == undefined) {
      return this.fb.group({
        No: [refNo],
        AppReferantorId: [0],
        ReferantorCategory: ['', [Validators.required]],
        ReferantorType: [''],
        ReferantorTypeDesc : [''],
        ReferantorCode: ['',[Validators.maxLength(50)]],
        ReferantorName: ['', [Validators.maxLength(500)]],
        TaxPayerNo: [''],
        TaxIdNo: [''],
        TaxIdName: [''],
        TaxIdAddr: [''],
        TaxIdAreaCode1: [''],
        TaxIdAreaCode2: [''],
        TaxIdAreaCode3: [''],
        TaxIdAreaCode4: [''],
        TaxIdCity: [''],
        TaxIdZipcode: [''],
        MrTaxCalcMethod: ['', [Validators.required]],
        RefBankCode: ['', [Validators.maxLength(50)]],
        BankAccNo: ['', [Validators.required]],
        BankAccName: [''],
        BankBranch: [''],
        BankName: [''],
        IsDisabledCalcMethod: [''],
        VendorId: [''],
        IsNpwpExist: ['']
      });
    }
    else {
      this.SetEditLookup(AppReferantorObjs, refNo);

      return this.fb.group({
        No: [refNo],
        AppReferantorId: [AppReferantorObjs.AppReferantorId],
        ReferantorCategory: [AppReferantorObjs.ReferantorCategory, [Validators.required]],
        ReferantorType: [AppReferantorObjs.MrReferantorType],
        ReferantorTypeDesc : [AppReferantorObjs.MrReferantorTypeName],
        ReferantorCode: [AppReferantorObjs.ReferantorCode,[Validators.maxLength(50)]],
        ReferantorName: [AppReferantorObjs.ReferantorName, [Validators.maxLength(500)]],
        TaxPayerNo: [AppReferantorObjs.TaxpayerNo],
        TaxIdNo: [AppReferantorObjs.TaxIdNo],
        TaxIdName: [AppReferantorObjs.TaxIdName],
        TaxIdAddr: [AppReferantorObjs.TaxIdAddr],
        TaxIdAreaCode1: [AppReferantorObjs.TaxIdAreaCode1],
        TaxIdAreaCode2: [AppReferantorObjs.TaxIdAreaCode2],
        TaxIdAreaCode3: [AppReferantorObjs.TaxIdAreaCode3],
        TaxIdAreaCode4: [AppReferantorObjs.TaxIdAreaCode4],
        TaxIdCity: [AppReferantorObjs.TaxIdCity],
        TaxIdZipcode: [AppReferantorObjs.TaxIdZipcode],
        MrTaxCalcMethod: [AppReferantorObjs.MrTaxCalcMethod, [Validators.required]],
        RefBankCode: [AppReferantorObjs.RefBankCode, [Validators.maxLength(50)]],
        BankAccNo: [AppReferantorObjs.BankAccNo, [Validators.required]],
        BankAccName: [AppReferantorObjs.BankAccName],
        BankBranch: [AppReferantorObjs.BankBranch],
        BankName: [AppReferantorObjs.BankName],
        IsDisabledCalcMethod: AppReferantorObjs.MrTaxCalcMethod == ""? false : true,
        VendorId: [''],
        IsNpwpExist: AppReferantorObjs.TaxIdNo != null && AppReferantorObjs.TaxIdNo != ""? true : false
      });
    }
  }

  //Init Ref Category dan Tax Calculation Method
  async bindReferantorDDLObj() {
    let refMasterObj = {
      RefMasterTypeCode: CommonConstant.RefMasterTypeCodeReferantorCategory
    }
    
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.refCategory = response[CommonConstant.ReturnObj];
        this.IsReady = true;
      }
    );

    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeTaxCalcMethod }).toPromise().then(
      (response) => {
        this.itemCalcMethodType = response[CommonConstant.ReturnObj];
      }
    );
  }

  async GetGSValueMaxReferantor() {
    await this.http.post<GeneralSettingObj>(URLConstant.GetGeneralSettingValueByCode, { Code: CommonConstant.GsCodeMaximumReferantor }).toPromise().then(
      async (response) => {
        this.maxReferantor = parseInt(response.GsValue);
    });
  }

  async GetAppData() {
    var obj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        this.OfficeCode = response.OriOfficeCode;
      }
    );
  }

  SaveData(url) {
    this.http.post(url, this.appReferantorListObj).subscribe(
      (response) => {
    });
  }

  DeleteData(url){    
    let tempObj = new GenericObj();
    tempObj.Id = this.appId;
    this.http.post(url, tempObj).subscribe(
      (response) => {
      });
  }

  ClickSave() {
    var url;
    this.SetAppReferantorObj();
    let length = this.NapAppReferantorForm.value["AppReferantorObjs"].length;
    if (this.ExistedData) {
      if (this.ReferantorOn) {
        if(length < 1){
          this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
          return;
        }
        // save
        url = URLConstant.EditListAppReferantor;
        this.SaveData(url);

        this.toastr.successMessage('Save Edit Data');
        this.outputTab.emit();
      } else {
        // delete & go to paging
        url = URLConstant.DeleteListAppReferantor;
        this.DeleteData(url);
        this.toastr.successMessage('Remove Data');
        this.outputTab.emit();
      }
    } else {
      if (this.ReferantorOn) {
        if(length < 1){
          this.toastr.warningMessage(ExceptionConstant.ADD_MIN_1_DATA);
          return;
        }
        // save
        url = URLConstant.AddListAppReferantor;
        this.SaveData(url);
        this.toastr.successMessage('Save New Data');
        this.outputTab.emit();
      } else {
        this.outputTab.emit();
      }
    }
  }

  ChangeReferantorCategory(i: number, ev){
    let refNo = this.getFormAppReferantorObjs().at(i).get("No").value;

    if(ev == CommonConstant.ReferantorCategoryAgency){
      this.ResetAppReferantorForm(ev, i);

      let InputLookupReferantorObj = this.initLookupRefTypeAgency();

      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      this.dictBank[refNo] = this.initBankAcc();
    }
    else if(ev == CommonConstant.ReferantorCategoryCustomer){
      this.ResetAppReferantorForm(ev, i);

      let InputLookupReferantorObj = this.initLookupRefTypeCustomer();

      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      this.dictBank[refNo] = this.initBankAcc();
    }
    else{
      this.ResetAppReferantorForm(ev, i);

      let InputLookupReferantorObj = this.initLookupRefTypeSupplEmp();

      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      this.dictBank[refNo] = this.initBankAcc();
    }
  }

  async SetEditLookup(AppReferantorObj : NapAppReferantorModel, refNo : number){
    if(AppReferantorObj.ReferantorCategory == CommonConstant.ReferantorCategoryAgency){

      let InputLookupReferantorObj = this.initLookupRefTypeAgency();
      InputLookupReferantorObj.nameSelect = AppReferantorObj.ReferantorName;
      InputLookupReferantorObj.jsonSelect = { ReferantorName: AppReferantorObj.ReferantorName };
      
      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      await this.SetEditBankDict(AppReferantorObj, refNo);
    }
    else if(AppReferantorObj.ReferantorCategory == CommonConstant.ReferantorCategoryCustomer){

      let InputLookupReferantorObj = this.initLookupRefTypeCustomer();
      InputLookupReferantorObj.nameSelect = AppReferantorObj.ReferantorName;
      InputLookupReferantorObj.jsonSelect = { ReferantorName: AppReferantorObj.ReferantorName };
     
      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      await this.SetEditBankDict(AppReferantorObj, refNo);
    }
    else{

      let InputLookupReferantorObj = this.initLookupRefTypeSupplEmp();
      InputLookupReferantorObj.nameSelect = AppReferantorObj.ReferantorName;
      InputLookupReferantorObj.jsonSelect = { ReferantorName: AppReferantorObj.ReferantorName };
      
      this.dictRefTypeLookup[refNo] = InputLookupReferantorObj;
      await this.SetEditBankDict(AppReferantorObj, refNo);
    }
  }

  ///Reset App Referantor Form
  ResetAppReferantorForm(ev, i){
    this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
      ReferantorCategory: ev,
      ReferantorType: "",
      ReferantorTypeDesc : "",
      ReferantorCode: "",
      ReferantorName: "",
      TaxPayerNo: "",
      TaxIdNo: "",
      TaxIdName: "",
      TaxIdAddr: "",
      TaxIdAreaCode1: "",
      TaxIdAreaCode2: "",
      TaxIdAreaCode3: "",
      TaxIdAreaCode4: "",
      TaxIdCity: "",
      TaxIdZipcode: "",
      MrTaxCalcMethod: "",
      RefBankCode: "",
      BankAccNo: "",
      BankAccName: "",
      BankBranch: "",
      BankName: "",
      IsDisabledCalcMethod: false,
      VendorId: "",
      IsNpwpExist: ""
    });
  }

  //Init Lookup Agency
  initLookupRefTypeAgency() {
    let arrAddCrit = new Array();
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "v.MR_VENDOR_CATEGORY_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [URLConstant.VendorCategoryAgencyCompany, URLConstant.VendorCategoryAgencyPersonal];
    arrAddCrit.push(addCrit);

    var addCrit3 = new CriteriaObj();
    addCrit3.DataType = "text";
    addCrit3.propName = "ro.OFFICE_CODE";
    addCrit3.restriction = AdInsConstant.RestrictionIn;
    addCrit3.listValue = [this.OfficeCode];
    arrAddCrit.push(addCrit3);

    this.InputLookupReferantorObj = new InputLookupObj();
    this.InputLookupReferantorObj.urlJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.InputLookupReferantorObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupReferantorObj.pagingJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.InputLookupReferantorObj.genericJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.InputLookupReferantorObj.addCritInput = arrAddCrit;
    this.InputLookupReferantorObj.IsUpdate = true;

    return this.InputLookupReferantorObj;
  }

  //Init Lookup Customer
  initLookupRefTypeCustomer() {
    this.InputLookupReferantorObj = new InputLookupObj();
    this.InputLookupReferantorObj.urlJson = "./assets/uclookup/NAP/lookupReferantorCust.json";
    this.InputLookupReferantorObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupReferantorObj.pagingJson = "./assets/uclookup/NAP/lookupReferantorCust.json";
    this.InputLookupReferantorObj.genericJson = "./assets/uclookup/NAP/lookupReferantorCust.json";
    this.InputLookupReferantorObj.addCritInput = null;
    this.InputLookupReferantorObj.IsUpdate = true;

    return this.InputLookupReferantorObj;
  }

  //Init Lookup Suppl Emp
  initLookupRefTypeSupplEmp() {
    this.InputLookupReferantorObj = new InputLookupObj();
    this.InputLookupReferantorObj.urlJson = "./assets/uclookup/NAP/lookupReferantorSupplEmp.json";
    this.InputLookupReferantorObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputLookupReferantorObj.pagingJson = "./assets/uclookup/NAP/lookupReferantorSupplEmp.json";
    this.InputLookupReferantorObj.genericJson = "./assets/uclookup/NAP/lookupReferantorSupplEmp.json";
    this.InputLookupReferantorObj.addCritInput = null;
    this.InputLookupReferantorObj.IsUpdate = true;

    return this.InputLookupReferantorObj;
  }

  //Reset Bank DDL
  initBankAcc() {
    let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
    return arrCustBankAccCustom;
  }

  //Untuk Lookup
  async SetReferantorLookupChanges(i, event) {
    let refNo = this.getFormAppReferantorObjs().at(i).get("No").value;
    this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
      ReferantorCode : event.ReferantorCode,
      ReferantorName : event.ReferantorName,
      ReferantorType : event.ReferantorType,
      ReferantorTypeDesc : event.ReferantorTypeDesc,

      TaxPayerNo : event.TaxPayerNo == null? "" : event.TaxPayerNo,
      TaxIdNo : event.TaxIdNo,
      TaxIdName : event.TaxPayerName,
      TaxIdAddr : event.Addr,
      TaxIdAreaCode1 : event.Kecamatan,
      TaxIdAreaCode2 : event.Kelurahan,
      TaxIdAreaCode3 : event.RW,
      TaxIdAreaCode4 : event.RT,
      TaxIdCity : event.City,
      TaxIdZipcode : event.ZipCode,
      MrTaxCalcMethod : event.MrTaxCalcMethod,
      IsDisabledCalcMethod: event.MrTaxCalcMethod != "" ? true : false,
      VendorId: event.VendorId,
      IsNpwpExist: event.IsNPWPExist,
    });
    
    if(this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i]["controls"].ReferantorCategory.value == CommonConstant.ReferantorCategoryAgency){
      let vendorBankAccList : Array<VendorBankAccObj> = new Array<VendorBankAccObj>();
      await this.http.post<VendorBankAccObj>(URLConstant.GetListActiveVendorBankAccByVendorCode, { Code: event.ReferantorCode }).toPromise().then(
      (response) => {
        vendorBankAccList = response[CommonConstant.ReturnObj];
        vendorBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
        var isDefaultFound = false;
        let VendorBankAcc : VendorBankAccObj = new VendorBankAccObj;
        for (const item of vendorBankAccList) {
          if (item["IsDefault"]) {
            VendorBankAcc = item as VendorBankAccObj;
            isDefaultFound = true;
            break;
          }
        }

        if (isDefaultFound) {
          this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
            RefBankCode:  VendorBankAcc.BankCode,
            BankAccNo: VendorBankAcc.BankAccountNo,
            BankAccName: VendorBankAcc.BankAccountName,
            BankBranch: VendorBankAcc.BankBranch,
            BankName: VendorBankAcc.BankName,
          });
        }
        else{
          this.ResetBankData(i);
        }
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(vendorBankAccList.length > 0){
        for(let i = 0; i < vendorBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = vendorBankAccList[i].BankCode;
          customBankObj.BankName = vendorBankAccList[i].BankName;
          customBankObj.BankAccountNo = vendorBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = vendorBankAccList[i].BankAccountName;
          customBankObj.IsDefault = vendorBankAccList[i].IsDefault;
          customBankObj.BankBranch = vendorBankAccList[i].BankBranch;
  
          arrCustBankAccCustom.push(customBankObj);
        }
      }

      this.dictBank[refNo] = arrCustBankAccCustom;
    }
    else if(this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i]["controls"].ReferantorCategory.value == CommonConstant.ReferantorCategoryCustomer){
      let custBankAccList : Array<CustBankAccObj> = new Array<CustBankAccObj>();
      await this.http.post<CustBankAccObj>(URLConstant.GetListActiveCustBankAccByCustId, { Id: event.VendorId }).toPromise().then(
      (response) => {
        custBankAccList = response[CommonConstant.ReturnObj];
        custBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
        var isDefaultFound = false;
        let CustBankAcc : CustBankAccObj = new CustBankAccObj;
        for (const item of custBankAccList) {
          if (item["IsDefault"]) {
            CustBankAcc = item as CustBankAccObj;
            isDefaultFound = true;
            break;
          }
        }

        if (isDefaultFound) {
          this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
            RefBankCode:  CustBankAcc.BankCode,
            BankAccNo: CustBankAcc.BankAccountNo,
            BankAccName: CustBankAcc.BankAccountName,
            BankBranch: CustBankAcc.BankBranch,
            BankName: CustBankAcc.BankName,
          });
        }
        else{
          this.ResetBankData(i);
        }
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(custBankAccList.length > 0){
        for(let i = 0; i < custBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = custBankAccList[i].BankCode;
          customBankObj.BankName = custBankAccList[i].BankName;
          customBankObj.BankAccountNo = custBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = custBankAccList[i].BankAccountName;
          customBankObj.IsDefault = custBankAccList[i].IsDefault;
          customBankObj.BankBranch = custBankAccList[i].BankBranch;

          arrCustBankAccCustom.push(customBankObj);
        }
      }
      
      this.dictBank[refNo] = arrCustBankAccCustom;
    }
    else{
      let vendorEmpBankAccList : Array<VendorBankAccObj> = new Array<VendorBankAccObj>();
      await this.http.post<VendorBankAccObj>(URLConstant.GetListActiveVendorBankAccByVendorEmpId, { Id: event.VendorId }).toPromise().then(
      (response) => {
        vendorEmpBankAccList = response[CommonConstant.ReturnObj];
        vendorEmpBankAccList.sort((a, b) => { return (a["IsDefault"] === b["IsDefault"]) ? 0 : a["IsDefault"] ? -1 : 1 });
        var isDefaultFound = false;
        let VendorEmpBankAcc : VendorBankAccObj = new VendorBankAccObj;
        for (const item of vendorEmpBankAccList) {
          if (item["IsDefault"]) {
            VendorEmpBankAcc = item as VendorBankAccObj;
            isDefaultFound = true;
            break;
          }
        }

        if (isDefaultFound) {
          this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
            RefBankCode:  VendorEmpBankAcc.BankCode,
            BankAccNo: VendorEmpBankAcc.BankAccountNo,
            BankAccName: VendorEmpBankAcc.BankAccountName,
            BankBranch: VendorEmpBankAcc.BankBranch,
            BankName: VendorEmpBankAcc.BankName,
          });
        }
        else{
          this.ResetBankData(i);
        }
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(vendorEmpBankAccList.length > 0){
        for(let i = 0; i < vendorEmpBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = vendorEmpBankAccList[i].BankCode;
          customBankObj.BankName = vendorEmpBankAccList[i].BankName;
          customBankObj.BankAccountNo = vendorEmpBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = vendorEmpBankAccList[i].BankAccountName;
          customBankObj.IsDefault = vendorEmpBankAccList[i].IsDefault;
          customBankObj.BankBranch = vendorEmpBankAccList[i].BankBranch;

          arrCustBankAccCustom.push(customBankObj);
        }
      }
      
      this.dictBank[refNo] = arrCustBankAccCustom;
    }
  }

  //Reset Bank Data
  ResetBankData(i){
    this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
      RefBankCode:  "",
      BankAccNo: "",
      BankAccName: "",
      BankBranch: "",
      BankName: ""
    });
  }

  //Change Bank Acc
  ChangeBankAccount(i, event){
    let refNo = this.getFormAppReferantorObjs().at(i).get("No").value;
    if(event == ""){
      this.ResetBankData(i);
    }
    else{
      for(let j = 0; j < this.dictBank[refNo].length ; j++){
        if(this.dictBank[refNo][j]['BankAccountNo'] == event){
          this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
            RefBankCode:  this.dictBank[refNo][j]['BankCode'],
            BankAccNo: this.dictBank[refNo][j]['BankAccountNo'],
            BankAccName: this.dictBank[refNo][j]['BankAccountName'],
            BankBranch: this.dictBank[refNo][j]['BankBranch'],
            BankName: this.dictBank[refNo][j]['BankName']
          });
        }
      }
    }
  }

  ChangeMrTaxCalcMethod(i, event){
    this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i].patchValue({
      MrTaxCalcMethod: event
    });
  }

  SetAppReferantorObj(){
    for (let i = 0; i < this.NapAppReferantorForm.controls["AppReferantorObjs"].value.length; i++) {
      let appReferantorObj = new AppReferantorObj();
      appReferantorObj.VendorId = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].VendorId;
      appReferantorObj.AppId = this.appId;
      appReferantorObj.ReferantorCode = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].ReferantorCode;
      appReferantorObj.ReferantorName = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].ReferantorName;
      appReferantorObj.MrReferantorType = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].ReferantorType;
      appReferantorObj.RefBankCode = this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i]["controls"].RefBankCode.value;
      appReferantorObj.BankAccNo = this.NapAppReferantorForm.controls["AppReferantorObjs"]["controls"][i]["controls"].BankAccNo.value;
      appReferantorObj.BankAccName = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].BankAccName;
      appReferantorObj.BankBranch = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].BankBranch;
      appReferantorObj.TaxIdNo = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdNo;
      appReferantorObj.TaxIdName = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdName;
      appReferantorObj.TaxpayerNo = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxPayerNo;
      appReferantorObj.TaxIdAddr = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAddr;
      appReferantorObj.TaxIdAreaCode1 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode1;
      appReferantorObj.TaxIdAreaCode2 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode2;
      appReferantorObj.TaxIdAreaCode3 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode3;
      appReferantorObj.TaxIdAreaCode4 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode4;
      appReferantorObj.TaxIdCity = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdCity;
      appReferantorObj.TaxIdZipcode = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdZipcode;
      appReferantorObj.MrTaxCalcMethodCode = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].MrTaxCalcMethod;
      appReferantorObj.IsNpwpExist = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].IsNpwpExist;
      appReferantorObj.ReferantorCategory = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].ReferantorCategory;
      appReferantorObj.RowVersion = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].RowVersion;

      this.appReferantorListObj.ReqListAddEditAppReferantorObjs.push(appReferantorObj);
    }
  }

  async SetEditBankDict(AppReferantorObj : NapAppReferantorModel, refNo : number){
    if(AppReferantorObj.ReferantorCategory == CommonConstant.ReferantorCategoryAgency){
      let vendorBankAccList : Array<VendorBankAccObj> = new Array<VendorBankAccObj>();
      await this.http.post<VendorBankAccObj>(URLConstant.GetListActiveVendorBankAccByVendorCode, { Code: AppReferantorObj.ReferantorCode }).toPromise().then(
      (response) => {
        vendorBankAccList = response[CommonConstant.ReturnObj];
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(vendorBankAccList.length > 0){
        for(let i = 0; i < vendorBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = vendorBankAccList[i].BankCode;
          customBankObj.BankName = vendorBankAccList[i].BankName;
          customBankObj.BankAccountNo = vendorBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = vendorBankAccList[i].BankAccountName;
          customBankObj.IsDefault = vendorBankAccList[i].IsDefault;
          customBankObj.BankBranch = vendorBankAccList[i].BankBranch;
  
          arrCustBankAccCustom.push(customBankObj);
        }
      }

      this.dictBank[refNo] = arrCustBankAccCustom;
    }
    else if(AppReferantorObj.ReferantorCategory == CommonConstant.ReferantorCategoryCustomer){
      let custBankAccList : Array<CustBankAccObj> = new Array<CustBankAccObj>();
      await this.http.post<CustBankAccObj>(URLConstant.GetListActiveCustBankAccByCustNo, { Code: AppReferantorObj.ReferantorCode }).toPromise().then(
      (response) => {
        custBankAccList = response[CommonConstant.ReturnObj];
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(custBankAccList.length > 0){
        for(let i = 0; i < custBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = custBankAccList[i].BankCode;
          customBankObj.BankName = custBankAccList[i].BankName;
          customBankObj.BankAccountNo = custBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = custBankAccList[i].BankAccountName;
          customBankObj.IsDefault = custBankAccList[i].IsDefault;
          customBankObj.BankBranch = custBankAccList[i].BankBranch;

          arrCustBankAccCustom.push(customBankObj);
        }
      }
      
      this.dictBank[refNo] = arrCustBankAccCustom;
    }
    else{
      let vendorEmpBankAccList : Array<VendorBankAccObj> = new Array<VendorBankAccObj>();
      await this.http.post<VendorBankAccObj>(URLConstant.GetListActiveVendorBankAccByVendorEmpNo, { Code: AppReferantorObj.ReferantorCode }).toPromise().then(
      (response) => {
        vendorEmpBankAccList = response[CommonConstant.ReturnObj];
      });

      let arrCustBankAccCustom : Array<CustomBankAccObj> = new Array<CustomBankAccObj>();
      if(vendorEmpBankAccList.length > 0){
        for(let i = 0; i < vendorEmpBankAccList.length; i++){
          let customBankObj : CustomBankAccObj = new CustomBankAccObj();
          customBankObj.BankCode = vendorEmpBankAccList[i].BankCode;
          customBankObj.BankName = vendorEmpBankAccList[i].BankName;
          customBankObj.BankAccountNo = vendorEmpBankAccList[i].BankAccountNo;
          customBankObj.BankAccountName = vendorEmpBankAccList[i].BankAccountName;
          customBankObj.IsDefault = vendorEmpBankAccList[i].IsDefault;
          customBankObj.BankBranch = vendorEmpBankAccList[i].BankBranch;

          arrCustBankAccCustom.push(customBankObj);
        }
      }
      
      this.dictBank[refNo] = arrCustBankAccCustom;
    }
  }

  viewDetailReferantor(i : number){
      let appReferantorObj = new AppReferantorTaxInfoObj();
      appReferantorObj.TaxIdNo = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdNo;
      appReferantorObj.TaxIdName = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdName;
      appReferantorObj.TaxpayerNo = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxPayerNo;
      appReferantorObj.TaxIdAddr = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAddr;
      appReferantorObj.TaxIdAreaCode1 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode1;
      appReferantorObj.TaxIdAreaCode2 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode2;
      appReferantorObj.TaxIdAreaCode3 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode3;
      appReferantorObj.TaxIdAreaCode4 = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdAreaCode4;
      appReferantorObj.TaxIdCity = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdCity;
      appReferantorObj.TaxIdZipcode = this.NapAppReferantorForm.controls["AppReferantorObjs"].value[i].TaxIdZipcode;

      const modalPODetail = this.modalService.open(ReferantorDataNewDetailComponent);
      modalPODetail.componentInstance.AppReferantorTaxInfoObj = appReferantorObj;
      modalPODetail.result.then().catch((error) => {
      });
  }

  Cancel() {
    this.outputCancel.emit();
  }
}
