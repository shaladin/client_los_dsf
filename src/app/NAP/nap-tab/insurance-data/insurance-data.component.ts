import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { AppAssetAccessoryObj } from 'app/shared/model/AppAssetAccessoryObj.model';

@Component({
  selector: 'app-insurance-data',
  templateUrl: './insurance-data.component.html',
  styleUrls: ['./insurance-data.component.scss']
})

export class InsuranceDataComponent implements OnInit {

  appId: number;
  appObj: any;
  appAssetObj: AppAssetObj;
  appAssetAccessoryObjs: Array<AppAssetAccessoryObj>;
  appFinDataObj: any;
  appIns: any;
  appInsObj: any;

  cvgAmt: number;

  insuredByObj: any;
  inscoBranchObj: any;

  InsuranceDataForm = this.fb.group({
    InsAssetCoveredBy: ['', [Validators.required, Validators.maxLength(50)]],
    InscoBranchCode: ['', [Validators.required, Validators.maxLength(100)]],
    InsPolicyNo: ['', Validators.maxLength(50)],
    InsPolicyName: ['', Validators.maxLength(100)],
    StartDt: ['', Validators.required],
    EndDt: ['', Validators.required],
    Notes: ['', Validators.maxLength(4000)]
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
    await this.bindInscoBranchObj();
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
      this.InsuranceDataForm.controls.StartDt.clearValidators();
      this.InsuranceDataForm.controls.StartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.clearValidators();
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.clearValidators();
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
    }

    if(insuredBy == AdInsConstant.InsuredByCustomer){
      this.InsuranceDataForm.controls.InscoBranchCode.setValidators([Validators.required, Validators.maxLength(100)]);
      this.InsuranceDataForm.controls.InscoBranchCode.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyNo.setValidators(Validators.maxLength(50));
      this.InsuranceDataForm.controls.InsPolicyNo.updateValueAndValidity();
      this.InsuranceDataForm.controls.InsPolicyName.setValidators(Validators.maxLength(100));
      this.InsuranceDataForm.controls.InsPolicyName.updateValueAndValidity();
      this.InsuranceDataForm.controls.StartDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.StartDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.EndDt.setValidators(Validators.required);
      this.InsuranceDataForm.controls.EndDt.updateValueAndValidity();
      this.InsuranceDataForm.controls.Notes.setValidators(Validators.maxLength(4000));
      this.InsuranceDataForm.controls.Notes.updateValueAndValidity();
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

        if(this.appInsObj == undefined && this.appFinDataObj != undefined){
          this.cvgAmt = this.appFinDataObj.TotalAssetPriceAmt;
        }
      },
      (error) => {
        console.log(error);
      }
    );
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

  async bindInscoBranchObj(){
    console.log("bind insco branch");
    var inscoBranchObj = { MrVendorCategory: AdInsConstant.VendorCategoryAssetInscoBranch, OfficeCode: this.appObj.OriOfficeCode};
    await this.http.post(AdInsConstant.GetListKeyValueByCategoryCodeAndOfficeCode, inscoBranchObj).toPromise().then(
      (response) => {
        this.inscoBranchObj = response["ReturnObject"];
        if(this.inscoBranchObj.length > 0){
          this.InsuranceDataForm.patchValue({
            InscoBranchCode: this.inscoBranchObj[0].Key
          });
        }
      }
    );
  }

  test(){
    console.log(this.InsuranceDataForm);
  }

}
