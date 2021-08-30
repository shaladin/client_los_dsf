import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { VendorObj } from "app/shared/model/Vendor.Model";

@Component({
  selector: 'app-change-mou-view-detail-x',
  templateUrl: './change-mou-view-detail-x.component.html'
})
export class ChangeMouViewDetailXComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() ChangeMouTrxId: number;
  
  MouCustClauseId: number;
  CurrCode: string;
  AssetTypeCode: string;
  MrFirstInstTypeCode: string;
  MrInterestTypeCode: string;
  MrInstTypeCode: string;
  MrInstSchmCode: string;
  PayFreqCode: string;
  DownPaymentFromPrcnt: number;
  DownPaymentToPrcnt: number;
  TenorFrom: number;
  TenorTo: number;

  WopCode: string;
  PlafondAmt: number;
  IsRevolving: boolean;
  TopDays: number;
  InterestRatePrcnt: number;
  RetentionPrcnt: number;
  IsDisclosed: boolean;
  IsListedCust: boolean;
  MrRecourseTypeCode: string;
  Notes: string;

  mouCust: any;
  mouCustClause: any;
  mouCustFctr: any;
  mouCustDlrFncng:any;
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  isReady: boolean = false;
  dealerGrading: string;
  dealerRating: number;

  RevolvingType: string;
  TopDaysRatePercent:number;
  ExtendRate:number;
  MaxExtendRate:number;
  PrincipalPaid:number;
  SpareDay:number;
  AssetCondition:string;
  LinkManufacturer:VendorObj;
  Manufacturer:string;
  LinkSupplGrading:VendorObj;
  Customer:string;
  LcRate:number;
  MaxMonths:number;
  MaxExtendTimes:number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId };
    if (this.MouType == CommonConstant.GENERAL) {
      this.http
        .post(URLConstant.GetMouCustDataByMouCustId, mouCustObj)
        .subscribe((response) => {
          this.mouCust = response["MouCustObj"];
          this.MouCustId = this.mouCust.MouCustId;
          this.CurrCode = this.mouCust.CurrCode;
          this.PlafondAmt = this.mouCust.PlafondAmt;
          this.IsRevolving = this.mouCust.IsRevolving;

          this.mouCustClause = response["MouCustClauseObj"];
          this.AssetTypeCode = this.mouCustClause.AssetTypeCode;
          this.MrInterestTypeCode = this.mouCustClause.InterestTypeDescr;
          this.MrFirstInstTypeCode = this.mouCustClause.MrFirstInstTypeCode;
          this.MrInstSchmCode = this.mouCustClause.MrInstSchmCode;
          this.PayFreqCode = this.mouCustClause.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustClause.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustClause.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustClause.TenorFrom;
          this.TenorTo = this.mouCustClause.TenorTo;
        });
    } else if (this.MouType == CommonConstant.FACTORING) {
      this.http
        .post(URLConstant.GetMouCustDataByMouCustId, mouCustObj)
        .subscribe((response) => {
          this.mouCust = response["MouCustObj"];
          this.MouCustId = this.mouCust.MouCustId;
          this.CurrCode = this.mouCust.CurrCode;
          this.PlafondAmt = this.mouCust.PlafondAmt;
          this.IsRevolving = this.mouCust.IsRevolving;

          this.mouCustFctr = response["MouCustFctrObj"];
          this.AssetTypeCode = this.mouCustFctr.AssetTypeCode;
          this.MrFirstInstTypeCode = this.mouCustFctr.MrFirstInstTypeCode;
          this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
          this.MrInstSchmCode = this.mouCustFctr.MrInstSchmCode;
          this.SingleInstCalcMthd = this.mouCustFctr.SingleInstCalcMthdDescr;
          this.MrPaidByCode = this.mouCustFctr.PaidByDescr;
          this.PayFreqCode = this.mouCustFctr.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustFctr.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustFctr.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustFctr.TenorFrom;
          this.TenorTo = this.mouCustFctr.TenorTo;

          this.WopCode = this.mouCustFctr.WopCode;
          this.TopDays = this.mouCustFctr.TopDays;
          this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
          this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
          this.IsDisclosed = this.mouCustFctr.IsDisclosed;
          this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
          this.Notes = this.mouCustFctr.Notes;
        });
    } else if (this.MouType == CommonConstant.FINANCING) {
      this.getChangeMouDealerFinancingView();
    }
    

    this.http
      .post(URLConstant.GetMouCustAssetByMouCustId, { Id: this.MouCustId })
      .subscribe((response) => {
        this.listAssetData = response[CommonConstant.ReturnObj];
        var test = this.listAssetData.length;
      });

    this.getChangeMouDealerGrading();
  }

  getChangeMouDealerGrading() {
    var test = this.ChangeMouTrxId;
    var test2 = this.MouCustId;
    this.http.post(URLConstantX.GetChangeMouDealerGradingX, { Id: this.ChangeMouTrxId }).subscribe(
      (response) => {
        this.dealerGrading = response['DealerGrading'];
        this.dealerRating = response['DealerRating'];
      });
  }

  async getChangeMouDealerFinancingView(){
    var ChangeMouTrxObj = { MouCustId: this.MouCustId,ChangeMouTrxId: this.ChangeMouTrxId };
    this.LinkManufacturer = new VendorObj();
    this.LinkSupplGrading = new VendorObj();
    await this.http.post(URLConstantX.GetMouCustDataByMouCustIdX, ChangeMouTrxObj).toPromise().then(
      (response) => {
      this.mouCust = response["MouCustObj"];
      this.MouCustId = this.mouCust.MouCustId;
      this.CurrCode = this.mouCust.CurrCode;
      this.PlafondAmt = this.mouCust.PlafondAmt;
      this.IsRevolving = this.mouCust.IsRevolving;

      this.mouCustDlrFncng = response["MouCustDlrFncngObj"];
      this.PayFreqCode = this.mouCustDlrFncng.PayFreqCode;
      this.WopCode = this.mouCustDlrFncng.WopCode;
      this.RevolvingType = this.mouCustDlrFncng.RevolvingType;
      this.TopDaysRatePercent = this.mouCustDlrFncng.TopInterestRatePrcnt;
      this.ExtendRate = this.mouCustDlrFncng.ExtendRatePrcnt;
      this.MaxExtendRate = this.mouCustDlrFncng.MaxExtendRate;
      this.PrincipalPaid = this.mouCustDlrFncng.PrincipalPaidInExtendPrcntg;
      this.SpareDay = this.mouCustDlrFncng.SpareDayToPay;
      this.AssetCondition = this.mouCustDlrFncng.AssetCondition;
      this.LinkManufacturer.VendorCode = this.mouCustDlrFncng.ManufacturerCode;
      this.Manufacturer = this.mouCustDlrFncng.ManufacturerCustNo;
      this.LinkSupplGrading.VendorCode = this.mouCustDlrFncng.DealerCode;
      this.Customer = this.mouCustDlrFncng.DealerCustNo;
      this.LcRate = this.mouCustDlrFncng.LcRate;
      this.Notes = this.mouCustDlrFncng.Notes;
      this.InterestRatePrcnt = this.mouCustDlrFncng.InterestRatePrcnt;
      this.MaxMonths = this.mouCustDlrFncng.MaximumMonthsForExtend;
      this.TopDays = this.mouCustDlrFncng.TopDays;
      this.MaxExtendTimes = this.mouCustDlrFncng.MaximumExtendTimes;
    });
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkManufacturer.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkManufacturer = vendor;
      });
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkSupplGrading.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkSupplGrading = vendor;
      });

    await this.http.post(URLConstant.GetCustByCustNo, {CustNo: this.Manufacturer}).toPromise().then(
      (response:any) => {
        this.Manufacturer = response['CustName'];
      });

    await this.http.post(URLConstant.GetCustByCustNo, {CustNo: this.Customer}).toPromise().then(
      (response:any) => {
        this.Customer = response['CustName'];
      });
  }

  MouDataForm = this.fb.group({});

  AssetDataForm = this.fb.group({});
}
