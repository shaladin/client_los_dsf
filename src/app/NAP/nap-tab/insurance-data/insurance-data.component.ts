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
  saveObj: InsuranceDataObj;

  cvgAmt: number = 0;

  insuredByObj: any;
  inscoBranchObj: any;
  paidByObj: any;
  insMainCvgTypeObj: any;
  insAddCvgTypeObj: any;
  insAssetCoverPeriodObj: any;

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
    InsLength: ['', [Validators.min(0),Validators.max(99)]]
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

      this.InsuranceDataForm.controls.InsAssetPaidBy.clearValidators();
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsMainCvgType.clearValidators();
      this.InsuranceDataForm.controls.InsMainCvgType.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.clearValidators();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.clearValidators();
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
    }

    if(insuredBy == AdInsConstant.InsuredByCompany){
      this.InsuranceDataForm.controls.InsAssetPaidBy.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetPaidBy.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsMainCvgType.setValidators(Validators.required);
      this.InsuranceDataForm.controls.InsMainCvgType.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.setValidators([Validators.required, Validators.maxLength(50)]);
      this.InsuranceDataForm.controls.InsAssetCoverPeriod.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsLength.setValidators([Validators.min(0),Validators.max(99)]);
      this.InsuranceDataForm.controls.InsLength.updateValueAndValidity();
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
        }
      }
    );
  }

  async bindInscoBranchObj(){
    var inscoBranchObj = { MrVendorCategory: AdInsConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode};
    await this.http.post(AdInsConstant.GetListKeyValueByCategoryCodeAndOfficeCode, inscoBranchObj).toPromise().then(
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
