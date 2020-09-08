import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-cust-grp-member-FL4W',
  templateUrl: './cust-grp-member-FL4W.component.html',
  styleUrls: [],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustGrpMemberFL4WComponent implements OnInit {

  @Input() enjiForm: NgForm;
  @Input() parentForm: FormGroup;
  @Input() identifier: any;
  @Input() appCustGrpObjs: Array<AppCustGrpObj>;

  refMasterObj = {
    RefMasterTypeCode: "",
  };
  custDataObj: CustDataObj;

  dictLookup: {[key: string]: any;} = {};

  CustRelationshipObjs: [{
    list: []  
  }] = [{list: []}];

  CustRelationshipPersonalObj: any;
  CustRelationshipCompanyObj: any;
  defaultCustRelationshipPersonalCode: any;
  defaultCustRelationshipCompanyCode: any;

  InputLookupCustomerObjs: Array<InputLookupObj> = new Array<InputLookupObj>();
  lookupCustomerIdentifiers: Array<string> = new Array<string>();

  custObj = {
    CustNo: ""
  };

  custMasterObj: any;


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
    await this.bindAppGrp();
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

    if(this.identifier == CommonConstant.CustGrupIndentifierTypePersonal){
      this.CustRelationshipObjs.push({list: []});
    }

    if(this.identifier == CommonConstant.CustGrupIndentifierTypeCompany){
      this.CustRelationshipObjs.push({list: this.CustRelationshipCompanyObj});
      this.parentForm.controls[this.identifier]["controls"][max].patchValue({
        MrCustRelationshipCode: this.defaultCustRelationshipCompanyCode
      });
    }
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
    InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustGrp.json";
    InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustGrp.json";

    InputLookupCustomerObj.ddlEnvironments = [
      {
        name: "C.MR_CUST_TYPE_CODE",
        environment: environment.FoundationR3Url
      },
    ];

    return InputLookupCustomerObj;
  }

  CopyCustomer(event, i){
    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });

    if(this.identifier == CommonConstant.CustGrupIndentifierTypePersonal){
      if(event.MrCustTypeCode == CommonConstant.CustTypePersonal){
        this.CustRelationshipObjs[i].list = this.CustRelationshipPersonalObj;
        this.parentForm.controls[this.identifier]["controls"][i].patchValue({
          MrCustRelationshipCode: this.defaultCustRelationshipPersonalCode
        });
      }
  
      if(event.MrCustTypeCode == CommonConstant.CustTypeCompany){
        this.CustRelationshipObjs[i].list = this.CustRelationshipCompanyObj;
        this.parentForm.controls[this.identifier]["controls"][i].patchValue({
          MrCustRelationshipCode: this.defaultCustRelationshipCompanyCode
        });
      }
    }

  }

  async bindAppGrp(){
    if(this.appCustGrpObjs != undefined){
      for(let i = 0; i < this.appCustGrpObjs.length; i++){
        var listCustGrp = this.parentForm.controls[this.identifier] as FormArray;
        listCustGrp.push(this.addGroup(this.appCustGrpObjs[i], i));

        var InputLookupCustomerObj = this.initLookup();
        this.dictLookup[i] = InputLookupCustomerObj;
        this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
        await this.setCustNameAndCustRelationship(i, this.appCustGrpObjs[i].CustNo);
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
    this.bindAppGrp();
  }

  addGroup(appCustGrpObj, i){
    if(appCustGrpObj == undefined){
      return this.fb.group({
        No: [i],
        CustNo: ['', [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: ['', [Validators.maxLength(4000)]],
        IsReversible: [false]
      })
    }else{
      return this.fb.group({
        No: [i],
        CustNo: [appCustGrpObj.CustNo, [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: [appCustGrpObj.MrCustRelationshipCode, [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: [appCustGrpObj.CustGrpNotes, [Validators.maxLength(4000)]],
        IsReversible: [appCustGrpObj.IsReversible == null ? false : appCustGrpObj.IsReversible],
      })
    } 
  }

  async setCustNameAndCustRelationship(i, custNo){
    this.custObj.CustNo = custNo;
    await this.http.post(URLConstant.GetCustByCustNo, this.custObj).toPromise().then(
      (response) => {
        this.custMasterObj = response;
        this.dictLookup[i].nameSelect = response["CustName"];
        this.dictLookup[i].jsonSelect = response;
        this.InputLookupCustomerObjs[i].jsonSelect = response;
        
        if(response["MrCustTypeCode"] == CommonConstant.CustTypePersonal){
          this.CustRelationshipObjs.push({list : this.CustRelationshipPersonalObj});
        }

        if(response["MrCustTypeCode"] == CommonConstant.CustTypeCompany){
          this.CustRelationshipObjs.push({list : this.CustRelationshipCompanyObj});
        }

        this.parentForm.controls[this.identifier]["controls"][i].patchValue({
          CustNo: custNo,
          CustName: response["CustName"]
        });
      });
  }
  

  async bindCustRelationshipPersonalObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.CustRelationshipPersonalObj = response[CommonConstant.ReturnObj];
        if(this.CustRelationshipPersonalObj.length > 0){
            this.defaultCustRelationshipPersonalCode = this.CustRelationshipPersonalObj[0].Key
        }
      }
    );
  }

  async bindCustRelationshipCompanyObj(){
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustCompanyRelationship;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.CustRelationshipCompanyObj = response[CommonConstant.ReturnObj];
        if(this.CustRelationshipCompanyObj.length > 0){
            this.defaultCustRelationshipCompanyCode = this.CustRelationshipCompanyObj[0].Key
        }
      }
    );
  }

}
