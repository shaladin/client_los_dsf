import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustOtherInfoObj } from 'app/shared/model/AppCustOtherInfoObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { RefProfessionObj } from 'app/shared/model/RefProfessionObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { environment } from 'environments/environment';
import { AttrContentComponentComponent } from '../attr-content-component/attr-content-component.component';

@Component({
  selector: 'app-other-info-tab',
  templateUrl: './other-info-tab.component.html'
})
export class OtherInfoTabComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) {

    this.route.queryParams.subscribe(params => {

      if (params['AppCustId'] != null) {
        this.AppCustId = params['AppCustId'];
      }
    });
  }
  OtherInformationForm = this.fb.group({
    LbppmsBizSclLbppCode: ['', [Validators.required]],
    LbppmsBizSustainLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppCode: ['', [Validators.required]],
    LbppmsDebtGrpLbppCode: ['', [Validators.required]],
    LbppmsCntrprtLbppDescr: ['', [Validators.required]],
    LbppmsDebtGrpLbppDescr: ['', [Validators.required]],
    LbppmsBizSustainLbppDescr: ['', [Validators.required]],
    LbppmsBizSclLbppDescr: ['', [Validators.required]]
  });

  @Input() CustTypeCode: string;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  InputDebitorGroupLookupObj: InputLookupObj;
  InputDebitorBusinessScaleLookupObj: InputLookupObj;
  InputCounterpartCategoryLookupObj: InputLookupObj;
  InputSustaianableFinancialBusinessLookupObj: InputLookupObj;
  IsLookupReady: boolean;
  AppCustId: number;
  AttrGroup: string;
  AttrGroups: Array<string> = [];
  ResponseCustOtherInfo: AppCustOtherInfoObj;
  appCustOtherInfo: AppCustOtherInfoObj;
  custAttrRequest = new Array<Object>();

  isExistData: boolean = false;
  async ngOnInit() {
    this.AttrGroup = this.CustTypeCode == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyOther : CommonConstant.AttrGroupCustPersonalOther;

    let AppcustOtherInfo = {
      Id: this.AppCustId
    }
    await this.httpClient.post(URLConstant.GetAppCustOtherInfoByAppCustId, AppcustOtherInfo).toPromise().then(
      (response: AppCustOtherInfoObj) => {
        console.log(response);
        this.ResponseCustOtherInfo = response;
      });
      
    await this.GetExistingProfession();
    this.InputDebitorGroupLookupObj = new InputLookupObj();
    this.InputDebitorGroupLookupObj.urlJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputDebitorGroupLookupObj.pagingJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.genericJson = "./assets/uclookup/lookupDebitorGroup.json";
    this.InputDebitorGroupLookupObj.isReady = true;

    this.InputDebitorBusinessScaleLookupObj = new InputLookupObj();
    this.InputDebitorBusinessScaleLookupObj.urlJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputDebitorBusinessScaleLookupObj.pagingJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.genericJson = "./assets/uclookup/lookupDebitorBusinessScale.json";
    this.InputDebitorBusinessScaleLookupObj.isReady = true;

    this.InputCounterpartCategoryLookupObj = new InputLookupObj();
    this.InputCounterpartCategoryLookupObj.urlJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputCounterpartCategoryLookupObj.pagingJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.genericJson = "./assets/uclookup/lookupCounterpartCategory.json";
    this.InputCounterpartCategoryLookupObj.isReady = true;

    this.InputSustaianableFinancialBusinessLookupObj = new InputLookupObj();
    this.InputSustaianableFinancialBusinessLookupObj.urlJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.InputSustaianableFinancialBusinessLookupObj.pagingJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.genericJson = "./assets/uclookup/lookupSustainableFinancialBusiness.json";
    this.InputSustaianableFinancialBusinessLookupObj.isReady = true;

    if (this.ResponseCustOtherInfo.AppCustOtherInfoId != null) {

      this.InputDebitorGroupLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr };
      this.InputDebitorBusinessScaleLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr };
      this.InputCounterpartCategoryLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr };
      this.InputSustaianableFinancialBusinessLookupObj.jsonSelect = { Descr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr };

      this.OtherInformationForm.patchValue({
        LbppmsDebtGrpLbppCode: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppCode,
        LbppmsCntrprtLbppCode: this.ResponseCustOtherInfo.LbppmsCntrprtLbppCode,
        LbppmsBizSustainLbppCode: this.ResponseCustOtherInfo.LbppmsBizSustainLbppCode,
        LbppmsBizSclLbppCode: this.ResponseCustOtherInfo.LbppmsBizSclLbppCode,
        LbppmsCntrprtLbppDescr: this.ResponseCustOtherInfo.LbppmsCntrprtLbppDescr,
        LbppmsDebtGrpLbppDescr: this.ResponseCustOtherInfo.LbppmsDebtGrpLbppDescr,
        LbppmsBizSustainLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSustainLbppDescr,
        LbppmsBizSclLbppDescr: this.ResponseCustOtherInfo.LbppmsBizSclLbppDescr
      });
    }
    this.IsLookupReady = true;

  }
  
  @ViewChild('CustAttrForm') custAttrForm: AttrContentComponentComponent;
  async GetExistingProfession(custId: number = this.AppCustId) {
    if (this.CustTypeCode != CommonConstant.CustTypePersonal || custId == 0) return;
    await this.httpClient.post(URLConstant.GetAppCustMainDataByAppCustId, { Id: custId }).toPromise().then(
      async (response: ResponseAppCustMainDataObj) => {
        if (!response.AppCustPersonalJobDataObj.MrProfessionCode) return;
        await this.httpClient.post(URLConstant.GetRefProfessionByCode, { Code: response.AppCustPersonalJobDataObj.MrProfessionCode }).subscribe(
          (response: RefProfessionObj) => {
            this.custAttrForm.SetSearchListInputType(CommonConstant.AttrCodeDeptAml, response.ProfessionCode);
          });
      }
    )
  }

  SaveForm() {
    this.setAttrContent();
    this.setAppCustOtherInfoData();

    let RequestAppCustOtherInfoObj = {
      ListRequestAppCustAttrObject: this.custAttrRequest,
      RequestAppCustOtherInfoObj: this.appCustOtherInfo
    }
    if(!this.isExistData){
      this.httpClient.post(URLConstant.AddCustCompletionOtherInfo, RequestAppCustOtherInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.OutputTab.emit({IsComplete: true});
        },
        (error) => {
          console.log(error);
        }
      );
    }else{      
      this.httpClient.post(URLConstant.EditCustCompletionOtherInfo, RequestAppCustOtherInfoObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["Message"]);
          this.OutputTab.emit({IsComplete: true});
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }

  identifierAttr: string = "AttrList";
  setAttrContent() {
    var formValue = this.OtherInformationForm['controls'][this.identifierAttr].value;
    this.custAttrRequest = new Array<Object>();

    if (Object.keys(formValue).length > 0 && formValue.constructor === Object) {
      for (const key in formValue) {
        if (formValue[key]["AttrValue"] != null) {
          var custAttr = {
            AppCustId: this.AppCustId,
            RefAttrCode: formValue[key]["AttrCode"],
            AttrValue: formValue[key]["AttrValue"],
            AttrGroup: this.AttrGroup
          };
          this.custAttrRequest.push(custAttr);
        }

      }
    }
  }
  setAppCustOtherInfoData() {
    this.appCustOtherInfo = new AppCustOtherInfoObj();
    if (this.ResponseCustOtherInfo != undefined) {
      this.appCustOtherInfo.RowVersion = this.ResponseCustOtherInfo.RowVersion
    }
    this.appCustOtherInfo.AppCustId = this.AppCustId;
    this.appCustOtherInfo.LbppmsBizSclLbppCode = this.OtherInformationForm.controls.LbppmsBizSclLbppCode.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppCode = this.OtherInformationForm.controls.LbppmsBizSustainLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppCode = this.OtherInformationForm.controls.LbppmsCntrprtLbppCode.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppCode = this.OtherInformationForm.controls.LbppmsDebtGrpLbppCode.value;
    this.appCustOtherInfo.LbppmsCntrprtLbppDescr = this.OtherInformationForm.controls.LbppmsCntrprtLbppDescr.value;
    this.appCustOtherInfo.LbppmsDebtGrpLbppDescr = this.OtherInformationForm.controls.LbppmsDebtGrpLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSustainLbppDescr = this.OtherInformationForm.controls.LbppmsBizSustainLbppDescr.value;
    this.appCustOtherInfo.LbppmsBizSclLbppDescr = this.OtherInformationForm.controls.LbppmsBizSclLbppDescr.value;

  }
  getLookupDebitorGroup(e) {
    this.OtherInformationForm.patchValue({
      LbppmsDebtGrpLbppCode: e.LbppCode,
      LbppmsDebtGrpLbppDescr: e.Descr
    });
  }
  getLookupDebitorBusinessScale(e) {
    this.OtherInformationForm.patchValue({
      LbppmsBizSclLbppCode: e.LbppCode,
      LbppmsBizSclLbppDescr: e.Descr
    });
  }
  getLookupCounterpartCategory(e) {
    this.OtherInformationForm.patchValue({
      LbppmsCntrprtLbppCode: e.LbppCode,
      LbppmsCntrprtLbppDescr: e.Descr
    });

  }
  getLookupSustainableFinancialBusiness(e) {
    this.OtherInformationForm.patchValue({
      LbppmsBizSustainLbppCode: e.LbppCode,
      LbppmsBizSustainLbppDescr: e.Descr
    });
  }


}
