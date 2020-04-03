import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { AppInsuranceObj } from 'app/shared/model/AppInsuranceObj.Model';
import { AppInsObjObj } from 'app/shared/model/AppInsObjObj.Model';
import { InsuranceDataObj } from 'app/shared/model/InsuranceDataObj.Model';
import { InsuranceDataInsRateRuleObj } from 'app/shared/model/InsuranceDataInsRateRuleObj.Model';
import { ResultInsRateRuleObj } from 'app/shared/model/ResultInsRateRuleObj.Model';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.scss']
})

export class InsuranceDataComponent implements OnInit {

  appId: number;
  appAssetId: number;

  appObj: NapAppModel;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: any;
  appInsuranceObj: AppInsuranceObj;
  appInsObjObj: AppInsObjObj;
  ruleObj: ResultInsRateRuleObj;
  saveObj: InsuranceDataObj;

  cvgAmt: number = 0;
  custAdminFeeAmt: number = 0;
  isRequiredCvgAmt: boolean = true;
  minInsLength: number = 1;
  maxInsLength: number = 9999;

  insuredByObj: any;
  inscoBranchObj: any;
  paidByObj: any;
  insMainCvgTypeObj: any;
  insAddCvgTypeObj: any;
  insAssetCoverPeriodObj: any;
  insAssetRegionObj: any;

  isGenerate: boolean = false;

  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetPaidBy: ['', [Validators.required, Validators.maxLength(50)]],
    InsAssetCoverPeriod: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InscoBranchName: [''],
    InsPolicyNo: ['', Validators.maxLength(50)],
    InsPolicyName: ['', Validators.maxLength(100)],
    CustCoverStartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
    Notes: ['', Validators.maxLength(4000)],
    InsMainCvgType: ['', Validators.required],
    InsAddCvgTypes: new FormArray([]),
    InsLength: ['', [Validators.required, Validators.min(0),Validators.max(99)]],
    InsAssetRegion: ['', [Validators.required, Validators.maxLength(50)]],
    AppInsMainCvgs: new FormArray([])
  });

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute){
      this.route.queryParams.subscribe(params => {
        this.appId = params["AppId"];
      })
  }
  async ngOnInit() : Promise<void>{
    await this.getInsuranceData();
    await this.bindInsuredByObj();
    await this.bindPaidByObj();
    await this.bindInsMainCvgTypeObj();
    await this.bindInsAddCvgTypeObj();
    await this.bindInsAssetCoverPeriodObj();
    await this.bindInsAssetRegionObj();
    await this.bindInscoBranchObj();
    this.bindAppInsAndAppInsObj(this.appInsObjObj.InsAssetCoveredBy);
    
  }

  SaveForm(){
    var insuredBy = this.InsuranceDataForm.controls.InsAssetCoveredBy.value; 
    this.setSaveObj(insuredBy);
    
    this.http.post(AdInsConstant.AddEditInsuranceData, this.saveObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  setSaveObj(insuredBy){
    if(insuredBy == AdInsConstant.InsuredByOffSystem){
      this.saveObj = new InsuranceDataObj();
      this.saveObj.AppId = this.appId;
      this.saveObj.AppInsuranceObj.AppId = this.appId;
      this.saveObj.AppInsObjObj.AppId = this.appId;
      this.saveObj.AppInsObjObj.AppAssetId = this.appAssetId;
      this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
      this.saveObj.AppInsObjObj.InsAssetPaidBy = AdInsConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.InsSeqNo = 1;

      if(this.appInsuranceObj != undefined){
        this.saveObj.AppInsuranceObj.RowVersion = this.appInsuranceObj.RowVersion;
      }

      if(this.appInsObjObj != undefined){
        this.saveObj.AppInsObjObj.RowVersion = this.appInsObjObj.RowVersion;
      }
    }

    if(insuredBy == AdInsConstant.InsuredByCustomer){
      this.saveObj = new InsuranceDataObj();
      this.saveObj.AppId = this.appId;
      this.saveObj.AppInsuranceObj.AppId = this.appId;
      this.saveObj.AppInsObjObj.AppId = this.appId;
      this.saveObj.AppInsObjObj.AppAssetId = this.appAssetId;
      this.saveObj.AppInsObjObj.InsAssetCoveredBy = insuredBy;
      this.saveObj.AppInsObjObj.InsAssetPaidBy = AdInsConstant.InsPaidByCustomer;
      this.saveObj.AppInsObjObj.InsSeqNo = 1;
      this.saveObj.AppInsObjObj.InscoBranchCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
      this.saveObj.AppInsObjObj.InscoBranchName = this.InsuranceDataForm.controls.InscoBranchName.value;
      this.saveObj.AppInsObjObj.InsPolicyNo = this.InsuranceDataForm.controls.InsPolicyNo.value;
      this.saveObj.AppInsObjObj.InsPolicyName = this.InsuranceDataForm.controls.InsPolicyName.value;
      this.saveObj.AppInsObjObj.CvgAmt = this.InsuranceDataForm.controls["CvgAmt"].value.replace(/\D/g, "");
      this.saveObj.AppInsObjObj.CustCoverStartDt = this.InsuranceDataForm.controls.CustCoverStartDt.value;
      this.saveObj.AppInsObjObj.EndDt = this.InsuranceDataForm.controls.EndDt.value;
      this.saveObj.AppInsObjObj.Notes = this.InsuranceDataForm.controls.Notes.value;

      if(this.appInsuranceObj != undefined){
        this.saveObj.AppInsuranceObj.RowVersion = this.appInsuranceObj.RowVersion;
      }

      if(this.appInsObjObj != undefined){
        this.saveObj.AppInsObjObj.RowVersion = this.appInsObjObj.RowVersion;
      }
    }
  }

  async GenerateInsurance(){
    var reqObj = new InsuranceDataInsRateRuleObj();

    reqObj.InscoCode = this.InsuranceDataForm.controls.InscoBranchCode.value;
    reqObj.AssetCategory = this.appAssetObj.AssetCategoryCode;
    reqObj.AssetCondition = this.appAssetObj.MrAssetConditionCode;
    reqObj.AssetPriceAmount = this.appFinDataObj.TotalAssetPriceAmt;
    reqObj.ProdOfferingCode = this.appObj.ProdOfferingCode;
    reqObj.ProdOfferingVersion = this.appObj.ProdOfferingVersion;

    await this.http.post(AdInsConstant.ExecuteInsRateRule, reqObj).toPromise().then(
      (response) => {
        this.ruleObj = response["Result"];
        this.custAdminFeeAmt = this.ruleObj.AdminFeeToCust;
        this.GenerateMainAndAddCvgTable();
        this.isGenerate = true;
      }
    );

  }

   GenerateMainAndAddCvgTable(){
    var yearCount = this.InsuranceDataForm.controls.InsLength.value;
    var noOfYear = Math.ceil(this.InsuranceDataForm.controls.InsLength.value / 12);

    (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray) = this.fb.array([]);

    var month: number = 12;

    for(let i = 0; i < noOfYear; i++){
      var obj = {Tenor: 0, SumInsuredPrcnt: 0, CustMainPremiRate: 0};

      if(yearCount - 12 >= 0){
        month = 12;
      }else{
        month = yearCount;
      }

      obj.Tenor = month;
      obj.SumInsuredPrcnt = this.ruleObj.SumInsuredPercentage[i];
      var index = this.ruleObj.MainCoverageType.findIndex(x => x == this.InsuranceDataForm.controls.InsMainCvgType.value);
      obj.CustMainPremiRate = this.ruleObj.SellingRatePercentage[index];
      (this.InsuranceDataForm.controls.AppInsMainCvgs as FormArray).push(this.addGroup(i, obj));
      yearCount -= 12;
    }
    
  }

  addGroup(i, obj){
    var group = this.fb.group({
      YearNo: i + 1,
      Tenor: obj.Tenor,
      SumInsuredPrcnt: obj.SumInsuredPrcnt,
      MrMainCvgTypeCode: this.InsuranceDataForm.controls.InsMainCvgType.value,
      CustMainPremiRate: obj.CustMainPremiRate,
      CustMainPremiAmt: 0,
      AppInsAddCvgs: new FormArray([])
    });

    this.insAddCvgTypeObj.forEach((o, i) => {
      var value = this.InsuranceDataForm.controls.InsAddCvgTypes["controls"].find(x => x.value.Key == o.Value).value.Value
      console.log(value);
      const control = this.fb.group({
        Key: o.Value,
        Value: value
      });
      (group.controls.AppInsAddCvgs as FormArray).push(control);
    });
    return group;
  }

  CoverPeriodChanged(event){
    this.setInsLengthDefaultValue(event.target.value);
  }

  AssetRegionChanged(event){

  }

  setInsLengthDefaultValue(coverPeriod){
    if(coverPeriod == AdInsConstant.CoverPeriodAnnually){
      this.InsuranceDataForm.patchValue({
        InsLength: 12
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodFullTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodPartialTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: 1
      });
    }

    if(coverPeriod == AdInsConstant.CoverPeriodOverTenor){
      this.InsuranceDataForm.patchValue({
        InsLength: this.appObj.Tenor + 1
      });
    }

    this.setInsLengthValidator(coverPeriod);
  }

  setInsLengthValidator(coverPeriod){
    if(coverPeriod == AdInsConstant.CoverPeriodAnnually){
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodFullTenor){
      this.minInsLength = 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.disable();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodPartialTenor){
      this.minInsLength = 1;
      this.maxInsLength = this.appObj.Tenor - 1;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength),Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if(coverPeriod == AdInsConstant.CoverPeriodOverTenor){
      this.minInsLength = this.appObj.Tenor + 1;
      this.maxInsLength = 9999;
      this.InsuranceDataForm.controls.InsLength.enable();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.required, Validators.min(this.minInsLength),Validators.max(this.maxInsLength)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }
  }

  InscoBranchCodeChanged(event){
    this.InsuranceDataForm.patchValue({
      InscoBranchName: this.inscoBranchObj.find(x => x.Key == event.target.value).Value
    });
  }

  InsuredByChanged(event){
    this.setValidator(event.target.value);
  }

  setValidator(insuredBy){
    if(insuredBy == AdInsConstant.InsuredByOffSystem){
      this.InsuranceDataForm.controls.InscoBranchCode.clearValidators();
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.clearValidators();
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.clearValidators();
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetPaidBy.clearValidators();
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsMainCvgType.clearValidators();
      this.InsuranceDataForm.controls.InsMainCvgType.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.isRequiredCvgAmt = false;
    }

    if(insuredBy == AdInsConstant.InsuredByCustomer){
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.CustCoverStartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.CustCoverStartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.isRequiredCvgAmt = true;

      this.InsuranceDataForm.controls.InsAssetPaidBy.clearValidators();
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsMainCvgType.clearValidators();
      this.InsuranceDataForm.controls.InsMainCvgType.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.clearValidators();
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
    }

    if(insuredBy == AdInsConstant.InsuredByCompany){
      this.InsuranceDataForm.controls.InsAssetPaidBy.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsMainCvgType.setValidators(Validators.required);
      this.InsuranceDataForm.controls.InsMainCvgType.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.setInsLengthValidator(this.InsuranceDataForm.controls.InsAssetCoverPeriod.value);
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetRegion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetRegion.updateValueAndValidity();
      this.isRequiredCvgAmt = true;
    }
  }

  async getInsuranceData(){
    var reqObj = {AppId: this.appId}
    await this.http.post(AdInsConstant.GetInsuranceDataByAppId, reqObj).toPromise().then(
      (response) => {
        console.log(response);
        this.appObj = response["AppObj"];
        this.appAssetObj = response["AppAssetObj"];
        this.appAssetAccessoryObjs = response["AppAssetAccessoryObjs"];
        this.appFinDataObj = response["AppFinDataObj"];
        this.appInsuranceObj = response["AppInsuranceObj"];
        this.appInsObjObj = response["AppInsObjObj"];

        if(this.appFinDataObj != undefined){
          this.cvgAmt = this.appFinDataObj.TotalAssetPriceAmt;
        }

        this.appAssetId = this.appAssetObj.AppAssetId;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  bindAppInsAndAppInsObj(insuredBy){
    if(this.appInsuranceObj != undefined && this.appInsObjObj != undefined){
      if(insuredBy == AdInsConstant.InsuredByOffSystem){
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy
        });
      }

      if(insuredBy == AdInsConstant.InsuredByCustomer){
        this.InsuranceDataForm.patchValue({
          InsAssetCoveredBy: insuredBy,
          InscoBranchCode: this.appInsObjObj.InscoBranchCode,
          InscoBranchName: this.appInsObjObj.InscoBranchName,
          InsPolicyNo: this.appInsObjObj.InsPolicyNo,
          InsPolicyName: this.appInsObjObj.InsPolicyName,
          CustCoverStartDt: formatDate(this.appInsObjObj.CustCoverStartDt, 'yyyy-MM-dd', 'en-US'),
          EndDt: formatDate(this.appInsObjObj.EndDt, 'yyyy-MM-dd', 'en-US'),
          Notes: this.appInsObjObj.Notes
        });
        
        this.cvgAmt = this.appInsObjObj.CvgAmt;
      }
      this.setValidator(insuredBy);
    }
  }

  async bindInsuredByObj(){
    var refMasterObj = { RefMasterTypeCode: "INSURED_BY"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insuredByObj = response["ReturnObject"];
        if(this.insuredByObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetCoveredBy: this.insuredByObj[0].Key
          });
        }
      }
    );
  }

  async bindPaidByObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_PAID_BY"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.paidByObj = response["ReturnObject"];
        if(this.paidByObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetPaidBy: this.paidByObj[0].Key
          });
        }
      }
    );
  }

  async bindInsMainCvgTypeObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_MAIN_CVG_TYPE"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insMainCvgTypeObj = response["ReturnObject"];
        if(this.insMainCvgTypeObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsMainCvgType: this.insMainCvgTypeObj[0].Key
          });
        }
      }
    );
  }

  async bindInsAddCvgTypeObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_ADD_CVG_TYPE"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAddCvgTypeObj = response["ReturnObject"];
        this.addCheckbox();
      }
    );
  }

  addCheckbox(){
    this.insAddCvgTypeObj.forEach((o, i) => {
      const control = this.fb.group({
        Key: o.Value,
        Value: false
      });
      (this.InsuranceDataForm.controls.InsAddCvgTypes as FormArray).push(control);
    });
  }

  async bindInsAssetCoverPeriodObj(){
    var refMasterObj = { RefMasterTypeCode: "INS_COVER_PERIOD"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetCoverPeriodObj = response["ReturnObject"];
        if(this.insAssetCoverPeriodObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetCoverPeriod: this.insAssetCoverPeriodObj[0].Key
          });

          this.setInsLengthDefaultValue(this.insAssetCoverPeriodObj[0].Key);
        }
      }
    );
  }

  async bindInsAssetRegionObj(){
    var refMasterObj = { RefMasterTypeCode: "ASSET_INS_REGION"};
    await this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).toPromise().then(
      (response) => {
        this.insAssetRegionObj = response["ReturnObject"];
        if(this.insAssetRegionObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InsAssetRegion: this.insAssetRegionObj[0].Key
          });
        }
      }
    );
  }

  async bindInscoBranchObj(){
    var inscoBranchObj = { MrVendorCategory: AdInsConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode};
    await this.http.post("", inscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response["ReturnObject"];
        if(this.inscoBranchObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key,
            InscoBranchName: this.inscoBranchObj[0].Value
          });
        }
      }
    );
  }

  test(){
    console.log(this.InsuranceDataForm);
  }

}
