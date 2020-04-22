import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataCompanyObj } from 'app/shared/model/CustDataCompanyObj.Model';
import { WizardComponent } from 'angular-archwizard';
import { CustJobDataComponent } from 'app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/job-data/cust-job-data.component';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [NGXToastrService]
})
export class CustomerDataComponent implements OnInit {
  @Input() LeadId: any;
  @ViewChild(CustJobDataComponent) custJobDataComponent;

  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  custDataObj: CustDataObj;
  custDataPersonalObj: CustDataPersonalObj = new CustDataPersonalObj();
  custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;
  residenceAddrObj: AddrObj;
  inputFieldResidenceObj: InputFieldObj;
  copyFromResidence: any;

  MaritalStatObj: any;
  MrCustTypeCode: string = "PERSONAL";
  MrCustModelCode: string;
  defCustModelCode: string;
  IdTypeList: any;

  copyToResidenceTypeObj: any = [
    {
    Key: "LEGAL",
    Value: "Legal"
    },
  ];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
              private http: HttpClient, private toastr: NGXToastrService, private wizard: WizardComponent) { }

  ngOnInit() {
    console.log(this.LeadId);
    this.bindUcLookup();
    this.bindMaritalStatObj();
    this.bindCustomerData();
    this.initAddrObj();
  }

  CustMainDataForm = this.fb.group({
    BirthPlace: ['', [Validators.required]],
    BirthDt: ['', [Validators.required]],
    MrIdType: ['', [Validators.required]],
    IdNo: [''],
    MotherMaidenName: ['', [Validators.required]],
    TaxIdNo: ['', [Validators.required]],
    MrMaritalStatCode: ['', [Validators.required]],
    MobilePhnNo1: ['', [Validators.required]],
    MobilePhnNo2: [''],
    Email: ['', [Validators.required]],

    CopyFromResidence: [''],

    Facebook: [''],
    Instagram: [''],
    Twitter: [''],
    RowVersion: ['']
  })

  bindUcLookup()
  {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupCustomer.json";
    this.inputLookupObj.isReadonly = true;

    if (this.MrCustTypeCode == 'Personal' || this.MrCustTypeCode == 'PERSONAL')
      this.setCriteriaLookupCustomer(AdInsConstant.CustTypePersonal);
    else if (this.MrCustTypeCode == 'Company' || this.MrCustTypeCode == 'COMPANY')
    this.setCriteriaLookupCustomer(AdInsConstant.CustTypeCompany);
  }

  setCriteriaLookupCustomer(custTypeCode){
    var arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MR_CUST_TYPE_CODE';
    critObj.value = custTypeCode;
    arrCrit.push(critObj);
    this.inputLookupObj.addCritInput = arrCrit;
  }

  getLookupCustomerResponse(e) {
    this.CustMainDataForm.patchValue({
      CustName: e.CustName
    });
  }

  bindCustomerData()
  {
    var refMasterObj = { RefMasterTypeCode: 'ID_TYPE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe((response) => {
      this.IdTypeList = response['ReturnObject'];
      this.CustMainDataForm.patchValue({
        MrIdType: this.IdTypeList[0].Key
      });
    })
  }

  bindMaritalStatObj(){
    var refMasterObj = { RefMasterTypeCode: "MARITAL_STAT" };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.MaritalStatObj = response["ReturnObject"];
        if(this.MaritalStatObj.length > 0){
          this.CustMainDataForm.patchValue({
            MrMaritalStatCode: this.MaritalStatObj[0].Key
          });
        }
      }
    );
  }

  initAddrObj(){
    this.initAddrLegalObj();
    this.initAddrResidenceObj();
  }

  initAddrLegalObj(){
    this.legalAddrObj = new AddrObj();
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
  }

  initAddrResidenceObj(){
    this.residenceAddrObj = new AddrObj();
    this.inputFieldResidenceObj = new InputFieldObj();
    this.inputFieldResidenceObj.inputLookupObj = new InputLookupObj();
  }

  copyToResidence(){
    if(this.copyFromResidence == AdInsConstant.AddrTypeLegal){
      this.residenceAddrObj.Addr = this.CustMainDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.residenceAddrObj.AreaCode1 = this.CustMainDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.residenceAddrObj.AreaCode2 = this.CustMainDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.residenceAddrObj.AreaCode3 = this.CustMainDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.residenceAddrObj.AreaCode4 = this.CustMainDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.residenceAddrObj.City = this.CustMainDataForm.controls["legalAddr"]["controls"].City.value;
      this.residenceAddrObj.Fax = this.CustMainDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.residenceAddrObj.FaxArea = this.CustMainDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.residenceAddrObj.Phn1 = this.CustMainDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.residenceAddrObj.Phn2 = this.CustMainDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.residenceAddrObj.PhnArea1 = this.CustMainDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.residenceAddrObj.PhnArea2 = this.CustMainDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.residenceAddrObj.PhnExt1 = this.CustMainDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.residenceAddrObj.PhnExt2 = this.CustMainDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      
      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.CustMainDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = {Zipcode: this.CustMainDataForm.controls["legalAddrZipcode"]["controls"].value.value};
    }
  }

  SaveLead()
  {
    this.wizard.goToNextStep();
  }
}
