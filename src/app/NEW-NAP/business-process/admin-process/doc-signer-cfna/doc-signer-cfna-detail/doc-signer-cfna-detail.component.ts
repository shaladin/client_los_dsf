import { Component, OnInit } from '@angular/core';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AgrmntSignerObj } from 'app/shared/model/AgrmntSignerObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';

@Component({
  selector: 'app-doc-signer-cfna-detail',
  templateUrl: './doc-signer-cfna-detail.component.html',
  styles: []
})
export class DocSignerCfnaDetailComponent implements OnInit {
  AppId: number;
  AgrmntId: number;
  ResponseAppAssetObj: any;
  result2: any;
  ResponseAgrmntSignerObj: any;
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
  ResponseAppCustDataObj: any;
  MrCustTypeCode: string = CommonConstant.CustTypeCompany;
  CustFullName: string;
  ContactPersonName: string;
  BizTemplateCode: string;
  isHidden: boolean;
  isSupplierExists: boolean;

  readonly CancelLink: string = NavigationConstant.NAP_ADM_PRCS_NAP_CFNA_DOC_SIGNER_PAGING;
  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.BizTemplateCode = params['BizTemplateCode'];
    });
    this.isSupplierExists = false;
  }

  DocSignerForm = this.fb.group({
    MrJobPositionSupplBranchEmpName: [''],
    MrJobPositionMfEmpNo1Name: [''],
    MrJobPositionMfEmpNo2Name: [''],
    MrJobPositionMgmntShrholder1Code: [''],
    MrJobPositionMgmntShrholder2Code: [''],
    MrJobPositionMgmntShrholder3Code: ['']
  });

  async ngOnInit() {
    await this.getAllData();
    this.setLookupObj();
  }

  async getAllData() {
    var obj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId
    }

    await this.http.post(URLConstant.GetAppCustPersonalDataAndSpouseByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppCustDataObj = response;
        this.MrCustTypeCode = this.ResponseAppCustDataObj.MrCustTypeCode;
        this.CustFullName = this.ResponseAppCustDataObj.CustFullName;
        this.ContactPersonName = this.ResponseAppCustDataObj.ContactPersonName;
      });

    await this.http.post(URLConstant.GetAppAssetDataByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppAssetObj = response;
        this.SupplCode = this.ResponseAppAssetObj.SupplCode;
      });

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, obj).toPromise().then(
      (response) => {
        this.result2 = response;
        this.OfficeCode = this.result2.OfficeCode;
        this.CustNo = this.result2.CustNo;
      });

    await this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAgrmntSignerObj = response;
        if (this.ResponseAgrmntSignerObj.AgrmntSignerId == 0) {
          this.mode = "add";
        } else {
          this.mode = "edit";

          // this.inputLookupOfficeEmp1Obj.isReady = true;
          // this.inputLookupOfficeEmp2Obj.isReady = true;
          // this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;
          // this.inputLookupAppCustCompanyShareHolder3Obj.isReady = true;
          // this.inputLookupAppCustCompanyShareHolder2Obj.isReady = true;

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

          this.DocSignerForm.patchValue({
            MrJobPositionSupplBranchEmpName: this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpName,
            MrJobPositionMfEmpNo1Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name,
            MrJobPositionMfEmpNo2Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Name,
            MrJobPositionMgmntShrholder1Code: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Code,
            MrJobPositionMgmntShrholder2Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Name,
            MrJobPositionMgmntShrholder3Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Name,
          })
        }
      });
  }

  async setLookupObj() {
    await this.http.post(URLConstant.GetListAppLoanPurposeByAppId, { AppId: this.AppId }).toPromise().then(
      (response) => {
        this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/lookupBranchEmp.json";
        this.inputLookupBranchEmpObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.inputLookupBranchEmpObj.urlEnviPaging = environment.FoundationR3Url;
        this.inputLookupBranchEmpObj.pagingJson = "./assets/uclookup/lookupBranchEmp.json";
        this.inputLookupBranchEmpObj.genericJson = "./assets/uclookup/lookupBranchEmp.json";
        this.inputLookupBranchEmpObj.addCritInput = new Array();
    
        // var crit1Obj = new CriteriaObj();
        // crit1Obj.propName = 'V.VENDOR_CODE';
        // crit1Obj.restriction = AdInsConstant.RestrictionEq;
        // crit1Obj.value = this.SupplCode;
        // this.inputLookupBranchEmpObj.addCritInput.push(crit1Obj);
        if(response["listResponseAppLoanPurpose"] && response["listResponseAppLoanPurpose"].length > 0){
          var arrValue = new Array<string>();
          var hasNotDisburseToCust = false;
          for (const item of response["listResponseAppLoanPurpose"]) {
            if(!item["IsDisburseToCust"]){
              hasNotDisburseToCust = true;
              arrValue.push(item["SupplCode"]);
            }
          }
          var crit1Obj = new CriteriaObj();
          crit1Obj.propName = 'V.VENDOR_CODE';
          crit1Obj.restriction = AdInsConstant.RestrictionIn;
          crit1Obj.listValue = arrValue;
          this.inputLookupBranchEmpObj.addCritInput.push(crit1Obj);
          if(hasNotDisburseToCust){
            this.isSupplierExists = true;
          }
        }
    
        var crit2Obj = new CriteriaObj();
        crit2Obj.propName = 'RM.REF_MASTER_TYPE_CODE';
        crit2Obj.restriction = AdInsConstant.RestrictionEq;
        crit2Obj.value = 'VENDOR_POSITION';
        this.inputLookupBranchEmpObj.addCritInput.push(crit2Obj);
    
        this.inputLookupOfficeEmp1Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
        this.inputLookupOfficeEmp1Obj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.inputLookupOfficeEmp1Obj.urlEnviPaging = environment.FoundationR3Url;
        this.inputLookupOfficeEmp1Obj.pagingJson = "./assets/uclookup/lookupOfficeEmp.json";
        this.inputLookupOfficeEmp1Obj.genericJson = "./assets/uclookup/lookupOfficeEmp.json";
        this.inputLookupOfficeEmp1Obj.addCritInput = new Array();
    
        this.inputLookupOfficeEmp2Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
        this.inputLookupOfficeEmp2Obj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
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
        this.inputLookupAppCustCompanyShareHolder1Obj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.inputLookupAppCustCompanyShareHolder1Obj.urlEnviPaging = environment.losUrl;
        this.inputLookupAppCustCompanyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder1Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput = new Array();
    
        this.inputLookupAppCustCompanyShareHolder2Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder2Obj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.inputLookupAppCustCompanyShareHolder2Obj.urlEnviPaging = environment.losUrl;
        this.inputLookupAppCustCompanyShareHolder2Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder2Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder2Obj.title = "Approver Signer";
        this.inputLookupAppCustCompanyShareHolder2Obj.addCritInput = new Array();
    
        this.inputLookupAppCustCompanyShareHolder3Obj.urlJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder3Obj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
        this.inputLookupAppCustCompanyShareHolder3Obj.urlEnviPaging = environment.losUrl;
        this.inputLookupAppCustCompanyShareHolder3Obj.pagingJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder3Obj.genericJson = "./assets/uclookup/lookupAppCustCompanyShareholderForSigner.json";
        this.inputLookupAppCustCompanyShareHolder3Obj.title = "Approver Signer";
        this.inputLookupAppCustCompanyShareHolder3Obj.isRequired = false;
        this.inputLookupAppCustCompanyShareHolder3Obj.addCritInput = new Array();
        var crit4Obj = new CriteriaObj();
        crit4Obj.propName = 'AC.APP_ID';
        crit4Obj.restriction = AdInsConstant.RestrictionEq;
        crit4Obj.value = this.AppId.toString();
    
        this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput.push(crit4Obj);
        this.inputLookupAppCustCompanyShareHolder2Obj.addCritInput.push(crit4Obj);
        this.inputLookupAppCustCompanyShareHolder3Obj.addCritInput.push(crit4Obj);
    
        if (this.ResponseAgrmntSignerObj != null) {
          this.inputLookupBranchEmpObj.jsonSelect = { VendorEmpName: this.ResponseAgrmntSignerObj.SupplBranchEmpName };
          this.inputLookupOfficeEmp1Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName1 };
          this.inputLookupOfficeEmp2Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName2 };
          this.inputLookupAppCustCompanyShareHolder1Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Name };
          this.inputLookupAppCustCompanyShareHolder1Obj.nameSelect = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Name;
          this.inputLookupAppCustCompanyShareHolder2Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder2Name };
          this.inputLookupAppCustCompanyShareHolder3Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder3Name };
        }
    
        if (this.BizTemplateCode == CommonConstant.CFRFN4W || this.BizTemplateCode == CommonConstant.FCTR) {
          this.inputLookupBranchEmpObj.isRequired = false;
          this.isHidden = true;
        }
    
        this.inputLookupBranchEmpObj.isReady = true;
        this.inputLookupOfficeEmp1Obj.isReady = true;
        this.inputLookupOfficeEmp2Obj.isReady = true;
        this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;
        this.inputLookupAppCustCompanyShareHolder3Obj.isReady = true;
        this.inputLookupAppCustCompanyShareHolder2Obj.isReady = true;
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
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
    let tempJobCode: string = "-";
    if(event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder1Code: tempJobCode,
    })
  }

  getLookupAppCustCompanyShareHolder2(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder2Id = event.AppCustCompanyMgmntShrholderId;
    let tempJobCode: string = "-";
    if(event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder2Code: tempJobCode,
    })
  }

  getLookupAppCustCompanyShareHolder3(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder3Id = event.AppCustCompanyMgmntShrholderId;
    let tempJobCode: string = "-";
    if(event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder3Code: tempJobCode,
    })
  }

  SaveForm() {
    this.agrmntSignerObj.AgrmntId = this.AgrmntId;

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.agrmntSignerObj.MrJobPositionMgmntShrholder1Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder1Code.value;
      this.agrmntSignerObj.MrJobPositionMgmntShrholder2Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder2Code.value;
      this.agrmntSignerObj.MrJobPositionMgmntShrholder3Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder3Code.value;
    } else if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.agrmntSignerObj.AppCustPersonalId = this.ResponseAppCustDataObj.AppCustPersonalId;
      this.agrmntSignerObj.AppCustSpouseId = this.ResponseAppCustDataObj.AppCustSpouseId;
    }

    if (this.mode == "edit") {
      this.http.post(URLConstant.EditAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "BizTemplateCode": this.BizTemplateCode });
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.http.post(URLConstant.SubmitAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router,[this.CancelLink], { "BizTemplateCode": this.BizTemplateCode });
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
