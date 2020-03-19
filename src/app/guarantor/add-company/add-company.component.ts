import { Component, OnInit } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorCompanyObj } from 'app/shared/model/GuarantorCompanyObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  providers: [NGXToastrService]
})

export class AddCompanyComponent implements OnInit {

  param: string;
  mode: string = "add";
  key: any;
  criteria: CriteriaObj[] = [];
  resultData : any;
  inputLookupObj: any;
  MrCompanyTypeCode:any;
  MrCustRelationshipCode:any;
  inputLookupObj1 : any;
  MrJobPositionCode: any;
  inputFieldObj: InputFieldObj;
  AddrObj: AddrObj;
  appGuarantorCompanyObj : AppGuarantorCompanyObj;
  guarantorCompanyObj : GuarantorCompanyObj ;
  
  CompanyForm = this.fb.group({
    GuarantorName:[''],
    MrCustRelationshipCode: [''],
    MrCompanyTypeCode: [''],
    TaxIdNo: [''],
    IndustryTypeCode: [''],
    ContactName: [''],
    MrJobPositionCode: [''],
    ContactEmail: [''],
    MobilePhnNo1: [''],
    MobilePhnNo2: [''],
    FaxArea: [''],
    Fax: [''],
    PhnArea1: [''],
    Phn1: [''],
    PhnExt1: [''],
    PhnArea2: [''],
    Phn2: [''],
    PhnExt2: [''],
    Addr: [''],
    AreaCode1: [''],
    AreaCode2: [''],
    AreaCode3: [''],
    AreaCode4: [''],
    City: [''],
    Zipcode: [''],
    Subzipcode:['']
  });

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private fb:FormBuilder, private toastr: NGXToastrService) { 
    this.route.queryParams.subscribe(params => {
      this.mode = params["mode"];
      this.param = params["AppGuarantorId"];
    })
  }

  ngOnInit() {

    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();

    if (this.mode == "edit") {
      var guarantorCompanyObj = new GuarantorCompanyObj();
      guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.param;
      this.http.post(AdInsConstant.GetAppGuarantorCompanyByAppGuarantorId, guarantorCompanyObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.resultData=response;
          this.inputLookupObj.nameSelect = this.resultData.appGuarantorObj.GuarantorName;
          this.inputLookupObj1.nameSelect = this.resultData.appGuarantorCompanyObj.IndustryTypeCode;
          this.CompanyForm.patchValue({
            MrCustRelationshipCode : this.resultData.appGuarantorObj.MrCustRelationshipCode,
            TaxIdNo : this.resultData.appGuarantorObj.TaxIdNo,
            MrCompanyTypeCode : this.resultData.appGuarantorCompanyObj.MrCompanyTypeCode,
            IndustryTypeCode : this.resultData.appGuarantorCompanyObj.IndustryTypeCode,
            ContactName : this.resultData.appGuarantorCompanyObj.ContactName,
            MrJobPositionCode : this.resultData.appGuarantorCompanyObj.MrJobPositionCode,
            MobilePhnNo1 : this.resultData.appGuarantorCompanyObj.MobilePhnNo1,
            ContactEmail : this.resultData.appGuarantorCompanyObj.ContactEmail,
            MobilePhnNo2 : this.resultData.appGuarantorCompanyObj.MobilePhnNo2,
            FaxArea : this.resultData.appGuarantorCompanyObj.FaxArea,
            Fax : this.resultData.appGuarantorObj.Fax,
            PhnArea1 : this.resultData.appGuarantorCompanyObj.PhnArea1,
            Phn1 : this.resultData.appGuarantorCompanyObj.Phn1,
            PhnExt1 : this.resultData.appGuarantorCompanyObj.PhnExt1,
            PhnArea2 : this.resultData.appGuarantorCompanyObj.PhnArea2,
            Phn2 : this.resultData.appGuarantorObj.Phn2,
            PhnExt2 : this.resultData.appGuarantorCompanyObj.PhnExt2
          })
          this.setAddrLegalObj();
        },
        (error) => {
          console.log(error);
        }
      );;
    }

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorCompany.json";

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupIndustry.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupIndustry.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupIndustry.json";

    var refCompObj ={
      RefMasterTypeCode:"COMPANY_TYPE",
      RowVersion:""
    }
    var refCustRelObj ={
      RefMasterTypeCode:"CUST_COMPANY_RELATIONSHIP",
      RowVersion:""
    }
    var refJobObj ={
      RefMasterTypeCode:"CUST_COMPANY_RELATIONSHIP",
      RowVersion:""
    }
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCompObj).subscribe(
      (response) => {
          this.MrCompanyTypeCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrCompanyTypeCode: this.MrCompanyTypeCode[0].MasterCode
          });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCustRelObj).subscribe(
      (response) => {
          this.MrCustRelationshipCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrCustRelationshipCode: this.MrCustRelationshipCode[0].MasterCode
          });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refJobObj).subscribe(
      (response) => {
          this.MrJobPositionCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrJobPositionCode: this.MrJobPositionCode[0].MasterCode
          });
      }
    );
  }

  // GuarantorName="";
  lookupGuarantor(event){
    console.log(event);
    this.CompanyForm.patchValue(
      {
        GuarantorName: event.CustName
      }
    );
    console.log(this.CompanyForm);
  }

  // IndustryTypeCode="";
  handleOutput1(event){
    console.log(event);
    this.CompanyForm.patchValue(
      {
        IndustryTypeCode: event.IndustryTypeCode
      }
    );
    console.log(this.CompanyForm);
  }
  
  setAddrLegalObj(){
      this.AddrObj = new AddrObj();
      this.AddrObj.Addr = this.resultData.appGuarantorCompanyObj.Addr;
      this.AddrObj.AreaCode1 = this.resultData.appGuarantorCompanyObj.AreaCode1;
      this.AddrObj.AreaCode2 = this.resultData.appGuarantorCompanyObj.AreaCode2;
      this.AddrObj.AreaCode3 = this.resultData.appGuarantorCompanyObj.AreaCode3;
      this.AddrObj.AreaCode4 = this.resultData.appGuarantorCompanyObj.AreaCode4;
      this.AddrObj.City = this.resultData.appGuarantorCompanyObj.City;

      this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.appGuarantorCompanyObj.Zipcode;
      this.inputFieldObj.inputLookupObj.jsonSelect = {Zipcode: this.resultData.appGuarantorCompanyObj.Zipcode};
  }

  Add(){
    this.setAppGuarantor();
    this.setAppGuarantorCompany();
  }

  setAppGuarantor(){
    this.guarantorCompanyObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorObj.MrGuarantorTypeCode = "Company";
    this.guarantorCompanyObj.AppGuarantorObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorObj.MrCustRelationshipCode = this.CompanyForm.controls.MrCustRelationshipCode.value;
    this.guarantorCompanyObj.AppGuarantorObj.RowVersion = "";
    this.guarantorCompanyObj.AppGuarantorObj.AppId = "11";
  }

  setAppGuarantorCompany(){
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrCompanyTypeCode = this.CompanyForm.controls.MrCompanyTypeCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.IndustryTypeCode = this.inputLookupObj1.nameSelect;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactName = this.CompanyForm.controls.ContactName.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrJobPositionCode = this.CompanyForm.controls.MrJobPositionCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactEmail = this.CompanyForm.controls.ContactEmail.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo1 = this.CompanyForm.controls.MobilePhnNo1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo2 = this.CompanyForm.controls.MobilePhnNo2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.FaxArea = this.CompanyForm.controls.FaxArea.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Fax = this.CompanyForm.controls.Fax.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea1 = this.CompanyForm.controls.PhnArea1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn1 = this.CompanyForm.controls.Phn1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt1 = this.CompanyForm.controls.PhnExt1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea2 = this.CompanyForm.controls.PhnArea2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn2 = this.CompanyForm.controls.Phn2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt2 = this.CompanyForm.controls.PhnExt2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Addr = this.CompanyForm.controls["AddrObj"]["controls"].Addr.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode1 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode2 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode3 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode4 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.City = this.CompanyForm.controls["AddrObj"]["controls"].City.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Zipcode = this.inputFieldObj.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.RowVersion = "";
  }

  SaveForm(){
    console.log(this.CompanyForm);
    this.guarantorCompanyObj = new GuarantorCompanyObj();
    this.Add();
    if (this.mode == "edit") {
      this.guarantorCompanyObj.RowVersion = this.resultData.RowVersion;
      this.guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.param;
      this.http.post(AdInsConstant.EditAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(["/Guarantor/paging"]);
        },
        error => {
          console.log(error);
        }
      );
    }else{
    this.http.post(AdInsConstant.AddAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.router.navigate(["/Guarantor/paging"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

}
