import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CustSetData } from 'app/NEW-NAP/sharing-component/main-data-component/components/CustSetData.Service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/uc-dropdown-list-obj.model';
import { MouCustCompanyMgmntShrholderObj } from 'app/shared/model/mou-cust-company-mgmnt-shrholder-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-master-code-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-mou-cust-mgmnt-shrholder-public',
    templateUrl: './mou-cust-mgmnt-shrholder-public.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})

export class MouCustMgmntShrholderPublicComponent implements OnInit {

    @Input() MouCustCompanyId: number = 0;
    @Input() MouCustCompanyMgmntShrholderId: number = 0;
    @Input() tempTotalSharePrct: number = 0;
    @Input() tempExisting: MouCustCompanyMgmntShrholderObj = new MouCustCompanyMgmntShrholderObj();
    @Output() outputCancel: EventEmitter<{ Key: string, Value: MouCustCompanyMgmntShrholderObj }> = new EventEmitter();
    readonly RefMasterTypeCodePublicType: string = CommonConstant.RefMasterTypeCodePublicType;
    readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private toastr: NGXToastrService,
        private modalService: NgbModal, private cookieService: CookieService) {

    }

    IsReady: boolean = false;
    CustomerForm: FormGroup = this.fb.group({});
    // inputAddressObj: InputAddressObj = new InputAddressObj();
    async ngOnInit() {
        this.InitData();
        this.initDdlRefMaster(this.RefMasterTypeCodePublicType, null, true);
        this.SetExisting();
        this.IsReady = true;
    }

    SetExisting() {
        if (this.tempExisting == new MouCustCompanyMgmntShrholderObj()) return;
        this.ClearForm(this.tempExisting);
    }
    //#region UcDDL
    DictUcDDLObj: { [id: string]: UcDropdownListObj } = {};
    initDdlRefMaster(refMasterTypeCode: string, mappingCode: string = null, isSelectOutput: boolean = false) {
        let tempDdlObj: UcDropdownListObj = new UcDropdownListObj();
        let ReqRefMasterObj: ReqRefMasterByTypeCodeAndMappingCodeObj = {
            RefMasterTypeCode: refMasterTypeCode,
            MappingCode: mappingCode
        }
        tempDdlObj.apiUrl = URLConstant.GetListActiveRefMaster;
        tempDdlObj.requestObj = ReqRefMasterObj;
        tempDdlObj.ddlType = UcDropdownListConstant.DDL_TYPE_ONE;
        tempDdlObj.isSelectOutput = isSelectOutput;
        tempDdlObj.isReady = true;
        tempDdlObj.customKey = "MasterCode";
        tempDdlObj.customValue = "Descr";
        this.DictUcDDLObj[refMasterTypeCode] = tempDdlObj;
    }
    //#endregion

    positionSlikLookUpObj: InputLookupObj = new InputLookupObj();
    ClearForm(item: MouCustCompanyMgmntShrholderObj = null) {
        this.CustomerForm = this.fb.group({
            MrPositionSlikCode: [item == null ? '' : item.MrPositionSlikCode, Validators.required],
            MrPublicTypeCode: [item == null ? '' : item.MrPublicTypeCode, Validators.required],
            PublicName: [item == null ? '' : item.PublicName, Validators.required],
            PublicIdentityNo: [item == null ? '' : item.PublicIdentityNo, Validators.required],
            SharePrcnt: [item == null ? 0 : item.SharePrcnt, [Validators.required, Validators.min(0), Validators.max(100)]],
            IsActive: [item == null ? true : item.IsActive, Validators.required],
        });

        if (item != null) {
            //#region patch positionSlik    
            let reqMasterObj: ReqRefMasterByTypeCodeAndMasterCodeObj = {
                MasterCode: item.MrPositionSlikCode,
                RefMasterTypeCode: CommonConstant.RefMasterTypeCodePositionSlik
            };
            this.http.post(URLConstant.GetRefMasterByRefMasterTypeCodeAndMasterCode, reqMasterObj).subscribe(
                (response: RefMasterObj) => {
                    this.positionSlikLookUpObj.nameSelect = response.Descr;
                    this.positionSlikLookUpObj.jsonSelect = { Jabatan: response.Descr };
                    this.positionSlikLookUpObj.isReady = true;
                }
            )
            //#endregion

            this.disableOrEnableForm();
        }
    }

    InitData() {
        this.ClearForm();
        // this.inputAddressObj = CustSetData.BindSetLegalAddr();
        this.positionSlikLookUpObj = CustSetData.BindLookupPositionSlik();
    }

    SaveForm() {
        let tempForm = this.CustomerForm.getRawValue();
        let reqSubmitObj: MouCustCompanyMgmntShrholderObj = this.tempExisting;

        // reqSubmitObj.MouCustCompanyId = this.MouCustCompanyId;
        reqSubmitObj.PublicName = tempForm["PublicName"];
        reqSubmitObj.MrPositionSlikCode = tempForm["MrPositionSlikCode"];
        reqSubmitObj.MrPublicTypeCode = tempForm["MrPublicTypeCode"];
        reqSubmitObj.PublicIdentityNo = tempForm["PublicIdentityNo"];
        reqSubmitObj.SharePrcnt = tempForm["SharePrcnt"];
        reqSubmitObj.IsActive = tempForm["IsActive"];
        reqSubmitObj.MgmntShrholderName = CommonConstant.CustTypePublic;
        reqSubmitObj.MrCustTypeCode = CommonConstant.CustTypePublic;
        reqSubmitObj.MrShrholderTypeCode = CommonConstant.CustTypePublic;

        if (reqSubmitObj.IsActive) {
            let tempTotalSharePrctTobeAdd = this.tempTotalSharePrct + reqSubmitObj.SharePrcnt;
            if (tempTotalSharePrctTobeAdd > 100) {
                this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_CAN_NOT_100);
                this.toastr.warningMessage("Total Share now is " + this.tempTotalSharePrct + "%");
                return;
            }
        }
        // reqSubmitObj.PublicAddr = tempForm["UcAddress"]["Addr"];
        // reqSubmitObj.PublicAreaCode1 = tempForm["UcAddress"]["AreaCode1"];
        // reqSubmitObj.PublicAreaCode2 = tempForm["UcAddress"]["AreaCode2"];
        // reqSubmitObj.PublicAreaCode3 = tempForm["UcAddress"]["AreaCode3"];
        // reqSubmitObj.PublicAreaCode4 = tempForm["UcAddress"]["AreaCode4"];
        // reqSubmitObj.PublicCity = tempForm["UcAddress"]["City"];
        // reqSubmitObj.PublicZipcode = tempForm["UcAddressZipcode"]["value"];

        this.outputCancel.emit({ Key: "save", Value: reqSubmitObj });
    }

    Cancel() {
        this.outputCancel.emit({ Key: "cancel", Value: null });
    }
    getLookUpSlik(ev: { Code: string, Jabatan: string }) {
        let tempMrPositionSlikCode = this.CustomerForm.get("MrPositionSlikCode");
        tempMrPositionSlikCode.patchValue(ev.Code);
    }
    onOptionsSelected(ev: { selectedIndex: number, selectedObj: RefMasterObj, selectedValue: string }) {
        let tempPublicName = this.CustomerForm.get("PublicName");
        let tempPublicIdentityNo = this.CustomerForm.get("PublicIdentityNo");
        if (ev.selectedValue == "CMTY" || ev.selectedValue == "PRI") {
            tempPublicName.patchValue(ev.selectedObj.Descr);
            tempPublicIdentityNo.patchValue(ev.selectedObj.ReserveField1);
            this.disableOrEnableForm();
            return;
        }
        tempPublicIdentityNo.patchValue("");
        tempPublicName.patchValue("");
        this.disableOrEnableForm();
    }
    disableOrEnableForm() {
        let tempMrPublicTypeCode = this.CustomerForm.get("MrPublicTypeCode");
        let tempPublicName = this.CustomerForm.get("PublicName");
        let tempPublicIdentityNo = this.CustomerForm.get("PublicIdentityNo");
        if (tempMrPublicTypeCode.value == "CMTY" || tempMrPublicTypeCode.value == "PRI") {
            tempPublicName.disable();
            tempPublicIdentityNo.disable();
            return;
        }
        tempPublicIdentityNo.enable();
        tempPublicName.enable();
    }
    CopyAddress() {
        //   let ReqByIdAndCodeObj = new GenericObj();
        //   ReqByIdAndCodeObj.Id = this.AppId;
        //   ReqByIdAndCodeObj.Code = CommonConstant.AddrTypeLegal;
        //   this.http.post(URLConstant.GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode, ReqByIdAndCodeObj).subscribe(
        //     (response: ResGetAppCustAddrByAppIdAndAddrTypeCodeObj) => {
        //       let legalAddrObj = new AddrObj();
        //       legalAddrObj.Addr = response.Addr;
        //       legalAddrObj.AreaCode1 = response.AreaCode1;
        //       legalAddrObj.AreaCode2 = response.AreaCode2;
        //       legalAddrObj.AreaCode3 = response.AreaCode3;
        //       legalAddrObj.AreaCode4 = response.AreaCode4;
        //       legalAddrObj.City = response.City;

        //       this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
        //       this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
        //       this.inputAddressObj.default = legalAddrObj;
        //     });
    }
}