import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { UcgridfooterComponent } from "@adins/ucgridfooter";
import { UCSearchComponent } from "@adins/ucsearch";
import { UclookupgenericComponent } from "@adins/uclookupgeneric";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { formatDate } from "@angular/common";
import { RegexService } from 'app/shared/services/regex.services';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { ChangeMouCustCollateralStatXObj } from 'app/impl/shared/model/ChangeMouCustCollateralStatXObjModel';
import { RefAttrGenerate } from "app/components/sharing-components/ref-attr/ref-attr-form-generate/RefAttrGenerate.service";
import { UcTempPagingObj } from "app/shared/model/temp-paging/uc-temp-paging-obj.model";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";
import { ChangeMouCustCollateralObj } from "app/shared/model/change-mou-cust-collateral-obj.model";
import { ChangeMouCustCollateralRegistrationObj } from "app/shared/model/change-mou-cust-collateral-registration-obj.model";
import { InputLookupObj } from "app/shared/model/input-lookup-obj.model";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { AddrObj } from "app/shared/model/addr-obj.model";
import { InputFieldObj } from "app/shared/model/input-field-obj.model";
import { MouCustAddrObj } from "app/shared/model/mou-cust-addr-obj.model";
import { AssetTypeSerialNoLabelObj } from "app/shared/model/serial-no/asset-type-serial-no-label-obj.model";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { CustomPatternObj } from "app/shared/model/custom-pattern-obj.model";
import { ListMouCustCollateralDocObj } from "app/shared/model/list-mou-cust-collateral-doc-obj.model";
import { MouCustCollateralDocObj } from "app/shared/model/mou-cust-collateral-doc-obj.model";
import { InputAddressObj } from "app/shared/model/input-address-obj.model";
import { environment } from "environments/environment";
import { GenericListObj } from "app/shared/model/generic/generic-list-obj.model";
import { RefAttrGenerateObj } from "app/shared/model/ref-attr-generate.model";
import { ResMouCustCollateralAttrObj, MouCustCollateralAttrObj } from "app/shared/model/mou-cust-collateral-attr-obj.model";
import { ChangeMouCustObj } from "app/shared/model/change-mou/change-mou-obj.model";
import { ResMouCollForMouViewObjX } from "app/impl/shared/model/Response/MOU/ResMouCollForMouViewObjX.model";
import { URLConstantDsf } from "app/shared/constant/URLConstantDsf";
import { RequestMouCustDsfObj } from "app/shared/model/req-mou-cust-dsf-obj.model";
import { ReqMouCustDsfObj } from "app/shared/model/mou-cust-dsf-obj.model";

@Component({
  selector: 'app-change-mou-addcoll-x-dsf',
  templateUrl: './change-mou-addcoll-x-dsf.component.html',
  styleUrls: ['./change-mou-addcoll-x-dsf.component.css']
})
export class ChangeMouAddcollXDsfComponent implements OnInit {

  @Input() MouCustId: number;
  @Input() ChangeMouTrxId: number;

  //CR Change Self Custom
  AddCollDataForm = this.fb.group({
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

  mouType: string;
  dealerGrading: string;
  dealerRating: number;
  IsNewCalculation: boolean = false;
  isAddNetworthMode: boolean = true;
  IsDealerEquityManual: boolean = false;
  IsNetworthManual: boolean = false;
  IsCeilingCollateralManual: boolean = false;
  IsCeilingNetworthManual: boolean = false;
  Networth: number;
  ReqMouCustDsfObj: RequestMouCustDsfObj = new RequestMouCustDsfObj();
  //CR Change Self Custom

  listCollateralData: Array<ResMouCollForMouViewObjX> = new Array();

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }


  ngOnInit() {
    const mouCustObj = { Id: this.ChangeMouTrxId }

    this.http.post(URLConstantX.GetChangeMouCustCollateralXForChangeMouViewByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response[CommonConstant.ReturnObj];
      })

    // CR Change Self Custom
    this.ReqMouCustDsfObj = new RequestMouCustDsfObj();
    this.ReqMouCustDsfObj.MouCustId = this.MouCustId;
    this.ReqMouCustDsfObj.ChangeMouCustId = this.ChangeMouTrxId;
    this.http.post<ReqMouCustDsfObj>(URLConstantDsf.GetMouCustXDsf, this.ReqMouCustDsfObj).subscribe(
      (response) => {
        
        this.dealerGrading = response.DealerGrading;
        this.dealerRating = response.DealerGradingMultiplier;
        this.IsNewCalculation = response.IsNewCalculation;

        if (response.TotalCollateralActive > 0)
        {
          this.isAddNetworthMode = false;

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
            CeilingCollateral: response.TotalCollateralActive * response.DealerGradingMultiplier / 100,
            IsCeilingCollateralManual: response.IsCeilingCollateralManual,
            CeilingNetworth: (response.DealerEquity * response.AdjEquity / 100) * response.Networth / 100,
            IsCeilingNetworthManual: response.IsCeilingNetworthManual
          });

          this.IsNetworthManual = response.IsNetworthManual;
          this.IsCeilingCollateralManual = response.IsCeilingCollateralManual;
          this.IsCeilingNetworthManual = response.IsCeilingNetworthManual;
          this.IsDealerEquityManual = response.IsDealerEquityManual;
        }

        else
        {
          this.AddCollDataForm.patchValue({
            TotalCollateralActive: response.TotalCollateralActive,
            DealerEquity: response.DealerEquity,
            DealerGrading: response.DealerGrading,
            DealerGradingMultiplier: response.DealerGradingMultiplier,
            Networth: response.Networth,
            CeilingCollateral: response.CeilingCollateral,
            CeilingNetworth: response.CeilingNetworth,
          });
        }
      }
    )
    // CR Change Self Custom
  }

  ChangeMouCustCollateralId: number = 0;
  isView: boolean = false;
  ViewColl(ChangeMouCustCollateralId: number) {
    this.isView = false;
    setTimeout(() => {
      this.ChangeMouCustCollateralId = ChangeMouCustCollateralId;
      this.isView = true;
    }, 500);
  }

  Back() {
    this.isView = false;
  }

}
