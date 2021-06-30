import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { AgrmntSignerObj } from 'app/shared/model/AgrmntSignerObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/ResponseAppCustMainDataObj.Model';
import { ResListCustMainDataObj } from 'app/shared/model/Response/NAP/CustMainData/ResListCustMainDataObj.model';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { ResAppCustPersonalAndSpouseDataObj } from 'app/shared/model/ResAppCustPersonalAndSpouseDataObj.Model';

@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html'
})

export class DocSignerDetailComponent implements OnInit {
  WfTaskListId: number = 0;
  AppId: number;
  AgrmntId: number;
  ResponseAgrmntSignerObj: AgrmntSignerObj;
  SupplCode: string;
  OfficeCode: string;
  CustNo: string;
  inputLookupBranchEmpObj: InputLookupObj = new InputLookupObj();
  inputLookupOfficeEmp1Obj: InputLookupObj = new InputLookupObj();
  inputLookupOfficeEmp2Obj: InputLookupObj = new InputLookupObj();
  inputLookupAppCustCompanyShareHolder1Obj: InputLookupObj = new InputLookupObj();
  agrmntSignerObj: AgrmntSignerObj = new AgrmntSignerObj();
  mode: string;
  ResponseAppCustDataObj: ResAppCustPersonalAndSpouseDataObj;
  MrCustTypeCode: string = CommonConstant.CustTypeCompany;
  CustFullName: string;
  ContactPersonName: string;
  BizTemplateCode: string;
  isHidden: boolean;

  readonly CanceLink: string = NavigationConstant.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.BizTemplateCode = params['BizTemplateCode'];
      if (params['WfTaskListId'] != null) {
        this.WfTaskListId = params['WfTaskListId'];
      }
    });
  }

  DocSignerForm = this.fb.group({
    MrJobPositionSupplBranchEmpName: [''],
    MrJobPositionMfEmpNo1Name: [''],
    MrJobPositionMfEmpNo2Name: [''],
    MrJobPositionMgmntShrholder1Code: [''],
    MrJobPositionMgmntShrholder1Name: [''],
  });

  async ngOnInit() : Promise<void> {
    if (this.WfTaskListId != 0) {
      this.ClaimTask();
    }
    await this.getAllData();
    this.setLookupObj();
    await this.setDefaultShareholder();
  }

  ClaimTask() {
    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var wfClaimObj = new ClaimWorkflowObj();
    wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
    wfClaimObj.pUserID = currentUserContext[CommonConstant.USER_NAME];

    this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
      () => {
      });
  }

  async getAllData() {
    var agrmntObj = {
      Id: this.AgrmntId
    }

    var appObj = {
      Id: this.AppId
    }

    await this.GetCustMainData();

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, agrmntObj).toPromise().then(
      (response: AgrmntObj) => {
        this.OfficeCode = response.OfficeCode;
        this.CustNo = response.CustNo;
      });

    await this.http.post(URLConstant.GetAppAssetDataByAppId, appObj).toPromise().then(
      (response: AppAssetObj) => {
        this.SupplCode = response.SupplCode;
      });

    if (this.BizTemplateCode == CommonConstant.DF)
    {
      await this.http.post(URLConstant.GetAppDlrFinByAppId, {Id: this.AppId}).toPromise().then(
        (response) => {
          this.SupplCode = response["DealerCode"];
        });
    }  

    await this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, agrmntObj).toPromise().then(
      (response: AgrmntSignerObj) => {
        this.ResponseAgrmntSignerObj = response;
        if (this.ResponseAgrmntSignerObj.AgrmntSignerId == 0) {
          this.mode = "add";
        } else {
          this.mode = "edit";

          this.inputLookupOfficeEmp1Obj.isReady = true;
          this.inputLookupOfficeEmp2Obj.isReady = true;
          // this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;

          this.agrmntSignerObj.AgrmntSignerId = this.ResponseAgrmntSignerObj.AgrmntSignerId;
          this.agrmntSignerObj.SupplBranchEmpNo = this.ResponseAgrmntSignerObj.SupplBranchEmpNo;
          this.agrmntSignerObj.SupplBranchEmpName = this.ResponseAgrmntSignerObj.SupplBranchEmpName;
          this.agrmntSignerObj.MfEmpNo1 = this.ResponseAgrmntSignerObj.MfEmpNo1;
          this.agrmntSignerObj.MfEmpName1 = this.ResponseAgrmntSignerObj.MfEmpName1;
          this.agrmntSignerObj.MfEmpNo2 = this.ResponseAgrmntSignerObj.MfEmpNo2;
          this.agrmntSignerObj.MfEmpName2 = this.ResponseAgrmntSignerObj.MfEmpName2;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder1Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Id;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder2Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder2Id;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder3Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder3Id;
          this.agrmntSignerObj.MrJobPositionSupplBranchEmpCode = this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpCode;
          this.agrmntSignerObj.MrJobPositionMfEmpNo1Code = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Code;
          this.agrmntSignerObj.MrJobPositionMfEmpNo2Code = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Code;
          this.agrmntSignerObj.RowVersion = this.ResponseAgrmntSignerObj.RowVersion;
          this.agrmntSignerObj.MrJobPositionSupplBranchEmpName = this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpName;
          this.agrmntSignerObj.MrJobPositionMfEmpNo1Name = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name;
          this.agrmntSignerObj.MrJobPositionMfEmpNo2Name = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Name;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder1Code = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Code;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder2Code = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Code;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder3Code = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Code;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder1Name = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Name;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder2Name = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Name;
          this.agrmntSignerObj.MrJobPositionMgmntShrholder3Name = this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Name;

          this.DocSignerForm.patchValue({
            MrJobPositionSupplBranchEmpName: this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpName,
            MrJobPositionMfEmpNo1Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name,
            MrJobPositionMfEmpNo2Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Name,
            MrJobPositionMgmntShrholder1Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Name,
            MrJobPositionMgmntShrholder2Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Name,
            MrJobPositionMgmntShrholder3Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Name,
          })
        }
      });
  }

  async GetCustMainData() {
    let reqObj: GenericObj = new GenericObj();
    reqObj.Id = this.AppId;
    await this.http.post<ResponseAppCustMainDataObj>(URLConstant.GetAppCustMainDataByAppId, reqObj).toPromise().then(
      async (response) => {
        if (response["AppCustObj"] != undefined) {
          this.MrCustTypeCode = response.AppCustObj.MrCustTypeCode;
          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            var appObj = {
              Id: this.AppId
            }
            await this.http.post(URLConstant.GetAppCustPersonalDataAndSpouseByAppId, appObj).toPromise().then(
              (response: ResAppCustPersonalAndSpouseDataObj) => {
                this.ResponseAppCustDataObj = response;
                this.CustFullName = this.ResponseAppCustDataObj.CustFullName;
                this.ContactPersonName = this.ResponseAppCustDataObj.ContactPersonName;
              });
          }
        }
      });
  }
  
  async setDefaultShareholder() {
    if (this.mode = "edit") return;
    this.inputLookupAppCustCompanyShareHolder1Obj.isReady = false;
    await this.http.post(URLConstant.GetListAppCustMainDataByAppId, { AppId: this.AppId, IsShareholder: true }).toPromise().then(
      (response : ResListCustMainDataObj) => {
        if (response.ListAppCustObj.length > 0) {
          this.inputLookupAppCustCompanyShareHolder1Obj.jsonSelect = { MgmntShrholderName: response.ListAppCustObj[0].CustName };
          this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;
          this.DocSignerForm.patchValue({
            MrJobPositionMgmntShrholder1Code: response.ListAppCustObj[0].MrJobPositionCode,
            MrJobPositionMgmntShrholder1Name: response.ListAppCustObj[0].MrJobPositionCodeDesc,
          })
        }
      });
  }

  setLookupObj() {
    this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupBranchEmpObj.pagingJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.genericJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.addCritInput = new Array();

    if(this.BizTemplateCode == CommonConstant.DF){
      this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
    }
    else{
      this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    }

    var crit1Obj = new CriteriaObj();
    crit1Obj.propName = 'V.VENDOR_CODE';
    crit1Obj.restriction = AdInsConstant.RestrictionEq;
    crit1Obj.value = this.SupplCode;
    this.inputLookupBranchEmpObj.addCritInput.push(crit1Obj);

    var crit2Obj = new CriteriaObj();
    crit2Obj.propName = 'RM.REF_MASTER_TYPE_CODE';
    crit2Obj.restriction = AdInsConstant.RestrictionEq;
    crit2Obj.value = 'VENDOR_POSITION';
    this.inputLookupBranchEmpObj.addCritInput.push(crit2Obj);

    this.inputLookupOfficeEmp1Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp1Obj.pagingJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.genericJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.addCritInput = new Array();

    this.inputLookupOfficeEmp2Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp2Obj.pagingJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.genericJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.isRequired = false;
    this.inputLookupOfficeEmp2Obj.addCritInput = new Array();

    var crit3Obj = new CriteriaObj();
    crit3Obj.propName = 'RO.OFFICE_CODE';
    crit3Obj.restriction = AdInsConstant.RestrictionEq;
    crit3Obj.value = this.OfficeCode;

    this.inputLookupOfficeEmp1Obj.addCritInput.push(crit3Obj);
    this.inputLookupOfficeEmp2Obj.addCritInput.push(crit3Obj);

    this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.urlEnviPaging = environment.losUrl;
    this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput = new Array();

    var crit4Obj = new CriteriaObj();
    crit4Obj.propName = 'AC.APP_ID';
    crit4Obj.restriction = AdInsConstant.RestrictionEq;
    crit4Obj.value = this.AppId.toString();

    var custCompanyCrit2: CriteriaObj = new CriteriaObj();
    custCompanyCrit2.DataType = "text";
    custCompanyCrit2.propName = "AC.MR_CUST_TYPE_CODE";
    custCompanyCrit2.restriction = AdInsConstant.RestrictionEq;
    custCompanyCrit2.value = CommonConstant.CustTypePersonal;

    this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput.push(crit4Obj);
    this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput.push(custCompanyCrit2);

    if (this.ResponseAgrmntSignerObj != null) {
      this.inputLookupBranchEmpObj.jsonSelect = { VendorEmpName: this.ResponseAgrmntSignerObj.SupplBranchEmpName };
      this.inputLookupOfficeEmp1Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName1 };
      this.DocSignerForm.patchValue({
        MrJobPositionMfEmpNo1Name : this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name
      });
      this.inputLookupOfficeEmp2Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName2 };
      this.inputLookupAppCustCompanyShareHolder1Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Name };
    }

    if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.FCTR) {
      this.inputLookupBranchEmpObj.isRequired = false;
      this.isHidden = true;
    }

    this.inputLookupBranchEmpObj.isReady = true;
    this.inputLookupOfficeEmp1Obj.isReady = true;
    this.inputLookupOfficeEmp2Obj.isReady = true;
    this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;
  }

  getLookupBranchEmp(event) {
    this.agrmntSignerObj.SupplBranchEmpNo = event.VendorEmpNo;
    this.agrmntSignerObj.SupplBranchEmpName = event.VendorEmpName;
    this.agrmntSignerObj.MrJobPositionSupplBranchEmpCode = event.MrVendorEmpPositionCode;
    this.agrmntSignerObj.MrJobPositionSupplBranchEmpName = event.JobTitleName;
    this.DocSignerForm.patchValue({
      MrJobPositionSupplBranchEmpName: event.JobTitleName
    })
  }

  getLookupOfficeEmp1(event) {
    this.agrmntSignerObj.MfEmpNo1 = event.OfficeEmpNo;
    this.agrmntSignerObj.MfEmpName1 = event.OfficeEmpName;
    this.agrmntSignerObj.MrJobPositionMfEmpNo1Code = event.JobTitleCode;
    this.agrmntSignerObj.MrJobPositionMfEmpNo1Name = event.JobTitleName;
    this.DocSignerForm.patchValue({
      MrJobPositionMfEmpNo1Name: event.JobTitleName
    })
  }

  getLookupOfficeEmp2(event) {
    this.agrmntSignerObj.MfEmpNo2 = event.OfficeEmpNo;
    this.agrmntSignerObj.MfEmpName2 = event.OfficeEmpName;
    this.agrmntSignerObj.MrJobPositionMfEmpNo2Code = event.JobTitleCode;
    this.agrmntSignerObj.MrJobPositionMfEmpNo2Name = event.JobTitleName;
    this.DocSignerForm.patchValue({
      MrJobPositionMfEmpNo2Name: event.JobTitleName
    })
  }

  getLookupAppCustCompanyShareHolder1(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder1Id = event.AppCustCompanyMgmntShrholderId;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder1Code = event.MrJobPositionCode;
    let tempJobName: string = "-";
    if(event.MrJobPositionCodeDesc != "" && event.MrJobPositionCodeDesc != null) tempJobName = event.MrJobPositionCodeDesc;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder1Name = tempJobName;
    let tempJobCode: string = "-";
    if (event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder1Code: tempJobCode,
      MrJobPositionMgmntShrholder1Name: event.MrJobPositionCodeDesc,
    })
  }


  SaveForm() {
    this.agrmntSignerObj.AgrmntId = this.AgrmntId;
    this.agrmntSignerObj.WfTaskListId = this.WfTaskListId;

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.agrmntSignerObj.AppCustPersonalId = this.ResponseAppCustDataObj.AppCustPersonalId;
      this.agrmntSignerObj.AppCustSpouseId = this.ResponseAppCustDataObj.AppCustSpouseId;
    }

    if (this.mode == "edit") {
      this.http.post(URLConstant.EditAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [this.CanceLink], { "BizTemplateCode": this.BizTemplateCode });
        });
    } else {
      this.http.post(URLConstant.SubmitAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, [this.CanceLink], { "BizTemplateCode": this.BizTemplateCode });
        });
    }
  }
}
