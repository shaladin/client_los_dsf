import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CustDataPersonalObj } from 'app/shared/model/cust-data-personal-obj.model';
import { CustDataObj } from 'app/shared/model/cust-data-obj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { CustPersonalMainDataComponent } from './component/personal-main-data/cust-personal-main-data.component';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { InputFieldObj } from 'app/shared/model/input-field-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { CustPersonalContactInformationComponent } from './component/personal-contact-information/cust-personal-contact-information.component';
import { CustJobDataComponent } from './component/job-data/cust-job-data.component';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { AppCustSocmedObj } from 'app/shared/model/app-cust-socmed-obj.model';
import { AppCustGrpObj } from 'app/shared/model/app-cust-grp-obj.model';
import { CustDataCompanyObj } from 'app/shared/model/cust-data-company-obj.model';
import { CustGrpMemberComponent } from './component/cust-grp-member/cust-grp-member.component';
import { formatDate } from '@angular/common';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppCustCompanyMgmntShrholderObj } from 'app/shared/model/app-cust-company-mgmnt-shrholder-obj.model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/app-cust-personal-contact-person-obj.model';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { AppObj } from 'app/shared/model/app/app.model';
import { MatRadioChange } from '@angular/material/radio/typings/public-api';
import { AppCustPersonalFinDataObj } from 'app/shared/model/app-cust-personal-fin-data-obj.model';
import { AppCustPersonalJobDataObj } from 'app/shared/model/app-cust-personal-job-data-obj.model';
import { AppCustCompanyFinDataObj } from 'app/shared/model/app-cust-company-fin-data-obj.model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/app-cust-company-contact-person-obj.model';
import { AppCustObj } from 'app/shared/model/app-cust-obj.model';
import { AppCustPersonalObj } from 'app/shared/model/app-cust-personal-obj.model';
import { AppCustCompanyObj } from 'app/shared/model/app-cust-company-obj.model';
import { ThirdPartyResultHForFraudChckObj } from 'app/shared/model/third-party-result-h-for-fraud-chck-obj.model';
import { CustObjForAddTrxData } from 'app/shared/model/cust-obj-for-add-trx-data.model';
import { AppCustCompareObj } from 'app/shared/model/app-cust-compare-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { String } from 'typescript-string-operations';
import { GenericListByCodeObj } from 'app/shared/model/generic/generic-list-by-code-obj.model';
import { ResGeneralSettingObj, ResListGeneralSettingObj } from 'app/shared/model/response/general-setting/res-general-setting-obj.model';
import { ResThirdPartyRsltHObj } from 'app/shared/model/response/third-party-result/res-third-party-rslt-h-obj.model';
import { AppCustAssetObj } from 'app/shared/model/app-cust-asset/app-cust-asset-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { NapAppModel } from 'app/shared/model/nap-app.model';
import { AddressService } from 'app/shared/services/custAddr.service';

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

  @Input() appId: number;
  @Input() bizTemplateCode: string = "";
  @Input() showCancel: boolean = true;
  @Output() outputTab: EventEmitter<any> = new EventEmitter();
  @Output() outputCancel: EventEmitter<any> = new EventEmitter();

  isNeedCheckBySystem: string;
  isUseDigitalization: string;

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
  copyFromResidence: string;
  mailingAddrObj: AddrObj;
  inputFieldMailingObj: InputFieldObj;
  copyFromMailing: string;
  mailingAddrCompanyObj: AddrObj;
  inputFieldMailingCompanyObj: InputFieldObj;
  copyFromMailingCompany: string;
  appCustPersonalId: number;
  listAppCustPersonalContactInformation: Array<AppCustPersonalContactPersonObj> = new Array<AppCustPersonalContactPersonObj>(); inputAddressObjForLegal: InputAddressObj;
  inputAddressObjForResidence: InputAddressObj;
  inputAddressObjForMailing: InputAddressObj;
  inputAddressObjForLegalCoy: InputAddressObj;
  inputAddressObjForMailingCoy: InputAddressObj;
  listAppCustBankAcc: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  listAppCustBankAccCompany: Array<AppCustBankAccObj> = new Array<AppCustBankAccObj>();
  listShareholder: Array<AppCustCompanyMgmntShrholderObj> = new Array<AppCustCompanyMgmntShrholderObj>();
  listContactPersonCompany: Array<AppCustCompanyContactPersonObj> = new Array<AppCustCompanyContactPersonObj>();
  listLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();
  isBindDataDone: boolean = false;
  isExisting: boolean = false;
  ListAppCustAsset: Array<AppCustAssetObj>;

  CustTypeObj: Array<KeyValueObj>;
  copyToResidenceTypeObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  copyToMailingTypeObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
    {
      Key: "RESIDENCE",
      Value: "Residence"
    }
  ];

  copyToMailingCompanyTypeObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal"
    }
  ];

  LeadId: number;
  defCustModelCode: string;
  MrCustTypeCode: string;
  isMarried: boolean = true;
  spouseGender: string = CommonConstant.MasterCodeGenderFemale;
  isSpouseOk: boolean = true;
  IsSpouseExist: boolean = false;
  appData: AppObj;
  AppCustId: number;
  generalSettingObj: GenericListByCodeObj;
  returnAppObj: NapAppModel;
  thirdPartyObj: ThirdPartyResultHForFraudChckObj;
  latestCustDataObj: AppCustCompareObj;
  thirdPartyRsltHId: number;
  latestReqDtCheckIntegrator: Date;
  reqLatestJson: any;
  listAddrRequiredOwnership: Array<string> = new Array();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      this.appId = params["AppId"];
      this.LeadId = params["LeadId"];
    })
    this.ListAppCustAsset = new Array<AppCustAssetObj>();
  }

  async ngOnInit(): Promise<void> {
    await this.GetGS();
    this.inputAddressObjForLegal = new InputAddressObj();
    this.inputAddressObjForLegal.title = "Legal Address";
    this.inputAddressObjForLegal.showAllPhn = false;

    this.inputAddressObjForResidence = new InputAddressObj();
    this.inputAddressObjForResidence.showSubsection = false;
    this.inputAddressObjForResidence.showPhn3 = false;
    this.inputAddressObjForResidence.showOwnership = true;
    this.inputAddressObjForResidence.requiredOwnership = this.setOwnership(CommonConstant.AddrTypeResidence);
    this.inputAddressObjForResidence.showStayLength = true;

    this.inputAddressObjForMailing = new InputAddressObj();
    this.inputAddressObjForMailing.showSubsection = false;
    this.inputAddressObjForMailing.showPhn3 = false;

    this.inputAddressObjForLegalCoy = new InputAddressObj();
    this.inputAddressObjForLegalCoy.title = "Company Legal Address";
    this.inputAddressObjForLegalCoy.showPhn3 = false;

    this.inputAddressObjForMailingCoy = new InputAddressObj();
    this.inputAddressObjForMailingCoy.showSubsection = false;
    this.inputAddressObjForMailingCoy.showPhn3 = false;

    await this.bindCustTypeObj();
    this.initAddrObj();

    if (this.LeadId) {
      await this.getCustDataByLead();
    } else {
      await this.getCustData();
    }

    await this.http.post(URLConstant.GetAppById, { Id: this.appId }).toPromise().then(
      (response: AppObj) => {
        this.appData = response;
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  setOwnership(MrCustAddrTypeCode: string) : boolean {
    if(this.listAddrRequiredOwnership.find(addrType => addrType == MrCustAddrTypeCode)){
        return true;
    }
    return false;
  }

  checkIntegrator() {
    if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
      var custObjForAddTrxData = new CustObjForAddTrxData();
      custObjForAddTrxData.AppId = this.appId;
      custObjForAddTrxData.MrCustTypeCode = this.MrCustTypeCode;

      if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
        var custDataPersonalObj = new CustDataPersonalObj();
        custDataPersonalObj = this.setCustPersonalObjForSave();
        custObjForAddTrxData.RequestCustDataPersonalObj = custDataPersonalObj;
      }
      else if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
        var custDataPersonalObj = new CustDataPersonalObj();

        custObjForAddTrxData.RequestCustDataCompanyObj.AppCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
        custObjForAddTrxData.RequestCustDataCompanyObj.AppCustObj.MrCustTypeCode = this.MrCustTypeCode;
        custObjForAddTrxData.RequestCustDataCompanyObj.AppCustObj.TaxIdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
        custObjForAddTrxData.RequestCustDataCompanyObj.AppCustObj.MrIdTypeCode = "NPWP";
        custObjForAddTrxData.RequestCustDataCompanyObj.AppCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;

      }
      this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
      this.thirdPartyObj.TrxTypeCode = CommonConstant.APP_TRX_TYPE_CODE;
      this.thirdPartyObj.TrxNo = this.returnAppObj["AppNo"];
      this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;
      this.http.post(URLConstant.DigitalizationAddTrxSrcDataForFraudCheckingNAPCust, custObjForAddTrxData).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
            (response: ResThirdPartyRsltHObj) => {
              this.latestReqDtCheckIntegrator = response.ReqDt;
              this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
              this.reqLatestJson = JSON.parse(response.ReqJson);
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
                this.latestCustDataObj.Profession = this.reqLatestJson['Profession'];
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

  async GetGS() {
    this.generalSettingObj = new GenericListByCodeObj();
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIntegratorCheckBySystem);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeIsUseDigitalization);
    this.generalSettingObj.Codes.push(CommonConstant.GSCodeOwnershipMandatoryAddrType);

    await this.http.post<ResListGeneralSettingObj>(URLConstant.GetListGeneralSettingByListGsCode, this.generalSettingObj).toPromise().then(
      (response) => {
        var returnGeneralSettingObj: Array<ResGeneralSettingObj> = new Array<ResGeneralSettingObj>();
        returnGeneralSettingObj = response['ResGetListGeneralSettingObj'];

        var gsNeedCheckBySystem = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIntegratorCheckBySystem);
        var gsUseDigitalization = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeIsUseDigitalization);
        let gsListOwnershipMandatoryType = returnGeneralSettingObj.find(x => x.GsCode == CommonConstant.GSCodeOwnershipMandatoryAddrType);
        this.listAddrRequiredOwnership = gsListOwnershipMandatoryType.GsValue.split(',');
        
        if(gsNeedCheckBySystem != undefined){
          this.isNeedCheckBySystem = gsNeedCheckBySystem.GsValue;
        } else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIntegratorCheckBySystem));
        }

        if (gsUseDigitalization != undefined) {
          this.isUseDigitalization = gsUseDigitalization.GsValue;
        }
        else {
          this.toastr.warningMessage(String.Format(ExceptionConstant.GS_CODE_NOT_FOUND, CommonConstant.GSCodeIsUseDigitalization));
        }

        // this.appObj = new AppObj();
        // this.appObj.AppId = this.appId;
        var appObj = { Id: this.appId };
        if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0") {
          this.http.post(URLConstant.GetAppById, appObj).subscribe(
            (response: NapAppModel) => {
              this.returnAppObj = response;

              this.thirdPartyObj = new ThirdPartyResultHForFraudChckObj();
              this.thirdPartyObj.TrxTypeCode = CommonConstant.APP_TRX_TYPE_CODE;
              this.thirdPartyObj.TrxNo = this.returnAppObj["AppNo"];
              this.thirdPartyObj.FraudCheckType = CommonConstant.FRAUD_CHCK_CUST;
              this.http.post(URLConstant.GetThirdPartyResultHForFraudChecking, this.thirdPartyObj).subscribe(
                (response: ResThirdPartyRsltHObj) => {
                  if (response != null) {
                    this.latestReqDtCheckIntegrator = response.ReqDt;
                    this.thirdPartyRsltHId = response.ThirdPartyRsltHId;
                    this.reqLatestJson = JSON.parse(response.ReqJson);
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
                      this.latestCustDataObj.Profession = this.reqLatestJson['Profession'];
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
                }
              );
            }
          );
        }
      }
    );
  }

  SaveForm() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      var custDataPersonalObj = new CustDataPersonalObj();
      custDataPersonalObj = this.setCustPersonalObjForSave();
      for (let i = 0; i < custDataPersonalObj.AppCustGrpObjs.length; i++) {
        for (let j = i + 1; j < custDataPersonalObj.AppCustGrpObjs.length; j++) {
          if (custDataPersonalObj.AppCustGrpObjs[i]["CustNo"] == custDataPersonalObj.AppCustGrpObjs[j]["CustNo"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_CUST_MEMBER + (j + 1));
            return;
          }

          if (custDataPersonalObj.AppCustGrpObjs[i]["MrCustRelationshipCode"] == custDataPersonalObj.AppCustGrpObjs[j]["MrCustRelationshipCode"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_RELATIONSHIP_AS_OTHER_CUST_MEMBER + (j + 1));
            return;
          }
        }
      }

      if (this.appData) {
        console.log(this.appData)
        if (this.appData.BizTemplateCode === CommonConstant.CFNA || this.appData.BizTemplateCode === CommonConstant.CFRFN4W) {
          if (custDataPersonalObj.AppCustBankAccObjs.length <= 0) {
            this.toastr.warningMessage("Must Have At Least 1 Bank Account");
            return false;
          }
        }
      }

      if (this.isExpiredBirthDt || this.isExpiredEstablishmentDt || this.isExpiredDate) return;

      if (this.isSpouseOk) {
        if (this.confirmFraudCheck()) {

          this.http.post(URLConstant.AddEditCustDataPersonal, custDataPersonalObj).subscribe(
            (response) => {
              if (response["StatusCode"] == 200) {
                this.toastr.successMessage(response["message"]);
                this.EmitToMainComp();
              }
              else {
                response["ErrorMessages"].forEach((message: string) => {
                  this.toastr.warningMessage(message["Message"]);
                });
              }
            }
          );
        }
      }
      else {
        this.toastr.warningMessage(ExceptionConstant.INPUT_SPOUSE_CONTACT_INFO);
      }
    }

    else if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      var totalSharePrcnt = 0;

      if (this.listShareholder != undefined) {
        for (let i = 0; i < this.listShareholder.length; i++) {
          totalSharePrcnt += this.listShareholder[i].SharePrcnt;
        }
      }

      if (totalSharePrcnt != 100) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_PERCENTAGE_MUST_100);
        return;
      }

      var custDataCompanyObj = new CustDataCompanyObj();
      custDataCompanyObj = this.setCustCompanyObjForSave();
      for (let i = 0; i < custDataCompanyObj.AppCustGrpObjs.length; i++) {
        for (let j = i + 1; j < custDataCompanyObj.AppCustGrpObjs.length; j++) {
          if (custDataCompanyObj.AppCustGrpObjs[i]["CustNo"] == custDataCompanyObj.AppCustGrpObjs[j]["CustNo"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_CUST_MEMBER + (j + 1));
            return;
          }

          if (custDataCompanyObj.AppCustGrpObjs[i]["MrCustRelationshipCode"] == custDataCompanyObj.AppCustGrpObjs[j]["MrCustRelationshipCode"]) {
            this.toastr.warningMessage("No " + (i + 1) + ExceptionConstant.CANT_HAVE_THE_SAME_RELATIONSHIP_AS_OTHER_CUST_MEMBER + (j + 1));
            return;
          }
        }
      }

      if (this.appData.BizTemplateCode === CommonConstant.CFNA || this.appData.BizTemplateCode === CommonConstant.CFRFN4W) {
        if (custDataCompanyObj.AppCustBankAccObjs.length <= 0) {
          this.toastr.warningMessage("Must Have At Least 1 Bank Account");
          return false;
        }
      }
      if (this.isExpiredBirthDt || this.isExpiredEstablishmentDt) return;
      else if (this.confirmFraudCheck()) {
        this.http.post(URLConstant.AddEditCustDataCompany, custDataCompanyObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            this.EmitToMainComp();
          });
      }
    }
  }

  Cancel() {
    this.outputCancel.emit();
  }

  setCustPersonalObjForSave() {
    var custDataPersonalObj = new CustDataPersonalObj();
    custDataPersonalObj.AppCustObj = this.setAppCust();
    custDataPersonalObj.AppCustPersonalObj = this.setAppCustPersonal();
    custDataPersonalObj.AppCustAddrLegalObj = this.setAppCustAddrLegal();
    custDataPersonalObj.AppCustAddrResidenceObj = this.setAppCustAddrResidence();
    custDataPersonalObj.AppCustAddrMailingObj = this.setAppCustAddrMailing();
    custDataPersonalObj.AppCustPersonalFinDataObj = this.setAppCustPersonalFinData();
    var CheckSpouseContactInfo = this.listAppCustPersonalContactInformation.find(
      x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
    if (CheckSpouseContactInfo == null && this.isMarried == true) {
      this.isSpouseOk = false;
    }
    else {
      this.isSpouseOk = true;
    }
    custDataPersonalObj.AppCustPersonalContactPersonObjs = this.listAppCustPersonalContactInformation;
    custDataPersonalObj.AppCustBankAccObjs = this.listAppCustBankAcc;
    custDataPersonalObj.AppCustObj.MrCustModelCode = this.CustDataForm.controls["jobData"]["controls"].CustModelCode.value;
    custDataPersonalObj.AppCustPersonalJobDataObj = this.setAppCustPersonalJobData(custDataPersonalObj.AppCustObj.MrCustModelCode);
    custDataPersonalObj.AppCustSocmedObjs = this.setAppCustSocmedObj();
    custDataPersonalObj.AppCustGrpObjs = this.setAppCustGrpObj();

    custDataPersonalObj.AppCustAssetList = this.ListAppCustAsset;

    return custDataPersonalObj;
  }

  setCustCompanyObjForSave() {
    var custDataCompanyObj = new CustDataCompanyObj();
    custDataCompanyObj.AppCustObj = this.setAppCust();
    custDataCompanyObj.AppCustCompanyObj = this.setAppCustCompany();
    custDataCompanyObj.AppCustAddrLegalObj = this.setAppCustAddrLegal();
    custDataCompanyObj.AppCustAddrMailingObj = this.setAppCustAddrMailing();
    custDataCompanyObj.AppCustCompanyMgmntShrholderObjs = this.listShareholder;
    custDataCompanyObj.AppCustCompanyContactPersonObjs = this.listContactPersonCompany;
    custDataCompanyObj.AppCustCompanyFinDataObj = this.setAppCustCompanyFinData();
    custDataCompanyObj.AppCustBankAccObjs = this.listAppCustBankAccCompany;
    custDataCompanyObj.AppCustCompanyLegalDocObjs = this.listLegalDoc;
    custDataCompanyObj.AppCustGrpObjs = this.setAppCustGrpObj();
    custDataCompanyObj.AppCustAssetList = this.ListAppCustAsset;

    return custDataCompanyObj;
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
      // this.toastr.warningMessage(type + "  can not be more than " + Max17YO);
      this.isExpiredBirthDt = true;
    }
    else {
      if (type == ExceptionConstant.DateErrorMessageBirthDate)
        this.isExpiredBirthDt = false;
      if (type == ExceptionConstant.DateErrorMessageEstablishmentDate)
        this.isExpiredEstablishmentDt = false;
    }
  }

  setAppCust() {
    var appCustObj = new AppCustObj();
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      appCustObj.MrCustTypeCode = this.MrCustTypeCode;
      appCustObj.CustName = this.mainDataComponent.InputLookupCustomerObj.nameSelect;
      appCustObj.CustNo = this.mainDataComponent.selectedCustNo;
      appCustObj.MrIdTypeCode = this.CustDataForm.controls["personalMainData"]["controls"].MrIdTypeCode.value;
      appCustObj.IdNo = this.CustDataForm.controls["personalMainData"]["controls"].IdNo.value;
      appCustObj.IdExpiredDt = this.CustDataForm.controls["personalMainData"]["controls"].IdExpiredDt.value;
      if (appCustObj.MrIdTypeCode == "KITAS" || appCustObj.MrIdTypeCode == "SIM") {
        this.CekDt(appCustObj.IdExpiredDt, ExceptionConstant.DateErrorMessageIdExpiredDate);
      }
      appCustObj.TaxIdNo = this.CustDataForm.controls["personalMainData"]["controls"].TaxIdNo.value;
      appCustObj.IsVip = this.CustDataForm.controls["personalMainData"]["controls"].IsVip.value;
      appCustObj.AppId = this.appId;

      if (appCustObj.CustNo != "" && appCustObj.CustNo != undefined) {
        appCustObj.IsExistingCust = true;
      } else {
        appCustObj.IsExistingCust = false;
      }

      if (this.isExisting) {
        appCustObj.RowVersion = this.custDataPersonalObj.AppCustObj.RowVersion;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      appCustObj.MrCustTypeCode = this.MrCustTypeCode;
      appCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
      appCustObj.CustNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustNo.value;
      appCustObj.MrIdTypeCode = "NPWP";
      appCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      appCustObj.MrCustModelCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CustModelCode.value;
      appCustObj.TaxIdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
      appCustObj.IsVip = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsVip.value;
      appCustObj.AppId = this.appId;

      if (appCustObj.CustNo != "" && appCustObj.CustNo != undefined) {
        appCustObj.IsExistingCust = true;
      } else {
        appCustObj.IsExistingCust = false;
      }

      if (this.isExisting) {
        appCustObj.RowVersion = this.custDataCompanyObj.AppCustObj.RowVersion;
      }
    }

    appCustObj.IsCustomer = true;

    return appCustObj;
  }

  setAppCustCompany() {
    var appCustCompanyObj = new AppCustCompanyObj();
    appCustCompanyObj.CompanyBrandName = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CompanyBrandName.value;
    appCustCompanyObj.IndustryTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IndustryTypeCode.value;
    appCustCompanyObj.MrCompanyTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].MrCompanyTypeCode.value;
    appCustCompanyObj.NumOfEmp = this.CustDataCompanyForm.controls["companyMainData"]["controls"].NumOfEmp.value;
    appCustCompanyObj.IsAffiliated = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsAffiliated.value;
    appCustCompanyObj.EstablishmentDt = this.CustDataCompanyForm.controls["companyMainData"]["controls"].EstablishmentDt.value;
    this.CekDt(appCustCompanyObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);

    if (this.isExisting) {
      appCustCompanyObj.RowVersion = this.custDataCompanyObj.AppCustCompanyObj.RowVersion;
    }

    return appCustCompanyObj;
  }

  setAppCustPersonal() {
    var appCustPersonalObj = new AppCustPersonalObj();

    appCustPersonalObj.CustFullName = this.CustDataForm.controls["personalMainData"]["controls"].CustFullName.value;
    appCustPersonalObj.MrGenderCode = this.CustDataForm.controls["personalMainData"]["controls"].MrGenderCode.value;
    appCustPersonalObj.MotherMaidenName = this.CustDataForm.controls["personalMainData"]["controls"].MotherMaidenName.value;
    appCustPersonalObj.MrMaritalStatCode = this.CustDataForm.controls["personalMainData"]["controls"].MrMaritalStatCode.value;
    appCustPersonalObj.BirthPlace = this.CustDataForm.controls["personalMainData"]["controls"].BirthPlace.value;
    appCustPersonalObj.BirthDt = this.CustDataForm.controls["personalMainData"]["controls"].BirthDt.value;
    this.CekDt(appCustPersonalObj.BirthDt, ExceptionConstant.DateErrorMessageBirthDate);
    appCustPersonalObj.MrNationalityCode = this.CustDataForm.controls["personalMainData"]["controls"].MrNationalityCode.value;
    appCustPersonalObj.NationalityCountryCode = this.mainDataComponent.selectedNationalityCountryCode;
    appCustPersonalObj.MobilePhnNo1 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo1.value;
    appCustPersonalObj.MobilePhnNo2 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo2.value;
    appCustPersonalObj.MobilePhnNo3 = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo3.value;
    appCustPersonalObj.MrEducationCode = this.CustDataForm.controls["personalMainData"]["controls"].MrEducationCode.value;
    appCustPersonalObj.MrReligionCode = this.CustDataForm.controls["personalMainData"]["controls"].MrReligionCode.value;
    appCustPersonalObj.Email1 = this.CustDataForm.controls["personalMainData"]["controls"].Email1.value;
    appCustPersonalObj.Email2 = this.CustDataForm.controls["personalMainData"]["controls"].Email2.value;
    appCustPersonalObj.Email3 = this.CustDataForm.controls["personalMainData"]["controls"].Email3.value;
    appCustPersonalObj.FamilyCardNo = this.CustDataForm.controls["personalMainData"]["controls"].FamilyCardNo.value;
    appCustPersonalObj.NoOfResidence = this.CustDataForm.controls["personalMainData"]["controls"].NoOfResidence.value;
    appCustPersonalObj.NoOfDependents = this.CustDataForm.controls["personalMainData"]["controls"].NoOfDependents.value;

    if (this.isExisting) {
      appCustPersonalObj.RowVersion = this.custDataPersonalObj.AppCustPersonalObj.RowVersion;
    }
    return appCustPersonalObj;
  }

  setAppCustAddrLegal() {
    var appCustAddrLegalObj = new AppCustAddrObj();
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      appCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
      appCustAddrLegalObj.Addr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      appCustAddrLegalObj.AreaCode3 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      appCustAddrLegalObj.AreaCode4 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      appCustAddrLegalObj.Zipcode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      appCustAddrLegalObj.AreaCode1 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      appCustAddrLegalObj.AreaCode2 = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      appCustAddrLegalObj.City = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      appCustAddrLegalObj.PhnArea1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea1.value;
      appCustAddrLegalObj.Phn1 = this.CustDataForm.controls["legalAddr"]["controls"].Phn1.value;
      appCustAddrLegalObj.PhnExt1 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt1.value;
      appCustAddrLegalObj.PhnArea2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnArea2.value;
      appCustAddrLegalObj.Phn2 = this.CustDataForm.controls["legalAddr"]["controls"].Phn2.value;
      appCustAddrLegalObj.PhnExt2 = this.CustDataForm.controls["legalAddr"]["controls"].PhnExt2.value;
      appCustAddrLegalObj.FaxArea = this.CustDataForm.controls["legalAddr"]["controls"].FaxArea.value;
      appCustAddrLegalObj.Fax = this.CustDataForm.controls["legalAddr"]["controls"].Fax.value;
      appCustAddrLegalObj.SubZipcode = this.CustDataForm.controls["legalAddr"]["controls"].SubZipcode.value;

      if (this.isExisting) {
        appCustAddrLegalObj.RowVersion = this.custDataPersonalObj.AppCustAddrLegalObj.RowVersion;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      appCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
      appCustAddrLegalObj.Addr = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Addr.value;
      appCustAddrLegalObj.AreaCode3 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode3.value;
      appCustAddrLegalObj.AreaCode4 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode4.value;
      appCustAddrLegalObj.Zipcode = this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value;
      appCustAddrLegalObj.AreaCode1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode1.value;
      appCustAddrLegalObj.AreaCode2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].AreaCode2.value;
      appCustAddrLegalObj.City = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].City.value;
      appCustAddrLegalObj.PhnArea1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea1.value;
      appCustAddrLegalObj.Phn1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn1.value;
      appCustAddrLegalObj.PhnExt1 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt1.value;
      appCustAddrLegalObj.PhnArea2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnArea2.value;
      appCustAddrLegalObj.Phn2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Phn2.value;
      appCustAddrLegalObj.PhnExt2 = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].PhnExt2.value;
      appCustAddrLegalObj.FaxArea = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].FaxArea.value;
      appCustAddrLegalObj.Fax = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].Fax.value;
      appCustAddrLegalObj.SubZipcode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].SubZipcode.value;

      if (this.isExisting) {
        appCustAddrLegalObj.RowVersion = this.custDataCompanyObj.AppCustAddrLegalObj.RowVersion;
      }
    }

    return appCustAddrLegalObj;
  }

  setAppCustAddrResidence() {
    var appCustAddrResidenceObj = new AppCustAddrObj();
    appCustAddrResidenceObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
    appCustAddrResidenceObj.Addr = this.CustDataForm.controls["residenceAddr"]["controls"].Addr.value;
    appCustAddrResidenceObj.AreaCode3 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode3.value;
    appCustAddrResidenceObj.AreaCode4 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode4.value;
    appCustAddrResidenceObj.Zipcode = this.CustDataForm.controls["residenceAddrZipcode"]["controls"].value.value;
    appCustAddrResidenceObj.AreaCode1 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode1.value;
    appCustAddrResidenceObj.AreaCode2 = this.CustDataForm.controls["residenceAddr"]["controls"].AreaCode2.value;
    appCustAddrResidenceObj.City = this.CustDataForm.controls["residenceAddr"]["controls"].City.value;
    appCustAddrResidenceObj.PhnArea1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea1.value;
    appCustAddrResidenceObj.Phn1 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn1.value;
    appCustAddrResidenceObj.PhnExt1 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt1.value;
    appCustAddrResidenceObj.PhnArea2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnArea2.value;
    appCustAddrResidenceObj.Phn2 = this.CustDataForm.controls["residenceAddr"]["controls"].Phn2.value;
    appCustAddrResidenceObj.PhnExt2 = this.CustDataForm.controls["residenceAddr"]["controls"].PhnExt2.value;
    appCustAddrResidenceObj.FaxArea = this.CustDataForm.controls["residenceAddr"]["controls"].FaxArea.value;
    appCustAddrResidenceObj.Fax = this.CustDataForm.controls["residenceAddr"]["controls"].Fax.value;
    appCustAddrResidenceObj.MrHouseOwnershipCode = this.CustDataForm.controls["residenceAddr"]["controls"].MrHouseOwnershipCode.value;
    appCustAddrResidenceObj.StayLength = this.CustDataForm.controls["residenceAddr"]["controls"].StayLength.value;
    appCustAddrResidenceObj.SubZipcode = this.CustDataForm.controls["residenceAddr"]["controls"].SubZipcode.value;

    if (this.isExisting) {
      appCustAddrResidenceObj.RowVersion = this.custDataPersonalObj.AppCustAddrResidenceObj.RowVersion;
    }

    return appCustAddrResidenceObj;
  }

  setAppCustAddrMailing() {
    var appCustAddrMailingObj = new AppCustAddrObj();
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      appCustAddrMailingObj.MrCustAddrTypeCode = CommonConstant.AddrTypeMailing;
      appCustAddrMailingObj.Addr = this.CustDataForm.controls["mailingAddr"]["controls"].Addr.value;
      appCustAddrMailingObj.AreaCode3 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode3.value;
      appCustAddrMailingObj.AreaCode4 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode4.value;
      appCustAddrMailingObj.Zipcode = this.CustDataForm.controls["mailingAddrZipcode"]["controls"].value.value;
      appCustAddrMailingObj.AreaCode1 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode1.value;
      appCustAddrMailingObj.AreaCode2 = this.CustDataForm.controls["mailingAddr"]["controls"].AreaCode2.value;
      appCustAddrMailingObj.City = this.CustDataForm.controls["mailingAddr"]["controls"].City.value;
      appCustAddrMailingObj.PhnArea1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea1.value;
      appCustAddrMailingObj.Phn1 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn1.value;
      appCustAddrMailingObj.PhnExt1 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt1.value;
      appCustAddrMailingObj.PhnArea2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnArea2.value;
      appCustAddrMailingObj.Phn2 = this.CustDataForm.controls["mailingAddr"]["controls"].Phn2.value;
      appCustAddrMailingObj.PhnExt2 = this.CustDataForm.controls["mailingAddr"]["controls"].PhnExt2.value;
      appCustAddrMailingObj.FaxArea = this.CustDataForm.controls["mailingAddr"]["controls"].FaxArea.value;
      appCustAddrMailingObj.Fax = this.CustDataForm.controls["mailingAddr"]["controls"].Fax.value;
      appCustAddrMailingObj.SubZipcode = this.CustDataForm.controls["mailingAddr"]["controls"].SubZipcode.value;

      if (this.isExisting) {
        appCustAddrMailingObj.RowVersion = this.custDataPersonalObj.AppCustAddrMailingObj.RowVersion;
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      appCustAddrMailingObj.MrCustAddrTypeCode = CommonConstant.AddrTypeMailing;
      appCustAddrMailingObj.Addr = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Addr.value;
      appCustAddrMailingObj.AreaCode3 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode3.value;
      appCustAddrMailingObj.AreaCode4 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode4.value;
      appCustAddrMailingObj.Zipcode = this.CustDataCompanyForm.controls["mailingAddrCompanyZipcode"]["controls"].value.value;
      appCustAddrMailingObj.AreaCode1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode1.value;
      appCustAddrMailingObj.AreaCode2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].AreaCode2.value;
      appCustAddrMailingObj.City = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].City.value;
      appCustAddrMailingObj.PhnArea1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea1.value;
      appCustAddrMailingObj.Phn1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn1.value;
      appCustAddrMailingObj.PhnExt1 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt1.value;
      appCustAddrMailingObj.PhnArea2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnArea2.value;
      appCustAddrMailingObj.Phn2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Phn2.value;
      appCustAddrMailingObj.PhnExt2 = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].PhnExt2.value;
      appCustAddrMailingObj.FaxArea = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].FaxArea.value;
      appCustAddrMailingObj.Fax = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].Fax.value;
      appCustAddrMailingObj.SubZipcode = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].SubZipcode.value;

      if (this.isExisting) {
        appCustAddrMailingObj.RowVersion = this.custDataCompanyObj.AppCustAddrMailingObj.RowVersion;
      }
    }

    return appCustAddrMailingObj;
  }

  setAppCustAddrJob() {
    var appCustAddrJobObj = new AppCustAddrObj();
    appCustAddrJobObj.MrCustAddrTypeCode = CommonConstant.AddrTypeJob;
    appCustAddrJobObj.Addr = this.CustDataForm.controls["jobDataAddr"]["controls"].Addr.value;
    appCustAddrJobObj.AreaCode3 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode3.value;
    appCustAddrJobObj.AreaCode4 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode4.value;
    appCustAddrJobObj.Zipcode = this.CustDataForm.controls["jobDataAddrZipcode"]["controls"].value.value;
    appCustAddrJobObj.AreaCode1 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode1.value;
    appCustAddrJobObj.AreaCode2 = this.CustDataForm.controls["jobDataAddr"]["controls"].AreaCode2.value;
    appCustAddrJobObj.City = this.CustDataForm.controls["jobDataAddr"]["controls"].City.value;
    appCustAddrJobObj.PhnArea1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea1.value;
    appCustAddrJobObj.Phn1 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn1.value;
    appCustAddrJobObj.PhnExt1 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt1.value;
    appCustAddrJobObj.PhnArea2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnArea2.value;
    appCustAddrJobObj.Phn2 = this.CustDataForm.controls["jobDataAddr"]["controls"].Phn2.value;
    appCustAddrJobObj.PhnExt2 = this.CustDataForm.controls["jobDataAddr"]["controls"].PhnExt2.value;
    appCustAddrJobObj.FaxArea = this.CustDataForm.controls["jobDataAddr"]["controls"].FaxArea.value;
    appCustAddrJobObj.Fax = this.CustDataForm.controls["jobDataAddr"]["controls"].Fax.value;

    if (this.isExisting) {
      appCustAddrJobObj.RowVersion = this.custDataPersonalObj.AppCustPersonalJobDataObj.AppCustAddrJobObj.RowVersion;
    }

    return appCustAddrJobObj;
  }

  setAppCustPersonalFinData() {
    var appCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
    appCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyIncomeAmt.value;
    appCustPersonalFinDataObj.MonthlyExpenseAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyExpenseAmt.value;
    appCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = this.CustDataForm.controls["financialData"]["controls"].MrSourceOfIncomeTypeCode.value;
    appCustPersonalFinDataObj.MonthlyInstallmentAmt = this.CustDataForm.controls["financialData"]["controls"].MonthlyInstallmentAmt.value;
    appCustPersonalFinDataObj.IsJoinIncome = this.CustDataForm.controls["financialData"]["controls"].IsJoinIncome.value;
    appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = this.CustDataForm.controls["financialData"]["controls"].SpouseMonthlyIncomeAmt.value;

    if (this.isExisting) {
      appCustPersonalFinDataObj.RowVersion = this.custDataPersonalObj.AppCustPersonalFinDataObj.RowVersion;
    }

    return appCustPersonalFinDataObj;
  }

  setAppCustCompanyFinData() {
    var appCustCompanyFinDataObj = new AppCustCompanyFinDataObj();

    appCustCompanyFinDataObj.GrossMonthlyIncomeAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyIncomeAmt.value;
    appCustCompanyFinDataObj.GrossMonthlyExpenseAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrossMonthlyExpenseAmt.value;
    appCustCompanyFinDataObj.GrossProfitAmt = appCustCompanyFinDataObj.GrossMonthlyIncomeAmt - appCustCompanyFinDataObj.GrossMonthlyExpenseAmt;
    appCustCompanyFinDataObj.ReturnOfInvestmentPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfInvestmentPrcnt.value;
    appCustCompanyFinDataObj.ProfitMarginPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitMarginPrcnt.value;
    appCustCompanyFinDataObj.ReturnOfAssetPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfAssetPrcnt.value;
    appCustCompanyFinDataObj.ReturnOfEquityPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ReturnOfEquityPrcnt.value;
    appCustCompanyFinDataObj.DebtEquityRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DebtEquityRatioPrcnt.value;
    appCustCompanyFinDataObj.CurrentRatioPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrentRatioPrcnt.value;
    appCustCompanyFinDataObj.InvTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].InvTurnOverPrcnt.value;
    appCustCompanyFinDataObj.GrowthPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].GrowthPrcnt.value;
    appCustCompanyFinDataObj.ArTurnOverPrcnt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ArTurnOverPrcnt.value;
    appCustCompanyFinDataObj.WorkingCapitalAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].WorkingCapitalAmt.value;
    appCustCompanyFinDataObj.OthMonthlyInstAmt = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OthMonthlyInstAmt.value;
    appCustCompanyFinDataObj.DateAsOf = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].DateAsOf.value;
    appCustCompanyFinDataObj.Revenue = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].Revenue.value;
    appCustCompanyFinDataObj.OprCost = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].OprCost.value;
    appCustCompanyFinDataObj.ProfitBeforeTax = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ProfitBeforeTax.value;
    appCustCompanyFinDataObj.CurrAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrAsset.value;
    appCustCompanyFinDataObj.NetFixedAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].NetFixedAsset.value;
    appCustCompanyFinDataObj.TotalAsset = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].TotalAsset.value;
    appCustCompanyFinDataObj.CurrLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrLiablts.value;
    appCustCompanyFinDataObj.LongTermLiablts = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].LongTemrLiablts.value;
    appCustCompanyFinDataObj.ShareholderEquity = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].ShareholderEquity.value;
    appCustCompanyFinDataObj.CurrRatio = this.CustDataCompanyForm.controls["financialDataCompany"]["controls"].CurrRatio.value;

    if (this.isExisting) {
      appCustCompanyFinDataObj.RowVersion = this.custDataCompanyObj.AppCustCompanyFinDataObj.RowVersion;
    }

    return appCustCompanyFinDataObj;
  }

  setAppCustPersonalJobData(custModelCode) {
    var appCustPersonalJobDataObj = new AppCustPersonalJobDataObj();
    if (custModelCode == CommonConstant.CustModelProfessional) {
      appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      appCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      appCustPersonalJobDataObj.ProfessionalNo = this.CustDataForm.controls["jobData"]["controls"].ProfessionalNo.value;
      appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      appCustPersonalJobDataObj.JobTitleName = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      appCustPersonalJobDataObj.AppCustAddrJobObj = this.setAppCustAddrJob();
    }

    if (custModelCode == CommonConstant.CustModelEmployee) {
      appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      appCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      appCustPersonalJobDataObj.JobTitleName = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      appCustPersonalJobDataObj.IsMfEmp = this.CustDataForm.controls["jobData"]["controls"].IsMfEmp.value;
      appCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      appCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      appCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      appCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      appCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      appCustPersonalJobDataObj.AppCustAddrJobObj = this.setAppCustAddrJob();
    }

    if (custModelCode == CommonConstant.CustModelSmallMediumEnterprise) {
      appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
      appCustPersonalJobDataObj.IndustryTypeCode = this.custJobDataComponent.selectedIndustryTypeCode;
      appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
      appCustPersonalJobDataObj.JobTitleName = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
      appCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
      appCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
      appCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
      appCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
      appCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
      appCustPersonalJobDataObj.MrInvestmentTypeCode = this.CustDataForm.controls["jobData"]["controls"].MrInvestmentTypeCode.value;
      appCustPersonalJobDataObj.AppCustAddrJobObj = this.setAppCustAddrJob();
    }

    if (custModelCode == CommonConstant.CustModelNonProfessional) {
      appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
    }
    if (custModelCode != CommonConstant.CustModelNonProfessional) {
      this.CekDt(appCustPersonalJobDataObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);
    }

    if (this.isExisting) {
      appCustPersonalJobDataObj.RowVersion = this.custDataPersonalObj.AppCustPersonalJobDataObj.RowVersion;
      appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
    }

    return appCustPersonalJobDataObj;
  }

  setAppCustSocmedObj() {
    var appCustSocmedObjs = new Array<AppCustSocmedObj>();
    for (let i = 0; i < this.CustDataForm.controls["socmed"].value.length; i++) {
      var appCustSocmedObj = new AppCustSocmedObj();
      appCustSocmedObj.MrSocmedCode = this.CustDataForm.controls["socmed"].value[i].MrSocmedCode;
      appCustSocmedObj.MrSocmedName = this.CustDataForm.controls["socmed"].value[i].MrSocmedName;
      appCustSocmedObj.SocmedId = this.CustDataForm.controls["socmed"].value[i].SocmedId;
      appCustSocmedObjs.push(appCustSocmedObj);
    }

    return appCustSocmedObjs;
  }

  setAppCustGrpObj() {
    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
      var appCustGrpObjs = new Array<AppCustGrpObj>();
      for (let i = 0; i < this.CustDataForm.controls["custGrpMember"].value.length; i++) {
        var appCustGrpObj = new AppCustGrpObj();
        appCustGrpObj.CustNo = this.CustDataForm.controls["custGrpMember"].value[i].CustNo;
        appCustGrpObj.MrCustRelationshipCode = this.CustDataForm.controls["custGrpMember"].value[i].MrCustRelationshipCode;
        appCustGrpObj.CustGrpNotes = this.CustDataForm.controls["custGrpMember"].value[i].CustGrpNotes;
        appCustGrpObj.IsReversible = this.CustDataForm.controls["custGrpMember"].value[i].IsReversible;
        appCustGrpObjs.push(appCustGrpObj);
      }
    }

    if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
      var appCustGrpObjs = new Array<AppCustGrpObj>();
      for (let i = 0; i < this.CustDataCompanyForm.controls["custGrpMemberCompany"].value.length; i++) {
        var appCustGrpObj = new AppCustGrpObj();
        appCustGrpObj.CustNo = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustNo;
        appCustGrpObj.MrCustRelationshipCode = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].MrCustRelationshipCode;
        appCustGrpObj.CustGrpNotes = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].CustGrpNotes;
        appCustGrpObj.IsReversible = this.CustDataCompanyForm.controls["custGrpMemberCompany"].value[i].IsReversible;
        appCustGrpObjs.push(appCustGrpObj);
      }
    }

    return appCustGrpObjs;
  }

  getCustContactInformation(event) {
    this.listAppCustPersonalContactInformation = event;
    this.CheckSpouseExist();
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

  GetAppCustAsset(e) {
    this.ListAppCustAsset = e;
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
      this.inputAddressObjForResidence.default = this.residenceAddrObj;
      this.inputAddressObjForResidence.inputField = this.inputFieldResidenceObj;
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
      this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
      this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
    }
  }

  async getCustData() {
    // this.custDataObj = new CustDataObj();
    // this.custDataObj.AppId = this.appId;
    var custDataObj = { Id: this.appId };
    await this.http.post(URLConstant.GetCustDataByAppId, custDataObj).toPromise().then(
      (response) => {
        if (response["AppCustObj"]["AppCustId"] > 0) {
          if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
            this.isExisting = true;
            this.custDataPersonalObj = new CustDataPersonalObj();
            this.custDataPersonalObj.AppCustObj = response["AppCustObj"];
            this.custDataPersonalObj.AppCustPersonalObj = response["AppCustPersonalObj"];
            if (response["AppCustAddrLegalObj"] == null) {
              this.custDataPersonalObj.AppCustAddrLegalObj = new AppCustAddrObj();
            }
            else {
              this.custDataPersonalObj.AppCustAddrLegalObj = response["AppCustAddrLegalObj"];

            }
            if (response["AppCustAddrResidenceObj"] == null) {
              this.custDataPersonalObj.AppCustAddrResidenceObj = new AppCustAddrObj();
            }
            else {
              this.custDataPersonalObj.AppCustAddrResidenceObj = response["AppCustAddrResidenceObj"];
            }

            if (response["AppCustAddrMailingObj"] == null) {
              this.custDataPersonalObj.AppCustAddrMailingObj = new AppCustAddrObj();
            }
            else {
              this.custDataPersonalObj.AppCustAddrMailingObj = response["AppCustAddrMailingObj"];
            }

            this.custDataPersonalObj.AppCustPersonalContactPersonObjs = response["AppCustPersonalContactPersonObjs"];
            this.listAppCustPersonalContactInformation = this.custDataPersonalObj.AppCustPersonalContactPersonObjs;
            this.custDataPersonalObj.AppCustPersonalFinDataObj = response["AppCustPersonalFinDataObj"];
            this.custDataPersonalObj.AppCustBankAccObjs = response["AppCustBankAccObjs"];
            this.listAppCustBankAcc = this.custDataPersonalObj.AppCustBankAccObjs;
            this.custDataPersonalObj.AppCustPersonalJobDataObj = response["AppCustPersonalJobDataObj"];
            this.custDataPersonalObj.AppCustSocmedObjs = response["AppCustSocmedObjs"];
            this.custDataPersonalObj.AppCustGrpObjs = response["AppCustGrpObjs"];

            if (this.custDataPersonalObj.AppCustObj.AppCustId != 0) {
              this.defCustModelCode = this.custDataPersonalObj.AppCustObj.MrCustModelCode;
            }


            this.setAddrLegalObj(CommonConstant.CustTypePersonal);
            this.setAddrResidenceObj();
            this.setAddrMailingObj(CommonConstant.CustTypePersonal);

            this.appCustPersonalId = this.custDataPersonalObj.AppCustPersonalObj.AppCustPersonalId;
            this.MrCustTypeCode = this.custDataPersonalObj.AppCustObj.MrCustTypeCode;
            this.spouseGender = this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode;
            this.isMarried = this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;

            this.CheckSpouseExist();
          }

          if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
            this.isExisting = true;
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

            this.setAddrLegalObj(CommonConstant.CustTypeCompany);
            this.setAddrMailingObj(CommonConstant.CustTypeCompany);

            this.MrCustTypeCode = this.custDataCompanyObj.AppCustObj.MrCustTypeCode;
          }
        }
        else {
          this.MrCustTypeCode = this.CustTypeObj[0].Key;
        }
        this.isBindDataDone = true;
      },
      () => {
        this.isBindDataDone = true;
      }
    );
  }

  initCustData(response) {
    this.AppCustId = response["AppCustObj"]["AppCustId"];
    if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
      this.isExisting = true;
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

      if (this.custDataPersonalObj.AppCustObj.AppCustId != 0) {
        this.defCustModelCode = this.custDataPersonalObj.AppCustObj.MrCustModelCode;
      }


      this.setAddrLegalObj(CommonConstant.CustTypePersonal);
      this.setAddrResidenceObj();
      this.setAddrMailingObj(CommonConstant.CustTypePersonal);

      this.appCustPersonalId = this.custDataPersonalObj.AppCustPersonalObj.AppCustPersonalId;
      this.MrCustTypeCode = this.custDataPersonalObj.AppCustObj.MrCustTypeCode;
      this.spouseGender = this.custDataPersonalObj.AppCustPersonalObj.MrGenderCode;
      this.isMarried = this.custDataPersonalObj.AppCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;

      this.CheckSpouseExist();
    }

    if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
      this.isExisting = true;
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

      this.setAddrLegalObj(CommonConstant.CustTypeCompany);
      this.setAddrMailingObj(CommonConstant.CustTypeCompany);

      this.MrCustTypeCode = this.custDataCompanyObj.AppCustObj.MrCustTypeCode;
    }
  }

  async getCustDataByLead() {
    //get lead
    let resp3 = await this.http.post<any>(URLConstant.GetLeadCustByLeadId, { LeadId: this.LeadId }).toPromise();
    if (resp3 == undefined) return;

    //get cust id
    let resp2 = await this.http.post<any>(URLConstant.GetCustByCustNo, { CustNo: resp3.CustNo }).toPromise()
    if (resp2 == undefined) return;

    //get cust data
    let resp = await this.http.post<any>(URLConstant.GetCustPersonalForCopyByCustId, { CustId: resp2.CustId }).toPromise();
    if (resp == undefined) return;

    let response = this.MapFouCustResponseToLosCust(resp)
    this.initCustData(response)
    this.isBindDataDone = true;


  }

  MapFouCustResponseToLosCust(resp) {
    let response: any = {
      AppCustObj: {},
      AppCustPersonalObj: {},
      AppCustAddrLegalObj: {},
      AppCustAddrResidenceObj: {},
      AppCustAddrMailingObj: {},
      AppCustPersonalContactPersonObjs: [],
      AppCustPersonalFinDataObj: {},
      AppCustBankAccObjs: [],
      AppCustPersonalJobDataObj: {},
      AppCustGrpObjs: [],
    };

    if (resp.CustObj) {
      response.AppCustObj = {
        AppCustId: -1,
        CustNo: resp.CustObj.CustNo,
        CustName: resp.CustObj.CustName,
        MrCustTypeCode: resp.CustObj.MrCustTypeCode,
        CustModelCode: resp.CustObj.MrCustModelCode,
        MrCustModelCode: resp.CustObj.MrCustModelCode,
        MrIdTypeCode: resp.CustObj.MrIdTypeCode,
        IdNo: resp.CustObj.IdNo,
        IdExpiredDt: resp.CustObj.IdExpiredDt,
        TaxIdNo: resp.CustObj.TaxIdNo,
        IsVip: resp.CustObj.IsVip,
        IsAffiliateWithMf: resp.CustObj.IsAffiliateWithMf,
        IsCustomer: 1,
        VipNotes: resp.CustObj.VipNotes,
      }
    }

    if (resp.CustPersonalObj) {
      response.AppCustPersonalObj = {
        AppCustId: -1,
        CustFullName: resp.CustPersonalObj.CustFullName,
        NickName: resp.CustPersonalObj.NickName,
        BirthPlace: resp.CustPersonalObj.BirthPlace,
        BirthDt: resp.CustPersonalObj.BirthDt,
        MotherMaidenName: resp.CustPersonalObj.MotherMaidenName,
        MrGenderCode: resp.CustPersonalObj.MrGenderCode,
        MrReligionCode: resp.CustPersonalObj.MrReligionCode,
        MrEducationCode: resp.CustPersonalObj.MrEducationCode,
        MrNationalityCode: resp.CustPersonalObj.MrNationalityCode,
        NationalityCountryCode: resp.CustPersonalObj.WnaCountryCode,
        MrMaritalStatCode: resp.CustPersonalObj.MrMaritalStatCode,
        FamilyCardNo: resp.CustPersonalObj.FamilyCardNo,
        NoOfResidence: resp.CustPersonalObj.NoOfResidence,
        NoOfDependents: resp.CustPersonalObj.NoOfDependents,
        MobilePhnNo1: resp.CustPersonalObj.MobilePhnNo1,
        MobilePhnNo2: resp.CustPersonalObj.MobilePhnNo2,
        MobilePhnNo3: resp.CustPersonalObj.MobilePhnNo3,
        Email1: resp.CustPersonalObj.Email1,
        Email2: resp.CustPersonalObj.Email2,
        Email3: resp.CustPersonalObj.Email3,
        CustPrefixName: resp.CustPersonalObj.CustPrefixName,
        CustSuffixName: resp.CustPersonalObj.CustSuffixName,
        IsRestInPeace: resp.CustPersonalObj.IsRestInPeace,
        MrSalutationCode: resp.CustPersonalObj.MrSalutationCode,
      }
    }

    if (resp.CustAddrLegalObj) {
      response.AppCustAddrLegalObj = {
        AppCustId: -1,
        MrCustAddrTypeCode: resp.CustAddrLegalObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrLegalObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrLegalObj.Addr,
        AreaCode1: resp.CustAddrLegalObj.AreaCode1,
        AreaCode2: resp.CustAddrLegalObj.AreaCode2,
        AreaCode3: resp.CustAddrLegalObj.AreaCode3,
        AreaCode4: resp.CustAddrLegalObj.AreaCode4,
        City: resp.CustAddrLegalObj.City,
        Zipcode: resp.CustAddrLegalObj.Zipcode,
        SubZipcode: resp.CustAddrLegalObj.SubZipcode,
        PhnArea1: resp.CustAddrLegalObj.PhnArea1,
        Phn1: resp.CustAddrLegalObj.Phn1,
        PhnExt1: resp.CustAddrLegalObj.PhnExt1,
        PhnArea2: resp.CustAddrLegalObj.PhnArea2,
        Phn2: resp.CustAddrLegalObj.Phn2,
        PhnExt2: resp.CustAddrLegalObj.PhnExt2,
        FaxArea: resp.CustAddrLegalObj.FaxArea,
        Fax: resp.CustAddrLegalObj.Fax,
        FullAddr: resp.CustAddrLegalObj.Addr + " " +
          resp.CustAddrLegalObj.AreaCode3 + " " +
          resp.CustAddrLegalObj.AreaCode4 + " " +
          resp.CustAddrLegalObj.AreaCode1 + " " +
          resp.CustAddrLegalObj.AreaCode2 + " " +
          resp.CustAddrLegalObj.City + " " +
          resp.CustAddrLegalObj.Zipcode,
        StayLength: resp.CustAddrLegalObj.StayLength,
      }
    }

    if (resp.CustAddrResidenceObj) {
      response.AppCustAddrResidenceObj = {
        AppCustId: -1,
        MrCustAddrTypeCode: resp.CustAddrResidenceObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrResidenceObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrResidenceObj.Addr,
        AreaCode1: resp.CustAddrResidenceObj.AreaCode1,
        AreaCode2: resp.CustAddrResidenceObj.AreaCode2,
        AreaCode3: resp.CustAddrResidenceObj.AreaCode3,
        AreaCode4: resp.CustAddrResidenceObj.AreaCode4,
        City: resp.CustAddrResidenceObj.City,
        Zipcode: resp.CustAddrResidenceObj.Zipcode,
        SubZipcode: resp.CustAddrResidenceObj.SubZipcode,
        PhnArea1: resp.CustAddrResidenceObj.PhnArea1,
        Phn1: resp.CustAddrResidenceObj.Phn1,
        PhnExt1: resp.CustAddrResidenceObj.PhnExt1,
        PhnArea2: resp.CustAddrResidenceObj.PhnArea2,
        Phn2: resp.CustAddrResidenceObj.Phn2,
        PhnExt2: resp.CustAddrResidenceObj.PhnExt2,
        FaxArea: resp.CustAddrResidenceObj.FaxArea,
        Fax: resp.CustAddrResidenceObj.Fax,
        FullAddr: resp.CustAddrResidenceObj.Addr + " " +
          resp.CustAddrResidenceObj.AreaCode3 + " " +
          resp.CustAddrResidenceObj.AreaCode4 + " " +
          resp.CustAddrResidenceObj.AreaCode1 + " " +
          resp.CustAddrResidenceObj.AreaCode2 + " " +
          resp.CustAddrResidenceObj.City + " " +
          resp.CustAddrResidenceObj.Zipcode,
        StayLength: resp.CustAddrResidenceObj.StayLength,
      }
    }

    if (resp.CustAddrMailingObj) {
      response.AppCustAddrMailingObj = {
        AppCustId: -1,
        MrCustAddrTypeCode: resp.CustAddrMailingObj.MrCustAddrTypeCode,
        MrHouseOwnershipCode: resp.CustAddrMailingObj.MrBuildingOwnershipCode,
        Addr: resp.CustAddrMailingObj.Addr,
        AreaCode1: resp.CustAddrMailingObj.AreaCode1,
        AreaCode2: resp.CustAddrMailingObj.AreaCode2,
        AreaCode3: resp.CustAddrMailingObj.AreaCode3,
        AreaCode4: resp.CustAddrMailingObj.AreaCode4,
        City: resp.CustAddrMailingObj.City,
        Zipcode: resp.CustAddrMailingObj.Zipcode,
        SubZipcode: resp.CustAddrMailingObj.SubZipcode,
        PhnArea1: resp.CustAddrMailingObj.PhnArea1,
        Phn1: resp.CustAddrMailingObj.Phn1,
        PhnExt1: resp.CustAddrMailingObj.PhnExt1,
        PhnArea2: resp.CustAddrMailingObj.PhnArea2,
        Phn2: resp.CustAddrMailingObj.Phn2,
        PhnExt2: resp.CustAddrMailingObj.PhnExt2,
        FaxArea: resp.CustAddrMailingObj.FaxArea,
        Fax: resp.CustAddrMailingObj.Fax,
        FullAddr: resp.CustAddrMailingObj.Addr + " " +
          resp.CustAddrMailingObj.AreaCode3 + " " +
          resp.CustAddrMailingObj.AreaCode4 + " " +
          resp.CustAddrMailingObj.AreaCode1 + " " +
          resp.CustAddrMailingObj.AreaCode2 + " " +
          resp.CustAddrMailingObj.City + " " +
          resp.CustAddrMailingObj.Zipcode,
        StayLength: resp.CustAddrMailingObj.StayLength,
      }
    }

    if (resp.CustPersonalContactPersonObjs) {
      response.AppCustPersonalContactPersonObjs = resp.CustPersonalContactPersonObjs.map(x => {
        return {
          ContactPersonName: x.ContactPersonName,
          MrIdTypeCode: x.MrIdTypeCode,
          IdNo: x.IdNo,
          BirthPlace: x.BirthPlace,
          BirthDt: x.BirthDt,
          MotherMaidenName: x.MotherMaidenName,
          MrGenderCode: x.MrGenderCode,
          GenderName: x.GenderName,
          MrReligionCode: x.MrReligionCode,
          MrEducationCode: x.MrEducationCode,
          MrJobProfessionCode: x.MrJobProfessionCode,
          MrMaritalStatCode: x.MrMaritalStatCode,
          MrNationalityCode: x.MrNationalityCode,
          NationalityCountryCode: x.NationalityCountryCode,
          MrCustRelationshipCode: x.MrCustRelationshipCode,
          RelationshipName: x.RelationshipName,
          ContactPersonCustNo: x.ContactPersonCustNo,
          IsEmergencyContact: x.IsEmergencyContact,
          IsFamily: x.IsFamily,
          MobilePhnNo1: x.MobilePhnNo1,
          MobilePhnNo2: x.MobilePhnNo2,
          Email: x.Email,
          Addr: x.Addr,
          AreaCode1: x.AreaCode1,
          AreaCode2: x.AreaCode2,
          AreaCode3: x.AreaCode3,
          AreaCode4: x.AreaCode4,
          City: x.City,
          Zipcode: x.Zipcode,
          SubZipcode: x.SubZipcode,
          FullAddr: x.Addr + " " +
            x.AreaCode3 + " " +
            x.AreaCode4 + " " +
            x.AreaCode1 + " " +
            x.AreaCode2 + " " +
            x.City + " " +
            x.Zipcode,
        }
      })
    }

    if (resp.CustPersonalFinDataObj) {
      response.AppCustPersonalFinDataObj = {
        AppCustPersonalId: -1,
        MonthlyIncomeAmt: resp.CustPersonalFinDataObj.MonthlyIncomeAmt,
        MonthlyExpenseAmt: resp.CustPersonalFinDataObj.MonthlyExpenseAmt,
        MonthlyInstallmentAmt: resp.CustPersonalFinDataObj.MonthlyInstallmentAmt,
        MrSourceOfIncomeTypeCode: resp.CustPersonalFinDataObj.MrSourceOfIncomeCode,
        SpouseMonthlyIncomeAmt: resp.CustPersonalFinDataObj.SpouseMonthlyIncomeAmt,
        IsJoinIncome: resp.CustPersonalFinDataObj.IsJoinIncome,
        OtherIncomeAmt: resp.CustPersonalFinDataObj.OtherIncomeAmt,
        OtherMonthlyInstAmt: resp.CustPersonalFinDataObj.OtherMonthlyInstAmt,
        TotalIncomeAmt: resp.CustPersonalFinDataObj.TotalIncomeAmt,
        NettIncomeAmt: resp.CustPersonalFinDataObj.NettIncomeAmt,
        DateAsOf: resp.CustPersonalFinDataObj.DateAsOf,
      }
    }

    if (resp.CustBankAccObjs) {
      response.AppCustBankAccObjs = resp.CustBankAccObjs.map(x => {
        return {
          AppCustBankAccId: x.AppCustBankAccId,
          AppCustId: x.AppCustId,
          BankCode: x.BankCode,
          BankName: x.BankName,
          BankBranch: x.BankBranch,
          BankAccNo: x.BankAccNo,
          BankAccName: x.BankAccName,
          IsBankStmnt: x.IsBankStmnt,
          BankBranchRegRptCode: x.BankBranchRegRptCode,
          BalanceAmt: x.BalanceAmt,
          IsDefault: x.IsDefault,
          IsActive: x.IsActive,
          AppCustBankStmntObjs: x.AppCustBankStmntObjs,
        }
      })
    }

    if (resp.CustPersonalJobDataObj) {
      response.AppCustPersonalJobDataObj = {
        AppCustPersonalJobDataId: resp.CustPersonalJobDataObj.AppCustPersonalJobDataId,
        AppCustPersonalId: -1,
        MrProfessionCode: resp.CustPersonalJobDataObj.MrProfessionCode,
        CompanyName: resp.CustPersonalJobDataObj.CompanyName,
        PrevCoyName: resp.CustPersonalJobDataObj.PrevCoyName,
        OthBizName: resp.CustPersonalJobDataObj.OthBizName,
        OthBizType: resp.CustPersonalJobDataObj.OthBizType,
        MrJobPositionCode: resp.CustPersonalJobDataObj.MrJobPositionCode,
        OthBizJobPosition: resp.CustPersonalJobDataObj.OthBizJobPosition,
        MrJobStatCode: resp.CustPersonalJobDataObj.MrJobStatCode,
        IsMfEmp: resp.CustPersonalJobDataObj.IsMfEmp,
        IndustryTypeCode: resp.CustPersonalJobDataObj.IndustryTypeCode,
        OthBizIndustryTypeCode: resp.CustPersonalJobDataObj.OthBizIndustryTypeCode,
        MrCompanyScaleCode: resp.CustPersonalJobDataObj.MrCompanyScaleCode,
        EstablishmentDt: resp.CustPersonalJobDataObj.EstablishmentDt,
        PrevEmploymentDt: resp.CustPersonalJobDataObj.PrevEmploymentDt,
        OthBizEstablishmentDt: resp.CustPersonalJobDataObj.OthBizEstablishmentDt,
        MrJobTitleCode: resp.CustPersonalJobDataObj.MrJobTitleCode,
        ProfessionalNo: resp.CustPersonalJobDataObj.ProfessionalNo,
        MrInvestmentTypeCode: resp.CustPersonalJobDataObj.MrInvestmentTypeCode,
        AppCustAddrJobObj: {
          MrCustAddrTypeCode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.MrCustAddrTypeCode,
          MrHouseOwnershipCode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.MrBuildingOwnershipCode,
          Addr: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Addr,
          AreaCode1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1,
          AreaCode2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2,
          AreaCode3: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3,
          AreaCode4: resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4,
          City: resp.CustPersonalJobDataObj.AppCustAddrJobObj.City,
          Zipcode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Zipcode,
          SubZipcode: resp.CustPersonalJobDataObj.AppCustAddrJobObj.SubZipcode,
          PhnArea1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnArea1,
          Phn1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Phn1,
          PhnExt1: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnExt1,
          PhnArea2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnArea2,
          Phn2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Phn2,
          PhnExt2: resp.CustPersonalJobDataObj.AppCustAddrJobObj.PhnExt2,
          FaxArea: resp.CustPersonalJobDataObj.AppCustAddrJobObj.FaxArea,
          Fax: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Fax,
          FullAddr: resp.CustPersonalJobDataObj.AppCustAddrJobObj.Addr + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode3 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode4 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode1 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.AreaCode2 + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.City + " " +
            resp.CustPersonalJobDataObj.AppCustAddrJobObj.Zipcode,
          StayLength: resp.CustPersonalJobDataObj.AppCustAddrJobObj.StayLength,
        },
        NumOfEmployee: resp.CustPersonalJobDataObj.NumOfEmployee,
      }
    }

    if (resp.CustGrpObjs) {
      response.AppCustGrpObjs = resp.CustGrpObjs.map(x => {
        return {
          AppCustGrpId: x.AppCustGrpId,
          AppCustId: x.AppCustId,
          CustNo: x.CustNo,
          MrCustRelationshipCode: x.MrCustRelationshipCode,
          CustGrpNotes: x.CustGrpNotes,
        }
      })
    }

    return response;
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
    if (custTypeCode == CommonConstant.CustTypePersonal) {
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
        this.inputAddressObjForLegal.default = this.legalAddrObj;
        this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
      }
    }

    if (custTypeCode == CommonConstant.CustTypeCompany) {
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
        this.inputAddressObjForLegalCoy.default = this.legalAddrCompanyObj;
        this.inputAddressObjForLegalCoy.inputField = this.inputFieldLegalCompanyObj;
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
      this.residenceAddrObj.StayLength = this.custDataPersonalObj.AppCustAddrResidenceObj.StayLength;
      this.residenceAddrObj.SubZipcode = this.custDataPersonalObj.AppCustAddrResidenceObj.SubZipcode;

      this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode;
      this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.AppCustAddrResidenceObj.Zipcode };
      this.inputAddressObjForResidence.default = this.residenceAddrObj;
      this.inputAddressObjForResidence.inputField = this.inputFieldResidenceObj;
    }
  }

  setAddrMailingObj(custTypeCode) {
    if (custTypeCode == CommonConstant.CustTypePersonal) {
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
        this.inputAddressObjForMailing.default = this.mailingAddrObj;
        this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
      }
    }

    if (custTypeCode == CommonConstant.CustTypeCompany) {
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
        this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
        this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
      }
    }
  }

  CopyCustomer(event) {
    this.copyAddrFromLookup(event);

    if (event["CustPersonalContactPersonObjs"] != undefined) {
      this.listAppCustPersonalContactInformation = event["CustPersonalContactPersonObjs"];
      this.CheckSpouseExist();
    }

    if (event["CustPersonalFinDataObj"] != undefined) {
      this.custDataPersonalObj.AppCustPersonalFinDataObj = event["CustPersonalFinDataObj"];
      this.custDataPersonalObj.AppCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = event["CustPersonalFinDataObj"].MrSourceOfIncomeCode;

      let TotalMonthlyIncome = this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyIncomeAmt + this.custDataPersonalObj.AppCustPersonalFinDataObj.SpouseMonthlyIncomeAmt;
      let TotalMonthlyExpense = this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyExpenseAmt + this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyInstallmentAmt;
      this.CustDataForm.controls["financialData"].patchValue({
        TotalMonthlyIncome: TotalMonthlyIncome,
        TotalMonthlyExpense: TotalMonthlyExpense,
        NettMonthlyIncome: TotalMonthlyIncome - TotalMonthlyExpense
      });
    }

    if (event["CustBankAccObjs"] != undefined) {
      this.listAppCustBankAcc = event["CustBankAccObjs"];
    }

    if (event["CustPersonalJobDataObj"] != undefined) {
      this.custJobDataComponent.custModelCode = event["CustObj"].MrCustModelCode;
      this.custJobDataComponent.appCustPersonalJobDataObj = event["CustPersonalJobDataObj"];
      this.custJobDataComponent.IsCopy = true;

      this.custJobDataComponent.bindAppCustPersonalJobData();
    }

    if (event["CustGrpObjs"] != undefined) {
      this.custGrpMemberComponent.appCustGrpObjs = event["CustGrpObjs"];
      this.custGrpMemberComponent.copyAppGrp();
    }

    this.spouseGender = event["CustPersonalObj"]["MrGenderCode"];
    this.isMarried = event["CustPersonalObj"]["MrMaritalStatCode"] == CommonConstant.MasteCodeMartialStatsMarried ? true : false;
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
      console.log(this.listLegalDoc);
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
      this.inputAddressObjForLegal.default = this.legalAddrObj;
      this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
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
      this.inputAddressObjForResidence.default = this.residenceAddrObj;
      this.inputAddressObjForResidence.inputField = this.inputFieldResidenceObj;
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
      this.inputAddressObjForMailing.default = this.mailingAddrObj;
      this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
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
      this.inputAddressObjForLegalCoy.default = this.legalAddrCompanyObj;
      this.inputAddressObjForLegalCoy.inputField = this.inputFieldLegalCompanyObj;
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
      this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
      this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
    }
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

  async bindCustTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.refMasterObj).toPromise().then(
      (response) => {
        this.CustTypeObj = response[CommonConstant.ReturnObj];
        // if (this.CustTypeObj.length > 0) {
        //   this.MrCustTypeCode = this.CustTypeObj[0].Key;
        // }
      }
    );
  }

  EmitToMainComp() {
    this.outputTab.emit(this.MrCustTypeCode);
  }

  GenderChanged(event) {
    if (event.IsSpouseDelete == true) {
      for (let i = 0; i < this.listAppCustPersonalContactInformation.length; i++) {
        if (this.listAppCustPersonalContactInformation[i].MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse) {
          this.listAppCustPersonalContactInformation.splice(i, 1);
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
    var CheckSpouseContactInfo = this.listAppCustPersonalContactInformation.find(
      x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
    if (CheckSpouseContactInfo != null) {
      this.IsSpouseExist = true;
    }
    else {
      this.IsSpouseExist = false;
    }
  }

  CheckBox(ev: MatRadioChange) {
    // clearing if not edit
    if (!this.isExisting) {
      if (ev.value == CommonConstant.CustTypePersonal) {
        this.CustDataForm.controls['personalMainData'].patchValue({
          CustFullName: [''],
          MrIdTypeCode: [''],
          MrGenderCode: [''],
          IdNo: [''],
          MotherMaidenName: [''],
          IdExpiredDt: [''],
          MrMaritalStatCode: [''],
          BirthPlace: [''],
          BirthDt: [''],
          MrNationalityCode: [''],
          TaxIdNo: [''],
          MobilePhnNo1: [''],
          MrEducationCode: [''],
          MobilePhnNo2: [''],
          MrReligionCode: [''],
          MobilePhnNo3: [''],
          IsVip: [false],
          Email1: [''],
          FamilyCardNo: [''],
          Email2: [''],
          NoOfResidence: [''],
          Email3: [''],
          NoOfDependents: ['0'],
        });

        this.legalAddrObj = new AddrObj();
        this.inputFieldLegalObj.inputLookupObj.nameSelect = "";
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = {};
        this.inputAddressObjForLegal.default = null;
        this.inputAddressObjForLegal.inputField = new InputFieldObj();

        this.mailingAddrObj = new AddrObj();
        this.inputFieldMailingObj.inputLookupObj.nameSelect = "";
        this.inputFieldMailingObj.inputLookupObj.jsonSelect = {};
        this.inputAddressObjForMailing.default = null;
        this.inputAddressObjForMailing.inputField = new InputFieldObj();

        this.residenceAddrObj = new AddrObj();
        this.inputFieldResidenceObj.inputLookupObj.nameSelect = "";
        this.inputFieldResidenceObj.inputLookupObj.jsonSelect = {};
        this.inputAddressObjForResidence.default = null;
        this.inputAddressObjForResidence.inputField = new InputFieldObj();

        this.listAppCustPersonalContactInformation = new Array<AppCustPersonalContactPersonObj>();
        this.listAppCustBankAcc = new Array<AppCustBankAccObj>();
        this.custDataPersonalObj.AppCustSocmedObjs = new Array<AppCustSocmedObj>();
        this.custDataPersonalObj.AppCustPersonalFinDataObj = new AppCustPersonalFinDataObj();
        this.custDataPersonalObj.AppCustGrpObjs = new Array<AppCustGrpObj>();
        this.custDataPersonalObj.AppCustPersonalJobDataObj = new AppCustPersonalJobDataObj();

        this.CustDataForm.controls['personalMainData']['controls']["MrIdTypeCode"].enable();
        this.CustDataForm.controls['personalMainData']['controls']["IdNo"].enable();
        this.CustDataForm.controls['personalMainData']['controls']["TaxIdNo"].enable();
        this.CustDataForm.controls['personalMainData']['controls']["BirthPlace"].enable();
        this.CustDataForm.controls['personalMainData']['controls']["BirthDt"].enable();
      }
      if (ev.value == CommonConstant.CustTypeCompany) {
        this.CustDataCompanyForm.controls['companyMainData'].patchValue({
          CustNo: [''],
          IndustryTypeCode: [''],
          CustModelCode: [''],
          CompanyBrandName: [''],
          MrCompanyTypeCode: [''],
          NumOfEmp: [0],
          IsAffiliated: [false],
          EstablishmentDt: [''],
          TaxIdNo: [''],
          IsVip: [false]
        });

        this.legalAddrCompanyObj = new AddrObj();
        this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = "";
        this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = {};
        this.inputAddressObjForLegalCoy.default = null;
        this.inputAddressObjForLegalCoy.inputField = new InputFieldObj();

        this.mailingAddrCompanyObj = new AddrObj();
        this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = "";
        this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = {};
        this.inputAddressObjForMailingCoy.default = null;
        this.inputAddressObjForMailingCoy.inputField = new InputFieldObj();

        this.listShareholder = new Array<AppCustCompanyMgmntShrholderObj>();
        this.listContactPersonCompany = new Array<AppCustCompanyContactPersonObj>();
        this.custDataCompanyObj.AppCustCompanyFinDataObj = new AppCustCompanyFinDataObj();
        this.listAppCustBankAccCompany = new Array<AppCustBankAccObj>();
        this.listLegalDoc = new Array<AppCustCompanyLegalDocObj>();
        this.custDataCompanyObj.AppCustGrpObjs = new Array<AppCustGrpObj>();

        this.CustDataCompanyForm.controls['companyMainData']['controls']["TaxIdNo"].enable();
      }
    }
  }

  confirmFraudCheck() {
    let inputLeadCustObj = new AppCustCompareObj();

    if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {

      inputLeadCustObj.CustName = this.mainDataComponent.InputLookupCustomerObj.nameSelect;
      inputLeadCustObj.Gender = this.CustDataForm.controls["personalMainData"]["controls"].MrGenderCode.value;
      inputLeadCustObj.BirthPlace = this.CustDataForm.controls["personalMainData"]["controls"].BirthPlace.value;
      inputLeadCustObj.BirthDt = this.CustDataForm.controls["personalMainData"]["controls"].BirthDt.value;
      inputLeadCustObj.MaritalStatus = this.CustDataForm.controls["personalMainData"]["controls"].MrMaritalStatCode.value;
      inputLeadCustObj.CustPhnNo = this.CustDataForm.controls["personalMainData"]["controls"].MobilePhnNo1.value;
      inputLeadCustObj.CustEmail = this.CustDataForm.controls["personalMainData"]["controls"].Email1.value;
      inputLeadCustObj.IdNo = this.CustDataForm.controls["personalMainData"]["controls"].IdNo.value;
      inputLeadCustObj.IdType = this.CustDataForm.controls["personalMainData"]["controls"].MrIdTypeCode.value;
      inputLeadCustObj.TaxNo = this.CustDataForm.controls["personalMainData"]["controls"].TaxIdNo.value;
      inputLeadCustObj.Profession = this.custJobDataComponent.selectedProfessionCode;
      inputLeadCustObj.HomeAddr = this.CustDataForm.controls["legalAddr"]["controls"].Addr.value;
      inputLeadCustObj.HomeRt = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode4.value;
      inputLeadCustObj.HomeRw = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode3.value;
      inputLeadCustObj.HomeZipCode = this.CustDataForm.controls["legalAddrZipcode"]["controls"].value.value;
      inputLeadCustObj.HomeKelurahan = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode2.value;
      inputLeadCustObj.HomeKecamatan = this.CustDataForm.controls["legalAddr"]["controls"].AreaCode1.value;
      inputLeadCustObj.HomeCity = this.CustDataForm.controls["legalAddr"]["controls"].City.value;
      let inputLeadString = JSON.stringify(inputLeadCustObj);
      let latestCustDataString = JSON.stringify(this.latestCustDataObj);

      if (this.isUseDigitalization == "1" && this.isNeedCheckBySystem == "0" && inputLeadString != latestCustDataString) {
        if (confirm("Recent Customer Main Data and Legal Address different with previous data. Are you sure want to submit without fraud check ?")) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }
    else if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {


      inputLeadCustObj.CustName = this.CustDataCompanyForm.controls["lookupCustomerCompany"]["controls"].value.value;
      inputLeadCustObj.IdNo = this.CustDataCompanyForm.controls["companyMainData"]["controls"].TaxIdNo.value;
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
