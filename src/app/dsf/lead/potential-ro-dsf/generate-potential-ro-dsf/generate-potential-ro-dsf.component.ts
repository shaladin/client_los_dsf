import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';

@Component({
  selector: 'app-generate-potential-ro-dsf',
  templateUrl: './generate-potential-ro-dsf.component.html',
  providers: [NGXToastrService]
})
export class GeneratePotentialRoDsfComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) { }

  IsHasData: boolean = false;
  // Self Custom Changes
  ListCampaignName: Array<{GenerateRoPotentialCampaignId:number, SpName:string, Descr:string}>;
  // End Self Custom Changes
  IsGridResultSpReady: boolean = false;
  GridResultSp: InputGridObj = new InputGridObj();
  PotentialRoFilterForm = this.fb.group({
    AgrmntDtStart: [null],
    AgrmntDtEnd: [null],
    MaturityDtStart: [null],
    MaturityDtEnd: [null],
    // Self Custom Changes
    GenerateRoPotentialCampaignId: ['', [Validators.required]],
    // End Self Custom Changes
  });

  
  listSpResult: Array<{CustNo:string, CustName:string, AgrmntId:number, AgrmntNo:string, AgrmntDt:Date, MaturityDt: Date}>;
  // Self Custom Changes
  reqGeneratePotentialRo: {AgrmntDtStart:Date, AgrmntDtEnd:Date, MaturityDtStart:Date, MaturityDtEnd:Date, GenerateRoPotentialCampaign:string};
  // End Self Custom Changes

  
  async ngOnInit() {
    this.GridResultSp.pagingJson = "./assets/ucgridview/gridListGenerateRoPotentialResult.json";
    await this.getListCampaignName();
    
  }

  // Self Custom Changes
  async getListCampaignName()
  {
    await this.http.post(URLConstantDsf.GetListGenerateRoPotentialCampaign, {}).toPromise().then(
      (response) => {
        this.ListCampaignName = response['ListGenerateRoPotentialCampaignObjs'];
      });
  }
  // End Self Custom Changes

  assignFilterReq()
  {
    this.reqGeneratePotentialRo = {
      AgrmntDtStart: this.PotentialRoFilterForm.controls['AgrmntDtStart'].value,
      AgrmntDtEnd: this.PotentialRoFilterForm.controls['AgrmntDtEnd'].value,
      MaturityDtStart: this.PotentialRoFilterForm.controls['MaturityDtStart'].value,
      MaturityDtEnd: this.PotentialRoFilterForm.controls['MaturityDtEnd'].value,
      // Self Custom Changes
      GenerateRoPotentialCampaign: this.PotentialRoFilterForm.controls['GenerateRoPotentialCampaignId'].value,
      // End Self Custom Changes
    }   
  }

  onChangeFilterForm()
  {
    if(this.IsHasData)
    {
      this.IsHasData = false;
      this.GridResultSp.resultData = {Data: []};
      this.IsGridResultSpReady = false;
    }    
  }

  onClickShowData()
  {
    for(let i in this.PotentialRoFilterForm.controls) this.PotentialRoFilterForm.controls[i].markAsTouched();
    if(!this.PotentialRoFilterForm.valid) return;

    this.assignFilterReq();
    // Self Custom Changes
    this.http.post(URLConstantDsf.GetRoPotentialDataFromCampaign, this.reqGeneratePotentialRo).subscribe(
    // End Self Custom Changes
    (response) => {
        this.listSpResult = response['ListGenerateRoPotentialResult'];
        this.GridResultSp.resultData = {Data: this.listSpResult};
        this.IsGridResultSpReady = true;
        if(this.listSpResult.length) this.IsHasData = true;
      });
  }

  onClickGenerate()
  {
    if(!this.IsHasData) return;

    for(let i in this.PotentialRoFilterForm.controls) this.PotentialRoFilterForm.controls[i].markAsTouched();
    if(!this.PotentialRoFilterForm.valid) return;

    this.assignFilterReq();
    // Self Custom Changes
    this.http.post(URLConstantDsf.GenerateRoPotentialDataFromCampaign, this.reqGeneratePotentialRo).subscribe(
    // End Self Custom Changes
    (response) => {
      this.toastr.successMessage('Generate success with Batch No : '+response["BatchNo"]);
    });

  }

}
