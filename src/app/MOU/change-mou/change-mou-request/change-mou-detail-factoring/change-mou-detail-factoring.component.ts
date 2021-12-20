import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { FormBuilder, Validators } from "@angular/forms";
import { RefMasterObj } from "app/shared/model/ref-master-obj.model";
import { forkJoin } from "rxjs";
import { MouCustFctrObj } from "app/shared/model/mou-cust-fctr-obj.model";
import { MouCustListedCustFctrComponent } from "app/MOU/mou-customer-request/mou-cust-listed-cust-fctr/mou-cust-listed-cust-fctr.component";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { MouCustListedCustFctrObj } from "app/shared/model/mou-cust-listed-cust-fctr-obj.model";
import { UclookupgenericComponent } from "@adins/uclookupgeneric";
import { InputLookupObj } from "app/shared/model/input-lookup-obj.model";
import { environment } from "environments/environment";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";
import { RefPayFreqObj } from "app/shared/model/ref-pay-freq-obj.model";
import { GenericObj } from "app/shared/model/generic/generic-obj.model";

@Component({
  selector: "app-change-mou-detail-factoring",
  templateUrl: "./change-mou-detail-factoring.component.html",
})

export class ChangeMouDetailFactoringComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number = 0;
  @Output() ResponseMouCustFactoring: EventEmitter<MouCustFctrObj> = new EventEmitter();
  @ViewChild(MouCustListedCustFctrComponent)
  MouListedFctrComp: MouCustListedCustFctrComponent;
  @ViewChild("LookupSupplier") ucLookupSupplier: UclookupgenericComponent;
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
  tempChangeMouCustFctr: GenericObj;
  listedCusts: Array<MouCustListedCustFctrObj>;

  paidByName: string = '';

  MouDetailFactoringForm = this.fb.group({
    MouCustFctrId: [0, [Validators.required]],
    MouCustId: [0, [Validators.required]],
    MrRecourseTypeCode: [""],
    IsDisclosed: [false],
    WopCode: [""],
    MrPaidByCode: [""],
    MrInstTypeCode: [""],
    SingleInstCalcMthd: [""],
    TopDays: ["", [Validators.min(0)]],
    TenorFrom: ["", [Validators.min(0)]],
    TenorTo: ["", [Validators.min(0)]],
    PayFreqCode: [""],
    MrInstSchmCode: [""],
    InterestRatePrcnt: [
      0,
      [Validators.min(0), Validators.max(100)],
    ],
    RetentionPrcnt: [
      0,
      [Validators.min(0), Validators.max(100)],
    ],
    IsListedCust: [false],
    Notes: [""],
    CurrCode: ["", [Validators.required]],
    RowVersion: [""],
    VendorCode: [""],
    VendorName: [""],
    VendorId: [""],
    VirAccNo: ['']
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder
  ) {
    this.isListedFctr = false;
    this.shouldComponentLoad = false;
  }

  ngOnInit() {
    var rmRecourseType = new RefMasterObj();
    rmRecourseType.RefMasterTypeCode =
      CommonConstant.RefMasterTypeCodeRecourseType;
    let getRecourseType = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmRecourseType
    );

    var rmWop = new RefMasterObj();
    rmWop.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeWOP;
    let getWop = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmWop
    );

    var rmPaidBy = new RefMasterObj();
    rmPaidBy.RefMasterTypeCode = CommonConstant.RefMasterTypeCodePaidBy;
    let getPaidBy = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmPaidBy
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

    var rmInstSchm = new RefMasterObj();
    rmInstSchm.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeInstSchm;
    rmInstSchm.MappingCode = CommonConstant.FCTR;
    let getInstSchm = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      rmInstSchm
    );

    var refMasterCurrency = new RefMasterObj();
    refMasterCurrency.RefMasterTypeCode =
      CommonConstant.RefMasterTypeCodeCurrency;
    let getCurrency = this.httpClient.post(
      URLConstant.GetRefMasterListKeyValueActiveByCode,
      refMasterCurrency
    );

    let getMouFctr = this.httpClient.post(
      URLConstant.GetMouCustFctrByMouCustId,
      {Id: this.MouCustId}
    );

    let getChangeMouFctr = this.httpClient.post(
      URLConstant.GetChangeMouCustFctrDetailByChangeMouTrxId,
      { Id: this.ChangeMouTrxId }
    );

    let getListedCustFctr = this.httpClient.post(
      URLConstant.GetListMouCustListedCustFctrByMouCustId,
      { Id: this.MouCustId }
    );

    this.bindUcLookup();

    forkJoin([
      getRecourseType,
      getWop,
      getPaidBy,
      getInstType,
      getSingleInstCalcMethod,
      getPayFreq,
      getInstSchm,
      getCurrency,
      getMouFctr,
      getChangeMouFctr,
      getListedCustFctr
    ]).subscribe((response: any) => {
      this.recourseTypeList = response[0].ReturnObject;
      this.wopList = response[1].ReturnObject;
      this.paidByList = response[2].ReturnObject;
      this.instTypeList = response[3].ReturnObject;
      this.singleInstCalcMthdList = response[4].ReturnObject;
      this.payFreqList = response[5].ReturnObject;
      this.instSchmList = response[6].ReturnObject;
      this.currencyList = response[7].ReturnObject;
      var mouFctrData = response[8];
      this.tempChangeMouCustFctr = response[9];
      this.listedCusts = response[10];
      this.MouDetailFactoringForm.patchValue({
        MrRecourseTypeCode: this.recourseTypeList[0].Key,
        WopCode: this.wopList[0].Key,
        MrPaidByCode: this.paidByList[0].Key,
        MrInstTypeCode: this.instTypeList[0].Key,
        SingleInstCalcMthd: this.singleInstCalcMthdList[0].Key,
        PayFreqCode: this.payFreqList[0].PayFreqCode,
        MrInstSchmCode: this.instSchmList[0].Key,
        CurrCode: this.currencyList[0].Key,
      });

      if (this.tempChangeMouCustFctr["ChangeMouCustFctrId"] == 0) {
        this.isListedFctr = mouFctrData["IsListedCust"];

        if (mouFctrData["MouCustFctrId"] != 0) {
          this.mode = "edit";
          this.MouDetailFactoringForm.patchValue({
            ...mouFctrData,
          });
          this.GetVendorName(mouFctrData["VendorCode"]);
        } else {
          this.MouDetailFactoringForm.patchValue({
            MouCustId: this.MouCustId,
          });
        }
      } else {
        this.isListedFctr = this.tempChangeMouCustFctr["IsListedCust"];

        if (this.tempChangeMouCustFctr["ChangeMouCustFctrId"] != 0) {
          this.mode = "edit";
          this.MouDetailFactoringForm.patchValue({
            ...this.tempChangeMouCustFctr,
          });
          this.GetVendorName(this.tempChangeMouCustFctr["VendorCode"]);
        } else {
          this.MouDetailFactoringForm.patchValue({
            MouCustId: this.MouCustId,
          });
        }
      }

      //this.CheckPaidBy(this.MouDetailFactoringForm.controls.MrPaidByCode.value);
     

      this.MouDetailFactoringForm.controls["MrRecourseTypeCode"].disable();
      this.MouDetailFactoringForm.controls["IsDisclosed"].disable();

      if(this.MouDetailFactoringForm.controls.MrRecourseTypeCode.value == CommonConstant.WITHOUT_RECOURSE_TYPE)
      {
        this.MouDetailFactoringForm.controls["MrInstTypeCode"].disable();
      }
      this.MouDetailFactoringForm.updateValueAndValidity();

      this.instTypeHandler(true);
      this.shouldComponentLoad = true;
      if (this.paidByList != null) {
        if (this.paidByList != null) {
          let paidBy = this.paidByList.find(x => x.Key == this.MouDetailFactoringForm.controls.MrPaidByCode.value)
          if (paidBy != null) {
            this.paidByName = paidBy.Value
          }
        }
      }
    });

  }

  bindUcLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson =
      "./assets/uclookup/NAP/lookupSupplier.json";
    this.inputLookupObj.genericJson =
      "./assets/uclookup/NAP/lookupSupplier.json";
    this.inputLookupObj.isRequired = false;
    this.inputLookupObj.isReady = true;
  }

  GetVendorName(vendorCode) {
    var vendorObj = {
      Code: vendorCode
    };
    this.httpClient.post(URLConstant.GetVendorByVendorCode, vendorObj).toPromise().then(
      (response) => {
        this.inputLookupObj.nameSelect = response["VendorName"];
        this.inputLookupObj.jsonSelect = response;
      }
    );
  }

  SetSupplier(e) {
    this.MouDetailFactoringForm.patchValue({
      VendorCode: e.VendorCode,
      VendorName: e.VendorName,
      VendorId: e.VendorId,
    });
  }

  instTypeHandler(isOnInit: boolean = false) {
    var value = this.MouDetailFactoringForm.controls["MrInstTypeCode"].value;
    if (value == CommonConstant.SINGLE_INST_TYPE) {
      this.IsSingleIns = true;
      this.MouDetailFactoringForm.patchValue({
        PayFreqCode: CommonConstant.PAY_FREQ_MONTHLY,
        MrInstSchmCode: CommonConstant.INST_SCHM_REGULAR_FIXED,
      });
      this.MouDetailFactoringForm.controls["PayFreqCode"].disable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].disable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].enable();
      if(!isOnInit){
        this.MouDetailFactoringForm.patchValue({
          SingleInstCalcMthd: this.singleInstCalcMthdList[0].Key,
        });
      }
    } else if (value == CommonConstant.MULTIPLE_INST_TYPE) {
      this.IsSingleIns = false;
      this.MouDetailFactoringForm.controls["PayFreqCode"].enable();
      this.MouDetailFactoringForm.controls["MrInstSchmCode"].enable();
      this.MouDetailFactoringForm.controls["SingleInstCalcMthd"].disable();
      this.MouDetailFactoringForm.patchValue({
        SingleInstCalcMthd: "",
      });
    }
  }

  Save(enjiForm) {
    var formData = this.MouDetailFactoringForm.getRawValue();
    formData.IsListedCust = false;

    if (this.IsSingleIns) {
    } else {
      if (
        (formData.TenorFrom != "" || formData.TenorTo != "") &&
        formData.TenorFrom > formData.TenorTo
      ) {
        this.isTenorInvalid = true;
        this.tenorInvalidMsg = "Invalid Tenor Range";
        return false;
      } else {
        if (formData.TenorFrom == "") {
          formData.TenorFrom = 0;
        }
        if (formData.TenorTo == "") {
          formData.TenorTo = 0;
        }
        this.isTenorInvalid = false;
        this.tenorInvalidMsg = "";
      }
    }

    this.httpClient.post(URLConstant.AddEditChangeMouCustFctr, formData).subscribe((response: MouCustFctrObj) => {
      this.ResponseMouCustFactoring.emit(response);
    });

  }

  // CheckPaidBy(value: string) {
  //   if (value == CommonConstant.PAID_BY_CUST_FCTR) {
  //     this.MouDetailFactoringForm.controls.IsDisclosed.disable();
  //     this.MouDetailFactoringForm.controls.IsDisclosed.setValue(true);
  //   } else if (value == CommonConstant.PAID_BY_CUST) {
  //     this.MouDetailFactoringForm.controls.IsDisclosed.enable();
  //     this.MouDetailFactoringForm.controls.IsDisclosed.setValue(false);
  //   }
  //   this.MouDetailFactoringForm.updateValueAndValidity();
  // }
}
