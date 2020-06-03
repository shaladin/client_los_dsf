import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { AppInsMainCvgObj } from 'app/shared/model/AppInsMainCvgObj.Model';
import { ResultInsRateRuleObj } from 'app/shared/model/ResultInsRateRuleObj.Model';
import { ResultCalcInsObj } from 'app/shared/model/ResultCalcInsObj.Model';
import { InsuranceDataObj } from 'app/shared/model/InsuranceDataObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/InsuranceDataInsRateRuleObj.Model';
import { CalcInsAddCvgObj } from 'app/shared/model/CalcInsAddCvgObj.Model';
import { RequestCalcInsObj } from 'app/shared/model/RequestCalcInsObj.Model';
import { CalcInsMainCvgObj } from 'app/shared/model/CalcInsMainCvgObj.Model';
import { AppInsAddCvgObj } from 'app/shared/model/AppInsAddCvgObj.Model';

@Component({
  selector: 'app-insurance-multi-asset-data',
  templateUrl: './insurance-multi-asset-data.component.html'
})
export class InsuranceMultiAssetDataComponent implements OnInit {
  @Input() appId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @ViewChild('InsuranceContent') modalIns;
  @ViewChild('AssetContent') modalAsset;
  
  PageState: string = 'Paging';
  listAppAssetObj: any;
  appCollateralObj: any;
  listAppCollateralObj: any;
  gridAssetDataObj: any;
  gridAppCollateralObj: any;

  appAssetId: number;
  totalAssetPriceAmt: number;
  AppCollateralId: number;
  CapAmt: number;
  TotalPremiumToCust: number;

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
    private modalService: NgbModal,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute){
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
      })
  }

  ngOnInit() {
    this.gridAssetDataObj = new InputGridObj();
    this.gridAssetDataObj.pagingJson = "./assets/ucgridview/gridAssetDataView.json";

    this.appAssetObj = new AppAssetObj();
    this.appAssetObj.AppId = this.appId;
    this.http.post(AdInsConstant.GetAppAssetListForInsuranceByAppId, this.appAssetObj).subscribe(
      (response) => {
          this.listAppAssetObj = response["ReturnObject"];

          var DetailForGridAsset ={
            Data: response["ReturnObject"],
            Count: "0"
          }

        this.gridAssetDataObj.resultData = DetailForGridAsset;
      },
      (error) => {
        console.log(error);
      }
    );

    this.gridAppCollateralObj = new InputGridObj();
    this.gridAppCollateralObj.pagingJson = "./assets/ucgridview/gridAppCollateralInsurance.json";
    
    this.appCollateralObj = new AppCollateralObj();
    this.appCollateralObj.AppId = this.appId;
    this.http.post(AdInsConstant.GetViewAppCollateralObjByAppId, this.appCollateralObj).subscribe(
      (response) => {
        console.log(response);
          this.listAppCollateralObj = response["AppCollateralObjs"];

          var DetailForGridCollateral ={
            Data: response["AppCollateralObjs"],
            Count: "0"
          }

        this.gridAppCollateralObj.resultData = DetailForGridCollateral;
        this.CapAmt = DetailForGridCollateral["Data"][0].CollateralValueAmt;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  event2(e){
    // this.appIdForAssetModal = e.RowObj.AppId;
    // this.appAssetIdForAssetModal = e.RowObj.AppAssetId;
    this.PageState = 'EditAsset';
    // this.openModal(this.modalAsset);
  }

  terimaValue(e){
    // this.modalService.dismissAll();
    this.PageState = 'Paging';
  }

  event(ev){
    this.AppCollateralId = ev.RowObj.AppCollateralId;
    this.PageState = 'EditInsurance';
    // this.open(this.modalIns);
  }

  // openModal(content){
  //   this.modalService.open(content).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // open(content) {
  //   this.BindAllData();
  //   this.modalService.open(content).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  
  // SubmitForm()
  // {
  //   this.outputTab.emit();
  // }

  SubmitForm2(){
    // console.log(this.InsuranceDataForm)
    // this.saveObj


    this.http.post(AdInsConstant.AddEditInsuranceDataMultiAsset, this.saveObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.outputTab.emit();
      },
      (error) => {
        console.log(error);
      }
    );
    
  }

  SaveForm(){
    console.log(this.InsuranceDataForm)
    this.http.post(AdInsConstant.AddEditInsuranceDataMultiAsset, this.saveObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
