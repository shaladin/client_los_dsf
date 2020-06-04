import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { ResultInsRateRuleObj } from 'app/shared/model/ResultInsRateRuleObj.Model';
import { ResultCalcInsObj } from 'app/shared/model/ResultCalcInsObj.Model';
import { InsuranceDataObj } from 'app/shared/model/InsuranceDataObj.Model';

@Component({
  selector: 'app-insurance-multi-asset-data',
  templateUrl: './insurance-multi-asset-data.component.html'
})
export class InsuranceMultiAssetDataComponent implements OnInit {
  @Input() appId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  
  PageState: string = 'Paging';
  listAppAssetObj: any;
  appCollateralObj: any;
  listAppCollateralObj: any;
  gridAssetDataObj: any;
  gridAppCollateralObj: any;

  appAssetId: number;
  totalAssetPriceAmt: number;
  AppCollateralId: number;
  CapAmt: number = 0;
  TotalPremiumToCust: number = 0;

  appObj: NapAppModel;
  appAssetObj : any;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: any;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  appInsMainCvgObj: Array<AppInsMainCvgObj>;
  ruleObj: ResultInsRateRuleObj;
  calcInsObj: ResultCalcInsObj;
  saveObj: InsuranceDataObj;

  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetPaidBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetCoverPeriod: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InscoBranchName: [''],
    CustInscoBranchName: ['', [Validators.required, Validators.maxLength(100)]],
    InsPolicyNo: ['', Validators.maxLength(50)],
    InsPolicyName: ['', Validators.maxLength(100)],
    CustCoverStartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
    Notes: ['', Validators.maxLength(4000)],
    CustNotes: ['', Validators.maxLength(4000)],
    InsMainCvgType: [''],
    InsAddCvgTypes: new FormArray([]),
    InsLength: ['', [Validators.required, Validators.min(0),Validators.max(99)]],
    InsAssetRegion: ['', [Validators.required, Validators.maxLength(50)]],
    AppInsMainCvgs: new FormArray([]),
    TotalCustMainPremiAmt: [0],
    TotalCustAddPremiAmt: [0],
    TotalInscoMainPremiAmt: [0],
    TotalInscoAddPremiAmt: [0],
    InscoAdminFeeAmt: [0],
    CustAdminFeeAmt: [0],
    CvgAmt: [0, Validators.required],
    CustCvgAmt: [0, Validators.required],
    TotalCustDiscAmt: [0],
    InsCpltzAmt: [0],
    AppId: [0],
    AppAssetId: [0]
  });

  AppInsForm = this.fb.group({
    PaidAmtByCust: [0]
  });
  
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute){
      this.route.queryParams.subscribe(params => { this.appId = params["AppId"];
      })
  }

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetDataView.json";

    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateralInsurance.json";

    this.appAssetObj = new AppAssetObj();
    this.appAssetObj.AppId = this.appId;
    this.http.post(AdInsConstant.GetAppAssetListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
          this.listAppAssetObj = response["ReturnObject"];
          this.listAppCollateralObj = response["ReturnObject"];

          var DetailForGridAsset = {
            Data: response["ReturnObject"],
            Count: "0"
          }

          var DetailForGridCollateral ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
        this.gridAppCollateralObj.resultData = DetailForGridCollateral;

        for (var i = 0; i < this.listAppAssetObj.length; i++)
        {
          // this.TotalPremiumToCust = this.TotalPremiumToCust + DetailForGridCollateral[i].MainPremi + DetailForGridCollateral[i].AddPremi - DetailForGridCollateral[i].TotalCustDiscAmt;
          this.TotalPremiumToCust = this.TotalPremiumToCust + this.listAppAssetObj[i].MainPremi + this.listAppAssetObj[i].AddPremi;
        }
        this.CapAmt = this.TotalPremiumToCust;
      
        this.AppInsForm.patchValue({
          PaidAmtByCust: 0
        })
      },
      (error) => {
        console.log(error);
      }
    );
  }

  PaidAmtChanged(ev)
  {
    this.CapAmt = this.TotalPremiumToCust - Number(ev.replace(/,/g,''));
    if (this.CapAmt < 0) this.toastr.errorMessage('Paid Amount by Cust cannot be greater than Total Premium to Customer!!!');
  }

  event2(e){
    this.PageState = 'EditAsset';
  }

  getValue(e){
    this.PageState = 'Paging';
  }

  event(ev){
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    this.PageState = 'EditInsurance';
  }

  SubmitForm(){
    if (this.CapAmt < 0) this.toastr.errorMessage('Paid Amount by Cust cannot be greater than Total Premium to Customer!!!');
    else this.outputTab.emit();
  }
}
