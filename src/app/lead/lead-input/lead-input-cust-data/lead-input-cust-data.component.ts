import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { WizardComponent } from 'angular-archwizard';
import { formatDate } from '@angular/common';
import { LeadCustAddrObj } from 'app/shared/model/LeadCustAddrObj.Model';
 
@Component({
  selector: 'app-lead-input-cust-data',
  templateUrl: './lead-input-cust-data.component.html',
  providers: [NGXToastrService]
})

export class LeadInputCustDataComponent implements OnInit {
  jobAddrId: any;
  othBizAddrId: any;
  jobDataId: any;
  rowVersion: any;
  typePage: string;
  IdCust: any;
  IdCustPersonal: any;
  custObj: any;
  getListActiveRefMaster: any;
  getCustById: any;
  jobAddressObj: any;
  otherAddressObj: any;
  inputLegalAddressObj: InputFieldObj;
  inputResidenceAddressObj: InputFieldObj;
  jobStatus: any;
  listJobStatus: any;
  companyScale: any;
  listCompanyScale: any;
  tempProfession: any;
  tempRefIndustryType: any;
  professionLookUpObj: any;
  industryLookUpObj: any;
  custPersonalJobDataObj: any;
  custJobDataObj: any;
  returnCustJobDataObj: any;
  addJobData: any;
  editJobData: any;
  getJobDataByCustId: any;
  getCustAddr: any;
  getRefProfession: any;
  getRefIndustryType: any;
  refProfessionObj: any;
  returnRefProfessionObj: any;
  reqCustPersonalJobDataObj: any;
  refIndustryTypeObj: any;
  returnIndustryTypeObj: any;
  custJobAddrObj: any;
  custOthBizAddrObj;
  getJobAddr: any;
  getOthBizAddr: any;
  legalAddressObj: any;
  residenceAddressObj: any;
  otherAddrObj: any;
  idTypeCode: any;
  tempIdType: any;
  maritalStatCode: any;
  tempMrMaritalStatCode: any;
  getListActiveRefMasterUrl: string;
  getRefMasterWithReserveField: any;
  custModel: any;
  listCustModel: any;
  CustomerDataForm = this.fb.group({
    CustType: [''],
    CustName: [''],
    BirthPlace: [''],
    BirthDate: [''],
    MrIdTypeCode: [''],
    MotherName: [''],
    IdNo: [''],
    MrMaritalStatCode: [''],
    Npwp: [''],
    Email: [''],
    MobilePhone1: [''],
    MobilePhone2: [''],
    Facebook: [''],
    Instagram: [''],
    Twitter: [''],
    CustModel: [''],
    CompanyName: [''],
    MonthlyIncome: [''],
    MonthlyExpense: ['']
  });

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    // this.getCustById = AdInsConstant.GetCustByCustId;
    // this.getListActiveRefMaster = AdInsConstant.GetListActiveRefMaster;
    // this.addJobData = AdInsConstant.AddCustPersonalJobData;
    // this.editJobData = AdInsConstant.EditCustPersonalJobData;
    // this.getJobDataByCustId = AdInsConstant.GetCustPersonalJobDataByCustId;
    // this.getCustAddr = AdInsConstant.GetCustAddr;
    // this.getRefProfession = AdInsConstant.GetRefProfessionById;
    // this.getRefIndustryType = AdInsConstant.GetRefIndustryTypeById;
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefMasterWithReserveField = AdInsConstant.GetListActiveRefMasterWithReserveFieldAll;

    this.route.queryParams.subscribe(params => {
        if (params["IdCust"] != null) {
            this.IdCust = params["IdCust"];
        }
        if (params["IdCustPersonal"] != null) {
            this.IdCustPersonal = params["IdCustPersonal"];
        }
    });
  }

  getLookUpProfession(event) {
    this.tempProfession = event.ProfessionCode;
  }

  ngOnInit() {
    this.inputLegalAddressObj = new InputFieldObj();
    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
    this.inputResidenceAddressObj = new InputFieldObj();
    this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();

    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.professionLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.professionLookUpObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.genericJson = "./assets/uclookup/lookupProfession.json";

    this.idTypeCode = new RefMasterObj();
    this.idTypeCode.RefMasterTypeCode = "ID_TYPE";
    this.http.post(this.getListActiveRefMasterUrl, this.idTypeCode).subscribe(
    (response) => {
        this.tempIdType = response['ReturnObject'];
        this.CustomerDataForm.patchValue({ MrIdTypeCode: response['ReturnObject'][0]['Key'] });
    });

    this.maritalStatCode = new RefMasterObj();
    this.maritalStatCode.RefMasterTypeCode = "MARITAL_STAT";
    this.http.post(this.getListActiveRefMasterUrl, this.maritalStatCode).subscribe(
      (response) => {
          this.tempMrMaritalStatCode = response["ReturnObject"];
          this.CustomerDataForm.patchValue({ MrMaritalStatCode: response['ReturnObject'][0]['Key'] });
        // if (this.tempCustPersonalObj.MrMaritalStatCode != null) {
        //   this.CustomerDataForm.patchValue({
        //     MrMaritalStatCode: this.tempCustPersonalObj.MrMaritalStatCode
        //   });
        // } else {
        //   this.CustomerDataForm.patchValue({
        //     MrMaritalStatCode: response['ReturnObject'][0]['Key']
        //   });
        // }
      }
    );

    this.custModel = new RefMasterObj();
    this.custModel.RefMasterTypeCode = "CUST_MODEL";
    this.custModel.ReserveField1 = "PERSONAL";
    this.http.post(this.getRefMasterWithReserveField, this.custModel).subscribe(
      (response) => {
          this.listCustModel = response['ReturnObject'];
          this.CustomerDataForm.patchValue({ CustModel: response['ReturnObject'][0]['Key'] });
      });

  }

  copyAddress(){
    this.residenceAddressObj = new LeadCustAddrObj();
    this.residenceAddressObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.residenceAddressObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.residenceAddressObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.residenceAddressObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.residenceAddressObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.residenceAddressObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.residenceAddressObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.residenceAddressObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.residenceAddressObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.residenceAddressObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.residenceAddressObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.residenceAddressObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.residenceAddressObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.residenceAddressObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.residenceAddressObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;

    this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.inputResidenceAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value};
 
  }

  setLegalAddr(){
    this.legalAddressObj = new LeadCustAddrObj();
    this.legalAddressObj.MrCustAddrTypeCode = "LEGAL"
    this.legalAddressObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.legalAddressObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.legalAddressObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.legalAddressObj.Zipcode = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.legalAddressObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.legalAddressObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.legalAddressObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.legalAddressObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.legalAddressObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.legalAddressObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.legalAddressObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.legalAddressObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.legalAddressObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.legalAddressObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.legalAddressObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.legalAddressObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setResidenceAddr(){
    this.residenceAddressObj = new LeadCustAddrObj();
    this.residenceAddressObj.MrCustAddrTypeCode = "RESIDENCE"
    this.residenceAddressObj.Addr = this.CustomerDataForm.controls["residenceAddress"]["controls"].Addr.value;
    this.residenceAddressObj.AreaCode3 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode3.value;
    this.residenceAddressObj.AreaCode4 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode4.value;
    this.residenceAddressObj.Zipcode = this.CustomerDataForm.controls["residenceAddressZipcode"]["controls"].value.value;
    this.residenceAddressObj.AreaCode1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode1.value;
    this.residenceAddressObj.AreaCode2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode2.value;
    this.residenceAddressObj.City = this.CustomerDataForm.controls["residenceAddress"]["controls"].City.value;
    this.residenceAddressObj.PhnArea1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea1.value;
    this.residenceAddressObj.Phn1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn1.value;
    this.residenceAddressObj.PhnExt1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt1.value;
    this.residenceAddressObj.PhnArea2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea2.value;
    this.residenceAddressObj.Phn2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn2.value;
    this.residenceAddressObj.PhnExt2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt2.value;
    this.residenceAddressObj.FaxArea = this.CustomerDataForm.controls["residenceAddress"]["controls"].FaxArea.value;
    this.residenceAddressObj.Fax = this.CustomerDataForm.controls["residenceAddress"]["controls"].Fax.value;
    this.residenceAddressObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["residenceAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  // back(){
  //   this.wizard.goToPreviousStep();
  // }

  SaveForm(){
  //   if(this.typePage == "edit") {
  //     this.reqCustPersonalJobDataObj = new RequestCustPersonalJobDataObj;
  //     this.custPersonalJobDataObj = new CustPersonalJobDataObj();
  //     this.jobAddressObj = new CustAddrObj;
  //     this.otherAddressObj = new CustAddrObj;
  //     this.setCustJobData();
  //     this.custPersonalJobDataObj.OthBizAddrId = this.othBizAddrId
  //     this.custPersonalJobDataObj.JobAddrId = this.jobAddrId;
  //     this.custPersonalJobDataObj.CustPersonalJobDataId = this.jobDataId;
  //     this.custPersonalJobDataObj.RowVersion = this.rowVersion;
  //     this.jobAddressObj.MrCustAddrTypeCode = 'JOB';
  //     this.otherAddressObj.MrCustAddrTypeCode = 'OTH_BIZ';
  //     this.reqCustPersonalJobDataObj.CustPersonalJobData = this.custPersonalJobDataObj;
  //     this.reqCustPersonalJobDataObj.JobAddr = this.jobAddressObj;
  //     this.reqCustPersonalJobDataObj.OthBizAddr = this.otherAddressObj;

  //     console.log("ccc");
  //     console.log(this.reqCustPersonalJobDataObj)

  //     this.http.post(this.editJobData, this.reqCustPersonalJobDataObj).subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.toastr.successMessage(response["message"]);
  //         // this.router.navigate(
  //         //   ["/Customer/CustomerPersonal/Address"], 
  //         //   { queryParams: { "IdCust": this.IdCust }}
  //         //   );
  //         // console.log(response);
  //         this.wizard.goToNextStep();
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   } else {
  //     this.reqCustPersonalJobDataObj = new RequestCustPersonalJobDataObj;
  //     this.custPersonalJobDataObj = new CustPersonalJobDataObj();
  //     this.setCustJobData();
  //     this.jobAddressObj = new CustAddrObj;
  //     this.setJobAddr();
  //     this.otherAddressObj = new CustAddrObj;
  //     this.setOthBizAddr();
  //     this.reqCustPersonalJobDataObj.CustPersonalJobData = this.custPersonalJobDataObj;
  //     this.reqCustPersonalJobDataObj.JobAddr = this.jobAddressObj;
  //     this.reqCustPersonalJobDataObj.OthBizAddr = this.otherAddressObj;

  //     console.log("ccc");
  //     console.log(this.reqCustPersonalJobDataObj)

  //     this.http.post(this.addJobData, this.reqCustPersonalJobDataObj).subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.toastr.successMessage(response["message"]);
  //         // this.router.navigate(
  //         //   ["/Customer/CustomerPersonal/Address"], 
  //         //   { queryParams: { "IdCust": this.IdCust }}
  //         //   );
  //         // console.log(response);
  //         this.wizard.goToNextStep();
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   }
   }
}
