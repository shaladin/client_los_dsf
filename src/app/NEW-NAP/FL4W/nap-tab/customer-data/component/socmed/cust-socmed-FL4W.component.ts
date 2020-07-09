import { Component, OnInit, Input } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';

@Component({
  selector: 'app-cust-socmed-FL4W',
  templateUrl: './cust-socmed-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustSocmedFL4WComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustSocmedObjs: Array<AppCustSocmedObj>;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  custDataObj: CustDataObj;

  SocmedObj: any;
  defaultSocmedCode: any;
  defaultSocmedName: any;



  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));

    this.bindSocmedTypeObj();
    this.bindAppSocmed();
  }

  addCustSocmed(){
    var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
    custSocmedObjs.push(this.addGroup(undefined));
  }

  deleteSocmed(i){
    if (confirm("Are you sure to delete this record?")) {
    var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
    custSocmedObjs.removeAt(i);
    }
  }

  bindAppSocmed(){
    var listCustSocmed = this.parentForm.controls[this.identifier] as FormArray;
    if(this.appCustSocmedObjs != undefined){
      for(let i = 0; i < this.appCustSocmedObjs.length; i++){
        listCustSocmed.push(this.addGroup(this.appCustSocmedObjs[i]));
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
    this.refMasterObj.RefMasterTypeCode = AdInsConstant.RefMasterTypeCodeSocmedType;
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.SocmedObj = response["ReturnObject"];
        if(this.SocmedObj.length > 0){
            this.defaultSocmedCode = this.SocmedObj[0].Key,
            this.defaultSocmedName = this.SocmedObj[0].Value
        }
      }
    );
  }

}
