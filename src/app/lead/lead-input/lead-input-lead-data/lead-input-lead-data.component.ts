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
 
@Component({
  selector: 'app-lead-input-lead-data',
  templateUrl: './lead-input-lead-data.component.html',
  providers: [NGXToastrService]
})

export class LeadInputLeadDataComponent implements OnInit {
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
  inputJobAddressObj: InputFieldObj;
  inputOtherAddressObj: InputFieldObj;
  jobStatus: any;
  listJobStatus: any;
  jobPosition: any;
  listJobPosition: any;
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
  addressObj: any;
  otherAddrObj: any;
  CustomerDataForm = this.fb.group({
    JobDataType: [''],
    ProfessionName: [''],
    JobPosition: [''],
    JobTitleName: [''],
    JobStatus: [''],
    IndustryName: [''],
    InternalEmployee: [false],
    IndustryTypeName: [''],
    CompanyScale: [''],
    EmpEstablishmentDate: [''],
    NotesJob: [''],
    LocationClass: [''],
    PriceEstimates: [''],
    StayLength: [''],
    OtherBusinessName: [''],
    OtherBusinessType: [''],
    OtherBusinessIndustry: [''],
    OtherJobPosition: [''],
    EstablishmentDate: [''],
    NotesOther: [''],
    OtherLocationClass: [''],
    OtherPriceEstimates: [''],
    OtherStayLength: ['']
  });

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder,private wizard: WizardComponent) { 
    // this.getCustById = AdInsConstant.GetCustByCustId;
    // this.getListActiveRefMaster = AdInsConstant.GetListActiveRefMaster;
    // this.addJobData = AdInsConstant.AddCustPersonalJobData;
    // this.editJobData = AdInsConstant.EditCustPersonalJobData;
    // this.getJobDataByCustId = AdInsConstant.GetCustPersonalJobDataByCustId;
    // this.getCustAddr = AdInsConstant.GetCustAddr;
    // this.getRefProfession = AdInsConstant.GetRefProfessionById;
    // this.getRefIndustryType = AdInsConstant.GetRefIndustryTypeById;

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
    this.tempProfession = event.RefProfessionId;
  }

  ngOnInit() {
    this.inputJobAddressObj = new InputFieldObj();
    this.inputJobAddressObj.inputLookupObj = new InputLookupObj();
    this.inputOtherAddressObj = new InputFieldObj();
    this.inputOtherAddressObj.inputLookupObj = new InputLookupObj();

    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/lookup/lookupCustomerProfession.json";
    this.professionLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.professionLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.professionLookUpObj.pagingJson = "./assets/lookup/lookupCustomerProfession.json";
    this.professionLookUpObj.genericJson = "./assets/lookup/lookupCustomerProfession.json";

    this.jobPosition = new RefMasterObj();
    this.jobPosition.RefMasterTypeCode = "JOB_POSITION";
    this.http.post(this.getListActiveRefMaster, this.jobPosition).subscribe(
    (response) => {
        this.listJobPosition = response['ReturnObject'];
        this.CustomerDataForm.patchValue({ JobPosition: response['ReturnObject'][0]['Key'] });
    });

  }

  setJobAddr(){
    // this.jobAddressObj.CustId = this.IdCust;
    // this.jobAddressObj.MrCustAddrTypeCode = 'JOB';
    // this.jobAddressObj.Addr = this.JobDataEmpForm.controls["jobAddress"]["controls"].Addr.value;
    // this.jobAddressObj.FullAddr = this.JobDataEmpForm.controls["jobAddress"]["controls"].Addr.value;
    // this.jobAddressObj.AreaCode3 = this.JobDataEmpForm.controls["jobAddress"]["controls"].AreaCode3.value;
    // this.jobAddressObj.AreaCode4 = this.JobDataEmpForm.controls["jobAddress"]["controls"].AreaCode4.value;
    // this.jobAddressObj.Zipcode = this.JobDataEmpForm.controls["jobAddressZipcode"]["controls"].value.value;
    // this.jobAddressObj.AreaCode1 = this.JobDataEmpForm.controls["jobAddress"]["controls"].AreaCode1.value;
    // this.jobAddressObj.AreaCode2 = this.JobDataEmpForm.controls["jobAddress"]["controls"].AreaCode2.value;
    // this.jobAddressObj.City = this.JobDataEmpForm.controls["jobAddress"]["controls"].City.value;
    // this.jobAddressObj.PhnArea1 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnArea1.value;
    // this.jobAddressObj.Phn1 = this.JobDataEmpForm.controls["jobAddress"]["controls"].Phn1.value;
    // this.jobAddressObj.PhnExt1 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnExt1.value;
    // this.jobAddressObj.PhnArea2 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnArea2.value;
    // this.jobAddressObj.Phn2 = this.JobDataEmpForm.controls["jobAddress"]["controls"].Phn2.value;
    // this.jobAddressObj.PhnExt2 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnExt2.value;
    // this.jobAddressObj.PhnArea3 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnArea3.value;
    // this.jobAddressObj.Phn3 = this.JobDataEmpForm.controls["jobAddress"]["controls"].Phn3.value;
    // this.jobAddressObj.PhnExt3 = this.JobDataEmpForm.controls["jobAddress"]["controls"].PhnExt3.value;
    // this.jobAddressObj.FaxArea = this.JobDataEmpForm.controls["jobAddress"]["controls"].FaxArea.value;
    // this.jobAddressObj.Fax = this.JobDataEmpForm.controls["jobAddress"]["controls"].Fax.value;
    // this.jobAddressObj.MrBuildingOwnershipCode = this.JobDataEmpForm.controls["jobAddress"]["controls"].MrHouseOwnershipCode.value;
    // this.jobAddressObj.Notes = this.JobDataEmpForm.controls["NotesJob"].value;
  }

  setOthBizAddr(){
    // this.otherAddressObj.CustId = this.IdCust;
    // this.otherAddressObj.MrCustAddrTypeCode = 'OTH_BIZ';
    // this.otherAddressObj.Addr = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Addr.value;
    // this.otherAddressObj.FullAddr = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Addr.value;
    // this.otherAddressObj.AreaCode3 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].AreaCode3.value;
    // this.otherAddressObj.AreaCode4 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].AreaCode4.value;
    // this.otherAddressObj.Zipcode = this.JobDataEmpForm.controls["otherBusinessAddressZipcode"]["controls"].value.value;
    // this.otherAddressObj.AreaCode1 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].AreaCode1.value;
    // this.otherAddressObj.AreaCode2 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].AreaCode2.value;
    // this.otherAddressObj.City = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].City.value;
    // this.otherAddressObj.PhnArea1 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnArea1.value;
    // this.otherAddressObj.Phn1 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Phn1.value;
    // this.otherAddressObj.PhnExt1 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnExt1.value;
    // this.otherAddressObj.PhnArea2 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnArea2.value;
    // this.otherAddressObj.Phn2 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Phn2.value;
    // this.otherAddressObj.PhnExt2 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnExt2.value;
    // this.otherAddressObj.PhnArea3 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnArea3.value;
    // this.otherAddressObj.Phn3 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Phn3.value;
    // this.otherAddressObj.PhnExt3 = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].PhnExt3.value;
    // this.otherAddressObj.FaxArea = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].FaxArea.value;
    // this.otherAddressObj.Fax = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].Fax.value;
    // this.otherAddressObj.MrBuildingOwnershipCode = this.JobDataEmpForm.controls["otherBusinessAddress"]["controls"].MrHouseOwnershipCode.value;
    // this.otherAddressObj.Notes = this.JobDataEmpForm.controls["NotesOther"].value;
  }
  
  setCustJobData(){
    // this.custPersonalJobDataObj.CustId = this.IdCust;
    // this.custPersonalJobDataObj.RefProfessionId = this.tempProfession;
    // this.custPersonalJobDataObj.MrJobPositionCode = this.JobDataEmpForm.controls["JobPosition"].value;
    // this.custPersonalJobDataObj.JobTitleName = this.JobDataEmpForm.controls["JobTitleName"].value;
    // this.custPersonalJobDataObj.MrJobStatCode = this.JobDataEmpForm.controls["JobStatus"].value;
    // this.custPersonalJobDataObj.CoyName = this.JobDataEmpForm.controls["IndustryName"].value;
    // this.custPersonalJobDataObj.IsMfEmp = this.JobDataEmpForm.controls["InternalEmployee"].value;
    // this.custPersonalJobDataObj.RefIndustryTypeId = this.tempRefIndustryType;
    // this.custPersonalJobDataObj.MrCoyScaleCode = this.JobDataEmpForm.controls["CompanyScale"].value;
    // this.custPersonalJobDataObj.EmploymentEstablishmentDt = this.JobDataEmpForm.controls["EmpEstablishmentDate"].value;
    // this.custPersonalJobDataObj.OthBizName = this.JobDataEmpForm.controls["OtherBusinessName"].value;
    // this.custPersonalJobDataObj.OthBizType = this.JobDataEmpForm.controls["OtherBusinessType"].value;
    // this.custPersonalJobDataObj.OthBizIndustryTypeCode = this.JobDataEmpForm.controls["OtherBusinessIndustry"].value;
    // this.custPersonalJobDataObj.OthBizJobPosition = this.JobDataEmpForm.controls["OtherJobPosition"].value;
    // this.custPersonalJobDataObj.OthBizEstablishmentDt = this.JobDataEmpForm.controls["EstablishmentDate"].value;
  }

  back(){
    this.wizard.goToPreviousStep();
  }

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
