import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { ClaimTaskService } from 'app/shared/claimTask.service';
import { AgrmntObj } from 'app/shared/model/Agrmnt/Agrmnt.Model';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { NavigationConstantDsf } from 'app/shared/constant/NavigationConstantDsf';
import { CommonConstantDsf } from 'app/dsf/shared/constant/CommonConstantDsf';
import { AgrmntSignerObj } from 'app/shared/model/agrmnt-signer-obj.model';
import { AppAssetObj } from 'app/shared/model/app-asset-obj.model';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { ResAppCustPersonalAndSpouseDataObj } from 'app/shared/model/res-app-cust-personal-and-spouse-data-obj.model';
import { ResponseAppCustMainDataObj } from 'app/shared/model/response-app-cust-main-data-obj.model';
import { ResListCustMainDataObj } from 'app/shared/model/response/nap/cust-main-data/res-list-cust-main-data-obj.model';

@Component({
  selector: 'app-doc-signer-detail-dsf',
  templateUrl: './doc-signer-detail-dsf.component.html',
  styleUrls: ['./doc-signer-detail-dsf.component.css']
})
export class DocSignerDetailDsfComponent implements OnInit {
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
  inputLookupAppCustCompanyShareHolder2Obj: InputLookupObj = new InputLookupObj();
  inputLookupAppCustCompanyShareHolder3Obj: InputLookupObj = new InputLookupObj();
  agrmntSignerObj: AgrmntSignerObj = new AgrmntSignerObj();
  mode: string;
  ResponseAppCustDataObj: ResAppCustPersonalAndSpouseDataObj;
  MrCustTypeCode: string = CommonConstant.CustTypeCompany;
  CustFullName: string;
  ContactPersonName: string;
  BizTemplateCode: string;
  isHidden: boolean;
  signerRoleCode: any;
  roleCode: any;
  roleCodeList: Array<string> = new Array();
  officeCodeList: Array<string> = new Array();

  readonly CanceLink: string = NavigationConstantDsf.NAP_ADM_PRCS_NAP_DOC_SIGNER_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService,
    private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
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
    MrJobPositionMgmntShrholder2Code: [''],
    MrJobPositionMgmntShrholder2Name: [''],
    MrJobPositionMgmntShrholder3Code: [''],
    MrJobPositionMgmntShrholder3Name: [''],
  });

  async ngOnInit() : Promise<void> {
    if (this.WfTaskListId != 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
    await this.getAllData();
    this.setLookupObj();
    await this.setDefaultShareholder();
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

    await this.http.post(URLConstantDsf.GetSignerRoleCode, {Id : this.AgrmntId}).toPromise().then(
      (response) => {
        this.signerRoleCode = response['ResponseSignerRoleCodeDsf']
        if (this.signerRoleCode != null)
        {
          for (let i = 0; i < this.signerRoleCode.length; i++)
          {
            this.roleCodeList.push((this.signerRoleCode[i].SignerRoleCode).slice(0,2))
          }
        }
      }
    );

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
            MrJobPositionMgmntShrholder1Name: response.ListAppCustObj[0].MrJobPositionCodeDesc
          })
        }
      });
  }

  setLookupObj() {
    this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupBranchEmpObj.pagingJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.genericJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.addCritInput = new Array();

    if(this.BizTemplateCode == CommonConstant.DF){
      this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSignerDF.json";
    }
    else{
      this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder2Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
      this.inputLookupAppCustCompanyShareHolder3Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
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

    this.inputLookupOfficeEmp1Obj.urlJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp1Obj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupOfficeEmp1Obj.pagingJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp1Obj.genericJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp1Obj.addCritInput = new Array();

    this.inputLookupOfficeEmp2Obj.urlJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp2Obj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupOfficeEmp2Obj.pagingJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp2Obj.genericJson = "./assets/dsf/uclookup/lookupOfficeEmpDsf.json";
    this.inputLookupOfficeEmp2Obj.isRequired = false;
    this.inputLookupOfficeEmp2Obj.addCritInput = new Array();

    this.officeCodeList.push(this.OfficeCode);
    this.officeCodeList.push(CommonConstant.HeadOffice);

    var critSignerRoleObj = new CriteriaObj();
    critSignerRoleObj.propName = 'RJT.JOB_TITLE_CODE';
    critSignerRoleObj.restriction = AdInsConstant.RestrictionIn;
    critSignerRoleObj.listValue = this.roleCodeList;

    this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
    this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);

    var crit3Obj = new CriteriaObj();
    crit3Obj.propName = 'RO.OFFICE_CODE';
    crit3Obj.restriction = AdInsConstant.RestrictionEq;
    crit3Obj.value = this.OfficeCode;

    this.inputLookupOfficeEmp1Obj.addCritInput.push(crit3Obj);
    this.inputLookupOfficeEmp2Obj.addCritInput.push(crit3Obj);


    var count = this.roleCodeList.length;
    for (var i = 0; i < count; i++)
    {
      if (this.roleCodeList[i].toString() == CommonConstantDsf.JOB_TITLE_CODE_DIR)
      {
        var critSignerRoleObj = new CriteriaObj();
        critSignerRoleObj.propName = 'RJT.JOB_TITLE_CODE';
        critSignerRoleObj.restriction = AdInsConstant.RestrictionOr;
        critSignerRoleObj.value = CommonConstantDsf.JOB_TITLE_CODE_DIR;

        this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
        this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
      }
      else if (this.roleCodeList[i].toString() == CommonConstantDsf.JOB_TITLE_CODE_EGM)
      {
        var critSignerRoleObj = new CriteriaObj();
        critSignerRoleObj.propName = 'RJT.JOB_TITLE_CODE';
        critSignerRoleObj.restriction = AdInsConstant.RestrictionOr;
        critSignerRoleObj.value = CommonConstantDsf.JOB_TITLE_CODE_EGM;

        this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
        this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
      }
      else if (this.roleCodeList[i].toString() == CommonConstantDsf.JOB_TITLE_CODE_PD)
      {
        var critSignerRoleObj = new CriteriaObj();
        critSignerRoleObj.propName = 'RJT.JOB_TITLE_CODE';
        critSignerRoleObj.restriction = AdInsConstant.RestrictionOr;
        critSignerRoleObj.value = CommonConstantDsf.JOB_TITLE_CODE_PD;

        this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
        this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
      }
      else if (this.roleCodeList[i].toString() == CommonConstantDsf.JOB_TITLE_CODE_VP)
      {
        var critSignerRoleObj = new CriteriaObj();
        critSignerRoleObj.propName = 'RJT.JOB_TITLE_CODE';
        critSignerRoleObj.restriction = AdInsConstant.RestrictionOr;
        critSignerRoleObj.value = CommonConstantDsf.JOB_TITLE_CODE_VP;

        this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
        this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
      }
    }
    // var critSignerRoleDIRObj = new CriteriaObj();
    // critSignerRoleDIRObj.propName = 'RR.ROLE_CODE';
    // critSignerRoleDIRObj.restriction = AdInsConstant.RestrictionOr;
    // critSignerRoleDIRObj.value = CommonConstantDsf.Director;

    // this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleDIRObj);
    // this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleDIRObj);


        // if (this.signerRoleCode != null)
        // {
        //     this.roleCode = this.signerRoleCode[0].SignerRoleCode;
        //     var critSignerRoleObj = new CriteriaObj();
        //     critSignerRoleObj.propName = 'RR.ROLE_CODE';
        //     critSignerRoleObj.restriction = AdInsConstant.RestrictionEq;
        //     critSignerRoleObj.value = this.roleCode;

        //     this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
        //     this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
          // for (let i = 1; i < this.signerRoleCode.length; i++)
          // {
          //   this.roleCode = this.signerRoleCode[i].SignerRoleCode;
          //   var critSignerRoleObj = new CriteriaObj();
          //   critSignerRoleObj.propName = 'RR.ROLE_CODE';
          //   critSignerRoleObj.restriction = AdInsConstant.RestrictionOr;
          //   critSignerRoleObj.value = this.roleCode;

          //   this.inputLookupOfficeEmp1Obj.addCritInput.push(critSignerRoleObj);
          //   this.inputLookupOfficeEmp2Obj.addCritInput.push(critSignerRoleObj);
          // }
        // }

    this.inputLookupAppCustCompanyShareHolder1Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.urlEnviPaging = environment.losUrl + "/v1";
    this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput = new Array();
    this.inputLookupAppCustCompanyShareHolder2Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder2Obj.urlEnviPaging = environment.losUrl + "/v1";
    this.inputLookupAppCustCompanyShareHolder2Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder2Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder2Obj.isRequired = false;
    this.inputLookupAppCustCompanyShareHolder2Obj.addCritInput = new Array();
    this.inputLookupAppCustCompanyShareHolder3Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder3Obj.urlEnviPaging = environment.losUrl + "/v1";
    this.inputLookupAppCustCompanyShareHolder3Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder3Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
    this.inputLookupAppCustCompanyShareHolder3Obj.isRequired = false;
    this.inputLookupAppCustCompanyShareHolder3Obj.addCritInput = new Array();

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
    this.inputLookupAppCustCompanyShareHolder2Obj.addCritInput.push(crit4Obj);
    this.inputLookupAppCustCompanyShareHolder2Obj.addCritInput.push(custCompanyCrit2);
    this.inputLookupAppCustCompanyShareHolder3Obj.addCritInput.push(crit4Obj);
    this.inputLookupAppCustCompanyShareHolder3Obj.addCritInput.push(custCompanyCrit2);

    if (this.ResponseAgrmntSignerObj != null) {
      this.inputLookupBranchEmpObj.jsonSelect = { VendorEmpName: this.ResponseAgrmntSignerObj.SupplBranchEmpName };
      this.inputLookupOfficeEmp1Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName1 };
      this.DocSignerForm.patchValue({
        MrJobPositionMfEmpNo1Name : this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name
      });
      this.inputLookupOfficeEmp2Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName2 };
      this.inputLookupAppCustCompanyShareHolder1Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Name };
      this.inputLookupAppCustCompanyShareHolder2Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder2Name };
      this.inputLookupAppCustCompanyShareHolder3Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder3Name };
    }

    if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.FCTR || this.BizTemplateCode == CommonConstant.DF) {
      this.inputLookupBranchEmpObj.isRequired = false;
      this.isHidden = true;
    }

    this.inputLookupBranchEmpObj.isReady = true;
    this.inputLookupOfficeEmp1Obj.isReady = true;
    this.inputLookupOfficeEmp2Obj.isReady = true;
    this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;
    this.inputLookupAppCustCompanyShareHolder2Obj.isReady = true;
    this.inputLookupAppCustCompanyShareHolder3Obj.isReady = true;
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

  getLookupAppCustCompanyShareHolder2(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder2Id = event.AppCustCompanyMgmntShrholderId;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder2Code = event.MrJobPositionCode;
    let tempJobName: string = "-";
    if(event.MrJobPositionCodeDesc != "" && event.MrJobPositionCodeDesc != null) tempJobName = event.MrJobPositionCodeDesc;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder2Name = tempJobName;
    let tempJobCode: string = "-";
    if (event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder2Code: tempJobCode,
      MrJobPositionMgmntShrholder2Name: event.MrJobPositionCodeDesc,
    })
  }

  getLookupAppCustCompanyShareHolder3(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder3Id = event.AppCustCompanyMgmntShrholderId;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder3Code = event.MrJobPositionCode;
    let tempJobName: string = "-";
    if(event.MrJobPositionCodeDesc != "" && event.MrJobPositionCodeDesc != null) tempJobName = event.MrJobPositionCodeDesc;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder3Name = tempJobName;
    let tempJobCode: string = "-";
    if (event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder3Code: tempJobCode,
      MrJobPositionMgmntShrholder3Name: event.MrJobPositionCodeDesc,
    })
  }


  SaveForm() {
    this.agrmntSignerObj.AgrmntId = this.AgrmntId;
    this.agrmntSignerObj.WfTaskListId = this.WfTaskListId;

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.agrmntSignerObj.AppCustPersonalId = this.ResponseAppCustDataObj.AppCustPersonalId;
      this.agrmntSignerObj.AppCustSpouseId = this.ResponseAppCustDataObj.AppCustSpouseId;
    }

    let urlPost = environment.isCore ? URLConstant.SubmitAgrmntSignerDataV2 : URLConstant.SubmitAgrmntSignerData;

    if (this.mode == "edit") {
      urlPost = environment.isCore ? URLConstant.EditAgrmntSignerDataV2 : URLConstant.EditAgrmntSignerData;
    }

    this.http.post(urlPost, this.agrmntSignerObj).subscribe(
      response => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [this.CanceLink], { "BizTemplateCode": this.BizTemplateCode });
      });
  }
}
