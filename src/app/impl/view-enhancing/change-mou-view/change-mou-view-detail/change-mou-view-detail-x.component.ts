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
import { URLConstantX } from "app/impl/shared/constant/URLConstantX";
import { GenericKeyValueListObj } from "app/shared/model/generic/generic-key-value-list-obj.model";

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
  RealisationAmt: number;
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
  mouCustFctr: any;
  listAssetData: Array<any> = new Array();
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  isReady: boolean = false;
  dealerGrading: string;
  dealerRating: number;

  constructor(
    private http: HttpClient
  ) { }

  isDataAlreadyLoaded: boolean = false;
  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  async ngOnInit() {
    let mouCustObj = { Id: this.MouCustId };
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

    var url: string = "";
    if (this.MouType == CommonConstant.FACTORING) {
      url = URLConstantX.GetMouFctrOsPlafondById;
    } else if (this.MouType == CommonConstant.DEALERFINANCING) {
      url = URLConstantX.GetMouDfOsPlafondByIdX;
    }
    if (this.MouType == CommonConstant.FACTORING || this.MouType == CommonConstant.DEALERFINANCING) {
      await this.http.post(url, { Id: this.MouCustId }).toPromise().then(
        (response) => {
          this.MouOsPlafond = response['Result'];
        }
      );
    }

    this.http.post(URLConstant.GetMouCustAssetByMouCustId, { Id: this.MouCustId }).subscribe((response) => {
      this.listAssetData = response[CommonConstant.ReturnObj];
    });
    this.getChangeMouDealerGrading();
    this.GetListKvpActiveRefCurr();
  }

  LinkManufacturer: VendorObj;
  LinkSupplier: VendorObj;
  Manufacturer: string = "-";
  RevolvingType: string;
  mouCustDlrFncng: MouCustDlrFinObj;
  Customer: string;
  TopDaysRatePercent: number;
  ExtendRate: number;
  MaxExtendRate: number;
  PrincipalPaid: number;
  SpareDay: number;
  AssetCondition: string;
  LinkSupplGrading: VendorObj = new VendorObj();
  LcRate: number;
  MaxMonths: number;
  MaxExtendTimes: number;
  MouOsPlafond: number = 0;
  VirtualAccNo: string;
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
        this.RealisationAmt = this.mouCust.RealisationAmt;

        if (this.MouType == 'FACTORING') {
          this.http
            .post(URLConstant.GetMouCustDataByMouCustId, { Id: this.MouCustId })
            .subscribe((response) => {
              this.mouCust = response["MouCustObj"];
              this.MouCustId = this.mouCust.MouCustId;
              this.CurrCode = this.mouCust.CurrCode;
              this.PlafondAmt = this.mouCust.PlafondAmt;
              this.IsRevolving = this.mouCust.IsRevolving;
              this.RealisationAmt = this.mouCust.RealisationAmt;
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
              this.IsListedCust = this.mouCustFctr.IsListedCust;
              this.WopCode = this.mouCustFctr.WopCode;
              this.TopDays = this.mouCustFctr.TopDays;
              this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
              this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
              this.IsDisclosed = this.mouCustFctr.IsDisclosed;
              this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
              this.Notes = this.mouCustFctr.Notes;
              this.VirtualAccNo = this.mouCustFctr.VirtualAccNo;
              this.LinkSupplGrading.VendorCode = this.mouCustFctr.VendorCode;
              this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkSupplGrading.VendorCode }).subscribe(
                (responseLink: VendorObj) => {
                  this.LinkSupplier = responseLink;
                  this.LinkSupplGrading = responseLink;
                });
            });
        } else if (this.MouType == 'FINANCING') {
          await this.getChangeMouDealerFinancingView();
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
  getChangeMouDealerGrading() {
    var test = this.ChangeMouTrxId;
    var test2 = this.MouCustId;
    this.http.post(URLConstantX.GetChangeMouDealerGradingX, { Id: this.ChangeMouTrxId }).subscribe(
      (response) => {
        this.dealerGrading = response['DealerGrading'];
        this.dealerRating = response['DealerRating'];
      });
  }

  dictRefCurr: { [id: string]: string } = {};
  GetListKvpActiveRefCurr() {
    this.http.post(URLConstant.GetListKvpActiveRefCurr, null).subscribe(
      (response: GenericKeyValueListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefCurr[element.Key] = element.Value;
        }
      }
    );
  }

  async getChangeMouDealerFinancingView() {
    var ChangeMouTrxObj = { MouCustId: this.MouCustId, ChangeMouTrxId: this.ChangeMouTrxId };
    this.LinkManufacturer = new VendorObj();
    await this.http.post(URLConstantX.GetMouCustDataByMouCustIdX, ChangeMouTrxObj).toPromise().then(
      (response) => {
        this.mouCust = response["MouCustObj"];
        this.MouCustId = this.mouCust.MouCustId;
        this.CurrCode = this.mouCust.CurrCode;
        this.PlafondAmt = this.mouCust.PlafondAmt;
        this.IsRevolving = this.mouCust.IsRevolving;
        this.RealisationAmt = this.mouCust.RealisationAmt;
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
        var ObjectRefMaster = {
          RefMasterTypeCode: CommonConstant.RefMasterTypeCodeInstType,
          MasterCode: this.mouCustDlrFncng.MrInstTypeCode
        }
        this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, ObjectRefMaster).subscribe(
          (responseRefMaster) => {
            this.MrInstTypeCode = responseRefMaster["Descr"];
          });
      });
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkManufacturer.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkManufacturer = vendor;
      });
    await this.http.post(URLConstant.GetVendorByVendorCode, { Code: this.LinkSupplGrading.VendorCode }).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkSupplGrading = vendor;
      });

    await this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.Manufacturer }).toPromise().then(
      (response: any) => {
        this.Manufacturer = response['CustName'];
      });

    await this.http.post(URLConstant.GetCustByCustNo, { CustNo: this.Customer }).toPromise().then(
      (response: any) => {
        this.Customer = response['CustName'];
      });
  }
}
