import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NapAppReferantorModel } from 'app/shared/model/nap-app-referantor.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-referantor-data-FL4W',
  templateUrl: './referantor-data-FL4W.component.html'
})
export class ReferantorDataFL4WComponent implements OnInit {

  @Input() appId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputLookupObj: InputLookupObj = new InputLookupObj();
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private cdRef: ChangeDetectorRef
  ) { }

  NapAppReferantorForm = this.fb.group({
    CheckBoxAppReferantor: [false],
    ReferantorName: [''],
    ReferantorType: [''],
    AccountBank: ['']
  });

  ReferantorOn = false;
  NpwpOn: boolean = false;
  appReferantorObj: NapAppReferantorModel;
  ExistedData: boolean;
  arrAddCrit: Array<CriteriaObj>;
  async ngOnInit() {
    this.appReferantorObj = new NapAppReferantorModel();
    this.ExistedData = false;

    await this.GetAppData();
    this.GetInputLookupObj();
    this.getAppReferantorData();
  }

  OfficeCode: String;
  async GetAppData() {
    var obj = { Id: this.appId };
    await this.http.post<AppObj>(URLConstant.GetAppById, obj).toPromise().then(
      (response) => {
        this.OfficeCode = response.OriOfficeCode;
      }
    );
  }

  GetInputLookupObj() {
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "v.MR_VENDOR_CATEGORY_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [URLConstant.VendorCategoryAgencyCompany, URLConstant.VendorCategoryAgencyPersonal];
    this.arrAddCrit.push(addCrit);

    var addCrit3 = new CriteriaObj();
    addCrit3.DataType = "text";
    addCrit3.propName = "ro.OFFICE_CODE";
    addCrit3.restriction = AdInsConstant.RestrictionIn;
    addCrit3.listValue = [this.OfficeCode];
    this.arrAddCrit.push(addCrit3);

    //Look Up Obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.inputLookupObj.nameSelect = this.appReferantorObj.ReferantorName;
    this.inputLookupObj.isRequired = false;
  }

  getAppReferantorData() {
    // Check Data App Id
    var obj = {
      Id: this.appId,
      RowVersion: "",
    }

    this.http.post(URLConstant.GetAppReferantorByAppId, obj).subscribe(
      (response: NapAppReferantorModel) => {
        if (response["AppReferantorId"] != 0) {
          this.ReferantorOn = true;
          this.ExistedData = true;
          this.appReferantorObj = response;
          this.inputLookupObj.nameSelect = this.appReferantorObj.ReferantorName;
          this.inputLookupObj.jsonSelect = response;
          this.NapAppReferantorForm.controls.AccountBank.enable();
          this.NpwpOn = true;
          this.NapAppReferantorForm.patchValue({
            CheckBoxAppReferantor: true,
            AccountBank: this.appReferantorObj.BankAccNo
          });
          this.NapAppReferantorForm.get("AccountBank").setValidators(Validators.required);
          this.NapAppReferantorForm.get("AccountBank").updateValueAndValidity();
          this.cdRef.detectChanges();
          this.getDDLBank(this.appReferantorObj.ReferantorCode);
        }
        this.inputLookupObj.isReady = true;
      });
  }

  SaveData(url) {
    this.http.post(url, this.appReferantorObj).subscribe(
      (response) => {
      });
  }

  ClickSave() {
    var url;
    if (this.ExistedData) {
      if (this.ReferantorOn) {
        // save
        url = URLConstant.EditAppReferantor;
        this.SaveData(url);
        // this.wizard.goToNextStep();
        this.toastr.successMessage('Save Edit Data');
        this.outputTab.emit();
      } else {
        // delete & go to paging
        url = URLConstant.DeleteAppReferantor;
        this.SaveData(url);
        // this.wizard.goToNextStep();
        this.toastr.successMessage('Remove Data');
        this.outputTab.emit();
      }
    } else {
      if (this.ReferantorOn) {
        // save
        url = URLConstant.AddAppReferantor;
        this.appReferantorObj.AppId = this.appId;
        this.SaveData(url);
        // this.wizard.goToNextStep();
        this.toastr.successMessage('Save New Data');
        this.outputTab.emit();
      } else {
        // this.wizard.goToNextStep();
        this.outputTab.emit();
      }
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  TurnReferantor() {
    this.inputLookupObj.isReady = false;
    this.ReferantorOn = this.NapAppReferantorForm.controls.CheckBoxAppReferantor.value;
    if (this.ReferantorOn == false) {
      this.inputLookupObj.isRequired = false;
      this.inputLookupObj.isReady = true;
      this.NapAppReferantorForm.controls.ProductOfferingIdentifier["controls"].value.clearValidators();
      this.NapAppReferantorForm.controls.AccountBank.clearValidators();
      this.NapAppReferantorForm.controls.AccountBank.updateValueAndValidity();
      // this.NapAppReferantorForm.controls.AccountBank.disable();
    } else {
      this.inputLookupObj.isRequired = true;
      this.inputLookupObj.isReady = true;
      // this.NapAppReferantorForm.controls.AccountBank.enable();
      this.NapAppReferantorForm.controls.AccountBank.setValidators(Validators.required);
      this.NapAppReferantorForm.controls.AccountBank.updateValueAndValidity();
    }
  }

  getLookupAppReferantorResponse(ev) {
    this.appReferantorObj.ReferantorCode = ev.ReferantorCode;
    this.appReferantorObj.ReferantorName = ev.ReferantorName;
    this.appReferantorObj.MrReferantorType = ev.ReferantorType;

    this.appReferantorObj.TaxpayerNo = ev.TaxPayerNo;
    this.appReferantorObj.TaxIdNo = ev.TaxIdNo;
    this.appReferantorObj.TaxIdName = ev.TaxPayerName;
    this.appReferantorObj.TaxIdAddr = ev.Addr;
    this.appReferantorObj.TaxIdAreaCode1 = ev.Kecamatan;
    this.appReferantorObj.TaxIdAreaCode2 = ev.Kelurahan;
    this.appReferantorObj.TaxIdAreaCode3 = ev.RW;
    this.appReferantorObj.TaxIdAreaCode4 = ev.RT;
    this.appReferantorObj.TaxIdCity = ev.City;
    this.appReferantorObj.TaxIdZipcode = ev.ZipCode;
    this.appReferantorObj.MrTaxCalcMethod = ev.MrTaxCalcMethod;

    this.NapAppReferantorForm.patchValue({
      AccountBank: ""
    });
    this.NpwpOn = true;

    this.getDDLBank(ev.ReferantorCode);
  }

  getDDLBank(VendorCode) {
    this.http.post(URLConstant.GetListVendorBankAccByVendorCode, { Code: VendorCode }).subscribe(
      (response) => {
        this.bankItems = response[CommonConstant.ReturnObj];
        var bankItem = this.bankItems.find(x => x.IsDefault == true);

        this.NapAppReferantorForm.patchValue({
          AccountBank: bankItem.BankCode != null ? bankItem.BankAccountNo : ""
        });
      });
  }

  bankItems = [];
  ChangeValueBank(ev) {
    var idx = ev.target.selectedIndex - 1;
    if (idx < 0) return;
    this.appReferantorObj.RefBankCode = this.bankItems[idx].BankCode;
    this.appReferantorObj.BankAccNo = this.bankItems[idx].BankAccountNo;
    this.appReferantorObj.BankAccName = this.bankItems[idx].BankAccountName;
    this.NapAppReferantorForm.patchValue({
      AccountBank: this.bankItems[idx].BankAccountNo
    });
  }
}
