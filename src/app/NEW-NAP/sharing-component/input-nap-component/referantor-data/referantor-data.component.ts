import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-referantor-data',
  templateUrl: './referantor-data.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class ReferantorDataComponent implements OnInit {

  @Input() appId: any;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  inputLookupObj: InputLookupObj;
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
  NpwpOn = false;
  appReferantorObj;
  ExistedData;
  arrAddCrit;
  async ngOnInit() {
    this.appReferantorObj = new NapAppReferantorModel();
    this.ExistedData = false;
    
    await this.GetAppData();
    this.GetInputLookupObj();
    this.getAppReferantorData();
    console.log(this.bankItems);
  }

  OfficeCode: String;
  async GetAppData() {
    var obj = { AppId: this.appId };
    await this.http.post<AppObj>(AdInsConstant.GetAppById, obj).toPromise().then(
      (response) => {
        console.log(response);
        this.OfficeCode = response.OriOfficeCode;
        console.log(this.OfficeCode);
      }
    );
  }

  GetInputLookupObj(){
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "v.MR_VENDOR_CATEGORY_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [AdInsConstant.VendorCategoryAgencyCompany, AdInsConstant.VendorCategoryAgencyPersonal];
    this.arrAddCrit.push(addCrit);

    // var addCrit1 = new CriteriaObj(); 
    // addCrit1.DataType = "bool";
    // addCrit1.propName = "vba.IS_DEFAULT";
    // addCrit1.restriction = AdInsConstant.RestrictionIn;
    // addCrit1.listValue = [1];
    // this.arrAddCrit.push(addCrit1);

    var addCrit3 = new CriteriaObj(); 
    addCrit3.DataType = "text";
    addCrit3.propName = "ro.OFFICE_CODE";
    addCrit3.restriction = AdInsConstant.RestrictionIn;
    addCrit3.listValue = [this.OfficeCode];
    this.arrAddCrit.push(addCrit3);

    //Look Up Obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.inputLookupObj.nameSelect = this.appReferantorObj.ReferantorName;
    this.inputLookupObj.isRequired = false;
    this.NapAppReferantorForm.controls.AccountBank.disable();
  }
  
  getAppReferantorData() {
    // data dummy test
    // var tempId = 11;
    // this.appId = tempId;

    // Check Data App Id
    var obj = {
      AppId: this.appId,
      RowVersion: "",
    }

    this.http.post(AdInsConstant.GetAppReferantorByAppId, obj).subscribe(
      (response) => {
        console.log(response);
        if(response["AppReferantorId"]!=0){
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
          this.cdRef.detectChanges();
          console.log(this.NapAppReferantorForm);
          this.getDDLBank(this.appReferantorObj.ReferantorCode);
        }
        this.inputLookupObj.isReady = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveData(url) {
    this.http.post(url, this.appReferantorObj).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ClickSave() {
    console.log(this.appReferantorObj);
    var url;
    if (this.ExistedData) {
      if (this.ReferantorOn) {
        // save
        console.log("Save Existed Data");
        url = AdInsConstant.EditAppReferantor;
        this.SaveData(url);
        // this.wizard.goToNextStep();
        this.toastr.successMessage('Save Edit Data');
          this.outputTab.emit();
      } else {
        // delete & go to paging
        console.log("Delete Existed Data");
        url = AdInsConstant.DeleteAppReferantor;
        this.SaveData(url);    
        // this.wizard.goToNextStep();
        this.toastr.successMessage('Remove Data');
          this.outputTab.emit();
      }
    } else {
      if (this.ReferantorOn) {
        // save
        console.log("Save New Data");
        url = AdInsConstant.AddAppReferantor;
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

  Cancel(){
    this.outputCancel.emit();
  }

  TurnReferantor() {
    this.inputLookupObj.isReady = false;
    this.ReferantorOn = this.NapAppReferantorForm.controls.CheckBoxAppReferantor.value;
    // console.log(this.ReferantorOn);
    if (this.ReferantorOn == false) {
      this.inputLookupObj.isRequired = false;
      this.inputLookupObj.isReady = true;
      this.NapAppReferantorForm.controls.AccountBank.disable();
    } else {
      this.inputLookupObj.isRequired = true;
      this.inputLookupObj.isReady = true;
      this.NapAppReferantorForm.controls.AccountBank.enable();
    }
  }

  getLookupAppReferantorResponse(ev) {
    console.log(ev);
    // console.log(this.NapAppReferantorForm);
    this.appReferantorObj.ReferantorCode = ev.ReferantorCode;
    this.appReferantorObj.ReferantorName = ev.ReferantorName;
    this.appReferantorObj.MrReferantorType = ev.ReferantorType;
    // this.appReferantorObj.RefBankCode = ev.BankCode;
    // this.appReferantorObj.BankAccNo = ev.BankAccNo;
    // this.appReferantorObj.BankAccName = ev.BankAccName;
    // this.appReferantorObj.BankBranch;

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
    console.log(this.appReferantorObj);

    this.NapAppReferantorForm.patchValue({
      AccountBank: ""
    });
    
    // this.NpwpOn = ev.IsNPWPExist;
    this.NpwpOn = true;
    
    // console.log("NPWP ON?");
    // console.log(this.NpwpOn);
    this.getDDLBank(ev.ReferantorCode);
  }

  getDDLBank(VendorCode) {
    var url = AdInsConstant.GetListVendorBankAccByVendorCode;
    var obj = {
      VendorCode: VendorCode,
      RowVersion: ""
    }

    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.bankItems = response["ReturnObject"];
        console.log(this.bankItems);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  bankItems = [];
  ChangeValueBank(ev) {
    // console.log(ev);
    var idx = ev.target.selectedIndex;
    // console.log(this.bankItems[idx]);
    this.appReferantorObj.RefBankCode = this.bankItems[idx].BankCode;
    this.appReferantorObj.BankAccNo = this.bankItems[idx].BankAccountNo;
    this.appReferantorObj.BankAccName = this.bankItems[idx].BankAccountName;
    this.NapAppReferantorForm.patchValue({
      AccountBank: this.bankItems[idx].BankAccountNo
    });
    // console.log(this.appReferantorObj);
  }
}
