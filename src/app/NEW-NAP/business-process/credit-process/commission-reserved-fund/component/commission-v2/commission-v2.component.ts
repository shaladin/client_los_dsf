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

@Component({
  selector: 'app-commission-v2',
  templateUrl: './commission-v2.component.html',
  styleUrls: ['./commission-v2.component.scss']
})
export class CommissionV2Component implements OnInit {

  @Input() AppId: number = 10550;
  @Input() showCancel: boolean = true;
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
  FormInputObjSupplierEmpl: any = {};
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
      // this.FormInputObjSupplier["ruleObj"] = this.RuleSupplierData;
      // this.FormInputObjSupplier["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplier["isCalculated"] = false;
      this.FormInputObjSupplier["isDataInputed"] = false;
      this.OnForm1 = true;
      console.log(this.FormInputObjSupplier);
    } else if (content == AdInsConstant.ContentSupplierEmp) {
      this.FormInputObjSupplierEmpl["title"] = AdInsConstant.TitleSupplierEmp;
      this.FormInputObjSupplierEmpl["content"] = AdInsConstant.ContentSupplierEmp;
      this.FormInputObjSupplierEmpl["labelName"] = AdInsConstant.LabelSupplierEmp;
      this.FormInputObjSupplierEmpl["AppId"] = this.AppId;
      this.FormInputObjSupplierEmpl["contentObj"] = this.ContentObjSupplierEmp;
      // this.FormInputObjSupplierEmpl["ruleObj"] = this.RuleSupplierEmpData;
      // this.FormInputObjSupplierEmpl["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjSupplierEmpl["isCalculated"] = false;
      this.FormInputObjSupplierEmpl["isDataInputed"] = false;
      // this.FormInputObjSupplierEmpl["dictSuppl"] = this.DictSupplierCode;
      this.OnForm2 = true;
      console.log(this.FormInputObjSupplierEmpl);
    } else if (content == AdInsConstant.ContentReferantor) {
      this.FormInputObjReferantor["title"] = AdInsConstant.TitleReferantor;
      this.FormInputObjReferantor["content"] = AdInsConstant.ContentReferantor;
      this.FormInputObjReferantor["labelName"] = AdInsConstant.LabelReferantor;
      this.FormInputObjReferantor["AppId"] = this.AppId;
      this.FormInputObjReferantor["contentObj"] = this.ContentObjReferantor;
      // this.FormInputObjReferantor["ruleObj"] = this.RuleReferantorData;
      // this.FormInputObjReferantor["isAutoGenerate"] = this.isAutoGenerate;
      this.FormInputObjReferantor["isCalculated"] = false;
      this.FormInputObjReferantor["isDataInputed"] = false;
      this.OnForm3 = true;
      console.log(this.FormInputObjReferantor);
    }
  }

  async ngOnInit() {
    await this.GetAppFeeData();
    await this.GetIncomeInfoObj();
    await this.GetContentData();
    console.log(this.CommissionForm);
    this.GetFormAddDynamicObj(AdInsConstant.ContentSupplier);
    this.GetFormAddDynamicObj(AdInsConstant.ContentSupplierEmp);
    this.GetFormAddDynamicObj(AdInsConstant.ContentReferantor);
  }

  ListAppFeeObj: Array<AppFeeObj> = new Array<AppFeeObj>();
  AdminFee;
  ProvisionFee;
  UppingAdminFee;
  UppingProvisionFee;
  async GetAppFeeData() {
    var obj = {
      // AppId: this.AppId,
      AppId: this.AppId,
      RowVersion: ""
    };
    await this.http.post(AdInsConstant.GetListAppFeeByAppId, obj).toPromise().then(
      (response) => {
        console.log("response app fee data");
        console.log(response);
        this.ListAppFeeObj = response[AdInsConstant.ReturnObj];
        for (var i = 0; i < this.ListAppFeeObj.length; i++) {
          if (this.ListAppFeeObj[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeAdmin) {
            this.AdminFee = this.ListAppFeeObj[i].AppFeeAmt;
            this.UppingAdminFee = this.ListAppFeeObj[i].SellFeeAmt - this.ListAppFeeObj[i].AppFeeAmt;
            // console.log("admin fee");
            // console.log(this.AdminFee);
            // console.log(this.UppingProvisionFee);
          } else if (this.ListAppFeeObj[i].MrFeeTypeCode == AdInsConstant.MrFeeTypeCodeProvision) {
            this.ProvisionFee = this.ListAppFeeObj[i].AppFeeAmt;
            this.UppingProvisionFee = this.ListAppFeeObj[i].SellFeeAmt - this.ListAppFeeObj[i].AppFeeAmt;
            // console.log("provision fee");
            // console.log(this.ProvisionFee);
            // console.log(this.UppingProvisionFee);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async GetIncomeInfoObj() {
    var obj = {
      AppId: this.AppId,
      AdminFee: this.AdminFee,
      ProvisionFee: this.ProvisionFee,
      UppingAdminFee: this.UppingAdminFee,
      UppingProvisionFee: this.UppingProvisionFee,
    };
    await this.http.post<AppFinDataObj>(AdInsConstant.GetAppFinDataWithRuleByAppId, obj).toPromise().then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
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

  SaveForm() {

  }
}
