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
import { AppAssetDetailObj } from 'app/shared/model/AppAsset/AppAssetDetailObj.Model';
import { AppAssetAttrObj } from 'app/shared/model/AppAssetAttrObj.Model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AgrmntDataForEditAppAftApv } from 'app/shared/model/EditAppAftApv/AgrmntDataForEditAppAftApv.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { PurchaseOrderHObj } from 'app/shared/model/PurchaseOrderHObj.Model';
import { ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj } from 'app/shared/model/Request/Vendor/ReqVendorEmp.model';
import { ResGetVendorEmpByVendorEmpNoAndVendorCodeObj } from 'app/shared/model/ResGetVendorEmpByVendorEmpNoAndVendorCodeObj.Model';
import { UcInputRFAObj } from 'app/shared/model/UcInputRFAObj.Model';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-edit-app-after-approval-detail',
  templateUrl: './edit-app-after-approval-detail.component.html',
  styleUrls: ['./edit-app-after-approval-detail.component.css']
})
export class EditAppAfterApprovalDetailComponent implements OnInit {

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
  isEditAssetData:boolean = false;
  isEditPoData: Boolean = false;
  listEditedPoData = new Array();
  listEditedAssetData = new Array();
  listEditedCommissionData = new Array();
  apvBaseUrl = environment.ApprovalR3Url;
  InputObj: UcInputRFAObj;
  ApprovalCreateOutput: any;
  listTempVba = new Array();
  arrAddCrit = new Array();;
  IsPOEdited: boolean = false;
  BizTemplateCode: string = localStorage.getItem(CommonConstant.BIZ_TEMPLATE_CODE);

  EditAppForm = this.fb.group({
    // AppAssetList: this.fb.array([]),
    // PurchaseOrderHList: this.fb.array([]),
    SupplierCommissionList: this.fb.array([]),
    SupplierEmpCommissionList: this.fb.array([]),
    SupplierReferantorCommissionList: this.fb.array([]),
    Notes: ['', [Validators.maxLength(4000), Validators.required]]
  });

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

    async ngOnInit(): Promise<void>  {
    this.arrValue.push(this.agrmntId);

    await this.initInputApprovalObj();
    await this.getData();
    await this.setdata();
  }

  async initInputApprovalObj() {
    this.InputObj = new UcInputRFAObj(this.cookieService);
    var Attributes = [{}]
    var TypeCode = {
      "TypeCode": CommonConstant.EDIT_APP_AFT_APV_APV_TYPE,
      "Attributes": Attributes,
    }
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    this.InputObj.RequestedBy = currentUserContext[CommonConstant.USER_NAME];
    this.InputObj.OfficeCode = currentUserContext[CommonConstant.OFFICE_CODE];
    this.InputObj.ApvTypecodes = [TypeCode];
    this.InputObj.EnvUrl = environment.FoundationR3Url;
    this.InputObj.PathUrlGetSchemeBySchemeCode = URLConstant.GetSchemesBySchemeCode;
    this.InputObj.PathUrlGetCategoryByCategoryCode = URLConstant.GetRefSingleCategoryByCategoryCode;
    this.InputObj.PathUrlGetAdtQuestion = URLConstant.GetRefAdtQuestion;
    this.InputObj.PathUrlGetPossibleMemberAndAttributeExType = URLConstant.GetPossibleMemberAndAttributeExType;
    this.InputObj.PathUrlGetApprovalReturnHistory = URLConstant.GetApprovalReturnHistory;
    this.InputObj.PathUrlCreateNewRFA = URLConstant.CreateNewRFA;
    this.InputObj.PathUrlCreateJumpRFA = URLConstant.CreateJumpRFA;
    this.InputObj.CategoryCode = CommonConstant.CAT_CODE_EDIT_APP_AFT_APV_APV;
    this.InputObj.SchemeCode = CommonConstant.SCHM_CODE_EDIT_APP_AFT_APV_APV_SCHM_NORMAL;
    this.InputObj.TrxNo = "-";
  }

  async getData()
  {
      let reqObj : GenericObj = new GenericObj();
      reqObj.Id = this.agrmntId;

      await this.http.post(URLConstant.GetAgrmntDataForEditAppAfterApprovalByAgrmntId, reqObj).toPromise().then(
        (response) => {
          this.agrmntDataForEditAppAftApv = response[CommonConstant.ReturnObj];
        }
      );

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
          CurrentVendorBankAccId:[]
        });
 
        var vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].VendorBankAccObjs;
    
        this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

        let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankCode;
        let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankAccNo;
        let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs[i].BankAccName;

        let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
                                                    x.BankAccountName == currentBankAccountName);

        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);

        (this.EditAppForm.get("SupplierCommissionList") as FormArray).push(formGroupComm);
      }


      var addCritAgrmntId = new CriteriaObj();
      addCritAgrmntId.DataType = "numeric";
      addCritAgrmntId.propName = "AA.AGRMNT_ID";
      addCritAgrmntId.restriction = AdInsConstant.RestrictionIn;
      addCritAgrmntId.listValue = [this.agrmntId];
      this.arrAddCrit.push(addCritAgrmntId);

      for (var i = 0; i < this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs.length; i++) {
        let currentAgrmntCommissionHId = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].AgrmntCommissionHId;

        var formGroupComm = this.fb.group({
          AgrmntCommissionHId: [currentAgrmntCommissionHId],
          CommissionRecipientRefNo: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNo],
          CommissionRecipientRefNoDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc],
          TotalCommissionAmt: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].TotalCommissionAmt],
          CommissionRecipientPositionDesc: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientPositionDesc],
          SupplierName: [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].SupplierName],
          CurrentVendorBankAccId:[]
        })

        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId] = new InputLookupObj();

        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].urlJson = "./assets/uclookup/lookupSupplEmpForEditAppAftApv.json";
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].urlQryPaging = "/Generic/GetPagingObjectBySQL";
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].urlEnviPaging = environment.losUrl;
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].pagingJson = "./assets/uclookup/lookupSupplEmpForEditAppAftApv.json";
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].genericJson = "./assets/uclookup/lookupSupplEmpForEditAppAftApv.json";
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].isReady = true;

        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].nameSelect = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc;
        this.InputLookupSupplEmpObjs[currentAgrmntCommissionHId].jsonSelect = {SupplEmpName: this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNoDesc};

        var addCrit = new CriteriaObj();
        addCrit.DataType = "text";
        addCrit.propName = "AASE.SUPPL_EMP_NO";
        addCrit.restriction = AdInsConstant.RestrictionNotIn;
        addCrit.listValue = [this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].CommissionRecipientRefNo];
        this.arrAddCrit.push(addCrit);

        var vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].VendorBankAccObjs;
    
        this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

        let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankCode;
        let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankAccNo;
        let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs[i].BankAccName;

        let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
                                                    x.BankAccountName == currentBankAccountName);

        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);

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
          CurrentVendorBankAccId:[]
        });

        var vendorBankAccObj = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].VendorBankAccObjs;
    
        this.listTempVba[currentAgrmntCommissionHId] = vendorBankAccObj;

        let currentBankCode = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankCode;
        let currentBankAccountNo = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankAccNo;
        let currentBankAccountName = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs[i].BankAccName;

        let currentVba = vendorBankAccObj.find(x => x.BankCode == currentBankCode && x.BankAccountNo == currentBankAccountNo &&
                                                    x.BankAccountName == currentBankAccountName);

        formGroupComm.controls.CurrentVendorBankAccId.patchValue(currentVba.VendorBankAccId);

        (this.EditAppForm.get("SupplierReferantorCommissionList") as FormArray).push(formGroupComm);
      }
    
  }

  async setdata()
  {
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

  editAssetData(e: AppAssetObj)
  {
    this.isEditAssetData = true;
    this.isDetail = false;

    this.selectedAppAssetObj = e;

    this.selectedAppCollateralObj = this.agrmntDataForEditAppAftApv.AppCollateralObjs.filter(x => x.AppAssetId == e.AppAssetId)[0];
    this.selectedAppCollateralRegistrationObj = this.agrmntDataForEditAppAftApv.AppCollateralRegistrationObjs.filter(x => x.AppCollateralId == this.selectedAppCollateralObj.AppCollateralId)[0];

    //apply prev edited value
    let selectedExistingEditedAsset = this.listEditedAssetData.filter(x => x.AppAssetId == e.AppAssetId)[0];
    if(selectedExistingEditedAsset) 
    { 
      if (selectedExistingEditedAsset.AppCollateralRegistrationObj) {
        for (var prop in selectedExistingEditedAsset.AppCollateralRegistrationObj) {
          if(this.selectedAppCollateralRegistrationObj[prop] != undefined)
           this.selectedAppCollateralRegistrationObj[prop] = selectedExistingEditedAsset.AppCollateralRegistrationObj[prop];
        }
      }
      if(selectedExistingEditedAsset.AppAssetAttrObjs)
        this.selectedListAppAssetAttrObjs = selectedExistingEditedAsset.AppAssetAttrObjs;
    }
  }

  editPoData(e)
  {
    var EditedVendorBankAccId = 0;
    if(this.IsPOEdited){
      EditedVendorBankAccId = this.selectedPurchaseOrderHObj.VendorBankAccId;
    }
    this.selectedPurchaseOrderHObj = e;
    this.selectedPurchaseOrderHObj["EditedVendorBankAccId"]  = EditedVendorBankAccId;
    this.isEditPoData = true;
    this.isDetail = false;
  }

  getPage(e)
  {
    if(e.pageType == "submitAssetData")
    {
      this.isEditAssetData = false;
      this.isDetail = true;

      let index = this.listEditedAssetData.map(function(x) { return x.AppAssetId; }).indexOf(e.AppAssetRelatedOutput.AppAssetId);
      if (index > -1)
        this.listEditedAssetData.splice(index, 1);
      
      this.listEditedAssetData.push(e.AppAssetRelatedOutput);

      this.toastr.successMessage("Success");
    }
    else if (e.pageType == "submitPoData")
    {
      this.isEditPoData = false;
      this.isDetail = true;

      let index = this.listEditedPoData.map(function(x) { return x.PurchaseOrderHId; }).indexOf(e.PurchaseOrderHOutput.PurchaseOrderHId);
      if (index > -1)
        this.listEditedPoData.splice(index, 1);
      
      this.listEditedPoData.push(e.PurchaseOrderHOutput);
      this.selectedPurchaseOrderHObj = e.PurchaseOrderHOutput;
      this.IsPOEdited = true;
      this.toastr.successMessage("Success");

    }
    else if (e.pageType == "cancelPoData" || e.pageType == "cancelAssetData")
    {
      this.isEditPoData = false;
      this.isEditAssetData = false;
      this.isDetail = true;
      if(e.pageType == "cancelPoData") this.selectedPurchaseOrderHObj = e.PurchaseOrderHOutput;

      this.toastr.warningMessage("Cancelled");
    }
    
  }

  CommBankAccHandler(e, AgrCommH, type)
  {
    let selectedCommH;

    if (type == 'SUPPL')
      selectedCommH = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplObjs.find(x => x.AgrmntCommissionHId == AgrCommH.controls.AgrmntCommissionHId.value);
    else if (type == 'SUPPLEMP')
      selectedCommH = this.agrmntDataForEditAppAftApv.AgrmntCommissionHSupplEmpObjs.find(x => x.AgrmntCommissionHId == AgrCommH.controls.AgrmntCommissionHId.value);
    else if (type == 'REF')
      selectedCommH = this.agrmntDataForEditAppAftApv.AgrmntCommissionHReferantorObjs.find(x => x.AgrmntCommissionHId == AgrCommH.controls.AgrmntCommissionHId.value);
   
    let selectedVba = selectedCommH.VendorBankAccObjs.find(x => x.VendorBankAccId == e.target.value);

    var commVbaData = 
    {
      AgrmntCommissionHId: selectedCommH.AgrmntCommissionHId,
      BankCode: selectedVba.BankCode,
      BankBranch: selectedVba.BankBranch,
      BankAccountNo: selectedVba.BankAccountNo,
      BankAccountName: selectedVba.BankAccountName,
    };

    let index = this.listEditedCommissionData.map(function(x) { return x.AgrmntCommissionHId; }).indexOf(selectedCommH.AgrmntCommissionHId);
      if (index > -1)
        this.listEditedCommissionData.splice(index, 1);
      
      this.listEditedCommissionData.push(commVbaData);
  }

  SupplEmpHandler(e, AgrCommH, index)
  {
    let isValid = true;
    let targetSupplEmp = this.ContentObjSupplierEmp.find(x => x.Key == e.target.value);

    var SupplEmpCommList = (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray);

    for (let i = 0; i < SupplEmpCommList.length; i++) {
      var CommissionRecipientRefNo = SupplEmpCommList.at(i).get("CommissionRecipientRefNo").value;
      
      if(CommissionRecipientRefNo == targetSupplEmp.Key)
      {
        isValid = false;
        break;
      }
        
    }

    if(!isValid)
    {
      this.toastr.errorMessage(ExceptionConstant.DATA_ALREADY_EXIST);
    }
    else
    {
      let AgrmntCommissionHId = AgrCommH.controls.AgrmntCommissionHId.value;
      let indexVba = this.listTempVba.map(function(x) { return x.AgrmntCommissionHId; }).indexOf(AgrmntCommissionHId);
        if (indexVba > -1)
          this.listTempVba.splice(indexVba, 1);

      SupplEmpCommList.removeAt(index);

      let empObj : ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj = new ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj();
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
      
      let reqByVendorEmpNo : GenericObj = new GenericObj();
      reqByVendorEmpNo.EmpNo = targetSupplEmp.Key;
      this.http.post(URLConstant.GetListVendorBankAccObjByVendorEmpNo, reqByVendorEmpNo).subscribe(
        (response) => {
          var vendorBankAccObj = response[CommonConstant.ReturnObj];

          this.listTempVba[AgrmntCommissionHId] = vendorBankAccObj;

        });
    }
  }

  SetSupplEmpVbaData(e, AgrCommH, index)
  {
    var SupplEmpCommList = (this.EditAppForm.get("SupplierEmpCommissionList") as FormArray);

    var CommissionRecipientRefNo = SupplEmpCommList.at(index).get("CommissionRecipientRefNo").value;

    if (CommissionRecipientRefNo != e.SupplEmpNo)
    {
      let AgrmntCommissionHId = AgrCommH.controls.AgrmntCommissionHId.value;
        let indexVba = this.listTempVba.map(function(x) { return x.AgrmntCommissionHId; }).indexOf(AgrmntCommissionHId);
          if (indexVba > -1)
            this.listTempVba.splice(indexVba, 1);

        SupplEmpCommList.removeAt(index);

        let empObj : ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj = new ReqGetVendorEmpByVendorEmpNoAndVendorCodeObj();
        empObj.VendorEmpNo = e.SupplEmpNo,
        empObj.VendorCode = e.SupplCode
        

        this.http.post(URLConstant.GetVendorEmpByVendorEmpNoAndVendorCode, empObj).subscribe(
          (response: ResGetVendorEmpByVendorEmpNoAndVendorCodeObj) => {
            var formGroupComm = this.fb.group({
              AgrmntCommissionHId: [AgrmntCommissionHId],
              CommissionRecipientRefNoDesc: [response.VendorEmpName],
              TotalCommissionAmt: [AgrCommH.controls.TotalCommissionAmt.value],
              CommissionRecipientPositionDesc: [response.MrVendorEmpPositionCodeDesc],
              SupplierName: [response.VendorName],
              CurrentVendorBankAccId:[]
            });

            let reqByVendorEmpNo : GenericObj = new GenericObj();
            reqByVendorEmpNo.EmpNo = e.SupplEmpNo;
            this.http.post(URLConstant.GetListVendorBankAccObjByVendorEmpNo, reqByVendorEmpNo).subscribe(
              (response) => {
                var vendorBankAccObj = response[CommonConstant.ReturnObj];
      
                this.listTempVba[AgrmntCommissionHId] = vendorBankAccObj;
      
                formGroupComm.controls.CurrentVendorBankAccId.patchValue(vendorBankAccObj[0].VendorBankAccId);

                SupplEmpCommList.push(formGroupComm);
              });
            
          });

      }
  }

  CancelClick()
  {
    AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_PAGING], {BizTemplateCode : this.BizTemplateCode});
  }

  SaveForm()
  {
    var currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    if(this.listEditedAssetData.length <= 0 && this.listEditedPoData.length <= 0)
    {
      this.toastr.errorMessage(ExceptionConstant.NO_DATA_EDITED);
    }
    else
    {
      this.ApprovalCreateOutput = this.createComponent.output();

      var EditAppAftApvObj = 
      {
        AgrmntId: this.agrmntId,
        CurrentOfficeCode: currentUserContext[CommonConstant.OFFICE_CODE],
        EditedAssetDataObjs: this.listEditedAssetData,
        EditedPoDataObjs: this.listEditedPoData,
        EditedCommissionDataObjs: this.listEditedCommissionData,
        Notes: this.EditAppForm.controls.Notes.value,
        RequestRFAObj: this.ApprovalCreateOutput
      };

      this.http.post(URLConstant.SubmitEditAppAftApvReq, EditAppAftApvObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[NavigationConstant.NAP_ADD_PRCS_EDIT_APP_AFT_APV_PAGING], {BizTemplateCode : this.BizTemplateCode});
        }
      );
    }
    
  }

}
