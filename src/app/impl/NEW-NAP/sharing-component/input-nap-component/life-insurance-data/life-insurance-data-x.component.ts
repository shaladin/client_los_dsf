
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { LifeInsObj } from 'app/shared/model/life-ins-obj.model';
import { LifeInsDObj } from 'app/shared/model/life-ins-d-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { AppLifeInsRuleObj } from 'app/shared/model/app-life-ins/app-life-ins-rule-obj.model';
import { ReqGetVendorByCategoryCodeAndOfficeCodeObj } from 'app/shared/model/request/vendor/req-vendor.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
@Component({
  selector: 'app-life-insurance-data-x',
  templateUrl: './life-insurance-data-x.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class LifeInsuranceDataXComponent implements OnInit {
  @Input() AppId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();
  show: boolean;
  LifeInsObj: LifeInsObj = new LifeInsObj();
  LifeInsDObj: LifeInsDObj;
  IsChecked: boolean;
  mode: string = "add";
  ListObj: Array<LifeInsDObj> = new Array<LifeInsDObj>();
  result: LifeInsObj = new LifeInsObj();
  minInsLength: number = 1;
  maxInsLength: number = 99;
  appLifeInsRuleObj: AppLifeInsRuleObj = new AppLifeInsRuleObj();
  CustAdminFeeAmtPatched: boolean = false;
  isHideLifeInsuranceCapitalizedMethod:boolean = false;
  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.AppId = params["AppId"];
    })
  }
  LifeInsForm = this.fb.group({
    IsChecked: [false],
    LifeInscoBranchName: [''],
    MrLifeInsPaidMethodCode: [''],
    PaidInAdvPrcnt: [''],
    NewCoverNotes: [''],
    CustAdminFeeAmt: [''],
  });
  LifeInscoBranchName: Array<object>;
  MrLifeInsPaidMethodCode: Array<KeyValueObj>;
  AppLifeInsHId: number;
  async ngOnInit(): Promise<void> {
    await this.initPaidMethod();
    await this.initBranchName();
    this.LifeInsObj.AppId = this.AppId;
    this.http.post<AppCustObj>(URLConstant.GetAppCustByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        if (response.MrCustTypeCode == CommonConstant.CustTypeCompany) {
          this.LifeInsForm.controls["IsChecked"].disable();
        }
      });
    this.http.post<LifeInsObj>(URLConstant.GetAppLifeInsHByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.result = response;
        this.AppLifeInsHId = this.result.AppLifeInsHId;
        if (this.result.AppLifeInsHId != 0) {
          this.mode = "edit";
          this.show = true;
          this.IsChecked = true;
          this.LifeInsForm.patchValue({
            IsChecked: true,
            LifeInscoBranchName: this.result.LifeInscoBranchCode,
            MrLifeInsPaidMethodCode: this.isHideLifeInsuranceCapitalizedMethod && this.result.MrLifeInsPaidMethodCode!=CommonConstantX.PAID_IN_ADV ?"":this.result.MrLifeInsPaidMethodCode,
            PaidInAdvPrcnt: 100 - this.result.PaidInAdvPrcnt,
            NewCoverNotes: this.result.NewCoverNotes,
            CustAdminFeeAmt: this.result.CustAdminFeeAmt
          });
          this.CustAdminFeeAmtPatched = true;
          this.LifeInsObj.InscoAdminFeeAmt = this.result.InscoAdminFeeAmt;
          this.checked();
        }
        else {
          this.mode = "add";
          this.show = false;
        }
        this.initAppLifeInsD();
        this.PremiMethodForm();
      });
  }
  async initPaidMethod() {
    this.isHideLifeInsuranceCapitalizedMethod = false;
    
    let generalSettingObj: object = {
      code: CommonConstantX.GsCodeHideLifeInsCapitalized
    }
    await this.http.post(URLConstant.GetGeneralSettingByCode, generalSettingObj).toPromise().then(
      (response: { GsValue: string }) => {
        if(response.GsValue == CommonConstantX.GsValueOfHideLifeInsCapitalized){
          this.isHideLifeInsuranceCapitalizedMethod = true
        }
      }
    );
    if(this.isHideLifeInsuranceCapitalizedMethod){
      let paidMethodObj: object = {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLifeInsPayMethod,
        masterCode: CommonConstant.LifeInsPayMethodFullPaidInAdvance
      }
      await this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, paidMethodObj).toPromise().then(
        (response: { MasterCode: string, Descr: string}) => {
          if(response.MasterCode != null && response.Descr != null){
            let keyValue: KeyValueObj = new KeyValueObj();
            keyValue.Key = response.MasterCode
            keyValue.Value = response.Descr
            
            let arrKeyValue: Array<KeyValueObj> = new Array<KeyValueObj>();
            arrKeyValue.push(keyValue);
            
            this.MrLifeInsPaidMethodCode = arrKeyValue
          }
        }
      );
    }else{
      var paidMethodObj = {
        RefMasterTypeCode: CommonConstant.RefMasterTypeCodeLifeInsPayMethod,
        RowVersion: ""
      }
      await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, paidMethodObj).toPromise().then(
        (response) => {
          this.MrLifeInsPaidMethodCode = response[CommonConstant.ReturnObj];
        }
      );
    }
  }
  LifeInscoBranchNameObj = {
    MrVendorCategory: CommonConstant.RefMasterTypeCodeLifeInscoBranch,
    OfficeCode: "",
    RowVersion: ""
  }
  async initBranchName() {
    await this.http.post(URLConstant.GetAppById, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.LifeInscoBranchNameObj.OfficeCode = response["OriOfficeCode"];
      }
    );
    let ReqGetListActiveVendor : ReqGetVendorByCategoryCodeAndOfficeCodeObj = new ReqGetVendorByCategoryCodeAndOfficeCodeObj();
    ReqGetListActiveVendor.MrVendorCategory = this.LifeInscoBranchNameObj.MrVendorCategory;
    ReqGetListActiveVendor.OfficeCode = this.LifeInscoBranchNameObj.OfficeCode;
    await this.http.post(URLConstant.GetListActiveVendorByCategoryCodeAndOfficeCode, ReqGetListActiveVendor).toPromise().then(
      (response) => {
        this.LifeInscoBranchName = response[CommonConstant.ReturnObj];
      }
    );
  }
  initAppLifeInsD() {
    var lifeInsObj = new LifeInsObj();
    lifeInsObj.AppId = this.AppId;
    lifeInsObj.AppLifeInsHId = this.AppLifeInsHId;
    this.http.post(URLConstant.InitAppLifeInsH, lifeInsObj).subscribe(
      (response) => {
        this.ListObj = new Array<LifeInsDObj>();
        this.ListObj = response["ListAppLifeInsD"];
        for (let i = 0; i < this.ListObj.length; i++) {
          if (this.ListObj[i].IsChecked == true) {
            var LifeInsD = new LifeInsDObj();
            LifeInsD.InsuredName = this.ListObj[i].InsuredName;
            LifeInsD.Age = this.ListObj[i].Age;
            LifeInsD.MrCustTypeCode = this.ListObj[i].MrCustTypeCode;
            LifeInsD.SeqNo = this.ListObj[i].SeqNo;
            LifeInsD.BaseRate = this.ListObj[i].BaseRate;
            LifeInsD.CustRate = this.ListObj[i].CustRate;
            LifeInsD.InscoRate = this.ListObj[i].InscoRate;
            LifeInsD.SumInsured = this.ListObj[i].SumInsured;
            LifeInsD.DiscRate = this.ListObj[i].DiscRate;
            LifeInsD.DiscRateToInsco = this.ListObj[i].DiscRateToInsco;
            this.LifeInsObj.ListAppLifeInsD.push(LifeInsD);
          }
        }
        this.GetRule(this.LifeInsForm.controls.LifeInscoBranchName.value);
      });
  }
  checked() {
    this.IsChecked = this.LifeInsForm.controls.IsChecked.value;
    if (this.IsChecked) {
      this.show = true;
      this.setValidator();
    } else {
      this.show = false;
      this.unsetValidator();
    }
  }
  setValidator() {
    this.LifeInsForm.controls.LifeInscoBranchName.setValidators(Validators.required);
    this.LifeInsForm.controls.LifeInscoBranchName.updateValueAndValidity();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.setValidators(Validators.required);
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.updateValueAndValidity();
    this.LifeInsForm.controls.PaidInAdvPrcnt.setValidators([Validators.required, Validators.min(0.00), Validators.max(100.00)]);
    this.LifeInsForm.controls.PaidInAdvPrcnt.updateValueAndValidity();
    this.LifeInsForm.controls.CustAdminFeeAmt.setValidators([Validators.required]);
    this.LifeInsForm.controls.CustAdminFeeAmt.updateValueAndValidity();
  }
  unsetValidator() {
    this.LifeInsForm.controls.LifeInscoBranchName.clearValidators();
    this.LifeInsForm.controls.LifeInscoBranchName.updateValueAndValidity();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.clearValidators();
    this.LifeInsForm.controls.MrLifeInsPaidMethodCode.updateValueAndValidity();
    this.LifeInsForm.controls.PaidInAdvPrcnt.clearValidators();
    this.LifeInsForm.controls.PaidInAdvPrcnt.updateValueAndValidity();
    this.LifeInsForm.controls.CustAdminFeeAmt.clearValidators();
    this.LifeInsForm.controls.CustAdminFeeAmt.updateValueAndValidity();
  }
  setValue() {
    if (this.IsChecked) {
      this.LifeInsObj.LifeInscoBranchCode = this.LifeInsForm.controls.LifeInscoBranchName.value;
      this.LifeInsObj.LifeInscoBranchName = this.LifeInscoBranchName.find(i => i["VendorCode"] == this.LifeInsForm.controls.LifeInscoBranchName.value)["VendorName"];
      this.LifeInsObj.MrLifeInsPaidMethodCode = this.LifeInsForm.controls.MrLifeInsPaidMethodCode.value;
      this.LifeInsObj.PaidInAdvPrcnt = this.LifeInsForm.controls.PaidInAdvPrcnt.value;
      this.LifeInsObj.NewCoverNotes = this.LifeInsForm.controls.NewCoverNotes.value;
      this.LifeInsObj.CustAdminFeeAmt = this.LifeInsForm.controls.CustAdminFeeAmt.value;
      this.LifeInsObj.AppId = this.AppId;
      //pindahin subject customer ke seq no paling pertama
      if (this.LifeInsObj.ListAppLifeInsD.length > 0) {
        var custIndex = this.LifeInsObj.ListAppLifeInsD.findIndex(x => x.MrCustTypeCode == CommonConstant.LifeInsCustTypeCustomer);
        if (custIndex != -1) {
          this.LifeInsObj.ListAppLifeInsD.splice(0, 0, this.LifeInsObj.ListAppLifeInsD.splice(custIndex, 1)[0]);
        }
      }
      for (let i = 0; i < this.LifeInsObj.ListAppLifeInsD.length; i++) {
        this.LifeInsObj.ListAppLifeInsD[i].SeqNo = i + 1;
        var sumInsRateObj = this.appLifeInsRuleObj.SumInsRateObjs.find(x => this.LifeInsObj.ListAppLifeInsD[i].Age >= x.MinAge && this.LifeInsObj.ListAppLifeInsD[i].Age <= x.MaxAge);
        if (sumInsRateObj != undefined) {
          this.LifeInsObj.ListAppLifeInsD[i].BaseRate = sumInsRateObj.BaseRate;
          this.LifeInsObj.ListAppLifeInsD[i].CustRate = sumInsRateObj.CustRate;
          this.LifeInsObj.ListAppLifeInsD[i].InscoRate = sumInsRateObj.InscoRate;
          this.LifeInsObj.ListAppLifeInsD[i].SumInsured = sumInsRateObj.SumInsured;
        } else {
          this.LifeInsObj.ListAppLifeInsD[i].BaseRate = 0;
          this.LifeInsObj.ListAppLifeInsD[i].CustRate = 0;
          this.LifeInsObj.ListAppLifeInsD[i].InscoRate = 0;
          this.LifeInsObj.ListAppLifeInsD[i].SumInsured = 0;
        }
        var discRateObj = this.appLifeInsRuleObj.DiscRateObjs.find(x => this.LifeInsObj.ListAppLifeInsD[i].SeqNo == x.Person);
        if (discRateObj != undefined) {
          this.LifeInsObj.ListAppLifeInsD[i].DiscRate = discRateObj.DiscountRateToCust;
          this.LifeInsObj.ListAppLifeInsD[i].DiscRateToInsco = discRateObj.DiscountRateToInsco;
        } else {
          this.LifeInsObj.ListAppLifeInsD[i].DiscRate = 0;
          this.LifeInsObj.ListAppLifeInsD[i].DiscRateToInsco = 0;
        }
        var validationObj = this.appLifeInsRuleObj.ValidationObjs.find(x => this.LifeInsObj.ListAppLifeInsD[i].Age >= x.AgeMin && this.LifeInsObj.ListAppLifeInsD[i].Age <= x.AgeMax);
        if (validationObj != undefined) {
          this.toastr.warningMessage(validationObj.Validation);
          return false;
        }
      }
    }
    return true;
  }
  InscoBranchChanged(ev) {
    this.GetRule(ev.target.value);
  }
  GetRule(vendorCode) {
    var object = {
      AppId: this.AppId,
      VendorCode: vendorCode
    }
    this.http.post<AppLifeInsRuleObj>(URLConstant.GetRuleRateV2, object).subscribe(
      response => {
        this.appLifeInsRuleObj = response;
        this.LifeInsObj.InscoAdminFeeAmt = this.appLifeInsRuleObj.ResultLifeInsFeeObj.AdminFeeFromInscoBranch;
        if(!this.CustAdminFeeAmtPatched){
          this.LifeInsForm.patchValue({
            CustAdminFeeAmt: this.appLifeInsRuleObj.ResultLifeInsFeeObj.AdminFeeToCust
          });
        }
      }
    );
  }
  isCoverCheck() {
    for (let i = 0; i < this.LifeInsObj.ListAppLifeInsD.length; i++) {
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "CUSTOMER") {
        this.LifeInsObj.IsCustCover = true;
      }
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "SPOUSE") {
        this.LifeInsObj.IsSpouseCover = true;
      }
      if (this.LifeInsObj.ListAppLifeInsD[i].MrCustTypeCode == "GUARANTOR") {
        this.LifeInsObj.IsGuarantorCover = true;
      }
    } 
  }
  checkSubject() {
    let res = [];
    for (let i = 0; i < this.LifeInsObj.ListAppLifeInsD.length; i++) {
      var existItem = res.find(x => x == this.LifeInsObj.ListAppLifeInsD[i].InsuredName)
      if (existItem) {
        this.toastr.warningMessage(ExceptionConstant.CANNOT_INSURE_SAME_PERSON);
        return false;
      } else {
        res.push(this.LifeInsObj.ListAppLifeInsD[i].InsuredName);
      }
    }
    if (this.LifeInsObj.ListAppLifeInsD.length == 0) {
      this.toastr.warningMessage(ExceptionConstant.MIN_1_SUBJECT);
      return false;
    } else {
      return true;
    }
  }
  async SaveForm() { 
    if (this.setValue() == false) return; // ada validasi dr rule
    this.isCoverCheck();
    if (this.IsChecked) {
      if (this.checkSubject() == false) return;
      this.LifeInsObj.AppId = this.AppId;
      if (this.mode == "add") {
        this.http.post(URLConstant.AddAppLifeInsH, this.LifeInsObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            // this.wizard.goToNextStep()
            this.outputTab.emit();
          });
      } else {
        this.LifeInsObj.RowVersion = this.result.RowVersion;
        this.http.post(URLConstant.EditAppLifeInsH, this.LifeInsObj).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            // this.wizard.goToNextStep()
            this.outputTab.emit();
          });
      }
    } else {
      if (this.AppLifeInsHId == 0){
        this.outputTab.emit();
        return;
      }
      this.http.post(URLConstant.DeleteAppLifeIns, { Id: this.AppLifeInsHId }).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          // this.wizard.goToNextStep()
          this.outputTab.emit();
        });
    }
  }
  Cancel() {
    this.outputCancel.emit();
  }
  ObjSelected(event, i) {
    if (event.target.checked) {
      var LifeInsD = new LifeInsDObj();
      LifeInsD.InsuredName = this.ListObj[i]["InsuredName"];
      LifeInsD.Age = this.ListObj[i]["Age"];
      LifeInsD.MrCustTypeCode = this.ListObj[i]["MrCustTypeCode"];
      // LifeInsD.SeqNo = this.LifeInsObj.ListAppLifeInsD.length + 1;
      // var object = {
      //   AppId: this.AppId,
      //   VendorCode: this.LifeInsForm.controls.LifeInscoBranchName.value,
      //   Age: LifeInsD.Age,
      //   SeqNo: LifeInsD.SeqNo
      // }
      this.LifeInsObj.ListAppLifeInsD.push(LifeInsD);
    } else {
      var index = this.LifeInsObj.ListAppLifeInsD.findIndex(x => x.InsuredName == this.ListObj[i].InsuredName);
      this.LifeInsObj.ListAppLifeInsD.splice(index, 1);
    }
  }
  PremiMethodChanged(event) {
    if (event.target.value == CommonConstant.LifeInsPayMethodFullPaidInAdvance
    ) {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 0
      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else if (event.target.value == CommonConstant.LifeInsPayMethodFullCapitalized) {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 100
      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else {
      this.LifeInsForm.controls["PaidInAdvPrcnt"].enable();
    }
  }
  PremiMethodForm() {
    if (this.LifeInsForm.controls["MrLifeInsPaidMethodCode"].value == CommonConstant.LifeInsPayMethodFullPaidInAdvance) {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 0
      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else if (this.LifeInsForm.controls["MrLifeInsPaidMethodCode"].value == CommonConstant.LifeInsPayMethodFullCapitalized) {
      this.LifeInsForm.patchValue({
        PaidInAdvPrcnt: 100
      });
      this.LifeInsForm.controls["PaidInAdvPrcnt"].disable();
    }
    else {
      this.LifeInsForm.controls["PaidInAdvPrcnt"].enable();
    }
  }
}