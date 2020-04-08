import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgForm,FormBuilder } from '@angular/forms';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { SalesInfoObj } from 'app/shared/model/SalesInfoObj.Model';


@Component({
  selector: 'app-application-model-add',
  templateUrl: './application-model-add.component.html',
  styleUrls: ['./application-model-add.component.scss']
})
export class ApplicationModelAddComponent implements OnInit {


  SalesAppInfoForm = this.fb.group({
    SrvyOrderNo: [''],
    MRSalesRecommendCode: [''],
    SalesNotes: [''],
    SalesOfficerNo: [''],
    SalesHeadNo: [''],
    MRInstTypeCode: [''],
    MRSingleInstCalcMthdCode: [''],
    TOPDays: [''],
    Tenor: [''],
    NumOfInst: [''],
    MRInstSchemeCode: [''],
    IsDisclosed: false,
    PaidBy: [''],
    RecourseType: [''],
    MRAppSourceCode: [''],
    MRWOPCode: ['']
  })
  //refMasterObj: RefMasterObj;
  refMasterInterestType: RefMasterObj;
  refMasterInsScheme: RefMasterObj;
  refMasterInsType: RefMasterObj;
  refMasterRecommendation: any;
  refMasterWOP: RefMasterObj;
  refMasterAppSource: RefMasterObj;
  refMasterCalcMethod: RefMasterObj;
  refMasterAppPaidBy: RefMasterObj;
  refMasterRecourseType: RefMasterObj;
  allInterestType: any;
  allInScheme: any;
  allInType: any;
  allSlsRecom: any;
  allWOP: any;
  allAppSource: any;
  allPaidby: any;
  allRecourseType: any;
  allCalcMethod: any;
  salesAppInfoObj: SalesInfoObj;
  constructor(private router: Router, private route: ActivatedRoute, private httpClient: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { }

  ngOnInit() {
    this.refMasterInterestType = new RefMasterObj();
    this.refMasterInterestType.refMasterTypeCode = 'INTEREST_TYPE';
    this.refMasterInsScheme = new RefMasterObj();
    this.refMasterInsScheme.refMasterTypeCode = 'INST_SCHM';
    this.refMasterInsType = new RefMasterObj();
    this.refMasterInsType.refMasterTypeCode = 'INST_TYPE';
    this.refMasterRecommendation = new RefMasterObj();
    this.refMasterRecommendation.refMasterTypeCode = 'SLS_RECOM';
    this.refMasterWOP = new RefMasterObj();
    this.refMasterWOP.refMasterTypeCode = 'WOP';
    this.refMasterAppSource = new RefMasterObj();
    this.refMasterAppSource.refMasterTypeCode = 'APP_SOURCE';
    this.refMasterCalcMethod.refMasterTypeCode = 'CALC_METHOD';
    this.refMasterAppPaidBy = new RefMasterObj();
    this.refMasterAppPaidBy.refMasterTypeCode = 'APP_PAID_BY';
    this.refMasterRecourseType = new RefMasterObj();
    this.refMasterRecourseType.refMasterTypeCode = 'RECOURSE_TYPE';




    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterInsScheme).subscribe(
      (response) => {
        console.log(response);
        this.allInScheme = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRInstSchemeCode: this.allInScheme[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterInsType).subscribe(
      (response) => {
        console.log(response);
        this.allInType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRInstTypeCode: this.allInType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterRecommendation).subscribe(
      (response) => {
        console.log(response);
        this.allSlsRecom = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRSalesRecommendCode: this.allSlsRecom[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterWOP).subscribe(
      (response) => {
        console.log(response);
        this.allWOP = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRWOPCode: this.allWOP[0].Key
        });
      },
      (error) => {
        console.log(error);
      });
    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterAppSource).subscribe(
      (response) => {
        console.log(response);
        this.allAppSource = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRAppSourceCode: this.allAppSource[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterCalcMethod).subscribe(
      (response) => {
        console.log(response);
        this.allCalcMethod = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          MRSingleInstCalcMthdCode: this.allCalcMethod[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterAppPaidBy).subscribe(
      (response) => {
        console.log(response);
        this.allPaidby = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          PaidBy: this.allPaidby[0].Key
        });
      },
      (error) => {
        console.log(error);
      });

    this.httpClient.post(AdInsConstant.GetRefMasterByRefMasterTypeCode, this.refMasterRecourseType).subscribe(
      (response) => {
        console.log(response);
        this.allRecourseType = response['ReturnObject'];
        this.SalesAppInfoForm.patchValue({
          RecourseType: this.allRecourseType[0].Key
        });
      },
      (error) => {
        console.log(error);
      });
  }

  SaveForm():void{
    this.salesAppInfoObj = new SalesInfoObj();
    this.salesAppInfoObj = this.SalesAppInfoForm.value;
    
  }

}
