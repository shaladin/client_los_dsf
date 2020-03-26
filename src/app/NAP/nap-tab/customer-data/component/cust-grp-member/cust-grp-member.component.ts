import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, NgForm, FormGroup, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppCustPersonalFinDataObj } from 'app/shared/model/AppCustPersonalFinDataObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';

@Component({
  selector: 'app-cust-grp-member',
  templateUrl: './cust-grp-member.component.html',
  styleUrls: ['./cust-grp-member.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})

export class CustGrpMemberComponent implements OnInit {

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
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {

     }

  ngOnInit() {
    console.log(this.identifier);
    console.log(this.parentForm);

    this.parentForm.removeControl(this.identifier);
    this.parentForm.addControl(this.identifier, this.fb.array([]));
    this.CustRelationshipObjs.splice(0, 1);

    this.bindCustRelationshipPersonalObj();
    this.bindCustRelationshipCompanyObj();
    this.bindAppGrp();
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
    // this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
    this.dictLookup[max + 1] = InputLookupCustomerObj;

    this.CustRelationshipObjs.push({list: []});
    
  }

  deleteCustGrp(i){
    var custCustGrpObjs = this.parentForm.controls[this.identifier] as FormArray;
    var no = custCustGrpObjs.controls[i]["controls"]["No"].value;
    custCustGrpObjs.removeAt(i);
    this.CustRelationshipObjs.splice(i, 1);
    this.parentForm.removeControl("lookupCustomerForGrp" + no);
  }

  initLookup(){
    var InputLookupCustomerObj = new InputLookupObj();
    InputLookupCustomerObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    InputLookupCustomerObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    InputLookupCustomerObj.urlEnviPaging = environment.FoundationR3Url;
    InputLookupCustomerObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    InputLookupCustomerObj.genericJson = "./assets/uclookup/lookupCustomer.json";

    return InputLookupCustomerObj;
  }

  CopyCustomer(event, i){
    this.parentForm.controls[this.identifier]["controls"][i].patchValue({
      CustNo: event.CustNo,
      CustName: event.CustName
    });

    if(event.MrCustTypeCode == AdInsConstant.CustTypePersonal){
      this.CustRelationshipObjs[i].list = this.CustRelationshipPersonalObj;
      this.parentForm.controls[this.identifier]["controls"][i].patchValue({
        MrCustRelationshipCode: this.defaultCustRelationshipPersonalCode
      });
    }

    if(event.MrCustTypeCode == AdInsConstant.CustTypeCompany){
      this.CustRelationshipObjs[i].list = this.CustRelationshipCompanyObj;
      this.parentForm.controls[this.identifier]["controls"][i].patchValue({
        MrCustRelationshipCode: this.defaultCustRelationshipCompanyCode
      });
    }

    console.log(this.CustRelationshipObjs);
  }

  bindAppGrp(){
    if(this.appCustGrpObjs != undefined){
      for(let i = 0; i < this.appCustGrpObjs.length; i++){
        var listCustGrp = this.parentForm.controls[this.identifier] as FormArray;
        listCustGrp.push(this.addGroup(this.appCustGrpObjs[i], i));

        var InputLookupCustomerObj = this.initLookup();
        this.dictLookup[i] = InputLookupCustomerObj;
        this.InputLookupCustomerObjs.push(InputLookupCustomerObj);
        this.setCustNameAndCustRelationship(i, this.appCustGrpObjs[i].CustNo);
      }
    }
  }

  addGroup(appCustGrpObj, i){
    if(appCustGrpObj == undefined){
      return this.fb.group({
        No: [i],
        CustNo: ['', [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: ['', [Validators.maxLength(4000)]],
      })
    }else{
      return this.fb.group({
        No: [i],
        CustNo: [appCustGrpObj.CustNo, [Validators.required, Validators.maxLength(50)]],
        CustName: [''],
        MrCustRelationshipCode: [appCustGrpObj.MrCustRelationshipCode, [Validators.required, Validators.maxLength(50)]],
        CustGrpNotes: [appCustGrpObj.CustGrpNotes, [Validators.maxLength(4000)]],
      })
    } 
  }

  setCustNameAndCustRelationship(i, custNo){
    this.custObj.CustNo = custNo;
    this.http.post(AdInsConstant.GetCustByCustNo, this.custObj).subscribe(
      (response) => {
        console.log(response);
        this.custMasterObj = response;
        this.dictLookup[i].nameSelect = response["CustName"];
        this.dictLookup[i].jsonSelect = response;
        this.InputLookupCustomerObjs[i].jsonSelect = response;
        
        if(response["MrCustTypeCode"] == AdInsConstant.CustTypePersonal){
          this.CustRelationshipObjs.push({list : this.CustRelationshipPersonalObj});
        }

        if(response["MrCustTypeCode"] == AdInsConstant.CustTypeCompany){
          this.CustRelationshipObjs.push({list : this.CustRelationshipCompanyObj});
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
  

  bindCustRelationshipPersonalObj(){
    this.refMasterObj.RefMasterTypeCode = "CUST_PERSONAL_RELATIONSHIP";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CustRelationshipPersonalObj = response["ReturnObject"];
        if(this.CustRelationshipPersonalObj.length > 0){
            this.defaultCustRelationshipPersonalCode = this.CustRelationshipPersonalObj[0].Key
        }
      }
    );
  }

  bindCustRelationshipCompanyObj(){
    this.refMasterObj.RefMasterTypeCode = "CUST_COMPANY_RELATIONSHIP";
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).subscribe(
      (response) => {
        this.CustRelationshipCompanyObj = response["ReturnObject"];
        if(this.CustRelationshipCompanyObj.length > 0){
            this.defaultCustRelationshipCompanyCode = this.CustRelationshipCompanyObj[0].Key
        }
      }
    );
  }

}
