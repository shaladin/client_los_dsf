import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataPersonalObj } from 'app/shared/model/CustDataPersonalObj.Model';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { CustPersonalMainDataComponent } from './component/personal-main-data/cust-personal-main-data.component';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CustPersonalContactInformationComponent } from './component/personal-contact-information/cust-personal-contact-information.component';
import { CustJobDataComponent } from './component/job-data/cust-job-data.component';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';
import { AppCustGrpObj } from 'app/shared/model/AppCustGrpObj.Model';
import { CustDataCompanyObj } from 'app/shared/model/CustDataCompanyObj.Model';
import { CustGrpMemberComponent } from './component/cust-grp-member/cust-grp-member.component';
import { formatDate } from '@angular/common';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/AppCustCompanyMgmntShrholderObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: []
})

export class CustomerDataComponent implements OnInit {

  @ViewChild(CustPersonalMainDataComponent) mainDataComponent;
  @ViewChild(CustPersonalContactInformationComponent) custContactInformationComponent;
  @ViewChild(CustJobDataComponent) custJobDataComponent;
  @ViewChild(CustGrpMemberComponent) custGrpMemberComponent;


  CustDataForm = this.fb.group({
    CopyFromResidence: [''],
    CopyFromMailing: ['']
  });

  CustDataCompanyForm = this.fb.group({
    CopyFromMailing: ['']
  });

  @Input() appId: any;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  countryObj = {
    CountryCode: ""
  };
  custDataObj: CustDataObj;
  custDataPersonalObj: CustDataPersonalObj = new CustDataPersonalObj();
  custDataCompanyObj: CustDataCompanyObj = new CustDataCompanyObj();
  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;
  legalAddrCompanyObj: AddrObj;
  inputFieldLegalCompanyObj: InputFieldObj;
  residenceAddrObj: AddrObj;
  inputFieldResidenceObj: InputFieldObj;
  copyFromResidence: any;
  mailingAddrObj: AddrObj;
  inputFieldMailingObj: InputFieldObj;
  copyFromMailing: any;
  mailingAddrCompanyObj: AddrObj;
  inputFieldMailingCompanyObj: InputFieldObj;
  copyFromMailingCompany: any;
  appCustPersonalId: any;
  listAppCustPersonalContactInformation: Array<AppCustPersonalContactPersonObj> = new Array<AppCustPersonalContactPersonObj>();;
  listAppCustBankAcc: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  listAppCustBankAccCompany: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  listShareholder: Array<AppCustCompanyMgmntShrholderObj> = new Array<AppCustCompanyMgmntShrholderObj>();
  listContactPersonCompany: Array<AppCustPersonalContactPersonObj> = new Array<AppCustPersonalContactPersonObj>();
  listLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();

  isBindDataDone: boolean = false;



  getRefMasterUrl: any;
  addEditCustDataPersonalUrl: any;
  getCustDataUrl: any;

  CustTypeObj: any;
  copyToResidenceTypeObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  copyToMailingTypeObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "RESIDENCE",
      Value: "Residence"
    }
  ];

  copyToMailingCompanyTypeObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    }
  ];

  defCustModelCode: any;
  MrCustTypeCode: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
    })
  }

  async ngOnInit(): Promise<void> {
    this.initUrl();
    this.bindCustTypeObj();
    this.initAddrObj();
    await this.getCustData();
  }

  SaveForm() {
    if (this.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
      this.custDataPersonalObj = new CustDataPersonalObj();
      this.setCustPersonalObjForSave();
      if(this.isExpiredBirthDt || this.isExpiredEstablishmentDt) return;
      this.http.post(this.addEditCustDataPersonalUrl, this.custDataPersonalObj).subscribe(
        (response) => {
          console.log(response);
          if (response["StatusCode"] == 200) {
            this.toastr.successMessage(response["message"]);
            this.EmitToMainComp();
          }
          else {
            response["ErrorMessages"].forEach((message: string) => {
              this.toastr.errorMessage(message["Message"]);
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }

    if (this.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
      var totalSharePrcnt = 0;

      if (this.listShareholder != undefined) {
        for (let i = 0; i < this.listShareholder.length; i++) {
          totalSharePrcnt += this.listShareholder[i].SharePrcnt;
        }
      }

      if (totalSharePrcnt != 100) {
        this.toastr.errorMessage("Total Share (%) must be 100.");
        return;
      }      
      this.custDataCompanyObj = new CustDataCompanyObj();
      this.setCustCompanyObjForSave();
      if(this.isExpiredBirthDt || this.isExpiredEstablishmentDt) return;
      this.http.post(AdInsConstant.AddEditCustDataCompany, this.custDataCompanyObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.EmitToMainComp();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  Cancel(){
    this.outputCancel.emit();
  }

  setCustPersonalObjForSave() {
    this.setAppCust();
    this.setAppCustPersonal();
    this.setAppCustAddrLegal();
    this.setAppCustAddrResidence();
    this.setAppCustAddrMailing();
    this.setAppCustPersonalFinData();
    this.custDataPersonalObj.AppCustPersonalContactPersonObjs = this.listAppCustPersonalContactInformation;
    this.custDataPersonalObj.AppCustBankAccObjs = this.listAppCustBankAcc;
    this.setAppCustPersonalJobData();
    this.setAppCustSocmedObj();
    this.setAppCustGrpObj();
  }

  setCustCompanyObjForSave() {
    this.setAppCust();
    this.setAppCustCompany();
    this.setAppCustAddrLegal();
    this.setAppCustAddrMailing();
    this.custDataCompanyObj.AppCustCompanyMgmntShrholderObjs = this.listShareholder;
    this.custDataCompanyObj.AppCustCompanyContactPersonObjs = this.listContactPersonCompany;
    this.setAppCustCompanyFinData();
    this.custDataCompanyObj.AppCustBankAccObjs = this.listAppCustBankAccCompany;
    this.custDataCompanyObj.AppCustCompanyLegalDocObjs = this.listLegalDoc;
    this.setAppCustGrpObj();
  }

  isExpiredBirthDt: boolean = false;
  isExpiredEstablishmentDt: boolean = false;
  CekDt(inputDate: Date, type: string){
    var UserAccess = JSON.parse(localStorage.getItem("UserAccess"));
    var MaxDate = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    var Max17YO = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    let max17Yodt = new Date(Max17YO);
    let d1 = new Date(inputDate);
    let d2 = new Date(MaxDate);
    max17Yodt.setFullYear(d2.getFullYear()-17);

    if(d1 > d2){
      this.toastr.errorMessage(type + "  can not be more than " + MaxDate);
      if(type=="Establishment Date")
        this.isExpiredEstablishmentDt = true;
      if(type=="Birth Date")
        this.isExpiredBirthDt = true;

    }else if(type == "Birth Date" && d1 > max17Yodt){
      this.toastr.errorMessage(type + "  can not be more than " + Max17YO);
      this.isExpiredBirthDt = true;
    }
    else{
      if(type=="Birth Date")
        this.isExpiredBirthDt = false;
      if(type=="Establishment Date")
        this.isExpiredEstablishmentDt = false;
    }
  }

  setAppCust() {
    if (this.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
      this.custDataPersonalObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataPersonalObj.AppCustObj.CustName = this.mainDataComponent.InputLookupCustomerObj.nameSelect;
      this.custDataPersonalObj.AppCustObj.CustNo = this.mainDataComponent.selectedCustNo;
      this.custDataPersonalObj.AppCustObj.MrIdTypeCode = this.CustDataForm.controls["personalMainData"]["controls"].MrIdTypeCode.value;
      this.custDataPersonalObj.AppCustObj.IdNo = this.CustDataForm.controls["personalMainData"]["controls"].IdNo.value;
      this.custDataPersonalObj.AppCustObj.IdExpiredDt = this.CustDataForm.controls["personalMainData"]["controls"].IdExpiredDt.value;
      this.custDataPersonalObj.AppCustObj.TaxIdNo = this.CustDataForm.controls["personalMainData"]["controls"].TaxIdNo.value;
      this.custDataPersonalObj.AppCustObj.IsVip = this.CustDataForm.controls["personalMainData"]["controls"].IsVip.value;
      this.custDataPersonalObj.AppCustObj.AppId = this.appId;

      if (this.custDataPersonalObj.AppCustObj.CustNo != "" && this.custDataPersonalObj.AppCustObj.CustNo != undefined) {
        this.custDataPersonalObj.AppCustObj.IsExistingCust = true;
      } else {
        this.custDataPersonalObj.AppCustObj.IsExistingCust = false;
      }
    }

    if (this.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
      this.custDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataCompanyObj.AppCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
      this.custDataCompanyObj.AppCustObj.CustNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustNo.value;
      this.custDataCompanyObj.AppCustObj.MrIdTypeCode = "NPWP";
      this.custDataCompanyObj.AppCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      this.custDataCompanyObj.AppCustObj.CustModelCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustModelCode.value;
      this.custDataCompanyObj.AppCustObj.TaxIdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      this.custDataCompanyObj.AppCustObj.IsVip = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsVip.value;
      this.custDataCompanyObj.AppCustObj.AppId = this.appId;

      if (this.custDataCompanyObj.AppCustObj.CustNo != "" && this.custDataCompanyObj.AppCustObj.CustNo != undefined) {
        this.custDataCompanyObj.AppCustObj.IsExistingCust = true;
      } else {
        this.custDataCompanyObj.AppCustObj.IsExistingCust = false;
      }
    }
  }

  setAppCustCompany() {
    this.custDataCompanyObj.AppCustCompanyObj.CompanyBrandName = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CompanyBrandName.value;
    this.custDataCompanyObj.AppCustCompanyObj.IndustryTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IndustryTypeCode.value;
    this.custDataCompanyObj.AppCustCompanyObj.MrCompanyTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].MrCompanyTypeCode.value;
    this.custDataCompanyObj.AppCustCompanyObj.NumOfEmp = this.CustDataCompanyForm.controls["companyMainData"]["controls"].NumOfEmp.value;
    this.custDataCompanyObj.AppCustCompanyObj.IsAffiliated = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsAffiliated.value;
    this.custDataCompanyObj.AppCustCompanyObj.EstablishmentDt = this.CustDataCompanyForm.controls["companyMainData"]["controls"].EstablishmentDt.value;
    this.CekDt(this.custDataCompanyObj.AppCustCompanyObj.EstablishmentDt, "Establishment Date");
  }

  setAppCustPersonal() {
    this.custDataPersonalObj.AppCustPersonalObj.CustFullName = this.CustDataForm.controls["personalMainData"]["controls"].CustFullName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode = this.CustDataForm.controls["personalMainData"]["controls"].MrGenderCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MotherMaidenName = this.CustDataForm.controls["personalMainData"]["controls"].MotherMaidenName.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode = this.CustDataForm.controls["personalMainData"]["controls"].MrMaritalStatCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthPlace = this.CustDataForm.controls["personalMainData"]["controls"].BirthPlace.value;
    this.custDataPersonalObj.AppCustPersonalObj.BirthDt = this.CustDataForm.controls["personalMainData"]["controls"].BirthDt.value;
    this.CekDt(this.custDataPersonalObj.AppCustPersonalObj.BirthDt, "Birth Date");
    this.custDataPersonalObj.AppCustPersonalObj.MrNationalityCode = this.CustDataForm.controls["personalMainData"]["controls"].MrNationalityCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.NationalityCountryCode = this.mainDataComponent.selectedNationalityCountryCode;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo1 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo1.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo2 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo2.value;
    this.custDataPersonalObj.AppCustPersonalObj.MobilePhnNo3 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo3.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrEducationCode = this.CustDataForm.controls["personalMainData"]["controls"].MrEducationCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.MrReligionCode = this.CustDataForm.controls["personalMainData"]["controls"].MrReligionCode.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email1 = this.CustDataForm.controls["personalMainData"]["controls"].Email1.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email2 = this.CustDataForm.controls["personalMainData"]["controls"].Email2.value;
    this.custDataPersonalObj.AppCustPersonalObj.Email3 = this.CustDataForm.controls["personalMainData"]["controls"].Email3.value;
    this.custDataPersonalObj.AppCustPersonalObj.FamilyCardNo = this.CustDataForm.controls["personalMainData"]["controls"].FamilyCardNo.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfResidence = this.CustDataForm.controls["personalMainData"]["controls"].NoOfResidence.value;
    this.custDataPersonalObj.AppCustPersonalObj.NoOfDependents = this.CustDataForm.controls["personalMainData"]["controls"].NoOfDependents.value;
  }

  setAppCustAddrLegal() {
    if (this.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
      this.custDataPersonalObj.AppCustAddrLegalObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeLegal;
      this.custDataPersonalObj.AppCustAddrLegalObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode = this.CustDataForm.controls["legalAddr"]["controls"].SubZipcode.value;
    }

    if (this.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
      this.custDataCompanyObj.AppCustAddrLegalObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeLegal;
      this.custDataCompanyObj.AppCustAddrLegalObj.Addr = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Addr.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode3 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode3.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode4 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode4.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.Zipcode = this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode1.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode2.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.City = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].City.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea1.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.Phn1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn1.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt1.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea2.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.Phn2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn2.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt2.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.FaxArea = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].FaxArea.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.Fax = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Fax.value;
      this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].SubZipcode.value;
    }
  }

  setAppCustAddrResidence() {
    this.custDataPersonalObj.AppCustAddrResidenceObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeResidence;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.MrHouseOwnershipCode = this.CustDataForm.controls["residenceAddr"]["controls"].MrHouseOwnershipCode.value;
    this.custDataPersonalObj.AppCustAddrResidenceObj.SubZipcode = this.CustDataForm.controls["residenceAddr"]["controls"].SubZipcode.value;
  }

  setAppCustAddrMailing() {
    if (this.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
      this.custDataPersonalObj.AppCustAddrMailingObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeMailing;
      this.custDataPersonalObj.AppCustAddrMailingObj.Addr = this.CustDataForm.controls["mailingAddr"]["controls"].Addr.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode3 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode3.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode4 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode4.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.Zipcode = this.CustDataForm.controls["mailingAddrZipcode"]["controls"].value.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode1 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode1.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode2 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode2.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.City = this.CustDataForm.controls["mailingAddr"]["controls"].City.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.PhnArea1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea1.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.Phn1 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn1.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.PhnExt1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt1.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.PhnArea2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea2.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.Phn2 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn2.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.PhnExt2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt2.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.FaxArea = this.CustDataForm.controls["mailingAddr"]["controls"].FaxArea.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.Fax = this.CustDataForm.controls["mailingAddr"]["controls"].Fax.value;
      this.custDataPersonalObj.AppCustAddrMailingObj.SubZipcode = this.CustDataForm.controls["mailingAddr"]["controls"].SubZipcode.value;
    }

    if (this.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
      this.custDataCompanyObj.AppCustAddrMailingObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeMailing;
      this.custDataCompanyObj.AppCustAddrMailingObj.Addr = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Addr.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode3 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode3.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode4 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode4.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.Zipcode = this.CustDataCompanyForm.controls["mailingAddrCompanyZipcode"]["controls"].value.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode1.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode2.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.City = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].City.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.PhnArea1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea1.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.Phn1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn1.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.PhnExt1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt1.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.PhnArea2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea2.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.Phn2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn2.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.PhnExt2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt2.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.FaxArea = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].FaxArea.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.Fax = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Fax.value;
      this.custDataCompanyObj.AppCustAddrMailingObj.SubZipcode = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].SubZipcode.value;
    }
  }

  setAppCustAddrJob() {
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj = new AppCustAddrObj();
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.MrCustAddrTypeCode = AdInsConstant.AddrTypeJob;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.Addr = this.CustDataForm.controls["jobDataAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.Zipcode = this.CustDataForm.controls["jobDataAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.City = this.CustDataForm.controls["jobDataAddr"]["controls"].City.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.PhnArea1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.Phn1 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.PhnExt1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.PhnArea2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.Phn2 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.PhnExt2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.FaxArea = this.CustDataForm.controls["jobDataAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.Fax = this.CustDataForm.controls["jobDataAddr"]["controls"].Fax.value;
  }

  setAppCustPersonalFinData() {
    this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyIncomeAmt.value;
    this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyExpenseAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyExpenseAmt.value;
    this.custDataPersonalObj.AppCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = this.CustDataForm.controls["financialData"]["controls"].MrSourceOfIncomeTypeCode.value;
    this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyInstallmentAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyInstallmentAmt.value;
    this.custDataPersonalObj.AppCustPersonalFinDataObj.IsJoinIncome = this.CustDataForm.controls["financialData"]["controls"].IsJoinIncome.value;
    this.custDataPersonalObj.AppCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].SpouseMonthlyIncomeAmt.value;
  }

  setAppCustCompanyFinData() {
    this.custDataCompanyObj.AppCustCompanyFinDataObj.GrossMonthlyIncomeAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyIncomeAmt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.GrossMonthlyExpenseAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyExpenseAmt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.GrossProfitAmt = this.custDataCompanyObj.AppCustCompanyFinDataObj.GrossMonthlyIncomeAmt - this.custDataCompanyObj.AppCustCompanyFinDataObj.GrossMonthlyExpenseAmt;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ReturnOfInvestmentPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfInvestmentPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ProfitMarginPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitMarginPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ReturnOfAssetPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfAssetPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ReturnOfEquityPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfEquityPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.DebtEquityRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DebtEquityRatioPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.CurrentRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrentRatioPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.InvTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].InvTurnOverPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.GrowthPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrowthPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ArTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ArTurnOverPrcnt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.WorkingCapitalAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].WorkingCapitalAmt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.OthMonthlyInstAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OthMonthlyInstAmt.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.DateAsOf = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DateAsOf.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.Revenue = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].Revenue.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.OprCost = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OprCost.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ProfitBeforeTax = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitBeforeTax.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.CurrAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrAsset.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.NetFixedAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].NetFixedAsset.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.TotalAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].TotalAsset.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.CurrLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrLiablts.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.LongTemrLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].LongTemrLiablts.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.ShareholderEquity = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ShareholderEquity.value;
    this.custDataCompanyObj.AppCustCompanyFinDataObj.CurrRatio = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrRatio.value;
  }

  setAppCustPersonalJobData() {
    this.custDataPersonalObj.AppCustObj.CustModelCode = this.CustDataForm.controls["jobData"]["controls"].CustModelCode.value;

    if (this.custDataPersonalObj.AppCustObj.CustModelCode == AdInsConstant.CustModelProfessional) {
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.ProfessionalNo = this.CustDataForm.controls["jobData"]["controls"].ProfessionalNo.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.setAppCustAddrJob();
    }

    if (this.custDataPersonalObj.AppCustObj.CustModelCode == AdInsConstant.CustModelEmployee) {
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.IsMfEmp = this.CustDataForm.controls["jobData"]["controls"].IsMfEmp.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      this.setAppCustAddrJob();
    }

    if (this.custDataPersonalObj.AppCustObj.CustModelCode == AdInsConstant.CustModelSmallMediumEnterprise) {
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrInvestmentTypeCode = this.CustDataForm.controls["jobData"]["controls"].MrInvestmentTypeCode.value;
      this.setAppCustAddrJob();
    }

    if (this.custDataPersonalObj.AppCustObj.CustModelCode == AdInsConstant.CustModelNonProfessional) {
      this.custDataPersonalObj.AppCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
    }
    this.CekDt(this.custDataPersonalObj.AppCustPersonalJobDataObj.EstablishmentDt, "Establishment Date");      
  }

  setAppCustSocmedObj() {
    this.custDataPersonalObj.AppCustSocmedObjs = new Array<AppCustSocmedObj>();
    for (let i = 0; i < this.CustDataForm.controls["socmed"].value.length; i++) {
      var appCustSocmedObj = new AppCustSocmedObj();
      appCustSocmedObj.MrSocmedCode = this.CustDataForm.controls["socmed"].value[i].MrSocmedCode;
      appCustSocmedObj.MrSocmedName = this.CustDataForm.controls["socmed"].value[i].MrSocmedName;
      appCustSocmedObj.SocmedId = this.CustDataForm.controls["socmed"].value[i].SocmedId;
      this.custDataPersonalObj.AppCustSocmedObjs.push(appCustSocmedObj);
    }
  }

  setAppCustGrpObj() {
    if (this.MrCustTypeCode == AdInsConstant.CustTypePersonal) {
      this.custDataPersonalObj.AppCustGrpObjs = new Array<AppCustGrpObj>();
      for (let i = 0; i < this.CustDataForm.controls["custGrpMember"].value.length; i++) {
        var appCustGrpObj = new AppCustGrpObj();
        appCustGrpObj.CustNo = this.CustDataForm.controls["custGrpMember"].value[i].CustNo;
        appCustGrpObj.MrCustRelationshipCode = this.CustDataForm.controls["custGrpMember"].value[i].MrCustRelationshipCode;
        appCustGrpObj.CustGrpNotes = this.CustDataForm.controls["custGrpMember"].value[i].CustGrpNotes;
        appCustGrpObj.IsReversible = this.CustDataForm.controls["custGrpMember"].value[i].IsReversible;
        this.custDataPersonalObj.AppCustGrpObjs.push(appCustGrpObj);
      }
    }

    if (this.MrCustTypeCode == AdInsConstant.CustTypeCompany) {
      this.custDataCompanyObj.AppCustGrpObjs = new Array<AppCustGrpObj>();
      for (let i = 0; i < this.CustDataCompanyForm.controls["custGrpMemberCompany"].value.length; i++) {
        var appCustGrpObj = new AppCustGrpObj();
        appCustGrpObj.CustNo = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustNo;
        appCustGrpObj.MrCustRelationshipCode = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].MrCustRelationshipCode;
        appCustGrpObj.CustGrpNotes = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustGrpNotes;
        appCustGrpObj.IsReversible = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].IsReversible;
        this.custDataCompanyObj.AppCustGrpObjs.push(appCustGrpObj);
      }
    }

  }

  getCustContactInformation(event) {
    this.listAppCustPersonalContactInformation = event;
  }

  getAppCustBankAcc(event) {
    this.listAppCustBankAcc = event;
  }

  getAppCustBankAccCompany(event) {
    this.listAppCustBankAccCompany = event;
  }

  getAppCustShareholder(event) {
    this.listShareholder = event;
  }

  getAppCustCompanyContactPerson(event) {
    this.listContactPersonCompany = event;
  }

  getAppCustLegalDoc(event) {
    this.listLegalDoc = event;
  }

  copyToContactPersonAddr(event) {
    if (event == AdInsConstant.AddrTypeLegal) {
      this.custContactInformationComponent.contactPersonAddrObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.custContactInformationComponent.contactPersonAddrObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      this.custContactInformationComponent.contactPersonAddrObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.custContactInformationComponent.contactPersonAddrObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;

      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.nameSelect = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value };
    }

    if (event == AdInsConstant.AddrTypeResidence) {
      this.custContactInformationComponent.contactPersonAddrObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
      this.custContactInformationComponent.contactPersonAddrObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
      this.custContactInformationComponent.contactPersonAddrObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
      this.custContactInformationComponent.contactPersonAddrObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;

      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.nameSelect = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value };
    }

    if (event == AdInsConstant.AddrTypeMailing) {
      this.custContactInformationComponent.contactPersonAddrObj.Addr = this.CustDataForm.controls["mailingAddr"]["controls"].Addr.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode1 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode1.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode2 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode2.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode3 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode3.value;
      this.custContactInformationComponent.contactPersonAddrObj.AreaCode4 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode4.value;
      this.custContactInformationComponent.contactPersonAddrObj.City = this.CustDataForm.controls["mailingAddr"]["controls"].City.value;
      this.custContactInformationComponent.contactPersonAddrObj.Fax = this.CustDataForm.controls["mailingAddr"]["controls"].Fax.value;
      this.custContactInformationComponent.contactPersonAddrObj.FaxArea = this.CustDataForm.controls["mailingAddr"]["controls"].FaxArea.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn1 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn1.value;
      this.custContactInformationComponent.contactPersonAddrObj.Phn2 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnArea2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea2.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt1.value;
      this.custContactInformationComponent.contactPersonAddrObj.PhnExt2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt2.value;

      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.nameSelect = this.CustDataForm.controls["mailingAddrZipcode"]["controls"].value.value;
      this.custContactInformationComponent.inputFieldContactPersonObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["mailingAddrZipcode"]["controls"].value.value };
    }
  }

  copyToResidence() {
    if (this.copyFromResidence == AdInsConstant.AddrTypeLegal) {
      this.residenceAddrObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.residenceAddrObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.residenceAddrObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.residenceAddrObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.residenceAddrObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.residenceAddrObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      this.residenceAddrObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.residenceAddrObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.residenceAddrObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.residenceAddrObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.residenceAddrObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.residenceAddrObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.residenceAddrObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.residenceAddrObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      this.residenceAddrObj.SubZipcode = this.CustDataForm.controls["legalAddr"]["controls"].SubZipcode.value;

      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value };
    }
  }

  copyToMailing() {
    if (this.copyFromMailing == AdInsConstant.AddrTypeLegal) {
      this.mailingAddrObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.mailingAddrObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.mailingAddrObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.mailingAddrObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.mailingAddrObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.mailingAddrObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      this.mailingAddrObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.mailingAddrObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.mailingAddrObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.mailingAddrObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.mailingAddrObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.mailingAddrObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.mailingAddrObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.mailingAddrObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      this.mailingAddrObj.SubZipcode = this.CustDataForm.controls["legalAddr"]["controls"].SubZipcode.value;

      this.inputFieldMailingObj.inputLookupObj.nameSelect = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value };
    }

    if (this.copyFromMailing == AdInsConstant.AddrTypeResidence) {
      this.mailingAddrObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
      this.mailingAddrObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
      this.mailingAddrObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
      this.mailingAddrObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
      this.mailingAddrObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
      this.mailingAddrObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
      this.mailingAddrObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
      this.mailingAddrObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
      this.mailingAddrObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
      this.mailingAddrObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
      this.mailingAddrObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
      this.mailingAddrObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
      this.mailingAddrObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
      this.mailingAddrObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;
      this.mailingAddrObj.SubZipcode = this.CustDataForm.controls["residenceAddr"]["controls"].SubZipcode.value;

      this.inputFieldMailingObj.inputLookupObj.nameSelect = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
      this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value };
    }
  }

  copyToMailingCompany() {
    if (this.copyFromMailingCompany == AdInsConstant.AddrTypeLegal) {
      this.mailingAddrCompanyObj.Addr = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Addr.value;
      this.mailingAddrCompanyObj.AreaCode1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode1.value;
      this.mailingAddrCompanyObj.AreaCode2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode2.value;
      this.mailingAddrCompanyObj.AreaCode3 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode3.value;
      this.mailingAddrCompanyObj.AreaCode4 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode4.value;
      this.mailingAddrCompanyObj.City = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].City.value;
      this.mailingAddrCompanyObj.Fax = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Fax.value;
      this.mailingAddrCompanyObj.FaxArea = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].FaxArea.value;
      this.mailingAddrCompanyObj.Phn1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn1.value;
      this.mailingAddrCompanyObj.Phn2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn2.value;
      this.mailingAddrCompanyObj.PhnArea1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea1.value;
      this.mailingAddrCompanyObj.PhnArea2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea2.value;
      this.mailingAddrCompanyObj.PhnExt1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt1.value;
      this.mailingAddrCompanyObj.PhnExt2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt2.value;
      this.mailingAddrCompanyObj.SubZipcode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].SubZipcode.value;

      this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value;
      this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value };
    }
  }



  test() {
    console.log(this.mainDataComponent);
    console.log(this.CustDataForm);
  }

  testCompany() {
    console.log(this.CustDataCompanyForm);
  }

  async getCustData() {
    this.custDataObj = new CustDataObj();
    this.custDataObj.AppId = this.appId;
    await this.http.post(this.getCustDataUrl, this.custDataObj).toPromise().then(
      (response) => {
        console.log(response);
        if (response != "") {
          if (response["AppCustObj"]["MrCustTypeCode"] == AdInsConstant.CustTypePersonal) {
            this.custDataPersonalObj = new CustDataPersonalObj();
            this.custDataPersonalObj.AppCustObj = response["AppCustObj"];
            this.custDataPersonalObj.AppCustPersonalObj = response["AppCustPersonalObj"];
            this.custDataPersonalObj.AppCustAddrLegalObj = response["AppCustAddrLegalObj"];
            this.custDataPersonalObj.AppCustAddrResidenceObj = response["AppCustAddrResidenceObj"];
            this.custDataPersonalObj.AppCustAddrMailingObj = response["AppCustAddrMailingObj"];
            this.custDataPersonalObj.AppCustPersonalContactPersonObjs = response["AppCustPersonalContactPersonObjs"];
            this.listAppCustPersonalContactInformation = this.custDataPersonalObj.AppCustPersonalContactPersonObjs;
            this.custDataPersonalObj.AppCustPersonalFinDataObj = response["AppCustPersonalFinDataObj"];
            this.custDataPersonalObj.AppCustBankAccObjs = response["AppCustBankAccObjs"];
            this.listAppCustBankAcc = this.custDataPersonalObj.AppCustBankAccObjs;
            this.custDataPersonalObj.AppCustPersonalJobDataObj = response["AppCustPersonalJobDataObj"];
            this.custDataPersonalObj.AppCustSocmedObjs = response["AppCustSocmedObjs"];
            this.custDataPersonalObj.AppCustGrpObjs = response["AppCustGrpObjs"];

            if (this.custDataPersonalObj.AppCustObj != undefined) {
              this.defCustModelCode = this.custDataPersonalObj.AppCustObj.CustModelCode;
            }

            this.setAddrLegalObj(AdInsConstant.CustTypePersonal);
            this.setAddrResidenceObj();
            this.setAddrMailingObj(AdInsConstant.CustTypePersonal);

            this.appCustPersonalId = this.custDataPersonalObj.AppCustPersonalObj.AppCustPersonalId;
            this.MrCustTypeCode = this.custDataPersonalObj.AppCustObj.MrCustTypeCode;
          }

          if (response["AppCustObj"]["MrCustTypeCode"] == AdInsConstant.CustTypeCompany) {
            this.custDataCompanyObj = new CustDataCompanyObj();
            this.custDataCompanyObj.AppCustObj = response["AppCustObj"];
            this.custDataCompanyObj.AppCustCompanyObj = response["AppCustCompanyObj"];
            this.custDataCompanyObj.AppCustAddrLegalObj = response["AppCustAddrLegalObj"];
            this.custDataCompanyObj.AppCustAddrMailingObj = response["AppCustAddrMailingObj"];
            this.custDataCompanyObj.AppCustCompanyMgmntShrholderObjs = response["AppCustCompanyMgmntShrholderObjs"];
            this.listShareholder = this.custDataCompanyObj.AppCustCompanyMgmntShrholderObjs;
            this.custDataCompanyObj.AppCustCompanyContactPersonObjs = response["AppCustCompanyContactPersonObjs"];
            this.listContactPersonCompany = this.custDataCompanyObj.AppCustCompanyContactPersonObjs;
            this.custDataCompanyObj.AppCustCompanyFinDataObj = response["AppCustCompanyFinDataObj"];
            if (response["AppCustCompanyFinDataObj"] != undefined) {
              if (response["AppCustCompanyFinDataObj"].DateAsOf != undefined && response["AppCustCompanyFinDataObj"].DateAsOf != null) {
                this.custDataCompanyObj.AppCustCompanyFinDataObj.DateAsOf = formatDate(response["AppCustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
              }
            }
            this.custDataCompanyObj.AppCustBankAccObjs = response["AppCustBankAccObjs"];
            this.listAppCustBankAccCompany = this.custDataCompanyObj.AppCustBankAccObjs;
            this.custDataCompanyObj.AppCustCompanyLegalDocObjs = response["AppCustCompanyLegalDocObjs"];
            this.listLegalDoc = this.custDataCompanyObj.AppCustCompanyLegalDocObjs;
            this.custDataCompanyObj.AppCustGrpObjs = response["AppCustGrpObjs"];

            this.setAddrLegalObj(AdInsConstant.CustTypeCompany);
            this.setAddrMailingObj(AdInsConstant.CustTypeCompany);

            this.MrCustTypeCode = this.custDataCompanyObj.AppCustObj.MrCustTypeCode;
          }
        }
        this.isBindDataDone = true;
      },
      (error) => {
        console.log(error);
        this.isBindDataDone = true;
      }
    );
  }

  initAddrObj() {
    this.initAddrLegalObj();
    this.initAddrLegalCompanyObj();
    this.initAddrResidenceObj();
    this.initAddrMailingObj();
    this.initAddrMailingCompanyObj();
  }

  initAddrLegalObj() {
    this.legalAddrObj = new AddrObj();
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
  }

  initAddrLegalCompanyObj() {
    this.legalAddrCompanyObj = new AddrObj();
    this.inputFieldLegalCompanyObj = new InputFieldObj();
    this.inputFieldLegalCompanyObj.inputLookupObj = new InputLookupObj();
  }

  initAddrResidenceObj() {
    this.residenceAddrObj = new AddrObj();
    this.inputFieldResidenceObj = new InputFieldObj();
    this.inputFieldResidenceObj.inputLookupObj = new InputLookupObj();
  }

  initAddrMailingObj() {
    this.mailingAddrObj = new AddrObj();
    this.inputFieldMailingObj = new InputFieldObj();
    this.inputFieldMailingObj.inputLookupObj = new InputLookupObj();
  }

  initAddrMailingCompanyObj() {
    this.mailingAddrCompanyObj = new AddrObj();
    this.inputFieldMailingCompanyObj = new InputFieldObj();
    this.inputFieldMailingCompanyObj.inputLookupObj = new InputLookupObj();
  }

  setAddrLegalObj(custTypeCode) {
    if (custTypeCode == AdInsConstant.CustTypePersonal) {
      this.initAddrLegalObj();

      if (this.custDataPersonalObj.AppCustAddrLegalObj != undefined) {
        this.legalAddrObj.Addr = this.custDataPersonalObj.AppCustAddrLegalObj.Addr;
        this.legalAddrObj.AreaCode1 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode1;
        this.legalAddrObj.AreaCode2 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode2;
        this.legalAddrObj.AreaCode3 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode3;
        this.legalAddrObj.AreaCode4 = this.custDataPersonalObj.AppCustAddrLegalObj.AreaCode4;
        this.legalAddrObj.City = this.custDataPersonalObj.AppCustAddrLegalObj.City;
        this.legalAddrObj.Fax = this.custDataPersonalObj.AppCustAddrLegalObj.Fax;
        this.legalAddrObj.FaxArea = this.custDataPersonalObj.AppCustAddrLegalObj.FaxArea;
        this.legalAddrObj.Phn1 = this.custDataPersonalObj.AppCustAddrLegalObj.Phn1;
        this.legalAddrObj.Phn2 = this.custDataPersonalObj.AppCustAddrLegalObj.Phn2;
        this.legalAddrObj.PhnArea1 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea1;
        this.legalAddrObj.PhnArea2 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnArea2;
        this.legalAddrObj.PhnExt1 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt1;
        this.legalAddrObj.PhnExt2 = this.custDataPersonalObj.AppCustAddrLegalObj.PhnExt2;
        this.legalAddrObj.SubZipcode = this.custDataPersonalObj.AppCustAddrLegalObj.SubZipcode;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.AppCustAddrLegalObj.Zipcode };
      }
    }

    if (custTypeCode == AdInsConstant.CustTypeCompany) {
      this.initAddrLegalCompanyObj();

      if (this.custDataCompanyObj.AppCustAddrLegalObj != undefined) {
        this.legalAddrCompanyObj.Addr = this.custDataCompanyObj.AppCustAddrLegalObj.Addr;
        this.legalAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode1;
        this.legalAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode2;
        this.legalAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode3;
        this.legalAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.AppCustAddrLegalObj.AreaCode4;
        this.legalAddrCompanyObj.City = this.custDataCompanyObj.AppCustAddrLegalObj.City;
        this.legalAddrCompanyObj.Fax = this.custDataCompanyObj.AppCustAddrLegalObj.Fax;
        this.legalAddrCompanyObj.FaxArea = this.custDataCompanyObj.AppCustAddrLegalObj.FaxArea;
        this.legalAddrCompanyObj.Phn1 = this.custDataCompanyObj.AppCustAddrLegalObj.Phn1;
        this.legalAddrCompanyObj.Phn2 = this.custDataCompanyObj.AppCustAddrLegalObj.Phn2;
        this.legalAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea1;
        this.legalAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.AppCustAddrLegalObj.PhnArea2;
        this.legalAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt1;
        this.legalAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.AppCustAddrLegalObj.PhnExt2;
        this.legalAddrCompanyObj.SubZipcode = this.custDataCompanyObj.AppCustAddrLegalObj.SubZipcode;

        this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.AppCustAddrLegalObj.Zipcode;
        this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.AppCustAddrLegalObj.Zipcode };
      }
    }
  }

  setAddrResidenceObj() {
    this.initAddrResidenceObj();

    if (this.custDataPersonalObj.AppCustAddrResidenceObj != undefined) {
      this.residenceAddrObj.Addr = this.custDataPersonalObj.AppCustAddrResidenceObj.Addr;
      this.residenceAddrObj.AreaCode1 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode1;
      this.residenceAddrObj.AreaCode2 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode2;
      this.residenceAddrObj.AreaCode3 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode3;
      this.residenceAddrObj.AreaCode4 = this.custDataPersonalObj.AppCustAddrResidenceObj.AreaCode4;
      this.residenceAddrObj.City = this.custDataPersonalObj.AppCustAddrResidenceObj.City;
      this.residenceAddrObj.Fax = this.custDataPersonalObj.AppCustAddrResidenceObj.Fax;
      this.residenceAddrObj.FaxArea = this.custDataPersonalObj.AppCustAddrResidenceObj.FaxArea;
      this.residenceAddrObj.Phn1 = this.custDataPersonalObj.AppCustAddrResidenceObj.Phn1;
      this.residenceAddrObj.Phn2 = this.custDataPersonalObj.AppCustAddrResidenceObj.Phn2;
      this.residenceAddrObj.PhnArea1 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea1;
      this.residenceAddrObj.PhnArea2 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnArea2;
      this.residenceAddrObj.PhnExt1 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt1;
      this.residenceAddrObj.PhnExt2 = this.custDataPersonalObj.AppCustAddrResidenceObj.PhnExt2;
      this.residenceAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.AppCustAddrResidenceObj.MrHouseOwnershipCode;
      this.residenceAddrObj.SubZipcode = this.custDataPersonalObj.AppCustAddrResidenceObj.SubZipcode;

      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode };
    }
  }

  setAddrMailingObj(custTypeCode) {
    if (custTypeCode == AdInsConstant.CustTypePersonal) {
      this.initAddrMailingObj();

      if (this.custDataPersonalObj.AppCustAddrMailingObj != undefined) {
        this.mailingAddrObj.Addr = this.custDataPersonalObj.AppCustAddrMailingObj.Addr;
        this.mailingAddrObj.AreaCode1 = this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode1;
        this.mailingAddrObj.AreaCode2 = this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode2;
        this.mailingAddrObj.AreaCode3 = this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode3;
        this.mailingAddrObj.AreaCode4 = this.custDataPersonalObj.AppCustAddrMailingObj.AreaCode4;
        this.mailingAddrObj.City = this.custDataPersonalObj.AppCustAddrMailingObj.City;
        this.mailingAddrObj.Fax = this.custDataPersonalObj.AppCustAddrMailingObj.Fax;
        this.mailingAddrObj.FaxArea = this.custDataPersonalObj.AppCustAddrMailingObj.FaxArea;
        this.mailingAddrObj.Phn1 = this.custDataPersonalObj.AppCustAddrMailingObj.Phn1;
        this.mailingAddrObj.Phn2 = this.custDataPersonalObj.AppCustAddrMailingObj.Phn2;
        this.mailingAddrObj.PhnArea1 = this.custDataPersonalObj.AppCustAddrMailingObj.PhnArea1;
        this.mailingAddrObj.PhnArea2 = this.custDataPersonalObj.AppCustAddrMailingObj.PhnArea2;
        this.mailingAddrObj.PhnExt1 = this.custDataPersonalObj.AppCustAddrMailingObj.PhnExt1;
        this.mailingAddrObj.PhnExt2 = this.custDataPersonalObj.AppCustAddrMailingObj.PhnExt2;
        this.mailingAddrObj.SubZipcode = this.custDataPersonalObj.AppCustAddrMailingObj.SubZipcode;

        this.inputFieldMailingObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrMailingObj.Zipcode;
        this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.AppCustAddrMailingObj.Zipcode };
      }
    }

    if (custTypeCode == AdInsConstant.CustTypeCompany) {
      this.initAddrMailingCompanyObj();

      if (this.custDataCompanyObj.AppCustAddrMailingObj != undefined) {
        this.mailingAddrCompanyObj.Addr = this.custDataCompanyObj.AppCustAddrMailingObj.Addr;
        this.mailingAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode1;
        this.mailingAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode2;
        this.mailingAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode3;
        this.mailingAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.AppCustAddrMailingObj.AreaCode4;
        this.mailingAddrCompanyObj.City = this.custDataCompanyObj.AppCustAddrMailingObj.City;
        this.mailingAddrCompanyObj.Fax = this.custDataCompanyObj.AppCustAddrMailingObj.Fax;
        this.mailingAddrCompanyObj.FaxArea = this.custDataCompanyObj.AppCustAddrMailingObj.FaxArea;
        this.mailingAddrCompanyObj.Phn1 = this.custDataCompanyObj.AppCustAddrMailingObj.Phn1;
        this.mailingAddrCompanyObj.Phn2 = this.custDataCompanyObj.AppCustAddrMailingObj.Phn2;
        this.mailingAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.AppCustAddrMailingObj.PhnArea1;
        this.mailingAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.AppCustAddrMailingObj.PhnArea2;
        this.mailingAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.AppCustAddrMailingObj.PhnExt1;
        this.mailingAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.AppCustAddrMailingObj.PhnExt2;
        this.mailingAddrCompanyObj.SubZipcode = this.custDataCompanyObj.AppCustAddrMailingObj.SubZipcode;

        this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.AppCustAddrMailingObj.Zipcode;
        this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.AppCustAddrMailingObj.Zipcode };
      }
    }
  }

  CopyCustomer(event) {
    console.log(event);
    this.copyAddrFromLookup(event);

    if (event["CustPersonalContactPersonObjs"] != undefined) {
      this.listAppCustPersonalContactInformation = event["CustPersonalContactPersonObjs"];
    }

    if (event["CustPersonalFinDataObj"] != undefined) {
      this.custDataPersonalObj.AppCustPersonalFinDataObj = event["CustPersonalFinDataObj"];
      this.custDataPersonalObj.AppCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = event["CustPersonalFinDataObj"].MrSourceOfIncomeCode;
    }

    if (event["CustBankAccObjs"] != undefined) {
      this.listAppCustBankAcc = event["CustBankAccObjs"];
    }

    if (event["CustPersonalJobDataObj"] != undefined) {
      this.custJobDataComponent.custModelCode = event["CustObj"].MrCustModelCode;
      this.custJobDataComponent.appCustPersonalJobDataObj = event["CustPersonalJobDataObj"];
      this.custJobDataComponent.bindAppCustPersonalJobData();
    }

    if (event["CustGrpObjs"] != undefined) {
      this.custGrpMemberComponent.appCustGrpObjs = event["CustGrpObjs"];
      this.custGrpMemberComponent.copyAppGrp();
    }

  }

  CopyCustomerCompany(event) {
    console.log(event);
    this.copyAddrCompanyFromLookup(event);

    if (event["CustCompanyContactPersonObjs"] != undefined) {
      this.listContactPersonCompany = event["CustCompanyContactPersonObjs"];
    }

    if (event["CustCompanyMgmntShrholderObjs"] != undefined) {
      this.listShareholder = event["CustCompanyMgmntShrholderObjs"];
    }

    if (event["CustCompanyLegalDocObjs"] != undefined) {
      this.listLegalDoc = event["CustCompanyLegalDocObjs"];
    }

    if (event["CustCompanyFinDataObj"] != undefined) {
      this.custDataCompanyObj.AppCustCompanyFinDataObj = event["CustCompanyFinDataObj"];
      this.custDataCompanyObj.AppCustCompanyFinDataObj.DateAsOf = formatDate(event["CustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
    }

    if (event["CustBankAccObjs"] != undefined) {
      this.listAppCustBankAccCompany = event["CustBankAccObjs"];
    }

    if (event["CustGrpObjs"] != undefined) {
      this.custGrpMemberComponent.appCustGrpObjs = event["CustGrpObjs"];
      this.custGrpMemberComponent.copyAppGrp();
    }

  }

  copyAddrFromLookup(event) {
    if (event["CustAddrLegalObj"] != undefined) {
      this.legalAddrObj.Addr = event["CustAddrLegalObj"].Addr;
      this.legalAddrObj.AreaCode1 = event["CustAddrLegalObj"].AreaCode1;
      this.legalAddrObj.AreaCode2 = event["CustAddrLegalObj"].AreaCode2;
      this.legalAddrObj.AreaCode3 = event["CustAddrLegalObj"].AreaCode3;
      this.legalAddrObj.AreaCode4 = event["CustAddrLegalObj"].AreaCode4;
      this.legalAddrObj.City = event["CustAddrLegalObj"].City;
      this.legalAddrObj.Fax = event["CustAddrLegalObj"].Fax;
      this.legalAddrObj.FaxArea = event["CustAddrLegalObj"].FaxArea;
      this.legalAddrObj.Phn1 = event["CustAddrLegalObj"].Phn1;
      this.legalAddrObj.Phn2 = event["CustAddrLegalObj"].Phn2;
      this.legalAddrObj.PhnArea1 = event["CustAddrLegalObj"].PhnArea1;
      this.legalAddrObj.PhnArea2 = event["CustAddrLegalObj"].PhnArea2;
      this.legalAddrObj.PhnExt1 = event["CustAddrLegalObj"].PhnExt1;
      this.legalAddrObj.PhnExt2 = event["CustAddrLegalObj"].PhnExt2;
      this.legalAddrObj.SubZipcode = event["CustAddrLegalObj"].SubZipcode;

      this.inputFieldLegalObj.inputLookupObj.nameSelect = event["CustAddrLegalObj"].Zipcode;
      this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrLegalObj"].Zipcode };
    }

    if (event["CustAddrResidenceObj"] != undefined) {
      this.residenceAddrObj.Addr = event["CustAddrResidenceObj"].Addr;
      this.residenceAddrObj.AreaCode1 = event["CustAddrResidenceObj"].AreaCode1;
      this.residenceAddrObj.AreaCode2 = event["CustAddrResidenceObj"].AreaCode2;
      this.residenceAddrObj.AreaCode3 = event["CustAddrResidenceObj"].AreaCode3;
      this.residenceAddrObj.AreaCode4 = event["CustAddrResidenceObj"].AreaCode4;
      this.residenceAddrObj.City = event["CustAddrResidenceObj"].City;
      this.residenceAddrObj.Fax = event["CustAddrResidenceObj"].Fax;
      this.residenceAddrObj.FaxArea = event["CustAddrResidenceObj"].FaxArea;
      this.residenceAddrObj.Phn1 = event["CustAddrResidenceObj"].Phn1;
      this.residenceAddrObj.Phn2 = event["CustAddrResidenceObj"].Phn2;
      this.residenceAddrObj.PhnArea1 = event["CustAddrResidenceObj"].PhnArea1;
      this.residenceAddrObj.PhnArea2 = event["CustAddrResidenceObj"].PhnArea2;
      this.residenceAddrObj.PhnExt1 = event["CustAddrResidenceObj"].PhnExt1;
      this.residenceAddrObj.PhnExt2 = event["CustAddrResidenceObj"].PhnExt2;
      this.residenceAddrObj.SubZipcode = event["CustAddrResidenceObj"].SubZipcode;

      this.inputFieldResidenceObj.inputLookupObj.nameSelect = event["CustAddrResidenceObj"].Zipcode;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrResidenceObj"].Zipcode };
    }

    if (event["CustAddrMailingObj"] != undefined) {
      this.mailingAddrObj.Addr = event["CustAddrMailingObj"].Addr;
      this.mailingAddrObj.AreaCode1 = event["CustAddrMailingObj"].AreaCode1;
      this.mailingAddrObj.AreaCode2 = event["CustAddrMailingObj"].AreaCode2;
      this.mailingAddrObj.AreaCode3 = event["CustAddrMailingObj"].AreaCode3;
      this.mailingAddrObj.AreaCode4 = event["CustAddrMailingObj"].AreaCode4;
      this.mailingAddrObj.City = event["CustAddrMailingObj"].City;
      this.mailingAddrObj.Fax = event["CustAddrMailingObj"].Fax;
      this.mailingAddrObj.FaxArea = event["CustAddrMailingObj"].FaxArea;
      this.mailingAddrObj.Phn1 = event["CustAddrMailingObj"].Phn1;
      this.mailingAddrObj.Phn2 = event["CustAddrMailingObj"].Phn2;
      this.mailingAddrObj.PhnArea1 = event["CustAddrMailingObj"].PhnArea1;
      this.mailingAddrObj.PhnArea2 = event["CustAddrMailingObj"].PhnArea2;
      this.mailingAddrObj.PhnExt1 = event["CustAddrMailingObj"].PhnExt1;
      this.mailingAddrObj.PhnExt2 = event["CustAddrMailingObj"].PhnExt2;
      this.mailingAddrObj.SubZipcode = event["CustAddrMailingObj"].SubZipcode;

      this.inputFieldMailingObj.inputLookupObj.nameSelect = event["CustAddrMailingObj"].Zipcode;
      this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrMailingObj"].Zipcode };
    }
  }

  copyAddrCompanyFromLookup(event) {
    if (event["CustAddrLegalObj"] != undefined) {
      this.legalAddrCompanyObj.Addr = event["CustAddrLegalObj"].Addr;
      this.legalAddrCompanyObj.AreaCode1 = event["CustAddrLegalObj"].AreaCode1;
      this.legalAddrCompanyObj.AreaCode2 = event["CustAddrLegalObj"].AreaCode2;
      this.legalAddrCompanyObj.AreaCode3 = event["CustAddrLegalObj"].AreaCode3;
      this.legalAddrCompanyObj.AreaCode4 = event["CustAddrLegalObj"].AreaCode4;
      this.legalAddrCompanyObj.City = event["CustAddrLegalObj"].City;
      this.legalAddrCompanyObj.Fax = event["CustAddrLegalObj"].Fax;
      this.legalAddrCompanyObj.FaxArea = event["CustAddrLegalObj"].FaxArea;
      this.legalAddrCompanyObj.Phn1 = event["CustAddrLegalObj"].Phn1;
      this.legalAddrCompanyObj.Phn2 = event["CustAddrLegalObj"].Phn2;
      this.legalAddrCompanyObj.PhnArea1 = event["CustAddrLegalObj"].PhnArea1;
      this.legalAddrCompanyObj.PhnArea2 = event["CustAddrLegalObj"].PhnArea2;
      this.legalAddrCompanyObj.PhnExt1 = event["CustAddrLegalObj"].PhnExt1;
      this.legalAddrCompanyObj.PhnExt2 = event["CustAddrLegalObj"].PhnExt2;
      this.legalAddrCompanyObj.SubZipcode = event["CustAddrLegalObj"].SubZipcode;

      this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = event["CustAddrLegalObj"].Zipcode;
      this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrLegalObj"].Zipcode };
    }

    if (event["CustAddrMailingObj"] != undefined) {
      this.mailingAddrCompanyObj.Addr = event["CustAddrMailingObj"].Addr;
      this.mailingAddrCompanyObj.AreaCode1 = event["CustAddrMailingObj"].AreaCode1;
      this.mailingAddrCompanyObj.AreaCode2 = event["CustAddrMailingObj"].AreaCode2;
      this.mailingAddrCompanyObj.AreaCode3 = event["CustAddrMailingObj"].AreaCode3;
      this.mailingAddrCompanyObj.AreaCode4 = event["CustAddrMailingObj"].AreaCode4;
      this.mailingAddrCompanyObj.City = event["CustAddrMailingObj"].City;
      this.mailingAddrCompanyObj.Fax = event["CustAddrMailingObj"].Fax;
      this.mailingAddrCompanyObj.FaxArea = event["CustAddrMailingObj"].FaxArea;
      this.mailingAddrCompanyObj.Phn1 = event["CustAddrMailingObj"].Phn1;
      this.mailingAddrCompanyObj.Phn2 = event["CustAddrMailingObj"].Phn2;
      this.mailingAddrCompanyObj.PhnArea1 = event["CustAddrMailingObj"].PhnArea1;
      this.mailingAddrCompanyObj.PhnArea2 = event["CustAddrMailingObj"].PhnArea2;
      this.mailingAddrCompanyObj.PhnExt1 = event["CustAddrMailingObj"].PhnExt1;
      this.mailingAddrCompanyObj.PhnExt2 = event["CustAddrMailingObj"].PhnExt2;
      this.mailingAddrCompanyObj.SubZipcode = event["CustAddrMailingObj"].SubZipcode;

      this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = event["CustAddrMailingObj"].Zipcode;
      this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrMailingObj"].Zipcode };
    }
  }

  initUrl() {
    this.addEditCustDataPersonalUrl = AdInsConstant.AddEditCustDataPersonal;
    this.getCustDataUrl = AdInsConstant.GetCustDataByAppId;
    this.getRefMasterUrl = AdInsConstant.GetRefMasterListKeyValueActiveByCode;
  }

  // bindCopyFrom(){
  //   this.CustDataForm.patchValue({
  //     CopyFromResidence: this.copyToResidenceTypeObj[0].Key,
  //     CopyFromMailing: this.copyToMailingTypeObj[0].Key
  //   });

  //   this.CustDataCompanyForm.patchValue({
  //     CopyFromMailing: this.copyToMailingCompanyTypeObj[0].Key
  //   });
  // }

  bindCustTypeObj() {
    this.refMasterObj.RefMasterTypeCode = "CUST_TYPE";
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        console.log(response);
        this.CustTypeObj = response["ReturnObject"];
        if (this.CustTypeObj.length > 0) {
          this.MrCustTypeCode = this.CustTypeObj[0].Key;
        }
      }
    );
  }

  EmitToMainComp(){
    console.log(this.MrCustTypeCode);
    this.outputTab.emit(this.MrCustTypeCode);
  }
}
