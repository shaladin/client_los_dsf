import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustDlrFinObj } from 'app/shared/model/moucustdlrfin.Model';
import { ResMouCustObj } from 'app/shared/model/Response/MOU/MouCust/ResMouCustObj.model';
import { ResMouCustClauseObj } from 'app/shared/model/Response/MOU/MouCust/ResMouCustClauseObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { ResGetMouCustDlrFindByIdObj } from 'app/shared/model/Response/MOU/MouCust/ResGetMouCustDlrFindByIdObj.model';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';

@Component({
  selector: 'app-mou-view-detail',
  templateUrl: './mou-view-detail.component.html'
})
export class MouViewDetailComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() MouType: string;

  ReqByIdObj: GenericObj = new GenericObj();
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

  WopName: string;
  PlafondAmt: number;
  IsRevolving: boolean;
  TopDays: number;
  InterestRatePrcnt: number;
  RetentionPrcnt: number;
  IsDisclosed: boolean;
  IsListedCust: boolean;
  MrRecourseTypeCode: string;
  Notes: string;

  mouCust: ResMouCustObj;
  mouCustClause: ResMouCustClauseObj;
  mouCustFctr: any;
  listedCustFctrIsReady: boolean = false;
  listedCustFctr: Array<any>;
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  LinkSupplier:any = "-";
  MouCustDlrFindData: ResGetMouCustDlrFindByIdObj = new ResGetMouCustDlrFindByIdObj();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.ReqByIdObj.Id = this.MouCustId ;
    this.GetListActiveRefPayFreq();
    this.GetListKvpActiveRefCurr();
    if(this.MouType == 'FACTORING'){
    this.getListedMouCustFctr(this.ReqByIdObj);
    }

    this.http.post(URLConstant.GetMouCustDataByMouCustId, this.ReqByIdObj).subscribe(
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
          this.WopName = this.mouCustFctr.WopName;
          this.TopDays = this.mouCustFctr.TopDays;
          this.InterestRatePrcnt = this.mouCustFctr.InterestRatePrcnt;
          this.RetentionPrcnt = this.mouCustFctr.RetentionPrcnt;
          this.IsListedCust = this.mouCustFctr.IsListedCust;
          this.IsDisclosed = this.mouCustFctr.IsDisclosed;
          this.MrRecourseTypeCode = this.mouCustFctr.MrRecourseTypeCode;
          this.Notes = this.mouCustFctr.Notes;

          var objVendor={
            Code:this.mouCustFctr.VendorCode
          }
          this.http.post(URLConstant.GetVendorByVendorCode, objVendor).subscribe(
            (responseLink)=>{
              this.LinkSupplier = responseLink["VendorName"]
            });
        }
        else if (this.MouType == CommonConstant.FINANCING)
        {
        this.http.post(URLConstant.GetMouCustDlrWithCustVendorNameFindById, this.ReqByIdObj).subscribe(
          (responses) => {
            this.MouCustDlrFindData.WopName = responses["WopName"];
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
            this.MouCustDlrFindData.DealerName = responses["DealerName"];
            this.MouCustDlrFindData.DealerCustName = responses["DealerCustName"];
            this.MouCustDlrFindData.ManufacturerName = responses["ManufacturerName"];
            this.MouCustDlrFindData.ManufacturerCustName = responses["ManufacturerCustName"];
          })
        }
      })
      
      
    this.http.post(URLConstant.GetMouCustAssetByMouCustId, this.ReqByIdObj).subscribe(
      (response) => {
        this.listAssetData = response[CommonConstant.ReturnObj];
      });
  }

  dictRefPayFreq: { [id: string]: string } = {};
  GetListActiveRefPayFreq() {
    this.http.post(URLConstant.GetListActiveRefPayFreq, null).subscribe(
      (response: GenericListObj) => {
        for (let index = 0; index < response.ReturnObject.length; index++) {
          const element = response.ReturnObject[index];
          this.dictRefPayFreq[element.PayFreqCode] = element.Descr;
        }
      }
    );
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
  
  getListedMouCustFctr(ReqByIdObj){
    this.http.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, ReqByIdObj).subscribe(
      (response) => {
        this.listedCustFctr = response[CommonConstant.ReturnObj];
        this.listedCustFctrIsReady = true;
    });
  }

  openView(custNo) {
    this.ReqByIdObj.CustNo = custNo;
    this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
      response => {
        if(response["MrCustTypeCode"] == 'PERSONAL'){
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        }
        else if(response["MrCustTypeCode"] == 'COMPANY'){
          AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
        }
      }
    );
  }
}
