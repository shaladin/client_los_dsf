import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { MouCustGrpObj } from 'app/shared/model/mou-cust-grp-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';

@Component({
  selector: 'app-mou-cust-grp-mbr',
  templateUrl: './mou-cust-grp-mbr.component.html',
  styleUrls: ['./mou-cust-grp-mbr.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class MouCustGrpMbrComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: string;
  @Input() MouCustGrpObjs: Array<MouCustGrpObj>;

  dictLookup: {[key: string]: InputLookupObj;} = {};

  CustRelationshipObjs: [{ list: Array<KeyValueObj> }] = [{ list: [] }];

  CustRelationshipPersonalObj: Array<KeyValueObj>;
  CustRelationshipCompanyObj: Array<KeyValueObj>;
  defaultCustRelationshipPersonalCode: string;
  defaultCustRelationshipCompanyCode: string;

  InputLookupCustomerObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  lookupCustomerIdentifiers: Array<string> = new Array<string>();

  CustNoObj: GenericObj = new GenericObj();

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient) {

     }

  async ngOnInit() : Promise<void> {
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.CustRelationshipObjs.splice(0, 1);

    await this.bindCustRelationshipPersonalObj();
    await this.bindCustRelationshipCompanyObj();
    await this.bindMouGrp();
  }

  addCustGrp(){
    var custSocmedObjs = this.parentForm.controls[this.identifier] as FormArray;
    var length = this.parentForm.value[this.identifier].length;
    var max = 0;
    if(length > 0){
      max = this.parentForm.value[this.identifier][length-1].No;
    }
    custSocmedObjs.push(this.addGroup(undefined, max + 1));

    var InputLookupCustomerObj = this.initLookup();
    this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
    this.dictLookup[max + 1] = InputLookupCustomerObj;

    this.CustRelationshipObjs.push({list: []});
  }

  deleteCustGrp(i){
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var custCustGrpObjs = this.parentForm.controls[this.identifier] as FormArray;
      var no = custCustGrpObjs.controls[i]["controls"]["No"].value;
      this.parentForm.removeControl("lookupCustomerForGrp" + no);
      custCustGrpObjs.removeAt(i);
      this.CustRelationshipObjs.splice(i, 1);
    }
  }

  initLookup(){
    var InputLookupCustomerObj = new InputLookupObj();
    InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustGrp.json";
    InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustGrp.json";
    InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustGrp.json";

    return InputLookupCustomerObj;
  }

  CopyCustomer(event, i){
    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });

    // jika ada pihak yg tipenya company maka pake relasi company
    if(this.identifier == 'custGrpMemberCompany' || this.identifier == CommonConstant.CustTypeCompany || event.MrCustTypeCode == CommonConstant.CustTypeCompany){
      this.CustRelationshipObjs[i].list = this.CustRelationshipCompanyObj;
      this.parentForm.controls[this.identifier]["controls"][i].patchValue({
        MrCustRelationshipCode: this.defaultCustRelationshipCompanyCode
      });
    } else {
      this.CustRelationshipObjs[i].list = this.CustRelationshipPersonalObj;
      this.parentForm.controls[this.identifier]["controls"][i].patchValue({
        MrCustRelationshipCode: this.defaultCustRelationshipPersonalCode
      });
    }
  }

  async bindMouGrp(){
    if(this.MouCustGrpObjs != undefined){
      for(let i = 0; i < this.MouCustGrpObjs.length; i++){
        var listCustGrp = this.parentForm.controls[this.identifier] as FormArray;
        listCustGrp.push(this.addGroup(this.MouCustGrpObjs[i], i));

        var InputLookupCustomerObj = this.initLookup();
        this.dictLookup[i] = InputLookupCustomerObj;
        this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
        await this.setCustNameAndCustRelationship(i, this.MouCustGrpObjs[i].CustNo);
      }
    }
  }

  copyAppGrp(){
    var custCustGrpObjs = this.parentForm.controls[this.identifier] as FormArray;
    for(let i = 0; i < custCustGrpObjs.controls.length; i++){
      var no = custCustGrpObjs.controls[i]["controls"]["No"].value;
      this.parentForm.removeControl("lookupCustomerForGrp" + no);
    }
    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.bindMouGrp();
  }

  addGroup(MouCustGrpObj : MouCustGrpObj, i){
    if(MouCustGrpObj == undefined){
      return this.fb.group({
        No: [i],
        CustNo: ['', [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: ['', [Validators.maxLength(4000)]],
        //IsReversible: [false]
      })
    }else{
      return this.fb.group({
        No: [i],
        CustNo: [MouCustGrpObj.CustNo, [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: [MouCustGrpObj.MrCustRelationshipCode, [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: [MouCustGrpObj.CustGrpNotes, [Validators.maxLength(4000)]],
        //IsReversible: [MouCustGrpObj.IsReversible == null ? false : MouCustGrpObj.IsReversible],
      })
    } 
  }

  async setCustNameAndCustRelationship(i, custNo){
    this.CustNoObj.CustNo = custNo;
    await this.http.post(URLConstant.GetCustByCustNo, this.CustNoObj).toPromise().then(
      (response) => {
        this.dictLookup[i].nameSelect = response["CustName"];
        this.dictLookup[i].jsonSelect = response;
        this.InputLookupCustomerObjs[i].jsonSelect = response;
        if(this.identifier == 'custGrpMemberCompany' || this.identifier == CommonConstant.CustTypeCompany || response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
          this.CustRelationshipObjs.push({list : this.CustRelationshipCompanyObj});
        }
        else{
          this.CustRelationshipObjs.push({list : this.CustRelationshipPersonalObj});
        }

        this.parentForm.controls[this.identifier]["controls"][i].patchValue({
          CustNo: custNo,
          CustName: response["CustName"]
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

  async bindCustRelationshipPersonalObj(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipPersonalObj = response[CommonConstant.ReturnObj];
        if(this.CustRelationshipPersonalObj.length > 0){
            this.defaultCustRelationshipPersonalCode = this.CustRelationshipPersonalObj[0].Key
        }
      }
    );
  }

  async bindCustRelationshipCompanyObj(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustCompanyRelationship }).toPromise().then(
      (response) => {
        this.CustRelationshipCompanyObj = response[CommonConstant.ReturnObj];
        if(this.CustRelationshipCompanyObj.length > 0){
            this.defaultCustRelationshipCompanyCode = this.CustRelationshipCompanyObj[0].Key
        }
      }
    );
  }

}