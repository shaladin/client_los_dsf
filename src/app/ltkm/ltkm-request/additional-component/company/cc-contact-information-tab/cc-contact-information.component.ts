import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AppCustCompanyContactPersonObj } from 'app/shared/model/AppCustCompany/AppCustCompanyContactPersonObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';
import { CustomPatternObj } from 'app/shared/model/CustomPatternObj.model';
import { RegexService } from 'app/shared/services/regex.services';
import { LtkmCustCompanyContactPersonObj } from 'app/shared/model/LTKM/LtkmCustCompanyContactPersonObj.Model';
import { LtkmCustAddrObj } from 'app/shared/model/LTKM/LtkmCustAddrObj.Model';

@Component({
    selector: 'app-ltkm-cc-contact-information',
    templateUrl: './cc-contact-information.component.html',
    providers: [RegexService],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class LtkmCcContactInformationTabComponent implements OnInit {

    @Input() AppCustId: number;
    @Output() OutputTab: EventEmitter<any> = new EventEmitter();
    inputAddressObjForCc: InputAddressObj;
    inputFieldCcObj: InputFieldObj = new InputFieldObj();
    CcAddrObj: AddrObj = new AddrObj();
    CcCustAddrObj: AppCustAddrObj;
    IsUcAddrReady: boolean = false;
    @Input() LtkmCustCompanyContactPersonObj: LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
    DictRefMaster: any = {};
    BusinessDate: Date;
    readonly MasterIdTypeCode: string = CommonConstant.RefMasterTypeCodeIdType;
    readonly MasterGenderCode: string = CommonConstant.RefMasterTypeCodeGender;
    readonly MasterJobPosCode: string = CommonConstant.RefMasterTypeCodeJobPosition;
    readonly MasterCustRelationCode: string = CommonConstant.RefMasterTypeCodeCustRelationship;
    readonly IdTypeNpwp: string = CommonConstant.MrIdTypeCodeNPWP;
    readonly IdTypeKitas: string = CommonConstant.MrIdTypeCodeKITAS;
    readonly IdTypeSim: string = CommonConstant.MrIdTypeCodeSIM;
    readonly InputAddressObjForCc_Identifier: string = "CcDataAddr";
    constructor(
        private regexService: RegexService,
        private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        public formValidate: FormValidateService) {

    }

    CcForm = this.fb.group({
        ContactPersonName: ['', Validators.required],
        MrGenderCode: ['', Validators.required],
        JobTitleName: ['', Validators.required],
        MrJobPositionCode: ['', Validators.required],
        MrIdTypeCode: [''],
        IdNo: [''],
        IdExpiredDt: [''],
        BirthPlace: [''],
        BirthDt: [''],
        MrCustRelationshipCode: [''],
        MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
        MobilePhnNo2: ['', Validators.pattern("^[0-9]*$")],
        Email1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
        Email2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
        PhnArea1: ['', Validators.pattern("^[0-9]*$")],
        PhnArea2: ['', Validators.pattern("^[0-9]*$")],
        Phn1: ['', Validators.pattern("^[0-9]*$")],
        Phn2: ['', Validators.pattern("^[0-9]*$")],
        PhnExt1: ['', Validators.pattern("^[0-9]*$")],
        PhnExt2: ['', Validators.pattern("^[0-9]*$")],
    });

    @Input() enjiForm: NgForm;
    @Input() parentForm: FormGroup;
    @Input() identifier: string;
    @Input() isLockMode: boolean = false;

    async ngOnInit() {

        if (this.isLockMode) {
            this.parentForm.addControl(this.identifier, this.fb.group({
                ContactPersonName: [''],
                MrGenderCode: [''],
                JobTitleName: [''],
                MrJobPositionCode: [''],
                MrIdTypeCode: [''],
                IdNo: [''],
                IdExpiredDt: [''],
                BirthPlace: [''],
                BirthDt: [''],
                MrCustRelationshipCode: [''],
                MobilePhnNo1: [''],
                MobilePhnNo2: [''],
                Email1: [''],
                Email2: [''],
                PhnArea1: [''],
                PhnArea2: [''],
                Phn1: [''],
                Phn2: [''],
                PhnExt1: [''],
                PhnExt2: [''],
            }));
        } else {
            this.parentForm.addControl(this.identifier, this.fb.group({
                ContactPersonName: ['', Validators.required],
                MrGenderCode: ['', Validators.required],
                JobTitleName: ['', Validators.required],
                MrJobPositionCode: ['', Validators.required],
                MrIdTypeCode: [''],
                IdNo: [''],
                IdExpiredDt: [''],
                BirthPlace: [''],
                BirthDt: [''],
                MrCustRelationshipCode: [''],
                MobilePhnNo1: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
                MobilePhnNo2: ['', Validators.pattern("^[0-9]*$")],
                Email1: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
                Email2: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
                PhnArea1: ['', Validators.pattern("^[0-9]*$")],
                PhnArea2: ['', Validators.pattern("^[0-9]*$")],
                Phn1: ['', Validators.pattern("^[0-9]*$")],
                Phn2: ['', Validators.pattern("^[0-9]*$")],
                PhnExt1: ['', Validators.pattern("^[0-9]*$")],
                PhnExt2: ['', Validators.pattern("^[0-9]*$")],
            }));
        }

        console.log(this.parentForm);


        this.customPattern = new Array<CustomPatternObj>();
        let UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
        this.BusinessDate = new Date(formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US'));

        this.SetAddrForm();
        await this.GetListActiveRefMaster(this.MasterGenderCode);
        await this.GetListActiveRefMaster(this.MasterIdTypeCode);
        await this.GetListActiveRefMaster(this.MasterJobPosCode);
        await this.GetListActiveRefMaster(this.MasterCustRelationCode);
        await this.GetAppCustCompanyContactPersonByAppCustId();
    }

    async GetListActiveRefMaster(RefMasterTypeCode: string) {
        await this.http.post<any>(URLConstant.GetRefMasterListKeyValueActiveByCode, { "RefMasterTypeCode": RefMasterTypeCode }).toPromise().then(
            (response) => {
                this.DictRefMaster[RefMasterTypeCode] = response["ReturnObject"];
                if (this.DictRefMaster[this.MasterIdTypeCode] != undefined) {
                    this.getInitPattern();
                }
            }
        );
    }

    async GetAppCustCompanyContactPersonByAppCustId() {

        // await this.http.post<AppCustCompanyContactPersonObj>(URLConstant.GetAppCustCompanyContactPersonByAppCustId, { "appCustId": this.AppCustId }).toPromise().then(
        //   (response) => {
        //     if (response.AppCustCompanyContactPersonId != 0) {
        //       this.LtkmCustCompanyContactPersonObj = response;
        this.parentForm['controls'][this.identifier].patchValue({
            ContactPersonName: this.LtkmCustCompanyContactPersonObj.ContactPersonName,
            MrGenderCode: this.LtkmCustCompanyContactPersonObj.MrGenderCode,
            JobTitleName: this.LtkmCustCompanyContactPersonObj.JobTitleName,
            MrJobPositionCode: this.LtkmCustCompanyContactPersonObj.MrJobPositionCode,
            MrIdTypeCode: this.LtkmCustCompanyContactPersonObj.MrIdTypeCode,
            IdNo: this.LtkmCustCompanyContactPersonObj.IdNo,
            IdExpiredDt: this.LtkmCustCompanyContactPersonObj.IdExpiredDt != null ? formatDate(this.LtkmCustCompanyContactPersonObj.IdExpiredDt, 'yyyy-MM-dd', 'en-US') : "",
            BirthPlace: this.LtkmCustCompanyContactPersonObj.BirthPlace,
            BirthDt: this.LtkmCustCompanyContactPersonObj.BirthDt != null ? formatDate(this.LtkmCustCompanyContactPersonObj.BirthDt, 'yyyy-MM-dd', 'en-US') : "",
            MrCustRelationshipCode: this.LtkmCustCompanyContactPersonObj.MrCustRelationshipCode,
            MobilePhnNo1: this.LtkmCustCompanyContactPersonObj.MobilePhnNo1,
            MobilePhnNo2: this.LtkmCustCompanyContactPersonObj.MobilePhnNo2,
            Email1: this.LtkmCustCompanyContactPersonObj.Email1,
            Email2: this.LtkmCustCompanyContactPersonObj.Email2,
            PhnArea1: this.LtkmCustCompanyContactPersonObj.PhnArea1,
            PhnArea2: this.LtkmCustCompanyContactPersonObj.PhnArea2,
            Phn1: this.LtkmCustCompanyContactPersonObj.Phn1,
            Phn2: this.LtkmCustCompanyContactPersonObj.Phn2,
            PhnExt1: this.LtkmCustCompanyContactPersonObj.PhnExt1,
            PhnExt2: this.LtkmCustCompanyContactPersonObj.PhnExt2,
        });

        if (this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj != null) {
            this.inputFieldCcObj = new InputFieldObj();
            this.inputFieldCcObj.inputLookupObj = new InputLookupObj();

            this.CcAddrObj.Addr = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Addr;
            this.CcAddrObj.PhnExt1 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.PhnExt1;
            this.CcAddrObj.PhnExt2 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.PhnExt2;
            this.CcAddrObj.Phn1 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Phn1;
            this.CcAddrObj.Phn2 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Phn2;
            this.CcAddrObj.PhnArea1 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.PhnArea1;
            this.CcAddrObj.PhnArea2 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.PhnArea2;
            this.CcAddrObj.Fax = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Fax;
            this.CcAddrObj.FaxArea = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.FaxArea;
            this.CcAddrObj.AreaCode1 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.AreaCode1;
            this.CcAddrObj.AreaCode2 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.AreaCode2;
            this.CcAddrObj.AreaCode3 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.AreaCode3;
            this.CcAddrObj.AreaCode4 = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.AreaCode4;
            this.CcAddrObj.City = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.City;
            this.CcAddrObj.SubZipcode = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.SubZipcode;

            this.inputFieldCcObj.inputLookupObj.nameSelect = this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Zipcode;
            this.inputFieldCcObj.inputLookupObj.jsonSelect = { Zipcode: this.LtkmCustCompanyContactPersonObj.LtkmCustAddrObj.Zipcode };
            this.inputAddressObjForCc.default = this.CcAddrObj;

            if (this.isLockMode) {
                this.inputFieldCcObj.inputLookupObj.isRequired = false;
                this.inputFieldCcObj.inputLookupObj.isReadonly = true;
                this.inputFieldCcObj.inputLookupObj.isDisable = true;
            }
            this.inputAddressObjForCc.inputField = this.inputFieldCcObj;

            if (this.isLockMode) {
                this.inputAddressObjForCc.isReadonly = true;
                this.inputAddressObjForCc.isRequired = false;
            }
        }
        this.ChangeIdType(true);
        // }
        this.IsUcAddrReady = true;
        // }
        // );
    }

    SetAddrForm() {
        this.inputAddressObjForCc = new InputAddressObj();
        this.inputAddressObjForCc.showSubsection = true;
        this.inputAddressObjForCc.showPhn3 = false;
    }

    ChangeIdType(FirstInit: boolean = false) {
        let IdTypeCode = this.parentForm['controls'][this.identifier].get("MrIdTypeCode").value;
        if (!this.isLockMode) {
            if (IdTypeCode == this.IdTypeNpwp) {
                this.parentForm['controls'][this.identifier].get("IdNo").setValidators(Validators.required);
            } else {
                this.parentForm['controls'][this.identifier].get("IdNo").clearValidators();
            }
        }
        this.parentForm['controls'][this.identifier].get("IdNo").updateValueAndValidity();

        if (!this.isLockMode) {
            if (IdTypeCode == this.IdTypeKitas || IdTypeCode == this.IdTypeSim) {
                this.parentForm['controls'][this.identifier].get("IdExpiredDt").setValidators(Validators.required);
            } else {
                this.parentForm['controls'][this.identifier].get("IdExpiredDt").clearValidators();
            }
        }
        if (!FirstInit) this.parentForm['controls'][this.identifier]['controls'].IdExpiredDt.patchValue("");
        this.parentForm['controls'][this.identifier].get("IdExpiredDt").updateValueAndValidity();
        this.setValidatorPattern();
    }

    // async SaveForm() {
    //   let temp = this.parentForm['controls'][this.identifier]['controls'].getRawValue();
    //   let ReqAddr = await this.SetReqAddrObj(temp);
    //   await this.SetReqCcObj(temp, ReqAddr);

    //   this.OutputTab.emit({IsComplete: true});
    // }

    async SetReqAddrObj(obj: any) {
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

    CheckDt(inputDate: Date, type: string) {
        let UserAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));
        let MaxDate = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
        let Max17YO = formatDate(UserAccess.BusinessDt, 'yyyy-MM-dd', 'en-US');
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

    async SetReqCcObj(obj: any, ReqAddr: LtkmCustAddrObj) {
        let ReqCcObj: LtkmCustCompanyContactPersonObj = new LtkmCustCompanyContactPersonObj();
        // ReqCcObj.LtkmCustId = this.LtkmCustId;
        ReqCcObj.LtkmCustCompanyId = this.LtkmCustCompanyContactPersonObj.LtkmCustCompanyId;
        ReqCcObj.LtkmCustCompanyContactPersonId = this.LtkmCustCompanyContactPersonObj.LtkmCustCompanyContactPersonId;
        ReqCcObj.RowVersion = this.LtkmCustCompanyContactPersonObj.RowVersion;
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

        // await this.http.post(URLConstant.AddOrEditAppCustCompanyContactPerson, ReqCcObj).toPromise().then(
        //   (response) => {
        //     this.toastr.successMessage(response["message"]);
        //   }
        // );
    }

    //START URS-LOS-041
    controlNameIdNo: any = 'IdNo';
    controlNameIdType: any = 'MrIdTypeCode';
    customPattern: Array<CustomPatternObj>;
    initIdTypeCode: any;
    resultPattern: any;

    getInitPattern() {
        this.regexService.getListPattern().subscribe(
            response => {
                this.resultPattern = response[CommonConstant.ReturnObj];
                if (this.resultPattern != undefined) {
                    for (let i = 0; i < this.resultPattern.length; i++) {
                        let patternObj: CustomPatternObj = new CustomPatternObj();
                        let pattern: string = this.resultPattern[i].Value;

                        patternObj.pattern = pattern;
                        patternObj.invalidMsg = this.regexService.getErrMessage(pattern);
                        this.customPattern.push(patternObj);
                    }
                    this.setValidatorPattern();
                }
            }
        );
    }
    setValidatorPattern() {
        let idTypeValue: string;
        idTypeValue = this.parentForm['controls'][this.identifier]['controls'][this.controlNameIdType].value;
        var pattern: string = '';
        if (idTypeValue != undefined) {
            if (this.resultPattern != undefined) {
                var result = this.resultPattern.find(x => x.Key == idTypeValue)
                if (result != undefined) {
                    pattern = result.Value;
                }
            }
        }
        this.setValidator(pattern);
    }
    setValidator(pattern: string) {
        if (pattern != undefined) {
            this.parentForm['controls'][this.identifier]['controls'][this.controlNameIdNo].setValidators(Validators.pattern(pattern));
            this.parentForm['controls'][this.identifier]['controls'][this.controlNameIdNo].updateValueAndValidity();
        }
    }
    //END OF URS-LOS-041
}
