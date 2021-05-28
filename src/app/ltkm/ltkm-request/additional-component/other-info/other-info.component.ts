import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { LtkmCustOtherInfoObj } from 'app/shared/model/LTKM/LtkmCustOtherInfoObj.Model';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-ltkm-other-info',
  templateUrl: './other-info.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmOtherInfoComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private fb: FormBuilder) {
  }

  @Input() CustTypeCode: string;
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() isLockMode: boolean = false;
  @Input() LtkmCustId: number;
  @Input() CustOtherInfo: LtkmCustOtherInfoObj;

  InputDebitorGroupLookupObj: InputLookupObj;
  InputDebitorBusinessScaleLookupObj: InputLookupObj;
  InputCounterpartCategoryLookupObj: InputLookupObj;
  InputSustaianableFinancialBusinessLookupObj: InputLookupObj;
  IsLookupReady: boolean;
  AttrGroup: string;
  appCustOtherInfo: AppCustOtherInfoObj;
  custAttrRequest = new Array<Object>();
  async ngOnInit() {
    this.parentForm.addControl(this.identifier, this.fb.group({
      LbppmsBizSclLbppCode: [''],
      LbppmsBizSustainLbppCode: [''],
      LbppmsCntrprtLbppCode: [''],
      LbppmsDebtGrpLbppCode: [''],
      LbppmsCntrprtLbppDescr: [''],
      LbppmsDebtGrpLbppDescr: [''],
      LbppmsBizSustainLbppDescr: [''],
      LbppmsBizSclLbppDescr: [''],
    }));

    this.AttrGroup = this.CustTypeCode == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyOther : CommonConstant.AttrGroupCustPersonalOther;

    this.InputDebitorGroupLookupObj = new InputLookupObj();
    this.InputDebitorGroupLookupObj.urlJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputDebitorGroupLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputDebitorGroupLookupObj.pagingJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.genericJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.isReady = true;

    this.InputDebitorBusinessScaleLookupObj = new InputLookupObj();
    this.InputDebitorBusinessScaleLookupObj.urlJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputDebitorBusinessScaleLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputDebitorBusinessScaleLookupObj.pagingJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.genericJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.isReady = true;

    this.InputCounterpartCategoryLookupObj = new InputLookupObj();
    this.InputCounterpartCategoryLookupObj.urlJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputCounterpartCategoryLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputCounterpartCategoryLookupObj.pagingJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.genericJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.isReady = true;

    this.InputSustaianableFinancialBusinessLookupObj = new InputLookupObj();
    this.InputSustaianableFinancialBusinessLookupObj.urlJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputSustaianableFinancialBusinessLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputSustaianableFinancialBusinessLookupObj.pagingJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.genericJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.isReady = true;

    if (this.isLockMode) {
      this.InputDebitorGroupLookupObj.isRequired = false;
      this.InputDebitorBusinessScaleLookupObj.isRequired = false;
      this.InputCounterpartCategoryLookupObj.isRequired = false;
      this.InputSustaianableFinancialBusinessLookupObj.isRequired = false;
      this.InputDebitorGroupLookupObj.isDisable = true;
      this.InputDebitorBusinessScaleLookupObj.isDisable = true;
      this.InputCounterpartCategoryLookupObj.isDisable = true;
      this.InputSustaianableFinancialBusinessLookupObj.isDisable = true;
    } else {
      this.InputDebitorGroupLookupObj.isRequired = true;
      this.InputDebitorBusinessScaleLookupObj.isRequired = true;
      this.InputCounterpartCategoryLookupObj.isRequired = true;
      this.InputSustaianableFinancialBusinessLookupObj.isRequired = true;
    }

    if (this.CustOtherInfo != null) {
      console.log('richard check ni chad');
      this.InputDebitorGroupLookupObj.nameSelect = this.CustOtherInfo.LbppmsDebtGrpLbppDescr;
      this.InputDebitorBusinessScaleLookupObj.nameSelect = this.CustOtherInfo.LbppmsBizSclLbppDescr;
      this.InputCounterpartCategoryLookupObj.nameSelect = this.CustOtherInfo.LbppmsCntrprtLbppDescr;
      this.InputSustaianableFinancialBusinessLookupObj.nameSelect = this.CustOtherInfo.LbppmsBizSustainLbppDescr;

      this.InputDebitorGroupLookupObj.jsonSelect = { Descr: this.CustOtherInfo.LbppmsDebtGrpLbppDescr };
      this.InputDebitorBusinessScaleLookupObj.jsonSelect = { Descr: this.CustOtherInfo.LbppmsBizSclLbppDescr };
      this.InputCounterpartCategoryLookupObj.jsonSelect = { Descr: this.CustOtherInfo.LbppmsCntrprtLbppDescr };
      this.InputSustaianableFinancialBusinessLookupObj.jsonSelect = { Descr: this.CustOtherInfo.LbppmsBizSustainLbppDescr };

      this.parentForm['controls'][this.identifier].patchValue({
        LbppmsDebtGrpLbppCode: this.CustOtherInfo.LbppmsDebtGrpLbppCode,
        LbppmsCntrprtLbppCode: this.CustOtherInfo.LbppmsCntrprtLbppCode,
        LbppmsBizSustainLbppCode: this.CustOtherInfo.LbppmsBizSustainLbppCode,
        LbppmsBizSclLbppCode: this.CustOtherInfo.LbppmsBizSclLbppCode,
        LbppmsCntrprtLbppDescr: this.CustOtherInfo.LbppmsCntrprtLbppDescr,
        LbppmsDebtGrpLbppDescr: this.CustOtherInfo.LbppmsDebtGrpLbppDescr,
        LbppmsBizSustainLbppDescr: this.CustOtherInfo.LbppmsBizSustainLbppDescr,
        LbppmsBizSclLbppDescr: this.CustOtherInfo.LbppmsBizSclLbppDescr
      });
    }
    this.IsLookupReady = true;
    this.parentForm.updateValueAndValidity();

  }

  // start urs-los-057
  copyOtherInfo() {
    if (this.CustOtherInfo != null) {
      this.parentForm.removeControl(this.identifier);
      if (!this.isLockMode) {
        this.parentForm.addControl(this.identifier, this.fb.group({
          LbppmsBizSclLbppCode: [this.CustOtherInfo["LbppmsBizSclLbppCode"], [Validators.required]],
          LbppmsBizSustainLbppCode: [this.CustOtherInfo["LbppmsBizSustainLbppCode"], [Validators.required]],
          LbppmsCntrprtLbppCode: [this.CustOtherInfo["LbppmsCntrprtLbppCode"], [Validators.required]],
          LbppmsDebtGrpLbppCode: [this.CustOtherInfo["LbppmsDebtGrpLbppCode"], [Validators.required]],
          LbppmsCntrprtLbppDescr: [this.CustOtherInfo["LbppmsCntrprtDescr"], [Validators.required]],
          LbppmsDebtGrpLbppDescr: [this.CustOtherInfo["LbppmsDebtGrpDescr"], [Validators.required]],
          LbppmsBizSustainLbppDescr: [this.CustOtherInfo["LbppmsBizSustainDescr"], [Validators.required]],
          LbppmsBizSclLbppDescr: [this.CustOtherInfo["LbppmsBizSclDescr"], [Validators.required]]
        }));
      } else {
        this.parentForm.addControl(this.identifier, this.fb.group({
          LbppmsBizSclLbppCode: [this.CustOtherInfo["LbppmsBizSclLbppCode"]],
          LbppmsBizSustainLbppCode: [this.CustOtherInfo["LbppmsBizSustainLbppCode"]],
          LbppmsCntrprtLbppCode: [this.CustOtherInfo["LbppmsCntrprtLbppCode"]],
          LbppmsDebtGrpLbppCode: [this.CustOtherInfo["LbppmsDebtGrpLbppCode"]],
          LbppmsCntrprtLbppDescr: [this.CustOtherInfo["LbppmsCntrprtDescr"]],
          LbppmsDebtGrpLbppDescr: [this.CustOtherInfo["LbppmsDebtGrpDescr"]],
          LbppmsBizSustainLbppDescr: [this.CustOtherInfo["LbppmsBizSustainDescr"]],
          LbppmsBizSclLbppDescr: [this.CustOtherInfo["LbppmsBizSclDescr"]]
        }));
      }

      this.InputDebitorGroupLookupObj.nameSelect = this.CustOtherInfo["LbppmsDebtGrpDescr"];
      this.InputDebitorGroupLookupObj.jsonSelect = {
        Descr: this.CustOtherInfo["LbppmsDebtGrpDescr"]
      };
      this.InputDebitorBusinessScaleLookupObj.nameSelect = this.CustOtherInfo["LbppmsBizSclDescr"];
      this.InputDebitorBusinessScaleLookupObj.jsonSelect = {
        Descr: this.CustOtherInfo["LbppmsBizSclDescr"]
      };
      this.InputSustaianableFinancialBusinessLookupObj.nameSelect = this.CustOtherInfo["LbppmsBizSustainDescr"];
      this.InputSustaianableFinancialBusinessLookupObj.jsonSelect = {
        Descr: this.CustOtherInfo["LbppmsBizSustainDescr"]
      };
      this.InputCounterpartCategoryLookupObj.nameSelect = this.CustOtherInfo["LbppmsCntrprtDescr"];
      this.InputCounterpartCategoryLookupObj.jsonSelect = {
        Descr: this.CustOtherInfo["LbppmsCntrprtDescr"]
      };
      this.parentForm.updateValueAndValidity();
      this.IsLookupReady = true;
    }
  }

  getLookupDebitorGroup(e) {
    this.parentForm.controls[this.identifier].patchValue({
      LbppmsDebtGrpLbppCode: e.LbppCode,
      LbppmsDebtGrpLbppDescr: e.Descr
    });
  }
  getLookupDebitorBusinessScale(e) {
    this.parentForm.controls[this.identifier].patchValue({
      LbppmsBizSclLbppCode: e.LbppCode,
      LbppmsBizSclLbppDescr: e.Descr
    });
  }
  getLookupCounterpartCategory(e) {
    this.parentForm.controls[this.identifier].patchValue({
      LbppmsCntrprtLbppCode: e.LbppCode,
      LbppmsCntrprtLbppDescr: e.Descr
    });

  }
  getLookupSustainableFinancialBusiness(e) {
    this.parentForm.controls[this.identifier].patchValue({
      LbppmsBizSustainLbppCode: e.LbppCode,
      LbppmsBizSustainLbppDescr: e.Descr
    });
  }
}
