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
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { AppCustObj } from 'app/shared/model/AppCustObj.Model';

@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html'
})

export class DocSignerDetailComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  AppId: number;
  AgrmntId: number;
  ResponseAppAssetObj: any;
  result2: any;
  ResponseAppCustObj: any;
  ResponseAgrmntSignerObj: any;
  SupplCode: string;
  OfficeCode: string;
  CustNo: string;
  inputLookupBranchEmpObj: InputLookupObj = new InputLookupObj();
  inputLookupOfficeEmp1Obj: InputLookupObj = new InputLookupObj();
  inputLookupOfficeEmp2Obj: InputLookupObj = new InputLookupObj();
  inputLookupAppCustCompanyShareHolder1Obj: InputLookupObj = new InputLookupObj();
  agrmntSignerObj: AgrmntSignerObj = new AgrmntSignerObj();
  mode: string;
  ResponseAppCustDataObj: any;
  MrCustTypeCode: string = CommonConstant.CustTypeCompany;
  CustFullName: string;
  ContactPersonName: string;
  BizTemplateCode: string;
  isHidden: boolean;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.BizTemplateCode = params['BizTemplateCode'];
    });
  }

  DocSignerForm = this.fb.group({
    MrJobPositionSupplBranchEmpName: [''],
    MrJobPositionMfEmpNo1Name: [''],
    MrJobPositionMfEmpNo2Name: [''],
    MrJobPositionMgmntShrholder1Code: ['']
  });

  async ngOnInit() {
    if (this.BizTemplateCode == CommonConstant.OPL) {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapAppOPLMainInformation.json";
      this.viewGenericObj.viewEnvironment = environment.losUrl;
    }
    else {
      this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewDocSigner.json";
      this.viewGenericObj.viewEnvironment = environment.losUrl;
      this.viewGenericObj.ddlEnvironments = [
        {
          name: "AppNo",
          environment: environment.losR3Web
        },
        {
          name: "MouCustNo",
          environment: environment.losR3Web
        },
      ];
    }
    await this.getAllData();
    this.setLookupObj();
  }

  async getAllData() {
    var obj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId
    }

    await this.http.post(URLConstant.GetAgrmntByAgrmntId, obj).toPromise().then(
      (response) => {
        this.result2 = response;
        this.OfficeCode = this.result2.OfficeCode;
        this.CustNo = this.result2.CustNo;
      });

    await this.http.post(URLConstant.GetAppCustMainDataByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppCustObj = response;
        if (this.ResponseAppCustObj.AppCustObj != undefined) {
          this.MrCustTypeCode = this.ResponseAppCustObj.AppCustObj.MrCustTypeCode;
          if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            this.http.post(URLConstant.GetAppCustPersonalDataAndSpouseByAppId, obj).toPromise().then(
              (response) => {
                this.ResponseAppCustDataObj = response;
                this.CustFullName = this.ResponseAppCustDataObj.CustFullName;
                this.ContactPersonName = this.ResponseAppCustDataObj.ContactPersonName;
              });
          }
        }
      });

    await this.http.post(URLConstant.GetAppAssetDataByAppId, obj).toPromise().then(
      (response) => {
        this.ResponseAppAssetObj = response;
        this.SupplCode = this.ResponseAppAssetObj.SupplCode;
      });

    await this.http.post(URLConstant.GetAgrmntSignerByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAgrmntSignerObj = response;
        if (this.ResponseAgrmntSignerObj.AgrmntSignerId == 0) {
          this.mode = "add";
        } else {
          this.mode = "edit";

          this.inputLookupOfficeEmp1Obj.isReady = true;
          this.inputLookupOfficeEmp2Obj.isReady = true;
          this.inputLookupAppCustCompanyShareHolder1Obj.isReady = true;

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
            MrJobPositionMgmntShrholder1Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Name,
            MrJobPositionMgmntShrholder2Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Name,
            MrJobPositionMgmntShrholder3Name: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Name,
          })
        }
      });
  }

  setLookupObj() {
    this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputLookupBranchEmpObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupBranchEmpObj.pagingJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.genericJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.addCritInput = new Array();

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

    var crit4Obj = new CriteriaObj();
    crit4Obj.propName = 'AC.APP_ID';
    crit4Obj.restriction = AdInsConstant.RestrictionEq;
    crit4Obj.value = this.AppId.toString();

    this.inputLookupAppCustCompanyShareHolder1Obj.addCritInput.push(crit4Obj);

    if (this.ResponseAgrmntSignerObj != null) {
      this.inputLookupBranchEmpObj.jsonSelect = { VendorEmpName: this.ResponseAgrmntSignerObj.SupplBranchEmpName };
      this.inputLookupOfficeEmp1Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName1 };
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
    let tempJobCode: string = "-";
    if (event.MrJobPositionCode != "" && event.MrJobPositionCode != null) tempJobCode = event.MrJobPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder1Code: tempJobCode,
    })
  }


  SaveForm() {
    this.agrmntSignerObj.AgrmntId = this.AgrmntId;

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.agrmntSignerObj.MrJobPositionMgmntShrholder1Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder1Code.value;
    } else if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.agrmntSignerObj.AppCustPersonalId = this.ResponseAppCustDataObj.AppCustPersonalId;
      this.agrmntSignerObj.AppCustSpouseId = this.ResponseAppCustDataObj.AppCustSpouseId;
    }

    if (this.mode == "edit") {
      this.http.post(URLConstant.EditAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, ["Nap/AdminProcess/DocumentSigner/Paging"], { "BizTemplateCode": this.BizTemplateCode });
        });
    } else {
      this.http.post(URLConstant.SubmitAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          AdInsHelper.RedirectUrl(this.router, ["Nap/AdminProcess/DocumentSigner/Paging"], { "BizTemplateCode": this.BizTemplateCode });
        });
    }
  }

  Callback(ev: any) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.ViewObj.ProdOfferingCode, ev.ViewObj.ProdOfferingVersion);
    }
    if (ev.Key == "agrmnt") {
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.ViewObj.AgrmntId);
    }
  }
}
