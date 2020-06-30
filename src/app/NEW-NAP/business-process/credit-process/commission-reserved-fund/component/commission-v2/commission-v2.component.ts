import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { AppFinDataObj } from 'app/shared/model/AppFinData/AppFinData.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { NapAppReferantorModel } from 'app/shared/model/NapAppReferantor.Model';
import { RuleCommissionObj } from 'app/shared/model/RuleCommission/RuleCommissionObj.Model';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
import { AppCommissionHObj } from 'app/shared/model/AppCommissionHObj.Model';

@Component({
  selector: 'app-commission-v2',
  templateUrl: './commission-v2.component.html',
  styleUrls: ['./commission-v2.component.scss']
})
export class CommissionV2Component implements OnInit {

  @Input() AppId: number = 10550;
  @Input() showCancel: boolean = true;
  @Input() maxAllocAmt: number = 0;
  @Input() totalExpenseAmt: number = 0;
  @Input() totalRsvFundAmt: number = 0;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,) { }


  viewIncomeInfoObj = {
    UppingRate: 0,
    InsuranceIncome: 0,
    LifeInsuranceIncome: 0,
    MaxAllocatedAmount: 0,
    RemainingAllocatedAmount: 0,
    InterestIncome: 0,
    ReservedFundAllocatedAmount: 0,
    ExpenseAmount: 0,
    ListItemRule: []
  };

  identifierSupplier: string = AdInsConstant.CommissionIdentifierSupplier;
  identifierSupplierEmp: string = AdInsConstant.CommissionIdentifierSupplierEmp;
  identifierReferantor: string = AdInsConstant.CommissionIdentifierReferantor;
  FormInputObjSupplier: any = {};
  FormInputObjSupplierEmp: any = {};
  FormInputObjReferantor: any = {};
  CommissionForm = this.fb.group({});

  OnForm1: boolean = false;
  OnForm2: boolean = false;
  OnForm3: boolean = false;
  GetFormAddDynamicObj(content) {
    if (content == AdInsConstant.ContentSupplier) {
      this.FormInputObjSupplier["title"] = AdInsConstant.TitleSupplier;
      this.FormInputObjSupplier["content"] = AdInsConstant.ContentSupplier;
      this.FormInputObjSupplier["labelName"] = AdInsConstant.LabelSupplier;
      this.FormInputObjSupplier["AppId"] = this.AppId;
      this.FormInputObjSupplier["contentObj"] = this.ContentObjSupplier;
      this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
      console.log(this.FormInputObjSupplier);
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmp["title"] = AdInsConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmp["content"] = AdInsConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmp["labelName"] = AdInsConstant.LabelSupplierEmp;
      this.FormInputObjSupplierEmp["AppId"] = this.AppId;
      this.FormInputObjSupplierEmp["contentObj"] = this.ContentObjSupplierEmp;
      this.FormInputObjSupplierEmp["ruleObj"] = this.RuleSupplierEmpData;
      this.FormInputObjSupplierEmp["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmp["isCalculated"] = false;
      this.FormInputObjSupplierEmp["isDataInputed"] = false;
      this.FormInputObjSupplierEmp["dictSuppl"] = this.DictSupplierCode;
      this.OnForm2 = true;
      console.log(this.FormInputObjSupplierEmp);
    } else if (content == AdInsConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = AdInsConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = AdInsConstant.ContentReferantor;
      this.FormInputObjReferantor["labelName"] = AdInsConstant.LabelReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
      console.log(this.FormInputObjReferantor);
    }
  }

  async ngOnInit() {
    // await this.GetAppFeeData();
    // await this.GetIncomeInfoObj();
    await this.GetContentData();
    await this.GetRuleDataForForm();
    console.log(this.CommissionForm);
    await this.GetExistingAppCommData();
    // this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
    // this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
    // this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);
  }

  async GetContentData() {
    var obj;
    obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    // console.log("response list appAsset & appAssetSupplEmp");
    await this.http.post<AppAssetDetailObj>(AdInsConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAppId, obj).toPromise().then(
      (response) => {
        // console.log(response);
        if (response.ListAppAssetObj.length != 0) {
          this.GetDDLContent(response.ListAppAssetObj, AdInsConstant.ContentSupplier);
          this.GetDDLContent(response.ListAppAssetSupplEmpObj, AdInsConstant.ContentSupplierEmp);
        }
        // this.GetContentName(AdInsConstant.ContentSupplierEmp);
      },
      (error) => {
        console.log(error);
      }
    );

    obj = {
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post<NapAppReferantorModel>(AdInsConstant.GetAppReferantorByAppId, obj).toPromise().then(
      (response) => {
        // console.log(response);
        this.GetDDLContent(response, AdInsConstant.ContentReferantor);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  ContentObjSupplier = new Array();
  ContentObjSupplierEmp = new Array();
  ContentObjReferantor = new Array();
  DictSupplierCode: any = {};
  GetDDLContent(ReturnObject, content: string) {
    // console.log(ReturnObject);
    if (content == AdInsConstant.ContentReferantor) {
      if (ReturnObject.AppId == null) return;
      var KVPObj;
      KVPObj = {
        Key: ReturnObject.ReferantorCode,
        Value: ReturnObject.ReferantorName
      };
      this.ContentObjReferantor.push(KVPObj);
      this.FormInputObjReferantor["BankData"] = {
        BankCode: ReturnObject.RefBankCode,
        BankName: "",
        BankAccNo: ReturnObject.BankAccNo,
        BankAccName: ReturnObject.BankAccName,
        BankBranch: ReturnObject.BankBranch,
      };
    } else {
      for (var i = 0; i < ReturnObject.length; i++) {
        var KVPObj;
        if (content == AdInsConstant.ContentSupplier) {
          KVPObj = {
            Key: ReturnObject[i].SupplCode,
            Value: ReturnObject[i].SupplName
          };
          // console.log(this.DictSupplierCode);
          // console.log(this.DictSupplierCode[ReturnObject[i].SupplCode]);
          this.DictSupplierCode[ReturnObject[i].SupplCode] = ReturnObject[i].SupplName;
          this.ContentObjSupplier.push(KVPObj);
        } else if (content == AdInsConstant.ContentSupplierEmp) {
          // console.log(ReturnObject[i]);
          KVPObj = {
            Key: ReturnObject[i].SupplEmpNo,
            Value: ReturnObject[i].SupplEmpName,
            MrSupplEmpPositionCode: ReturnObject[i].MrSupplEmpPositionCode,
            MrSupplEmpPositionCodeDesc: ReturnObject[i].MrSupplEmpPositionCodeDesc,
            SupplCode: ReturnObject[i].SupplCode
          };
          this.ContentObjSupplierEmp.push(KVPObj);
        }
      }
    }
  }

  RuleSupplierData: any = {};
  RuleSupplierEmpData: any = {};
  RuleReferantorData: any = {};
  async GetRuleDataForForm() {
    var obj = { AppId: this.AppId };
    await this.http.post(AdInsConstant.GetAppCommissionRule, obj).toPromise().then(
      (response) => {
        console.log("Cek Rule");
        console.log(response);
        for (var i = 0; i < response["length"]; i++) {
          var temp: RuleCommissionObj = response[i][AdInsConstant.ReturnObj].RuleDataObjects;
          // console.log(temp);
          this.BindRuleData(temp.ResultSupplier, AdInsConstant.ContentSupplier, this.ContentObjSupplier[i].Key);
          this.BindRuleData(temp.ResultSupplierEmp, AdInsConstant.ContentSupplierEmp, this.ContentObjSupplier[i].Key);
        }
        if (response[0][AdInsConstant.ReturnObj].RuleDataObjects.ResultReferantor != null)
          this.BindRuleData(response[0][AdInsConstant.ReturnObj].RuleDataObjects.ResultReferantor, AdInsConstant.ContentReferantor, this.ContentObjReferantor[0].Key);  
        
        console.log(this.RuleSupplierData);
        console.log(this.RuleSupplierEmpData);
        console.log(this.RuleReferantorData);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  BindRuleData(tempObj: any, contentType: string, supplCode: string) {
    // console.log(tempObj);
    // console.log(contentType);
    // console.log(supplCode);
    var listTempObj = new Array();
    if (contentType == AdInsConstant.ContentSupplier) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
      // sort
      listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      this.RuleSupplierData[supplCode] = listTempObj;
    }
    if (contentType == AdInsConstant.ContentSupplierEmp) {
      var DictJobPosition: any = {};
      var tempJobPosition: string = "";
      var listJobPosition = new Array();
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        if (tempJobPosition != tempObj.JobPositionCode[i]) {
          listTempObj = new Array();
          tempJobPosition = tempObj.JobPositionCode[i];
          listJobPosition.push(tempJobPosition);
        }
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
        DictJobPosition[tempObj.JobPositionCode[i]] = listTempObj;
      }

      // sort 
      for(var i=0;i<listJobPosition.length;i++){
        listTempObj= DictJobPosition[listJobPosition[i]];
        console.log(listTempObj);
        listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      }
      this.RuleSupplierEmpData[supplCode] = DictJobPosition;
    }
    if (contentType == AdInsConstant.ContentReferantor) {
      for (var i = 0; i < tempObj.AllocationFrom.length; i++) {
        var temp = {
          AllocationAmount: tempObj.AllocationAmount[i],
          AllocationBehaviour: tempObj.AllocationBehaviour[i],
          AllocationFrom: tempObj.AllocationFrom[i],
          AllocationFromDesc: tempObj.AllocationFromDesc[tempObj.AllocationFrom[i]],
          AllocationFromSeq: tempObj.AllocationFromSeq[tempObj.AllocationFrom[i]],
          MaxAllocationAmount: tempObj.MaxAllocationAmount[i]
        };
        listTempObj.push(temp);
      };
      // sort
      listTempObj.sort((a, b) => a.AllocationFromSeq - b.AllocationFromSeq);
      this.RuleReferantorData[supplCode] = listTempObj;
    }
  }

  isAutoGenerate: boolean = true;
  async GetExistingAppCommData(){
    var objApi = { AppId: this.AppId };
    await this.http.post(AdInsConstant.GetAppCommissionDataForEditByAppId, objApi).toPromise().then(
      (response) => {
        console.log("response edit comm");
        console.log(response);
        var tempObj: Array<AppCommissionHObj> = response[AdInsConstant.ReturnObj];
        if (tempObj.length > 0) {
          // console.log("edit data");
          this.isAutoGenerate = false;
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);


        } else {
          // console.log("new data");
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
          this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
          this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SaveForm() {

  }
}
