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
  selector: 'app-lead-input-main-info',
  templateUrl: './lead-input-main-info.component.html',
  styleUrls: ['./lead-input-main-info.component.scss'],
  providers: [DecimalPipe]
})
export class DocSignerDetailComponent implements OnInit {
  inputPagingObj: any;
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
  cmoNameLookUpObj: any;
  surveyorNameLookUpObj: any;
  salesNameLookUpObj:any;
  tempCmoName: any;
  tempSurveyorName: any;
  tempSalesName: any;
  getListRefOffice: any;
  getListActiveLob: any;
  listRefOffice: any;
  listRefLob:any;
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
    this.getListRefOffice = AdInsConstant.GetListActiveRefOffice;
    this.getListActiveLob = AdInsConstant.GetListActiveLob;

    this.route.queryParams.subscribe(params => {
        if (params["MouCustId"] != null) {
            this.MouCustId = params["MouCustId"];
        }
    });
  }

//   getLookUpShareholder1(event) {
//     this.tempShareholder1 = event.ShareholderName;
//     this.tempShareholderPosition1 = event.Descr;

//     this.MouCustSignerForm.patchValue({
//       MfSignerPosition1: this.tempShareholderPosition1
//     });
//   }

//   getLookUpShareholder2(event) {
//     this.tempShareholder2 = event.ShareholderName;
//     this.tempShareholderPosition2 = event.Descr;

//     this.MouCustSignerForm.patchValue({
//       MfSignerPosition2: this.tempShareholderPosition2
//     });
//   }

getLookUpCmoName(event) {
    this.tempCmoName = event.EmpName;
}

getLookUpSurveyorName(event) {
    this.tempSurveyorName = event.EmpName;
}

getLookUpSalesName(event) {
    this.tempSalesName = event.EmpName;
}

  ngOnInit() {
    // this.custShareholderLookUpObj1 = new InputLookupObj();
    // this.custShareholderLookUpObj1.isRequired = false;
    // this.custShareholderLookUpObj1.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    // this.custShareholderLookUpObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    // this.custShareholderLookUpObj1.urlEnviPaging = environment.FoundationR3Url;
    // this.custShareholderLookUpObj1.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    // this.custShareholderLookUpObj1.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

    // this.custShareholderLookUpObj2 = new InputLookupObj();
    // this.custShareholderLookUpObj2.isRequired = false;
    // this.custShareholderLookUpObj2.urlJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    // this.custShareholderLookUpObj2.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    // this.custShareholderLookUpObj2.urlEnviPaging = environment.FoundationR3Url;
    // this.custShareholderLookUpObj2.pagingJson = "./assets/uclookup/lookupCustCompanyShareholder.json";
    // this.custShareholderLookUpObj2.genericJson = "./assets/uclookup/lookupCustCompanyShareholder.json";

    this.http.post(this.getListRefOffice, null).subscribe(
        (response) => {
          this.listRefOffice = response['returnObject']
        },
        (error) => {
          console.log(error);
        });

    this.http.post(this.getListActiveLob, null).subscribe(
        (response) => {
            this.listRefLob = response['returnObject']
        },
        (error) => {
            console.log(error);
        });
    
    this.cmoNameLookUpObj = new InputLookupObj();
    this.cmoNameLookUpObj.isRequired = false;
    this.cmoNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.cmoNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.cmoNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.cmoNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.cmoNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.surveyorNameLookUpObj = new InputLookupObj();
    this.surveyorNameLookUpObj.isRequired = false;
    this.surveyorNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.surveyorNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.surveyorNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.surveyorNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.surveyorNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.salesNameLookUpObj = new InputLookupObj();
    this.salesNameLookUpObj.isRequired = false;
    this.salesNameLookUpObj.urlJson = "./assets/uclookup/lookupEmployee.json";
    this.salesNameLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.salesNameLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.salesNameLookUpObj.pagingJson = "./assets/uclookup/lookupEmployee.json";
    this.salesNameLookUpObj.genericJson = "./assets/uclookup/lookupEmployee.json";

    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(this.getMouCustById, this.mouCustObj).subscribe(
      (response) => {
          this.returnMouCust = response;
      });
  }

  setMouCustSigner(){
    // this.mouCustSignerObj.MouCustId = this.MouCustId;
    // this.mouCustSignerObj.MfSignerName1 = this.tempShareholder1;
    // this.mouCustSignerObj.MfSignerJobPosition1 = this.tempShareholderPosition1;
    // this.mouCustSignerObj.MfSignerName2 = this.tempShareholder2;
    // this.mouCustSignerObj.MfSignerJobPosition2 = this.tempShareholderPosition2;
    // this.mouCustSignerObj.CustSignerName1 = this.tempEmployee1;
    // this.mouCustSignerObj.CustSignerJobPosition1 = this.tempEmployeePosition1;
    // this.mouCustSignerObj.CustSignerName2 = this.tempEmployee2;
    // this.mouCustSignerObj.CustSignerJobPosition2 = this.tempEmployeePosition2;
  }

  SaveForm(){
    this.mouCustSignerObj = new MouCustSignerObj();
    this.setMouCustSigner();
    console.log("aaa")
    console.log(this.mouCustSignerObj)
    this.http.post(this.addMouCustSigner, this.mouCustSignerObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Mou/DocSigner/Paging"]);
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
