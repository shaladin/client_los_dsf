import { Component, OnInit, ViewChild } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqMouCustSignerObj } from 'app/shared/model/Request/MOU/ReqMouCustSignerObj.model';
import { ClaimTaskService } from 'app/shared/claimTask.service';

@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html',
  providers: [DecimalPipe]
})
export class DocSignerDetailComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  WfTaskListId: any;
  MouCustId: number;
  MouType: string;
  mouCustObj: MouCustObj;
  mouCustSignerObj: ReqMouCustSignerObj;
  returnMouCust: MouCustObj;
  @ViewChild('LookupEmp1') ucLookupEmp1: UclookupgenericComponent;
  @ViewChild('LookupEmp2') ucLookupEmp2: UclookupgenericComponent;
  @ViewChild('LookupShareHolder1') ucLookupShareHolder1: UclookupgenericComponent;
  @ViewChild('LookupShareHolder2') ucLookupShareHolder2: UclookupgenericComponent;

  returnMouCustSigner: any;
  getMouCustById: string;
  addMouCustSigner: string;
  getMouCustSignerByMouCustId: string;
  getCustSignerObj: any;
  tempShareholder1: string;
  tempShareholderPosition1: string;
  tempShareholder2: string;
  tempShareholderPosition2: string;
  tempEmployee1: string;
  tempEmployeePosition1: string;
  tempEmployee2: string;
  tempEmployeePosition2: string;
  custShareholderLookUpObj1: InputLookupObj;
  custShareholderLookUpObj2: InputLookupObj;
  employeeLookUpObj1: InputLookupObj;
  employeeLookUpObj2: InputLookupObj;
  pageType: string;
  page: number;
  custId: number;
  custUrl: string;
  mouUrl: string;
  MrCustTypeCode: string;
  customerLookUpObj2: InputLookupObj;
  customerLookUpObj1: InputLookupObj;
  tempCustomer1: any;
  tempCustomerPosition1: string;
  getCustByCustNo: string;
  getCustCompanyByCustId: string;
  custCompanyId: string;
  custCompanyCrit: CriteriaObj;
  custNo: any;
  link: any;
  resultData: any;

  MouCustSignerForm = this.fb.group({
    MfSigner1: [''],
    MfSignerPosition1: [''],
    MfSigner2: [''],
    MfSignerPosition2: [''],
    CustSigner1: [''],
    CustSignerPosition1: [''],
    CustSigner2: [''],
    CustSignerPosition2: [''],
  });

  readonly CancelLink: string = NavigationConstant.MOU_DOC_SIGNER_PAGING;
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private cookieService: CookieService, private claimTaskService: ClaimTaskService) {
    this.getMouCustById = URLConstant.GetMouCustById;
    this.addMouCustSigner = URLConstant.AddMouCustSigner;
    this.getMouCustSignerByMouCustId = URLConstant.GetMouCustSignerByMouCustId;
    this.getCustByCustNo = URLConstant.GetCustByCustNo;
    this.getCustCompanyByCustId = URLConstant.GetCustCompanyByCustId;
    this.route.queryParams.subscribe(params => {
      if (params["MouCustId"] != null) this.MouCustId = params["MouCustId"];
      if (params["WfTaskListId"] != null) this.WfTaskListId = params["WfTaskListId"];
    });
  }

  getLookUpShareholder1(event) {
    this.tempShareholder1 = event.ShareholderName;
    this.tempShareholderPosition1 = event.Descr;
    this.MouCustSignerForm.patchValue({
      CustSignerPosition1: this.tempShareholderPosition1
    });
  }

  getLookUpShareholder2(event) {
    this.tempShareholder2 = event.ShareholderName;
    this.tempShareholderPosition2 = event.Descr;
    this.MouCustSignerForm.patchValue({
      CustSignerPosition2: this.tempShareholderPosition2
    });
  }

  getLookUpEmployee1(event) {
    var addCrit: CriteriaObj = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "RE.REF_EMP_ID";
    addCrit.restriction = AdInsConstant.RestrictionNotIn;
    addCrit.listValue = [event.EmpId];
    this.employeeLookUpObj2.addCritInput = [];
    this.employeeLookUpObj2.addCritInput.push(addCrit);
    this.ucLookupEmp2.setAddCritInput();
    this.tempEmployee1 = event.EmpName;
    this.tempEmployeePosition1 = event.RoleName;
    this.MouCustSignerForm.patchValue({
      MfSignerPosition1: this.tempEmployeePosition1
    });
  }

  getLookUpEmployee2(event) {
    var addCrit: CriteriaObj = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "RE.REF_EMP_ID";
    addCrit.restriction = AdInsConstant.RestrictionNotIn;
    addCrit.listValue = [event.EmpId];
    this.employeeLookUpObj1.addCritInput = [];
    this.employeeLookUpObj1.addCritInput.push(addCrit);
    this.ucLookupEmp1.setAddCritInput();
    this.tempEmployee2 = event.EmpName;
    this.tempEmployeePosition2 = event.RoleName;
    this.MouCustSignerForm.patchValue({
      MfSignerPosition2: this.tempEmployeePosition2
    });
  }

  getLookUpCustomer1(event) {
    this.tempCustomer1 = event.CustFullName;
    this.tempCustomerPosition1 = "CUSTOMER";
    this.MouCustSignerForm.patchValue({
      CustSignerPosition1: this.tempCustomerPosition1
    });
  }

  ngOnInit() {
    if (this.WfTaskListId > 0) {
      this.claimTaskService.ClaimTask(this.WfTaskListId);
    }
    this.custShareholderLookUpObj1 = new InputLookupObj();
    this.custShareholderLookUpObj1.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj1.urlEnviPaging = environment.losUrl;
    this.custShareholderLookUpObj1.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.addCritInput = new Array();

    this.custShareholderLookUpObj2 = new InputLookupObj();
    this.custShareholderLookUpObj2.isRequired = false;
    this.custShareholderLookUpObj2.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj2.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj2.urlEnviPaging = environment.losUrl;
    this.custShareholderLookUpObj2.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj2.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj2.addCritInput = new Array();

    this.employeeLookUpObj1 = new InputLookupObj();
    this.employeeLookUpObj1.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.employeeLookUpObj1.urlEnviPaging = environment.FoundationR3Url;
    this.employeeLookUpObj1.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj1.genericJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj1.addCritInput = new Array();

    this.employeeLookUpObj2 = new InputLookupObj();
    this.employeeLookUpObj2.isRequired = false;
    this.employeeLookUpObj2.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj2.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.employeeLookUpObj2.urlEnviPaging = environment.FoundationR3Url;
    this.employeeLookUpObj2.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj2.genericJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj2.addCritInput = new Array();

    this.customerLookUpObj1 = new InputLookupObj();
    this.customerLookUpObj1.isRequired = false;
    this.customerLookUpObj1.urlJson = "./assets/uclookup/lookupCustPersonal.json";
    this.customerLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.customerLookUpObj1.urlEnviPaging = environment.losUrl;
    this.customerLookUpObj1.pagingJson = "./assets/uclookup/lookupCustPersonal.json";
    this.customerLookUpObj1.genericJson = "./assets/uclookup/lookupCustPersonal.json";

    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(this.getMouCustById, { Id: this.MouCustId }).subscribe(
      (response: MouCustObj) => {
        this.returnMouCust = response;
        this.MrCustTypeCode = this.returnMouCust["MrCustTypeCode"];
        this.custNo = this.returnMouCust["CustNo"];
        if (this.MrCustTypeCode == "COMPANY") {
          this.custCompanyCrit = new CriteriaObj();
          this.custCompanyCrit.DataType = "text";
          this.custCompanyCrit.propName = "MC.MOU_CUST_ID";
          this.custCompanyCrit.restriction = AdInsConstant.RestrictionEq;
          this.custCompanyCrit.value = this.MouCustId.toString();
          this.custShareholderLookUpObj1.addCritInput.push(this.custCompanyCrit);
          this.custShareholderLookUpObj2.addCritInput.push(this.custCompanyCrit);
          this.ucLookupShareHolder1.setAddCritInput();
          this.ucLookupShareHolder2.setAddCritInput();
        }
        this.mouUrl = environment.losR3Web + "/View/Mou/CustView?MouCustId=" + this.MouCustId;
        var addCustomerCrit: CriteriaObj = new CriteriaObj();
        addCustomerCrit.DataType = "text";
        addCustomerCrit.propName = "C.CUST_NO";
        addCustomerCrit.restriction = AdInsConstant.RestrictionEq;
        addCustomerCrit.value = this.custNo;
        this.customerLookUpObj1.addCritInput = [];
        this.customerLookUpObj1.addCritInput.push(addCustomerCrit);
      });
  }

  setMouCustSigner() {
    this.mouCustSignerObj.WfTaskListId = this.WfTaskListId;
    this.mouCustSignerObj.MouCustId = this.MouCustId;

    this.mouCustSignerObj.MfSignerName1 = this.tempEmployee1;
    this.mouCustSignerObj.MfSignerJobPosition1 = this.tempEmployeePosition1;
    this.mouCustSignerObj.MfSignerName2 = this.tempEmployee2;
    this.mouCustSignerObj.MfSignerJobPosition2 = this.tempEmployeePosition2;

    if (this.MrCustTypeCode == "COMPANY") {
      this.mouCustSignerObj.CustSignerName1 = this.tempShareholder1;
      this.mouCustSignerObj.CustSignerJobPosition1 = this.tempShareholderPosition1;
      this.mouCustSignerObj.CustSignerName2 = this.tempShareholder2;
      this.mouCustSignerObj.CustSignerJobPosition2 = this.tempShareholderPosition2;
    }
    else if (this.MrCustTypeCode == "PERSONAL") {
      this.mouCustSignerObj.CustSignerName1 = this.tempCustomer1;
      this.mouCustSignerObj.CustSignerJobPosition1 = this.tempCustomerPosition1;
    }
  }
  SaveForm() {
    this.mouCustSignerObj = new ReqMouCustSignerObj();
    this.setMouCustSigner();
    this.http.post(this.addMouCustSigner, this.mouCustSignerObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.MOU_DOC_SIGNER_PAGING], {});
      });
  }
}
