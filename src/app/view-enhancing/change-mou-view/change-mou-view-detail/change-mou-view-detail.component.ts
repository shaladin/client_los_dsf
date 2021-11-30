import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { VendorObj } from "app/shared/model/vendor-obj.model";
import { UcViewGenericObj } from "app/shared/model/uc-view-generic-obj.model";
import { MouCustDlrFinObj } from "app/shared/model/mou-cust-dlr-fin.model";
import { AdInsHelper } from "app/shared/AdInsHelper";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { MouCustFctrObj } from "app/shared/model/mou-cust-fctr-obj.model";

@Component({
  selector: 'app-change-mou-view-detail',
  templateUrl: './change-mou-view-detail.component.html'
})
export class ChangeMouViewDetailComponent implements OnInit {
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

  mouCust: MouCustObj;
  mouCustClause: any;
  mouCustFctr: MouCustFctrObj;
  listAssetData: Array<any> = new Array();
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  isReady: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  isDataAlreadyLoaded: boolean = false;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  ngOnInit() {
    console.log(this.ChangeMouTrxId);
    console.log(this.MouCustId);
    if (this.MouType == CommonConstant.GENERAL) {
      let arrValue = [];
      arrValue.push(this.ChangeMouTrxId);
      arrValue.push(this.MouCustId);
      this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailGeneral.json";
      this.viewMainDataObj.whereValue = arrValue;
      this.isDataAlreadyLoaded = true;
      return
    }
    this.getChangeMouViewData();

    this.http.post(URLConstant.GetMouCustAssetByMouCustId, { Id: this.MouCustId }).subscribe((response) => {
      this.listAssetData = response[CommonConstant.ReturnObj];
    });
  }

  LinkManufacturer: VendorObj;
  LinkSupplier: VendorObj;
  Manufacturer: string = "-";
  LinkSupplGrading: VendorObj;
  RevolvingType: string;
  mouCustDlrFncng: MouCustDlrFinObj;
  Customer: string;
  TopDaysRatePercent: number;
  ExtendRate: number;
  MaxExtendRate: number;
  PrincipalPaid: number;
  SpareDay: number;
  AssetCondition: string;
  LcRate: number;
  MaxMonths: number;
  MaxExtendTimes: number;
  async getChangeMouViewData() {
    this.LinkManufacturer = new VendorObj();
    this.LinkSupplGrading = new VendorObj();

    let custNo: string = "";
    let ManufacturerCustNo: string = "";
    await this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
      async (response: MouCustObj) => {
        console.log(response);
        this.mouCust = response;
        this.MouCustId = this.mouCust.MouCustId;
        this.CurrCode = this.mouCust.CurrCode;
        this.PlafondAmt = this.mouCust.PlafondAmt;
        this.IsRevolving = this.mouCust.IsRevolving;

        if (this.MouType == 'FACTORING') {
          await this.http.post(URLConstant.GetForViewChangeMouCustFctrDetailByChangeMouTrxId, { Id: this.ChangeMouTrxId }).toPromise().then(
            (response: MouCustFctrObj) => {
              console.log(response);
              this.mouCustFctr = response;
              this.MrInstTypeCode = this.mouCustFctr.MrInstTypeCodeDesc;
              this.SingleInstCalcMthd = this.mouCustFctr.SingleInstCalcMthdDesc;
              this.MrPaidByCode = this.mouCustFctr.MrPaidByCodeDesc;
              this.PayFreqCode = this.mouCustFctr.PayFreqCode;

              this.WopCode = this.mouCustFctr.WopCode;
              this.TopDays = this.mouCustFctr.TopDays;
              this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
              this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
              this.IsDisclosed = this.mouCustFctr.IsDisclosed;
              this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
              this.Notes = this.mouCustFctr.Notes;
              this.RevolvingType = this.mouCustFctr.RevolvingTypeDesc;

              this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.mouCustFctr.VendorCode }).subscribe(
                (responseLink: VendorObj) => {
                  this.LinkSupplier = responseLink;
                });
            }
          )
        } else if (this.MouType == 'FINANCING') {
          await this.http.post(URLConstant.GetForViewChangeMouCustDlrFncgByMouCustId, { Id: this.MouCustId }).toPromise().then(
            (response: MouCustDlrFinObj) => {
              console.log(response);
              this.mouCustDlrFncng = response;
              this.PayFreqCode = this.mouCustDlrFncng.PayFreqCode;
              this.WopCode = this.mouCustDlrFncng.WopCodeDesc;
              this.RevolvingType = this.mouCustDlrFncng.RevolvingTypeDesc;
              this.TopDaysRatePercent = this.mouCustDlrFncng.TopInterestRatePrcnt;
              this.ExtendRate = this.mouCustDlrFncng.ExtendRatePrcnt;
              this.MaxExtendRate = this.mouCustDlrFncng.MaxExtendRate;
              this.PrincipalPaid = this.mouCustDlrFncng.PrincipalPaidInExtendPrcntg;
              this.SpareDay = this.mouCustDlrFncng.SpareDayToPay;
              this.AssetCondition = this.mouCustDlrFncng.AssetCondition;
              this.LinkManufacturer.VendorCode = this.mouCustDlrFncng.ManufacturerCode;
              ManufacturerCustNo = this.mouCustDlrFncng.ManufacturerCustNo;
              this.LinkSupplGrading.VendorCode = this.mouCustDlrFncng.DealerCode;
              custNo = this.mouCustDlrFncng.DealerCustNo;
              this.LcRate = this.mouCustDlrFncng.LcRate;
              this.Notes = this.mouCustDlrFncng.Notes;
              this.InterestRatePrcnt = this.mouCustDlrFncng.InterestRatePrcnt;
              this.MaxMonths = this.mouCustDlrFncng.MaximumMonthForExtend;
              this.TopDays = this.mouCustDlrFncng.TopDays;
              this.MaxExtendTimes = this.mouCustDlrFncng.MaximumExtendTimes;
            }
          )
        }
      })

    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkManufacturer.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkManufacturer = vendor;
      });
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkSupplGrading.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkSupplGrading = vendor;
      });

    await this.http.post(URLConstant.GetCustByCustNo, { CustNo: ManufacturerCustNo }).toPromise().then(
      (response: { CustName: string }) => {
        this.Manufacturer = response.CustName;
      });

    await this.http.post(URLConstant.GetCustByCustNo, { CustNo: custNo }).toPromise().then(
      (response: { CustName: string }) => {
        this.Customer = response.CustName;
      });

    this.isDataAlreadyLoaded = true;
  }
  ClickLinkManufacturer(vendorCode: string) {
    if (this.LinkManufacturer.VendorCode == vendorCode) {
      AdInsHelper.OpenVendorBranchViewByVendorId(this.LinkManufacturer.VendorId);
      return;
    }
    if (this.LinkSupplGrading.VendorCode == vendorCode) {
      AdInsHelper.OpenVendorBranchViewByVendorId(this.LinkSupplGrading.VendorId);
      return;
    }
    if (this.LinkSupplier.VendorCode == vendorCode) {
      AdInsHelper.OpenVendorBranchViewByVendorId(this.LinkSupplier.VendorId);
      return;
    }
  }

  GetCallBack(ev: any) {
    if (ev.Key == "manufacturer") {
      this.http.post(URLConstant.GetVendorByVendorCode, { Code: ev.ViewObj.manufacturerCode }).toPromise().then(
        (vendor: VendorObj) => {
          AdInsHelper.OpenVendorBranchViewByVendorId(vendor.VendorId);
        });
    } else if (ev.Key == "dealer") {
      this.http.post(URLConstant.GetVendorByVendorCode, { Code: ev.ViewObj.dealerCode }).toPromise().then(
        (vendor: VendorObj) => {
          AdInsHelper.OpenVendorBranchViewByVendorId(vendor.VendorId);
        });
    }
  }
}
