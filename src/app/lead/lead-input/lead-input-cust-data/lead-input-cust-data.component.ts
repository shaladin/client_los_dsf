import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { LeadCustSocmedObj } from 'app/shared/model/LeadCustSocmedObj.Model';
import { LeadInputObj } from 'app/shared/model/LeadInputObj.Model';
import { LeadCustObj } from 'app/shared/model/LeadCustObj.Model';
import { LeadCustPersonalObj } from 'app/shared/model/LeadCustPersonalObj.Model';
import { LeadCustPersonalFinDataObj } from 'app/shared/model/LeadCustPersonalFinDataObj.Model';
import { LeadCustPersonalJobDataObj } from 'app/shared/model/LeadCustPersonalJobDataObj.Model';
import { RefProfessionObj } from 'app/shared/model/RefProfessionObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
 
@Component({
  selector: 'app-lead-input-cust-data',
  templateUrl: './lead-input-cust-data.component.html',
  providers: [NGXToastrService]
})

export class LeadInputCustDataComponent implements OnInit {
  @Input() LeadId: number;

  CopyFrom: any;
  jobAddrId: any;
  othBizAddrId: any;
  jobDataId: any;
  rowVersion: any;
  typePage: string;
  //LeadId: any;
  addEditLeadCustPersonal: any;
  jobAddressObj: any;
  otherAddressObj: any;
  inputLegalAddressObj: InputFieldObj;
  inputResidenceAddressObj: InputFieldObj;
  tempProfession: any;
  professionLookUpObj: any;
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
  leadInputObj: LeadInputObj = new LeadInputObj();
  leadCustObj: any;
  leadCustPersonalObj: any;
  leadCustPersonalJobDataObj: any;
  leadCustPersonalFinDataObj: any;
  leadCustFacebookObj: any;
  leadCustInstagramObj: any;
  leadCustTwitterObj: any;
  genderType: any;
  tempGender: any;
  getLeadByLeadId: any;
  getLeadCustByLeadId: any;
  getLeadCustAddr: any;
  getLeadCustPersonal: any;
  getLeadCustPersonalFinData: any;
  getLeadCustPersonalJobData: any;
  getRefProfessionByCode: any;
  getListLeadCustSocmed: any;
  reqLeadCustObj: any;
  resLeadCustObj: any;
  reqLeadCustPersonalObj: any;
  resLeadCustPersonalObj: any;
  reqLeadCustPersonalJobDataObj: any;
  resLeadCustPersonalJobDataObj: any;
  reqLeadCustPersonalFinDataObj: any;
  resLeadCustPersonalFinDataObj: any;
  reqLeadCustAddrLegalObj: any;
  resLeadCustAddrLegalObj: any;
  reqLeadCustAddrResObj: any;
  resLeadCustAddrResObj: any;
  refProfessionObj: any;
  returnRefProfessionObj: any;
  reqLeadCustSocmedObj: any;
  resLeadCustSocmedObj: any;
  arrAddCrit: any;
  CustModelKey: string;
  CustomerDataForm = this.fb.group({
    CustType: [''],
    Gender: [''],
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
    MonthlyIncome: [0],
    MonthlyExpense: [0]
  });

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder, private wizard: WizardComponent) { 
    this.getListActiveRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
    this.getRefMasterWithReserveField = AdInsConstant.GetListActiveRefMasterWithReserveFieldAll;
    this.addEditLeadCustPersonal = AdInsConstant.AddEditLeadCustPersonal;
    this.getLeadByLeadId = AdInsConstant.GetLeadByLeadId;
    this.getLeadCustByLeadId = AdInsConstant.GetLeadCustByLeadId;
    this.getLeadCustAddr = AdInsConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode;
    this.getLeadCustPersonal = AdInsConstant.GetLeadCustPersonalByLeadCustId;
    this.getLeadCustPersonalFinData = AdInsConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId;
    this.getLeadCustPersonalJobData = AdInsConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId;
    this.getRefProfessionByCode = AdInsConstant.GetRefProfessionByCode;
    this.getListLeadCustSocmed = AdInsConstant.GetListLeadCustSocmedByLeadCustId;

    this.route.queryParams.subscribe(params => {
        if (params["LeadId"] != null) {
          this.LeadId = params["LeadId"];
        }
        if (params["mode"] != null) {
          this.typePage = params["mode"];
        }
        if (params["CopyFrom"] != null) {
          this.CopyFrom = params["CopyFrom"];
        }
    });
  }

  getLookUpProfession(event) {
    this.tempProfession = event.ProfessionCode;
  }

  custModelChange(event) {
    this.CustModelKey =  this.listCustModel.find(x => x.Key == event.target.value).Key;
  }

  ngOnInit() {
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.LeadId;
      this.http.post(this.getLeadCustByLeadId, this.reqLeadCustObj).subscribe(
        (response) => { 
            this.resLeadCustObj = response;
            console.log("ccc")
            console.log(this.resLeadCustObj)
            if(this.resLeadCustObj.LeadCustId != 0)
            {
              this.CustomerDataForm.patchValue({ 
                CustName: this.resLeadCustObj.CustName,
                MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
                CustModel: this.resLeadCustObj.MrCustModelCode,
                IdNo: this.resLeadCustObj.IdNo,
                Npwp: this.resLeadCustObj.TaxIdNo,
              });
              // this.typePage = "edit";
              this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
              this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
              this.http.post(this.getListLeadCustSocmed, this.reqLeadCustSocmedObj).subscribe(
                (response) => {
                    this.resLeadCustSocmedObj = response["ReturnObject"];
                    console.log("aaa")
                    console.log(this.resLeadCustSocmedObj)
                    this.CustomerDataForm.patchValue({
                      Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                      Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                      Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
                    });
                });
    
              this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
              this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
              this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = "LEGAL";
              this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
                (response) => {
                    this.resLeadCustAddrLegalObj = response;
      
                    this.legalAddressObj = new LeadCustAddrObj();
                    this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
                    this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
                    this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
                    this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
                    this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
                    this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
                    this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
                    this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
                    this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
                    this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
                    this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
                    this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
                    this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
                    this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
                    this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;
      
                    this.inputLegalAddressObj = new InputFieldObj();
                    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
                    this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
                    this.inputLegalAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrLegalObj.Zipcode};
                    
                });
      
                this.reqLeadCustAddrResObj = new LeadCustAddrObj();
                this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
                this.reqLeadCustAddrResObj.MrCustAddrTypeCode = "RESIDENCE";
                this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
                  (response) => {
                      this.resLeadCustAddrResObj = response;
      
                      this.residenceAddressObj = new LeadCustAddrObj();
                      this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
                      this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
                      this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
                      this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
                      this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
                      this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
                      this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
                      this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
                      this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
                      this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
                      this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
                      this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
                      this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
                      this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
                      this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;
      
                      this.inputResidenceAddressObj = new InputFieldObj();
                      this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
                      this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
                      this.inputResidenceAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrResObj.Zipcode};
                      
                  });
    
                this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
                this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
                console.log("aaa");
                this.http.post(this.getLeadCustPersonal, this.reqLeadCustPersonalObj).subscribe(
                  (response) => {
                      this.resLeadCustPersonalObj = response;
                      this.CustomerDataForm.patchValue({ 
                        Gender: this.resLeadCustPersonalObj.MrGenderCode,
                        BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                        BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                        MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                        MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                        Email: this.resLeadCustPersonalObj.Email1,
                        MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                        MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
                      });
    
                  this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
                  this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                  this.http.post(this.getLeadCustPersonalJobData, this.reqLeadCustPersonalJobDataObj).subscribe(
                    (response) => {
                        this.resLeadCustPersonalJobDataObj = response;
                        this.CustomerDataForm.patchValue({ 
                          CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                        });
    
                        this.refProfessionObj = new RefProfessionObj();
                        this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                        this.http.post(this.getRefProfessionByCode, this.refProfessionObj).subscribe(
                          (response) => {
                              this.returnRefProfessionObj = response;
                              this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                              this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                              this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                          });
                    });
    
                  this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
                  this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                  this.http.post(this.getLeadCustPersonalFinData, this.reqLeadCustPersonalFinDataObj).subscribe(
                    (response) => {
                        this.resLeadCustPersonalFinDataObj = response;
                        this.CustomerDataForm.patchValue({ 
                          MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                          MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                        });
                    });
                });
            }
        });

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

    // this.arrAddCrit = new Array();
    // var addCrit = new CriteriaObj();
    // addCrit.DataType = "text";
    // addCrit.propName = "MR_CUST_MODEL_CODE";
    // addCrit.restriction = AdInsConstant.RestrictionEq;
    // addCrit.listValue = [this.CustModelKey];
    // this.arrAddCrit.push(addCrit);
    // this.professionLookUpObj.addCritInput = this.arrAddCrit;

    this.genderType = new RefMasterObj();
    this.genderType.RefMasterTypeCode = "GENDER";
    this.http.post(this.getListActiveRefMasterUrl, this.genderType).subscribe(
      (response) => {
        this.tempGender = response["ReturnObject"];
        this.CustomerDataForm.patchValue({ Gender: this.tempGender[0].Key });
      }
    );

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
          console.log("hhh");
          console.log(this.listCustModel);
          this.CustomerDataForm.patchValue({ CustModel: response['ReturnObject'][0]['Key'] });
      });
    
    if(this.CopyFrom != null){
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.CopyFrom;
      this.http.post(this.getLeadCustByLeadId, this.reqLeadCustObj).subscribe(
        (response) => {
            this.resLeadCustObj = response;
            this.CustomerDataForm.patchValue({ 
              CustName: this.resLeadCustObj.CustName,
              MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
              CustModel: this.resLeadCustObj.MrCustModelCode,
              IdNo: this.resLeadCustObj.IdNo,
              Npwp: this.resLeadCustObj.TaxIdNo,
            });
            
            this.CustModelKey = this.resLeadCustObj.MrCustModelCode;

        this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
        this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.http.post(this.getListLeadCustSocmed, this.reqLeadCustSocmedObj).subscribe(
          (response) => {
              this.resLeadCustSocmedObj = response["ReturnObject"];
              console.log("aaa")
              console.log(this.resLeadCustSocmedObj)
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
              });
          });

        this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
        this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = "LEGAL";
        this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
          (response) => {
              this.resLeadCustAddrLegalObj = response;

              this.legalAddressObj = new LeadCustAddrObj();
              this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
              this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
              this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
              this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
              this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
              this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
              this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
              this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
              this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
              this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
              this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
              this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
              this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
              this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
              this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;

              this.inputLegalAddressObj = new InputFieldObj();
              this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
              this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
              this.inputLegalAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrLegalObj.Zipcode};
              
          });

          this.reqLeadCustAddrResObj = new LeadCustAddrObj();
          this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrResObj.MrCustAddrTypeCode = "RESIDENCE";
          this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
            (response) => {
                this.resLeadCustAddrResObj = response;

                this.residenceAddressObj = new LeadCustAddrObj();
                this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
                this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
                this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
                this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
                this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
                this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
                this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
                this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
                this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
                this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
                this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
                this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
                this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
                this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
                this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;

                this.inputResidenceAddressObj = new InputFieldObj();
                this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
                this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
                this.inputResidenceAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrResObj.Zipcode};
                
            });

          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.http.post(this.getLeadCustPersonal, this.reqLeadCustPersonalObj).subscribe(
            (response) => {
                this.resLeadCustPersonalObj = response;
                this.CustomerDataForm.patchValue({ 
                  Gender: this.resLeadCustPersonalObj.MrGenderCode,
                  BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                  BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                  MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                  MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                  Email: this.resLeadCustPersonalObj.Email1,
                  MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                  MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
                });

              this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
              this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              this.http.post(this.getLeadCustPersonalJobData, this.reqLeadCustPersonalJobDataObj).subscribe(
                (response) => {
                    this.resLeadCustPersonalJobDataObj = response;
                    this.CustomerDataForm.patchValue({ 
                      CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                    });

                    this.refProfessionObj = new RefProfessionObj();
                    this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                    this.http.post(this.getRefProfessionByCode, this.refProfessionObj).subscribe(
                      (response) => {
                          this.returnRefProfessionObj = response;
                          this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                          this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                          this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                      });
                });

              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              this.http.post(this.getLeadCustPersonalFinData, this.reqLeadCustPersonalFinDataObj).subscribe(
                (response) => {
                    this.resLeadCustPersonalFinDataObj = response;
                    this.CustomerDataForm.patchValue({ 
                      MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                      MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                    });
                });
            });
        });
    }

    if(this.typePage == "edit" || this.typePage == "update"){
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.LeadId;
      this.http.post(this.getLeadCustByLeadId, this.reqLeadCustObj).subscribe(
        (response) => {
            this.resLeadCustObj = response;

            if(this.resLeadCustObj.LeadId != 0)
            {
              this.CustomerDataForm.patchValue({ 
                CustName: this.resLeadCustObj.CustName,
                MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
                CustModel: this.resLeadCustObj.MrCustModelCode,
                IdNo: this.resLeadCustObj.IdNo,
                Npwp: this.resLeadCustObj.TaxIdNo,
              });
              
              this.CustModelKey = this.resLeadCustObj.MrCustModelCode;
              console.log("ggg");
              console.log(this.CustModelKey);
  
              this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
              this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
              this.http.post(this.getListLeadCustSocmed, this.reqLeadCustSocmedObj).subscribe(
                (response) => {
                    this.resLeadCustSocmedObj = response["ReturnObject"];
                    console.log("aaa")
                    console.log(this.resLeadCustSocmedObj)
                    this.CustomerDataForm.patchValue({
                      Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                      Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                      Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
                    });
                });
  
              this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
              this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
              this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = "LEGAL";
              this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
                (response) => {
                    this.resLeadCustAddrLegalObj = response;
      
                    this.legalAddressObj = new LeadCustAddrObj();
                    this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
                    this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
                    this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
                    this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
                    this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
                    this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
                    this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
                    this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
                    this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
                    this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
                    this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
                    this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
                    this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
                    this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
                    this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;
      
                    this.inputLegalAddressObj = new InputFieldObj();
                    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
                    this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
                    this.inputLegalAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrLegalObj.Zipcode};
                    
                });
  
                this.reqLeadCustAddrResObj = new LeadCustAddrObj();
                this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
                this.reqLeadCustAddrResObj.MrCustAddrTypeCode = "RESIDENCE";
                this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
                  (response) => {
                      this.resLeadCustAddrResObj = response;
      
                      this.residenceAddressObj = new LeadCustAddrObj();
                      this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
                      this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
                      this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
                      this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
                      this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
                      this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
                      this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
                      this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
                      this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
                      this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
                      this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
                      this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
                      this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
                      this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
                      this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;
      
                      this.inputResidenceAddressObj = new InputFieldObj();
                      this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
                      this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
                      this.inputResidenceAddressObj.inputLookupObj.jsonSelect = {Zipcode: this.resLeadCustAddrResObj.Zipcode};
                      
                  });
  
                this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
                this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
                this.http.post(this.getLeadCustPersonal, this.reqLeadCustPersonalObj).subscribe(
                  (response) => {
                      this.resLeadCustPersonalObj = response;
                      this.CustomerDataForm.patchValue({ 
                        Gender: this.resLeadCustPersonalObj.MrGenderCode,
                        BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                        BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                        MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                        MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                        Email: this.resLeadCustPersonalObj.Email1,
                        MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                        MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
                      });
  
                    this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
                    this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                    this.http.post(this.getLeadCustPersonalJobData, this.reqLeadCustPersonalJobDataObj).subscribe(
                      (response) => {
                          this.resLeadCustPersonalJobDataObj = response;
                          this.CustomerDataForm.patchValue({ 
                            CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                          });
      
                          this.refProfessionObj = new RefProfessionObj();
                          this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                          this.http.post(this.getRefProfessionByCode, this.refProfessionObj).subscribe(
                            (response) => {
                                this.returnRefProfessionObj = response;
                                this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                                this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                                this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                            });
                      });
  
                    this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
                    this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                    this.http.post(this.getLeadCustPersonalFinData, this.reqLeadCustPersonalFinDataObj).subscribe(
                      (response) => {
                          this.resLeadCustPersonalFinDataObj = response;
                          this.CustomerDataForm.patchValue({ 
                            MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                            MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                          });
                      });
              });
            }
            
        });
    }
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
    //this.legalAddressObj = new LeadCustAddrObj();
    this.leadInputObj.LeadCustLegalAddrObj.MrCustAddrTypeCode = "LEGAL"
    this.leadInputObj.LeadCustLegalAddrObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustLegalAddrObj.Zipcode = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustLegalAddrObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustLegalAddrObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustLegalAddrObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustLegalAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setResidenceAddr(){
    //this.residenceAddressObj = new LeadCustAddrObj();
    this.leadInputObj.LeadCustResidenceAddrObj.MrCustAddrTypeCode = "RESIDENCE"
    this.leadInputObj.LeadCustResidenceAddrObj.Addr = this.CustomerDataForm.controls["residenceAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode3 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode4 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Zipcode = this.CustomerDataForm.controls["residenceAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.City = this.CustomerDataForm.controls["residenceAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.FaxArea = this.CustomerDataForm.controls["residenceAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Fax = this.CustomerDataForm.controls["residenceAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustResidenceAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["residenceAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setLeadCust(){
    this.leadInputObj.LeadCustObj.MrCustTypeCode = "PERSONAL";
    this.leadInputObj.LeadCustObj.LeadId = this.LeadId;
    this.leadInputObj.LeadCustObj.CustName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustObj.MrIdTypeCode = this.CustomerDataForm.controls["MrIdTypeCode"].value;
    this.leadInputObj.LeadCustObj.MrCustModelCode = this.CustomerDataForm.controls["CustModel"].value;
    this.leadInputObj.LeadCustObj.IdNo = this.CustomerDataForm.controls["IdNo"].value;
    this.leadInputObj.LeadCustObj.TaxIdNo = this.CustomerDataForm.controls["Npwp"].value;
  }

  setLeadCustPersonal(){
    this.leadInputObj.LeadCustPersonalObj.CustFullName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrGenderCode = this.CustomerDataForm.controls["Gender"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthPlace = this.CustomerDataForm.controls["BirthPlace"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthDt = this.CustomerDataForm.controls["BirthDate"].value;
    this.leadInputObj.LeadCustPersonalObj.MotherMaidenName = this.CustomerDataForm.controls["MotherName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrMaritalStatCode = this.CustomerDataForm.controls["MrMaritalStatCode"].value;
    this.leadInputObj.LeadCustPersonalObj.Email1 = this.CustomerDataForm.controls["Email"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo1 = this.CustomerDataForm.controls["MobilePhone1"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo2 = this.CustomerDataForm.controls["MobilePhone2"].value;
  }

  setLeadCustSocmed(){
    this.leadCustFacebookObj = new LeadCustSocmedObj();
    this.leadCustFacebookObj.MrSocmedCode = "FB";
    this.leadCustFacebookObj.MrSocmedName = "Facebook";
    this.leadCustFacebookObj.SocmedId = this.CustomerDataForm.controls["Facebook"].value;

    this.leadCustInstagramObj = new LeadCustSocmedObj();
    this.leadCustInstagramObj.MrSocmedCode = "IG";
    this.leadCustInstagramObj.MrSocmedName = "Instagram";
    this.leadCustInstagramObj.SocmedId = this.CustomerDataForm.controls["Instagram"].value;

    this.leadCustTwitterObj = new LeadCustSocmedObj();
    this.leadCustTwitterObj.MrSocmedCode = "TW";
    this.leadCustTwitterObj.MrSocmedName = "Twitter";
    this.leadCustTwitterObj.SocmedId = this.CustomerDataForm.controls["Twitter"].value;

    if(this.CustomerDataForm.controls["Facebook"].value != "")
    {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustFacebookObj);
    } 
    if(this.CustomerDataForm.controls["Instagram"].value != "")
    {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustInstagramObj);
    }
    if(this.CustomerDataForm.controls["Twitter"].value != "")
    {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustTwitterObj);
    }
  }

  setLeadCustPersonalJobData(){
    this.leadInputObj.LeadCustPersonalJobDataObj.MrProfessionCode = this.tempProfession;
    this.leadInputObj.LeadCustPersonalJobDataObj.CompanyName = this.CustomerDataForm.controls["CompanyName"].value;
  }

  setLeadCustPersonalFinData(){
    this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustomerDataForm.controls["MonthlyIncome"].value;
    var monthlyExpense = this.CustomerDataForm.controls["MonthlyExpense"].value;
    if(monthlyExpense == ''){
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = 0;
    }
    else{
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = monthlyExpense;
    }
    
  }

  // back(){
  //   this.wizard.goToPreviousStep();
  // }

  SaveForm(){
    if(this.typePage == "edit" || this.typePage == "update") {
      if(this.resLeadCustObj.LeadId != 0 )
      {
        this.leadInputObj = new LeadInputObj();
        this.leadInputObj.LeadCustObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.leadInputObj.LeadCustObj.RowVersion = this.resLeadCustObj.RowVersion;
        this.setLeadCust();
        this.leadInputObj.LeadCustPersonalObj.RowVersion = this.resLeadCustPersonalObj.RowVersion;
        this.setLeadCustPersonal();
        this.setLeadCustSocmed();
        this.leadInputObj.LeadCustLegalAddrObj.RowVersion = this.resLeadCustAddrLegalObj.RowVersion;
        this.setLegalAddr();
        this.leadInputObj.LeadCustResidenceAddrObj.RowVersion = this.resLeadCustAddrResObj.RowVersion;
        this.setResidenceAddr();
        this.leadInputObj.LeadCustPersonalJobDataObj.RowVersion = this.resLeadCustPersonalJobDataObj.RowVersion;
        this.setLeadCustPersonalJobData();
        this.leadInputObj.LeadCustPersonalFinDataObj.RowVersion = this.resLeadCustPersonalFinDataObj.RowVersion;
        this.setLeadCustPersonalFinData();
        this.http.post(this.addEditLeadCustPersonal, this.leadInputObj).subscribe(
          (response) => {
            console.log(response);
            this.toastr.successMessage(response["message"]);
            // this.router.navigate(
            //   ["/Customer/CustomerPersonal/Address"], 
            //   { queryParams: { "IdCust": this.IdCust }}
            //   );
            // console.log(response);
            this.wizard.goToNextStep();
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        this.leadInputObj = new LeadInputObj();
        this.setLeadCust();
        this.setLeadCustPersonal();
        this.setLeadCustSocmed();
        this.setLegalAddr();
        this.setResidenceAddr();
        this.setLeadCustPersonalJobData();
        this.setLeadCustPersonalFinData();
        this.http.post(this.addEditLeadCustPersonal, this.leadInputObj).subscribe(
          (response) => {
            console.log(response);
            this.toastr.successMessage(response["message"]);
            // this.router.navigate(
            //   ["/Customer/CustomerPersonal/Address"], 
            //   { queryParams: { "IdCust": this.IdCust }}
            //   );
            // console.log(response);
            this.wizard.goToNextStep();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
    else {
      this.leadInputObj = new LeadInputObj();
      this.setLeadCust();
      this.setLeadCustPersonal();
      this.setLeadCustSocmed();
      this.setLegalAddr();
      this.setResidenceAddr();
      this.setLeadCustPersonalJobData();
      this.setLeadCustPersonalFinData();

      this.http.post(this.addEditLeadCustPersonal, this.leadInputObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          // this.router.navigate(
          //   ["/Customer/CustomerPersonal/Address"], 
          //   { queryParams: { "IdCust": this.IdCust }}
          //   );
          // console.log(response);
          this.wizard.goToNextStep();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
