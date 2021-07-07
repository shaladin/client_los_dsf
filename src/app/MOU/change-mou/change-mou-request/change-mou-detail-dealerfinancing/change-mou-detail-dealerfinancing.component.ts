import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FormBuilder, Validators } from "@angular/forms";
import { RefMasterObj } from "app/shared/model/RefMasterObj.Model";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { forkJoin } from "rxjs";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { InputLookupObj } from "app/shared/model/InputLookupObj.Model";
import { environment } from "environments/environment";
import { MouCustDlrFinObj } from "app/shared/model/moucustdlrfin.model";
import { CriteriaObj } from "app/shared/model/CriteriaObj.model";
import { VendorObj } from "app/shared/model/Vendor.Model";
import { RefPayFreqObj } from "app/shared/model/RefPayFreqObj.model";
import { KeyValueObj } from "app/shared/model/KeyValue/KeyValueObj.model";
import { GenericObj } from "app/shared/model/Generic/GenericObj.Model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "app-change-mou-detail-dealerfinancing",
  templateUrl: "./change-mou-detail-dealerfinancing.component.html",
})
export class ChangeMouDetailDealerFinancingComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number;
  @Input() ChangeMouCustId: number;
  @Output() ResponseMouCustDealerfinancing: EventEmitter<MouCustDlrFinObj> = new EventEmitter();
  payFreqList: Array<RefPayFreqObj>;
  currencyList: Array<KeyValueObj>;
  isListedFctr: boolean;
  shouldComponentLoad: boolean;
  isTenorInvalid: boolean;
  tenorInvalidMsg: string;
  private mode: string = "add";
  IsSingleIns: boolean = true;
  DealerCustNo: string;
  DealerCode: string;
  DealerName: string;
  ManufacturerCustNo: string;
  ManufacturerCode: string;
  ManufacturerName: string;
  AsseConditionLis: Array<KeyValueObj>;
  MouDlrFinData: MouCustDlrFinObj;
  ChangeMouDlrFinData: any;
  MouNo: string;

  ChangeMouCustDlrFindData: MouCustDlrFinObj;

  InputLookupLinkManufacturerObj: InputLookupObj = new InputLookupObj();
  InputLookupLinkSupplGradingObj: InputLookupObj = new InputLookupObj();

  IsAssetNew: boolean = true;

  MouDetailFinancingForm = this.fb.group({
    TopDays: ["", [Validators.min(0)]],
    InterestRatePrcnt: ["", [Validators.min(0), Validators.max(100)]],
    Notes: [""],
    CurrCode: ["", [Validators.required]],
    RowVersion: [""],
    TopInterestRatePrcnt: [""],
    ExtendRatePrcnt: [""],
    MmForExtend: [""],
    PpForExtendPrcnt: [""],
    SpareDayToPay: [""],
    AssetCondition: [""],
    LcRatePrcnt: [""],
    MaximumExtendTimes: [""],
    ManufacturerCode: [""],
    ManufacturerCustNo: [""],
    DealerCode: [""],
    DealerCustNo: [""],
    PayFreqCode: [""],
    WopCode: [""]
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

    var rmRecourseType = new RefMasterObj();
    rmRecourseType.RefMasterTypeCode =
      CommonConstant.RefMasterTypeCodeRecourseType;
    let getRecourseType = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmRecourseType
    );

    var rmInstType = new RefMasterObj();
    rmInstType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstType;
    let getInstType = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmInstType
    );

    var rmSingleInstCalcMethod = new RefMasterObj();
    rmSingleInstCalcMethod.RefMasterTypeCode =
      CommonConstant.RefMasterTypeCodeSingleInstCalcMethod;
    let getSingleInstCalcMethod = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmSingleInstCalcMethod
    );

    let getPayFreq = this.httpClient.post(
      URLConstant.GetListActiveRefPayFreq,
      null
    );

    var refCurr;
    let getCurrency = this.httpClient.post(
      URLConstant.GetListKvpActiveRefCurr,
      refCurr
    );

    var mouCustFctr = new GenericObj();
    mouCustFctr.Id = this.MouCustId;
    let getMouDlrFin = this.httpClient.post(
      URLConstant.GetMouCustDlrFindById,
      mouCustFctr
    );

    var rmAssetStatus = new RefMasterObj();
    rmAssetStatus.RefMasterTypeCode =
      CommonConstant.RefMasterTypeCodeAssetCondition;
    let getssetStatus = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmAssetStatus
    );

    var mouCustFctr = new GenericObj();
    mouCustFctr.Id = this.MouCustId;
    let getChangeMouCustDlrFncg = this.httpClient.post(URLConstant.GetChangeMouCustDlrFncgByMouCustId, mouCustFctr);

    forkJoin([
      getPayFreq,
      getCurrency,
      getMouDlrFin,
      getssetStatus,
      getChangeMouCustDlrFncg,
    ]).subscribe((response: any) => {
      this.payFreqList = response[0].ReturnObject;
      this.currencyList = response[1].ReturnObject;
      this.MouDlrFinData = response[2];
      this.AsseConditionLis = response[3].ReturnObject;
      this.ChangeMouDlrFinData = response[4];

      this.MouDetailFinancingForm.patchValue({
        PayFreqCode: this.payFreqList[0].PayFreqCode,
        CurrCode: this.currencyList[0].Key,
        AssetCondition: this.AsseConditionLis[0].Key,
      });

      if (this.MouDlrFinData["MouCustDlrFncngId"] != 0) {
        this.mode = "edit";

        this.MouDetailFinancingForm.patchValue({
          WopCode: this.MouDlrFinData["WopCode"],
          PayFreqCode: this.MouDlrFinData["PayFreqCode"],
          MrInstSchmCode: this.MouDlrFinData["MrInstSchmCode"]
        });

        if (this.ChangeMouDlrFinData["Status"] == "Success") {
          this.MouDetailFinancingForm.patchValue({
            TopDays: this.ChangeMouDlrFinData["TopDays"],
            InterestRatePrcnt: this.ChangeMouDlrFinData["InterestRatePrcnt"],
            Notes: this.ChangeMouDlrFinData["Notes"],
            MmForExtend: this.ChangeMouDlrFinData["MaximumMonthForExtend"],
            TopInterestRatePrcnt: this.ChangeMouDlrFinData["TopInterestRatePrcnt"],
            ExtendRatePrcnt: this.ChangeMouDlrFinData["ExtendRatePrcnt"],
            PpForExtendPrcnt: this.ChangeMouDlrFinData["PrincipalPaidInExtendPrcntg"],
            SpareDayToPay: this.ChangeMouDlrFinData["SpareDayToPay"],
            AssetCondition: this.ChangeMouDlrFinData["AssetCondition"],
            LcRatePrcnt: this.ChangeMouDlrFinData["LcRate"],
            MaximumExtendTimes: this.ChangeMouDlrFinData["MaximumExtendTimes"],
          });

          this.ManufacturerCode = this.ChangeMouDlrFinData["ManufacturerCode"];
          this.ManufacturerCustNo = this.ChangeMouDlrFinData["ManufacturerCustNo"];
          this.DealerCode = this.ChangeMouDlrFinData["DealerCode"];
          this.DealerCustNo = this.ChangeMouDlrFinData["DealerCustNo"];

        }else{
          this.MouDetailFinancingForm.patchValue({
            TopDays: this.MouDlrFinData["TopDays"],
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
          });

          this.ManufacturerCode = this.MouDlrFinData["ManufacturerCode"];
          this.ManufacturerCustNo = this.MouDlrFinData["ManufacturerCustNo"];
          this.DealerCode = this.MouDlrFinData["DealerCode"];
          this.DealerCustNo = this.MouDlrFinData["DealerCustNo"];
        }
        this.BidDataLookUp(this.ManufacturerCode, this.ManufacturerCustNo, this.DealerCode, this.DealerCustNo);

      } else {
        this.MouDetailFinancingForm.patchValue({
          MouCustId: this.MouCustId,
        });
      }

      this.shouldComponentLoad = true;
    });
  }

  Save(enjiForm) {
    this.BindData();
    this.httpClient.post(URLConstant.AddEditChangeMouCustDlrFin, this.ChangeMouCustDlrFindData).subscribe(
      (response: MouCustDlrFinObj) => {
        this.ResponseMouCustDealerfinancing.emit(response);
      });
  }

  initLookup() {
    const currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    const suppCrit = new Array();
    const critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'ro.OFFICE_CODE';
    critSuppObj.value = currentUserContext[CommonConstant.OFFICE_CODE];
    //suppCrit.push(critSuppObj);


    this.InputLookupLinkSupplGradingObj.urlJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupLinkSupplGradingObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupLinkSupplGradingObj.pagingJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.genericJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkSupplGradingObj.isReadonly = false;
    this.InputLookupLinkSupplGradingObj.isRequired = false;
    this.InputLookupLinkSupplGradingObj.addCritInput = suppCrit;

    this.InputLookupLinkManufacturerObj.urlJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.InputLookupLinkManufacturerObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupLinkManufacturerObj.pagingJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.genericJson = "./assets/uclookup/NAP/lookupMOUSupplier.json";
    this.InputLookupLinkManufacturerObj.isReadonly = false;
    this.InputLookupLinkManufacturerObj.isRequired = false;
    this.InputLookupLinkManufacturerObj.addCritInput = suppCrit;
  }

  LinkManufacturerEvent(event) {
    this.ManufacturerCode = event.VendorCode;
  }

  ManufacturerEvent(event) {
    this.ManufacturerCustNo = event.CustNo;
  }

  LinkSupplGradingEvent(event) {
    this.DealerCode = event.VendorCode;
  }

  CustomerEvent(event) {
    this.DealerCustNo = event.CustNo;;
  }

  BidDataLookUp(ManufacturerCode, ManufacturerCustNo, DealerCode, DealerCustNo) {

    this.ManufacturerCode = ManufacturerCode;
    this.ManufacturerCustNo = ManufacturerCustNo;
    this.DealerCode = DealerCode;
    this.DealerCustNo = DealerCustNo;

    const ManufacturerCustNoObj = { CustNo: ManufacturerCustNo };
    this.httpClient.post(URLConstant.GetCustByCustNo, ManufacturerCustNoObj).subscribe(
      response => {
        this.ManufacturerName = response["CustName"];
      }
    );

    const DealerCustNoObj = { CustNo: DealerCustNo };
    this.httpClient.post(URLConstant.GetCustByCustNo, DealerCustNoObj).subscribe(
      response => {
        this.DealerName = response["CustName"];
      }
    );

    const reqVendorObj = {Code : ManufacturerCode};
    this.httpClient.post(URLConstant.GetVendorForLookup, reqVendorObj).subscribe(
      (response) => {
        this.InputLookupLinkManufacturerObj.nameSelect = response["VendorName"];
        this.InputLookupLinkManufacturerObj.jsonSelect = response;
      }
    );

    const reqVendorObj2 = {Code : DealerCode};
    this.httpClient.post(URLConstant.GetVendorForLookup, reqVendorObj2).subscribe(
      (response) => {
        this.InputLookupLinkSupplGradingObj.nameSelect = response["VendorName"];
        this.InputLookupLinkSupplGradingObj.jsonSelect = response;
      }
    );
  }

  BindData() {
    this.ChangeMouCustDlrFindData = new MouCustDlrFinObj();
    this.ChangeMouCustDlrFindData.ChangeMouTrxId = this.ChangeMouTrxId;
    this.ChangeMouCustDlrFindData.MouCustId = this.MouCustId;
    this.ChangeMouCustDlrFindData.TopDays = this.MouDetailFinancingForm.controls.TopDays.value;
    this.ChangeMouCustDlrFindData.TopInterestRatePrcnt = this.MouDetailFinancingForm.controls.TopInterestRatePrcnt.value;
    this.ChangeMouCustDlrFindData.InterestRatePrcnt = this.MouDetailFinancingForm.controls.InterestRatePrcnt.value;
    this.ChangeMouCustDlrFindData.MaximumMonthsForExtend = this.MouDetailFinancingForm.controls.MmForExtend.value;
    this.ChangeMouCustDlrFindData.MaximumTimesForExtends = this.MouDetailFinancingForm.controls.MaximumExtendTimes.value;
    this.ChangeMouCustDlrFindData.ExtendRatePrcnt = this.MouDetailFinancingForm.controls.ExtendRatePrcnt.value;
    this.ChangeMouCustDlrFindData.SpareDayToPay = this.MouDetailFinancingForm.controls.SpareDayToPay.value;
    this.ChangeMouCustDlrFindData.AssetCondition = this.MouDetailFinancingForm.controls.AssetCondition.value;
    this.ChangeMouCustDlrFindData.LcRate = this.MouDetailFinancingForm.controls.LcRatePrcnt.value;
    this.ChangeMouCustDlrFindData.PrincipalPaidInExtendPrcntg = this.MouDetailFinancingForm.controls.PpForExtendPrcnt.value;
    this.ChangeMouCustDlrFindData.DealerCode = this.DealerCode;
    this.ChangeMouCustDlrFindData.DealerCustNo = this.DealerCustNo;
    this.ChangeMouCustDlrFindData.Notes = this.MouDetailFinancingForm.controls.Notes.value;
    this.ChangeMouCustDlrFindData.MaximumExtendTimes = this.MouDetailFinancingForm.controls.MaximumExtendTimes.value;
    this.ChangeMouCustDlrFindData.ManufacturerCode = this.ManufacturerCode;
    this.ChangeMouCustDlrFindData.ManufacturerCustNo = this.ManufacturerCustNo;
    this.ChangeMouCustDlrFindData.PayFreqCode = this.MouDetailFinancingForm.controls.PayFreqCode.value;
    this.ChangeMouCustDlrFindData.WopCode = this.MouDetailFinancingForm.controls.WopCode.value;
    this.ChangeMouCustDlrFindData.CurrCode = null;
    this.ChangeMouCustDlrFindData.MouCustDlrFncngId = 0;
    this.ChangeMouCustDlrFindData.MrInstTypeCode = null;
    this.ChangeMouCustDlrFindData.VirtualAccNo = null;
  }
}
