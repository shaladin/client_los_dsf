import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";

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

  mouCust: any;
  mouCustClause: any;
  mouCustFctr: any;
  listAssetData: Array<any>;
  MrPaidByCode: string;
  SingleInstCalcMthd: string;
  isReady: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId };
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
    }
    

    this.http
      .post(URLConstant.GetMouCustAssetByMouCustId, mouCustObj)
      .subscribe((response) => {
        this.listAssetData = response[CommonConstant.ReturnObj];
      });
  }

  MouDataForm = this.fb.group({});

  AssetDataForm = this.fb.group({});
}
