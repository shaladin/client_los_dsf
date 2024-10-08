import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NGXToastrService } from "app/components/extra/toastr/toastr.service";
import { AdInsConstant } from "app/shared/AdInstConstant";
import { InputLookupObj } from "app/shared/model/input-lookup-obj.model";
import { environment } from "environments/environment";
import { CriteriaObj } from "app/shared/model/criteria-obj.model";
import { AddrObj } from "app/shared/model/addr-obj.model";
import { InputFieldObj } from "app/shared/model/input-field-obj.model";
import { UcgridfooterComponent } from "@adins/ucgridfooter";
import { UCSearchComponent } from "@adins/ucsearch";
import { UclookupgenericComponent } from "@adins/uclookupgeneric";
import { UcTempPagingObj } from "app/shared/model/temp-paging/uc-temp-paging-obj.model";
import { MouCustObj } from "app/shared/model/mou-cust-obj.model";
import { CommonConstant } from "app/shared/constant/CommonConstant";
import { URLConstant } from "app/shared/constant/URLConstant";
import { ExceptionConstant } from "app/shared/constant/ExceptionConstant";
import { InputAddressObj } from "app/shared/model/input-address-obj.model";
import { formatDate } from "@angular/common";
import { ListMouCustCollateralDocObj } from "app/shared/model/list-mou-cust-collateral-doc-obj.model";
import { MouCustCollateralDocObj } from "app/shared/model/mou-cust-collateral-doc-obj.model";
import { ChangeMouCustCollateralObj } from "app/shared/model/change-mou-cust-collateral-obj.model";
import { ChangeMouCustCollateralRegistrationObj } from "app/shared/model/change-mou-cust-collateral-registration-obj.model";
import { KeyValueObj } from "app/shared/model/key-value/key-value-obj.model";
import { AssetTypeSerialNoLabelObj } from "app/shared/model/serial-no/asset-type-serial-no-label-obj.model";
import { GenericListObj } from "app/shared/model/generic/generic-list-obj.model";
import { MouCustAddrObj } from "app/shared/model/mou-cust-addr-obj.model";
import { RegexService } from 'app/shared/services/regex.services';
import { CustomPatternObj } from "app/shared/model/custom-pattern-obj.model";
import { RefAttrGenerateObj } from "app/shared/model/ref-attr-generate.model";
import { RefAttrGenerate } from "app/components/sharing-components/ref-attr/ref-attr-form-generate/RefAttrGenerate.service";
import { MouCustCollateralAttrObj, ResMouCustCollateralAttrObj } from "app/shared/model/mou-cust-collateral-attr-obj.model";
import { ChangeMouCustObj } from "app/shared/model/change-mou/change-mou-obj.model";

@Component({
  selector: "app-change-mou-request-addcoll",
  templateUrl: "./change-mou-request-addcoll.component.html",
  providers: [NGXToastrService],
})
export class ChangeMouRequestAddcollComponent implements OnInit {
  @Input() MouCustId: number;
  @Input() ChangeMouCustId: number;
  @Input() ChangeMouTrxNo: string;
  @Input() ChangeMouStatus: string;
  @Input() MouType: string;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter<any>();
  @Output() modeDetail: EventEmitter<any> = new EventEmitter<any>();
  @Output() UpdateCollateral: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;
  @ViewChild("LookupCollateral") ucLookupCollateral: UclookupgenericComponent;

  listSelectedId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

  OwnerRelationshipObj: Array<KeyValueObj>;

  changeMouCustCollateralObj: ChangeMouCustCollateralObj;
  changeMouCustCollateralRegistrationObj: ChangeMouCustCollateralRegistrationObj;

  listCollateralData: Array<any> = new Array();
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;
  listMouCustAddrObj: Array<MouCustAddrObj> = new Array();
  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj;
  InputLookupProfessionObj: InputLookupObj;

  collateralObj: ChangeMouCustCollateralObj;
  collateralRegistrationObj: any;

  listCollExisting: Array<string> = new Array<string>();

  copyToLocationObj: Array<KeyValueObj> = [
    {
      Key: "LEGAL",
      Value: "Legal",
    },
  ];
  controlNameIdNo: string = 'OwnerIdNo'
  CollTypeList: Array<KeyValueObj>;
  IdTypeList: Array<KeyValueObj>;
  type: string;
  SerialNoList: Array<AssetTypeSerialNoLabelObj>;
  items: FormArray;
  isUsed: boolean = true;
  custNo: string;
  mouCustObj: MouCustObj = new MouCustObj();
  returnMouCust: MouCustObj = new MouCustObj();
  collateralUsedPrcnt: number;
  maxPrcnt: number = 100;
  isChangeMou: boolean = false;
  rowVersionChangeMouCustCollateral: string;
  rowVersionChangeMouCustCollateralRegistration: string;
  isAdd: boolean = false;
  resultPattern: Array<KeyValueObj>;
  customPattern: CustomPatternObj[];
  listMouCustCollateralDocObj: ListMouCustCollateralDocObj = new ListMouCustCollateralDocObj();
  mouCustCollateralDoc: MouCustCollateralDocObj = new MouCustCollateralDocObj();
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForLocAddr: InputAddressObj;
  OwnerTypeObj: Array<KeyValueObj> = new Array();
  OwnerProfessionObj: Array<KeyValueObj> = new Array();
  CustCompanyObj: any;
  ChangeMouCustObj: ChangeMouCustObj = new ChangeMouCustObj();
  readonly ownerTypePersonal: string = CommonConstant.CustTypePersonal;
  readonly ownerTypeCompany: string = CommonConstant.CustTypeCompany;

  AddCollDataForm = this.fb.group({});

  AddCollForm = this.fb.group({
    ChangeMouCustCollateralId: [""],
    MouCustCollateralRegistrationId: [""],
    CopyFromLegal: [""],
    AssetTypeCode: ["", [Validators.required]],
    CollateralValueAmt: [0, [Validators.required]],
    CollateralPrcnt: [
      0,
      [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(this.maxPrcnt)],
    ],
    FullAssetCode: [""],
    AssetCategoryCode: [""],
    OwnerProfessionCode: [''],
    OwnerName: ["", [Validators.required]],
    OwnerRelationship: ["", [Validators.required]],
    OwnerIdNo: ["", [Validators.required]],
    MrIdType: ["", [Validators.required]],
    Notes: [""],
    ListDoc: this.fb.array([]),
    RowVersionCollateral: [""],
    RowVersionCollateralRegistration: [""],
    items: this.fb.array([]),
    MrCollateralConditionCode: [""],
    ManufacturingYear: ["", [Validators.pattern("^[0-9]+$")]],
    CopyToOwnerLocation: [''],
    SelfOwner: [false],
    AttrContentObjs: this.fb.array([]),
    MrOwnerTypeCode: ['']
  });

  readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService, private regexService: RegexService
  ) {
    this.type = "Paging";
  }

  async ngOnInit() {
    this.customPattern = new Array<CustomPatternObj>();
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.showAllPhn = false;

    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showSubsection = false;
    this.inputAddressObjForLocAddr.showAllPhn = false;

    this.items = this.AddCollForm.get("items") as FormArray;
    await this.bindOwnerTypeObj();
    await this.bindCompanyTypeObj();
    this.bindUcLookup();
    this.initAddrObj();
    this.GetMouCustListAddrByMouCustId();
    await this.getInitPattern();
    this.bindMouData();
    this.bindUcAddToTempData();
    this.tempPagingObj.isReady = true;
    this.InputLookupProfessionObj = new InputLookupObj();
    this.InputLookupProfessionObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.InputLookupProfessionObj.isRequired = false;
    this.InputLookupProfessionObj.isReady = true;
  }

  bindUcAddToTempData() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url + "/v1";
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = "text";
    addCritCustNo.propName = "CU.CUST_NO";
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  bindMouData() {
    this.http.post(URLConstant.GetMouCustById, { Id: this.MouCustId }).toPromise().then(
    (response: MouCustObj) => {
      this.returnMouCust = response;
      this.custNo = this.returnMouCust.CustNo;
      this.AddCollForm.patchValue({
        MrOwnerTypeCode: this.returnMouCust.MrCustTypeCode
      });
    });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship, }).toPromise().then(
    (response) => {
      this.OwnerRelationshipObj = response[CommonConstant.ReturnObj];
      if (this.OwnerRelationshipObj.length > 0) {
        this.AddCollForm.patchValue({
          OwnerRelationship: this.OwnerRelationshipObj[0].Key,
          CopyFromLegal: this.copyToLocationObj[0].Key,
        });
      }
    });

    this.http.post(URLConstant.GetChangeMouCustCollateralByChangeMouCustId, { Id: this.ChangeMouCustId }).toPromise().then(
    (response: GenericListObj) => {
      if (response["ReturnObject"] != null || response["ReturnObject"].length > 0) {
        this.listCollateralData = response["ReturnObject"];
        this.isChangeMou = true;
      }
    });

    let assetObj = {};
    this.http.post(URLConstant.GetListAssetTypeByCode, assetObj).toPromise().then(
    (response) => {
      this.CollTypeList = response["ReturnObject"];
      this.AddCollForm.patchValue({
        AssetTypeCode: this.CollTypeList[0].Key,
      });
      this.onItemChange(this.CollTypeList[0].Key);
      this.updateUcLookup(this.CollTypeList[0].Value, true, this.type);
    });

    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType, }).toPromise().then(
    (response) => {
      this.IdTypeList = response["ReturnObject"];
      this.AddCollForm.patchValue({
        MrIdType: this.IdTypeList[0].Key,
      });
      this.setValidatorPattern(this.IdTypeList[0].Key);
    });

    this.http.post<ChangeMouCustObj>(URLConstant.GetChangeMouCustbyChangeMouTrxNo, { Code: this.ChangeMouTrxNo }).toPromise().then(
    (response) => {
      this.ChangeMouCustObj = response;
      console.log(this.ChangeMouCustObj);
    });
  }

  bindUcLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.isReady = true;
  }

  bindUcLookupExisting() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.isReady = false;
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.urlEnviPaging = environment.losUrl + "/v1";
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralExisting.json";
    this.inputLookupObj.isReady = true;
  }

  updateUcLookup(value, firstBind, type) {
    this.criteriaList = new Array();
    if (value != null && type != "AddExisting") {
      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = "A.IS_ACTIVE";
      this.criteriaObj.value = "1";
      this.criteriaList.push(this.criteriaObj);

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = "A.IS_FINAL";
      this.criteriaObj.value = "1";
      this.criteriaList.push(this.criteriaObj);

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = "B.ASSET_TYPE_CODE";
      this.criteriaObj.value = value;
      this.criteriaList.push(this.criteriaObj);
    } else {
      let arrMemberList = new Array();
      for (let index = 0; index < this.listCollateralData.length; index++) {
        arrMemberList.push(this.listCollateralData[index].CollateralNo);
      }

      if (arrMemberList.length != 0) {
        let addCritListCollateralNo = new CriteriaObj();
        addCritListCollateralNo.DataType = "numeric";
        addCritListCollateralNo.propName = "MCC.COLLATERAL_NO";
        addCritListCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
        addCritListCollateralNo.listValue = arrMemberList;
        this.criteriaList.push(addCritListCollateralNo);
      }

      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = "MCC.ASSET_TYPE_CODE";
      this.criteriaObj.value = value;
      this.criteriaList.push(this.criteriaObj);

      const criteriaMouCustIdObj = new CriteriaObj();
      criteriaMouCustIdObj.restriction = AdInsConstant.RestrictionNeq;
      criteriaMouCustIdObj.propName = "MC.MOU_CUST_ID";
      criteriaMouCustIdObj.value = this.MouCustId.toString();
      this.criteriaList.push(criteriaMouCustIdObj);

      const addCritCustNo = new CriteriaObj();
      addCritCustNo.DataType = 'text';
      addCritCustNo.propName = 'MC.CUST_NO';
      addCritCustNo.restriction = AdInsConstant.RestrictionEq;
      addCritCustNo.value = this.custNo;
      this.criteriaList.push(addCritCustNo);

      const addMouActive = new CriteriaObj();
      addMouActive.DataType = 'text';
      addMouActive.propName = 'MC.MOU_STAT';
      addMouActive.restriction = AdInsConstant.RestrictionEq;
      addMouActive.value = CommonConstant.STAT_CODE_ACT;
      this.criteriaList.push(addMouActive);
    }

    this.inputLookupObj.nameSelect = "";
    this.inputLookupObj.addCritInput = this.criteriaList;
    if (this.ucLookupCollateral != undefined) {
      if (!firstBind) this.ucLookupCollateral.setAddCritInput();
    }
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
  }

  ResetForm() {
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.showAllPhn = false;
    this.inputAddressObjForLocAddr = new InputAddressObj();
    this.inputAddressObjForLocAddr.showSubsection = false;
    this.inputAddressObjForLocAddr.showAllPhn = false;

    this.AddCollForm.patchValue({
      MouCustCollateralId: 0,
      MouCustCollateralRegistrationId: 0,
      CopyFromLegal: '',
      CopyToOwnerLocation: '',
      AssetTypeCode: this.CollTypeList[0].Key,
      CollateralValueAmt: 0,
      CollateralPrcnt: 0,
      FullAssetCode: '',
      AssetCategoryCode: '',
      OwnerName: '',
      OwnerRelationship: this.OwnerRelationshipObj[0].Key,
      OwnerIdNo: '',
      MrIdType: this.IdTypeList[0].Key,
      Notes: '',
      RowVersionCollateral: '',
      RowVersionCollateralRegistration: '',
      MrCollateralConditionCode: '',
      ManufacturingYear: ''
    });
  }
  isAddExistingOK: boolean = true;
  async open(pageType: string) {
    this.isAdd = true;
    this.ResetForm();
    this.AddCollForm.controls.MrCollateralConditionCode.disable();
    this.type = pageType;
    this.ChgMouCustCollateralId = 0;
    this.GenerateCollateralAttr(false, 0);
    if (pageType == 'AddExisting') {
      this.bindUcLookupExisting();
      await this.http.post(URLConstant.GetListMouCustCollateralActiveByCustNo, { TrxNo: this.custNo }).toPromise().then(
        (response) => {
          if(response["ReturnObject"].length < 1){
            this.isAddExistingOK = false;
          }
        }
      ).catch(
        (error) => {
          console.log(error);
        }
      );
      if(!this.isAddExistingOK){
        this.toastr.warningMessage(ExceptionConstant.NO_EXISTING_COLL);
        return;
      }
      let listDocExisting = this.AddCollForm.get("ListDoc") as FormArray;
      listDocExisting.reset();
      while (listDocExisting.length !== 0) {
        listDocExisting.removeAt(0);
      }

      
      this.AddCollForm.controls.CopyFromLegal.disable();
      this.AddCollForm.controls.CollateralValueAmt.disable();
      this.AddCollForm.controls.CollateralPrcnt.enable();
      this.AddCollForm.controls.FullAssetCode.disable();
      this.AddCollForm.controls.AssetCategoryCode.disable();
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.MrIdType.disable();
      this.AddCollForm.controls.Notes.disable();

      this.AddCollForm.controls.ManufacturingYear.disable();
      this.updateUcLookup(this.CollTypeList[0].Value, true, pageType);
    } else {
      this.bindUcLookup();
      this.updateUcLookup(this.CollTypeList[0].Value, true, pageType);
      this.AddCollForm.controls.CopyFromLegal.enable();
      this.AddCollForm.controls.AssetTypeCode.enable();
      this.AddCollForm.controls.CollateralValueAmt.enable();
      this.AddCollForm.controls.CopyToOwnerLocation.enable();
      this.AddCollForm.controls.CollateralPrcnt.enable();
      this.AddCollForm.controls.FullAssetCode.enable();
      this.AddCollForm.controls.AssetCategoryCode.enable();
      this.AddCollForm.controls.OwnerName.enable();
      this.AddCollForm.controls.OwnerRelationship.enable();
      this.AddCollForm.controls.OwnerIdNo.enable();
      this.AddCollForm.controls.MrIdType.enable();
      this.AddCollForm.controls.Notes.enable();
      this.AddCollForm.controls.ManufacturingYear.enable();
    }
    this.AddCollForm.updateValueAndValidity();
  }

  ChgMouCustCollateralId: number = 0;
  isAttrReady: boolean = false;
  IsDisable: boolean = false;
  refreshAttr() {
    this.GenerateCollateralAttr(true, this.ChgMouCustCollateralId);
  }

  readonly identifierAttr: string = "AttrContentObjs";
  ListAttrObjs: Array<RefAttrGenerateObj> = new Array();
  async GenerateCollateralAttr(isRefresh: boolean = false, ChgMouCustCollId: number = 0, isCopy: boolean = false) {
    let GenObj = !isCopy ? {
      ChangeMouCustCollateralId: ChgMouCustCollId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      IsRefresh: isRefresh
    } : {      
      MouCustCollateralId: ChgMouCustCollId,
      AssetTypeCode: this.AddCollForm.controls["AssetTypeCode"].value,
      IsRefresh: isRefresh
    };
    this.isAttrReady = false;
    this.IsDisable = false;
    this.ListAttrObjs = new Array();
    let urlApi: string = !isCopy ? URLConstant.GenerateChangeMouCollateralAttr : URLConstant.GenerateMouCollateralAttr;
    this.http.post(urlApi, GenObj).subscribe(
      (response: ResMouCustCollateralAttrObj) => {
        if (response.IsDiffWithRefAttr) {
          this.toastr.warningMessage(ExceptionConstant.REF_ATTR_CHANGE);
        }
        for (let index = 0; index < response.MouCustCollateralAttrObjs.length; index++) {
          const element = response.MouCustCollateralAttrObjs[index];
          const tempObj: RefAttrGenerateObj = {
            AttrCode: element.CollateralAttrCode,
            AttrGroup: element.AttrGroup,
            AttrInputType: element.AttrInputType,
            AttrLength: element.AttrLength,
            AttrName: element.CollateralAttrName,
            AttrQuestionValue: RefAttrGenerate.BindListQuestionByListString(element.AttrQuestionValue),
            AttrTypeCode: "",
            AttrValue: element.AttrValue,
            IsMandatory: element.IsMandatory,
            MasterTypeCode: element.RefAttrValue,
            PatternCode: element.PatternCode,
            PatternValue: element.PatternValue,
            RsvField1: "",
            RsvField2: "",
            RsvField3: "",
            RsvField4: "",
            RsvField5: "",
          };
          this.ListAttrObjs.push(tempObj);
        }
        if(isCopy) this.IsDisable = true;
        this.isAttrReady = true;
      });
  }

  BindExistingCollateralSavedData(listCollateralNo: any) {
    const addCritCollateralNo = new CriteriaObj();
    addCritCollateralNo.DataType = "text";
    addCritCollateralNo.propName = "CL.COLLATERAL_NO";
    addCritCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
    addCritCollateralNo.listValue = listCollateralNo;
    this.tempPagingObj.addCritInput.push(addCritCollateralNo);
  }

  initAddrObj() {
    this.initAddrLegalObj();
    this.initAddrLocationObj();
  }

  initAddrLegalObj() {
    this.legalAddrObj = new AddrObj();
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
  }

  initAddrLocationObj() {
    this.locationAddrObj = new AddrObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
  }

  getLookupCollateralTypeResponse(e) {
    if (this.type == "AddEdit") {
      this.AddCollForm.patchValue({
        FullAssetCode: e.FullAssetCode,
        FullAssetName: e.FullAssetName,
        AssetCategoryCode: e.AssetCategoryCode,
      });
    } else {
      this.http.post(URLConstant.GetMouCustCollateralDataExistingByCollateralNo, { TrxNo: e.CollateralNo }).subscribe(
        (response) => {
          this.collateralObj = response["MouCustCollateral"];
          this.collateralRegistrationObj =
            response["MouCustCollateralRegistration"];

          this.maxPrcnt = 100 - e.SumCollateralPrcnt;
          this.AddCollForm.controls.CollateralPrcnt.setValidators([
            Validators.required,
            Validators.min(CommonConstant.PrcntMinValue),
            Validators.max(this.maxPrcnt),
          ]);
          this.AddCollForm.controls.CollateralPrcnt.updateValueAndValidity();

          this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
          this.inputLookupObj.jsonSelect = this.collateralObj;

          this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, {
            Code: this.collateralObj.AssetTypeCode
          }).subscribe(
            (response: GenericListObj) => {
              while (this.items.length) {
                this.items.removeAt(0);
              }
              this.SerialNoList = response.ReturnObject;
              for (let i = 0; i < this.SerialNoList["length"]; i++) {
                let eachDataDetail = this.fb.group({
                  SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                  SerialNoValue: ["", Validators.required],
                  IsMandatory: [this.SerialNoList[i].IsMandatory],
                }) as FormGroup;
                this.items.push(eachDataDetail);
                if (this.items.controls[0] != null) {
                  this.items["controls"][0].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo1,
                  });
                }
                if (this.items.controls[1] != null) {
                  this.items["controls"][1].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo2,
                  });
                }
                if (this.items.controls[2] != null) {
                  this.items["controls"][2].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo3,
                  });
                }
                if (this.items.controls[3] != null) {
                  this.items["controls"][3].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo4,
                  });
                }
                if (this.items.controls[4] != null) {
                  this.items["controls"][4].patchValue({
                    SerialNoValue: this.collateralObj.SerialNo4,
                  });
                }
                this.items.controls[i]["controls"]["SerialNoValue"].disable();
              }
            });

          this.AddCollForm.patchValue({
            ChangeMouCustCollateralId: this.collateralObj.ChangeMouCustCollateralId,
            AssetTypeCode: this.collateralObj.AssetTypeCode,
            FullAssetCode: this.collateralObj.FullAssetCode,
            FullAssetName: this.collateralObj.FullAssetName,
            AssetCategoryCode: this.collateralObj.AssetCategoryCode,
            MrCollateralConditionCode: this.collateralObj.MrCollateralConditionCode,
            MrCollateralUsageCode: this.collateralObj.MrCollateralUsageCode,
            CollateralStat: this.collateralObj.CollateralStat,
            CollateralValueAmt: this.collateralObj.CollateralValueAmt,
            CollateralPrcnt: this.maxPrcnt,
            CollateralNotes: this.collateralObj.CollateralNotes,
            ManufacturingYear: this.collateralObj.ManufacturingYear,
            RowVersionCollateral: this.collateralObj.RowVersion,

            MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
            SelfOwner: this.collateralRegistrationObj.MrOwnerRelationshipCode == CommonConstant.SelfCustomer,
            OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode,
            OwnerName: this.collateralRegistrationObj.OwnerName,
            OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
            MrIdTypeCode: this.collateralRegistrationObj.MrIdType,
            OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
            Notes: this.collateralRegistrationObj.Notes,
            RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion,
          });
          this.AddCollForm.get("SelfOwner").disable();
          this.GenerateCollateralAttr(true, this.collateralObj["MouCustCollateralId"], true);
          this.setValidatorPattern(this.collateralRegistrationObj.MrIdTypeCode);
          this.legalAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
          this.legalAddrObj.City = this.collateralRegistrationObj.OwnerCity;
          this.legalAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
          this.legalAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
          this.legalAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
          this.legalAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
          if (this.collateralRegistrationObj.Phn1 != null)
            this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.Phn2 != null)
            this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.PhnArea1 != null)
            this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
          if (this.collateralRegistrationObj.PhnArea1 != null)
            this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

          this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = {
            Zipcode: this.collateralRegistrationObj.OwnerZipcode,
          };

          this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
          this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;
          this.inputAddressObjForLegalAddr.isReadonly = true;

          this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
          this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
          this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
          this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
          this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
          this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
          if (this.collateralRegistrationObj.Phn1 != null)
            this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.Phn2 != null)
            this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
          if (this.collateralRegistrationObj.PhnArea1 != null)
            this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
          if (this.collateralRegistrationObj.PhnArea1 != null)
            this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

          this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
          this.inputFieldLocationObj.inputLookupObj.jsonSelect = {
            Zipcode: this.collateralRegistrationObj.OwnerZipcode,
          };

          this.inputAddressObjForLocAddr.default = this.locationAddrObj;
          this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;

          this.OwnerTypeChange(this.collateralRegistrationObj.MrOwnerTypeCode);
          this.checkSelfOwnerColl();
          this.InputLookupProfessionObj.isDisable = true;
          this.InputLookupProfessionObj.isReady = true;
          this.onItemChange(this.collateralObj.AssetTypeCode, true, true, true);
        });
    }
  }

  onItemChange(
    value,
    isInit: boolean = false,
    isFromLookupEventCallback: boolean = false, isCopy: boolean = false
  ) {
    this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: value }).subscribe(
      (response: GenericListObj) => {
        if (!isFromLookupEventCallback) {
          while (this.items.length) {
            this.items.removeAt(0);
          }
          this.SerialNoList = response.ReturnObject;
          for (let i = 0; i < this.SerialNoList["length"]; i++) {
            let eachDataDetail = this.fb.group({
              SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
              SerialNoValue: [""],
              IsMandatory: [this.SerialNoList[i].IsMandatory],
            }) as FormGroup;
            this.items.push(eachDataDetail);
            if (this.SerialNoList[i].IsMandatory) {
              this.items.controls[i]["controls"]["SerialNoValue"].setValidators([Validators.required]);
              this.items.controls[i]["controls"]["SerialNoValue"].updateValueAndValidity();
            }
          }
        }

        let listDocExisting = this.AddCollForm.get("ListDoc") as FormArray;
        listDocExisting.reset();
        while (listDocExisting.length !== 0) {
          listDocExisting.removeAt(0);
        }
        this.getRefAssetDocList(isInit);
      });
    if (!isFromLookupEventCallback) {
      this.updateUcLookup(value, false, this.type);
    }
    if(!isCopy) this.GenerateCollateralAttr(false, this.ChgMouCustCollateralId);
  }

  SaveAddEdit() {
    this.setCollateralObjForSave();
    this.listMouCustCollateralDocObj.MouCustCollateralDocObj = new Array();

    for (let i = 0; i < this.AddCollForm.value.ListDoc["length"]; i++) {
      this.mouCustCollateralDoc = new MouCustCollateralDocObj();
      if (this.AddCollForm.value.ListDoc[i].IsReceived == null) {
        this.mouCustCollateralDoc.IsReceived = false;
      } else {
        this.mouCustCollateralDoc.IsReceived = this.AddCollForm.value.ListDoc[i].IsReceived;
      }

      this.mouCustCollateralDoc.DocCode = this.AddCollForm.value.ListDoc[i].DocCode;
      this.mouCustCollateralDoc.DocNo = this.AddCollForm.value.ListDoc[i].DocNo;
      this.mouCustCollateralDoc.ExpiredDt = this.AddCollForm.value.ListDoc[i].ACDExpiredDt;
      this.mouCustCollateralDoc.DocNotes = this.AddCollForm.value.ListDoc[i].DocNotes;
      this.listMouCustCollateralDocObj.MouCustCollateralDocObj.push(
        this.mouCustCollateralDoc
      );
    }

    let custCollObj = {
      ChangeMouCustCollateral: this.changeMouCustCollateralObj,
      ChangeMouCustCollateralRegistration: this.changeMouCustCollateralRegistrationObj,
      ListChangeMouCustCollateralDoc: this.listMouCustCollateralDocObj.MouCustCollateralDocObj,
      ListChangeMouCustCollaterals: this.SetCollateralAttr()
    };

    this.http.post(URLConstant.AddEditChangeMouCustCollateralData, custCollObj).subscribe(
      (response) => {
        this.AddCollForm.reset();
        this.toastr.successMessage(response["message"]);
        this.type = "Paging";
        this.ClearForm();
        this.UpdateCollateral.emit();
      });
  }

  SetCollateralAttr(): Array<MouCustCollateralAttrObj> {
    let tempList: Array<MouCustCollateralAttrObj> = new Array();
    let tempFormArray = this.AddCollForm.get(this.identifierAttr) as FormArray;
    for (let index = 0; index < tempFormArray.length; index++) {
      const element = tempFormArray.get(index.toString()).value;
      let tempObj: MouCustCollateralAttrObj = new MouCustCollateralAttrObj();
      tempObj.CollateralAttrCode = element["AttrCode"];
      tempObj.CollateralAttrName = element["AttrName"];
      tempObj.AttrValue = element["AttrValue"];
      tempList.push(tempObj);
    }
    return tempList;
  }

  setCollateralObjForSave() {
    this.changeMouCustCollateralObj = new ChangeMouCustCollateralObj();
    this.changeMouCustCollateralRegistrationObj = new ChangeMouCustCollateralRegistrationObj();

    if (this.collateralObj != null) {
      this.changeMouCustCollateralObj.ChangeMouCustCollateralId = this.collateralObj.ChangeMouCustCollateralId
      this.changeMouCustCollateralObj.ChangeMouCustId = this.collateralObj.ChangeMouCustId;
      this.changeMouCustCollateralRegistrationObj = this.collateralRegistrationObj;
    }

    this.changeMouCustCollateralObj.ChangeMouCustId = this.ChangeMouCustId;
    this.changeMouCustCollateralObj.MouCustId = this.MouCustId;
    this.changeMouCustCollateralObj.AssetTypeCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.changeMouCustCollateralObj.FullAssetCode = this.AddCollForm.controls.FullAssetCode.value;
    this.changeMouCustCollateralObj.FullAssetName = this.AddCollForm.controls.FullAssetName.value.value;
    this.changeMouCustCollateralObj.AssetCategoryCode = this.AddCollForm.controls.AssetCategoryCode.value;
    this.changeMouCustCollateralObj.MrCollateralConditionCode = CommonConstant.AssetConditionUsed;
    this.changeMouCustCollateralObj.MrCollateralUsageCode = CommonConstant.AssetUsageComm;
    this.changeMouCustCollateralObj.CollateralStat = CommonConstant.AssetConditionNew;

    if (this.items.controls[0] != null) {
      this.changeMouCustCollateralObj.SerialNo1 = this.items.controls[0]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[1] != null) {
      this.changeMouCustCollateralObj.SerialNo2 = this.items.controls[1]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[2] != null) {
      this.changeMouCustCollateralObj.SerialNo3 = this.items.controls[2]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[3] != null) {
      this.changeMouCustCollateralObj.SerialNo4 = this.items.controls[3]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[4] != null) {
      this.changeMouCustCollateralObj.SerialNo5 = this.items.controls[4]["controls"]["SerialNoValue"].value;
    }

    this.changeMouCustCollateralObj.CollateralValueAmt = this.AddCollForm.controls.CollateralValueAmt.value;
    this.changeMouCustCollateralObj.CollateralPrcnt = this.AddCollForm.controls.CollateralPrcnt.value;
    this.changeMouCustCollateralObj.CollateralPortionAmt = (this.AddCollForm.controls.CollateralValueAmt.value * this.AddCollForm.controls.CollateralPrcnt.value) / 100
    this.changeMouCustCollateralObj.CollateralNotes = this.AddCollForm.controls.Notes.value;
    this.changeMouCustCollateralObj.ManufacturingYear = this.AddCollForm.controls.ManufacturingYear.value;

    if (this.isAdd == true) {
      this.changeMouCustCollateralObj.ChangeMouCustCollateralId = 0;
    }

    //set changeMouCustCollateralRegistrationObj
    this.changeMouCustCollateralRegistrationObj.OwnerName = this.AddCollForm.controls.OwnerName.value;
    this.changeMouCustCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls.OwnerIdNo.value;
    this.changeMouCustCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls.MrIdType.value;
    this.changeMouCustCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.changeMouCustCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.changeMouCustCollateralRegistrationObj.OwnerProfessionCode = this.AddCollForm.controls.OwnerProfessionCode.value;
    this.changeMouCustCollateralRegistrationObj.Notes = this.AddCollForm.controls.Notes.value;
    this.changeMouCustCollateralRegistrationObj.MrOwnerTypeCode = this.AddCollForm.controls.MrOwnerTypeCode.value;

    this.changeMouCustCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["legalAddr"]["controls"].Addr.value;
    this.changeMouCustCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["legalAddr"]["controls"].City.value;
    this.changeMouCustCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.changeMouCustCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.changeMouCustCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.changeMouCustCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.changeMouCustCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.value;

    this.changeMouCustCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["locationAddr"]["controls"].Addr.value;
    this.changeMouCustCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["locationAddr"]["controls"].City.value;
    this.changeMouCustCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["locationAddrZipcode"]["controls"].value.value;
    this.changeMouCustCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode1.value;
    this.changeMouCustCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode2.value;
    this.changeMouCustCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode3.value;
    this.changeMouCustCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode4.value;
  }

  copyToLocation() {
    let tempSelectedCopyAddr = this.AddCollForm.get("CopyFromLegal").value;
    let tempAddr: MouCustAddrObj = this.listMouCustAddrObj.find(x => x.MrCustAddrTypeCode == tempSelectedCopyAddr);
    if (tempAddr == null) return;
    this.locationAddrObj.Addr = tempAddr.Addr;
    this.locationAddrObj.AreaCode1 = tempAddr.AreaCode1;
    this.locationAddrObj.AreaCode2 = tempAddr.AreaCode2;
    this.locationAddrObj.AreaCode3 = tempAddr.AreaCode3;
    this.locationAddrObj.AreaCode4 = tempAddr.AreaCode4;
    this.locationAddrObj.City = tempAddr.City;
    this.locationAddrObj.Fax = tempAddr.Fax;
    this.locationAddrObj.FaxArea = tempAddr.FaxArea;
    this.locationAddrObj.Phn1 = tempAddr.Phn1;
    this.locationAddrObj.Phn2 = tempAddr.Phn2;
    this.locationAddrObj.PhnArea1 = tempAddr.PhnArea1;
    this.locationAddrObj.PhnArea2 = tempAddr.PhnArea2;
    this.locationAddrObj.PhnExt1 = tempAddr.PhnExt1;
    this.locationAddrObj.PhnExt2 = tempAddr.PhnExt2;
    this.locationAddrObj.SubZipcode = tempAddr.SubZipcode;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = tempAddr.Zipcode;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: tempAddr.Zipcode };

    this.inputAddressObjForLocAddr.default = this.locationAddrObj;
    this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
  }

  editData(ChangeMouCustCollId: number) {
    this.ChgMouCustCollateralId = ChangeMouCustCollId;
    this.changeMouCustCollateralObj = new ChangeMouCustCollateralObj();
    this.changeMouCustCollateralObj.ChangeMouCustCollateralId = ChangeMouCustCollId;
    this.isAdd = false;
    this.type = "AddEdit";
    this.http.post(URLConstant.GetChangeMouCustCollateralDataForUpdateByChangeMouCustCollateralId, { Id: ChangeMouCustCollId }).subscribe(
      (response) => {
        this.collateralObj = response["ChangeMouCustCollateral"];
        this.collateralRegistrationObj = response["ChangeMouCustCollateralRegistration"];

        this.rowVersionChangeMouCustCollateral = this.collateralObj.RowVersion;
        this.rowVersionChangeMouCustCollateralRegistration = this.collateralRegistrationObj.RowVersion;

        this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
        this.inputLookupObj.jsonSelect = this.collateralObj;

        this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.collateralObj.AssetTypeCode }).subscribe(
          (response: GenericListObj) => {
            while (this.items.length) {
              this.items.removeAt(0);
            }
            this.SerialNoList = response.ReturnObject;
            for (let i = 0; i < this.SerialNoList["length"]; i++) {
              let eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: ["", Validators.required],
                IsMandatory: [this.SerialNoList[i].IsMandatory],
              }) as FormGroup;
              this.items.push(eachDataDetail);

              if (
                this.isUsed == true &&
                this.items.controls[i]["controls"]["IsMandatory"].value == true
              ) {
                this.items.controls[i]["controls"]["SerialNoValue"].setValidators([Validators.required]);
                this.items.controls[i]["controls"]["SerialNoValue"].updateValueAndValidity();
              } else {
                this.items.controls[i]["controls"]["SerialNoValue"].clearValidators();
                this.items.controls[i]["controls"]["SerialNoValue"].updateValueAndValidity();
              }


              if (this.items.controls[0] != null) {
                this.items["controls"][0].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo1,
                });
              }
              if (this.items.controls[1] != null) {
                this.items["controls"][1].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo2,
                });
              }
              if (this.items.controls[2] != null) {
                this.items["controls"][2].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo3,
                });
              }
              if (this.items.controls[3] != null) {
                this.items["controls"][3].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
              if (this.items.controls[4] != null) {
                this.items["controls"][4].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
            }
          });

        this.AddCollForm.patchValue({
          ChangeMouCustCollateralId: this.collateralObj.ChangeMouCustCollateralId,
          AssetTypeCode: this.collateralObj.AssetTypeCode,
          FullAssetCode: this.collateralObj.FullAssetCode,
          FullAssetName: this.collateralObj.FullAssetName,
          AssetCategoryCode: this.collateralObj.AssetCategoryCode,
          MrCollateralConditionCode: this.collateralObj.MrCollateralConditionCode,
          MrCollateralUsageCode: this.collateralObj.MrCollateralUsageCode,
          CollateralStat: this.collateralObj.CollateralStat,
          SerialNo1: this.collateralObj.SerialNo1,
          SerialNo2: this.collateralObj.SerialNo2,
          SerialNo3: this.collateralObj.SerialNo3,
          SerialNo4: this.collateralObj.SerialNo4,
          SerialNo5: this.collateralObj.SerialNo5,
          CollateralValueAmt: this.collateralObj.CollateralValueAmt,
          CollateralPrcnt: this.collateralObj.CollateralPrcnt,
          CollateralNotes: this.collateralObj.CollateralNotes,
          ManufacturingYear: this.collateralObj.ManufacturingYear,
          RowVersionCollateral: this.collateralObj.RowVersion,
          MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdTypeCode: this.collateralRegistrationObj.MrIdType,
          OwnerRelationship: this.collateralRegistrationObj.MrOwnerRelationshipCode,
          Notes: this.collateralRegistrationObj.Notes,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion,
          OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode,
          SelfOwner: this.collateralRegistrationObj.MrOwnerRelationshipCode == "SELF" ? true : false,
          MrOwnerTypeCode: this.collateralRegistrationObj.MrOwnerTypeCode
        });

        this.CopyUserForSelfOwner();
        this.OwnerTypeChange(this.collateralRegistrationObj.MrOwnerTypeCode);

        this.GenerateCollateralAttr(false, ChangeMouCustCollId);
        this.checkSelfOwnerColl();
        this.setValidatorPattern(this.collateralRegistrationObj.MrIdTypeCode);
        this.updateUcLookup(this.collateralObj.AssetTypeCode, false, "AddEdit");
        this.getRefAssetDocList(true);
        this.AddCollForm.controls.MrCollateralConditionCode.disable();
        this.AddCollForm.updateValueAndValidity();
        
        this.legalAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.legalAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.legalAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.legalAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.legalAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.legalAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null)
          this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null)
          this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null)
          this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null)
          this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = {
          Zipcode: this.collateralRegistrationObj.OwnerZipcode,
        };

        this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
        this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;

        this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
        this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
        this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
        this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
        this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
        this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null)
          this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null)
          this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null)
          this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null)
          this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = {
          Zipcode: this.collateralRegistrationObj.OwnerZipcode,
        };

        this.inputAddressObjForLocAddr.default = this.locationAddrObj;
        this.inputAddressObjForLocAddr.inputField = this.inputFieldLocationObj;
      });
  }

  Cancel() {
    this.clearList();
    this.ClearForm();
    this.type = "Paging";
  }

  ClearForm() {
    this.AddCollForm = this.fb.group({
      MouCustCollateralId: [""],
      MouCustCollateralRegistrationId: [""],
      CopyFromLegal: [""],
      AssetTypeCode: ["", [Validators.required]],
      CollateralValueAmt: [0, [Validators.required]],
      CollateralPrcnt: [0, [Validators.required, Validators.min(CommonConstant.PrcntMinValue), Validators.max(100)],],
      FullAssetCode: [""],
      AssetCategoryCode: [""],
      OwnerName: ["", [Validators.required]],
      OwnerRelationship: ["", [Validators.required]],
      OwnerIdNo: ["", [Validators.required]],
      MrIdType: ["", [Validators.required]],
      Notes: [""],
      ListDoc: this.fb.array([]),
      SerialNo1: [""],
      SerialNo2: [""],
      SerialNo3: [""],
      SerialNo4: [""],
      SerialNo5: [""],
      RowVersionCollateral: [""],
      RowVersionCollateralRegistration: [""],
      items: this.fb.array([]),
      MrCollateralConditionCode: [""],
      ManufacturingYear: ["", [Validators.pattern("^[0-9]+$")]],
      CopyToOwnerLocation: [''],
      OwnerProfessionCode: [''],
      SelfOwner: [false],
      AttrContentObjs: this.fb.array([]),
      MrOwnerTypeCode: ['']
    });
    this.AddCollForm.updateValueAndValidity();

    this.inputFieldLocationObj.inputLookupObj.nameSelect = "";
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: "" };
    this.inputFieldLegalObj.inputLookupObj.nameSelect = "";
    this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: "" };

    this.items = this.AddCollForm.get("items") as FormArray;
    this.InputLookupProfessionObj.nameSelect = '';
    this.InputLookupProfessionObj.jsonSelect = { ProfessionName: '' };
    this.InputLookupProfessionObj.isDisable = false;
    this.bindUcLookup();
    this.initAddrObj();
    this.bindMouData();
  }

  SaveExistingCollateral() {
    let collateralPortionAmt: number = (this.AddCollForm.controls.CollateralValueAmt.value * this.AddCollForm.controls.CollateralPrcnt.value) / 100;
    let existingChangeMouCustCollateralObj = {
      ChangeMouCustCollateral: {
        CollateralNo: this.collateralObj.CollateralNo,
        ChangeMouCustId: this.ChangeMouCustId,
        CollateralPrcnt: this.AddCollForm.controls.CollateralPrcnt.value,
        CollateralPortionAmt: collateralPortionAmt
      }
    }

    this.http.post(URLConstant.AddExistingChangeMouCustCollateralData, existingChangeMouCustCollateralObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.type = "Paging";
        this.bindMouData();
        this.ClearForm();
      });
  }

  clearList() {
    this.listSelectedId = [];
    this.tempPagingObj.addCritInput = new Array<CriteriaObj>();

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = "text";
    addCritCustNo.propName = "CU.CUST_NO";
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  delete(ChangeMouCustCollId: number) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.http.post(URLConstant.DeleteChangeMouCustCollateral, { Id: ChangeMouCustCollId }).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.bindMouData();
        });
    }
  }

  next() {
    let sumCollateralValue: number = 0;
    for (let i = 0; i < this.listCollateralData.length; i++) {
      if (this.listCollateralData[i].CollateralPortionAmt != null) {
        sumCollateralValue += this.listCollateralData[i].CollateralPortionAmt;
      }
    }

    if (this.returnMouCust.PlafondType == CommonConstant.MOU_CUST_PLAFOND_TYPE_BOAMT) {
      if (sumCollateralValue < this.ChangeMouCustObj.PlafondAmt) {
        this.toastr.warningMessage(ExceptionConstant.COLL_VALUE_CANNOT_LESS_THAN_PLAFOND_AMT);
        return;
      }
    }
    this.ResponseMouAddColl.emit({ StatusCode: "200" });
  }

  back() {
    this.toastr.warningMessage("Cancel Change MOU Collateral");
    this.modeDetail.emit({ mode: "edit" });
    this.ResponseMouAddColl.emit({ StatusCode: "-1" });
  }

  getRefAssetDocList(isInit: boolean) {
    this.http.post(URLConstant.GetRefAssetDocList, { Code: this.AddCollForm.controls.AssetTypeCode.value }).subscribe(
      (response) => {
        console.log("getRefAssetDocList: " + JSON.stringify(response));
        if (response[CommonConstant.ReturnObj].length > 0) {
          let ListDoc = this.AddCollForm.get("ListDoc") as FormArray;
          if (ListDoc.length > 0) {
            while (ListDoc.length !== 0) {
              ListDoc.removeAt(0)
            }
          }
          for (let i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
            let assetDocumentDetail = this.fb.group({
              DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
              AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
              IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
              IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
              IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
              IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
              DocNo: response[CommonConstant.ReturnObj][i].DocNo,
              ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
              DocNotes: response[CommonConstant.ReturnObj][i].DocNotes,
            }) as FormGroup;
            ListDoc.push(assetDocumentDetail);
          }
        }
        if (isInit) {
          if (this.type == "AddExisting") {
            this.setMouCustCollateralDoc(
              this.collateralObj.ChangeMouCustCollateralId
            );
          } else {
            this.setMouCustCollateralDoc(
              this.changeMouCustCollateralObj.ChangeMouCustCollateralId
            );
          }
        } else {
          if (this.type == "AddExisting") {
            let listDocExisting = this.AddCollForm.get("ListDoc") as FormArray;
            while (listDocExisting.length !== 0) {
              listDocExisting.removeAt(0);
            }
          }
        }
      });
  }

  setMouCustCollateralDoc(ChangeMouCustCollateralId: number = 0) {
    this.http.post(URLConstant.GetChangeMouCustCollateralDocByChangeMouCustCollateralId, { Id: ChangeMouCustCollateralId }).subscribe(
      (response) => {
        let ChangeMouCustCollateralDocs = new Array();
        ChangeMouCustCollateralDocs = response["ReturnObject"];
        if (ChangeMouCustCollateralDocs != null && ChangeMouCustCollateralDocs["length"] > 0) {
          for (let i = 0; i < ChangeMouCustCollateralDocs.length; i++) {
            this.AddCollForm.controls.ListDoc["controls"][i].patchValue({
              DocNo: ChangeMouCustCollateralDocs[i].DocNo,
              DocNotes: ChangeMouCustCollateralDocs[i].DocNotes,
              ACDExpiredDt: formatDate(ChangeMouCustCollateralDocs[i].ExpiredDt, "yyyy-MM-dd", "en-US"),
              IsReceived: ChangeMouCustCollateralDocs[i].IsReceived,
            });
          }
        } else {
          if (this.type == "AddExisting") {
            let listDocExisting = this.AddCollForm.get("ListDoc") as FormArray;
            while (listDocExisting.length !== 0) {
              listDocExisting.removeAt(0);
            }
          }
        }
      });
  }

  async CopyUserForSelfOwner() {
    if (this.AddCollForm.controls.SelfOwner.value) {
      await this.http.post(URLConstant.GetMouCustByMouCustId, { Id: this.MouCustId }).toPromise().then(
        async (response) => {
          let CustObj = response["MouCustObj"];
          let CustAddrObj = response["MouCustAddrLegalObj"];
          this.CustPersonalJobDataObj = response["MouCustPersonalJobDataObj"];
          this.CustCompanyObj = response["MouCustCompanyObj"];

          this.AddCollForm.patchValue({
            OwnerName: CustObj.CustName,
            OwnerRelationship: "SELF",
            MrIdType: CustObj.MrIdTypeCode,
            OwnerIdNo: CustObj.IdNo,
            OwnerProfessionCode: typeof(response['MouCustPersonalJobDataObj']) != 'undefined' ? this.CustPersonalJobDataObj.MrProfessionCode : this.CustCompanyObj.MrCompanyTypeCode,
            // OwnerMobilePhnNo: typeof (response['AppCustPersonalObj']) != 'undefined' ? response['AppCustPersonalObj']['MobilePhnNo1'] : ''
            MrOwnerTypeCode: CustObj.MrCustTypeCode
          })
          // let OwnerAddrObj = CustAddrObj;
          this.inputFieldLegalObj.inputLookupObj.nameSelect = CustAddrObj.Zipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: CustAddrObj.Zipcode };
          this.inputAddressObjForLegalAddr.default = CustAddrObj;
          this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;
          this.InputLookupProfessionObj.nameSelect = "";
          this.InputLookupProfessionObj.jsonSelect = "";

          if(typeof(response['MouCustPersonalJobDataObj']) != 'undefined'){
            await this.GetProfessionName(this.CustPersonalJobDataObj.MrProfessionCode);
            this.InputLookupProfessionObj.nameSelect = this.CustPersonalJobDataObj.MrProfessionName;
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: this.CustPersonalJobDataObj.MrProfessionName };
          }
        }
      )
    }
    this.checkSelfOwnerColl();
  }
  GetProfession(event) {
    this.AddCollForm.patchValue({
      OwnerProfessionCode: event.ProfessionCode
    });
  }

  CustPersonalJobDataObj: any;
  async GetProfessionName(professionCode: string) {
    await this.http.post(URLConstant.GetRefProfessionByCode, { Code: professionCode }).toPromise().then(
      (response) => {
        this.CustPersonalJobDataObj.MrProfessionName = response['ProfessionName'];
      }
    ).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  isSelfCust: boolean = false;
  checkSelfOwnerColl() {
    if (this.AddCollForm.controls.SelfOwner.value) {
      this.AddCollForm.controls.OwnerName.disable();
      this.AddCollForm.controls.OwnerRelationship.disable();
      // this.AddCollForm.controls.OwnerMobilePhnNo.disable();
      this.AddCollForm.controls.MrIdType.disable();
      this.AddCollForm.controls.OwnerIdNo.disable();
      this.AddCollForm.controls.legalAddr.disable();
      this.isSelfCust = true
      this.InputLookupProfessionObj.isDisable = true;
      this.AddCollForm.controls.OwnerProfessionCode.disable();
      this.AddCollForm.controls.MrOwnerTypeCode.disable();
      return;
    }
    this.InputLookupProfessionObj.isDisable = false;
    this.AddCollForm.controls.OwnerName.enable();
    this.AddCollForm.controls.OwnerRelationship.enable();
    // this.AddCollForm.controls.OwnerMobilePhnNo.enable();
    this.AddCollForm.controls.MrIdType.enable();
    this.AddCollForm.controls.OwnerIdNo.enable();
    this.AddCollForm.controls.legalAddr.enable();
    this.AddCollForm.controls.OwnerProfessionCode.enable();
    this.AddCollForm.controls.MrOwnerTypeCode.enable();
    this.isSelfCust = false
  }

  copyToLocationOwner() {
    let tempSelectedCopyAddr = this.AddCollForm.get("CopyToOwnerLocation").value;
    let tempAddr: MouCustAddrObj = this.listMouCustAddrObj.find(x => x.MrCustAddrTypeCode == tempSelectedCopyAddr);
    if (tempAddr == null) return;
    this.legalAddrObj.Addr = tempAddr.Addr;
    this.legalAddrObj.AreaCode1 = tempAddr.AreaCode1;
    this.legalAddrObj.AreaCode2 = tempAddr.AreaCode2;
    this.legalAddrObj.AreaCode3 = tempAddr.AreaCode3;
    this.legalAddrObj.AreaCode4 = tempAddr.AreaCode4;
    this.legalAddrObj.City = tempAddr.City;
    this.legalAddrObj.Fax = tempAddr.Fax;
    this.legalAddrObj.FaxArea = tempAddr.FaxArea;
    this.legalAddrObj.Phn1 = tempAddr.Phn1;
    this.legalAddrObj.Phn2 = tempAddr.Phn2;
    this.legalAddrObj.PhnArea1 = tempAddr.PhnArea1;
    this.legalAddrObj.PhnArea2 = tempAddr.PhnArea2;
    this.legalAddrObj.PhnExt1 = tempAddr.PhnExt1;
    this.legalAddrObj.PhnExt2 = tempAddr.PhnExt2;
    this.legalAddrObj.SubZipcode = tempAddr.SubZipcode;

    this.inputFieldLegalObj.inputLookupObj.nameSelect = tempAddr.Zipcode;
    this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: tempAddr.Zipcode };

    this.inputAddressObjForLegalAddr.default = this.legalAddrObj;
    this.inputAddressObjForLegalAddr.inputField = this.inputFieldLegalObj;
  }

  GetMouCustListAddrByMouCustId() {
    this.http.post(URLConstant.GetMouCustListAddrByMouCustId, { Id: this.MouCustId }).subscribe(
      (response: GenericListObj) => {
        this.listMouCustAddrObj = response.ReturnObject;
      }
    )
  }

  async getInitPattern() {
    await this.regexService.getListPattern().subscribe(
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
        }
      }
    );
  }

  ChangeIdType(IdType: string) {
    this.setValidatorPattern(IdType);
  }

  setValidatorPattern(idTypeValue) {
    let pattern: string = '';
    if (idTypeValue != undefined) {
      if (this.resultPattern != undefined) {
        let result = this.resultPattern.find(x => x.Key == idTypeValue)
        if (result != undefined) {
          pattern = result.Value;
        }
      }
    }
    this.setValidator(pattern);
  }

  setValidator(pattern: string) {
    if (pattern != undefined) {
      this.AddCollForm.controls[this.controlNameIdNo].clearValidators();
      this.AddCollForm.controls[this.controlNameIdNo].updateValueAndValidity();
      this.AddCollForm.controls[this.controlNameIdNo].setValidators([Validators.required, Validators.pattern(pattern)]);
      this.AddCollForm.controls[this.controlNameIdNo].updateValueAndValidity();
    }
  }

  async bindOwnerTypeObj() {
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustType }).subscribe(
      (response) => {
        this.OwnerTypeObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async bindCompanyTypeObj(){
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCompanyType }).toPromise().then(
      (response) => {
        this.OwnerProfessionObj = response[CommonConstant.ReturnObj];
      }
    );
  }

  async OwnerTypeChange(OwnerType: string, IsOwnerTypeChanged: boolean = false) {
    if (OwnerType == CommonConstant.CustTypePersonal) {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });

        this.InputLookupProfessionObj.nameSelect = "";
        this.InputLookupProfessionObj.jsonSelect = { ProfessionName: "" };
      } else {
        await this.http.post(URLConstant.GetRefProfessionByCode, { Code: this.collateralRegistrationObj.OwnerProfessionCode }).toPromise().then(
          (response) => {
            this.InputLookupProfessionObj.nameSelect = response["ProfessionName"];
            this.InputLookupProfessionObj.jsonSelect = { ProfessionName: response["ProfessionName"] };
          }
        );
      }
    } else {
      if (IsOwnerTypeChanged) {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: ""
        });
      } else {
        this.AddCollForm.patchValue({
          OwnerProfessionCode: this.collateralRegistrationObj.OwnerProfessionCode
        });
      }
    }
  }
}
