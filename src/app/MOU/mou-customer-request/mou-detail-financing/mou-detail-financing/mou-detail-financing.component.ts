import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { forkJoin } from 'rxjs';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { MouCustDlrFinObj } from 'app/shared/model/moucustdlrfin.model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { RefPayFreqObj } from 'app/shared/model/RefPayFreqObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-mou-detail-financing',
  templateUrl: './mou-detail-financing.component.html'
})
export class MouDetailFinancingComponent implements OnInit {

  @Input() MouCustId: number;
  @Output() ResponseMouCustFactoring: EventEmitter<any> = new EventEmitter();
  @ViewChild('LookUpManufacturer') ucInputLookupLinkManufacturerObj: UclookupgenericComponent;
  @ViewChild('LookUpSupplGrading') ucInputLookupLinkSupplGradingObj: UclookupgenericComponent;

  wopList: Array<KeyValueObj>;
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
  DealerCustNo: string;
  DealerCode: string = "-";
  ManufacturerCustNo: string;
  ManufacturerCode: string = "-";
  AsseConditionLis: Array<RefPayFreqObj>;
  MouDlrFinData: MouCustDlrFinObj;
  returnVendorObj: VendorObj;
  IsaAssetNew: boolean = true;

  mrMouCustTypeCode: string = "PERSONAL";

  MouCustDlrFindData: MouCustDlrFinObj;

  InputLookupLinkManufacturerObj: InputLookupObj = new InputLookupObj();
  InputLookupManufacturerObj: InputLookupObj = new InputLookupObj();
  InputLookupLinkSupplGradingObj: InputLookupObj = new InputLookupObj();
  InputLookupCustomerObj: InputLookupObj = new InputLookupObj();

  MouDetailFinancingForm = this.fb.group({
    VirtualAccNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    WopCode: ['', [Validators.required]],
    MrInstTypeCode: ['', [Validators.required]],
    TopDays: [0, [Validators.min(0)]],
    PayFreqCode: ['', [Validators.required]],
    InterestRatePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    Notes: [''],
    CurrCode: ['', [Validators.required]],
    RowVersion: [''],
    TopInterestRatePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    ExtendRatePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    MmForExtend: [0, [Validators.required]],
    PpForExtendPrcnt: [0, [Validators.min(0), Validators.max(100)]],
    SpareDayToPay: [0, [Validators.required]],
    AssetCondition: ['', [Validators.required]],
    LcRatePrcnt: [0, [Validators.min(0), Validators.max(100)]],
    MaximumExtendTimes: [0, [Validators.required]]
  });

  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {
    this.isListedFctr = false;
    this.shouldComponentLoad = false;
  }

  ngOnInit() {
    this.initLookup();
    this.httpClient.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.mrMouCustTypeCode = response.MrCustTypeCode;
        var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
        var suppCrit = new Array();
        var critSuppObj = new CriteriaObj();
        critSuppObj.DataType = 'text';
        critSuppObj.restriction = AdInsConstant.RestrictionEq;
        critSuppObj.propName = 'ro.OFFICE_CODE';
        critSuppObj.value = currentUserContext[CommonConstant.OFFICE_CODE];
        suppCrit.push(critSuppObj);

        if (this.mrMouCustTypeCode == "COMPANY") {
          var criteriaObj = new CriteriaObj();
          criteriaObj.restriction = AdInsConstant.RestrictionEq;
          criteriaObj.propName = 'V.MR_VENDOR_TYPE_CODE';
          criteriaObj.value = "C";
          suppCrit.push(criteriaObj);
        } else {
          var criteriaObj = new CriteriaObj();
          criteriaObj.restriction = AdInsConstant.RestrictionEq;
          criteriaObj.propName = 'V.MR_VENDOR_TYPE_CODE';
          criteriaObj.value = "P";
          suppCrit.push(criteriaObj);
        }

        this.InputLookupLinkSupplGradingObj.addCritInput=suppCrit;
        this.InputLookupLinkManufacturerObj.addCritInput=suppCrit;
        this.ucInputLookupLinkSupplGradingObj.setAddCritInput();
        this.ucInputLookupLinkManufacturerObj.setAddCritInput();
      });


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
    var mouCustFctr = new GenericObj();
    mouCustFctr.Id = this.MouCustId;
    let getMouDlrFin = this.httpClient.post(URLConstant.GetMouCustDlrFindById, mouCustFctr);

    var rmAssetStatus = new RefMasterObj();
    rmAssetStatus.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    let getssetStatus = this.httpClient.post(URLConstant.GetRefMasterListKeyValueActiveByCode, rmAssetStatus);

    forkJoin([getRecourseType, getWop, getPaidBy, getInstType, getSingleInstCalcMethod, getPayFreq, getInstSchm, getCurrency, getMouDlrFin, getssetStatus]).subscribe(
      (response: any) => {
        this.wopList = response[1].ReturnObject;
        this.instTypeList = response[3].ReturnObject;
        this.singleInstCalcMthdList = response[4];
        this.payFreqList = response[5];
        this.instSchmList = response[6];
        this.currencyList = response[7].ReturnObject;
        this.MouDlrFinData = response[8];
        this.AsseConditionLis = response[9].ReturnObject;

        this.MouDetailFinancingForm.patchValue({
          WopCode: this.wopList[0].Key,
          PayFreqCode: this.payFreqList["ReturnObject"][0]["PayFreqCode"],
          CurrCode: this.currencyList[0].Key,
          AssetCondition: this.AsseConditionLis[0],
          MrInstTypeCode: this.instTypeList[0].Key,
        });
        if (this.MouDlrFinData["MouCustDlrFncngId"] != 0) {
          this.mode = "edit";

          this.ManufacturerCode = this.MouDlrFinData["ManufacturerCode"];
          this.ManufacturerCustNo = this.MouDlrFinData["ManufacturerCustNo"];
          this.DealerCode = this.MouDlrFinData["DealerCode"];
          this.DealerCustNo = this.MouDlrFinData["DealerCustNo"];

          this.BidDataLookUp(this.ManufacturerCode, this.ManufacturerCustNo, this.DealerCode, this.DealerCustNo);

          this.MouDetailFinancingForm.patchValue({
            WopCode: this.MouDlrFinData["WopCode"],
            TopDays: this.MouDlrFinData["TopDays"],
            PayFreqCode: this.MouDlrFinData["PayFreqCode"],
            InterestRatePrcnt: this.MouDlrFinData["InterestRatePrcnt"],
            Notes: this.MouDlrFinData["Notes"],
            TopInterestRatePrcnt: this.MouDlrFinData["TopInterestRatePrcnt"],
            ExtendRatePrcnt: this.MouDlrFinData["ExtendRatePrcnt"],
            MmForExtend: this.MouDlrFinData["MaximumMonthsForExtend"],
            PpForExtendPrcnt: this.MouDlrFinData["PrincipalPaidInExtendPrcntg"],
            SpareDayToPay: this.MouDlrFinData["SpareDayToPay"],
            AssetCondition: this.MouDlrFinData["AssetCondition"],
            LcRatePrcnt: this.MouDlrFinData["LcRate"],
            MaximumExtendTimes: this.MouDlrFinData["MaximumExtendTimes"],
            MrInstTypeCode: this.MouDlrFinData["MrInstTypeCode"],
            VirtualAccNo: this.MouDlrFinData["VirtualAccNo"]
          });

          this.instTypeHandler(this.MouDlrFinData["MrInstTypeCode"]);
        }
        else {
          this.MouDetailFinancingForm.patchValue({
            MouCustId: this.MouCustId
          });

          this.instTypeHandler(CommonConstant.SINGLE_INST_TYPE);
        }
        this.shouldComponentLoad = true;
        if (this.MouDlrFinData["AssetCondition"] != null) {
          this.onItemChange(this.MouDlrFinData["AssetCondition"]);
        } else {
          this.onItemChange("NEW");
        }
      });

  }

  Save(enjiForm) {
    this.BindData();
    if (this.MouCustDlrFindData.MaximumMonthsForExtend < this.MouCustDlrFindData.MaximumTimesForExtends) {
      this.toastr.warningMessage(ExceptionConstant.EXTENDS_TIME_INVLID);
      return;
    }
    console.log(this.MouCustDlrFindData);
    this.httpClient.post(URLConstant.AddEditMouCustDlrFin, this.MouCustDlrFindData).subscribe(
      (response) => {
        this.ResponseMouCustFactoring.emit(response);
      });

  }

  initLookup() {
    this.InputLookupCustomerObj = new InputLookupObj();
    this.InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupCustomerObj.isReadonly = false;
    this.InputLookupCustomerObj.isRequired = true;

    this.InputLookupLinkSupplGradingObj = new InputLookupObj();
    this.InputLookupLinkSupplGradingObj.urlJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupLinkSupplGradingObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupLinkSupplGradingObj.pagingJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.genericJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.isReadonly = false;
    this.InputLookupLinkSupplGradingObj.isRequired = false;
    this.InputLookupLinkSupplGradingObj.title = "Supplier Grading";

    this.InputLookupLinkManufacturerObj = new InputLookupObj();
    this.InputLookupLinkManufacturerObj.urlJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupLinkManufacturerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupLinkManufacturerObj.pagingJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.genericJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.isReadonly = false;
    this.InputLookupLinkManufacturerObj.isRequired = false;
    this.InputLookupLinkManufacturerObj.title = "Link Manufacturer";

    this.InputLookupManufacturerObj = new InputLookupObj();
    this.InputLookupManufacturerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupManufacturerObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupManufacturerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupManufacturerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupManufacturerObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.InputLookupManufacturerObj.isReadonly = false;
    this.InputLookupManufacturerObj.isRequired = true;
    this.InputLookupManufacturerObj.title = "Manufacturer";
  }

  LinkManufacturerEvent(event) {
    console.log(event);
    this.ManufacturerCode = event.VendorCode;
  }

  ManufacturerEvent(event) {
    console.log(event);
    this.ManufacturerCustNo = event.CustNo;
  }

  LinkSupplGradingEvent(event) {
    console.log(event);
    this.DealerCode = event.VendorCode;
  }

  CustomerEvent(event) {
    console.log(event);
    this.DealerCustNo = event.CustNo;;
  }

  BidDataLookUp(ManufacturerCode, ManufacturerCustNo, DealerCode, DealerCustNo) {

    this.ManufacturerCode = ManufacturerCode;
    this.ManufacturerCustNo = ManufacturerCustNo;
    this.DealerCode = DealerCode;
    this.DealerCustNo = DealerCustNo;

    var ManufacturerCustNoObj = { CustNo: ManufacturerCustNo };
    this.httpClient.post(URLConstant.GetCustByCustNo, ManufacturerCustNoObj).subscribe(
      response => {
        this.InputLookupManufacturerObj.nameSelect = response["CustName"];
        this.InputLookupManufacturerObj.jsonSelect = { CustName: response["CustName"] };
      }
    );

    var DealerCustNoObj = { CustNo: DealerCustNo };
    this.httpClient.post(URLConstant.GetCustByCustNo, DealerCustNoObj).subscribe(
      response => {
        this.InputLookupCustomerObj.nameSelect = response["CustName"];
        this.InputLookupCustomerObj.jsonSelect = { CustName: response["CustName"] };
      }
    );

    var vendorObj = new GenericObj();
    vendorObj.Code = ManufacturerCode;

    this.httpClient.post(URLConstant.GetVendorForLookup, vendorObj).subscribe(
      (response: VendorObj) => {
        this.returnVendorObj = response;
        this.InputLookupLinkManufacturerObj.nameSelect = this.returnVendorObj.VendorName;
        this.InputLookupLinkManufacturerObj.jsonSelect = this.returnVendorObj;
      }
    );

    var vendorObj2 = new GenericObj();
    vendorObj2.Code = DealerCode;
    this.httpClient.post(URLConstant.GetVendorForLookup, vendorObj2).subscribe(
      (response: VendorObj) => {
        this.returnVendorObj = response;
        this.InputLookupLinkSupplGradingObj.nameSelect = this.returnVendorObj.VendorName;
        this.InputLookupLinkSupplGradingObj.jsonSelect = this.returnVendorObj;
      }
    );
  }

  BindData() {
    this.MouCustDlrFindData = new MouCustDlrFinObj();
    this.MouCustDlrFindData.MouCustId = this.MouCustId;
    this.MouCustDlrFindData.WopCode = this.MouDetailFinancingForm.controls.WopCode.value;
    this.MouCustDlrFindData.TopDays = this.MouDetailFinancingForm.controls.TopDays.value;
    this.MouCustDlrFindData.TopInterestRatePrcnt = this.MouDetailFinancingForm.controls.TopInterestRatePrcnt.value;
    this.MouCustDlrFindData.PayFreqCode = this.MouDetailFinancingForm.controls.PayFreqCode.value;
    this.MouCustDlrFindData.InterestRatePrcnt = this.MouDetailFinancingForm.controls.InterestRatePrcnt.value;
    this.MouCustDlrFindData.MaximumMonthsForExtend = this.MouDetailFinancingForm.controls.MmForExtend.value;
    this.MouCustDlrFindData.MaximumTimesForExtends = this.MouDetailFinancingForm.controls.MaximumExtendTimes.value;
    this.MouCustDlrFindData.ExtendRatePrcnt = this.MouDetailFinancingForm.controls.ExtendRatePrcnt.value;
    this.MouCustDlrFindData.SpareDayToPay = this.MouDetailFinancingForm.controls.SpareDayToPay.value;
    this.MouCustDlrFindData.AssetCondition = this.MouDetailFinancingForm.controls.AssetCondition.value;
    this.MouCustDlrFindData.LcRate = this.MouDetailFinancingForm.controls.LcRatePrcnt.value;
    this.MouCustDlrFindData.PrincipalPaidInExtendPrcntg = this.MouDetailFinancingForm.controls.PpForExtendPrcnt.value;
    this.MouCustDlrFindData.DealerCode = this.DealerCode;
    this.MouCustDlrFindData.DealerCustNo = this.DealerCustNo;
    this.MouCustDlrFindData.Notes = this.MouDetailFinancingForm.controls.Notes.value;
    this.MouCustDlrFindData.MaximumExtendTimes = this.MouDetailFinancingForm.controls.MaximumExtendTimes.value;
    this.MouCustDlrFindData.MrInstTypeCode = this.MouDetailFinancingForm.controls.MrInstTypeCode.value;
    this.MouCustDlrFindData.VirtualAccNo = this.MouDetailFinancingForm.controls["VirtualAccNo"].value;
    this.MouCustDlrFindData.CurrCode = this.MouDetailFinancingForm.controls.CurrCode.value;

    if (this.MouCustDlrFindData.Notes === "") {
      this.MouCustDlrFindData.Notes = "-";
    }

    if (this.IsaAssetNew) {
      this.MouCustDlrFindData.ManufacturerCode = this.ManufacturerCode;
      this.MouCustDlrFindData.ManufacturerCustNo = this.ManufacturerCustNo;
    } else {
      this.MouCustDlrFindData.ManufacturerCode = "-";
      this.MouCustDlrFindData.ManufacturerCustNo = "-";
    }
  }


  instTypeHandler(insType) {
    if (insType == CommonConstant.SINGLE_INST_TYPE) {
      this.IsSingleIns = true;
      this.MouDetailFinancingForm.patchValue({
        PayFreqCode: CommonConstant.PAY_FREQ_MONTHLY,
      });
      this.MouDetailFinancingForm.controls["PayFreqCode"].disable();
      // this.MouDetailFinancingForm.controls["SingleInstCalcMthd"].enable();
    }
    else if (insType == CommonConstant.MULTIPLE_INST_TYPE) {
      this.IsSingleIns = false;
      this.MouDetailFinancingForm.controls["PayFreqCode"].enable();
      // this.MouDetailFinancingForm.controls["SingleInstCalcMthd"].disable();
    }
  }

  onItemChange(value) {
    console.log(value);
    if (value == "NEW") {

      this.InputLookupLinkManufacturerObj.isDisable = false;
      this.InputLookupManufacturerObj.isDisable = false;

      this.InputLookupLinkManufacturerObj.isRequired = false;
      this.InputLookupManufacturerObj.isRequired = false;

      this.MouDetailFinancingForm.controls.lookupLinkManufacturer.setValidators(Validators.required);
      this.MouDetailFinancingForm.controls.lookupManufacturer.setValidators(Validators.required);
      this.MouDetailFinancingForm.controls['lookupLinkManufacturer']['controls'].value.updateValueAndValidity();
      this.MouDetailFinancingForm.controls['lookupManufacturer']['controls'].value.updateValueAndValidity();
      this.IsaAssetNew = true;
    } else {

      this.InputLookupLinkManufacturerObj.isRequired = false;
      this.InputLookupManufacturerObj.isRequired = false;

      this.MouDetailFinancingForm.controls.lookupLinkManufacturer.clearValidators();
      this.MouDetailFinancingForm.controls.lookupManufacturer.clearValidators();;
      this.MouDetailFinancingForm.controls['lookupLinkManufacturer']['controls'].value.updateValueAndValidity();
      this.MouDetailFinancingForm.controls['lookupManufacturer']['controls'].value.updateValueAndValidity();

      this.InputLookupLinkManufacturerObj.nameSelect = "";
      this.InputLookupManufacturerObj.nameSelect = "";

      this.InputLookupLinkManufacturerObj.jsonSelect = {};
      this.InputLookupManufacturerObj.jsonSelect = {};

      this.InputLookupLinkManufacturerObj.isDisable = true;
      this.InputLookupManufacturerObj.isDisable = true;

      this.IsaAssetNew = false;
    }
  }
}
