import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-mou-view-detail',
  templateUrl: './mou-view-detail.component.html',
  providers: [NGXToastrService]
})
export class MouViewDetailComponent implements OnInit {
  @Input() MouCustId: any;
  @Input() MouType: any;

  MouCustClauseId: any;
  CurrCode: any;
  AssetTypeCode: any;
  MrFirstInstTypeCode: any;
  MrInterestTypeCode: any;
  MrInstSchmCode: any;
  PayFreqCode: any;
  DownPaymentFromPrcnt: any;
  DownPaymentToPrcnt: any;
  TenorFrom: any;
  TenorTo: any;

  WopCode: any;
  PlafondAmt: any;
  IsRevolving: any;
  TopDays: any;
  InterestRatePrcnt: any;
  RetentionPrcnt: any;
  IsDisclosed: any;
  IsListedCust: any;
  MrRecourseTypeCode: any;
  Notes: any;

  mouCustClause: any;
  listAssetData: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustDataByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.mouCustClause = response["ReturnObject"];
        this.MouCustId = this.mouCustClause.MouCustId;
        this.MouCustClauseId = this.mouCustClause.MouCustClauseId;
        this.CurrCode = this.mouCustClause.CurrCode;
        this.AssetTypeCode = this.mouCustClause.AssetTypeCode;
        this.MrFirstInstTypeCode = this.mouCustClause.MrFirstInstTypeCode;
        this.MrInterestTypeCode = this.mouCustClause.MrInterestTypeCode;
        this.MrInstSchmCode = this.mouCustClause.MrInstSchmCode;
        this.PayFreqCode = this.mouCustClause.PayFreqCode;
        this.DownPaymentFromPrcnt = this.mouCustClause.DownPaymentFromPrcnt;
        this.DownPaymentToPrcnt = this.mouCustClause.DownPaymentToPrcnt;
        this.TenorFrom = this.mouCustClause.TenorFrom;
        this.TenorTo = this.mouCustClause.TenorTo;

        this.WopCode = this.mouCustClause.WopCode;
        this.PlafondAmt = this.mouCustClause.PlafondAmt;
        this.IsRevolving = this.mouCustClause.IsRevolving;
        this.TopDays = this.mouCustClause.TopDays;
        this.InterestRatePrcnt = this.mouCustClause.InterestRatePrcnt;
        this.RetentionPrcnt = this.mouCustClause.RetentionPrcnt;
        this.IsListedCust = this.mouCustClause.IsListedCust;
        this.IsDisclosed = this.mouCustClause.IsDisclosed;
        this.MrRecourseTypeCode = this.mouCustClause.MrRecourseTypeCode;
        this.Notes - this.mouCustClause.Notes;
      })
    this.http.post(AdInsConstant.GetMouCustAssetByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listAssetData = response['ReturnObject'];
      })
  }

  MouDataForm = this.fb.group({
  })

  AssetDataForm = this.fb.group({
  })

}
