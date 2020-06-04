import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';

@Component({
  selector: 'app-referantor-data-FL4W',
  templateUrl: './referantor-data-FL4W.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class ReferantorDataFL4WComponent implements OnInit {

  @Input() appId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  inputLookupObj;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
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
  ngOnInit() {
    this.appReferantorObj = new NapAppReferantorModel();
    this.ExistedData = false;

    this.GetInputLookupObj();
    this.getAppReferantorData();
    console.log(this.bankItems);
  }

  GetInputLookupObj(){
    this.arrAddCrit = new Array();

    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "v.MR_VENDOR_CATEGORY_CODE ";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = ["AGENCY_COMPANY", "AGENCY_PERSONAL"];
    this.arrAddCrit.push(addCrit);

    var addCrit1 = new CriteriaObj(); 
    addCrit1.DataType = "bool";
    addCrit1.propName = "vba.IS_DEFAULT";
    addCrit1.restriction = AdInsConstant.RestrictionIn;
    addCrit1.listValue = [1];
    this.arrAddCrit.push(addCrit1);

    //Look Up Obj
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/NAP/lookupVendor.json";
    this.inputLookupObj.addCritInput = this.arrAddCrit;
    this.inputLookupObj.nameSelect = this.appReferantorObj.ReferantorName;
    this.inputLookupObj.isReady = true;
    this.inputLookupObj.isRequired = false;
    this.NapAppReferantorForm.controls.AccountBank.disable();
  }
  
  getAppReferantorData() {
    // data dummy test
    // var tempId = 11;
    // this.appId = tempId;

    // Check Data App Id
    var url = AdInsConstant.GetAppReferantorByAppId;
    var obj = {
      AppId: this.appId,
      RowVersion: "",
    }

    this.http.post(url, obj).subscribe(
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
          console.log(this.NapAppReferantorForm);
          this.getDDLBank(this.appReferantorObj.ReferantorCode);
        }
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
    console.log(this.NapAppReferantorForm);
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

  TurnReferantor() {
    this.ReferantorOn = this.NapAppReferantorForm.controls.CheckBoxAppReferantor.value;
    // console.log(this.ReferantorOn);
    if (this.ReferantorOn == false) { 
      this.inputLookupObj.isRequired = false;
      this.NapAppReferantorForm.controls.AccountBank.disable();
            
    } else {
      this.NapAppReferantorForm.controls.AccountBank.enable(); 
      this.inputLookupObj.isRequired = true;
      this.NapAppReferantorForm.updateValueAndValidity();
      console.log("aawd");
    }
  }

  getLookupAppReferantorResponse(ev) {
    console.log(ev);
    // console.log(this.NapAppReferantorForm);
    this.appReferantorObj.ReferantorCode = ev.ReferantorCode;
    this.appReferantorObj.ReferantorName = ev.ReferantorName;
    this.appReferantorObj.MrReferantorType = ev.ReferantorType;
    this.appReferantorObj.RefBankCode = ev.BankCode;
    this.appReferantorObj.BankAccNo = ev.BankAccNo;
    this.appReferantorObj.BankAccName = ev.BankAccName;
    this.appReferantorObj.BankBranch;

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
      AccountBank: ev.BankAccNo
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
