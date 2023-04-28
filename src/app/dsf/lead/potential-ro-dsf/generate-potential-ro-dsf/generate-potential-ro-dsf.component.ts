import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-generate-potential-ro-dsf',
  templateUrl: './generate-potential-ro-dsf.component.html',
  providers: [NGXToastrService]
})
export class GeneratePotentialRoDsfComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    // Self Custom Changes
    private router: Router
    // End Self Custom Changes
  ) { }

  IsHasData: boolean = false;
  // Self Custom Changes
  ListCampaignName: Array<{Campaign:string}>;
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

  
  listSpResult: Array<{StgPotentialRoId:number, CustNo:string, CustName:string, AgrmntId:number, AgrmntNo:string, AgrmntDt:Date, MaturityDt: Date, Campaign:string}>;
  // Self Custom Changes
  reqListPotentialRo: {AgrmntDtStart:Date, AgrmntDtEnd:Date, MaturityDtStart:Date, MaturityDtEnd:Date, GenerateRoPotentialCampaign:string};
  listStgPotentialRoIdtoGenerate: Array<number> = new Array<number>();
  // End Self Custom Changes

  
  async ngOnInit() {
    this.GridResultSp.pagingJson = "./assets/dsf/ucgridview/gridListGenerateRoPotentialResultDsf.json";
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
    this.reqListPotentialRo = {
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
    this.http.post(URLConstantDsf.GetRoPotentialDataFromCampaign, this.reqListPotentialRo).subscribe(
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
    //if(!this.listStgPotentialRoIdtoGenerate.length) return;
    var reqGeneratePotentialRo = {
      Campaign: this.reqListPotentialRo.GenerateRoPotentialCampaign,
      RoPotentialList: this.listStgPotentialRoIdtoGenerate
    }
    this.http.post(URLConstantDsf.GenerateRoPotentialDataFromCampaign, reqGeneratePotentialRo).subscribe(
    // End Self Custom Changes
    (response) => {
      this.toastr.successMessage('Generate success with Batch No : '+response["BatchNo"]);
      // Self Custom Changes
      AdInsHelper.RedirectUrl(
        this.router,
        [NavigationConstantDsf.POTENTIAL_RO_PAGING],
        {}
      );
      // End Self Custom Changes
  });

  }

  // Self Custom Changes
  getIds(ev) {
    for (let i = 0; i < ev.length; i++) {
      if (ev[i].isActive != true) {
        let index = this.listStgPotentialRoIdtoGenerate.findIndex(f=>f == ev[i].StgPotentialRoId)
        if(index != -1){
          this.listStgPotentialRoIdtoGenerate.splice(index,1);
        }
      }
      else{
        let index = this.listStgPotentialRoIdtoGenerate.findIndex(f=>f == ev[i].StgPotentialRoId)
        if(index == -1){
          this.listStgPotentialRoIdtoGenerate.push(ev[i].StgPotentialRoId);
        }
      }
    }
    // End Self Custom Changes
  }


}
