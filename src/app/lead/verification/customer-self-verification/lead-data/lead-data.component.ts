import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { WizardComponent } from 'angular-archwizard';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-lead-data',
  templateUrl: './lead-data.component.html',
  styleUrls: ['./lead-data.component.scss'],
  providers: [NGXToastrService]
})
export class LeadDataComponent implements OnInit {
  @Input() LeadId: any;
  @Input() LobCode: string;

  InputLookupAssetObj: InputLookupObj;
  AssetConditionObj: any;
  FirstInstTypeObj: any;
  DpTypeObj: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private http: HttpClient, private toastr: NGXToastrService, private wizard: WizardComponent) { }

  ngOnInit() {
    console.log(this.LeadId);
    console.log(this.LobCode);
    this.bindUcLookup();
    this.bindDropDown();
  }

  LeadDataForm = this.fb.group({
    AssetCondition: [''],
    ManufYear: [''],
    AssetPrice: [''],
    DpType: [''],
    DpAmt: [''],
    Tenor: [''],
    FirstInstType: [''],
    InstAmt: ['']
  })

  bindUcLookup() {
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAssetType.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAssetType.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAssetType.json";
    this.InputLookupAssetObj.isReadonly = true;
  }

  getLookupAssetResponse(e)
  {
    this.LeadDataForm.patchValue({
      FullAssetName: e.FullAssetName
    });
  }

  bindDropDown()
  {
    this.bindDpTypeObj();
    this.bindAssetConditionObj();
    this.bindFirstInstTypeObj();
  }

  bindDpTypeObj(){
    var refMasterObj = { RefMasterTypeCode: 'DOWN_PAYMENT_TYPE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.DpTypeObj = response["ReturnObject"];
        if(this.DpTypeObj.length > 0){
          this.LeadDataForm.patchValue({
            DpType: this.DpTypeObj[0].Key
          })
        }
      }
    );
  }

  bindAssetConditionObj(){
    var refMasterObj = { RefMasterTypeCode: 'ASSET_CONDITION' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.AssetConditionObj = response["ReturnObject"];
        if(this.AssetConditionObj.length > 0){
          this.LeadDataForm.patchValue({
            AssetCondition: this.AssetConditionObj[0].Key
          })
        }
      }
    );
  }

  bindFirstInstTypeObj(){
    var refMasterObj = { RefMasterTypeCode: 'FIRSTINSTTYPE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.FirstInstTypeObj = response["ReturnObject"];
        if(this.FirstInstTypeObj.length > 0){
          this.LeadDataForm.patchValue({
            FirstInstType: this.FirstInstTypeObj[0].Key
          })
        }
      }
    );
  }
}
