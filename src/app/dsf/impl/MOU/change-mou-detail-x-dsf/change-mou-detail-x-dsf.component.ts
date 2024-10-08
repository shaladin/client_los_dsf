import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { VendorObj } from 'app/shared/model/vendor-obj.model';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { RequestMouCustDsfObj } from 'app/shared/model/req-mou-cust-dsf-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-change-mou-detail-x-dsf',
  templateUrl: './change-mou-detail-x-dsf.component.html',
  styleUrls: ['./change-mou-detail-x-dsf.component.css']
})
export class ChangeMouDetailXDsfComponent implements OnInit {

  @Input() ChangeMouTrxId: number;
  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string; //CHNGMOU OR REQEXP
  // listedCustFctrIsReady: boolean = false;
  // listedCustFctr: Array<any>;
  // ReqByIdObj: GenericObj = new GenericObj();

  isDataAlreadyLoaded: boolean = false;

  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];
  mouCust: any;
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

  mouCustClause: any;
  mouCustFctr: any;
  mouCustDlrFncng: any;
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
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
  LinkSupplier:any = "-";
  ReqMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();
  IsNewCalculation: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {

  }

  ngOnInit() {
    // this.ReqByIdObj.Id = this.MouCustId ;
    // if(this.MouType == 'FACTORING'){
    //   this.getListedMouCustFctr(this.ReqByIdObj);
    //   }

    // if (this.TrxType == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU) {
    //   if (this.MouType == CommonConstant.DEALERFINANCING) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFinancing.json";
    //   }
    //   else if (this.MouType == CommonConstant.FACTORING) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFactoring.json";
    //   }
    //   else if (this.MouType == CommonConstant.GENERAL) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailGeneral.json";
    //   }
    // } else if (CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP) {
    //   if (this.MouType == CommonConstant.DEALERFINANCING) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChgMouDtlFinancingExpType.json";
    //   }
    //   else if (this.MouType == CommonConstant.FACTORING) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChgMouDtlFctrForExpType.json";
    //   }
    //   else if (this.MouType == CommonConstant.GENERAL) {
    //     this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDtlGenrReqExpType.json";
    //   }
    // }

    if (this.MouType == CommonConstant.GENERAL) {
      this.arrValue.push(this.ChangeMouTrxId);
      this.arrValue.push(this.MouCustId);
      if (this.TrxType == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailGeneral.json";
      }else if (this.MouType == CommonConstant.GENERAL) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDtlGenrReqExpType.json";
      }
      this.viewMainDataObj.whereValue = this.arrValue;
      this.isDataAlreadyLoaded = true;
      return
    }
    this.getChangeMouViewData();
    this.getChangeMouDealerGrading();
  }

  ClickLinkManufacturer(vendorCode: string) {
    this.http.post(URLConstant.GetVendorByVendorCode, { Code: vendorCode }).subscribe(
      (responseLink: VendorObj) => {
        console.log(responseLink);
        AdInsHelper.OpenVendorBranchViewByVendorId(responseLink.VendorId);
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "manufacturer") {
      this.ClickLinkManufacturer(ev.ViewObj.manufacturerCode)
    } else if (ev.Key == "dealer") {
      this.ClickLinkManufacturer(ev.ViewObj.dealerCode)
    }
  }

  getChangeMouDealerGrading() {
    // CR Change Self Custom
    // await this.http.post(URLConstantX.GetChangeMouDealerGradingX, { Id: changeMouTrxId }).toPromise().then(
    //   (response) => {
    //     this.dealerGrading = response['DealerGrading'];
    //     this.dealerRating = response['DealerRating'];
    //   });
    this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
    this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
    this.ReqMouCustDsfObj.ChangeMouCustId = this.ChangeMouTrxId;
    this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, this.ReqMouCustDsfObj).subscribe(
      (response) => {
          
        this.dealerGrading = response.DealerGrading;
        this.dealerRating = response.DealerGradingMultiplier;
        this.IsNewCalculation = response.IsNewCalculation;
      });
    // CR Change Self Custom
  }

  async getChangeMouViewData() {
    var ChangeMouTrxObj = {MouCustId: this.MouCustId, ChangeMouTrxId: this.ChangeMouTrxId};
    this.LinkManufacturer = new VendorObj();
    this.LinkSupplGrading = new VendorObj();

    await this.http.post(URLConstantX.GetMouCustDataByMouCustIdX, ChangeMouTrxObj).toPromise().then(
      (response) => {
        this.mouCust = response['MouCustObj'];
        this.MouCustId = this.mouCust.MouCustId;
        this.CurrCode = this.mouCust.CurrCode;
        this.PlafondAmt = this.mouCust.PlafondAmt;
        this.IsRevolving = this.mouCust.IsRevolving;

        if (this.MouType == 'FACTORING') {
          this.mouCustFctr = response['MouCustFctrObj'];
          this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
          this.SingleInstCalcMthd = this.mouCustFctr.SingleInstCalcMthdDescr;
          this.MrPaidByCode = this.mouCustFctr.PaidByDescr;
          this.PayFreqCode = this.mouCustFctr.PayFreqCode;

          this.WopCode = this.mouCustFctr.WopCode;
          this.TopDays = this.mouCustFctr.TopDays;
          this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
          this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
          this.IsDisclosed = this.mouCustFctr.IsDisclosed;
          this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
          this.Notes = this.mouCustFctr.Notes;
          this.RevolvingType = this.mouCustFctr.RevolvingType;

          this.http.post(URLConstant.GetVendorByVendorCode, {Code: this.mouCustFctr.VendorCode}).subscribe(
            (responseLink) => {
              this.LinkSupplier = responseLink['VendorName']
            });
        } else if (this.MouType == 'FINANCING') {
          this.mouCustDlrFncng = response['MouCustDlrFncngObj'];
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
        }
      })

    await this.http.post(URLConstant.GetVendorByVendorCode, {Code: this.LinkManufacturer.VendorCode}).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkManufacturer = vendor;
      });
    await this.http.post(URLConstant.GetVendorByVendorCode, {Code: this.LinkSupplGrading.VendorCode}).toPromise().then(
      (vendor: VendorObj) => {
        this.LinkSupplGrading = vendor;
      });

    await this.http.post(URLConstant.GetCustByCustNo, {CustNo: this.Manufacturer}).toPromise().then(
      (response: any) => {
        this.Manufacturer = response['CustName'];
      });

    await this.http.post(URLConstant.GetCustByCustNo, {CustNo: this.Customer}).toPromise().then(
      (response: any) => {
        this.Customer = response['CustName'];
      });

  }

  // openView(custNo) {
  //   this.ReqByIdObj.CustNo = custNo;
  //   this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
  //     response => {
  //       if(response["MrCustTypeCode"] == 'PERSONAL'){
  //         AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
  //       }
  //       else if(response["MrCustTypeCode"] == 'COMPANY'){
  //         AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
  //       }
  //     }
  //   );
  // }

  // getListedMouCustFctr(ReqByIdObj){
  //   this.http.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, ReqByIdObj).subscribe(
  //     (response) => {
  //       this.listedCustFctr = response[CommonConstant.ReturnObj];
  //       this.listedCustFctrIsReady = true;
  //   });
  // }

}
