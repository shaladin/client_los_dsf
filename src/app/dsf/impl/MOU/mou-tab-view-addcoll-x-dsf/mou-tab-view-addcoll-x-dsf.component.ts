import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ResMouCollForMouViewObj } from 'app/shared/model/response/mou/res-mou-coll-for-mou-view-obj.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ReqMouCustDsfObj } from 'app/shared/model/mou-cust-dsf-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-mou-tab-view-addcoll-x-dsf',
  templateUrl: './mou-tab-view-addcoll-x-dsf.component.html',
  styleUrls: ['./mou-tab-view-addcoll-x-dsf.component.css']
})
export class MouTabViewAddcollXDsfComponent implements OnInit {

  @Input() MouCustId: number;

  listCollateralData: Array<ResMouCollForMouViewObj> = new Array();

  //CR Change Self Custom
  AddCollForm = this.fb.group({
    // CR Change Self Custom
    TotalCollateralActive: [0, Validators.required],
    DealerEquity: [0],
    IsDealerEquityManual: [false],
    AdjEquity: [0],
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
  //CR Change Self Custom

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    var mouCustObj = { Id: this.MouCustId }
    this.http.post(URLConstant.GetMouCustCollateralForMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })
    
      // CR Change Self Custom
      this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, { Id: this.MouCustId }).subscribe(
        (response) => {
            this.AddCollForm.patchValue({
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
          }
      )
      // CR Change Self Custom
  }

  MouCustCollateralId: number = 0;
  isView: boolean = false;
  async ViewColl(MouCustCollateralId: number) {
    this.isView = false;
    setTimeout(() => {      
      this.MouCustCollateralId = MouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }

}
