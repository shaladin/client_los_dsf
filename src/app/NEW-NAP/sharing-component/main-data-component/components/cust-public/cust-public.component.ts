import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { ShareholderPublicObj } from 'app/shared/model/AppCust/Shareholder/ShareholderPublicObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { UcDropdownListConstant, UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMappingCodeObj.Model';
import { ReqRefMasterByTypeCodeAndMasterCodeObj } from 'app/shared/model/RefMaster/ReqRefMasterByTypeCodeAndMasterCodeObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { ResGetAppCustAddrByAppIdAndAddrTypeCodeObj } from 'app/shared/model/Response/NAP/CustMainData/ResGetAppCustAddrByAppIdAndAddrTypeCodeObj.model';
import { UcAddressObj } from 'app/shared/model/UcAddressObj.Model';
import { CustSetData } from '../CustSetData.Service';

@Component({
  selector: 'app-cust-public',
  templateUrl: './cust-public.component.html',
})
export class CustPublicComponent implements OnInit {

  @Input() AppId: number = 0;
  @Input() AppCustCompanyId: number = 0;
  @Input() AppCustCompanyMgmntShrholderId: number = 0;
  @Input() tempTotalSharePrct: number = 0;
  @Output() outputCancel: EventEmitter<string> = new EventEmitter();

  CustomerForm: FormGroup = this.fb.group({});
  inputAddressObj: InputAddressObj = new InputAddressObj();
  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: NGXToastrService,) { }

  readonly RefMasterTypeCodePublicType: string = CommonConstant.RefMasterTypeCodePublicType;

  IsReady: boolean = false;
  async ngOnInit() {
    this.InitData();
    this.initDdlRefMaster(this.RefMasterTypeCodePublicType, null, true);
    await this.GetExisting();
    this.IsReady = true;
  }

  positionSlikLookUpObj: InputLookupObj = new InputLookupObj();
  ClearForm(item: ShareholderPublicObj = null) {
    this.CustomerForm = this.fb.group({
      MrPositionSlikCode: [item == null ? '' : item.MrPositionSlikCode, Validators.required],
      MrPublicTypeCode: [item == null ? '' : item.MrPublicTypeCode, Validators.required],
      PublicName: [item == null ? '' : item.PublicName, Validators.required],
      PublicIdentityNo: [item == null ? '' : item.PublicIdentityNo, Validators.required],
      SharePrcnt: [item == null ? 0 : item.SharePrcnt, [Validators.required, Validators.min(0), Validators.max(100)]],
      IsActive: [item == null ? false : item.IsActive, Validators.required],
    });

    if (item != null) {
      //#region patch address
      let inputFieldObj = new InputFieldObj();
      inputFieldObj.inputLookupObj = new InputLookupObj();
      inputFieldObj.inputLookupObj.nameSelect = item.PublicZipcode;
      inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: item.PublicZipcode };
      let tempUcAddObj: UcAddressObj = new UcAddressObj();
      tempUcAddObj.AreaCode1 = item.PublicAreaCode1;
      tempUcAddObj.AreaCode2 = item.PublicAreaCode2;
      tempUcAddObj.AreaCode3 = item.PublicAreaCode3;
      tempUcAddObj.AreaCode4 = item.PublicAreaCode4;
      tempUcAddObj.Addr = item.PublicAddr;
      tempUcAddObj.City = item.PublicCity;
      this.inputAddressObj.default = tempUcAddObj;
      this.inputAddressObj.inputField = inputFieldObj;
      //#endregion

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
    this.inputAddressObj = CustSetData.BindSetLegalAddr();
    this.positionSlikLookUpObj = CustSetData.BindLookupPositionSlik();
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

  tempExisting: ShareholderPublicObj = new ShareholderPublicObj();
  isExisting: boolean = false;
  async GetExisting() {
    if (this.AppCustCompanyMgmntShrholderId == 0) return;
    await this.http.post(URLConstant.GetAppCustCompanyMgmntShrholdersByAppCustCompanyMgmntShrholderId, { Id: this.AppCustCompanyMgmntShrholderId }).toPromise().then(
      (response: ShareholderPublicObj) => {
        this.tempExisting = response;
        this.ClearForm(response);
        this.isExisting = true;
      }
    )
  }

  SaveForm() {
    let tempForm = this.CustomerForm.getRawValue();
    let reqSubmitObj: ShareholderPublicObj = this.tempExisting;

    reqSubmitObj.AppId = this.AppId;
    reqSubmitObj.AppCustCompanyId = this.AppCustCompanyId;
    reqSubmitObj.PublicName = tempForm["PublicName"];
    reqSubmitObj.MrPositionSlikCode = tempForm["MrPositionSlikCode"];
    reqSubmitObj.MrPublicTypeCode = tempForm["MrPublicTypeCode"];
    reqSubmitObj.PublicIdentityNo = tempForm["PublicIdentityNo"];
    reqSubmitObj.SharePrcnt = tempForm["SharePrcnt"];
    reqSubmitObj.IsActive = tempForm["IsActive"];

    if (reqSubmitObj.IsActive) {
      let tempTotalSharePrctTobeAdd = this.tempTotalSharePrct + reqSubmitObj.SharePrcnt;
      if (tempTotalSharePrctTobeAdd > 100) {
        this.toastr.warningMessage(ExceptionConstant.TOTAL_SHARE_CAN_NOT_100);
        return;
      }
    }
    reqSubmitObj.PublicAddr = tempForm["UcAddress"]["Addr"];
    reqSubmitObj.PublicAreaCode1 = tempForm["UcAddress"]["AreaCode1"];
    reqSubmitObj.PublicAreaCode2 = tempForm["UcAddress"]["AreaCode2"];
    reqSubmitObj.PublicAreaCode3 = tempForm["UcAddress"]["AreaCode3"];
    reqSubmitObj.PublicAreaCode4 = tempForm["UcAddress"]["AreaCode4"];
    reqSubmitObj.PublicCity = tempForm["UcAddress"]["City"];
    reqSubmitObj.PublicZipcode = tempForm["UcAddressZipcode"]["value"];

    this.http.post(this.SetUrlApi(), reqSubmitObj).subscribe(
      (response) => {
        this.Cancel();
      }
    )
  }

  SetUrlApi(): string {
    let urlApi: string = URLConstant.AddAppCustCompanyMgmntShrholderPublic;
    if (this.AppCustCompanyMgmntShrholderId != 0) urlApi = URLConstant.EditAppCustCompanyMgmntShrholderPublic;
    return urlApi;
  }

  //#region Change
  Cancel() {
    this.outputCancel.emit();
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
    let ReqByIdAndCodeObj = new GenericObj();
    ReqByIdAndCodeObj.Id = this.AppId;
    ReqByIdAndCodeObj.Code = CommonConstant.AddrTypeLegal;
    this.http.post(URLConstant.GetAppCustAddrCustomerByAppIdAndMrAddrTypeCode, ReqByIdAndCodeObj).subscribe(
      (response: ResGetAppCustAddrByAppIdAndAddrTypeCodeObj) => {
        let legalAddrObj = new AddrObj();
        legalAddrObj.Addr = response.Addr;
        legalAddrObj.AreaCode1 = response.AreaCode1;
        legalAddrObj.AreaCode2 = response.AreaCode2;
        legalAddrObj.AreaCode3 = response.AreaCode3;
        legalAddrObj.AreaCode4 = response.AreaCode4;
        legalAddrObj.City = response.City;

        this.inputAddressObj.inputField.inputLookupObj.nameSelect = response.Zipcode;
        this.inputAddressObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response.Zipcode };
        this.inputAddressObj.default = legalAddrObj;
      });
  }
  //#endregion
}
