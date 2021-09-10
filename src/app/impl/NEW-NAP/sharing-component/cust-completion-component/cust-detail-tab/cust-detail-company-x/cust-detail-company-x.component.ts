import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyObj } from 'app/shared/model/AppCustCompanyObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ActivatedRoute } from '@angular/router';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';

@Component({
  selector: 'app-cust-detail-company-x',
  templateUrl: './cust-detail-company-x.component.html'
})
export class CustDetailCompanyXComponent implements OnInit {
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<any> = new EventEmitter();
  lookupCustGrpObj: InputLookupObj = new InputLookupObj();
  lookupEconomicSectorSlikObj: InputLookupObj = new InputLookupObj();
  AppCustGrpObj: AppCustGrpObj = new AppCustGrpObj();
  ListAppCustGrpObj: Array<AppCustGrpObj> = new Array<AppCustGrpObj>();
  AppCustObj: AppCustObj = new AppCustObj();
  AppCustCompanyObj: AppCustCompanyObj = new AppCustCompanyObj();
  businessDt: Date = new Date();
  CustModelObj: Array<KeyValueObj> = new Array();
  ddlCustModelObj: UcDropdownListObj = new UcDropdownListObj();
  CustNoObj: GenericObj = new GenericObj();
  BizTemplateCode: string = "";
  ReturnAppCustCompletionCompanyDataObj: any;
  ReturnSectorEconomySlikObj: any;
  TempRefSectorEconomySlikCode: any;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService,
    private cookieService: CookieService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if (params['BizTemplateCode'] != null) {
          this.BizTemplateCode = params['BizTemplateCode'];
        }
      });
    }

  CustDetailForm = this.fb.group({
    NoOfEmployee: ['', Validators.required],
    IsAffiliateWithMF: [false],
    IsSkt: [false],
    IsVip: [false],
    VipNotes: [''],
    EstablishmentDate: ['', Validators.required],
    IndustryTypeCode: ['', Validators.required],
    MrCustModelCode: ['', Validators.required],
  })

  ngOnInit() {
    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
    this.businessDt.setDate(this.businessDt.getDate() - 1);

    this.lookupCustGrpObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.lookupCustGrpObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.lookupCustGrpObj.isRequired = false;
    this.lookupCustGrpObj.isReady = true;

    this.lookupEconomicSectorSlikObj = new InputLookupObj();
    this.lookupEconomicSectorSlikObj.urlJson = "./assets/impl/uclookup/NAP/lookupRefSectorEconomySlikX.json";
    this.lookupEconomicSectorSlikObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.lookupEconomicSectorSlikObj.pagingJson = "./assets/impl/uclookup/NAP/lookupRefSectorEconomySlikX.json";
    this.lookupEconomicSectorSlikObj.genericJson = "./assets/impl/uclookup/NAP/lookupRefSectorEconomySlikX.json";
    this.lookupEconomicSectorSlikObj.isReady = true;
    this.GetCustModel();
    this.GetData();
  }

  GetCustModel() {
    this.ddlCustModelObj.apiUrl = URLConstant.GetListActiveRefMasterWithMappingCodeAll;
    this.ddlCustModelObj.requestObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
    this.ddlCustModelObj.requestObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustModel, MappingCode: CommonConstant.CustTypeCompany };
  }

  GetEconomicSectorSlik(event) {
    this.CustDetailForm.patchValue({
      IndustryTypeCode: event.IndustryTypeCode
    });
    this.TempRefSectorEconomySlikCode = event.RefSectorEconomySlikCode;
  }

  GetCustGrpData(event) {
    this.ListAppCustGrpObj = new Array();
    this.AppCustGrpObj.AppCustId = this.AppCustId;
    this.AppCustGrpObj.CustNo = event.CustNo;
    this.ListAppCustGrpObj.push(this.AppCustGrpObj);
  }

  SetData() {
    this.AppCustObj.AppCustId = this.AppCustId;
    this.AppCustObj.MrCustModelCode = this.CustDetailForm.controls.MrCustModelCode.value;
    this.AppCustObj.IsAffiliateWithMf = this.CustDetailForm.controls.IsAffiliateWithMF.value;
    this.AppCustObj.IsVip = this.CustDetailForm.controls.IsVip.value;
    this.AppCustObj.VipNotes = this.CustDetailForm.controls.VipNotes.value;
   
    this.AppCustCompanyObj.IndustryTypeCode   = this.CustDetailForm.controls.IndustryTypeCode.value;
    this.AppCustCompanyObj.NumOfEmp = this.CustDetailForm.controls.NoOfEmployee.value;
    this.AppCustCompanyObj.EstablishmentDt = this.CustDetailForm.controls.EstablishmentDate.value;
    if(this.BizTemplateCode === CommonConstant.OPL) {
      this.AppCustCompanyObj.IsTaxable = this.CustDetailForm.controls.IsSkt.value;
    }
  }

  SaveForm() {
    this.SetData();

    let reqAppCustCompanyObjX = {
      AppCustId: this.AppCustId,
      RefSectorEconomySlikCode: this.TempRefSectorEconomySlikCode
    }

    let requestObj = {
      AppCustObj: this.AppCustObj,
      AppCustCompanyObj: this.AppCustCompanyObj,
      AppCustGrpObjs: this.ListAppCustGrpObj,
      ReqAppCustCompanyObjX: reqAppCustCompanyObjX
    }

    this.http.post(URLConstantX.UpdateAppCustCompletionCompany, requestObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.OutputTab.emit({ IsComplete: true });
      },
      error => {
        console.log(error);
      });
  }

  checkState() {
    if (!this.CustDetailForm.controls.IsVip.value) {
      this.CustDetailForm.patchValue({
        VipNotes: null
      });
      this.CustDetailForm.controls.VipNotes.disable();
      this.CustDetailForm.controls.VipNotes.clearAsyncValidators();

    } else {
      this.CustDetailForm.controls.VipNotes.enable();
      this.CustDetailForm.controls.VipNotes.setValidators(Validators.required);

    }
    this.CustDetailForm.controls.VipNotes.updateValueAndValidity();
  }

  GetData() {
    this.http.post(URLConstantX.GetAppCustAndAppCustCompanyDataByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.ReturnAppCustCompletionCompanyDataObj = response['resAppCustCompletionCompanyDataObj'];
        this.TempRefSectorEconomySlikCode = response['RefSectorEconomySlikCode'];

        if (this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.IndustryTypeCode && this.TempRefSectorEconomySlikCode) {
          this.http.post(URLConstantX.GetRefSectorEconomySlikXByCode, {Code: this.TempRefSectorEconomySlikCode}).subscribe(
            (response) => {
              this.ReturnSectorEconomySlikObj = response;
              this.lookupEconomicSectorSlikObj.nameSelect = this.ReturnSectorEconomySlikObj.SectorEconomySlikName;
              this.lookupEconomicSectorSlikObj.jsonSelect = this.ReturnSectorEconomySlikObj;
            }
          );
        }
        this.CustDetailForm.patchValue({
          IsAffiliateWithMF : this.ReturnAppCustCompletionCompanyDataObj.AppCustObj.IsAffiliateWithMf,
          IsVip : this.ReturnAppCustCompletionCompanyDataObj.AppCustObj.IsVip,
          VipNotes : this.ReturnAppCustCompletionCompanyDataObj.AppCustObj.VipNotes,
          NoOfEmployee : this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.NumOfEmp,
          EstablishmentDate : this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.EstablishmentDt != null ? formatDate(this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.EstablishmentDt, 'yyyy-MM-dd', 'en-US') : "",
          IndustryTypeCode : this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.IndustryTypeCode,
          MrCustModelCode : this.ReturnAppCustCompletionCompanyDataObj.AppCustObj.MrCustModelCode,
          IsSkt : this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.IsTaxable
        });
        this.checkState();

        this.AppCustCompanyObj.IsTaxable = this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.IsTaxable;
        this.AppCustObj.RowVersion = this.ReturnAppCustCompletionCompanyDataObj.AppCustObj.RowVersion;
        this.AppCustCompanyObj.RowVersion = this.ReturnAppCustCompletionCompanyDataObj.AppCustCompanyObj.RowVersion;

        if (this.ReturnAppCustCompletionCompanyDataObj.AppCustGrpObj != null && this.ReturnAppCustCompletionCompanyDataObj.AppCustGrpObj.CustNo != "") {
          this.CustNoObj.CustNo = this.ReturnAppCustCompletionCompanyDataObj.AppCustGrpObj.CustNo;
          this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).subscribe(
            (responseCustGrp) => {
              this.lookupCustGrpObj.nameSelect = responseCustGrp["CustName"];
              this.lookupCustGrpObj.jsonSelect = { CustName: responseCustGrp["CustName"] };
              this.lookupCustGrpObj.isReady = true;
              this.GetCustGrpData({ CustNo: responseCustGrp["CustNo"] });
            });
        }
      }
    );
  }
}
