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

@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html',
  styleUrls: ['./doc-signer-detail.component.scss']
})

export class DocSignerDetailComponent implements OnInit {
  viewObj: string;
  AppId: number;
  AgrmntId: number;
  AppAssetObj: any;
  result2: any;
  ResponseAgrmntSignerObj: any;
  SupplCode: string;
  OfficeCode: string;
  CustNo: string;
  inputLookupBranchEmpObj: any;
  inputLookupOfficeEmp1Obj: any;
  inputLookupOfficeEmp2Obj: any;
  inputLookupCustCoyShareHolder1Obj: any;
  inputLookupCustCoyShareHolder2Obj: any;
  inputLookupCustCoyShareHolder3Obj: any;
  arrCrit: any = new Array();
  agrmntSignerObj: AgrmntSignerObj = new AgrmntSignerObj();
  mode: string;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
    });
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
    console.log("test");
    this.viewObj = "./assets/ucviewgeneric/viewDocSigner.json";

    await this.getAllData();
    this.setLookupObj();
  }

  async getAllData() {
    var obj = {
      AppId: this.AppId,
      AgrmntId: this.AgrmntId
    }

    await this.http.post(AdInsConstant.GetAppAssetDataByAppId, obj).toPromise().then(
      (response) => {
        this.AppAssetObj = response;
        this.SupplCode = this.AppAssetObj.SupplCode;
      });

    await this.http.post(AdInsConstant.GetAgrmntByAgrmntId, obj).toPromise().then(
      (response) => {
        this.result2 = response;
        this.OfficeCode = this.result2.OfficeCode;
        this.CustNo = this.result2.CustNo;
      });

    await this.http.post(AdInsConstant.GetAgrmntSignerByAgrmntId, obj).toPromise().then(
      (response) => {
        this.ResponseAgrmntSignerObj = response;
        if (this.ResponseAgrmntSignerObj == null) {
          this.mode = "add";
        } else {
          this.mode = "edit";

          this.agrmntSignerObj.AgrmntSignerId = this.ResponseAgrmntSignerObj.AgrmntSignerId;
          this.agrmntSignerObj.SupplBranchEmpNo = this.ResponseAgrmntSignerObj.SupplBranchEmpNo;
          this.agrmntSignerObj.MfEmpNo1 = this.ResponseAgrmntSignerObj.MfEmpNo1;
          this.agrmntSignerObj.MfEmpNo2 = this.ResponseAgrmntSignerObj.MfEmpNo2;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder1Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Id;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder2Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder2Id;
          this.agrmntSignerObj.AppCustCompanyMgmntShrholder3Id = this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder3Id;
          this.agrmntSignerObj.MrJobPositionSupplBranchEmpCode = this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpCode;
          this.agrmntSignerObj.MrJobPositionMfEmpNo1Code = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Code;
          this.agrmntSignerObj.MrJobPositionMfEmpNo2Code = this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Code;
          this.agrmntSignerObj.RowVersion = this.ResponseAgrmntSignerObj.RowVersion;

            this.DocSignerForm.patchValue({
              MrJobPositionSupplBranchEmpName: this.ResponseAgrmntSignerObj.MrJobPositionSupplBranchEmpName,
              MrJobPositionMfEmpNo1Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo1Name,
              MrJobPositionMfEmpNo2Name: this.ResponseAgrmntSignerObj.MrJobPositionMfEmpNo2Name,
              MrJobPositionMgmntShrholder1Code: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder1Code,
              MrJobPositionMgmntShrholder2Code: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder2Code,
              MrJobPositionMgmntShrholder3Code: this.ResponseAgrmntSignerObj.MrJobPositionMgmntShrholder3Code,
            })
        }
      });
  }

  setLookupObj() {
    this.inputLookupBranchEmpObj = new InputLookupObj();
    this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
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

    this.inputLookupOfficeEmp1Obj = new InputLookupObj();
    this.inputLookupOfficeEmp1Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupOfficeEmp1Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp1Obj.pagingJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.genericJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.addCritInput = new Array();

    this.inputLookupOfficeEmp2Obj = new InputLookupObj();
    this.inputLookupOfficeEmp2Obj.urlJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupOfficeEmp2Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp2Obj.pagingJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.genericJson = "./assets/uclookup/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.addCritInput = new Array();

    var crit3Obj = new CriteriaObj();
    crit3Obj.propName = 'RO.OFFICE_CODE';
    crit3Obj.restriction = AdInsConstant.RestrictionEq;
    crit3Obj.value = this.OfficeCode;
    
    this.inputLookupOfficeEmp1Obj.addCritInput.push(crit3Obj);
    this.inputLookupOfficeEmp2Obj.addCritInput.push(crit3Obj);

    this.inputLookupCustCoyShareHolder1Obj = new InputLookupObj();
    this.inputLookupCustCoyShareHolder1Obj.urlJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder1Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolder1Obj.urlEnviPaging = environment.losUrl;
    this.inputLookupCustCoyShareHolder1Obj.pagingJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder1Obj.genericJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder1Obj.addCritInput = new Array();

    this.inputLookupCustCoyShareHolder2Obj = new InputLookupObj();
    this.inputLookupCustCoyShareHolder2Obj.urlJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder2Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolder2Obj.urlEnviPaging = environment.losUrl;
    this.inputLookupCustCoyShareHolder2Obj.pagingJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder2Obj.genericJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder2Obj.addCritInput = new Array();

    this.inputLookupCustCoyShareHolder3Obj = new InputLookupObj();
    this.inputLookupCustCoyShareHolder3Obj.urlJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder3Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolder3Obj.urlEnviPaging = environment.losUrl;
    this.inputLookupCustCoyShareHolder3Obj.pagingJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder3Obj.genericJson = "./assets/uclookup/lookupCustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder3Obj.addCritInput = new Array();

    var crit4Obj = new CriteriaObj();
    crit4Obj.propName = 'CCMS.SHAREHOLDER_CUST_NO';
    crit4Obj.restriction = AdInsConstant.RestrictionEq;
    crit4Obj.value = this.CustNo;

    var crit5Obj = new CriteriaObj();
    crit5Obj.propName = 'RM.REF_MASTER_TYPE_CODE';
    crit5Obj.restriction = AdInsConstant.RestrictionEq;
    crit5Obj.value = 'JOB_POSITION';

    this.inputLookupCustCoyShareHolder1Obj.addCritInput.push(crit4Obj);
    this.inputLookupCustCoyShareHolder1Obj.addCritInput.push(crit5Obj);
    this.inputLookupCustCoyShareHolder2Obj.addCritInput.push(crit4Obj);
    this.inputLookupCustCoyShareHolder2Obj.addCritInput.push(crit5Obj);
    this.inputLookupCustCoyShareHolder3Obj.addCritInput.push(crit4Obj);
    this.inputLookupCustCoyShareHolder3Obj.addCritInput.push(crit5Obj);

    if (this.ResponseAgrmntSignerObj != null) {
      this.inputLookupBranchEmpObj.jsonSelect = { VendorEmpName: this.ResponseAgrmntSignerObj.SupplBranchEmpName };
      this.inputLookupOfficeEmp1Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName1 };
      this.inputLookupOfficeEmp2Obj.jsonSelect = { OfficeEmpName: this.ResponseAgrmntSignerObj.MfEmpName2 };
      this.inputLookupCustCoyShareHolder1Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder1Name };
      this.inputLookupCustCoyShareHolder2Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder2Name };
      this.inputLookupCustCoyShareHolder3Obj.jsonSelect = { MgmntShrholderName: this.ResponseAgrmntSignerObj.AppCustCompanyMgmntShrholder3Name };
    }
  }

  getLookupBranchEmp(event) {
    this.agrmntSignerObj.SupplBranchEmpNo = event.VendorEmpNo;
    this.agrmntSignerObj.MrJobPositionSupplBranchEmpCode = event.MrVendorEmpPositionCode;
    this.DocSignerForm.patchValue({
      MrJobPositionSupplBranchEmpName: event.JobTitleName
    })
  }

  getLookupOfficeEmp1(event) {
    this.agrmntSignerObj.MfEmpNo1 = event.OfficeEmpNo;
    this.agrmntSignerObj.MrJobPositionMfEmpNo1Code = event.JobTitleCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMfEmpNo1Name: event.JobTitleName
    })
  }

  getLookupOfficeEmp2(event) {
    this.agrmntSignerObj.MfEmpNo2 = event.OfficeEmpNo;
    this.agrmntSignerObj.MrJobPositionMfEmpNo2Code = event.JobTitleCode;
    this.DocSignerForm.patchValue({
      MrJobPositionMfEmpNo2Name: event.JobTitleName
    })
  }

  getLookupCustCoyShareHolder(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder1Id = event.AppCustCompanyMgmntShrholderId;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder1Code: event.MrJobPositionCode,
    })
  }

  getLookupCustCoyShareHolder2(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder2Id = event.AppCustCompanyMgmntShrholderId;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder2Code: event.MrJobPositionCode,
    })
  }

  getLookupCustCoyShareHolder3(event) {
    this.agrmntSignerObj.AppCustCompanyMgmntShrholder3Id = event.AppCustCompanyMgmntShrholderId;
    this.DocSignerForm.patchValue({
      MrJobPositionMgmntShrholder3Code: event.MrJobPositionCode,
    })
  }

  SaveForm() {
    this.agrmntSignerObj.AgrmntId = this.AgrmntId;
    this.agrmntSignerObj.SupplBranchEmpName = this.DocSignerForm.controls["lookupBranchEmp"]["controls"].value.value;
    this.agrmntSignerObj.MrJobPositionSupplBranchEmpName = this.DocSignerForm.controls.MrJobPositionSupplBranchEmpName.value;
    this.agrmntSignerObj.MfEmpName1 = this.DocSignerForm.controls["lookupOfficeEmp1"]["controls"].value.value;
    this.agrmntSignerObj.MrJobPositionMfEmpNo1Name = this.DocSignerForm.controls.MrJobPositionMfEmpNo1Name.value;
    this.agrmntSignerObj.MfEmpName2 = this.DocSignerForm.controls["lookupOfficeEmp2"]["controls"].value.value;
    this.agrmntSignerObj.MrJobPositionMfEmpNo2Name = this.DocSignerForm.controls.MrJobPositionMfEmpNo2Name.value;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder1Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder1Code.value;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder2Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder2Code.value;
    this.agrmntSignerObj.MrJobPositionMgmntShrholder3Code = this.DocSignerForm.controls.MrJobPositionMgmntShrholder3Code.value;

    if (this.mode == "edit") {
      this.http.post(AdInsConstant.EditAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["AdminProcess/DocumentSigner/Paging"]);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.http.post(AdInsConstant.SubmitAgrmntSignerData, this.agrmntSignerObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["AdminProcess/DocumentSigner/Paging"]);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
