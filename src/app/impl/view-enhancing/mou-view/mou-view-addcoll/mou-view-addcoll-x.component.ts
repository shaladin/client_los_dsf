import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { formatDate } from '@angular/common';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { MouCustCollateralStatXObj } from 'app/impl/shared/model/MouCustCollateralStatXObj.Model';
import { MouCustCollateralDocObj } from 'app/shared/model/mou-cust-collateral-doc-obj.model';
import { MouCustCollateralObj } from 'app/shared/model/mou-cust-collateral-obj.model';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { RequestMouCustDsfObj } from 'app/shared/model/req-mou-cust-dsf-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-addcoll-x',
  templateUrl: './mou-view-addcoll-x.component.html',
  providers: [NGXToastrService]
})
export class MouViewAddcollXComponent implements OnInit {
  @Input() MouCustId: number;

  listCollateralData: Array<any> = new Array();
  isView: boolean = false;
  listMouCustCollateralDocObj: Array<any>;
  mouCustCollateralDoc: MouCustCollateralDocObj = new MouCustCollateralDocObj();
  MouCustCollateralId: number;
  OwnerRelationshipObj: any;
  collateralObj: MouCustCollateralObj;
  collateralRegistrationObj: any;
  CollateralStatObj: MouCustCollateralStatXObj;
  ReqMouCustDsfObj: ReqMouCustDsfObj = new ReqMouCustDsfObj();
  RequestMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();

  //CR Change Self Custom
  AddCollDataForm = this.fb.group({
    // CR Change Self Custom
    TotalCollateralActive: [0, Validators.required],
    DealerEquity: [0],
    IsDealerEquityManual: [false],
    AdjEquity: [100.000000, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(100)]],
    NetDealerEquity: [0],
    NotesNewCalculation: [''],
    DealerGrading: [''],
    DealerGradingMultiplier: [''],
    Networth: [0],
    IsNetworthManual: [false],
    CeilingCollateral: [0],
    IsCeilingCollateralManual: [false],
    CeilingNetworth: [0],
    IsCeilingNetworthManual: [false]
    // CR Change Self Custom
  })

  mouType: string;
  dealerGrading: string;
  dealerRating: number;
  //CR Change Self Custom

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
    
    // CR Change Self Custom
    this.RequestMouCustDsfObj = new RequestMouCustDsfObj();
    this.RequestMouCustDsfObj.MouCustId = this.MouCustId;
    this.RequestMouCustDsfObj.ChangeMouCustId = 0;
    this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, this.RequestMouCustDsfObj).subscribe(
      (response) => {
          this.AddCollDataForm.patchValue({
            TotalCollateralActive: response.TotalCollateralActive,
            DealerEquity: response.DealerEquity,
            IsDealerEquityManual: response.IsDealerEquityManual,
            AdjEquity: response.AdjEquity,
            NetDealerEquity: response.NetDealerEquity,
            NotesNewCalculation: response.Notes,
            DealerGrading: response.DealerGrading,
            DealerGradingMultiplier: response.DealerGradingMultiplier,
            Networth: response.Networth,
            IsNetworthManual: response.IsNetworthManual,
            CeilingCollateral: response.CeilingCollateral,
            IsCeilingCollateralManual: response.IsCeilingCollateralManual,
            CeilingNetworth: response.CeilingNetworth,
            IsCeilingNetworthManual: response.IsCeilingNetworthManual
          });

          this.dealerGrading = response.DealerGrading;
          this.dealerRating = response.DealerGradingMultiplier;
        }
    )
    // CR Change Self Custom
  }

  ViewColl(MouCustCollateralId) {
    this.listMouCustCollateralDocObj = new Array<any>();
    this.MouCustCollateralId = MouCustCollateralId;
    const collObj = { Id: MouCustCollateralId };
    console.log(MouCustCollateralId);
    this.http.post(URLConstant.GetListMouCustCollateralDocsByMouCustCollateralId, { Id: MouCustCollateralId }).subscribe(
      (response) => {
        var MouCustCollateralDocs = new Array();
        MouCustCollateralDocs = response["MouCustCollateralDocs"];
        this.isView = true;
        console.log(MouCustCollateralDocs);
        if (MouCustCollateralDocs["length"] > 0) {

          for (var i = 0; i < MouCustCollateralDocs.length; i++) {
            if (MouCustCollateralId == MouCustCollateralDocs[i].MouCustCollateralId) {

              var MouCustCollateralDocObj = {
                DocCode: MouCustCollateralDocs[i].DocCode,
                DocNo: MouCustCollateralDocs[i].DocNo,
                ExpiredDt: formatDate(MouCustCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                DocNotes: MouCustCollateralDocs[i].DocNotes,
                IsReceived: MouCustCollateralDocs[i].IsReceived
              }
              this.listMouCustCollateralDocObj.push(MouCustCollateralDocObj);
            }
          }
        }

      });


    this.http.post(URLConstantX.GetMouCustCollateralDataForUpdateByMouCustCollateralIdX, collObj).subscribe(
      (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

        console.log(this.collateralObj);
        console.log(this.collateralRegistrationObj);
      })
    this.http.post<MouCustCollateralStatXObj>(URLConstantX.GetMouCustCollateralStatXByMouCustCollateralIdX, collObj).subscribe(
      (response) => {
        this.CollateralStatObj = response
        console.log(this.CollateralStatObj);
      })
  }

  Back() {
    this.isView = false;
  }
}
