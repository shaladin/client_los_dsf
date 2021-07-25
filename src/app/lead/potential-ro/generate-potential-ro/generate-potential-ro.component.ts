import { Component, OnInit } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: 'app-generate-potential-ro',
  templateUrl: './generate-potential-ro.component.html',
  providers: [NGXToastrService]
})
export class GeneratePotentialRoComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private toastr: NGXToastrService
  ) { }

  IsHasData: boolean = false;
  ListSpName: Array<{GenerateRoPotentialSpMappingId:number, SpName:string, Descr:string}>;
  IsGridResultSpReady: boolean = false;
  GridResultSp: InputGridObj = new InputGridObj();
  PotentialRoFilterForm = this.fb.group({
    AgrmntDtStart: [null],
    AgrmntDtEnd: [null],
    MaturityDtStart: [null],
    MaturityDtEnd: [null],
    GenerateRoPotentialSpMappingId: ['', [Validators.required]],
  });

  
  listSpResult: Array<{CustNo:string, CustName:string, AgrmntId:number, AgrmntNo:string, AgrmntDt:Date, MaturityDt: Date}>;
  reqGeneratePotentialRo: {AgrmntDtStart:Date, AgrmntDtEnd:Date, MaturityDtStart:Date, MaturityDtEnd:Date, GenerateRoPotentialSpMappingId:number};

  
  async ngOnInit() {
    this.GridResultSp.pagingJson = "./assets/ucgridview/gridListGenerateRoPotentialResult.json";
    await this.getListSpName();
    
  }

  async getListSpName()
  {
    await this.http.post(URLConstant.GetListGenerateRoPotentialSpMapping, {}).toPromise().then(
      (response) => {
        this.ListSpName = response['ListGenerateRoPotentialSpMappingObjs'];
      });
  }

  assignFilterReq()
  {
    this.reqGeneratePotentialRo = {
      AgrmntDtStart: this.PotentialRoFilterForm.controls['AgrmntDtStart'].value,
      AgrmntDtEnd: this.PotentialRoFilterForm.controls['AgrmntDtEnd'].value,
      MaturityDtStart: this.PotentialRoFilterForm.controls['MaturityDtStart'].value,
      MaturityDtEnd: this.PotentialRoFilterForm.controls['MaturityDtEnd'].value,
      GenerateRoPotentialSpMappingId: this.PotentialRoFilterForm.controls['GenerateRoPotentialSpMappingId'].value,
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
    this.http.post(URLConstant.GetRoPotentialDataFromSp, this.reqGeneratePotentialRo).subscribe(
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
    this.http.post(URLConstant.GenerateRoPotentialDataFromSp, this.reqGeneratePotentialRo).subscribe(
      (response) => {
        this.toastr.successMessage('Generate success with Batch No : '+response["BatchNo"]);
      });

  }

}