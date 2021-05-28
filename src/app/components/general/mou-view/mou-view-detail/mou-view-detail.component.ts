import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustDlrFinObj } from 'app/shared/model/moucustdlrfin.Model';

@Component({
  selector: 'app-mou-view-detail',
  templateUrl: './mou-view-detail.component.html'
})
export class MouViewDetailComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouType: string;

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
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  LinkSupplier:any = "-";
  MouCustDlrFindData: MouCustDlrFinObj = new MouCustDlrFinObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId}
    this.http.post(URLConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
      (response) => {

        this.mouCust = response["MouCustObj"];
        this.MouCustId = response["MouCustObj"].MouCustId;
        this.CurrCode = response["MouCustObj"].CurrCode;
        this.PlafondAmt = response["MouCustObj"].PlafondAmt;
        this.IsRevolving = response["MouCustObj"].IsRevolving;
        this.MouType = response["MouCustObj"].MrMouTypeCode;

        if (this.MouType == CommonConstant.GENERAL)
        {
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
        }
        else if (this.MouType == CommonConstant.FACTORING)
        {
          this.mouCustFctr = response["MouCustFctrObj"];
          this.AssetTypeCode = this.mouCustFctr.AssetTypeCode;
          this.MrFirstInstTypeCode = this.mouCustFctr.MrFirstInstTypeCode;
          this.MrInstTypeCode = this.mouCustFctr.InstTypeDescr;
          this.MrInstSchmCode = this.mouCustFctr.MrInstSchmCode;
          this.SingleInstCalcMthd = this.mouCustFctr.SingleInstCalcMthdDescr;
          this.MrPaidByCode =  this.mouCustFctr.PaidByDescr;
          this.PayFreqCode = this.mouCustFctr.PayFreqCode;
          this.DownPaymentFromPrcnt = this.mouCustFctr.DownPaymentFromPrcnt;
          this.DownPaymentToPrcnt = this.mouCustFctr.DownPaymentToPrcnt;
          this.TenorFrom = this.mouCustFctr.TenorFrom;
          this.TenorTo = this.mouCustFctr.TenorTo;
          this.WopCode = this.mouCustFctr.WopCode;
          this.TopDays = this.mouCustFctr.TopDays;
          this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
          this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
          this.IsListedCust = this.mouCustFctr.IsListedCust;
          this.IsDisclosed = this.mouCustFctr.IsDisclosed;
          this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
          this.Notes = this.mouCustFctr.Notes;

          var objVendor={
            VendorCode:this.mouCustFctr.VendorCode
          }
          this.http.post(URLConstant.GetVendorByVendorCode, objVendor).subscribe(
            (responseLink)=>{
              this.LinkSupplier = responseLink["VendorName"]
            });
        }
        else if (this.MouType == CommonConstant.FINANCING)
        {
        this.http.post(URLConstant.GetMouCustDlrFin, mouCustObj).subscribe(
          (responses) => {
            console.log(responses)
            this.MouCustDlrFindData.WopCode = responses["WopCode"];
            this.MouCustDlrFindData.TopDays = responses["TopDays"];
            this.MouCustDlrFindData.TopInterestRatePrcnt = responses["TopInterestRatePrcnt"];
            this.MouCustDlrFindData.PayFreqCode = responses["PayFreqCode"];
            this.MouCustDlrFindData.InterestRatePrcnt = responses["InterestRatePrcnt"];
            this.MouCustDlrFindData.MaximumMonthsForExtend = responses["MaximumMonthsForExtend"];
            this.MouCustDlrFindData.MaximumTimesForExtends = responses["MaximumTimesForExtends"];
            this.MouCustDlrFindData.ExtendRatePrcnt = responses["ExtendRatePrcnt"];
            this.MouCustDlrFindData.SpareDayToPay = responses["SpareDayToPay"];
            this.MouCustDlrFindData.AssetCondition = responses["AssetCondition"];
            this.MouCustDlrFindData.LcRate = responses["LcRate"];
            this.MouCustDlrFindData.PrincipalPaidInExtendPrcntg = responses["PrincipalPaidInExtendPrcntg"];
            this.MouCustDlrFindData.ManufacturerCode = responses["ManufacturerCode"];
            this.MouCustDlrFindData.ManufacturerCustNo = responses["ManufacturerCustNo"];
            this.MouCustDlrFindData.DealerCode = responses["DealerCode"];
            this.MouCustDlrFindData.DealerCustNo = responses["DealerCustNo"];
            this.MouCustDlrFindData.Notes = responses["Notes"];
            this.MouCustDlrFindData.MaximumExtendTimes = responses["MaximumExtendTimes"];
          })
        }
      })
      
      
    this.http.post(URLConstant.GetMouCustAssetByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listAssetData = response[CommonConstant.ReturnObj];
      });
  }
}
