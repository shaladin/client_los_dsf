import { UcapprovalcreateComponent } from '@adins/ucapprovalcreate';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppAssetDetailObj } from 'app/shared/model/app-asset/app-asset-detail-obj.model';
import { AppAssetAttrObj } from 'app/shared/model/app-asset-attr-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { AppCollateralObj } from 'app/shared/model/app-collateral-obj.model';
import { AppCollateralRegistrationObj } from 'app/shared/model/app-collateral-registration-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { AgrmntDataForEditAppAftApv } from 'app/shared/model/edit-app-aft-apv/agrmnt-data-for-edit-app-aft-apv.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { PurchaseOrderHObj } from 'app/shared/model/purchase-order-h-obj.model';
import { ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj } from 'app/shared/model/request/vendor/req-vendor-emp.model';
import { ResGetVendorEmpByVendorEmpNoAndVendorCodeObj } from 'app/shared/model/res-get-vendor-emp-by-vendor-emp-no-and-vendor-code-obj.model';
import { UcInputRFAObj } from 'app/shared/model/uc-input-rfa-obj.model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { AgrmntObj } from 'app/shared/model/agrmnt/agrmnt.model';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { AppOtherInfoObj } from 'app/shared/model/app-other-info.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { DatePipe } from '@angular/common';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';


@Component({
  selector: 'app-edit-app-after-approval-detail-x-dsf',
  templateUrl: './edit-app-after-approval-detail-x-dsf.component.html'
})
export class EditAppAfterApprovalDetailXDsfComponent implements OnInit {

  private createComponent: UcapprovalcreateComponent;
  @ViewChild('ApprovalComponent') set content(content: UcapprovalcreateComponent) {
    if (content) {
      // initially setter gets called with undefined
      this.createComponent = content;
    }
  }

  IsReady: Boolean = false;
  agrmntId: number;
  arrValue = [];
  agrmntDataForEditAppAftApv: AgrmntDataForEditAppAftApv = new AgrmntDataForEditAppAftApv();
  ContentObjSupplierEmp = new Array();
  InputLookupSupplEmpObjs = [];
  selectedAppAssetObj: AppAssetObj;
  selectedListAppAssetAttrObjs: Array<AppAssetAttrObj>;
  selectedAppCollateralObj: AppCollateralObj;
  selectedAppCollateralRegistrationObj: AppCollateralRegistrationObj;
  selectedPurchaseOrderHObj;
  isDetail: boolean = true;
  isEditAssetData: boolean = false;
  tempAssetDataIdx: number = 0;
  isEditPoData: Boolean = false;
  isEditBankAccData: boolean = false;
  listEditedPoData = new Array();
  listEditedAssetData = new Array();
  listEditedCommissionData = new Array();
  editedBankAccData: any;
  apvBaseUrl = environment.ApprovalR3Url;
  InputObj: UcInputRFAObj;
  ApprovalCreateOutput: any;
  listTempVba = new Array();
  arrAddCrit = new Array();
  IsPOEdited: boolean = false;
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);
  DDLReason;
  AgrmntCurrStep: string;
  OriOfficeCode: string;
  LobCode: string = "";
  AppId: number = 0;
  CustBankAccList: Array<Object> = new Array<Object>();
  EditAppForm = this.fb.group({
    // AppAssetList: this.fb.array([]),
    // PurchaseOrderHList: this.fb.array([]),
    SupplierCommissionList: this.fb.array([]),
    SupplierEmpCommissionList: this.fb.array([]),
    SupplierReferantorCommissionList: this.fb.array([]),
    Notes: ['', [Validators.maxLength(4000), Validators.required]]
  });
  IsCommissionChanged: boolean = false;
  IsCommissionExist: boolean = false;
  wopCode: string;

  readonly wopAutoDebit = CommonConstant.WopAutoDebit;
  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private toastr: NGXToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AgrmntId"] != null) {
        this.agrmntId = params["AgrmntId"];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.arrValue.push(this.agrmntId);
    this.DDLReason = new Array();
    await this.BindDDLReason();
    await this.getData();
    await this.initInputApprovalObj();
    await this.setdata();
  }

  async checkIsEditCommExist() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.agrmntId;
    await this.http.post(URLConstantX.GetEditComReqAndApvByAgrmntId, reqObj).toPromise().then(
      (response) => {  
        if(response["ReturnObject"] != null){
          this.IsCommissionExist = true;
        }
      });
  }

  async BindDDLReason() {
    var Obj = { RefReasonTypeCode: CommonConstant.RefReasonTypeCodeEditAppAfterApproval };
    await this.http.post(URLConstant.GetListActiveRefReason, Obj).toPromise().then(
      (response) => {
        this.DDLReason = response[CommonConstant.ReturnObj];
      });
  }

  async initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.EDIT_APP_AFT_APV_APV_TYPE,
      "Attributes": Attributes,
    }
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_EDIT_APP_AFT_APV_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_EDIT_APP_AFT_APV_APV_SCHM_NORMAL;
    this.InputObj.Reason = this.DDLReason;
    this.InputObj.OfficeCode = this.OriOfficeCode;
    this.InputObj.OfficeCodes.push(this.OriOfficeCode);
    this.InputObj.TrxNo = "-";
  }

  async getData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.agrmntId;

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, reqObj).toPromise().then(
      (response: AgrmntObj) => {
        this.AgrmntCurrStep = response.AgrmntCurrStep;
        this.OriOfficeCode = response.OfficeCode;
      });

    await this.http.post(URLConstant.GetAgrmntDataForEditAppAfterApprovalByAgrmntId, reqObj).toPromise().then(
      (response) => {
        this.agrmntDataForEditAppAftApv = response[CommonConstant.ReturnObj];
      }
    );

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, reqObj).toPromise().then(
      (response) => {
        this.LobCode = response["LobCode"];
        this.AppId = response["AppId"];
        this.wopCode = response["MrWopCode"];
      }
    );

    let addCritVendor = new CriteriaObj();
    await this.http.post(URLConstant.GetAppAssetByAgrmntId, reqObj).toPromise().then(
      (response) => {

        addCritVendor.propName = "V.VENDOR_CODE";
        addCritVendor.restriction = AdInsConstant.RestrictionEq;
        addCritVendor.value = response["SupplCode"];
        this.arrAddCrit.push(addCritVendor);
      }
    );

    if(this.LobCode == CommonConstantX.SLB){
      await this.http.post(URLConstant.GetAppCustByAppId, { Id : this.AppId }).toPromise().then(
        async (response) => {
          await this.http.post(URLConstant.GetListAppCustBankAccByAppCustId, { Id : response["AppCustId"] }).toPromise().then(
            (response) => {
              this.CustBankAccList = response["ReturnObject"]['AppCustBankAccObjs'];
            }
          );
        }
      );
    }

    await this.http.post<AppAssetDetailObj>(URLConstant.GetAppAssetListAndAppAssetSupplEmpListDistinctSupplierByAgrmntId, reqObj).toPromise().then(
      (response) => {
        if (response.ListAppAssetObj.length != 0) {
          this.GetDDLContentSupplEmp(response.ListAppAssetSupplEmpObj);
        }
      });

    for (var i = 0; i < this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs.length; i++) {
      let currentAgrmntCommissionHId = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].AgrmntCommissionHId;
      var formGroupComm = this.fb.group({
        AgrmntCommissionHId: [currentAgrmntCommissionHId],
        CommissionRecipientRefNoDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].CommissionRecipientRefNoDesc],
        TotalCommissionAmt: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].TotalCommissionAmt],
        CurrentVendorBankAccId: ["", [Validators.required]]
      });

      const vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].VendorBankAccObjs;

      this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

      let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankCode;
      let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankAccNo;
      let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankAccName;

      let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
        x.BankAccountName == currentBankAccountName);

      if(currentVba){
        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);
      }

      (this.EditAppForm.get("SupplierCommissionList") as FormArray).push(formGroupComm);
    }


    // var addCritAgrmntId = new CriteriaObj();
    // addCritAgrmntId.DataType = "numeric";
    // addCritAgrmntId.propName = "AA.AGRMNT_ID";
    // addCritAgrmntId.restriction = AdInsConstant.RestrictionIn;
    // addCritAgrmntId.listValue = [this.agrmntId];
    // this.arrAddCrit.push(addCritAgrmntId);

    for (var i = 0; i < this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs.length; i++) {
      let currentAgrmntCommissionHId = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].AgrmntCommissionHId;

      var formGroupComm = this.fb.group({
        AgrmntCommissionHId: [currentAgrmntCommissionHId],
        CommissionRecipientRefNo: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNo],
        CommissionRecipientRefNoDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc],
        TotalCommissionAmt: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].TotalCommissionAmt],
        CommissionRecipientPositionDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientPositionDesc],
        SupplierName: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].SupplierName],
        CurrentVendorBankAccId: ["", [Validators.required]]
      })

      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId] = new InputLookupObj();

      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].urlJson = "./assets/impl/uclookup/lookupSupplEmpForEditAppAftApv.json";
      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].urlEnviPaging = environment.FoundationR3Url + "/v1";
      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].pagingJson = "./assets/impl/uclookup/lookupSupplEmpForEditAppAftApv.json";
      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].genericJson = "./assets/impl/uclookup/lookupSupplEmpForEditAppAftApv.json";
      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].isReady = true;

      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].nameSelect = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc;
      this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].jsonSelect = { VendorEmpName: this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc };

      const vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].VendorBankAccObjs;

      this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

      let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankCode;
      let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankAccNo;
      let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankAccName;

      let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
        x.BankAccountName == currentBankAccountName);

      if(currentVba){
        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);
      }

      (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray).push(formGroupComm);
    }

    for (var i = 0; i < this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs.length; i++) {
      this.InputLookupSupplEmpObjs[this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].AgrmntCommissionHId].addCritInput = this.arrAddCrit;
    }

    for (var i = 0; i < this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs.length; i++) {
      let currentAgrmntCommissionHId = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].AgrmntCommissionHId;

      var formGroupComm = this.fb.group({
        AgrmntCommissionHId: [currentAgrmntCommissionHId],
        CommissionRecipientRefNoDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].CommissionRecipientRefNoDesc],
        TotalCommissionAmt: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].TotalCommissionAmt],
        CurrentVendorBankAccId: ["", [Validators.required]]
      });

      const vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].VendorBankAccObjs;

      this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

      let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankCode;
      let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankAccNo;
      let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankAccName;

      let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
        x.BankAccountName == currentBankAccountName);

      if(currentVba){
        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);
      }

      (this.EditAppForm.get("SupplierReferantorCommissionList") as FormArray).push(formGroupComm);
    }

  }

  async setdata() {
    // var formArray1 = this.EditAppForm.get("SupplierCommissionList") as FormArray;

    // for (var i = 0; i < formArray1.length; i++) {
    //   var VendorBankAcc = formArray1.at(i).value;
    //   VendorBankAcc.controls[i].VendorBankAccId.patchValue(249);

    // }
    this.IsReady = true;
  }

  GetDDLContentSupplEmp(ReturnObject) {
    for (var i = 0; i < ReturnObject.length; i++) {
      var KVPObj;
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

  editAssetData(e: AppAssetObj, idx) {
    this.isEditAssetData = true;
    this.isDetail = false;
    this.tempAssetDataIdx = idx;

    this.selectedAppAssetObj = e;

    this.selectedAppCollateralObj = this.agrmntDataForEditAppAftApv.AppCollateralObjs.filter(x => x.AppAssetId == e.AppAssetId)[0];
    this.selectedAppCollateralRegistrationObj = this.agrmntDataForEditAppAftApv.AppCollateralRegistrationObjs.filter(x => x.AppCollateralId == this.selectedAppCollateralObj.AppCollateralId)[0];

    //apply prev edited value
    let selectedExistingEditedAsset = this.listEditedAssetData.filter(x => x.AppAssetId == e.AppAssetId)[0];
    if (selectedExistingEditedAsset) {
      if (selectedExistingEditedAsset.AppCollateralRegistrationObj) {
        for (var prop in selectedExistingEditedAsset.AppCollateralRegistrationObj) {
          if (this.selectedAppCollateralRegistrationObj[prop] != undefined)
            this.selectedAppCollateralRegistrationObj[prop] = selectedExistingEditedAsset.AppCollateralRegistrationObj[prop];
        }
      }
      if (selectedExistingEditedAsset.AppAssetAttrObjs)
        this.selectedListAppAssetAttrObjs = selectedExistingEditedAsset.AppAssetAttrObjs;
    }
  }

  editPoData(e) {
    var EditedVendorBankAccId = 0;
    if (this.IsPOEdited) {
      EditedVendorBankAccId = this.selectedPurchaseOrderHObj.VendorBankAccId;
    }
    this.selectedPurchaseOrderHObj = e;
    this.selectedPurchaseOrderHObj["EditedVendorBankAccId"] = EditedVendorBankAccId;
    this.isEditPoData = true;
    this.isDetail = false;
  }

  editBankAccData() {
    this.isEditBankAccData = true;
    this.isDetail = false;
  }

  getPage(e) {
    if (e.pageType == "submitAssetData") {
      this.isEditAssetData = false;
      this.isDetail = true;

      let index = this.listEditedAssetData.map(function (x) { return x.AppAssetId; }).indexOf(e.AppAssetRelatedOutput.AppAssetId);
      if (index > -1)
        this.listEditedAssetData.splice(index, 1);

      this.listEditedAssetData.push(e.AppAssetRelatedOutput);

      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].SerialNo1 = e.AppAssetRelatedOutput.AppAssetObj.SerialNo1;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].SerialNo2 = e.AppAssetRelatedOutput.AppAssetObj.SerialNo2;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].SerialNo3 = e.AppAssetRelatedOutput.AppAssetObj.SerialNo3;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].SerialNo4 = e.AppAssetRelatedOutput.AppAssetObj.SerialNo4;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].SerialNo5 = e.AppAssetRelatedOutput.AppAssetObj.SerialNo5;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].Color = e.AppAssetRelatedOutput.AppAssetObj.Color;
      this.agrmntDataForEditAppAftApv.AppAssetObjs[this.tempAssetDataIdx].ManufacturingYear = e.AppAssetRelatedOutput.AppAssetObj.ManufacturingYear;

      this.toastr.successMessage("Success");
    }
    else if (e.pageType == "submitPoData") {
      this.isEditPoData = false;
      this.isDetail = true;

      let index = this.listEditedPoData.map(function (x) { return x.PurchaseOrderHId; }).indexOf(e.PurchaseOrderHOutput.PurchaseOrderHId);
      if (index > -1)
        this.listEditedPoData.splice(index, 1);

      this.listEditedPoData.push(e.PurchaseOrderHOutput);
      this.selectedPurchaseOrderHObj = e.PurchaseOrderHOutput;
      this.IsPOEdited = true;
      this.toastr.successMessage("Success");
    }
    else if (e.pageType == "submitBankAccData") {
      this.isEditBankAccData = false;
      this.isDetail = true;
      this.editedBankAccData = e.BankAccRelatedOutput;
      console.log(this.editedBankAccData);
      this.toastr.successMessage("Success");
    }
    else if (e.pageType == "cancelPoData" || e.pageType == "cancelAssetData" || e.pageType == "cancelBankAccData") {
      this.isEditPoData = false;
      this.isEditAssetData = false;
      this.isEditBankAccData = false;
      this.isDetail = true;
      if (e.pageType == "cancelPoData") this.selectedPurchaseOrderHObj = e.PurchaseOrderHOutput;

      this.toastr.warningMessage("Cancelled");
    }

  }

  CommBankAccHandler(e, AgrCommH, type) {
    if(!e.target.value) return
    
    this.IsCommissionChanged = true;
    let selectedCommH;
    if (type == 'SUPPL')
      selectedCommH = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs.find(x => x.AgrmntCommissionHId == AgrCommH.controls.AgrmntCommissionHId.value);
    else if (type == 'SUPPLEMP'){
      AgrCommH.patchValue({
        CurrentVendorBankAccId : e.target.selectedOptions[0].value
      });

      return;
    }else if (type == 'REF')
      selectedCommH = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs.find(x => x.AgrmntCommissionHId == AgrCommH.controls.AgrmntCommissionHId.value);

    let selectedVba = selectedCommH.VendorBankAccObjs.find(x => x.VendorBankAccId == e.target.value);

    var commVbaData =
      {
        AgrmntCommissionHId: selectedCommH.AgrmntCommissionHId,
        BankCode: selectedVba.BankCode,
        BankBranch: selectedVba.BankBranch,
        BankAccountNo: selectedVba.BankAccountNo,
        BankAccountName: selectedVba.BankAccountName,
        BankName: selectedVba.BankName,
        CommissionRecipientRefNo: selectedCommH.CommissionRecipientRefNo
      };

    let index = this.listEditedCommissionData.map(function (x) { return x.AgrmntCommissionHId; }).indexOf(selectedCommH.AgrmntCommissionHId);
    if (index > -1)
      this.listEditedCommissionData.splice(index, 1);

    this.listEditedCommissionData.push(commVbaData);
  }

  SupplEmpHandler(e, AgrCommH, index)
  {
    this.IsCommissionChanged = true;
    let isValid = true;
    let targetSupplEmp = this.ContentObjSupplierEmp.find(x => x.Key == e.target.value);

    var SupplEmpCommList = (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray);

    for (let i = 0; i < SupplEmpCommList.length; i++) {
      var CommissionRecipientRefNo = SupplEmpCommList.at(i).get("CommissionRecipientRefNo").value;

      if (CommissionRecipientRefNo == targetSupplEmp.Key) {
        isValid = false;
        break;
      }

    }

    if (!isValid) {
      this.toastr.errorMessage(ExceptionConstant.DATA_ALREADY_EXIST);
    }
    else {
      let AgrmntCommissionHId = AgrCommH.controls.AgrmntCommissionHId.value;
      let indexVba = this.listTempVba.map(function (x) { return x.AgrmntCommissionHId; }).indexOf(AgrmntCommissionHId);
      if (indexVba > -1)
        this.listTempVba.splice(indexVba, 1);

      SupplEmpCommList.removeAt(index);

      let empObj: ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj = new ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj();
      empObj.VendorEmpNo = targetSupplEmp.Key,
        empObj.VendorCode = targetSupplEmp.SupplCode


      this.http.post(URLConstant.GetVendorEmpByVendorEmpNoAndVendorCode, empObj).subscribe(
        (response: ResGetVendorEmpByVendorEmpNoAndVendorCodeObj) => {
          var formGroupComm = this.fb.group({
            AgrmntCommissionHId: [AgrmntCommissionHId],
            CommissionRecipientRefNoDesc: [response.VendorEmpName],
            TotalCommissionAmt: [AgrCommH.controls.TotalCommissionAmt.value],
            CommissionRecipientPositionDesc: [response.MrVendorEmpPositionCodeDesc],
            SupplierName: [response.VendorName]
          });

          SupplEmpCommList.push(formGroupComm);
        });

      let reqByVendorEmpNo: GenericObj = new GenericObj();
      reqByVendorEmpNo.EmpNo = targetSupplEmp.Key;
      this.http.post(URLConstant.GetListActiveVendorBankAccObjByVendorEmpNo, reqByVendorEmpNo).subscribe(
        (response) => {
          var vendorBankAccObj = response[CommonConstant.ReturnObj];

          this.listTempVba[AgrmntCommissionHId] = vendorBankAccObj;

        });
    }
  }

  SetSupplEmpVbaData(e, AgrCommH, index) {
    this.IsCommissionChanged = true;
    var SupplEmpCommList = (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray);

    var CommissionRecipientRefNo = SupplEmpCommList.at(index).get("CommissionRecipientRefNo").value;

    if (CommissionRecipientRefNo != e.VendorEmpNo) {
      let AgrmntCommissionHId = AgrCommH.controls.AgrmntCommissionHId.value;
      let indexVba = this.listTempVba.map(function (x) { return x.AgrmntCommissionHId; }).indexOf(AgrmntCommissionHId);
      if (indexVba > -1)
        this.listTempVba.splice(indexVba, 1);

      SupplEmpCommList.removeAt(index);

      let empObj: ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj = new ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj();
      empObj.VendorEmpNo = e.VendorEmpNo,
        empObj.VendorCode = e.VendorCode


      this.http.post(URLConstant.GetVendorEmpByVendorEmpNoAndVendorCode, empObj).subscribe(
        (response: ResGetVendorEmpByVendorEmpNoAndVendorCodeObj) => {
          var formGroupComm = this.fb.group({
            AgrmntCommissionHId: [AgrmntCommissionHId],
            CommissionRecipientRefNo: [e.VendorEmpNo],
            CommissionRecipientRefNoDesc: [response.VendorEmpName],
            TotalCommissionAmt: [AgrCommH.controls.TotalCommissionAmt.value],
            CommissionRecipientPositionDesc: [response.MrVendorEmpPositionCodeDesc],
            SupplierName: [response.VendorName],
            CurrentVendorBankAccId: ["", [Validators.required]],
            TaxpayerNo : [response.TaxpayerNo]
          });

          let reqByVendorEmpNo: GenericObj = new GenericObj();
          reqByVendorEmpNo.EmpNo = e.VendorEmpNo;
          this.http.post(URLConstant.GetListActiveVendorBankAccObjByVendorEmpNo, reqByVendorEmpNo).subscribe(
            (response) => {
              var vendorBankAccObj = response[CommonConstant.ReturnObj];

              if(vendorBankAccObj.length == 0){
                vendorBankAccObj.push({VendorBankAccId: ''});
                formGroupComm.get("CurrentVendorBankAccId").setValidators(Validators.required);
                formGroupComm.updateValueAndValidity();
              }

              this.listTempVba[AgrmntCommissionHId] = vendorBankAccObj;

              if(vendorBankAccObj && vendorBankAccObj.length>0){
                formGroupComm.controls.CurrentVendorBankAccId.patchValue(vendorBankAccObj[0].VendorBankAccId);
              }

              SupplEmpCommList.push(formGroupComm);
            });

        });

    }
  }

  CancelClick() {
    //Self Custom Changes CR Runner KTB 398912
    AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADD_PRCS_EDIT_APP_AFT_APV_PAGING_DSF], { BizTemplateCode: this.BizTemplateCode });
    //End Self Custom Changes CR Runner KTB 398912
  }

  RFAInfo: Object = new Object();
  async SaveForm() {
    this.RFAInfo = { RFAInfo: this.EditAppForm.controls.RFAInfo.value };
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if(this.listEditedAssetData.length <= 0 && this.listEditedPoData.length <= 0 && !this.IsCommissionChanged && !this.editedBankAccData)
    {
      this.toastr.errorMessage(ExceptionConstant.NO_DATA_EDITED);
      return;
    }

    await this.checkIsEditCommExist();

    if (this.IsCommissionExist){
      this.toastr.errorMessage("Edit Commission in progress");
      return;
    }

    this.SetSupplEmpComm();

    this.ApprovalCreateOutput = this.createComponent.output();

    var EditAppAftApvObj =
      {
        RequestEditAppAftApvForSubmitRequest: 
        {  
          AgrmntId: this.agrmntId,
          CurrentOfficeCode: currentUserContext[CommonConstant.OFFICE_CODE],
          EditedAssetDataObjs: this.listEditedAssetData,
          EditedPoDataObjs: this.listEditedPoData,
          EditedCommissionDataObjs: this.listEditedCommissionData,
          Notes: this.EditAppForm.controls.Notes.value,
          RequestRFAObj: this.RFAInfo
        },
        EditedAgrmntOtherInfoObj: new Object,
        EditedAppXObj: new Object,
        IsEditedBank: false
      };
    
    if(this.editedBankAccData)
    {
      EditAppAftApvObj.EditedAgrmntOtherInfoObj = this.editedBankAccData.AgrmntOtherInfoObj;
      EditAppAftApvObj.EditedAppXObj = this.editedBankAccData.AppXObj;
      EditAppAftApvObj.IsEditedBank = true
    }

    let urlPost = environment.isCore ? URLConstant.SubmitEditAppAftApvReqX : URLConstant.SubmitEditAppAftApvReq;

    await this.http.post(urlPost, EditAppAftApvObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        //Self Custom Changes CR Runner KTB 398912
        AdInsHelper.RedirectUrl(this.router, [NavigationConstantDsf.NAP_ADD_PRCS_EDIT_APP_AFT_APV_PAGING_DSF], { BizTemplateCode: this.BizTemplateCode });
        //End Self Custom Changes CR Runner KTB 398912
      }
    );
  }

  SetSupplEmpComm(){
    var SupplEmpCommList = (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray).value;

    for (let i = 0; i < SupplEmpCommList.length; i++) {
      let editedIdx = this.listEditedCommissionData.findIndex(x => x.AgrmntCommissionHId == SupplEmpCommList[i].AgrmntCommissionHId);
      let listBankSupplier = this.listTempVba[SupplEmpCommList[i].AgrmntCommissionHId];
      let selectedVba = listBankSupplier.find(x => x.VendorBankAccId == SupplEmpCommList[i].CurrentVendorBankAccId);

      if(editedIdx != -1){
        this.listEditedCommissionData[editedIdx].BankCode = selectedVba.BankCode;
        this.listEditedCommissionData[editedIdx].BankName = selectedVba.BankName;
        this.listEditedCommissionData[editedIdx].BankBranch = selectedVba.BankBranch == null ? "" : selectedVba.BankBranch;
        this.listEditedCommissionData[editedIdx].BankAccountNo = selectedVba.BankAccountNo;
        this.listEditedCommissionData[editedIdx].BankAccountName = selectedVba.BankAccountName;
      }else{
        SupplEmpCommList[i].BankCode = selectedVba.BankCode;
        SupplEmpCommList[i].BankName = selectedVba.BankName;
        SupplEmpCommList[i].BankBranch = selectedVba.BankBranch == null ? "" : selectedVba.BankBranch;
        SupplEmpCommList[i].BankAccountNo = selectedVba.BankAccountNo;
        SupplEmpCommList[i].BankAccountName = selectedVba.BankAccountName;
        this.listEditedCommissionData.push(SupplEmpCommList[i])
      }
    }
  }
}
