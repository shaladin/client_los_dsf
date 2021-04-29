import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataObj } from 'app/shared/model/CustDataObj.Model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { formatDate } from '@angular/common';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustPersonalMainComponent } from './mou-cust-personal-main/mou-cust-personal-main.component';
import { MouCustPersonalContactInfoComponent } from './mou-cust-personal-contact-info/mou-cust-personal-contact-info.component';
import { MouCustJobDataComponent } from './mou-cust-job-data/mou-cust-job-data.component';
import { MouCustGrpMbrComponent } from './mou-cust-grp-mbr/mou-cust-grp-mbr.component';
import { MouCustPersonalContactPersonObj } from 'app/shared/model/MouCustPersonalContactPersonObj.Model';
import { MouCustBankAccObj } from 'app/shared/model/MouCustBankAccObj.Model';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/MouCustCompanyMgmntShrholderObj.Model';
import { MouCustCompanyLegalDocObj } from 'app/shared/model/MouCustCompanyLegalDocObj.Model';
import { MouCustPersonalDataObj } from 'app/shared/model/MouCustPersonalDataObj.Model';
import { MouCustCompanyDataObj } from 'app/shared/model/MouCustCompanyDataObj.Model';
import { MouCustAddrObj } from 'app/shared/model/MouCustAddrObj.Model';
import { MouCustSocmedObj } from 'app/shared/model/MouCustSocmedObj.Model';
import { MouCustGrpObj } from 'app/shared/model/MouCustGrpObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { GeneralSettingObj } from 'app/shared/model/GeneralSettingObj.Model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/ThirdPartyResultHForFraudChckObj.Model';
import { AppCustCompareObj } from 'app/shared/model/AppCustCompareObj.Model';
import { MouCustObjForAddTrxData } from 'app/shared/model/MouCustObjForAddTrxData.Model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-mou-cust-tab',
  templateUrl: './mou-cust-tab.component.html'
})
export class MouCustTabComponent implements OnInit {
  @ViewChild(MouCustPersonalMainComponent) mainDataComponent;
  @ViewChild(MouCustPersonalContactInfoComponent) custContactInformationComponent;
  @ViewChild(MouCustJobDataComponent) custJobDataComponent;
  @ViewChild(MouCustGrpMbrComponent) custGrpMemberComponent;

  isNeedCheckBySystem: string;
  isUseDigitalization: string;
  generalSettingObj: GeneralSettingObj;
  returnGeneralSettingObj: any;
  mouObj: MouCustObj = new MouCustObj();
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  latestCustDataObj: AppCustCompareObj;
  thirdPartyRsltHId: any;
  latestReqDtCheckIntegrator: any;
  reqLatestJson: any;

  CustDataForm = this.fb.group({
    CopyFromResidence: [''],
    CopyFromMailing: ['']
  });

  CustDataCompanyForm = this.fb.group({
    CopyFromMailing: ['']
  });

  @Input() MouCustId: number;
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() ResponseMouCust: EventEmitter<any> = new EventEmitter(); t

  countryObj = {
    CountryCode: ""
  };
  custDataObj: CustDataObj;
  custDataPersonalObj: MouCustPersonalDataObj = new MouCustPersonalDataObj();
  custDataCompanyObj: MouCustCompanyDataObj = new MouCustCompanyDataObj();
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
  MouCustPersonalId: number = 0;
  MouCustAddrId: number;
  MouCustFinDataId: number = 0;
  MouCustPersonalJobDataId: number = 0;
  MouCustAddrLegalId: number = 0;
  MouCustAddrResidenceId: number = 0;
  MouCustAddrMailingId: number= 0;
  MouCustCompanyId: number = 0;
  listMouCustPersonalContactInformation: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  returnMouObj: any;

  listMouCustBankAcc: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  listMouCustBankAccCompany: Array<MouCustBankAccObj> = new Array<MouCustBankAccObj>();
  listShareholder: Array<MouCustCompanyMgmntShrholderObj> = new Array<MouCustCompanyMgmntShrholderObj>();
  listContactPersonCompany: Array<MouCustPersonalContactPersonObj> = new Array<MouCustPersonalContactPersonObj>();
  listLegalDoc: Array<MouCustCompanyLegalDocObj> = new Array<MouCustCompanyLegalDocObj>();
  isBindDataDone: boolean = false;
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

  defCustModelCode: string;
  MrCustTypeCode: any;
  isMarried: boolean = true;
  spouseGender: string = "";
  isSpouseOk: boolean = true;
  IsSpouseExist: boolean = false;
  appId: number;
  inputAddrLegalPersonalObj: InputAddressObj = new InputAddressObj();
  inputAddrLegalCompanyObj: InputAddressObj = new InputAddressObj();
  inputAddrResidenceObj: InputAddressObj = new InputAddressObj();
  inputAddressObjForMailing: InputAddressObj = new InputAddressObj();
  inputAddrMailingCompanyObj: InputAddressObj = new InputAddressObj();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.MouCustId = params["mouCustId"];
    })
  }

  async ngOnInit(): Promise<void> {
    this.latestCustDataObj = new AppCustCompareObj();
    console.log("help");
    this.GetGS();
    await this.bindCustTypeObj();
    this.initAddrObj();
    await this.getCustData();
  }

  SaveForm() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.custDataPersonalObj = new MouCustPersonalDataObj();
      this.setCustPersonalObjForSave();
      for (let i = 0; i < this.custDataPersonalObj.MouCustGrpObjs.length; i++) {
        for (let j = i + 1; j < this.custDataPersonalObj.MouCustGrpObjs.length; j++) {
          if (this.custDataPersonalObj.MouCustGrpObjs[i]["CustNo"] == this.custDataPersonalObj.MouCustGrpObjs[j]["CustNo"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_CUST_MEMBER + (j + 1));
            return;
          }
          if (this.custDataPersonalObj.MouCustGrpObjs[i]["MrCustRelationshipCode"] == this.custDataPersonalObj.MouCustGrpObjs[j]["MrCustRelationshipCode"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_RELATIONSHIP_AS_OTHER_CUST_MEMBER + (j + 1));
            return;
          }
        }
      }
      if (this.isExpiredBirthDt || this.isExpiredEstablishmentDt || this.isExpiredDate) return;
      if (this.isSpouseOk) {
        if (this.confirmFraudCheck()) {
          if(this.MouCustPersonalId == 0){
          this.http.post(URLConstant.AddMouCustPersonalData, this.custDataPersonalObj).subscribe(
            (response) => {
              if (response["StatusCode"] == 200) {
                this.toastr.successMessage(response["message"]);
                this.ResponseMouCust.emit({ StatusCode: "200" });
                this.EmitToMainComp();
              }
              else {
                response["ErrorMessages"].forEach((message: string) => {
                  this.toastr.warningMessage(message["Message"]);
                });
              }
            },
            (error) => {
              console.log(error);
            }
          );
          }
          else
          {
            this.http.post(URLConstant.EditMouCustPersonalData, this.custDataPersonalObj).subscribe(
              (response) => {
                if (response["StatusCode"] == 200) {
                  this.toastr.successMessage(response["message"]);
                  this.ResponseMouCust.emit({ StatusCode: "200" });
                  this.EmitToMainComp();
                }
                else {
                  response["ErrorMessages"].forEach((message: string) => {
                    this.toastr.warningMessage(message["Message"]);
                  });
                }
              },
              (error) => {
                console.log(error);
              }
            );
          }
        }
      }
      else {
        this.toastr.warningMessage(ExceptionConstant.INPUT_SPOUSE_CONTACT_INFO);
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      var totalSharePrcnt = 0;
      var isActiveSignerExist = false;

      if (this.listShareholder != undefined) {
        for (let i = 0; i < this.listShareholder.length; i++) {
          totalSharePrcnt += this.listShareholder[i].SharePrcnt;
        }
        for (const item of this.listShareholder) {
          if (item.IsActive) {
            isActiveSignerExist = true;
            break;
          }
        }
      }

      if (totalSharePrcnt != 100) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_PERCENTAGE_MUST_100);
        return;
      }
      if (!isActiveSignerExist) {
        this.toastr.warningMessage("At Least 1 Active Signer is Required");
        return false;
      }
      this.custDataCompanyObj = new MouCustCompanyDataObj();
      this.setCustCompanyObjForSave();
      for (let i = 0; i < this.custDataCompanyObj.MouCustGrpObjs.length; i++) {
        for (let j = i + 1; j < this.custDataCompanyObj.MouCustGrpObjs.length; j++) {
          if (this.custDataCompanyObj.MouCustGrpObjs[i]["CustNo"] == this.custDataCompanyObj.MouCustGrpObjs[j]["CustNo"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_CUST_MEMBER + (j + 1));
            return;
          }
          if (this.custDataCompanyObj.MouCustGrpObjs[i]["MrCustRelationshipCode"] == this.custDataCompanyObj.MouCustGrpObjs[j]["MrCustRelationshipCode"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_RELATIONSHIP_AS_OTHER_CUST_MEMBER + (j + 1));
            return;
          }
        }
      }
      if (this.isExpiredBirthDt || this.isExpiredEstablishmentDt) return;
      if (this.confirmFraudCheck()) {
      if(this.MouCustCompanyId == 0){
        this.http.post(URLConstant.AddMouCustCompanyData, this.custDataCompanyObj).subscribe(
          (response) => {
            this.ResponseMouCust.emit({ StatusCode: "200" });
            this.toastr.successMessage(response["message"]);
            this.EmitToMainComp();
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else
      {
        this.http.post(URLConstant.EditMouCustCompanyData, this.custDataCompanyObj).subscribe(
          (response) => {
            this.ResponseMouCust.emit({ StatusCode: "200" });
            this.toastr.successMessage(response["message"]);
            this.EmitToMainComp();
          },
          (error) => {
            console.log(error);
          }
        );
      }
      }
    }
  }

  Cancel() {
    this.ResponseMouCust.emit();
  }

  setCustPersonalObjForSave() {
    this.setMouCust();
    this.setMouCustPersonal();
    this.setMouCustAddrLegal();
    this.setMouCustAddrResidence();
    this.setMouCustAddrMailing();
    this.setMouCustPersonalFinData();
    var CheckSpouseContactInfo = this.listMouCustPersonalContactInformation.find(
      x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
    if (CheckSpouseContactInfo == null && this.isMarried == true) {
      this.isSpouseOk = false;
    }
    else {
      this.isSpouseOk = true;
    }
    this.custDataPersonalObj.MouCustPersonalContactPersonObjs = this.listMouCustPersonalContactInformation;
    this.custDataPersonalObj.MouCustBankAccObjs = this.listMouCustBankAcc;
    this.setMouCustPersonalJobData();
    this.setMouCustSocmedObj();
    this.setMouCustGrpObj();
  }

  setCustCompanyObjForSave() {
    this.setMouCust();
    this.setMouCustCompany();
    this.setMouCustAddrLegal();
    this.setMouCustAddrMailing();
    this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs = this.listShareholder;
    this.custDataCompanyObj.MouCustCompanyContactPersonObjs = this.listContactPersonCompany;
    this.setMouCustCompanyFinData();
    this.custDataCompanyObj.MouCustBankAccObjs = this.listMouCustBankAccCompany;
    this.custDataCompanyObj.MouCustCompanyLegalDocObjs = this.listLegalDoc;
    this.setMouCustGrpObj();
  }

  isExpiredBirthDt: boolean = false;
  isExpiredEstablishmentDt: boolean = false;
  isExpiredDate: boolean = false;
  CekDt(inputDate: Date, type: string) {
    var UserAccess = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    var MaxDate = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    var Max17YO = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
    let max17Yodt = new Date(Max17YO);
    let d1 = new Date(inputDate);
    let d2 = new Date(MaxDate);
    max17Yodt.setFullYear(d2.getFullYear() - 17);

    if (type == ExceptionConstant.DateErrorMessageIdExpiredDate) {
      d2.setDate(d2.getDate() - 1);
      if (d1 < d2) {
        this.isExpiredDate = true;
        this.toastr.warningMessage(type + "  can not be less than " + MaxDate);
      } else this.isExpiredDate = false;
      return;
    }

    if (d1 > d2) {
      this.toastr.warningMessage(type + "  can not be more than " + MaxDate);
      if (type == ExceptionConstant.DateErrorMessageEstablishmentDate)
        this.isExpiredEstablishmentDt = true;
      if (type == ExceptionConstant.DateErrorMessageBirthDate)
        this.isExpiredBirthDt = true;

    } else if (type == ExceptionConstant.DateErrorMessageBirthDate && d1 > max17Yodt) {
      this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
      this.isExpiredBirthDt = true;
    }
    else {
      if (type == ExceptionConstant.DateErrorMessageBirthDate)
        this.isExpiredBirthDt = false;
      if (type == ExceptionConstant.DateErrorMessageEstablishmentDate)
        this.isExpiredEstablishmentDt = false;
    }
  }

  setMouCust() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.custDataPersonalObj.MouCustObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataPersonalObj.MouCustObj.CustName = this.CustDataForm.controls["lookupCustomer"].value.value;
      this.custDataPersonalObj.MouCustObj.CustNo = this.CustDataForm.controls["PersonalMain"]["controls"].CustNo.value;
      this.custDataPersonalObj.MouCustObj.MrIdTypeCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrIdTypeCode.value;
      this.custDataPersonalObj.MouCustObj.IdNo = this.CustDataForm.controls["PersonalMain"]["controls"].IdNo.value;
      this.custDataPersonalObj.MouCustObj.IdExpiredDt = this.CustDataForm.controls["PersonalMain"]["controls"].IdExpiredDt.value;
      if (this.custDataPersonalObj.MouCustObj.MrIdTypeCode == "KITAS" || this.custDataPersonalObj.MouCustObj.MrIdTypeCode == "SIM") {
        this.CekDt(this.custDataPersonalObj.MouCustObj.IdExpiredDt, ExceptionConstant.DateErrorMessageIdExpiredDate);
      }
      this.custDataPersonalObj.MouCustObj.TaxIdNo = this.CustDataForm.controls["PersonalMain"]["controls"].TaxIdNo.value;
      this.custDataPersonalObj.MouCustObj.IsVip = this.CustDataForm.controls["PersonalMain"]["controls"].IsVip.value;
      this.custDataPersonalObj.MouCustObj.MouCustId = this.MouCustId;

      if (this.custDataPersonalObj.MouCustObj.CustNo != "" && this.custDataPersonalObj.MouCustObj.CustNo != undefined) {
        this.custDataPersonalObj.MouCustObj.IsExistingCust = true;
      } else {
        this.custDataPersonalObj.MouCustObj.IsExistingCust = false;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.custDataCompanyObj.MouCustObj.MrCustTypeCode = this.MrCustTypeCode;
      this.custDataCompanyObj.MouCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
      this.custDataCompanyObj.MouCustObj.CustNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustNo.value;
      this.custDataCompanyObj.MouCustObj.MrIdTypeCode = "NPWP";
      this.custDataCompanyObj.MouCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      this.custDataCompanyObj.MouCustObj.CustModelCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustModelCode.value;
      this.custDataCompanyObj.MouCustObj.TaxIdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      this.custDataCompanyObj.MouCustObj.IsVip = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsVip.value;
      this.custDataCompanyObj.MouCustObj.MouCustId = this.MouCustId;
      

      if (this.custDataCompanyObj.MouCustObj.CustNo != "" && this.custDataCompanyObj.MouCustObj.CustNo != undefined) {
        this.custDataCompanyObj.MouCustObj.IsExistingCust = true;
      } else {
        this.custDataCompanyObj.MouCustObj.IsExistingCust = false;
      }
    }
  }

  setMouCustCompany() {
    this.custDataCompanyObj.MouCustCompanyObj.CompanyBrandName = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CompanyBrandName.value;
    this.custDataCompanyObj.MouCustCompanyObj.IndustryTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IndustryTypeCode.value;
    this.custDataCompanyObj.MouCustCompanyObj.MrCompanyTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].MrCompanyTypeCode.value;
    this.custDataCompanyObj.MouCustCompanyObj.NumOfEmp = this.CustDataCompanyForm.controls["companyMainData"]["controls"].NumOfEmp.value;
    this.custDataCompanyObj.MouCustCompanyObj.IsAffiliated = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsAffiliated.value;
    this.custDataCompanyObj.MouCustCompanyObj.EstablishmentDt = this.CustDataCompanyForm.controls["companyMainData"]["controls"].EstablishmentDt.value;
    this.CekDt(this.custDataCompanyObj.MouCustCompanyObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);
    this.custDataCompanyObj.MouCustCompanyObj.MouCustId = this.MouCustId;
    if(this.MouCustCompanyId != 0 ){
      this.custDataCompanyObj.MouCustCompanyObj.MouCustCompanyId = this.MouCustCompanyId;
    }
  }

  setMouCustPersonal() {
    this.custDataPersonalObj.MouCustPersonalObj.CustFullName = this.CustDataForm.controls["PersonalMain"]["controls"].CustFullName.value;
    this.custDataPersonalObj.MouCustPersonalObj.MrGenderCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrGenderCode.value;
    this.custDataPersonalObj.MouCustPersonalObj.MotherMaidenName = this.CustDataForm.controls["PersonalMain"]["controls"].MotherMaidenName.value;
    this.custDataPersonalObj.MouCustPersonalObj.MrMaritalStatCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrMaritalStatCode.value;
    this.custDataPersonalObj.MouCustPersonalObj.BirthPlace = this.CustDataForm.controls["PersonalMain"]["controls"].BirthPlace.value;
    this.custDataPersonalObj.MouCustPersonalObj.BirthDt = this.CustDataForm.controls["PersonalMain"]["controls"].BirthDt.value;
    this.CekDt(this.custDataPersonalObj.MouCustPersonalObj.BirthDt, ExceptionConstant.DateErrorMessageBirthDate);
    this.custDataPersonalObj.MouCustPersonalObj.MrNationalityCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrNationalityCode.value;
    this.custDataPersonalObj.MouCustPersonalObj.NationalityCountryCode = this.mainDataComponent.selectedNationalityCountryCode;
    this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo1 = this.CustDataForm.controls["PersonalMain"]["controls"].MobilePhnNo1.value;
    this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo2 = this.CustDataForm.controls["PersonalMain"]["controls"].MobilePhnNo2.value;
    this.custDataPersonalObj.MouCustPersonalObj.MobilePhnNo3 = this.CustDataForm.controls["PersonalMain"]["controls"].MobilePhnNo3.value;
    this.custDataPersonalObj.MouCustPersonalObj.MrEducationCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrEducationCode.value;
    this.custDataPersonalObj.MouCustPersonalObj.MrReligionCode = this.CustDataForm.controls["PersonalMain"]["controls"].MrReligionCode.value;
    this.custDataPersonalObj.MouCustPersonalObj.Email1 = this.CustDataForm.controls["PersonalMain"]["controls"].Email1.value;
    this.custDataPersonalObj.MouCustPersonalObj.Email2 = this.CustDataForm.controls["PersonalMain"]["controls"].Email2.value;
    this.custDataPersonalObj.MouCustPersonalObj.Email3 = this.CustDataForm.controls["PersonalMain"]["controls"].Email3.value;
    this.custDataPersonalObj.MouCustPersonalObj.FamilyCardNo = this.CustDataForm.controls["PersonalMain"]["controls"].FamilyCardNo.value;
    this.custDataPersonalObj.MouCustPersonalObj.NoOfResidence = this.CustDataForm.controls["PersonalMain"]["controls"].NoOfResidence.value;
    this.custDataPersonalObj.MouCustPersonalObj.NoOfDependents = this.CustDataForm.controls["PersonalMain"]["controls"].NoOfDependents.value;
    this.custDataPersonalObj.MouCustPersonalObj.MouCustId = this.MouCustId;
    if(this.MouCustPersonalId != 0){
    this.custDataPersonalObj.MouCustPersonalObj.MouCustPersonalId = this.MouCustPersonalId;
    }
  }

  setMouCustAddrLegal() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.custDataPersonalObj.MouCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
      this.custDataPersonalObj.MouCustAddrLegalObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.Zipcode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.SubZipcode = this.CustDataForm.controls["legalAddr"]["controls"].SubZipcode.value;
      this.custDataPersonalObj.MouCustAddrLegalObj.MouCustId = this.MouCustId;
      if(this.MouCustAddrLegalId != 0){
        this.custDataPersonalObj.MouCustAddrLegalObj.MouCustAddrId = this.MouCustAddrLegalId;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.custDataCompanyObj.MouCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
      this.custDataCompanyObj.MouCustAddrLegalObj.Addr = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Addr.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode3 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode3.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode4 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode4.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.Zipcode = this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode1.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode2.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.City = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].City.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.PhnArea1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea1.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.Phn1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn1.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.PhnExt1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt1.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.PhnArea2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea2.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.Phn2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn2.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.PhnExt2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt2.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.FaxArea = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].FaxArea.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.Fax = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Fax.value;
      this.custDataCompanyObj.MouCustAddrLegalObj.SubZipcode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].SubZipcode.value;
      if(this.MouCustAddrLegalId != 0){
        this.custDataCompanyObj.MouCustAddrLegalObj.MouCustAddrId = this.MouCustAddrLegalId;
      }
    }
  }

  setMouCustAddrResidence() {
    this.custDataPersonalObj.MouCustAddrResidenceObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
    this.custDataPersonalObj.MouCustAddrResidenceObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.Zipcode = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.MrHouseOwnershipCode = this.CustDataForm.controls["residenceAddr"]["controls"].MrHouseOwnershipCode.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.SubZipcode = this.CustDataForm.controls["residenceAddr"]["controls"].SubZipcode.value;
    this.custDataPersonalObj.MouCustAddrResidenceObj.MouCustId = this.MouCustId;
      if(this.MouCustAddrResidenceId != 0){
        this.custDataPersonalObj.MouCustAddrResidenceObj.MouCustAddrId = this.MouCustAddrResidenceId;
      }
  }

  setMouCustAddrMailing() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.custDataPersonalObj.MouCustAddrMailingObj.MrCustAddrTypeCode = CommonConstant.AddrTypeMailing;
      this.custDataPersonalObj.MouCustAddrMailingObj.Addr = this.CustDataForm.controls["mailingAddr"]["controls"].Addr.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode3 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode3.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode4 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode4.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.Zipcode = this.CustDataForm.controls["mailingAddrZipcode"]["controls"].value.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode1 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode1.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode2 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode2.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.City = this.CustDataForm.controls["mailingAddr"]["controls"].City.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.PhnArea1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea1.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.Phn1 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn1.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.PhnExt1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt1.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.PhnArea2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea2.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.Phn2 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn2.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.PhnExt2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt2.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.FaxArea = this.CustDataForm.controls["mailingAddr"]["controls"].FaxArea.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.Fax = this.CustDataForm.controls["mailingAddr"]["controls"].Fax.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.SubZipcode = this.CustDataForm.controls["mailingAddr"]["controls"].SubZipcode.value;
      this.custDataPersonalObj.MouCustAddrMailingObj.MouCustId = this.MouCustId;
      if(this.MouCustAddrMailingId != 0){
        this.custDataPersonalObj.MouCustAddrMailingObj.MouCustAddrId = this.MouCustAddrMailingId;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.custDataCompanyObj.MouCustAddrMailingObj.MrCustAddrTypeCode = CommonConstant.AddrTypeMailing;
      this.custDataCompanyObj.MouCustAddrMailingObj.Addr = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Addr.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode3 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode3.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode4 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode4.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.Zipcode = this.CustDataCompanyForm.controls["mailingAddrCompanyZipcode"]["controls"].value.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode1.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode2.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.City = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].City.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.PhnArea1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea1.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.Phn1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn1.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.PhnExt1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt1.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.PhnArea2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea2.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.Phn2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn2.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.PhnExt2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt2.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.FaxArea = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].FaxArea.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.Fax = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Fax.value;
      this.custDataCompanyObj.MouCustAddrMailingObj.SubZipcode = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].SubZipcode.value;
      if(this.MouCustAddrMailingId != 0){
        this.custDataCompanyObj.MouCustAddrMailingObj.MouCustAddrId = this.MouCustAddrMailingId;
      }
    }
  }

  setMouCustAddrJob() {
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj = new MouCustAddrObj();
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.MrCustAddrTypeCode = CommonConstant.AddrTypeJob;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.Addr = this.CustDataForm.controls["jobDataAddr"]["controls"].Addr.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode3 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode3.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode4 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode4.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.Zipcode = this.CustDataForm.controls["jobDataAddrZipcode"]["controls"].value.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode1 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode1.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.AreaCode2 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode2.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.City = this.CustDataForm.controls["jobDataAddr"]["controls"].City.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea1.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn1 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn1.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt1.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnArea2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea2.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.Phn2 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn2.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.PhnExt2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt2.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.FaxArea = this.CustDataForm.controls["jobDataAddr"]["controls"].FaxArea.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.Fax = this.CustDataForm.controls["jobDataAddr"]["controls"].Fax.value;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.MouCustId = this.MouCustId;
    if(this.MouCustAddrId != 0){
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.MouCustAddrId = this.MouCustAddrId;
    }
  }

  setMouCustPersonalFinData() {
    this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyIncomeAmt.value;
    this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyExpenseAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyExpenseAmt.value;
    this.custDataPersonalObj.MouCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = this.CustDataForm.controls["financialData"]["controls"].MrSourceOfIncomeTypeCode.value;
    this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyInstallmentAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyInstallmentAmt.value;
    this.custDataPersonalObj.MouCustPersonalFinDataObj.IsJoinIncome = this.CustDataForm.controls["financialData"]["controls"].IsJoinIncome.value;
    this.custDataPersonalObj.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].SpouseMonthlyIncomeAmt.value;
    if(this.MouCustFinDataId != 0){
      this.custDataPersonalObj.MouCustPersonalFinDataObj.MouCustPersonalFinDataId = this.MouCustFinDataId;
      this.custDataPersonalObj.MouCustPersonalFinDataObj.MouCustPersonalId = this.MouCustPersonalId;
    }
  }

  setMouCustCompanyFinData() {
    this.custDataCompanyObj.MouCustCompanyFinDataObj.GrossMonthlyIncomeAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyIncomeAmt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.GrossMonthlyExpenseAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyExpenseAmt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.GrossProfitAmt = this.custDataCompanyObj.MouCustCompanyFinDataObj.GrossMonthlyIncomeAmt - this.custDataCompanyObj.MouCustCompanyFinDataObj.GrossMonthlyExpenseAmt;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ReturnOfInvestmentPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfInvestmentPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ProfitMarginPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitMarginPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ReturnOfAssetPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfAssetPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ReturnOfEquityPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfEquityPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.DebtEquityRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DebtEquityRatioPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.CurrentRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrentRatioPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.InvTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].InvTurnOverPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.GrowthPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrowthPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ArTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ArTurnOverPrcnt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.WorkingCapitalAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].WorkingCapitalAmt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.OthMonthlyInstAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OthMonthlyInstAmt.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.DateAsOf = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DateAsOf.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.Revenue = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].Revenue.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.OprCost = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OprCost.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ProfitBeforeTax = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitBeforeTax.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.CurrAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrAsset.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.NetFixedAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].NetFixedAsset.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.TotalAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].TotalAsset.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.CurrLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrLiablts.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.LongTemrLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].LongTemrLiablts.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.ShareholderEquity = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ShareholderEquity.value;
    this.custDataCompanyObj.MouCustCompanyFinDataObj.CurrRatio = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrRatio.value;
    if(this.MouCustFinDataId != 0){
      this.custDataCompanyObj.MouCustCompanyFinDataObj.MouCustCompanyFinDataId = this.MouCustFinDataId;
      this.custDataCompanyObj.MouCustCompanyFinDataObj.MouCustCompanyId = this.MouCustCompanyId;
    }
  }

  setMouCustPersonalJobData() {
    this.custDataPersonalObj.MouCustObj.CustModelCode = this.CustDataForm.controls["jobData"]["controls"].CustModelCode.value;

    if (this.custDataPersonalObj.MouCustObj.CustModelCode == CommonConstant.CustModelProfessional) {
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.ProfessionalNo = this.CustDataForm.controls["jobData"]["controls"].ProfessionalNo.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.setMouCustAddrJob();
    }

    if (this.custDataPersonalObj.MouCustObj.CustModelCode == CommonConstant.CustModelEmployee) {
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.IsMfEmp = this.CustDataForm.controls["jobData"]["controls"].IsMfEmp.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      this.setMouCustAddrJob();
    }

    if (this.custDataPersonalObj.MouCustObj.CustModelCode == CommonConstant.CustModelSmallMediumEnterprise) {
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrInvestmentTypeCode = this.CustDataForm.controls["jobData"]["controls"].MrInvestmentTypeCode.value;
      this.setMouCustAddrJob();
    }

    if (this.custDataPersonalObj.MouCustObj.CustModelCode == CommonConstant.CustModelNonProfessional) {
      this.custDataPersonalObj.MouCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
    }
    if(this.MouCustPersonalJobDataId != 0){
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustPersonalId = this.MouCustPersonalId;
    this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustPersonalJobDataId = this.MouCustPersonalJobDataId;
    }
    this.CekDt(this.custDataPersonalObj.MouCustPersonalJobDataObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);
  }

  setMouCustSocmedObj() {
    this.custDataPersonalObj.MouCustSocmedObjs = new Array<MouCustSocmedObj>();
    for (let i = 0; i < this.CustDataForm.controls["socmed"].value.length; i++) {
      var mouCustSocmedObj = new MouCustSocmedObj();
      mouCustSocmedObj.MrSocmedCode = this.CustDataForm.controls["socmed"].value[i].MrSocmedCode;
      mouCustSocmedObj.MrSocmedName = this.CustDataForm.controls["socmed"].value[i].MrSocmedName;
      mouCustSocmedObj.SocmedId = this.CustDataForm.controls["socmed"].value[i].SocmedId;
      this.custDataPersonalObj.MouCustSocmedObjs.push(mouCustSocmedObj);
    }
  }

  setMouCustGrpObj() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      this.custDataPersonalObj.MouCustGrpObjs = new Array<MouCustGrpObj>();
      for (let i = 0; i < this.CustDataForm.controls["custGrpMember"].value.length; i++) {
        var mouCustGrpObj = new MouCustGrpObj();
        mouCustGrpObj.CustNo = this.CustDataForm.controls["custGrpMember"].value[i].CustNo;
        mouCustGrpObj.MrCustRelationshipCode = this.CustDataForm.controls["custGrpMember"].value[i].MrCustRelationshipCode;
        mouCustGrpObj.CustGrpNotes = this.CustDataForm.controls["custGrpMember"].value[i].CustGrpNotes;
        mouCustGrpObj.IsReversible = this.CustDataForm.controls["custGrpMember"].value[i].IsReversible;
        this.custDataPersonalObj.MouCustGrpObjs.push(mouCustGrpObj);
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      this.custDataCompanyObj.MouCustGrpObjs = new Array<MouCustGrpObj>();
      for (let i = 0; i < this.CustDataCompanyForm.controls["custGrpMemberCompany"].value.length; i++) {
        var mouCustGrpObj = new MouCustGrpObj();
        mouCustGrpObj.CustNo = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustNo;
        mouCustGrpObj.MrCustRelationshipCode = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].MrCustRelationshipCode;
        mouCustGrpObj.CustGrpNotes = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustGrpNotes;
        mouCustGrpObj.IsReversible = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].IsReversible;
        this.custDataCompanyObj.MouCustGrpObjs.push(mouCustGrpObj);
      }
    }

  }

  getCustContactInformation(event) {
    this.listMouCustPersonalContactInformation = event;
    this.CheckSpouseExist();
  }

  getMouCustBankAcc(event) {
    this.listMouCustBankAcc = event;
  }

  getMouCustBankAccCompany(event) {
    this.listMouCustBankAccCompany = event;
  }

  getMouCustShareholder(event) {
    this.listShareholder = event;
  }

  getMouCustCompanyContactPerson(event) {
    this.listContactPersonCompany = event;
  }

  getMouCustLegalDoc(event) {
    this.listLegalDoc = event;
  }

  copyToContactPersonAddr(event) {
    if (event == CommonConstant.AddrTypeLegal) {
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
      this.custContactInformationComponent.inputAddressObjForCP.default = this.custContactInformationComponent.contactPersonAddrObj;
      this.custContactInformationComponent.inputAddressObjForCP.inputField = this.custContactInformationComponent.inputFieldContactPersonObj;
    }

    if (event == CommonConstant.AddrTypeResidence) {
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
      this.custContactInformationComponent.inputAddressObjForCP.default = this.custContactInformationComponent.contactPersonAddrObj;
      this.custContactInformationComponent.inputAddressObjForCP.inputField = this.custContactInformationComponent.inputFieldContactPersonObj;
    }

    if (event == CommonConstant.AddrTypeMailing) {
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
      this.custContactInformationComponent.inputAddressObjForCP.default = this.custContactInformationComponent.contactPersonAddrObj;
      this.custContactInformationComponent.inputAddressObjForCP.inputField = this.custContactInformationComponent.inputFieldContactPersonObj;
    }
  }

  copyToResidence() {
    if (this.copyFromResidence == CommonConstant.AddrTypeLegal) {
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
      this.inputAddrResidenceObj.default = this.residenceAddrObj;
      this.inputAddrResidenceObj.inputField = this.inputFieldResidenceObj;
    }
  }

  copyToMailing() {
    if (this.copyFromMailing == CommonConstant.AddrTypeLegal) {
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
      this.inputAddressObjForMailing.default = this.mailingAddrObj;
      this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
    }

    if (this.copyFromMailing == CommonConstant.AddrTypeResidence) {
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
      this.inputAddressObjForMailing.default = this.mailingAddrObj;
      this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
    }
  }

  copyToMailingCompany() {
    if (this.copyFromMailingCompany == CommonConstant.AddrTypeLegal) {
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
      this.inputAddrMailingCompanyObj.inputField = this.inputFieldMailingCompanyObj;
      this.inputAddrMailingCompanyObj.default = this.mailingAddrCompanyObj;
    }
  }

  async getCustData() {
    await this.http.post(URLConstant.GetMouCustByMouCustId, { "Id": this.MouCustId }).toPromise().then(
      (response) => {
        if (response["MouCustObj"]["MouCustId"] > 0) {
          if (response["MouCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.custDataPersonalObj = new MouCustPersonalDataObj();
            this.custDataPersonalObj.MouCustObj = response["MouCustObj"];
            this.custDataPersonalObj.MouCustPersonalObj = response["MouCustPersonalObj"];
            this.custDataPersonalObj.MouCustAddrLegalObj = response["MouCustAddrLegalObj"];
            this.custDataPersonalObj.MouCustAddrResidenceObj = response["MouCustAddrResidenceObj"];
            this.custDataPersonalObj.MouCustAddrMailingObj = response["MouCustAddrMailingObj"];
            this.custDataPersonalObj.MouCustPersonalContactPersonObjs = response["MouCustPersonalContactPersonObjs"];
            this.listMouCustPersonalContactInformation = this.custDataPersonalObj.MouCustPersonalContactPersonObjs;
            this.custDataPersonalObj.MouCustPersonalFinDataObj = response["MouCustPersonalFinDataObj"];
            this.custDataPersonalObj.MouCustBankAccObjs = response["MouCustBankAccObjs"];
            this.listMouCustBankAcc = this.custDataPersonalObj.MouCustBankAccObjs;
            this.custDataPersonalObj.MouCustPersonalJobDataObj = response["MouCustPersonalJobDataObj"];
            this.custDataPersonalObj.MouCustSocmedObjs = response["MouCustSocmedObjs"];
            this.custDataPersonalObj.MouCustGrpObjs = response["MouCustGrpObjs"];

            
            if (this.custDataPersonalObj.MouCustObj.MouCustId != 0) {
              this.defCustModelCode = this.custDataPersonalObj.MouCustObj.CustModelCode;
            }

            this.setAddrLegalObj(CommonConstant.CustTypePersonal);
            this.setAddrResidenceObj();
            this.setAddrMailingObj(CommonConstant.CustTypePersonal);

            this.MouCustPersonalId = this.custDataPersonalObj.MouCustPersonalObj.MouCustPersonalId;
            this.MouCustAddrId = this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustAddrJobObj.MouCustAddrId;
            this.MouCustPersonalJobDataId = this.custDataPersonalObj.MouCustPersonalJobDataObj.MouCustPersonalJobDataId;
            this.MouCustFinDataId = this.custDataPersonalObj.MouCustPersonalFinDataObj.MouCustPersonalFinDataId;
            this.MouCustAddrLegalId = this.custDataPersonalObj.MouCustAddrLegalObj.MouCustAddrId;
            this.MouCustAddrResidenceId = this.custDataPersonalObj.MouCustAddrResidenceObj.MouCustAddrId;
            this.MouCustAddrMailingId = this.custDataPersonalObj.MouCustAddrMailingObj.MouCustAddrId;

            this.MrCustTypeCode = this.custDataPersonalObj.MouCustObj.MrCustTypeCode;

            this.CheckSpouseExist();
          }

          if (response["MouCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
            this.custDataCompanyObj = new MouCustCompanyDataObj();
            this.custDataCompanyObj.MouCustObj = response["MouCustObj"];
            this.custDataCompanyObj.MouCustCompanyObj = response["MouCustCompanyObj"];
            this.custDataCompanyObj.MouCustAddrLegalObj = response["MouCustAddrLegalObj"];
            this.custDataCompanyObj.MouCustAddrMailingObj = response["MouCustAddrMailingObj"];
            this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs = response["MouCustCompanyMgmntShrholderObjs"];
            this.listShareholder = this.custDataCompanyObj.MouCustCompanyMgmntShrholderObjs;
            this.custDataCompanyObj.MouCustCompanyContactPersonObjs = response["MouCustCompanyContactPersonObjs"];
            this.listContactPersonCompany = this.custDataCompanyObj.MouCustCompanyContactPersonObjs;
            this.custDataCompanyObj.MouCustCompanyFinDataObj = response["MouCustCompanyFinDataObj"];
            if (response["MouCustCompanyFinDataObj"] != undefined) {
              if (response["MouCustCompanyFinDataObj"].DateAsOf != undefined && response["MouCustCompanyFinDataObj"].DateAsOf != null) {
                this.custDataCompanyObj.MouCustCompanyFinDataObj.DateAsOf = formatDate(response["MouCustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
              }
            }
            this.custDataCompanyObj.MouCustBankAccObjs = response["MouCustBankAccObjs"];
            this.listMouCustBankAccCompany = this.custDataCompanyObj.MouCustBankAccObjs;
            this.custDataCompanyObj.MouCustCompanyLegalDocObjs = response["MouCustCompanyLegalDocObjs"];
            this.listLegalDoc = this.custDataCompanyObj.MouCustCompanyLegalDocObjs;
            this.custDataCompanyObj.MouCustGrpObjs = response["MouCustGrpObjs"];

            this.setAddrLegalObj(CommonConstant.CustTypeCompany);
            this.setAddrMailingObj(CommonConstant.CustTypeCompany);

            console.log(response);
            this.MouCustCompanyId = this.custDataCompanyObj.MouCustCompanyObj.MouCustCompanyId;
            this.MouCustFinDataId = this.custDataCompanyObj.MouCustCompanyFinDataObj.MouCustCompanyFinDataId;
            this.MouCustAddrLegalId = this.custDataCompanyObj.MouCustAddrLegalObj.MouCustAddrId;
            this.MouCustAddrMailingId = this.custDataCompanyObj.MouCustAddrMailingObj.MouCustAddrId;


            this.MrCustTypeCode = this.custDataCompanyObj.MouCustObj.MrCustTypeCode;
          }
        }
        else {
          this.MrCustTypeCode = this.CustTypeObj[0].Key;
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

    this.inputAddrLegalPersonalObj = new InputAddressObj;
    this.inputAddrLegalPersonalObj.showAllPhn = false;
  }

  initAddrLegalCompanyObj() {
    this.legalAddrCompanyObj = new AddrObj();
    this.inputFieldLegalCompanyObj = new InputFieldObj();
    this.inputFieldLegalCompanyObj.inputLookupObj = new InputLookupObj();

    this.inputAddrLegalCompanyObj = new InputAddressObj();
    this.inputAddrLegalCompanyObj.showPhn3 = false;
    this.inputAddrLegalCompanyObj.showSubsection = false;
    this.inputAddrLegalCompanyObj.showOwnership = false;
  }

  initAddrResidenceObj() {
    this.residenceAddrObj = new AddrObj();
    this.inputFieldResidenceObj = new InputFieldObj();
    this.inputFieldResidenceObj.inputLookupObj = new InputLookupObj();

    this.inputAddrResidenceObj = new InputAddressObj();
    this.inputAddrResidenceObj.showPhn3 = false;
    this.inputAddrResidenceObj.showSubsection = false;
    this.inputAddrResidenceObj.showOwnership = true;
  }

  initAddrMailingObj() {
    this.mailingAddrObj = new AddrObj();
    this.inputFieldMailingObj = new InputFieldObj();
    this.inputFieldMailingObj.inputLookupObj = new InputLookupObj();

    this.inputAddressObjForMailing = new InputAddressObj();
    this.inputAddressObjForMailing.showSubsection = false;
    this.inputAddressObjForMailing.showPhn3 = false;
  }

  initAddrMailingCompanyObj() {
    this.mailingAddrCompanyObj = new AddrObj();
    this.inputFieldMailingCompanyObj = new InputFieldObj();
    this.inputFieldMailingCompanyObj.inputLookupObj = new InputLookupObj();

    this.inputAddrMailingCompanyObj = new InputAddressObj();
    this.inputAddrMailingCompanyObj.showPhn3 = false;
    this.inputAddrMailingCompanyObj.showSubsection = false;
  }

  setAddrLegalObj(custTypeCode) {
    if (custTypeCode == CommonConstant.CustTypePersonal) {
      this.initAddrLegalObj();

      if (this.custDataPersonalObj.MouCustAddrLegalObj != undefined) {
        this.legalAddrObj.Addr = this.custDataPersonalObj.MouCustAddrLegalObj.Addr;
        this.legalAddrObj.AreaCode1 = this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode1;
        this.legalAddrObj.AreaCode2 = this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode2;
        this.legalAddrObj.AreaCode3 = this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode3;
        this.legalAddrObj.AreaCode4 = this.custDataPersonalObj.MouCustAddrLegalObj.AreaCode4;
        this.legalAddrObj.City = this.custDataPersonalObj.MouCustAddrLegalObj.City;
        this.legalAddrObj.Fax = this.custDataPersonalObj.MouCustAddrLegalObj.Fax;
        this.legalAddrObj.FaxArea = this.custDataPersonalObj.MouCustAddrLegalObj.FaxArea;
        this.legalAddrObj.Phn1 = this.custDataPersonalObj.MouCustAddrLegalObj.Phn1;
        this.legalAddrObj.Phn2 = this.custDataPersonalObj.MouCustAddrLegalObj.Phn2;
        this.legalAddrObj.PhnArea1 = this.custDataPersonalObj.MouCustAddrLegalObj.PhnArea1;
        this.legalAddrObj.PhnArea2 = this.custDataPersonalObj.MouCustAddrLegalObj.PhnArea2;
        this.legalAddrObj.PhnExt1 = this.custDataPersonalObj.MouCustAddrLegalObj.PhnExt1;
        this.legalAddrObj.PhnExt2 = this.custDataPersonalObj.MouCustAddrLegalObj.PhnExt2;
        this.legalAddrObj.SubZipcode = this.custDataPersonalObj.MouCustAddrLegalObj.SubZipcode;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.custDataPersonalObj.MouCustAddrLegalObj.Zipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.MouCustAddrLegalObj.Zipcode };
        this.inputAddrLegalPersonalObj.default = this.legalAddrObj;
        this.inputAddrLegalPersonalObj.inputField = this.inputFieldLegalObj;
      }
    }

    if (custTypeCode == CommonConstant.CustTypeCompany) {
      this.initAddrLegalCompanyObj();

      if (this.custDataCompanyObj.MouCustAddrLegalObj != undefined) {
        this.legalAddrCompanyObj.Addr = this.custDataCompanyObj.MouCustAddrLegalObj.Addr;
        this.legalAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode1;
        this.legalAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode2;
        this.legalAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode3;
        this.legalAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.MouCustAddrLegalObj.AreaCode4;
        this.legalAddrCompanyObj.City = this.custDataCompanyObj.MouCustAddrLegalObj.City;
        this.legalAddrCompanyObj.Fax = this.custDataCompanyObj.MouCustAddrLegalObj.Fax;
        this.legalAddrCompanyObj.FaxArea = this.custDataCompanyObj.MouCustAddrLegalObj.FaxArea;
        this.legalAddrCompanyObj.Phn1 = this.custDataCompanyObj.MouCustAddrLegalObj.Phn1;
        this.legalAddrCompanyObj.Phn2 = this.custDataCompanyObj.MouCustAddrLegalObj.Phn2;
        this.legalAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.MouCustAddrLegalObj.PhnArea1;
        this.legalAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.MouCustAddrLegalObj.PhnArea2;
        this.legalAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.MouCustAddrLegalObj.PhnExt1;
        this.legalAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.MouCustAddrLegalObj.PhnExt2;
        this.legalAddrCompanyObj.SubZipcode = this.custDataCompanyObj.MouCustAddrLegalObj.SubZipcode;

        this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.MouCustAddrLegalObj.Zipcode;
        this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.MouCustAddrLegalObj.Zipcode };

        this.inputAddrLegalCompanyObj.inputField = this.inputFieldLegalCompanyObj;
        this.inputAddrLegalCompanyObj.default = this.legalAddrCompanyObj;
      }
    }
  }

  setAddrResidenceObj() {
    this.initAddrResidenceObj();

    if (this.custDataPersonalObj.MouCustAddrResidenceObj != undefined) {
      this.residenceAddrObj.Addr = this.custDataPersonalObj.MouCustAddrResidenceObj.Addr;
      this.residenceAddrObj.AreaCode1 = this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode1;
      this.residenceAddrObj.AreaCode2 = this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode2;
      this.residenceAddrObj.AreaCode3 = this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode3;
      this.residenceAddrObj.AreaCode4 = this.custDataPersonalObj.MouCustAddrResidenceObj.AreaCode4;
      this.residenceAddrObj.City = this.custDataPersonalObj.MouCustAddrResidenceObj.City;
      this.residenceAddrObj.Fax = this.custDataPersonalObj.MouCustAddrResidenceObj.Fax;
      this.residenceAddrObj.FaxArea = this.custDataPersonalObj.MouCustAddrResidenceObj.FaxArea;
      this.residenceAddrObj.Phn1 = this.custDataPersonalObj.MouCustAddrResidenceObj.Phn1;
      this.residenceAddrObj.Phn2 = this.custDataPersonalObj.MouCustAddrResidenceObj.Phn2;
      this.residenceAddrObj.PhnArea1 = this.custDataPersonalObj.MouCustAddrResidenceObj.PhnArea1;
      this.residenceAddrObj.PhnArea2 = this.custDataPersonalObj.MouCustAddrResidenceObj.PhnArea2;
      this.residenceAddrObj.PhnExt1 = this.custDataPersonalObj.MouCustAddrResidenceObj.PhnExt1;
      this.residenceAddrObj.PhnExt2 = this.custDataPersonalObj.MouCustAddrResidenceObj.PhnExt2;
      this.residenceAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.MouCustAddrResidenceObj.MrHouseOwnershipCode;
      this.residenceAddrObj.SubZipcode = this.custDataPersonalObj.MouCustAddrResidenceObj.SubZipcode;

      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.custDataPersonalObj.MouCustAddrResidenceObj.Zipcode;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.MouCustAddrResidenceObj.Zipcode };
      this.inputAddrResidenceObj.default = this.residenceAddrObj;
      this.inputAddrResidenceObj.inputField = this.inputFieldResidenceObj;
    }
  }

  setAddrMailingObj(custTypeCode) {
    if (custTypeCode == CommonConstant.CustTypePersonal) {
      this.initAddrMailingObj();

      if (this.custDataPersonalObj.MouCustAddrMailingObj != undefined) {
        this.mailingAddrObj.Addr = this.custDataPersonalObj.MouCustAddrMailingObj.Addr;
        this.mailingAddrObj.AreaCode1 = this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode1;
        this.mailingAddrObj.AreaCode2 = this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode2;
        this.mailingAddrObj.AreaCode3 = this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode3;
        this.mailingAddrObj.AreaCode4 = this.custDataPersonalObj.MouCustAddrMailingObj.AreaCode4;
        this.mailingAddrObj.City = this.custDataPersonalObj.MouCustAddrMailingObj.City;
        this.mailingAddrObj.Fax = this.custDataPersonalObj.MouCustAddrMailingObj.Fax;
        this.mailingAddrObj.FaxArea = this.custDataPersonalObj.MouCustAddrMailingObj.FaxArea;
        this.mailingAddrObj.Phn1 = this.custDataPersonalObj.MouCustAddrMailingObj.Phn1;
        this.mailingAddrObj.Phn2 = this.custDataPersonalObj.MouCustAddrMailingObj.Phn2;
        this.mailingAddrObj.PhnArea1 = this.custDataPersonalObj.MouCustAddrMailingObj.PhnArea1;
        this.mailingAddrObj.PhnArea2 = this.custDataPersonalObj.MouCustAddrMailingObj.PhnArea2;
        this.mailingAddrObj.PhnExt1 = this.custDataPersonalObj.MouCustAddrMailingObj.PhnExt1;
        this.mailingAddrObj.PhnExt2 = this.custDataPersonalObj.MouCustAddrMailingObj.PhnExt2;
        this.mailingAddrObj.SubZipcode = this.custDataPersonalObj.MouCustAddrMailingObj.SubZipcode;

        this.inputFieldMailingObj.inputLookupObj.nameSelect = this.custDataPersonalObj.MouCustAddrMailingObj.Zipcode;
        this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.MouCustAddrMailingObj.Zipcode };
        this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
        this.inputAddressObjForMailing.default = this.mailingAddrObj;
      }
    }

    if (custTypeCode == CommonConstant.CustTypeCompany) {
      this.initAddrMailingCompanyObj();

      if (this.custDataCompanyObj.MouCustAddrMailingObj != undefined) {
        this.mailingAddrCompanyObj.Addr = this.custDataCompanyObj.MouCustAddrMailingObj.Addr;
        this.mailingAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode1;
        this.mailingAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode2;
        this.mailingAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode3;
        this.mailingAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.MouCustAddrMailingObj.AreaCode4;
        this.mailingAddrCompanyObj.City = this.custDataCompanyObj.MouCustAddrMailingObj.City;
        this.mailingAddrCompanyObj.Fax = this.custDataCompanyObj.MouCustAddrMailingObj.Fax;
        this.mailingAddrCompanyObj.FaxArea = this.custDataCompanyObj.MouCustAddrMailingObj.FaxArea;
        this.mailingAddrCompanyObj.Phn1 = this.custDataCompanyObj.MouCustAddrMailingObj.Phn1;
        this.mailingAddrCompanyObj.Phn2 = this.custDataCompanyObj.MouCustAddrMailingObj.Phn2;
        this.mailingAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.MouCustAddrMailingObj.PhnArea1;
        this.mailingAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.MouCustAddrMailingObj.PhnArea2;
        this.mailingAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.MouCustAddrMailingObj.PhnExt1;
        this.mailingAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.MouCustAddrMailingObj.PhnExt2;
        this.mailingAddrCompanyObj.SubZipcode = this.custDataCompanyObj.MouCustAddrMailingObj.SubZipcode;

        this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.MouCustAddrMailingObj.Zipcode;
        this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.MouCustAddrMailingObj.Zipcode };
        this.inputAddrMailingCompanyObj.inputField = this.inputFieldMailingCompanyObj;
        this.inputAddrMailingCompanyObj.default = this.mailingAddrCompanyObj;
      }
    }
  }

  CopyCustomer(event) {
    this.copyAddrFromLookup(event);

    if (event["CustPersonalContactPersonObjs"] != undefined) {
      this.listMouCustPersonalContactInformation = event["CustPersonalContactPersonObjs"];
      this.CheckSpouseExist();
    }

    if (event["CustPersonalFinDataObj"] != undefined) {
      this.custDataPersonalObj.MouCustPersonalFinDataObj = event["CustPersonalFinDataObj"];
      this.custDataPersonalObj.MouCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = event["CustPersonalFinDataObj"].MrSourceOfIncomeCode;

      let TotalMonthlyIncome = this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyIncomeAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.SpouseMonthlyIncomeAmt;
      let TotalMonthlyExpense = this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyExpenseAmt + this.custDataPersonalObj.MouCustPersonalFinDataObj.MonthlyInstallmentAmt;
      this.CustDataForm.controls["financialData"].patchValue({
        TotalMonthlyIncome: TotalMonthlyIncome,
        TotalMonthlyExpense: TotalMonthlyExpense,
        NettMonthlyIncome: TotalMonthlyIncome - TotalMonthlyExpense
      });
    }

    if (event["CustBankAccObjs"] != undefined) {
      this.listMouCustBankAcc = event["CustBankAccObjs"];
    }

    if (event["CustPersonalJobDataObj"] != undefined) {
      this.custJobDataComponent.custModelCode = event["CustObj"].MrCustModelCode;
      this.custJobDataComponent.MouCustPersonalJobDataObj = event["CustPersonalJobDataObj"];
      this.custJobDataComponent.bindMouCustPersonalJobData();
    }

    if (event["CustGrpObjs"] != undefined) {
      this.custGrpMemberComponent.MouCustGrpObjs = event["CustGrpObjs"];
      this.custGrpMemberComponent.copyAppGrp();
    }

  }

  CopyCustomerCompany(event) {
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
      this.custDataCompanyObj.MouCustCompanyFinDataObj = event["CustCompanyFinDataObj"];
      this.custDataCompanyObj.MouCustCompanyFinDataObj.DateAsOf = formatDate(event["CustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
    }

    if (event["CustBankAccObjs"] != undefined) {
      this.listMouCustBankAccCompany = event["CustBankAccObjs"];
    }

    if (event["CustGrpObjs"] != undefined) {
      this.custGrpMemberComponent.MouCustGrpObjs = event["CustGrpObjs"];
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

      this.inputAddrLegalPersonalObj.default = this.legalAddrObj;
      this.inputAddrLegalPersonalObj.inputField = this.inputFieldLegalObj;
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
      this.inputAddrResidenceObj.default = this.residenceAddrObj;
      this.inputAddrResidenceObj.inputField = this.inputFieldResidenceObj;
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
      this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
      this.inputAddressObjForMailing.default = this.mailingAddrObj;
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


      this.inputAddrLegalCompanyObj.inputField = this.inputFieldLegalCompanyObj;
      this.inputAddrLegalCompanyObj.default = this.legalAddrCompanyObj;
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
      this.inputAddrMailingCompanyObj.inputField = this.inputFieldMailingCompanyObj;
      this.inputAddrMailingCompanyObj.default = this.mailingAddrCompanyObj;
    }
  }

  async bindCustTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { 'RefMasterTypeCode': CommonConstant.RefMasterTypeCodeCustType }).toPromise().then(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  EmitToMainComp() {
    this.outputTab.emit(this.MrCustTypeCode);
  }

  GenderChanged(event) {
    if (event.IsSpouseDelete == true) {
      for (let i = 0; i < this.listMouCustPersonalContactInformation.length; i++) {
        if (this.listMouCustPersonalContactInformation[i].MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse) {
          this.listMouCustPersonalContactInformation.splice(i, 1);
        }
        this.IsSpouseExist = false;
      }
    }
    this.spouseGender = event.SpouseGender;
  }
  MaritalChanged(event) {
    this.isMarried = event;
  }
  CheckSpouseExist() {
    var CheckSpouseContactInfo = this.listMouCustPersonalContactInformation.find(
      x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
    if (CheckSpouseContactInfo != null) {
      this.IsSpouseExist = true;
    }
    else {
      this.IsSpouseExist = false;
    }
  }

  checkIntegrator() {
    if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
      this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
      this.thirdPartyObj.TrxTypeCode = CommonConstant.MOU_TRX_TYPE_CODE;
      this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;

      var custObjForAddTrxData = new MouCustObjForAddTrxData();

      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
        this.setCustPersonalObjForSave();
        custObjForAddTrxData.MouCustPersonalObj = this.custDataPersonalObj.MouCustPersonalObj;
        custObjForAddTrxData.MouCustObj = this.custDataPersonalObj.MouCustObj;
        custObjForAddTrxData.MouCustPersonalJobDataObj = this.custDataPersonalObj.MouCustPersonalJobDataObj;
        custObjForAddTrxData.MouCustAddrLegalObj = this.custDataPersonalObj.MouCustAddrLegalObj;
        this.thirdPartyObj.TrxNo = this.returnMouObj["MouCustNo"];
      }
      else if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
        this.setCustCompanyObjForSave();
        custObjForAddTrxData.MouCustCompanyObj = this.custDataCompanyObj.MouCustCompanyObj;
        custObjForAddTrxData.MouCustObj = this.custDataCompanyObj.MouCustObj;
        this.thirdPartyObj.TrxNo = this.returnMouObj["MouCustNo"];
      }

      this.http.post(URLConstant.CheckMouCustIntegrator, custObjForAddTrxData).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response) => {
              this.latestReqDtCheckIntegrator = response['ReqDt'];
              this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
              this.reqLatestJson = JSON.parse(response['ReqJson']);
              if (this.reqLatestJson != null && this.reqLatestJson != "") {
                this.latestCustDataObj = new AppCustCompareObj();

                this.latestCustDataObj.CustName = this.reqLatestJson['CustName'];
                this.latestCustDataObj.Gender = this.reqLatestJson['Gender'];
                this.latestCustDataObj.BirthPlace = this.reqLatestJson['BirthPlace'];
                this.latestCustDataObj.BirthDt = formatDate(new Date(this.reqLatestJson['BirthDt']), 'yyyy-MM-dd', 'en-US');
                this.latestCustDataObj.MaritalStatus = this.reqLatestJson['MaritalStatus'];
                this.latestCustDataObj.CustPhnNo = this.reqLatestJson['CustPhnNo'];
                this.latestCustDataObj.CustEmail = this.reqLatestJson['CustEmail'];
                this.latestCustDataObj.IdNo = this.reqLatestJson['IdNo'];
                this.latestCustDataObj.IdType = this.reqLatestJson['IdType'];
                this.latestCustDataObj.TaxNo = this.reqLatestJson['TaxNo'];
                if (this.reqLatestJson["CustType"] == CommonConstant.CustTypePersonal) {
                  this.latestCustDataObj.HomeAddr = this.reqLatestJson['HomeAddr'];
                  this.latestCustDataObj.HomeRt = this.reqLatestJson['HomeRt'];
                  this.latestCustDataObj.HomeRw = this.reqLatestJson['HomeRw'];
                  this.latestCustDataObj.HomeZipCode = this.reqLatestJson['HomeZipCode'];
                  this.latestCustDataObj.HomeKelurahan = this.reqLatestJson['HomeKelurahan'];
                  this.latestCustDataObj.HomeKecamatan = this.reqLatestJson['HomeKecamatan'];
                  this.latestCustDataObj.HomeCity = this.reqLatestJson['HomeCity'];
                }
              }
            }
          );
        });
    }
  }

  GetGS() {
    this.generalSettingObj = new GeneralSettingObj();
    this.generalSettingObj.ListGsCode.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.ListGsCode.push(CommonConstant.GSCodeIsUseDigitalization);

    this.http.post(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).subscribe(
      (response) => {
        this.returnGeneralSettingObj = response;

        var gsNeedCheckBySystem = this.returnGeneralSettingObj["ResponseGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = this.returnGeneralSettingObj["ResponseGeneralSettingObj"].find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        
        if(gsNeedCheckBySystem != undefined){
          this.isNeedCheckBySystem = gsNeedCheckBySystem.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if(gsUseDigitalization != undefined){
          this.isUseDigitalization = gsUseDigitalization.GsValue;
        }else{
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }
        this.mouObj = new MouCustObj();
        this.mouObj.MouCustId = this.MouCustId;
        this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).subscribe(
          (response) => {
            this.returnMouObj = response;

            this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
            this.thirdPartyObj.TrxTypeCode = CommonConstant.MOU_TRX_TYPE_CODE;
            this.thirdPartyObj.TrxNo = this.returnMouObj["MouCustNo"];
            this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;
            if(this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0"){
              this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
                (response) => {
                  if (response != null) {
                    this.latestReqDtCheckIntegrator = response['ReqDt'];
                    this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                    this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
                      (response) => {
                        this.latestReqDtCheckIntegrator = response['ReqDt'];
                        this.thirdPartyRsltHId = response['ThirdPartyRsltHId'];
                        this.reqLatestJson = JSON.parse(response['ReqJson']);
                        if (this.reqLatestJson != null && this.reqLatestJson != "") {
                          this.latestCustDataObj = new AppCustCompareObj();
  
                          this.latestCustDataObj.CustName = this.reqLatestJson['CustName'];
                          this.latestCustDataObj.Gender = this.reqLatestJson['Gender'];
                          this.latestCustDataObj.BirthPlace = this.reqLatestJson['BirthPlace'];
                          this.latestCustDataObj.BirthDt = formatDate(new Date(this.reqLatestJson['BirthDt']), 'yyyy-MM-dd', 'en-US');
                          this.latestCustDataObj.MaritalStatus = this.reqLatestJson['MaritalStatus'];
                          this.latestCustDataObj.CustPhnNo = this.reqLatestJson['CustPhnNo'];
                          this.latestCustDataObj.CustEmail = this.reqLatestJson['CustEmail'];
                          this.latestCustDataObj.IdNo = this.reqLatestJson['IdNo'];
                          this.latestCustDataObj.IdType = this.reqLatestJson['IdType'];
                          this.latestCustDataObj.TaxNo = this.reqLatestJson['TaxNo'];
                          if (this.reqLatestJson["CustType"] == CommonConstant.CustTypePersonal) {
                            this.latestCustDataObj.HomeAddr = this.reqLatestJson['HomeAddr'];
                            this.latestCustDataObj.HomeRt = this.reqLatestJson['HomeRt'];
                            this.latestCustDataObj.HomeRw = this.reqLatestJson['HomeRw'];
                            this.latestCustDataObj.HomeZipCode = this.reqLatestJson['HomeZipCode'];
                            this.latestCustDataObj.HomeKelurahan = this.reqLatestJson['HomeKelurahan'];
                            this.latestCustDataObj.HomeKecamatan = this.reqLatestJson['HomeKecamatan'];
                            this.latestCustDataObj.HomeCity = this.reqLatestJson['HomeCity'];
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
  confirmFraudCheck() {
    let inputCustObj = new AppCustCompareObj();

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {

      inputCustObj.CustName = this.CustDataForm.controls["PersonalMain"]["controls"].CustFullName.value;
      inputCustObj.Gender = this.CustDataForm.controls["PersonalMain"]["controls"].MrGenderCode.value;
      inputCustObj.BirthPlace = this.CustDataForm.controls["PersonalMain"]["controls"].BirthPlace.value;
      inputCustObj.BirthDt = this.CustDataForm.controls["PersonalMain"]["controls"].BirthDt.value;
      inputCustObj.MaritalStatus = this.CustDataForm.controls["PersonalMain"]["controls"].MrMaritalStatCode.value;
      inputCustObj.CustPhnNo = this.CustDataForm.controls["PersonalMain"]["controls"].MobilePhnNo1.value;
      inputCustObj.CustEmail = this.CustDataForm.controls["PersonalMain"]["controls"].Email1.value;
      inputCustObj.IdNo = this.CustDataForm.controls["PersonalMain"]["controls"].IdNo.value;
      inputCustObj.IdType = this.CustDataForm.controls["PersonalMain"]["controls"].MrIdTypeCode.value;
      inputCustObj.TaxNo = this.CustDataForm.controls["PersonalMain"]["controls"].TaxIdNo.value;

      inputCustObj.HomeAddr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      inputCustObj.HomeRt = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      inputCustObj.HomeRw = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      inputCustObj.HomeZipCode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      inputCustObj.HomeKelurahan = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      inputCustObj.HomeKecamatan = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      inputCustObj.HomeCity = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      let inputLeadString = JSON.stringify(inputCustObj);
      let latestCustDataString = JSON.stringify(this.latestCustDataObj);

      if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0" && inputLeadString != latestCustDataString) {
        if (confirm("Recent Customer Main Data and Legal Address different with previous data. Are you sure want to submit without fraud check ?")) {
          return true;
        }
      }
      else {
        return true;
      }
    }
    else if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      inputCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
      inputCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      if ((this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") 
      && (this.latestCustDataObj.TaxNo != this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value 
      || this.latestCustDataObj.CustName != this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value)) {
        if (confirm("Recent Customer Main Data different with previous data. Are you sure want to submit without fraud check ?")) {
          return true;
        }
      }
      else {
        return true;
      }
    }

    else {
      return true;
    }
  }
}
