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


@Component({
  selector: 'app-doc-signer-detail',
  templateUrl: './doc-signer-detail.component.html',
  styleUrls: ['./doc-signer-detail.component.scss'],
  providers: [DecimalPipe]
})
export class DocSignerDetailComponent implements OnInit {
  inputPagingObj: any;
  MouCustId: any;
  MouType: any;
  mouCustObj: any;
  returnMouCust: any;
  getMouCustById:any;
  tempShareholder: any;
  tempShareholderPosition: any;
  tempEmployee1: any;
  tempEmployeePosition1: any;
  tempEmployee2: any;
  tempEmployeePosition2: any;
  custShareholderLookUpObj: any;
  employeeLookUpObj1: any;
  employeeLookUpObj2: any;
  MouCustSignerForm = this.fb.group({
    MfSigner: [''],
    MfSignerPosition: [''],
    CustSigner1: [''],
    CustSignerPosition1: [''],
    CustSigner2: [''],
    CustSignerPosition2: [''],
  });
  
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.getMouCustById = AdInsConstant.GetMouCustById;

    this.route.queryParams.subscribe(params => {
        if (params["MouCustId"] != null) {
            this.MouCustId = params["MouCustId"];
        }
        if (params["MouType"] != null) {
            this.MouType = params["MouType"];
        }
    });
  }

  getLookUpShareholder(event) {
    this.tempShareholder = event.ShareholderName;
    this.tempShareholderPosition = event.Descr;

    this.MouCustSignerForm.patchValue({
      MfSignerPosition: this.tempShareholderPosition
    });
  }

  getLookUpEmployee1(event) {
    this.tempEmployee1 = event.EmpName;
    this.tempEmployeePosition1 = event.RoleName;

    console.log("aaa")
    console.log(this.tempEmployee1)
    console.log(this.tempEmployeePosition1)

    this.MouCustSignerForm.patchValue({
      CustSignerPosition1: this.tempEmployeePosition1
    });
  }

  getLookUpEmployee2(event) {
    this.tempEmployee2 = event.EmpName;
    this.tempEmployeePosition2 = event.RoleName;

    console.log("bbb")
    console.log(this.tempEmployee2)
    console.log(this.tempEmployeePosition2)

    this.MouCustSignerForm.patchValue({
      CustSignerPosition2: this.tempEmployeePosition2
    });
  }

  ngOnInit() {
    this.custShareholderLookUpObj = new InputLookupObj();
    this.custShareholderLookUpObj.isRequired = false;
    this.custShareholderLookUpObj.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.custShareholderLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.custShareholderLookUpObj.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    this.custShareholderLookUpObj.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

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
}
