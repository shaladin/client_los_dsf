import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AppCustSocmedObj } from 'app/shared/model/AppCustSocmedObj.Model';
import { formatDate } from '@angular/common';
import { AppCustBankAccObj } from 'app/shared/model/AppCustBankAccObj.Model';
import { AppCustPersonalContactPersonObj } from 'app/shared/model/AppCustPersonalContactPersonObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AppObj } from 'app/shared/model/App/App.Model';
import { MatRadioChange } from '@angular/material/radio/typings/public-api';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompanyContactPersonObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CustPersonalContactInformationComponent } from 'app/NEW-NAP/sharing-component/input-nap-component/customer-data/component/personal-contact-information/cust-personal-contact-information.component';
import { LtkmOtherInfoComponent } from './additional-component/other-info/other-info.component';
import { LtkmFinancialPersonalComponent } from './additional-component/financial-personal/financial-personal.component';
import { LtkmCustJobDataComponent } from './additional-component/cust-job-data/cust-job-data.component';
import { LtkmCustGrpMemberComponent } from './additional-component/cust-grp-member/cust-grp-member.component';
import { LtkmAttrContentComponentComponent } from './additional-component/attr-content/attr-content-component.component';
import { LtkmCustPersonalMainDataComponent } from './additional-component/cust-personal-main-data/cust-personal-main-data.component';
import { LtkmEmergencyContactComponent } from './additional-component/emergency-contact/emergency-contact.component';
import { LtkmFamilyMainDataPagingComponent } from './additional-component/family-main-data/family-main-data-paging.component';
import { LtkmCcContactInformationTabComponent } from './additional-component/company/cc-contact-information-tab/cc-contact-information.component';
import { LtkmFinancialCompanyComponent } from './additional-component/company/financial-company/financial-company.component';
import { LtkmLegalDocComponent } from './additional-component/company/legal-doc-tab/legal-doc.component';
import { LtkmMgmntShrholderComponent } from './additional-component/company/mgmnt-shrholder/mgmnt-shrholder.component';
import { LtkmBankSectionComponent } from './additional-component/bank-section/bank-section.component';
import { LtkmCustCompanyMainDataComponent } from './additional-component/company/cust-company-main-data/cust-company-main-data.component';
import { ClaimWorkflowObj } from 'app/shared/model/Workflow/ClaimWorkflowObj.Model';
import { LtkmCustDataPersonalObj } from 'app/shared/model/LTKM/LtkmCustDataPersonalObj.Model';
import { CustDataCompanyLtkmObj } from 'app/shared/model/LTKM/CustDataCompanyLtkmObj.Model';
import { LtkmCustOtherInfoObj } from 'app/shared/model/LTKM/LtkmCustOtherInfoObj.Model';
import { LtkmAttrContent } from 'app/shared/model/LTKM/LtkmAttrContent.Model';
import { LtkmCustBankAccObj } from 'app/shared/model/LTKM/LtkmCustBankAccObj.Model';
import { LtkmCustPersonalFinDataObj } from 'app/shared/model/LTKM/LtkmCustPersonalFinDataObj.Model';
import { LtkmCustEmrgncCntctObj } from 'app/shared/model/LTKM/LtkmCustEmrgncCntctObj.Model';
import { LtkmCustPersonalJobDataObj } from 'app/shared/model/LTKM/LtkmCustPersonalJobDataObj.Model';
import { LtkmCustGrpObj } from 'app/shared/model/LTKM/LtkmCustGrpObj.Model';
import { LtkmCustCompanyContactPersonObj } from 'app/shared/model/LTKM/LtkmCustCompanyContactPersonObj.Model';
import { LtkmCustCompanyMgmntShrholderObj } from 'app/shared/model/LTKM/LtkmCustCompanyMgmntShrholderObj.Model';
import { LtkmCustCompanyLegalDocObj } from 'app/shared/model/LTKM/LtkmCustCompanyLegalDocObj.Model';
import { LtkmCustCompanyFinDataObj } from 'app/shared/model/LTKM/LtkmCustCompanyFinDataObj.Model';
import { LtkmCustObj } from 'app/shared/model/LTKM/LtkmCustObj.Model';
import { LtkmCustCompanyObj } from 'app/shared/model/LTKM/LtkmCustCompanyObj.Model';
import { LtkmCustPersonalObj } from 'app/shared/model/LTKM/LtkmCustPersonalObj.Model';
import { LtkmCustAddrObj } from 'app/shared/model/LTKM/LtkmCustAddrObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { CurrentUserContext } from 'app/shared/model/CurrentUserContext.model';
import { CookieService } from 'ngx-cookie';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
@Component({
    selector: 'app-ltkm-request',
    templateUrl: './ltkm-request.component.html',
    styleUrls: []
})

export class LtkmRequestComponent implements OnInit {
    @ViewChild(LtkmCustPersonalMainDataComponent) mainDataComponent;
    @ViewChild(CustPersonalContactInformationComponent) custContactInformationComponent;
    @ViewChild(LtkmCustJobDataComponent) custJobDataComponent;
    @ViewChild(LtkmCustGrpMemberComponent) custGrpMemberComponent;
    @ViewChild(LtkmOtherInfoComponent) custOtherInfoComponent;
    @ViewChild(LtkmCcContactInformationTabComponent) custCompanyContactInfo;
    @ViewChild(LtkmFinancialCompanyComponent) custCompanyFinDataComponent;
    @ViewChild(LtkmLegalDocComponent) custCompanyLegalDocComponent;
    @ViewChild(LtkmMgmntShrholderComponent) custCompanyManagementShareholderComponent;
    @ViewChild(LtkmBankSectionComponent) custLtkmBankSectionComponent;
    @ViewChild(LtkmCustCompanyMainDataComponent) LtkmCustCompanyMainDataComponent;
    @ViewChild(LtkmEmergencyContactComponent) LtkmEmergencyContactComponent;
    @ViewChild(LtkmFamilyMainDataPagingComponent) LtkmFamilyMainDataPagingComponent;

    @ViewChild("attrlistcustcomponent") public attrlistcustcomponent: LtkmAttrContentComponentComponent;
    @ViewChild("attrlistfindatacomponent") public attrlistfindatacomponent: LtkmAttrContentComponentComponent;

    @ViewChild("attrlistfindatacomponentcoy") public attrlistfindatacomponentcoy: LtkmAttrContentComponentComponent;
    @ViewChild("attrlistcustcomponentcoy") public attrlistcustcomponentcoy: LtkmAttrContentComponentComponent;


    @ViewChild(LtkmFinancialPersonalComponent) ltkmFinancialPersonalComponent; //cuma perlu passing list aja. gak perlu rebind method

    CustDataForm = this.fb.group({
        CopyFromResidence: [''],
        CopyFromMailing: ['']
    });

    CustDataCompanyForm = this.fb.group({
        CopyFromMailing: ['']
    });

    @Input() appId: number = 0;
    @Input() bizTemplateCode: string = "";
    @Input() showCancel: boolean = true;
    @Output() outputTab: EventEmitter<any> = new EventEmitter();
    @Output() outputCancel: EventEmitter<any> = new EventEmitter();

    custDataPersonalObj: LtkmCustDataPersonalObj = new LtkmCustDataPersonalObj();
    custDataCompanyObj: CustDataCompanyLtkmObj = new CustDataCompanyLtkmObj();
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
    listContactPersonCompany: Array<AppCustCompanyContactPersonObj> = new Array<AppCustCompanyContactPersonObj>();
    isBindDataDone: boolean = false;
    isExisting: boolean = false;

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

    defCustModelCode: string;
    MrCustTypeCode: string;
    isMarried: boolean = true;
    spouseGender: string = CommonConstant.MasterCodeGenderFemale;
    isSpouseOk: boolean = true;
    IsSpouseExist: boolean = false;
    appData: AppObj;

    //urs-los-057
    ltkmCustOtherInfo: LtkmCustOtherInfoObj;

    pageTitle: string = 'LTKM REQUEST DETAIL';
    listAttrContentFinData = new Array<LtkmAttrContent>();
    listAttrContentCustData = new Array<LtkmAttrContent>();
    listLtkmCustBankAccObjs = new Array<LtkmCustBankAccObj>();
    listLtkmCustPersonalFinDataObjs = new Array<LtkmCustPersonalFinDataObj>();
    LtkmCustEmergencyContactObj = new LtkmCustEmrgncCntctObj();
    ltkmCustPersonalJobDataObj = new LtkmCustPersonalJobDataObj();
    listLtkmCustGrpObj = new Array<LtkmCustGrpObj>();

    ContactPersonCompany: LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
    listLtkmCustCompanyManagementShareholderObj: Array<LtkmCustCompanyMgmntShrholderObj> = new Array<LtkmCustCompanyMgmntShrholderObj>();
    listLtkmCustBankAccCompany: Array<LtkmCustBankAccObj> = new Array<LtkmCustBankAccObj>();
    listLtkmCustCompanyLegalDoc: Array<LtkmCustCompanyLegalDocObj> = new Array<LtkmCustCompanyLegalDocObj>();
    listLtkmCustGrpsCompany: Array<LtkmCustGrpObj> = new Array<LtkmCustGrpObj>();
    listLtkmCustCoyFinData: Array<LtkmCustCompanyFinDataObj> = new Array<LtkmCustCompanyFinDataObj>();
    listAttrContentFinDataCoy = new Array<LtkmAttrContent>();
    listAttrContentCustDataCoy = new Array<LtkmAttrContent>();

    AttrGroup: string = CommonConstant.AttrGroupCustPersonalOther;
    AttrGroupFinData: string = CommonConstant.AttrGroupCustPersonalFinData;
    isLockMode: boolean = true;
    private mode: string = "request";
    private WfTaskListId: number;
    ReturnHandlingId: number;
    FinFormIsDetail: boolean = false;
    BankFormIsDetail: boolean = false;
    LtkmCustId: number;
    isLockLookupCust: boolean = false;
    listFamily: Array<any> = new Array();

    readonly modeReqConst: string = CommonConstant.REQ;
    readonly modeRtnConst: string = CommonConstant.RTN;

    UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        private route: ActivatedRoute,
        private cookieService: CookieService) {
        this.route.queryParams.subscribe(params => {
            if (params["AppId"] != undefined && params["AppId"] != null) {
                this.appId = params["AppId"];
            }            
            if (params["LtkmCustId"] != undefined && params["LtkmCustId"] != null) {
                this.LtkmCustId = params["LtkmCustId"];
            }            
            if (params["WfTaskListId"] != undefined && params["WfTaskListId"] != null) {
                this.WfTaskListId = params["WfTaskListId"];
                if (this.WfTaskListId != undefined) {
                    this.mode = this.modeRtnConst;
                }
            }
        })
    }

    async ngOnInit(): Promise<void> {
        this.listAttrContentFinData = new Array<LtkmAttrContent>();
        this.listAttrContentCustData = new Array<LtkmAttrContent>();

        this.listAttrContentFinDataCoy = new Array<LtkmAttrContent>();
        this.listAttrContentCustDataCoy = new Array<LtkmAttrContent>();

        this.inputAddressObjForLegal = new InputAddressObj();
        this.inputAddressObjForLegal.title = "Legal Address";
        this.inputAddressObjForLegal.showAllPhn = false;
        this.inputAddressObjForLegal.showOwnership = true;
        this.inputAddressObjForLegal.showStayLength = true;

        this.inputAddressObjForResidence = new InputAddressObj();
        this.inputAddressObjForResidence.showSubsection = false;
        this.inputAddressObjForResidence.showPhn3 = false;
        this.inputAddressObjForResidence.showOwnership = true;
        this.inputAddressObjForResidence.showStayLength = true;

        this.inputAddressObjForMailing = new InputAddressObj();
        this.inputAddressObjForMailing.showSubsection = false;
        this.inputAddressObjForMailing.showPhn3 = false;

        this.inputAddressObjForLegalCoy = new InputAddressObj();
        this.inputAddressObjForLegalCoy.title = "Company Legal Address";
        this.inputAddressObjForLegalCoy.showPhn3 = false;
        this.inputAddressObjForLegalCoy.showOwnership = true;

        this.inputAddressObjForMailingCoy = new InputAddressObj();
        this.inputAddressObjForMailingCoy.showSubsection = false;
        this.inputAddressObjForMailingCoy.showPhn3 = false;
        this.inputAddressObjForMailingCoy.showOwnership = true;

        await this.bindCustTypeObj();
        this.initAddrObj();
        if (this.mode == this.modeReqConst) {
            this.isLockMode = true;
            this.isLockLookupCust = false;
            this.disableInput();
        } else {
            this.pageTitle = 'LTKM RETURN HANDLING';
            this.isLockMode = false;
            this.isLockLookupCust = true;
            if (this.WfTaskListId > 0) {
                this.claimTask();
            }
        }
        await this.getCustData();
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

    async claimTask() {
        var wfClaimObj: ClaimWorkflowObj = new ClaimWorkflowObj();
        wfClaimObj.pWFTaskListID = this.WfTaskListId.toString();
        wfClaimObj.pUserID = this.UserAccess[CommonConstant.USER_NAME];
        this.http.post(URLConstant.ClaimTask, wfClaimObj).subscribe(
            (response) => {
            });
    }

    SaveForm() {
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            //comment urs-los-057, tidak perlu cek per komponent, karna hanya perlu liat cust no saja.
            var custDataPersonalObj = new LtkmCustDataPersonalObj();
            custDataPersonalObj = this.setCustPersonalObjForSave();
            var personalAnalysisObj: object;

            if (this.mode == this.modeReqConst) {
                personalAnalysisObj = {
                    Notes: this.CustDataForm.controls["ltkmAnalysis"]["controls"].Notes.value,
                    CustNo: this.mainDataComponent.selectedCustNo,
                    OfficeCode: this.CustDataForm.controls["ltkmAnalysis"]["controls"].OfficeCode.value,
                    OfficeName: this.CustDataForm.controls["ltkmAnalysis"]["controls"].OfficeName.value,
                    EmpNo: this.CustDataForm.controls["ltkmAnalysis"]["controls"].EmpNo.value,
                    EmpName: this.CustDataForm.controls["ltkmAnalysis"]["controls"].EmpName.value,
                    requestLtkmReqDetailObjs: [{
                        SuspTrxDueTo: this.CustDataForm.controls["ltkmAnalysis"]["controls"].MrSuspiciousTrxDueToCode.value,
                        SuspFor: this.CustDataForm.controls["ltkmAnalysis"]["controls"].MrSuspiciousForCode.value,
                        SrcIndication: this.CustDataForm.controls["ltkmAnalysis"]["controls"].MrSourceIndicationCode.value,
                        LvlIndication: this.CustDataForm.controls["ltkmAnalysis"]["controls"].MrLevelIndicationCode.value
                    }]
                }
            }

            var sendPersonalObj;
            let personalPath: string = "";

            if (this.mode == this.modeRtnConst) {
                personalPath = URLConstant.SaveLtkmReturnHandlingPersonal;
                sendPersonalObj = {
                    requestCustDataPersonalObj: custDataPersonalObj,
                    WfTaskListId: this.WfTaskListId,
                    LtkmCustId: this.LtkmCustId
                };
            } else {
                personalPath = URLConstant.SaveLtkmRequestPersonal;
                sendPersonalObj = {
                    requestCustDataPersonalObj: custDataPersonalObj,
                    requestLtkmReqObj: personalAnalysisObj,
                };
            }

            this.http.post(personalPath, sendPersonalObj).subscribe(
                (response) => {
                    if (response["StatusCode"] == 200) {
                        this.toastr.successMessage(response["message"]);
                        if (this.mode == this.modeReqConst) {
                            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
                        } else if (this.mode == this.modeRtnConst) {
                            AdInsHelper.RedirectUrl(this.router, [NavigationConstant.LTKM_RTN_HANDLING_PAGING], {});
                        }
                    }
                    else {
                        response["ErrorMessages"].forEach((message: string) => {
                            this.toastr.errorMessage(message["Message"]);
                        });
                    }
                }
            );
        }

        if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
            var custDataCompanyObj = new CustDataCompanyLtkmObj();
            custDataCompanyObj = this.setCustCompanyObjForSave();//perlu review

            var coyAnalysisObj: object;
            if (this.mode == this.modeReqConst) {
                coyAnalysisObj = {
                    Notes: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].Notes.value,
                    CustNo: this.LtkmCustCompanyMainDataComponent.selectedCustNo,
                    OfficeCode: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].OfficeCode.value,
                    OfficeName: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].OfficeName.value,
                    EmpNo: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].EmpNo.value,
                    EmpName: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].EmpName.value,
                    requestLtkmReqDetailObjs: [{
                        SuspTrxDueTo: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].MrSuspiciousTrxDueToCode.value,
                        SuspFor: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].MrSuspiciousForCode.value,
                        SrcIndication: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].MrSourceIndicationCode.value,
                        LvlIndication: this.CustDataCompanyForm.controls["ltkmAnalysis"]["controls"].MrLevelIndicationCode.value
                    }]
                }
            }

            var sendCoyObj;
            var coyPath: string = "";

            if (this.mode == this.modeRtnConst) {
                coyPath = URLConstant.SaveLtkmReturnHandlingCompany;
                sendCoyObj = {
                    requestCustDataCompanyLtkmObj: custDataCompanyObj,
                    WfTaskListId: this.WfTaskListId,
                    LtkmCustId: this.LtkmCustId
                };
            } else {
                coyPath = URLConstant.SaveLtkmRequestCompany;
                sendCoyObj = {
                    requestCustDataCompanyLtkmObj: custDataCompanyObj,
                    requestLtkmReqObj: coyAnalysisObj,
                };
            }

            this.http.post(coyPath, sendCoyObj).subscribe(
                (response) => {
                    if (response["StatusCode"] == 200) {
                        this.toastr.successMessage(response["message"]);
                        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
                    }
                    else {
                        response["ErrorMessages"].forEach((message: string) => {
                            this.toastr.errorMessage(message["Message"]);
                        });
                    }
                }
            );

        }
    }

    Cancel() {
        this.router.navigate(["/dashboard/dash-board"]);
    }

    setCustPersonalObjForSave() {
        var custDataPersonalObj = new LtkmCustDataPersonalObj();
        custDataPersonalObj.LtkmCustObj = this.setAppCust();
        custDataPersonalObj.LtkmCustPersonalObj = this.setAppCustPersonal();
        custDataPersonalObj.LtkmCustAddrLegalObj = this.setAppCustAddrLegal();
        custDataPersonalObj.LtkmCustAddrResidenceObj = this.setAppCustAddrResidence();
        custDataPersonalObj.LtkmCustAddrMailingObj = this.setAppCustAddrMailing();
        custDataPersonalObj.LtkmCustPersonalFinDataObj = this.listLtkmCustPersonalFinDataObjs;

        //ini isspouse utk app sih, buat valiasi klo cust tdk punya spouse keluarwaning
        // var CheckSpouseContactInfo = this.listAppCustPersonalContactInformation.find(
        //   x => x.MrCustRelationshipCode == CommonConstant.MasteCodeRelationshipSpouse);
        // if (CheckSpouseContactInfo == null && this.isMarried == true) {
        //   this.isSpouseOk = false;
        // }
        // else {
        //   this.isSpouseOk = true;
        // }
        // custDataPersonalObj.AppCustPersonalContactPersonObjs = this.listAppCustPersonalContactInformation;
        custDataPersonalObj.LtkmCustBankAccObjs = this.listLtkmCustBankAccObjs;
        custDataPersonalObj.LtkmCustObj.MrCustModelCode = this.CustDataForm.controls["jobData"]["controls"].CustModelCode.value;
        custDataPersonalObj.LtkmCustPersonalJobDataObj = this.setAppCustPersonalJobData(custDataPersonalObj.LtkmCustObj.MrCustModelCode);
        // custDataPersonalObj.AppCustSocmedObjs = this.setAppCustSocmedObj(); //tidak dipakai
        custDataPersonalObj.LtkmCustGrpObjs = this.setAppCustGrpObj();
        custDataPersonalObj.LtkmCustEmergencyContact = this.setLtkmCustEmergencyContactData();
        custDataPersonalObj.LtkmCustOtherInfoObj = this.setltkmCustOtherInfoData();

        // custDataPersonalObj.LtkmCustAttrContent = this.setLtkmCustAttrContent(this.attrlistcustcomponent.ListAttrContent.concat(this.attrlistfindatacomponent.ListAttrContent));

        custDataPersonalObj.LtkmCustAttrContent = this.setAttrContentPersonal();
        custDataPersonalObj.listFamily = this.setLtkmCustFamilyData();

        return custDataPersonalObj;
    }

    setAttrContentPersonal() {
        if (this.CustDataForm['controls']['AttrList'] != undefined) {
            var formValue = this.CustDataForm['controls']['AttrList'].value;
            var custAttrRequest = new Array<Object>();

            if (Object.keys(formValue).length > 0 && formValue.constructor === Object) {
                for (const key in formValue) {
                    if (formValue[key]["AttrValue"] != null) {
                        var custAttr = {
                            LtkmCustAttrContentId: 0,
                            LtkmCustId: 0,
                            RefAttrCode: formValue[key]["AttrCode"],
                            AttrValue: formValue[key]["AttrValue"]
                        };
                        custAttrRequest.push(custAttr);
                    }
                }
            }
        }

        if (this.CustDataForm['controls']['AttrListFinancialForm'] != undefined) {
            var formValue2 = this.CustDataForm['controls']['AttrListFinancialForm'].value;
            if (Object.keys(formValue2).length > 0 && formValue2.constructor === Object) {
                for (const key in formValue2) {
                    if (formValue2[key]["AttrValue"] != null) {
                        var custAttr = {
                            LtkmCustAttrContentId: 0,
                            LtkmCustId: 0,
                            RefAttrCode: formValue2[key]["AttrCode"],
                            AttrValue: formValue2[key]["AttrValue"]
                        };
                        custAttrRequest.push(custAttr);
                    }
                }
            }
        }

        return custAttrRequest;
    }

    setAttrContentCoy() {
        if (this.CustDataCompanyForm['controls']['AttrList'] != undefined) {
            var formValue = this.CustDataCompanyForm['controls']['AttrList'].value;
            var custAttrRequest = new Array<Object>();

            if (Object.keys(formValue).length > 0 && formValue.constructor === Object) {
                for (const key in formValue) {
                    if (formValue[key]["AttrValue"] != null) {
                        var custAttr = {
                            LtkmCustAttrContentId: 0,
                            LtkmCustId: 0,
                            RefAttrCode: formValue[key]["AttrCode"],
                            AttrValue: formValue[key]["AttrValue"]
                        };
                        custAttrRequest.push(custAttr);
                    }
                }
            }
        }

        if (this.CustDataCompanyForm['controls']['AttrListFinancialForm'] != undefined) {
            var formValue2 = this.CustDataCompanyForm['controls']['AttrListFinancialForm'].value;
            if (Object.keys(formValue2).length > 0 && formValue2.constructor === Object) {
                for (const key in formValue2) {
                    if (formValue2[key]["AttrValue"] != null) {
                        var custAttr = {
                            LtkmCustAttrContentId: 0,
                            LtkmCustId: 0,
                            RefAttrCode: formValue2[key]["AttrCode"],
                            AttrValue: formValue2[key]["AttrValue"]
                        };
                        custAttrRequest.push(custAttr);
                    }
                }
            }
        }

        return custAttrRequest;
    }

    setLtkmCustAttrContent(ListAttrContent: Array<LtkmAttrContent>) {
        var listAttrContent = new Array();
        for (let index = 0; index < ListAttrContent.length; index++) {
            const element = ListAttrContent[index];
            let ltkmCustObj = {
                LtkmCustAttrContentId: 0,
                LtkmCustId: 0,
                RefAttrCode: element.AttrCode,
                AttrValue: element.AttrValue
            };
            listAttrContent.push(ltkmCustObj);
        }
        return listAttrContent;
    }

    setCustCompanyObjForSave() {
        var custDataCompanyObj = new CustDataCompanyLtkmObj();
        custDataCompanyObj.LtkmCustObj = this.setAppCust();
        custDataCompanyObj.LtkmCustCompanyObj = this.setAppCustCompany();
        custDataCompanyObj.LtkmCustAddrLegalObj = this.setAppCustAddrLegal();
        custDataCompanyObj.LtkmCustAddrMailingObj = this.setAppCustAddrMailing();
        custDataCompanyObj.LtkmCustCompanyMgmntShrholderObjs = this.listLtkmCustCompanyManagementShareholderObj;
        custDataCompanyObj.LtkmCustCompanyContactPersonObj = this.setLtkmCustCompanyContactPerson();
        custDataCompanyObj.LtkmCustCompanyFinDataObjs = this.listLtkmCustCoyFinData;
        custDataCompanyObj.LtkmCustBankAccObjs = this.listLtkmCustBankAccCompany;
        custDataCompanyObj.LtkmCustCompanyLegalDocObjs = this.listLtkmCustCompanyLegalDoc;
        custDataCompanyObj.LtkmCustGrpObjs = this.setAppCustGrpObj();
        custDataCompanyObj.LtkmCustOtherInfoObj = this.setltkmCustOtherInfoDataCompany();
        // custDataCompanyObj.LtkmCustAttrContent = this.setLtkmCustAttrContent(this.attrlistcustcomponentcoy.ListAttrContent.concat(this.attrlistfindatacomponentcoy.ListAttrContent));
        custDataCompanyObj.LtkmCustAttrContent = this.setAttrContentCoy();
        return custDataCompanyObj;
    }

    isExpiredBirthDt: boolean = false;
    isExpiredEstablishmentDt: boolean = false;
    isExpiredDate: boolean = false;
    CekDt(inputDate: Date, type: string) {
        var MaxDate = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
        var Max17YO = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
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
            // this.toastr.errorMessage(type + "  can not be more than " + Max17YO);
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
        var appCustObj = new LtkmCustObj();
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

            // if(this.isExisting){
            //   appCustObj.RowVersion = this.custDataPersonalObj.LtkmCustObj.RowVersion;
            // }
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
            // appCustObj.AppId = this.appId;

            if (appCustObj.CustNo != "" && appCustObj.CustNo != undefined) {
                appCustObj.IsExistingCust = true;
            } else {
                appCustObj.IsExistingCust = false;
            }

            // if(this.isExisting){
            //   appCustObj.RowVersion = this.custDataCompanyObj.AppCustObj.RowVersion;
            // }
        }

        appCustObj.IsCustomer = true;

        return appCustObj;
    }

    setAppCustCompany() {
        var appCustCompanyObj = new LtkmCustCompanyObj();
        appCustCompanyObj.CompanyBrandName = this.CustDataCompanyForm.controls["companyMainData"]["controls"].CompanyBrandName.value;
        appCustCompanyObj.IndustryTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IndustryTypeCode.value;
        appCustCompanyObj.MrCompanyTypeCode = this.CustDataCompanyForm.controls["companyMainData"]["controls"].MrCompanyTypeCode.value;
        appCustCompanyObj.NumOfEmp = this.CustDataCompanyForm.controls["companyMainData"]["controls"].NumOfEmp.value;
        appCustCompanyObj.IsAffiliated = this.CustDataCompanyForm.controls["companyMainData"]["controls"].IsAffiliated.value;
        appCustCompanyObj.EstablishmentDt = this.CustDataCompanyForm.controls["companyMainData"]["controls"].EstablishmentDt.value;
        this.CekDt(appCustCompanyObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);

        // if(this.isExisting){
        //   appCustCompanyObj.RowVersion = this.custDataCompanyObj.AppCustCompanyObj.RowVersion;
        // }

        return appCustCompanyObj;
    }

    setAppCustPersonal() {
        var appCustPersonalObj = new LtkmCustPersonalObj();

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

        // if(this.isExisting){
        //   appCustPersonalObj.RowVersion = this.custDataPersonalObj.LtkmCustPersonalObj.RowVersion;
        // }
        return appCustPersonalObj;
    }

    setAppCustAddrLegal() {
        var appCustAddrLegalObj = new LtkmCustAddrObj();
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

            appCustAddrLegalObj.MrHouseOwnershipCode = this.CustDataForm.controls["legalAddr"]["controls"].MrHouseOwnershipCode.value;
            appCustAddrLegalObj.StayLength = this.CustDataForm.controls["legalAddr"]["controls"].StayLength.value;
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

            appCustAddrLegalObj.MrHouseOwnershipCode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].MrHouseOwnershipCode.value;
        }

        return appCustAddrLegalObj;
    }

    setAppCustAddrResidence() {
        var appCustAddrResidenceObj = new LtkmCustAddrObj();
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

        // if(this.isExisting){
        //   appCustAddrResidenceObj.RowVersion = this.custDataPersonalObj.LtkmCustAddrResidenceObj.RowVersion;
        // }

        return appCustAddrResidenceObj;
    }

    setAppCustAddrMailing() {
        var appCustAddrMailingObj = new LtkmCustAddrObj();
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

            appCustAddrMailingObj.MrHouseOwnershipCode = this.CustDataForm.controls["mailingAddr"]["controls"].MrHouseOwnershipCode.value;

            // if(this.isExisting){
            //   appCustAddrMailingObj.RowVersion = this.custDataPersonalObj.LtkmCustAddrMailingObj.RowVersion;
            // }
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
            appCustAddrMailingObj.MrHouseOwnershipCode = this.CustDataCompanyForm.controls["mailingAddrCompany"]["controls"].MrHouseOwnershipCode.value;

            // if(this.isExisting){
            //   appCustAddrMailingObj.RowVersion = this.custDataCompanyObj.AppCustAddrMailingObj.RowVersion;
            // }
        }

        return appCustAddrMailingObj;
    }

    setAppCustAddrJob() {
        var appCustAddrJobObj = new LtkmCustAddrObj();
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
        appCustAddrJobObj.MrHouseOwnershipCode = this.CustDataForm.controls["jobDataAddr"]["controls"].MrHouseOwnershipCode.value;
        appCustAddrJobObj.Zipcode = this.CustDataForm.controls["jobDataAddrZipcode"]["controls"].value.value;
        appCustAddrJobObj.SubZipcode = this.CustDataForm.controls["jobDataAddr"]["controls"].SubZipcode.value;
        // if(this.isExisting){
        //   appCustAddrJobObj.RowVersion = this.custDataPersonalObj.LtkmCustPersonalJobDataObj.LtkmCustAddrJobObj.RowVersion;
        // }

        return appCustAddrJobObj;
    }

    // setAppCustPersonalFinData() {
    //   var appCustPersonalFinDataObj = new LtkmCustPersonalFinDataObj();
    //   for (let index = 0; index < this.CustDataForm.controls["FinData"].length; index++) {
    //     const element = array[index];
    //   }
    //   appCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustDataForm.controls["FinData"]["controls"].MonthlyIncomeAmt.value;
    //   appCustPersonalFinDataObj.MonthlyExpenseAmt = this.CustDataForm.controls["FinData"]["controls"].MonthlyExpenseAmt.value;
    //   appCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = this.CustDataForm.controls["FinData"]["controls"].MrSourceOfIncomeTypeCode.value;
    //   appCustPersonalFinDataObj.MonthlyInstallmentAmt = this.CustDataForm.controls["FinData"]["controls"].MonthlyInstallmentAmt.value;
    //   appCustPersonalFinDataObj.IsJoinIncome = this.CustDataForm.controls["FinData"]["controls"].IsJoinIncome.value;
    //   appCustPersonalFinDataObj.SpouseMonthlyIncomeAmt = this.CustDataForm.controls["FinData"]["controls"].SpouseMonthlyIncomeAmt.value;

    //   if(this.isExisting){
    //     appCustPersonalFinDataObj.RowVersion = this.custDataPersonalObj.LtkmCustPersonalFinDataObj.RowVersion;
    //   }

    //   return appCustPersonalFinDataObj;
    // }
    readonly InputAddressObjForCc_Identifier: string = "CcDataAddr";
    SetReqAddrObj(obj: any) {
        let TempAddr = obj[this.InputAddressObjForCc_Identifier];
        let TempZipVal = obj[this.InputAddressObjForCc_Identifier + "Zipcode"];

        let ReqAddr: LtkmCustAddrObj = new LtkmCustAddrObj();
        ReqAddr.Phn1 = TempAddr.Phn1;
        ReqAddr.Phn2 = TempAddr.Phn2;
        ReqAddr.PhnArea1 = TempAddr.PhnArea1;
        ReqAddr.PhnArea2 = TempAddr.PhnArea2;
        ReqAddr.PhnExt1 = TempAddr.PhnExt1;
        ReqAddr.PhnExt2 = TempAddr.PhnExt2;
        ReqAddr.Addr = TempAddr.Addr;
        // ReqAddr.AppCustId = this.AppCustId;
        ReqAddr.AreaCode1 = TempAddr.AreaCode1;
        ReqAddr.AreaCode2 = TempAddr.AreaCode2;
        ReqAddr.AreaCode3 = TempAddr.AreaCode3;
        ReqAddr.AreaCode4 = TempAddr.AreaCode4;
        ReqAddr.City = TempAddr.City;
        ReqAddr.Fax = TempAddr.Fax;
        ReqAddr.FaxArea = TempAddr.FaxArea;
        ReqAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeCompany;
        ReqAddr.MrHouseOwnershipCode = "";
        ReqAddr.Zipcode = TempZipVal.value;
        ReqAddr.SubZipcode = TempAddr.SubZipcode;
        return ReqAddr;
    }

    SetReqCcObj(obj: any, ReqAddr: LtkmCustAddrObj) {
        let ReqCcObj: LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
        // ReqCcObj.LtkmCustId = this.LtkmCustId;
        // ReqCcObj.LtkmCustCompanyId = this.TempLtkmCustCompanyContactPersonObj.LtkmCustCompanyId;
        // ReqCcObj.LtkmCustCompanyContactPersonId = this.TempLtkmCustCompanyContactPersonObj.LtkmCustCompanyContactPersonId;
        // ReqCcObj.RowVersion = this.TempLtkmCustCompanyContactPersonObj.RowVersion;
        ReqCcObj.BirthDt = obj.BirthDt
        if (ReqCcObj.BirthDt != "" && ReqCcObj.BirthDt != null) this.CheckDt(new Date(ReqCcObj.BirthDt), ExceptionConstant.DateErrorMessageBirthDate);
        ReqCcObj.BirthPlace = obj.BirthPlace;
        ReqCcObj.ContactPersonName = obj.ContactPersonName;
        ReqCcObj.Email1 = obj.Email1;
        ReqCcObj.Email2 = obj.Email2;
        ReqCcObj.IdExpiredDt = obj.IdExpiredDt;
        if (ReqCcObj.IdExpiredDt != undefined && ReqCcObj.IdExpiredDt != null) this.CheckDt(new Date(ReqCcObj.IdExpiredDt), ExceptionConstant.DateErrorMessageIdExpiredDate);
        ReqCcObj.IdNo = obj.IdNo;
        ReqCcObj.JobTitleName = obj.JobTitleName;
        ReqCcObj.MobilePhnNo1 = obj.MobilePhnNo1;
        ReqCcObj.MobilePhnNo2 = obj.MobilePhnNo2;
        ReqCcObj.MrCustRelationshipCode = obj.MrCustRelationshipCode;
        ReqCcObj.MrGenderCode = obj.MrGenderCode;
        ReqCcObj.MrIdTypeCode = obj.MrIdTypeCode;
        ReqCcObj.MrJobPositionCode = obj.MrJobPositionCode;
        ReqCcObj.Phn1 = obj[this.InputAddressObjForCc_Identifier].Phn1;
        ReqCcObj.Phn2 = obj[this.InputAddressObjForCc_Identifier].Phn2;
        ReqCcObj.PhnArea1 = obj[this.InputAddressObjForCc_Identifier].PhnArea1;
        ReqCcObj.PhnArea2 = obj[this.InputAddressObjForCc_Identifier].PhnArea2;
        ReqCcObj.PhnExt1 = obj[this.InputAddressObjForCc_Identifier].PhnExt1;
        ReqCcObj.PhnExt2 = obj[this.InputAddressObjForCc_Identifier].PhnExt2;
        ReqCcObj.LtkmCustAddrObj = ReqAddr;

        return ReqCcObj;
    }

    CheckDt(inputDate: Date, type: string) {
        let MaxDate = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
        let Max17YO = formatDate(this.UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
        let max17Yodt = new Date(Max17YO);
        let d1 = new Date(inputDate);
        let d2 = new Date(MaxDate);
        max17Yodt.setFullYear(d2.getFullYear() - 17);

        if (type == ExceptionConstant.DateErrorMessageIdExpiredDate) {
            d2.setDate(d2.getDate() - 1);
            if (d1 < d2) {
                throw this.toastr.warningMessage(type + "  can not be less than " + MaxDate);
            }
            return;
        }

        if (d1 > d2) {
            throw this.toastr.warningMessage(type + "  can not be more than " + MaxDate);
        } else if (type == ExceptionConstant.DateErrorMessageBirthDate && d1 > max17Yodt) {
            throw this.toastr.warningMessage(ExceptionConstant.CUSTOMER_AGE_MUST_17_YEARS_OLD);
        }
    }

    setLtkmCustCompanyContactPerson() {
        let ReqAddr: LtkmCustAddrObj = new LtkmCustAddrObj();
        ReqAddr.Phn1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Phn1.value;
        ReqAddr.Phn2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Phn2.value;
        ReqAddr.PhnArea1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnArea1.value;
        ReqAddr.PhnArea2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnArea2.value;
        ReqAddr.PhnExt1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnExt1.value;
        ReqAddr.PhnExt2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnExt2.value;
        ReqAddr.Addr = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Addr.value;
        // ReqAddr.AppCustId = this.AppCustId;
        ReqAddr.AreaCode1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].AreaCode1.value;
        ReqAddr.AreaCode2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].AreaCode2.value;
        ReqAddr.AreaCode3 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].AreaCode3.value;
        ReqAddr.AreaCode4 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].AreaCode4.value;
        ReqAddr.City = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].City.value;
        ReqAddr.Fax = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Fax.value;
        ReqAddr.FaxArea = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].FaxArea.value;
        ReqAddr.MrCustAddrTypeCode = CommonConstant.AddrTypeCompany;
        ReqAddr.MrHouseOwnershipCode = "";
        ReqAddr.Zipcode = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier + "Zipcode"]["controls"].value.value;
        ReqAddr.SubZipcode = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].SubZipcode.value;

        let ReqCcObj: LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
        // ReqCcObj.LtkmCustId = this.LtkmCustId;
        // ReqCcObj.LtkmCustCompanyId = this.TempLtkmCustCompanyContactPersonObj.LtkmCustCompanyId;
        // ReqCcObj.LtkmCustCompanyContactPersonId = this.TempLtkmCustCompanyContactPersonObj.LtkmCustCompanyContactPersonId;
        // ReqCcObj.RowVersion = this.TempLtkmCustCompanyContactPersonObj.RowVersion;

        ReqCcObj.BirthDt = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].BirthDt.value;
        if (ReqCcObj.BirthDt != "" && ReqCcObj.BirthDt != null) this.CheckDt(new Date(ReqCcObj.BirthDt), ExceptionConstant.DateErrorMessageBirthDate);
        ReqCcObj.BirthPlace = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].BirthPlace.value;
        ReqCcObj.ContactPersonName = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].ContactPersonName.value;
        ReqCcObj.Email1 = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].Email1.value;
        ReqCcObj.Email2 = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].Email2.value;
        ReqCcObj.IdExpiredDt = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].IdExpiredDt.value;
        if (ReqCcObj.IdExpiredDt != undefined && ReqCcObj.IdExpiredDt != null) this.CheckDt(new Date(ReqCcObj.IdExpiredDt), ExceptionConstant.DateErrorMessageIdExpiredDate);
        ReqCcObj.IdNo = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].IdNo.value;
        ReqCcObj.JobTitleName = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].JobTitleName.value;
        ReqCcObj.MobilePhnNo1 = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MobilePhnNo1.value;
        ReqCcObj.MobilePhnNo2 = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MobilePhnNo2.value;
        ReqCcObj.MrCustRelationshipCode = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MrCustRelationshipCode.value;
        ReqCcObj.MrGenderCode = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MrGenderCode.value;
        ReqCcObj.MrIdTypeCode = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MrIdTypeCode.value;
        ReqCcObj.MrJobPositionCode = this.CustDataCompanyForm.controls["contactPersonCompany"]["controls"].MrJobPositionCode.value;

        ReqCcObj.Phn1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Phn1.value;
        ReqCcObj.Phn2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].Phn2.value;
        ReqCcObj.PhnArea1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnArea1.value;
        ReqCcObj.PhnArea2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnArea2.value;
        ReqCcObj.PhnExt1 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnExt1.value;
        ReqCcObj.PhnExt2 = this.CustDataCompanyForm.controls[this.InputAddressObjForCc_Identifier]["controls"].PhnExt2.value;
        ReqCcObj.LtkmCustAddrObj = ReqAddr;

        return ReqCcObj;
    }

    setAppCustCompanyFinData() {
        var appCustCompanyFinDataObj = new LtkmCustCompanyFinDataObj();

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

        // if(this.isExisting){
        //   appCustCompanyFinDataObj.RowVersion = this.custDataCompanyObj.AppCustCompanyFinDataObj.RowVersion;
        // }

        return appCustCompanyFinDataObj;
    }

    setAppCustPersonalJobData(custModelCode) {
        var appCustPersonalJobDataObj = new LtkmCustPersonalJobDataObj();
        if (custModelCode == CommonConstant.CustModelProfessional) {
            appCustPersonalJobDataObj.MrProfessionCode = this.CustDataForm.controls["jobData"]["controls"].MrProfessionCode.value;
            appCustPersonalJobDataObj.IndustryTypeCode = this.CustDataForm.controls["jobData"]["controls"].IndustryTypeCode.value;
            appCustPersonalJobDataObj.RefSectorEconomySlikCode = this.CustDataForm.controls["jobData"]["controls"].RefSectorEconomySlikCode.value;
            appCustPersonalJobDataObj.ProfessionalNo = this.CustDataForm.controls["jobData"]["controls"].ProfessionalNo.value;
            appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
            appCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
            appCustPersonalJobDataObj.LtkmCustAddrJobObj = this.setAppCustAddrJob();
        }

        if (custModelCode == CommonConstant.CustModelEmployee) {
            appCustPersonalJobDataObj.MrProfessionCode = this.CustDataForm.controls["jobData"]["controls"].MrProfessionCode.value;
            appCustPersonalJobDataObj.IndustryTypeCode = this.CustDataForm.controls["jobData"]["controls"].IndustryTypeCode.value;
            appCustPersonalJobDataObj.RefSectorEconomySlikCode = this.CustDataForm.controls["jobData"]["controls"].RefSectorEconomySlikCode.value;
            appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
            appCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
            appCustPersonalJobDataObj.IsMfEmp = this.CustDataForm.controls["jobData"]["controls"].IsMfEmp.value;
            appCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
            appCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
            appCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
            appCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
            appCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
            appCustPersonalJobDataObj.LtkmCustAddrJobObj = this.setAppCustAddrJob();
        }

        if (custModelCode == CommonConstant.CustModelSmallMediumEnterprise) {
            appCustPersonalJobDataObj.MrProfessionCode = this.CustDataForm.controls["jobData"]["controls"].MrProfessionCode.value;
            appCustPersonalJobDataObj.IndustryTypeCode = this.CustDataForm.controls["jobData"]["controls"].IndustryTypeCode.value;
            appCustPersonalJobDataObj.RefSectorEconomySlikCode = this.CustDataForm.controls["jobData"]["controls"].RefSectorEconomySlikCode.value;
            appCustPersonalJobDataObj.EstablishmentDt = this.CustDataForm.controls["jobData"]["controls"].EstablishmentDt.value;
            appCustPersonalJobDataObj.MrJobTitleCode = this.CustDataForm.controls["jobData"]["controls"].JobTitleName.value;
            appCustPersonalJobDataObj.CompanyName = this.CustDataForm.controls["jobData"]["controls"].CompanyName.value;
            appCustPersonalJobDataObj.MrJobPositionCode = this.CustDataForm.controls["jobData"]["controls"].MrJobPositionCode.value;
            appCustPersonalJobDataObj.MrCompanyScaleCode = this.CustDataForm.controls["jobData"]["controls"].MrCompanyScaleCode.value;
            appCustPersonalJobDataObj.NumOfEmployee = this.CustDataForm.controls["jobData"]["controls"].NumOfEmployee.value;
            appCustPersonalJobDataObj.MrJobStatCode = this.CustDataForm.controls["jobData"]["controls"].MrJobStatCode.value;
            appCustPersonalJobDataObj.MrInvestmentTypeCode = this.CustDataForm.controls["jobData"]["controls"].MrInvestmentTypeCode.value;
            appCustPersonalJobDataObj.LtkmCustAddrJobObj = this.setAppCustAddrJob();
        }

        if (custModelCode == CommonConstant.CustModelNonProfessional) {
            appCustPersonalJobDataObj.MrProfessionCode = this.custJobDataComponent.selectedProfessionCode;
        } else {
            this.CekDt(appCustPersonalJobDataObj.EstablishmentDt, ExceptionConstant.DateErrorMessageEstablishmentDate);
        }


        if (this.isExisting) {
            appCustPersonalJobDataObj.RowVersion = this.custDataPersonalObj.LtkmCustPersonalJobDataObj.RowVersion;
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

    setltkmCustOtherInfoData() {
        this.ltkmCustOtherInfo = new LtkmCustOtherInfoObj();
        if (this.CustDataForm.controls["OtherInfoList"]["controls"] != undefined) {

            this.ltkmCustOtherInfo.LbppmsBizSclLbppCode = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsBizSclLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsBizSustainLbppCode = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsBizSustainLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsCntrprtLbppCode = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsCntrprtLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsDebtGrpLbppCode = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsDebtGrpLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsCntrprtLbppDescr = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsCntrprtLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsDebtGrpLbppDescr = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsDebtGrpLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsBizSustainLbppDescr = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsBizSustainLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsBizSclLbppDescr = this.CustDataForm.controls["OtherInfoList"]["controls"].LbppmsBizSclLbppDescr.value;
        }
        return this.ltkmCustOtherInfo;
    }

    setLtkmCustFamilyData() {
        var listFamilyToBeSave: Array<LtkmCustObj> = new Array<LtkmCustObj>();
        for (let index = 0; index < this.listFamily.length; index++) {
            const element = this.listFamily[index];
            let ltkmCustObj: LtkmCustObj = new LtkmCustObj();
            ltkmCustObj.CustNo = element.CustNo;
            ltkmCustObj.IsFamily = true;
            ltkmCustObj.MrCustRelationshipCode = element.MrCustRelationshipCode;
            ltkmCustObj.MrCustTypeCode = element.MrCustTypeCode;

            listFamilyToBeSave.push(ltkmCustObj);
        }
        return listFamilyToBeSave;
    }

    setltkmCustOtherInfoDataCompany() {
        this.ltkmCustOtherInfo = new LtkmCustOtherInfoObj();
        if (this.CustDataCompanyForm.controls["OtherInfoList"]["controls"] != undefined) {

            this.ltkmCustOtherInfo.LbppmsBizSclLbppCode = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsBizSclLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsBizSustainLbppCode = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsBizSustainLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsCntrprtLbppCode = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsCntrprtLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsDebtGrpLbppCode = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsDebtGrpLbppCode.value;
            this.ltkmCustOtherInfo.LbppmsCntrprtLbppDescr = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsCntrprtLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsDebtGrpLbppDescr = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsDebtGrpLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsBizSustainLbppDescr = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsBizSustainLbppDescr.value;
            this.ltkmCustOtherInfo.LbppmsBizSclLbppDescr = this.CustDataCompanyForm.controls["OtherInfoList"]["controls"].LbppmsBizSclLbppDescr.value;
        }
        return this.ltkmCustOtherInfo;
    }

    setLtkmCustEmergencyContactData() {
        this.LtkmCustEmergencyContactObj = new LtkmCustEmrgncCntctObj();
        if (this.CustDataForm.controls["EmergencyContact"]["controls"] != undefined) {

            // this.LtkmCustEmergencyContactObj.LtkmCustEmrgncCntctId = this.CustDataForm.controls["EmergencyContact"]["controls"].LtkmCustEmrgncCntctId.value;
            // this.LtkmCustEmergencyContactObj.LtkmCustId = this.CustDataForm.controls["EmergencyContact"]["controls"].LtkmCustId.value;
            this.LtkmCustEmergencyContactObj.ContactPersonName = this.CustDataForm.controls["EmergencyContactlookupCustomer"]["controls"].value.value;
            this.LtkmCustEmergencyContactObj.MrIdTypeCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrIdTypeCode.value;
            this.LtkmCustEmergencyContactObj.IdNo = this.CustDataForm.controls["EmergencyContact"]["controls"].IdNo.value;
            this.LtkmCustEmergencyContactObj.IdExpiredDt = this.CustDataForm.controls["EmergencyContact"]["controls"].IdExpiredDt.value;
            this.LtkmCustEmergencyContactObj.BirthPlace = this.CustDataForm.controls["EmergencyContact"]["controls"].BirthPlace.value;
            this.LtkmCustEmergencyContactObj.BirthDt = this.CustDataForm.controls["EmergencyContact"]["controls"].BirthDt.value;
            // this.LtkmCustEmergencyContactObj.MotherMaidenName = this.CustDataForm.controls["EmergencyContact"]["controls"].MotherMaidenName.value;
            this.LtkmCustEmergencyContactObj.MrGenderCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrGenderCode.value;
            // this.LtkmCustEmergencyContactObj.MrReligionCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrReligionCode.value;
            // this.LtkmCustEmergencyContactObj.MrEducationCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrEducationCode.value;
            // this.LtkmCustEmergencyContactObj.MrJobProfessionCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrJobProfessionCode.value;
            // this.LtkmCustEmergencyContactObj.MrMaritalStatCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrMaritalStatCode.value;
            // this.LtkmCustEmergencyContactObj.MrNationalityCode= this.CustDataForm.controls["EmergencyContact"]["controls"].MrNationalityCode.value;
            // this.LtkmCustEmergencyContactObj.NationalityCountryCode = this.CustDataForm.controls["EmergencyContact"]["controls"].NationalityCountryCode.value;
            this.LtkmCustEmergencyContactObj.MrCustRelationshipCode = this.CustDataForm.controls["EmergencyContact"]["controls"].MrCustRelationshipCode.value;
            this.LtkmCustEmergencyContactObj.MobilePhnNo1 = this.CustDataForm.controls["EmergencyContact"]["controls"].MobilePhnNo1.value;
            this.LtkmCustEmergencyContactObj.MobilePhnNo2 = this.CustDataForm.controls["EmergencyContact"]["controls"].MobilePhnNo2.value;
            this.LtkmCustEmergencyContactObj.Email = this.CustDataForm.controls["EmergencyContact"]["controls"].Email.value;
            this.LtkmCustEmergencyContactObj.Addr = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].Addr.value;
            this.LtkmCustEmergencyContactObj.AreaCode1 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].AreaCode1.value;
            this.LtkmCustEmergencyContactObj.AreaCode2 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].AreaCode2.value;
            this.LtkmCustEmergencyContactObj.AreaCode3 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].AreaCode3.value;
            this.LtkmCustEmergencyContactObj.AreaCode4 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].AreaCode4.value;
            this.LtkmCustEmergencyContactObj.City = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].City.value;
            this.LtkmCustEmergencyContactObj.Zipcode = this.CustDataForm.controls["EmergencyContactAddressZipcode"]["controls"].value.value;
            this.LtkmCustEmergencyContactObj.SubZipcode = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].SubZipcode.value;
            this.LtkmCustEmergencyContactObj.PhnArea1 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnArea1.value;
            this.LtkmCustEmergencyContactObj.Phn1 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].Phn1.value;
            this.LtkmCustEmergencyContactObj.PhnExt1 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnExt1.value;
            this.LtkmCustEmergencyContactObj.PhnArea2 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnArea2.value;
            this.LtkmCustEmergencyContactObj.Phn2 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].Phn2.value;
            this.LtkmCustEmergencyContactObj.PhnExt2 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnExt2.value;
            this.LtkmCustEmergencyContactObj.PhnArea3 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnArea3.value;
            this.LtkmCustEmergencyContactObj.Phn3 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].Phn3.value;
            this.LtkmCustEmergencyContactObj.PhnExt3 = this.CustDataForm.controls["EmergencyContactAddress"]["controls"].PhnExt3.value;
            // this.LtkmCustEmergencyContactObj.RowVersion = this.CustDataForm.controls["EmergencyContact"]["controls"].RowVersion.value;

        }
        return this.LtkmCustEmergencyContactObj;
    }

    setAppCustGrpObj() {
        var appCustGrpObjs = new Array<LtkmCustGrpObj>();
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            for (let i = 0; i < this.CustDataForm.controls["custGrpMember"].value.length; i++) {
                var appCustGrpObj = new LtkmCustGrpObj();
                appCustGrpObj.CustNo = this.CustDataForm.controls["custGrpMember"].value[i].CustNo;
                appCustGrpObj.MrCustRelationshipCode = this.CustDataForm.controls["custGrpMember"].value[i].MrCustRelationshipCode;
                appCustGrpObj.CustGrpNotes = this.CustDataForm.controls["custGrpMember"].value[i].CustGrpNotes;
                appCustGrpObj.IsReversible = this.CustDataForm.controls["custGrpMember"].value[i].IsReversible;
                appCustGrpObjs.push(appCustGrpObj);
            }
        }

        if (this.MrCustTypeCode == CommonConstant.CustTypeCompany) {
            for (let i = 0; i < this.CustDataCompanyForm.controls["custGrpMemberCompany"].value.length; i++) {
                var appCustGrpObj = new LtkmCustGrpObj();
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
        this.listLtkmCustBankAccCompany = event;
    }

    // getAppCustShareholder(event) {
    //   this.listShareholder = event;
    // }

    getAppCustCompanyContactPerson(event) {
        this.listContactPersonCompany = event;
    }

    // getAppCustLegalDoc(event) {
    //   this.listLegalDoc = event;
    // }

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

            this.residenceAddrObj.MrHouseOwnershipCode = this.CustDataForm.controls["legalAddr"]["controls"].MrHouseOwnershipCode.value;
            this.residenceAddrObj.StayLength = this.CustDataForm.controls["legalAddr"]["controls"].StayLength.value;

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

            this.mailingAddrCompanyObj.MrHouseOwnershipCode = this.CustDataCompanyForm.controls["legalAddrCompany"]["controls"].MrHouseOwnershipCode.value;

            this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value;
            this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.CustDataCompanyForm.controls["legalAddrCompanyZipcode"]["controls"].value.value };
            this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
            this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
        }
    }

    updateListLtkmCustPersonalFinData(ev) {
        if (ev != undefined && ev.Key == "IsDetail") {
            this.FinFormIsDetail = ev.Value;
        }
        this.listLtkmCustPersonalFinDataObjs = ev.ListLtkmCustPersonalFinData;
    }

    updateListLtkmCustBankAccObjs(ev) {
        if (ev != undefined && ev.Key == "IsDetail") {
            this.BankFormIsDetail = ev.Value;
        }
        this.listLtkmCustBankAccObjs = ev.LtkmCustBankAccList;
    }

    updateListLtkmCustBankAccObjsCoy(ev) {
        this.listLtkmCustBankAccCompany = ev.LtkmCustBankAccList;
    }

    updateListLtkmCustCoyLegalDocs(ev) {
        this.listLtkmCustCompanyLegalDoc = ev.listLtkmCustCompanyLegalDoc;
    }

    updateListLtkmCustCoyFinDatas(ev) {
        this.listLtkmCustCoyFinData = ev.ListLtkmCustCoyFinData;
    }

    async getCustData() {
        let custDataObj: GenericObj = new GenericObj();
        custDataObj.Id = this.LtkmCustId;

        if (this.LtkmCustId == undefined || this.LtkmCustId == 0 || this.LtkmCustId == null) {
            this.MrCustTypeCode = this.CustTypeObj[0].Key;
            this.isBindDataDone = true;
            return;
        }

        await this.http.post(URLConstant.GetCustDataByLtkmCustId, custDataObj).toPromise().then(
            async (response) => {
                if (response["AppCustObj"]["LtkmCustId"] > 0) {
                    if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypePersonal) {
                        await this.http.post<Array<LtkmAttrContent>>(URLConstant.GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup, { LtkmCustId: this.LtkmCustId, AttrGroup: this.AttrGroup }).toPromise().then(
                            (response) => {
                                this.listAttrContentCustData = response["ResponseLtkmCustAttrContentObjs"]
                            });

                        await this.http.post<Array<LtkmAttrContent>>(URLConstant.GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup, { LtkmCustId: this.LtkmCustId, AttrGroup: CommonConstant.AttrGroupCustPersonalFinData }).toPromise().then(
                            (response) => {
                                this.listAttrContentFinData = response["ResponseLtkmCustAttrContentObjs"]
                            });
                        this.isExisting = true;
                        this.custDataPersonalObj = new LtkmCustDataPersonalObj();
                        this.custDataPersonalObj.LtkmCustObj = response["AppCustObj"];
                        this.custDataPersonalObj.LtkmCustPersonalObj = response["AppCustPersonalObj"];
                        this.custDataPersonalObj.LtkmCustAddrLegalObj = response["AppCustAddrLegalObj"];
                        this.custDataPersonalObj.LtkmCustAddrResidenceObj = response["AppCustAddrResidenceObj"];
                        this.custDataPersonalObj.LtkmCustAddrMailingObj = response["AppCustAddrMailingObj"];

                        // this.custDataPersonalObj.LtkmCustPersonalContactPersonObjs = response["AppCustPersonalContactPersonObjs"];
                        // this.listAppCustPersonalContactInformation = this.custDataPersonalObj.AppCustPersonalContactPersonObjs;
                        this.custDataPersonalObj.LtkmCustPersonalFinDataObj = response["AppCustPersonalFinDataObj"];
                        this.listLtkmCustPersonalFinDataObjs = response["AppCustPersonalFinDataObj"];
                        // this.custDataPersonalObj.AppCustBankAccObjs = response["AppCustBankAccObjs"];
                        // this.listAppCustBankAcc = this.custDataPersonalObj.AppCustBankAccObjs;
                        this.custDataPersonalObj.LtkmCustPersonalJobDataObj = response["AppCustPersonalJobDataObj"];
                        this.ltkmCustPersonalJobDataObj = response["AppCustPersonalJobDataObj"];
                        // this.custDataPersonalObj.AppCustSocmedObjs = response["AppCustSocmedObjs"];
                        this.custDataPersonalObj.LtkmCustGrpObjs = response["AppCustGrpObjs"];
                        this.listLtkmCustGrpObj = response["AppCustGrpObjs"];

                        this.custDataPersonalObj.LtkmCustBankAccObjs = response["AppCustBankAccObjs"];
                        this.listLtkmCustBankAccObjs = this.custDataPersonalObj.LtkmCustBankAccObjs;

                        this.custDataPersonalObj.LtkmCustEmergencyContact = response["rLtkmCustEmrgncCntct"];
                        this.LtkmCustEmergencyContactObj = response["rLtkmCustEmrgncCntct"];

                        this.custDataPersonalObj.LtkmCustOtherInfoObj = response["rLtkmCustOtherInfoObj"];
                        this.ltkmCustOtherInfo = response["rLtkmCustOtherInfoObj"];

                        if (this.custDataPersonalObj.LtkmCustObj.LtkmCustId != 0) {
                            this.defCustModelCode = this.custDataPersonalObj.LtkmCustObj.MrCustModelCode;
                        }

                        this.listFamily = response["familyList"];

                        this.setAddrLegalObj(CommonConstant.CustTypePersonal);
                        this.setAddrResidenceObj();
                        this.setAddrMailingObj(CommonConstant.CustTypePersonal);

                        this.appCustPersonalId = this.custDataPersonalObj.LtkmCustPersonalObj.LtkmCustPersonalId;
                        this.MrCustTypeCode = this.custDataPersonalObj.LtkmCustObj.MrCustTypeCode;
                        this.spouseGender = this.custDataPersonalObj.LtkmCustPersonalObj.MrGenderCode;
                        this.isMarried = this.custDataPersonalObj.LtkmCustPersonalObj.MrMaritalStatCode == CommonConstant.MasteCodeMartialStatsMarried ? true : false;

                        this.CheckSpouseExist();
                    }

                    if (response["AppCustObj"]["MrCustTypeCode"] == CommonConstant.CustTypeCompany) {
                        await this.http.post<Array<LtkmAttrContent>>(URLConstant.GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup, { LtkmCustId: this.LtkmCustId, AttrGroup: this.AttrGroup }).toPromise().then(
                            (response) => {
                                this.listAttrContentCustDataCoy = response["ResponseLtkmCustAttrContentObjs"]
                            });

                        await this.http.post<Array<LtkmAttrContent>>(URLConstant.GetListLtkmCustAttrContentByLtkmCustIdAndAttrGroup, { LtkmCustId: this.LtkmCustId, AttrGroup: CommonConstant.AttrGroupCustPersonalFinData }).toPromise().then(
                            (response) => {
                                this.listAttrContentFinDataCoy = response["ResponseLtkmCustAttrContentObjs"]
                            });
                        this.isExisting = true;
                        this.custDataCompanyObj = new CustDataCompanyLtkmObj();
                        this.custDataCompanyObj.LtkmCustObj = response["AppCustObj"];
                        this.custDataCompanyObj.LtkmCustCompanyObj = response["AppCustCompanyObj"];
                        this.custDataCompanyObj.LtkmCustAddrLegalObj = response["AppCustAddrLegalObj"];
                        this.custDataCompanyObj.LtkmCustAddrMailingObj = response["AppCustAddrMailingObj"];
                        this.custDataCompanyObj.LtkmCustCompanyMgmntShrholderObjs = response["AppCustCompanyMgmntShrholderObjs"];
                        this.listLtkmCustCompanyManagementShareholderObj = this.custDataCompanyObj.LtkmCustCompanyMgmntShrholderObjs;
                        this.custDataCompanyObj.LtkmCustCompanyContactPersonObj = response["AppCustCompanyContactPersonObj"];

                        this.ContactPersonCompany = response["AppCustCompanyContactPersonObj"];
                        this.custDataCompanyObj.LtkmCustCompanyFinDataObjs = response["AppCustCompanyFinDataObj"];
                        this.listLtkmCustCoyFinData = response["AppCustCompanyFinDataObj"];
                        // if (response["AppCustCompanyFinDataObj"] != undefined) {
                        //   if (response["AppCustCompanyFinDataObj"].DateAsOf != undefined && response["AppCustCompanyFinDataObj"].DateAsOf != null) {
                        //     this.custDataCompanyObj.LtkmCustCompanyFinDataObj.DateAsOf = formatDate(response["AppCustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
                        //   }
                        // }
                        this.custDataCompanyObj.LtkmCustBankAccObjs = response["AppCustBankAccObjs"];
                        this.listLtkmCustBankAccCompany = this.custDataCompanyObj.LtkmCustBankAccObjs;
                        this.custDataCompanyObj.LtkmCustCompanyLegalDocObjs = response["AppCustCompanyLegalDocObjs"];
                        this.listLtkmCustCompanyLegalDoc = this.custDataCompanyObj.LtkmCustCompanyLegalDocObjs;
                        this.custDataCompanyObj.LtkmCustGrpObjs = response["AppCustGrpObjs"];
                        this.listLtkmCustGrpsCompany = this.custDataCompanyObj.LtkmCustGrpObjs;
                        this.custDataCompanyObj.LtkmCustOtherInfoObj = response["rLtkmCustOtherInfoObj"];
                        this.ltkmCustOtherInfo = response["rLtkmCustOtherInfoObj"];

                        this.setAddrLegalObj(CommonConstant.CustTypeCompany);
                        this.setAddrMailingObj(CommonConstant.CustTypeCompany);

                        this.MrCustTypeCode = this.custDataCompanyObj.LtkmCustObj.MrCustTypeCode;
                    }
                }
                else {
                    this.MrCustTypeCode = this.CustTypeObj[0].Key;
                }
                this.onChangeMrCustTypeCode(this.MrCustTypeCode);
                this.isBindDataDone = true;
            },
            (error) => {
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
        if (custTypeCode == CommonConstant.CustTypePersonal) {
            this.initAddrLegalObj();

            if (this.custDataPersonalObj.LtkmCustAddrLegalObj != undefined) {
                this.legalAddrObj.Addr = this.custDataPersonalObj.LtkmCustAddrLegalObj.Addr;
                this.legalAddrObj.AreaCode1 = this.custDataPersonalObj.LtkmCustAddrLegalObj.AreaCode1;
                this.legalAddrObj.AreaCode2 = this.custDataPersonalObj.LtkmCustAddrLegalObj.AreaCode2;
                this.legalAddrObj.AreaCode3 = this.custDataPersonalObj.LtkmCustAddrLegalObj.AreaCode3;
                this.legalAddrObj.AreaCode4 = this.custDataPersonalObj.LtkmCustAddrLegalObj.AreaCode4;
                this.legalAddrObj.City = this.custDataPersonalObj.LtkmCustAddrLegalObj.City;
                this.legalAddrObj.Fax = this.custDataPersonalObj.LtkmCustAddrLegalObj.Fax;
                this.legalAddrObj.FaxArea = this.custDataPersonalObj.LtkmCustAddrLegalObj.FaxArea;
                this.legalAddrObj.Phn1 = this.custDataPersonalObj.LtkmCustAddrLegalObj.Phn1;
                this.legalAddrObj.Phn2 = this.custDataPersonalObj.LtkmCustAddrLegalObj.Phn2;
                this.legalAddrObj.PhnArea1 = this.custDataPersonalObj.LtkmCustAddrLegalObj.PhnArea1;
                this.legalAddrObj.PhnArea2 = this.custDataPersonalObj.LtkmCustAddrLegalObj.PhnArea2;
                this.legalAddrObj.PhnExt1 = this.custDataPersonalObj.LtkmCustAddrLegalObj.PhnExt1;
                this.legalAddrObj.PhnExt2 = this.custDataPersonalObj.LtkmCustAddrLegalObj.PhnExt2;
                this.legalAddrObj.SubZipcode = this.custDataPersonalObj.LtkmCustAddrLegalObj.SubZipcode;

                this.legalAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.LtkmCustAddrLegalObj.MrHouseOwnershipCode;
                this.legalAddrObj.StayLength = this.custDataPersonalObj.LtkmCustAddrLegalObj.StayLength;

                this.inputFieldLegalObj.inputLookupObj.nameSelect = this.custDataPersonalObj.LtkmCustAddrLegalObj.Zipcode;
                this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.LtkmCustAddrLegalObj.Zipcode };
                this.inputAddressObjForLegal.default = this.legalAddrObj;
                this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
            }
        }

        if (custTypeCode == CommonConstant.CustTypeCompany) {
            this.initAddrLegalCompanyObj();

            if (this.custDataCompanyObj.LtkmCustAddrLegalObj != undefined) {
                this.legalAddrCompanyObj.Addr = this.custDataCompanyObj.LtkmCustAddrLegalObj.Addr;
                this.legalAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.LtkmCustAddrLegalObj.AreaCode1;
                this.legalAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.LtkmCustAddrLegalObj.AreaCode2;
                this.legalAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.LtkmCustAddrLegalObj.AreaCode3;
                this.legalAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.LtkmCustAddrLegalObj.AreaCode4;
                this.legalAddrCompanyObj.City = this.custDataCompanyObj.LtkmCustAddrLegalObj.City;
                this.legalAddrCompanyObj.Fax = this.custDataCompanyObj.LtkmCustAddrLegalObj.Fax;
                this.legalAddrCompanyObj.FaxArea = this.custDataCompanyObj.LtkmCustAddrLegalObj.FaxArea;
                this.legalAddrCompanyObj.Phn1 = this.custDataCompanyObj.LtkmCustAddrLegalObj.Phn1;
                this.legalAddrCompanyObj.Phn2 = this.custDataCompanyObj.LtkmCustAddrLegalObj.Phn2;
                this.legalAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.LtkmCustAddrLegalObj.PhnArea1;
                this.legalAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.LtkmCustAddrLegalObj.PhnArea2;
                this.legalAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.LtkmCustAddrLegalObj.PhnExt1;
                this.legalAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.LtkmCustAddrLegalObj.PhnExt2;
                this.legalAddrCompanyObj.SubZipcode = this.custDataCompanyObj.LtkmCustAddrLegalObj.SubZipcode;

                this.legalAddrCompanyObj.MrHouseOwnershipCode = this.custDataCompanyObj.LtkmCustAddrLegalObj.MrHouseOwnershipCode;

                this.inputFieldLegalCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.LtkmCustAddrLegalObj.Zipcode;
                this.inputFieldLegalCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.LtkmCustAddrLegalObj.Zipcode };
                this.inputAddressObjForLegalCoy.default = this.legalAddrCompanyObj;
                this.inputAddressObjForLegalCoy.inputField = this.inputFieldLegalCompanyObj;
            }
        }
    }

    setAddrResidenceObj() {
        this.initAddrResidenceObj();

        if (this.custDataPersonalObj.LtkmCustAddrResidenceObj != undefined) {
            this.residenceAddrObj.Addr = this.custDataPersonalObj.LtkmCustAddrResidenceObj.Addr;
            this.residenceAddrObj.AreaCode1 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.AreaCode1;
            this.residenceAddrObj.AreaCode2 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.AreaCode2;
            this.residenceAddrObj.AreaCode3 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.AreaCode3;
            this.residenceAddrObj.AreaCode4 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.AreaCode4;
            this.residenceAddrObj.City = this.custDataPersonalObj.LtkmCustAddrResidenceObj.City;
            this.residenceAddrObj.Fax = this.custDataPersonalObj.LtkmCustAddrResidenceObj.Fax;
            this.residenceAddrObj.FaxArea = this.custDataPersonalObj.LtkmCustAddrResidenceObj.FaxArea;
            this.residenceAddrObj.Phn1 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.Phn1;
            this.residenceAddrObj.Phn2 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.Phn2;
            this.residenceAddrObj.PhnArea1 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.PhnArea1;
            this.residenceAddrObj.PhnArea2 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.PhnArea2;
            this.residenceAddrObj.PhnExt1 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.PhnExt1;
            this.residenceAddrObj.PhnExt2 = this.custDataPersonalObj.LtkmCustAddrResidenceObj.PhnExt2;
            this.residenceAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.LtkmCustAddrResidenceObj.MrHouseOwnershipCode;
            this.residenceAddrObj.StayLength = this.custDataPersonalObj.LtkmCustAddrResidenceObj.StayLength;
            this.residenceAddrObj.SubZipcode = this.custDataPersonalObj.LtkmCustAddrResidenceObj.SubZipcode;

            this.inputFieldResidenceObj.inputLookupObj.nameSelect = this.custDataPersonalObj.LtkmCustAddrResidenceObj.Zipcode;
            this.inputFieldResidenceObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.LtkmCustAddrResidenceObj.Zipcode };
            this.inputAddressObjForResidence.default = this.residenceAddrObj;
            this.inputAddressObjForResidence.inputField = this.inputFieldResidenceObj;
        }
    }

    setAddrMailingObj(custTypeCode) {
        if (custTypeCode == CommonConstant.CustTypePersonal) {
            this.initAddrMailingObj();

            if (this.custDataPersonalObj.LtkmCustAddrMailingObj != undefined) {
                this.mailingAddrObj.Addr = this.custDataPersonalObj.LtkmCustAddrMailingObj.Addr;
                this.mailingAddrObj.AreaCode1 = this.custDataPersonalObj.LtkmCustAddrMailingObj.AreaCode1;
                this.mailingAddrObj.AreaCode2 = this.custDataPersonalObj.LtkmCustAddrMailingObj.AreaCode2;
                this.mailingAddrObj.AreaCode3 = this.custDataPersonalObj.LtkmCustAddrMailingObj.AreaCode3;
                this.mailingAddrObj.AreaCode4 = this.custDataPersonalObj.LtkmCustAddrMailingObj.AreaCode4;
                this.mailingAddrObj.City = this.custDataPersonalObj.LtkmCustAddrMailingObj.City;
                this.mailingAddrObj.Fax = this.custDataPersonalObj.LtkmCustAddrMailingObj.Fax;
                this.mailingAddrObj.FaxArea = this.custDataPersonalObj.LtkmCustAddrMailingObj.FaxArea;
                this.mailingAddrObj.Phn1 = this.custDataPersonalObj.LtkmCustAddrMailingObj.Phn1;
                this.mailingAddrObj.Phn2 = this.custDataPersonalObj.LtkmCustAddrMailingObj.Phn2;
                this.mailingAddrObj.PhnArea1 = this.custDataPersonalObj.LtkmCustAddrMailingObj.PhnArea1;
                this.mailingAddrObj.PhnArea2 = this.custDataPersonalObj.LtkmCustAddrMailingObj.PhnArea2;
                this.mailingAddrObj.PhnExt1 = this.custDataPersonalObj.LtkmCustAddrMailingObj.PhnExt1;
                this.mailingAddrObj.PhnExt2 = this.custDataPersonalObj.LtkmCustAddrMailingObj.PhnExt2;
                this.mailingAddrObj.SubZipcode = this.custDataPersonalObj.LtkmCustAddrMailingObj.SubZipcode;

                this.mailingAddrObj.MrHouseOwnershipCode = this.custDataPersonalObj.LtkmCustAddrMailingObj.MrHouseOwnershipCode;

                this.inputFieldMailingObj.inputLookupObj.nameSelect = this.custDataPersonalObj.LtkmCustAddrMailingObj.Zipcode;
                this.inputFieldMailingObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataPersonalObj.LtkmCustAddrMailingObj.Zipcode };

                this.inputAddressObjForMailing.default = this.mailingAddrObj;
                this.inputAddressObjForMailing.inputField = this.inputFieldMailingObj;
            }
        }

        if (custTypeCode == CommonConstant.CustTypeCompany) {
            this.initAddrMailingCompanyObj();

            if (this.custDataCompanyObj.LtkmCustAddrMailingObj != undefined) {
                this.mailingAddrCompanyObj.Addr = this.custDataCompanyObj.LtkmCustAddrMailingObj.Addr;
                this.mailingAddrCompanyObj.AreaCode1 = this.custDataCompanyObj.LtkmCustAddrMailingObj.AreaCode1;
                this.mailingAddrCompanyObj.AreaCode2 = this.custDataCompanyObj.LtkmCustAddrMailingObj.AreaCode2;
                this.mailingAddrCompanyObj.AreaCode3 = this.custDataCompanyObj.LtkmCustAddrMailingObj.AreaCode3;
                this.mailingAddrCompanyObj.AreaCode4 = this.custDataCompanyObj.LtkmCustAddrMailingObj.AreaCode4;
                this.mailingAddrCompanyObj.City = this.custDataCompanyObj.LtkmCustAddrMailingObj.City;
                this.mailingAddrCompanyObj.Fax = this.custDataCompanyObj.LtkmCustAddrMailingObj.Fax;
                this.mailingAddrCompanyObj.FaxArea = this.custDataCompanyObj.LtkmCustAddrMailingObj.FaxArea;
                this.mailingAddrCompanyObj.Phn1 = this.custDataCompanyObj.LtkmCustAddrMailingObj.Phn1;
                this.mailingAddrCompanyObj.Phn2 = this.custDataCompanyObj.LtkmCustAddrMailingObj.Phn2;
                this.mailingAddrCompanyObj.PhnArea1 = this.custDataCompanyObj.LtkmCustAddrMailingObj.PhnArea1;
                this.mailingAddrCompanyObj.PhnArea2 = this.custDataCompanyObj.LtkmCustAddrMailingObj.PhnArea2;
                this.mailingAddrCompanyObj.PhnExt1 = this.custDataCompanyObj.LtkmCustAddrMailingObj.PhnExt1;
                this.mailingAddrCompanyObj.PhnExt2 = this.custDataCompanyObj.LtkmCustAddrMailingObj.PhnExt2;
                this.mailingAddrCompanyObj.SubZipcode = this.custDataCompanyObj.LtkmCustAddrMailingObj.SubZipcode;

                this.mailingAddrCompanyObj.MrHouseOwnershipCode = this.custDataCompanyObj.LtkmCustAddrMailingObj.MrHouseOwnershipCode;

                this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = this.custDataCompanyObj.LtkmCustAddrMailingObj.Zipcode;
                this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: this.custDataCompanyObj.LtkmCustAddrMailingObj.Zipcode };
                this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
                this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
            }
        }
    }

    CopyCustomer(event) {
        console.log("copy customer");
        console.log(this.CustDataForm);
        this.copyAddrFromLookup(event);

        //perlu diganti cara bacanya (gak perlu), liat dri SELECT * FROM FOUNDATION_DSF.dbo.CUST_PERSONAL_FAMILY
        // if (event["CustPersonalContactPersonObjs"] != undefined) {
        //   this.listAppCustPersonalContactInformation = event["CustPersonalContactPersonObjs"];
        //   this.CheckSpouseExist();
        // }

        //perlu review, perlu tambah mekanisme buat load data dri fou, cek method BindListFinDataFromFoundation
        if (event["CustPersonalFinDataObjs"] != undefined) {
            this.custDataPersonalObj.LtkmCustPersonalFinDataObj = event["CustPersonalFinDataObjs"];
            this.listLtkmCustPersonalFinDataObjs = event["CustPersonalFinDataObjs"];

            // this.custDataPersonalObj.LtkmCustPersonalFinDataObj.MrSourceOfIncomeTypeCode = event["CustPersonalFinDataObj"].MrSourceOfIncomeCode;

            // let TotalMonthlyIncome = this.custDataPersonalObj.LtkmCustPersonalFinDataObj.MonthlyIncomeAmt + this.custDataPersonalObj.AppCustPersonalFinDataObj.SpouseMonthlyIncomeAmt;
            // let TotalMonthlyExpense = this.custDataPersonalObj.LtkmCustPersonalFinDataObj.MonthlyExpenseAmt + this.custDataPersonalObj.AppCustPersonalFinDataObj.MonthlyInstallmentAmt;
            // this.CustDataForm.controls["financialData"].patchValue({
            //   TotalMonthlyIncome: TotalMonthlyIncome,
            //   TotalMonthlyExpense: TotalMonthlyExpense,
            //   NettMonthlyIncome: TotalMonthlyIncome - TotalMonthlyExpense
            // });
        }
        //perlu review, perlu tambah mekanisme buat load data dri fou, cek method BindListFinDataFromFoundation
        if (event["CustBankAccObjs"] != undefined) {
            this.listLtkmCustBankAccObjs = event["CustBankAccObjs"];
            this.custLtkmBankSectionComponent.LtkmCustBankAccList = event["CustBankAccObjs"];
        }



        if (event["RLtkmCustPersonalJobDataObj"] != undefined) {
            this.custJobDataComponent.custModelCode = event["CustObj"].MrCustModelCode;
            this.custJobDataComponent.ltkmCustPersonalJobDataObj = event["RLtkmCustPersonalJobDataObj"];
            this.custJobDataComponent.IsCopy = true;

            this.custJobDataComponent.bindLtkmCustPersonalJobData();
        }

        if (event["CustGrpObjs"] != undefined) {
            this.custGrpMemberComponent.ltkmCustGrpObjs = event["CustGrpObjs"];
            this.custGrpMemberComponent.copyAppGrp();
        }

        this.spouseGender = event["CustPersonalObj"]["MrGenderCode"];
        this.isMarried = event["CustPersonalObj"]["MrMaritalStatCode"] == CommonConstant.MasteCodeMartialStatsMarried ? true : false;

        var tempNewAttr: Array<LtkmAttrContent>;
        tempNewAttr = new Array<LtkmAttrContent>();
        // tempNewAttr = event["CustAttrContentObjs"]["NewCustAttrContentObjs"];
        tempNewAttr = event["CustAttrContentObjs"]["NewCustAttrContentObjsForLtkm"];

        this.listAttrContentFinData = tempNewAttr.filter(x => x.AttrGroup == this.AttrGroupFinData);
        this.listAttrContentCustData = tempNewAttr.filter(x => x.AttrGroup == this.AttrGroup);

        if (this.listAttrContentFinData.length > 0) {
            this.attrlistfindatacomponent.ListAttrContent = this.listAttrContentFinData;
            this.attrlistfindatacomponent.copyListAttrContent();
        }

        if (this.listAttrContentCustData.length > 0) {
            this.attrlistcustcomponent.ListAttrContent = this.listAttrContentCustData;
            this.attrlistcustcomponent.copyListAttrContent();
        }

        if (event["CustOtherInfoObj"] != undefined) {
            this.custOtherInfoComponent.CustOtherInfo = event["CustOtherInfoObj"];
            this.custOtherInfoComponent.copyOtherInfo();
        }

        if (event["CustPersonalEmergencyContactObj"] != undefined) {
            this.LtkmEmergencyContactComponent.LtkmCustEmergencyContact = event["CustPersonalEmergencyContactObj"];
            this.LtkmEmergencyContactComponent.getData();
        }

        if (event["custPersonalFamilyForLtkmObjs"] != undefined) {
            this.listFamily = event["custPersonalFamilyForLtkmObjs"];
            this.LtkmFamilyMainDataPagingComponent.listFamily = event["custPersonalFamilyForLtkmObjs"];
            this.LtkmFamilyMainDataPagingComponent.loadFamilyListData();
        }
    }

    CopyCustomerCompany(event) {
        this.copyAddrCompanyFromLookup(event);
        console.log('copycustomercompany');
        if (event["CustCompanyContactPersonObjs"] != undefined) {
            // this.listContactPersonCompany = event["CustCompanyContactPersonObjs"];
            this.custCompanyContactInfo.LtkmCustCompanyContactPersonObj = event["CustCompanyContactPersonObjs"][0];
            this.custCompanyContactInfo.GetAppCustCompanyContactPersonByAppCustId();
        }

        if (event["CustCompanyMgmntShrholderObjs"] != undefined) {
            this.listLtkmCustCompanyManagementShareholderObj = event["CustCompanyMgmntShrholderObjs"];
            this.custCompanyManagementShareholderComponent.listLtkmCustCompanyManagementShareholderObj = event["CustCompanyMgmntShrholderObjs"];
            this.custCompanyManagementShareholderComponent.loadShareholderListData();
        }

        if (event["CustCompanyLegalDocObjs"] != undefined) {
            this.listLtkmCustCompanyLegalDoc = event["CustCompanyLegalDocObjs"];
            this.custCompanyLegalDocComponent.listLtkmCustCompanyLegalDoc = event["CustCompanyLegalDocObjs"];
        }

        if (event["CustCompanyFinDataObjs"] != undefined) {
            this.listLtkmCustCoyFinData = event["CustCompanyFinDataObjs"];
            this.custCompanyFinDataComponent.ListLtkmCustCoyFinData = event["CustCompanyFinDataObjs"];
            // this.custCompanyFinDataComponent.AppCustCompanyFinDataObj.DateAsOf = formatDate(event["CustCompanyFinDataObj"].DateAsOf, 'yyyy-MM-dd', 'en-US');
        }

        if (event["CustBankAccObjs"] != undefined) {
            this.listLtkmCustBankAccCompany = event["CustBankAccObjs"];
            this.custLtkmBankSectionComponent.listLtkmCustBankAccCompany = event["CustBankAccObjs"];
        }

        if (event["CustGrpObjs"] != undefined) {
            this.custGrpMemberComponent.ltkmCustGrpObjs = event["CustGrpObjs"];
            this.custGrpMemberComponent.copyAppGrp();
        }

        //tambahan baru
        var tempNewAttr: Array<LtkmAttrContent>;
        tempNewAttr = new Array<LtkmAttrContent>();
        tempNewAttr = event["CustAttrContentObjs"]["NewCustAttrContentObjs"];

        this.listAttrContentFinDataCoy = tempNewAttr.filter(x => x.AttrGroup == this.AttrGroupFinData);
        this.listAttrContentCustDataCoy = tempNewAttr.filter(x => x.AttrGroup == this.AttrGroup);

        if (this.listAttrContentFinDataCoy.length > 0) {
            this.attrlistfindatacomponentcoy.ListAttrContent = this.listAttrContentFinDataCoy;
            this.attrlistfindatacomponentcoy.copyListAttrContent();
        }

        if (this.listAttrContentCustDataCoy.length > 0) {
            this.attrlistcustcomponentcoy.ListAttrContent = this.listAttrContentCustDataCoy;
            this.attrlistcustcomponentcoy.copyListAttrContent();
        }

        if (event["CustOtherInfoObj"] != undefined) {
            this.custOtherInfoComponent.CustOtherInfo = event["CustOtherInfoObj"];
            this.custOtherInfoComponent.copyOtherInfo();
        }
        //end tambahan
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

            this.legalAddrObj.MrHouseOwnershipCode = event["CustAddrLegalObj"].MrBuildingOwnershipCode;
            this.legalAddrObj.StayLength = event["CustAddrLegalObj"].StayLength;

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

            this.residenceAddrObj.MrHouseOwnershipCode = event["CustAddrResidenceObj"].MrBuildingOwnershipCode;
            this.residenceAddrObj.StayLength = event["CustAddrResidenceObj"].StayLength;

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

        if (this.isLockMode) {
            this.disableInput();
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

            this.legalAddrCompanyObj.MrHouseOwnershipCode = event["CustAddrLegalObj"].MrBuildingOwnershipCode;
            this.legalAddrCompanyObj.StayLength = event["CustAddrLegalObj"].StayLength;

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

            this.mailingAddrCompanyObj.MrHouseOwnershipCode = event["CustAddrMailingObj"].MrBuildingOwnershipCode;

            this.inputFieldMailingCompanyObj.inputLookupObj.nameSelect = event["CustAddrMailingObj"].Zipcode;
            this.inputFieldMailingCompanyObj.inputLookupObj.jsonSelect = { Zipcode: event["CustAddrMailingObj"].Zipcode };
            this.inputAddressObjForMailingCoy.default = this.mailingAddrCompanyObj;
            this.inputAddressObjForMailingCoy.inputField = this.inputFieldMailingCompanyObj;
        }

        if (this.isLockMode) {
            this.disableInput();
        }
    }

    async bindCustTypeObj() {
        let reqTempObj: ReqRefMasterByTypeCodeAndMappingCodeObj = new ReqRefMasterByTypeCodeAndMappingCodeObj();
        reqTempObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustType;
        reqTempObj.MappingCode = null;
        await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, reqTempObj).toPromise().then(
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
        this.onChangeMrCustTypeCode(ev.value);
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

                this.listLtkmCustBankAccObjs = new Array<LtkmCustBankAccObj>();
                this.listLtkmCustPersonalFinDataObjs = new Array<LtkmCustPersonalFinDataObj>();
                this.listLtkmCustGrpObj = new Array<LtkmCustGrpObj>();
                this.ltkmCustPersonalJobDataObj = new LtkmCustPersonalJobDataObj();
                this.LtkmCustEmergencyContactObj = new LtkmCustEmrgncCntctObj();

                this.ltkmCustOtherInfo = new LtkmCustOtherInfoObj();
                this.listAttrContentFinDataCoy = new Array<LtkmAttrContent>();
                this.listAttrContentCustDataCoy = new Array<LtkmAttrContent>();

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

                this.listLtkmCustCompanyManagementShareholderObj = new Array<LtkmCustCompanyMgmntShrholderObj>();
                this.ContactPersonCompany = new LtkmCustCompanyContactPersonObj();
                this.listLtkmCustCoyFinData = new Array<LtkmCustCompanyFinDataObj>();
                this.listLtkmCustBankAccCompany = new Array<LtkmCustBankAccObj>();
                this.listLtkmCustCompanyLegalDoc = new Array<LtkmCustCompanyLegalDocObj>();
                this.listLtkmCustGrpsCompany = new Array<LtkmCustGrpObj>();

                this.ltkmCustOtherInfo = new LtkmCustOtherInfoObj();
                this.listAttrContentFinDataCoy = new Array<LtkmAttrContent>();
                this.listAttrContentCustDataCoy = new Array<LtkmAttrContent>();
                this.CustDataCompanyForm.controls['companyMainData']['controls']["TaxIdNo"].enable();
            }
        }

        if (this.isLockMode) {
            this.disableInput();
        }
    }

    disableInput() {
        if (this.MrCustTypeCode == CommonConstant.CustTypePersonal) {
            this.inputAddressObjForLegal.isReadonly = true;
            this.inputAddressObjForResidence.isReadonly = true;
            this.inputAddressObjForMailing.isReadonly = true;

            this.inputAddressObjForLegal.isRequired = false;
            this.inputAddressObjForResidence.isRequired = false;
            this.inputAddressObjForMailing.isRequired = false;

            this.inputAddressObjForLegal.inputField.inputLookupObj.isReadonly = true;
            this.inputAddressObjForResidence.inputField.inputLookupObj.isReadonly = true;
            this.inputAddressObjForMailing.inputField.inputLookupObj.isReadonly = true;

            this.inputAddressObjForLegal.inputField.inputLookupObj.isDisable = true;
            this.inputAddressObjForResidence.inputField.inputLookupObj.isDisable = true;
            this.inputAddressObjForMailing.inputField.inputLookupObj.isDisable = true;

            this.inputAddressObjForLegal.inputField.inputLookupObj.isRequired = false;
            this.inputAddressObjForResidence.inputField.inputLookupObj.isRequired = false;
            this.inputAddressObjForMailing.inputField.inputLookupObj.isRequired = false;
        } else {
            this.inputAddressObjForLegalCoy.isReadonly = true;
            this.inputAddressObjForMailingCoy.isReadonly = true;

            this.inputAddressObjForLegalCoy.isRequired = false;
            this.inputAddressObjForMailingCoy.isRequired = false;

            this.inputAddressObjForLegalCoy.inputField.inputLookupObj.isReadonly = true;
            this.inputAddressObjForMailingCoy.inputField.inputLookupObj.isReadonly = true;

            this.inputAddressObjForLegalCoy.inputField.inputLookupObj.isDisable = true;
            this.inputAddressObjForMailingCoy.inputField.inputLookupObj.isDisable = true;

            this.inputAddressObjForMailingCoy.inputField.inputLookupObj.isRequired = false;
            this.inputAddressObjForLegalCoy.inputField.inputLookupObj.isRequired = false;
        }
    }

    onChangeMrCustTypeCode(val) {
        this.AttrGroup = val == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyOther : CommonConstant.AttrGroupCustPersonalOther;
        this.AttrGroupFinData = val == CommonConstant.CustTypeCompany ? CommonConstant.AttrGroupCustCompanyFinData : CommonConstant.AttrGroupCustPersonalFinData;
    }
    SetAttrContent(formgroupname: string) {
        var formValue = this.CustDataForm['controls'][formgroupname].value;
        var temp = new Array<Object>();

        if (Object.keys(formValue).length > 0 && formValue.constructor === Object) {
            for (const key in formValue) {
                if (formValue[key]["AttrValue"] != null) {
                    var custAttr = {
                        CustAttrContentId: formValue[key]["CustAttrContentId"],
                        RefAttrCode: formValue[key]["AttrCode"],
                        AttrValue: formValue[key]["AttrValue"],
                        AttrGroup: this.AttrGroup
                    };
                    temp.push(custAttr);
                }
            }
        }
        return temp;
    }
}

