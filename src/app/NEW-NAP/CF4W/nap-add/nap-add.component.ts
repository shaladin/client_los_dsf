import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ValidationErrors } from '@angular/forms';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NapAppModel } from 'app/shared/model/NapApp.Model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueModel';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-nap-add',
  templateUrl: './nap-add.component.html',
  providers: [NGXToastrService]
})
export class NapAddComponent implements OnInit {

  @ViewChild('LookupOffering') ucLookupOffering: UclookupgenericComponent;
  @ViewChild('LookupCopyProduct') ucLookupCopyProduct: UclookupgenericComponent;
  inputLookupObjCopyProduct: InputLookupObj = new InputLookupObj();
  inputLookupObjName: InputLookupObj = new InputLookupObj();
  officeItems: Array<KeyValueObj> = new Array<KeyValueObj>();
  user: any;

  NapAppForm = this.fb.group({
    MouCustId: [''],
    LeadId: [''],
    AppNo: [''],
    OriOfficeCode: [''],
    OriOfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    ProdOfferingCode: [''],
    ProdOfferingName: [''],
    ProdOfferingVersion: [''],
    AppCreatedDt: [''],
    AppStat: [''],
    AppCurrStep: [''],
    AppLastStep: [''],
    CurrCode: [''],
    LobCode: [''],
    RefProdTypeCode: [''],
    Tenor: 0,
    NumOfInst: 0,
    PayFreqCode: [''],
    MrFirstInstTypeCode: "",
    NumOfAsset: 0,
    MrLcCalcMethodCode: [''],
    LcInstRatePrml: [''],
    LcInsRatePrml: [''],
    MrAppSourceCode: "",
    MrWopCode: "",
    SrvyOrderNo: [''],
    ApvDt: [''],
    SalesHeadNo: [''],
    SalesNotes: [''],
    SalesOfficerNo: "",
    CreditAdminNo: [''],
    CreditAnalystNo: [''],
    CreditRiskNo: [''],
    DataEntryNo: [''],
    MrSalesRecommendCode: [''],
    MrCustNotifyOptCode: "",
    PreviousAppId: [''],
    IsAppInitDone: [''],
    MrOrderInfoCode: [''],
    ApprovalStat: [''],
    RsvField1: [''],
    RsvField2: [''],
    RsvField3: [''],
    RsvField4: [''],
    RsvField5: ['']
  });

  constructor(private fb: FormBuilder, private router: Router,
    private http: HttpClient, private toastr: NGXToastrService) { }

  isCopyData: boolean = false;
  ngOnInit() {
    // Lookup Obj
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    this.MakeLookUpObj();
    this.GetOfficeDDL();

    if (this.user.MrOfficeTypeCode == CommonConstant.CollectionGroup) {
      this.NapAppForm.patchValue({
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }
    else {
      this.NapAppForm.controls.OriOfficeCode.disable();
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
        CrtOfficeCode: this.user.OfficeCode,
        CrtOfficeName: this.user.OfficeName,
      });
    }

    // Test Data
    console.log(this.user);
    console.log(this.NapAppForm);
  }

  MakeLookUpObj() {
    this.inputLookupObjCopyProduct = new InputLookupObj();
    this.inputLookupObjCopyProduct.urlJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObjCopyProduct.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCopyProduct.pagingJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.genericJson = "./assets/uclookup/NAP/lookupApp.json";
    this.inputLookupObjCopyProduct.isRequired = false;

    this.inputLookupObjName = new InputLookupObj();
    this.inputLookupObjName.urlJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupObjName.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObjName.pagingJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.genericJson = "./assets/uclookup/NAP/lookupAppName.json";
    this.inputLookupObjName.nameSelect = this.NapAppForm.controls.ProdOfferingName.value;
    this.inputLookupObjName.isRequired = true;

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.CF4W;
    arrCopyLookupCrit.push(critObj);
    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [this.user.OfficeCode];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = CommonConstant.CF4W;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;

    if (this.user.MrOfficeTypeCode != "CG") {
      this.NapAppForm.patchValue({
        OriOfficeCode: this.user.OfficeCode,
        OriOfficeName: this.user.OfficeName,
      });
    }

  }

  GetOfficeDDL() {
    // Office DDL
    var obj = {
      RowVersion: ""
    };
    var url = AdInsConstant.GetListKvpActiveRefOfficeForPaging;
    this.http.post(url, obj).subscribe(
      (response) => {
        console.log(response);
        this.officeItems = response["ReturnObject"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CheckValue(obj) {
    if (obj.MrWopCode == null) {
      obj.MrWopCode = "";
    }
    if (obj.SalesOfficerNo == null) {
      obj.SalesOfficerNo = "";
    }
    if (obj.MrAppSourceCode == null) {
      obj.MrAppSourceCode = "";
    }
    if (obj.MrCustNotifyOptCode == null) {
      obj.MrCustNotifyOptCode = "";
    }
    if (obj.MrFirstInstTypeCode == null) {
      obj.MrFirstInstTypeCode = "";
    }

    return obj;
  }

  testData() {
    console.log(this.NapAppForm);
    console.log(this.NapAppForm.valid);
    this.getFormValidationErrors();
    console.log(this.inputLookupObjName);
    console.log(this.inputLookupObjCopyProduct);
  }

  getFormValidationErrors() {
    const invalid = [];
    const controls = this.NapAppForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        console.log(name);
      }
    }
    console.log(invalid);
  }

  SaveForm() {
    console.log("masuk save");
    var napAppObj = new NapAppModel();
    napAppObj = this.NapAppForm.value;
    napAppObj.AppCreatedDt = this.user.BusinessDt;
    napAppObj.IsAppInitDone = false;
    napAppObj.AppStat = CommonConstant.AppStepNew;
    napAppObj.AppCurrStep = CommonConstant.AppStepNew;
    napAppObj.BizTemplateCode = CommonConstant.CF4W;
    napAppObj.LobCode = this.NapAppForm.controls.LobCode.value;
    napAppObj.OriOfficeCode = this.NapAppForm.controls['OriOfficeCode'].value;
    napAppObj.OriOfficeName = this.NapAppForm.controls['OriOfficeName'].value;
    napAppObj = this.CheckValue(napAppObj);

    var url = URLConstant.AddApp;
    this.http.post(url, napAppObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["Nap/ConsumerFinance/Add/Detail"], { queryParams: { "AppId": response["AppId"] } });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getLookupAppResponseCopy(ev: any) {
    this.NapAppForm.patchValue({
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingName: ev.ProdOfferingName,
      ProdOfferingVersion: ev.ProdOfferingVersion,
      AppNo: ev.AppNo,
      MouCustId: ev.MouCustId,
      LeadId: ev.LeadId,
      CurrCode: ev.CurrCode,
      LobCode: ev.LobCode,
      RefProdTypeCode: ev.RefProdTypeCode,
      Tenor: ev.Tenor,
      NumOfInst: ev.NumOfInst,
      NumOfAsset: ev.NumOfAsset,
      PayFreqCode: ev.PayFreqCode,
      MrFirstInstTypeCode: ev.MrFirstInstTypeCode,
      MrAppSourceCode: ev.MrAppSourceCode,
      MrWopCode: ev.MrWopCode,
      MrCustNotifyOptCode: ev.MrCustNotifyOptCode,
      SalesOfficerNo: ev.SalesOfficerNo
    });
    this.NapAppForm.get("ProductOfferingNameIdentifier").patchValue({
      value: ev.ProdOfferingName
    });
    console.log(this.NapAppForm);
    // this.inputLookupObjName.nameSelect = ev.ProdOfferingName;
    this.inputLookupObjName.isRequired = false;
    this.isCopyData = true;
  }

  getLookupAppResponseName(ev: any) {
    console.log(ev);
    var obj = {
      ProdOfferingCode: ev.ProdOfferingCode,
      ProdOfferingVersion: ev.ProdOfferingVersion,
    };
    var tempLobCode;
    var tempCurrCode;
    var tempPayFreqCode;
    var tempRefProdTypeCode;
    this.http.post(AdInsConstant.GetListProdOfferingDByProdOfferingCodeAndProdOfferingVersion, obj).subscribe(
      (response) => {
        console.log(response);
        var temp = response["ListProdOfferingDObj"];
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntLob) {
            tempLobCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntCurr) {
            tempCurrCode = temp[i].CompntValue;
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntPayFreq) {
            var listPayFreqCode = temp[i].CompntValue.split(";");
            if (listPayFreqCode.length == 1) {
              tempPayFreqCode = temp[i].CompntValue;
            } else {
              tempPayFreqCode = null;
            }
          } else if (temp[i].RefProdCompntCode == CommonConstant.RefProdCompntProdType) {
            tempRefProdTypeCode = temp[i].CompntValue;
          } else {
            // console.log("Not");
          }
        }
        this.NapAppForm.patchValue({
          ProdOfferingCode: ev.ProdOfferingCode,
          ProdOfferingName: ev.ProdOfferingName,
          ProdOfferingVersion: ev.ProdOfferingVersion,
          CurrCode: tempCurrCode,
          LobCode: tempLobCode,
          PayFreqCode: tempPayFreqCode,
          RefProdTypeCode: tempRefProdTypeCode
        });
        console.log(this.NapAppForm);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ChangeValueOffice(ev: any) {
    console.log(ev);
    this.NapAppForm.patchValue({
      OriOfficeCode: ev.target.selectedOptions[0].value,
      OriOfficeName: ev.target.selectedOptions[0].text
    });

    var arrCopyLookupCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "a.ORI_OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrCopyLookupCrit.push(addCrit);

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'vrl.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.CF4W;
    arrCopyLookupCrit.push(critObj);

    this.inputLookupObjCopyProduct.addCritInput = arrCopyLookupCrit;
    this.ucLookupCopyProduct.setAddCritInput();

    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "ro.OFFICE_CODE";
    addCrit.restriction = AdInsConstant.RestrictionIn;
    addCrit.listValue = [ev.target.selectedOptions[0].value];
    arrAddCrit.push(addCrit);

    var addCritBizTempalte = new CriteriaObj();
    addCritBizTempalte.DataType = "text";
    addCritBizTempalte.propName = "rlob.BIZ_TMPLT_CODE";
    addCritBizTempalte.restriction = AdInsConstant.RestrictionEq;
    addCritBizTempalte.value = CommonConstant.CF4W;
    arrAddCrit.push(addCritBizTempalte);

    this.inputLookupObjName.addCritInput = arrAddCrit;
    this.ucLookupOffering.setAddCritInput();
  }

}
