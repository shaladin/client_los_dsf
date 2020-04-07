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
  LeadId: any;
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
  assetConditionObj: any;
  returnAssetConditionObj: any;
  downPaymentObj: any;
  returnDownPaymentObj: any;
  InputLookupAssetObj: any;
  LeadDataForm = this.fb.group({
    FullAssetCode: [''],
    FullAssetName: [''],
    MrAssetConditionCode: [''],
    MrDownPaymentTypeCode: [''],
    ManufacturingYear: [''],
    AssetPrice: [''],
    DownPayment: [''],
    LicensePlate: [''],

    Tenor:[''],
    FirstInstallment: [''],
    NTFAmt: [''],
    TotalDownPayment: [''],
    InstallmentAmt:['']

  });

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    // this.getCustById = AdInsConstant.GetCustByCustId;
    this.getListActiveRefMaster = AdInsConstant.GetListActiveRefMaster;
    // this.addJobData = AdInsConstant.AddCustPersonalJobData;
    // this.editJobData = AdInsConstant.EditCustPersonalJobData;
    // this.getJobDataByCustId = AdInsConstant.GetCustPersonalJobDataByCustId;
    // this.getCustAddr = AdInsConstant.GetCustAddr;
    // this.getRefProfession = AdInsConstant.GetRefProfessionById;
    // this.getRefIndustryType = AdInsConstant.GetRefIndustryTypeById;

    this.route.queryParams.subscribe(params => {
        if (params["LeadId"] != null) {
            this.LeadId = params["LeadId"];
        }
    });
  }

  // getLookUpProfession(event) {
  //   this.tempProfession = event.RefProfessionId;
  // }

  SetAsset(event) {
    this.LeadDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName
    });
  }

  ngOnInit() {
    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.assetConditionObj = new RefMasterObj();
    this.assetConditionObj.RefMasterTypeCode = "ASSET_CONDITION";
    this.http.post(this.getListActiveRefMaster, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response["ReturnObject"];
        console.log("aaa")
        console.log(this.returnAssetConditionObj)
        if(this.returnAssetConditionObj.length > 0){
          this.LeadDataForm.patchValue({
            MrAssetConditionCode: this.returnAssetConditionObj[0].Key
          });
        }
        //this.LeadDataForm.patchValue({ MrAssetConditionCode: response['ReturnObject'][0]['Key'] });
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = "DOWN_PAYMENT_TYPE";
    this.http.post(this.getListActiveRefMaster, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response["ReturnObject"];
        console.log("bbb")
        console.log(this.returnDownPaymentObj)
        this.LeadDataForm.patchValue({ MrDownPaymentTypeCode: response['ReturnObject'][0]['Key'] });
      }
    );

  }
  
  // setCustJobData(){
  //   this.custPersonalJobDataObj.CustId = this.IdCust;
  //   this.custPersonalJobDataObj.RefProfessionId = this.tempProfession;
  //   this.custPersonalJobDataObj.MrJobPositionCode = this.JobDataEmpForm.controls["JobPosition"].value;
  //   this.custPersonalJobDataObj.JobTitleName = this.JobDataEmpForm.controls["JobTitleName"].value;
  //   this.custPersonalJobDataObj.MrJobStatCode = this.JobDataEmpForm.controls["JobStatus"].value;
  //   this.custPersonalJobDataObj.CoyName = this.JobDataEmpForm.controls["IndustryName"].value;
  //   this.custPersonalJobDataObj.IsMfEmp = this.JobDataEmpForm.controls["InternalEmployee"].value;
  //   this.custPersonalJobDataObj.RefIndustryTypeId = this.tempRefIndustryType;
  //   this.custPersonalJobDataObj.MrCoyScaleCode = this.JobDataEmpForm.controls["CompanyScale"].value;
  //   this.custPersonalJobDataObj.EmploymentEstablishmentDt = this.JobDataEmpForm.controls["EmpEstablishmentDate"].value;
  //   this.custPersonalJobDataObj.OthBizName = this.JobDataEmpForm.controls["OtherBusinessName"].value;
  //   this.custPersonalJobDataObj.OthBizType = this.JobDataEmpForm.controls["OtherBusinessType"].value;
  //   this.custPersonalJobDataObj.OthBizIndustryTypeCode = this.JobDataEmpForm.controls["OtherBusinessIndustry"].value;
  //   this.custPersonalJobDataObj.OthBizJobPosition = this.JobDataEmpForm.controls["OtherJobPosition"].value;
  //   this.custPersonalJobDataObj.OthBizEstablishmentDt = this.JobDataEmpForm.controls["EstablishmentDate"].value;
  // }

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
