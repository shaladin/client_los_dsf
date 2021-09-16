import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { forkJoin } from 'rxjs';
import { MouCustFctrObj } from 'app/shared/model/MouCustFctrObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustListedCustFctrObj } from 'app/shared/model/MouCustListedCustFctrObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import {MouCustListedCustFctrXComponent} from 'app/impl/MOU/mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr-x.component';
import {URLConstantX} from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-mou-detail-factoring-x',
  templateUrl: './mou-detail-factoring-x.component.html'
})
export class MouDetailFactoringXComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouCustFactoring: EventEmitter<any> = new EventEmitter();
  user: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  isRecourse: boolean
  @ViewChild(MouCustListedCustFctrXComponent) MouListedFctrComp: MouCustListedCustFctrXComponent;
  recourseTypeList: Array<KeyValueObj>;
  wopList: Array<KeyValueObj>;
  paidByList: Array<KeyValueObj>;
  instTypeList: Array<KeyValueObj>;
  singleInstCalcMthdList: Array<KeyValueObj>;
  payFreqList: Array<RefPayFreqObj>;
  instSchmList: Array<KeyValueObj>;
  currencyList: Array<KeyValueObj>;
  isListedFctr: boolean;
  shouldComponentLoad: boolean;
  isTenorInvalid: boolean;
  tenorInvalidMsg: string;
  private mode: string = "add";
  IsSingleIns: boolean = true;
  inputLookupObj: InputLookupObj;
  inputLookupCustObj: InputLookupObj;

  MouDetailFactoringForm = this.fb.group({
    MouCustFctrId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    MrRecourseTypeCode: [''],
    IsDisclosed: [false],
    WopCode: [''],
    MrPaidByCode: [''],
    MrInstTypeCode: [''],
    SingleInstCalcMthd: [''],
    TopDays: ['', [Validators.required, Validators.min(1)]],
    TenorFrom: ['', [Validators.min(0)]],
    TenorTo: ['', [Validators.min(0)]],
    PayFreqCode: [''],
    MrInstSchmCode: [''],
    InterestRatePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    RetentionPrcnt: [0, [Validators.min(0), Validators.max(100)]],
    IsListedCust: [false],
    Notes: [''],
    CurrCode: ['', [Validators.required]],
    RowVersion: [''],
    VendorCode: [''],
    VendorName: [''],
    VendorId: [''],
    CustNo: [''],
    CustName: [''],
    MrCustTypeCode: [''],
    VirtualAccNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private cookieService: CookieService
  ) {
    this.isListedFctr = false;
    this.shouldComponentLoad = false;
  }

  ngOnInit() {
    this.user = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.bindUcLookup();

    var rmRecourseType = new RefMasterObj();
    rmRecourseType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeRecourseType;
    let getRecourseType = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmRecourseType);
    var rmWop = new RefMasterObj();
    rmWop.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWOP;
    let getWop = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmWop);
    var rmPaidBy = new RefMasterObj();
    rmPaidBy.RefMasterTypeCode = CommonConstant.RefMasterTypeCodePaidBy;
    let getPaidBy = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmPaidBy);
    var rmInstType = new RefMasterObj();
    rmInstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstType;
    let getInstType = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmInstType);
    var rmSingleInstCalcMethod = new RefMasterObj();
    rmSingleInstCalcMethod.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeSingleInstCalcMethod;
    let getSingleInstCalcMethod = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmSingleInstCalcMethod);
    let getPayFreq = this.httpClient.post(URLConstant.GetListActiveRefPayFreq, null);
    var rmInstSchm = new RefMasterObj();
    rmInstSchm.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    let getInstSchm = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmInstSchm);
    var refCurr;
    let getCurrency = this.httpClient.post(URLConstant.GetListKvpActiveRefCurr, refCurr);
    var mouCustFctr = new MouCustFctrObj();
    mouCustFctr.MouCustId = this.MouCustId;
    let getMouFctr = this.httpClient.post(URLConstant.GetMouCustFctrByMouCustId, { Id: this.MouCustId });
    forkJoin([getRecourseType, getWop, getPaidBy, getInstType, getSingleInstCalcMethod, getPayFreq, getInstSchm, getCurrency, getMouFctr]).subscribe(
      (response: any) => {
        this.recourseTypeList = response[0].ReturnObject;
        this.wopList = response[1].ReturnObject;
        this.paidByList = response[2].ReturnObject;
        this.instTypeList = response[3].ReturnObject;
        this.singleInstCalcMthdList = response[4].ReturnObject;
        this.payFreqList = response[5].ReturnObject;
        this.instSchmList = response[6].ReturnObject;
        this.currencyList = response[7].ReturnObject;
        var mouFctrData = response[8];
        this.MouDetailFactoringForm.patchValue({
          MrRecourseTypeCode: this.recourseTypeList[0].Key,
          WopCode: this.wopList[0].Key,
          MrPaidByCode: this.paidByList[0].Key,
          MrInstTypeCode: this.instTypeList[0].Key,
          SingleInstCalcMthd: this.singleInstCalcMthdList[0].Key,
          PayFreqCode: this.payFreqList[0].PayFreqCode,
          MrInstSchmCode: this.instSchmList[0].Key,
          CurrCode: this.currencyList[0].Key
        });
        this.isListedFctr = mouFctrData["IsListedCust"];
        if(mouFctrData["MouCustFctrId"] != 0){
          this.mode = "edit";
          this.MouDetailFactoringForm.patchValue({
            // ...mouFctrData
            MouCustFctrId: mouFctrData["MouCustFctrId"],
            MouCustId: mouFctrData["MouCustId"],
            MrRecourseTypeCode: mouFctrData["MrRecourseTypeCode"],
            IsDisclosed: mouFctrData["IsDisclosed"],
            WopCode: mouFctrData["WopCode"],
            MrPaidByCode: mouFctrData["MrPaidByCode"],
            MrInstTypeCode: mouFctrData["MrInstTypeCode"],
            SingleInstCalcMthd: mouFctrData["SingleInstCalcMthd"],
            TopDays: mouFctrData["TopDays"],
            TenorFrom: mouFctrData["TenorFrom"],
            TenorTo: mouFctrData["TenorTo"],
            PayFreqCode: mouFctrData["PayFreqCode"],
            MrInstSchmCode: mouFctrData["MrInstSchmCode"],
            InterestRatePrcnt: mouFctrData["InterestRatePrcnt"],
            RetentionPrcnt: mouFctrData["RetentionPrcnt"],
            IsListedCust: mouFctrData["IsListedCust"],
            Notes: mouFctrData["Notes"],
            CurrCode: mouFctrData["CurrCode"],
            RowVersion: mouFctrData["RowVersion"],
            VendorCode: mouFctrData["VendorCode"],
            VendorName: mouFctrData["VendorName"],
            VendorId: mouFctrData["VendorId"],
            CustNo: mouFctrData["CustNo"],
            CustName: mouFctrData["CustName"],
            MrCustTypeCode: mouFctrData["MrCustTypeCode"],
            VirtualAccNo: mouFctrData["VirtualAccNo"]
          });

          var objVendor = {
            Code: mouFctrData["VendorCode"]
          }
          this.httpClient.post(URLConstant.GetVendorByVendorCode, objVendor).subscribe(
            (responseVendor) => {
              this.inputLookupObj.nameSelect = responseVendor["VendorName"];
              this.inputLookupObj.jsonSelect = { VendorName: responseVendor["VendorName"] , VendorCode: responseVendor["VendorCode"] };
            }
          )

          // var custFactoringObj = {
          //   CustNo: mouFctrData["CustNo"]
          // }
          // this.httpClient.post(URLConstant.GetCustByCustNo, custFactoringObj).subscribe(
          //   (responseVendor) => {
          //     this.inputLookupObj.nameSelect = responseVendor["CustName"];
          //     this.inputLookupObj.jsonSelect = { VendorName: responseVendor["CustName"] , VendorCode: responseVendor["CustNo"] };
          //   }
          // )
        }
        else{
          this.MouDetailFactoringForm.patchValue({
            MouCustId: this.MouCustId
          });
        }
        this.isRecourse = true;
        this.shouldComponentLoad = true;
        this.OnChangeRecourseType(this.MouDetailFactoringForm.controls.MrRecourseTypeCode.value)
      });
  }

  instTypeHandler(){
    var value = this.MouDetailFactoringForm.controls["MrInstTypeCode"].value;
    if(value == CommonConstant.SINGLE_INST_TYPE){
      this.IsSingleIns = true;
      this.MouDetailFactoringForm.patchValue({
        PayFreqCode: CommonConstant.PAY_FREQ_MONTHLY,
        MrInstSchmCode: CommonConstant.INST_SCHM_REGULAR_FIXED
      });
      this.MouDetailFactoringForm.controls["PayFreqCode"].disable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].disable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].enable();
      this.MouDetailFactoringForm.controls["TopDays"].setValidators([Validators.required, Validators.min(1)]);
      this.MouDetailFactoringForm.patchValue({
        SingleInstCalcMthd: this.singleInstCalcMthdList[0].Key
      });
    }
    else if(value == CommonConstant.MULTIPLE_INST_TYPE){
      this.IsSingleIns = false;
      this.MouDetailFactoringForm.controls["PayFreqCode"].enable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].enable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].disable();
      this.MouDetailFactoringForm.controls["TopDays"].clearValidators();
      this.MouDetailFactoringForm.patchValue({
        SingleInstCalcMthd : '',
        TopDays: ''
      });
    }
  }

  Save(){
    const formData = this.MouDetailFactoringForm.getRawValue();
    let url;

    if (this.isRecourse) {
      formData.IsListedCust = this.MouListedFctrComp.MouCustIsListedForm.controls["IsListedCust"].value;
      if(formData.IsListedCust){
        if(!this.MouListedFctrComp.MouCustIsListedForm.controls["ListCust"] || this.MouListedFctrComp.MouCustIsListedForm.controls["ListCust"]["controls"]["length"] <= 0){
          this.toastr.warningMessage("At Least 1 Listed Customer Factoring Needed To Submit");
          return false;
        }
    }
    }

    if(this.IsSingleIns){
    }else{
      if((formData.TenorFrom != "" || formData.TenorTo != "") && formData.TenorFrom > formData.TenorTo){
        this.isTenorInvalid = true;
        this.tenorInvalidMsg = "Invalid Tenor Range";
        return false;
      }
      else{
        if(formData.TenorFrom == ""){
          formData.TenorFrom = 0;
        }
        if(formData.TenorTo == ""){
          formData.TenorTo = 0;
        }
        this.isTenorInvalid = false;
        this.tenorInvalidMsg = "";
      }
    }

    if (this.isRecourse === true) {
      if (this.listedCusts.length > 0) {
        formData.IsListedCust = true
      }
      else {
        formData.IsListedCust = false
      }
    }

    if(this.mode == "add"){
      url = URLConstantX.AddMouCustFctrX;
    }
    else{
      url = URLConstantX.EditMouCustFctrX;
    }

    this.httpClient.post(url, formData).subscribe(
      (response) => {
        this.ResponseMouCustFactoring.emit(response);
      });
    this.httpClient.post(URLConstant.AddorEditListMouCustListedCustFctr, { MouCustId : this.MouCustId, ListMouCustListedCustFctrs: this.listedCusts }).subscribe(
      (response) => {
        console.log(response);
      });
  }

  listedCusts: Array<MouCustListedCustFctrObj> = new Array<MouCustListedCustFctrObj>();
  GetDataListCustFctr(ev) {
    this.listedCusts = ev;
    console.log(this.listedCusts);
  }

  GetIsListedCust(ev){
    this.isListedFctr = ev.value;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  OnChangeRecourseType(recourseType: string) {
    if (recourseType === CommonConstant.WITH_RECOURSE_TYPE) {
      this.inputLookupCustObj.isRequired = false;
      this.inputLookupCustObj.isReady = false;
      this.isRecourse = true;
      this.MouDetailFactoringForm.patchValue({
        MrPaidByCode: CommonConstant.PAID_BY_CUST
      });
      this.MouDetailFactoringForm.controls.MrPaidByCode.disable();
      this.MouDetailFactoringForm.controls.MrInstTypeCode.enable();
      this.MouDetailFactoringForm.controls.IsDisclosed.enable();
      this.MouDetailFactoringForm.controls.IsDisclosed.setValue(false);

      this.MouDetailFactoringForm.updateValueAndValidity();

    }
    else if (recourseType === CommonConstant.WITHOUT_RECOURSE_TYPE) {
      this.inputLookupCustObj.isRequired = true;
      this.inputLookupCustObj.isReady = true;

      this.isRecourse = false;
      this.MouDetailFactoringForm.patchValue({
        MrPaidByCode: CommonConstant.PAID_BY_CUST_FCTR,
        MrInstTypeCode: CommonConstant.SINGLE_INST_TYPE
      });
      this.MouDetailFactoringForm.controls.MrPaidByCode.disable();
      this.MouDetailFactoringForm.controls.MrInstTypeCode.disable();
      this.MouDetailFactoringForm.controls.IsDisclosed.disable();
      this.MouDetailFactoringForm.controls.IsDisclosed.setValue(true);
      this.MouDetailFactoringForm.updateValueAndValidity();

      this.httpClient.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, { Id: this.MouCustId }).subscribe(
        (response) => {
          this.listedCusts = new Array<MouCustListedCustFctrObj>();
          var listedCusts = response[CommonConstant.ReturnObj];

          if (listedCusts.length > 0) {
            this.MouDetailFactoringForm.patchValue({
              CustNo: listedCusts[0].CustNo
            });

            this.inputLookupCustObj.nameSelect = listedCusts[0].CustName;
            this.inputLookupCustObj.jsonSelect = { CustNo: listedCusts[0].CustNo , CustName: listedCusts[0].CustName };
            this.setCustName(listedCusts[0].CustNo, listedCusts[0].MouListedCustFctrId)
          }
        })
    }
    this.instTypeHandler();
  }

  bindUcLookup() {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var suppCrit = new Array();
    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = currentUserContext[CommonConstant.OFFICE_CODE];;
    //suppCrit.push(critSuppObj);

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.inputLookupObj.isReadonly = false;
    this.inputLookupObj.isRequired = true;
    this.inputLookupObj.addCritInput = suppCrit;
    this.inputLookupObj.isReady = true;
    this.initLookupCustFactoring();
  }

  initLookupCustFactoring(){
    this.inputLookupCustObj = new InputLookupObj();
    this.inputLookupCustObj.isReady = false;
    this.inputLookupCustObj.isRequired = false;
    this.inputLookupCustObj.urlJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    this.inputLookupCustObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupCustObj.pagingJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    this.inputLookupCustObj.genericJson = "./assets/uclookup/MOU/lookupCust_MOUListCustFctr.json";
    this.inputLookupCustObj.ddlEnvironments = [
      {
        name: "A.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url + "/v1"
      }
    ];
  }

  SetSupplier(e) {
    this.MouDetailFactoringForm.patchValue({
      VendorCode: e.VendorCode,
      VendorName: e.VendorName,
      VendorId: e.VendorId
    });
  }

  SetCustomer(e) {
    this.MouDetailFactoringForm.patchValue({
      CustNo: e.CustNo
    });

    this.setCustName(e.CustNo)
  }

  setCustName(custNo: string, MouListedCustFctrId?: number) {
    this.httpClient.post(URLConstant.GetCustByCustNo, { CustNo: custNo }).subscribe((response) => {

      this.MouDetailFactoringForm.patchValue({
        CustName: response["CustName"],
        MrCustTypeCode: response["MrCustTypeCode"]
      });

      let obj: MouCustListedCustFctrObj = new MouCustListedCustFctrObj()

      if (MouListedCustFctrId !== null || MouListedCustFctrId !== 0) {
        obj.MouListedCustFctrId = MouListedCustFctrId
      }
      else {
        obj.MouListedCustFctrId = 0
      }

      obj.MouCustId = this.MouCustId
      obj.CustNo = response["CustNo"]
      obj.CustName = response["CustName"]
      obj.MrCustTypeCode = response["MrCustTypeCode"]

      if(!this.isRecourse && this.listedCusts.length > 0)
      {
        this.listedCusts = new Array<MouCustListedCustFctrObj>();
      }
      
      this.listedCusts.push(obj)
    });
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.MouDetailFactoringForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }
}
