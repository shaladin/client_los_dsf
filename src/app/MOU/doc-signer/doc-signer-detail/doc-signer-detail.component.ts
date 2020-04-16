import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { DecimalPipe } from '@angular/common';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { UcpagingComponent } from '@adins/ucpaging';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { MouCustSignerObj } from 'app/shared/model/MouCustSignerObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';


@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html',
  providers: [DecimalPipe]
})
export class DocSignerDetailComponent implements OnInit {
  inputPagingObj: any;
  WfTaskListId: any;
  MouCustId: any;
  MouType: any;
  mouCustObj: any;
  mouCustSignerObj: any;
  returnMouCust: any;
  returnMouCustSigner: any;
  getMouCustById:any;
  addMouCustSigner: any;
  getMouCustSignerByMouCustId: any;
  getCustSignerObj: any;
  tempShareholder1: any;
  tempShareholderPosition1: any;
  tempShareholder2: any;
  tempShareholderPosition2: any;
  tempEmployee1: any;
  tempEmployeePosition1: any;
  tempEmployee2: any;
  tempEmployeePosition2: any;
  custShareholderLookUpObj1: any;
  custShareholderLookUpObj2: any;
  employeeLookUpObj1: any;
  employeeLookUpObj2: any;
  pageType: any;
  page:any;
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
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getMouCustById = AdInsConstant.GetMouCustById;
    this.addMouCustSigner = AdInsConstant.AddMouCustSigner;
    this.getMouCustSignerByMouCustId = AdInsConstant.GetMouCustSignerByMouCustId;

    this.route.queryParams.subscribe(params => {
        if (params["MouCustId"] != null) this.MouCustId = params["MouCustId"];
        if (params["WfTaskListId"] != null) this.WfTaskListId = params["WfTaskListId"];
    });
  }

  getLookUpShareholder1(event) {
    this.tempShareholder1 = event.ShareholderName;
    this.tempShareholderPosition1 = event.Descr;

    this.MouCustSignerForm.patchValue({
      MfSignerPosition1: this.tempShareholderPosition1
    });
  }

  getLookUpShareholder2(event) {
    this.tempShareholder2 = event.ShareholderName;
    this.tempShareholderPosition2 = event.Descr;

    this.MouCustSignerForm.patchValue({
      MfSignerPosition2: this.tempShareholderPosition2
    });
  }

  getLookUpEmployee1(event) {
    this.tempEmployee1 = event.EmpName;
    this.tempEmployeePosition1 = event.RoleName;

    this.MouCustSignerForm.patchValue({
      CustSignerPosition1: this.tempEmployeePosition1
    });
  }

  getLookUpEmployee2(event) {
    this.tempEmployee2 = event.EmpName;
    this.tempEmployeePosition2 = event.RoleName;

    this.MouCustSignerForm.patchValue({
      CustSignerPosition2: this.tempEmployeePosition2
    });
  }

  claimTask()
  {
    var currentUserContext = JSON.parse(localStorage.getItem("UserContext"));
    var wfClaimObj = { pWFTaskListID: this.WfTaskListId, pUserID: currentUserContext["UserName"]};
    console.log(wfClaimObj);
    this.http.post(AdInsConstant.ClaimTask, wfClaimObj).subscribe(
      (response) => {
      });
  }

  ngOnInit() {
    this.claimTask();
    this.custShareholderLookUpObj1 = new InputLookupObj();
    this.custShareholderLookUpObj1.isRequired = false;
    this.custShareholderLookUpObj1.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj1.urlEnviPaging = environment.FoundationR3Url;
    this.custShareholderLookUpObj1.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj1.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

    this.custShareholderLookUpObj2 = new InputLookupObj();
    this.custShareholderLookUpObj2.isRequired = false;
    this.custShareholderLookUpObj2.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj2.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj2.urlEnviPaging = environment.FoundationR3Url;
    this.custShareholderLookUpObj2.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj2.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

    this.employeeLookUpObj1 = new InputLookupObj();
    this.employeeLookUpObj1.isRequired = false;
    this.employeeLookUpObj1.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.employeeLookUpObj1.urlEnviPaging = environment.FoundationR3Url;
    this.employeeLookUpObj1.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj1.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.employeeLookUpObj2 = new InputLookupObj();
    this.employeeLookUpObj2.isRequired = false;
    this.employeeLookUpObj2.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj2.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.employeeLookUpObj2.urlEnviPaging = environment.FoundationR3Url;
    this.employeeLookUpObj2.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.employeeLookUpObj2.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(this.getMouCustById, this.mouCustObj).subscribe(
      (response) => {
          this.returnMouCust = response;
      });
  }

  setMouCustSigner(){
    this.mouCustSignerObj.WfTaskListId = this.WfTaskListId;
    this.mouCustSignerObj.MouCustId = this.MouCustId;
    this.mouCustSignerObj.MfSignerName1 = this.tempShareholder1;
    this.mouCustSignerObj.MfSignerJobPosition1 = this.tempShareholderPosition1;
    this.mouCustSignerObj.MfSignerName2 = this.tempShareholder2;
    this.mouCustSignerObj.MfSignerJobPosition2 = this.tempShareholderPosition2;
    this.mouCustSignerObj.CustSignerName1 = this.tempEmployee1;
    this.mouCustSignerObj.CustSignerJobPosition1 = this.tempEmployeePosition1;
    this.mouCustSignerObj.CustSignerName2 = this.tempEmployee2;
    this.mouCustSignerObj.CustSignerJobPosition2 = this.tempEmployeePosition2;
  }

  SaveForm(){
    this.mouCustSignerObj = new MouCustSignerObj();
    this.setMouCustSigner();
    this.http.post(this.addMouCustSigner, this.mouCustSignerObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/DocSigner/Paging"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
