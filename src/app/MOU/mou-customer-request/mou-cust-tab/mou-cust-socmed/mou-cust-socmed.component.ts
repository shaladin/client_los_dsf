import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustSocmedObj } from 'app/shared/model/MouCustSocmedObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';

@Component({
  selector: 'app-mou-cust-socmed',
  templateUrl: './mou-cust-socmed.component.html',
  styleUrls: ['./mou-cust-socmed.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustSocmedComponent implements OnInit {
  
  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() MouCustSocmedObjs: Array<MouCustSocmedObj>;

  custDataObj: CustDataObj;

  SocmedObj: Array<KeyValueObj>;
  defaultSocmedCode: string;
  defaultSocmedName: string;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  ngOnInit() {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));

    this.bindSocmedTypeObj();
    this.bindMouSocmed();
  }

  addCustSocmed(){
    var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
    custSocmedObjs.push(this.addGroup(undefined));
  }

  deleteSocmed(i){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
      custSocmedObjs.removeAt(i);
    }
  }

  bindMouSocmed(){
    var listCustSocmed = this.parentForm.controls[this.identifier] as FormArray;
    if(this.MouCustSocmedObjs != undefined){
      for(let i = 0; i < this.MouCustSocmedObjs.length; i++){
        listCustSocmed.push(this.addGroup(this.MouCustSocmedObjs[i]));
      }
    }
  }

  addGroup(appCustSocmedObj){
    if(appCustSocmedObj == undefined){
      return this.fb.group({
        MrSocmedCode: [this.defaultSocmedCode, [Validators.required, Validators.maxLength(50)]],
        MrSocmedName: [this.defaultSocmedName, [Validators.maxLength(100)]],
        SocmedId: ['', [Validators.required, Validators.maxLength(50)]]
      })
    }else{
      return this.fb.group({
        MrSocmedCode: [appCustSocmedObj.MrSocmedCode, [Validators.required, Validators.maxLength(50)]],
        MrSocmedName: [appCustSocmedObj.MrSocmedName, [Validators.maxLength(100)]],
        SocmedId: [appCustSocmedObj.SocmedId, [Validators.required, Validators.maxLength(50)]]
      })
    } 
  }
  

  setSocmedName(i){
    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      MrSocmedName: this.SocmedObj.find(x => x.Key == this.parentForm.controls["socmed"].value[i].MrSocmedCode).Value
    });
  }

  bindSocmedTypeObj(){
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSocmedType }).subscribe(
      (response) => {
        this.SocmedObj = response[CommonConstant.ReturnObj];
        if(this.SocmedObj.length > 0){
            this.defaultSocmedCode = this.SocmedObj[0].Key,
            this.defaultSocmedName = this.SocmedObj[0].Value
        }
      }
    );
  }

}