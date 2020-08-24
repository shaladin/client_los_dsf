import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { formatDate } from '@angular/common';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-collateral-fctr',
  templateUrl: './collateral-fctr.component.html'
})
export class CollateralFctrComponent implements OnInit {
  @ViewChild('LookupCollateral') ucLookupCollateral: UclookupgenericComponent;
  @Input() AppId: number;

  AppCollateralId: number;
  viewObj: any;
  appCollateralObj: AppCollateralObj;
  appCollateralObjRegistration: AppCollateralRegistrationObj;
  OwnerRelationshipObj: any;
  closeResult: string;
  listCollateralData: any;
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;
  ownerAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;
  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj;
  copyFromLegal: any;
  collateralObj: any;
  collateralRegistrationObj: any;
  listCollateralDataOwnByAppId: any;
  copyToLocationObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  CollTypeList: any;
  IdTypeList: any;
  modal: any;
  type: string = "Add";

  inputLookupObjCollateral: InputLookupObj;

  listCollExisting: any;

  AppCollateralDocs: any = [];

  AddCollForm = this.fb.group({
    AppCollateralId: [''],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW'],
    SerialNo1: ['', Validators.required],
    SerialNo2: ['', Validators.required],
    SerialNo3: ['', Validators.required],
    CollateralValueAmt: ['', Validators.required],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    CollateralPrcnt: ['', Validators.required],
    IsMainCollateral: true,
    ManufacturingYear: ['', Validators.pattern("^[0-9]*$")],
    CollateralNo: [''],
    AssetTaxDt: [''],
    UserName: ['', Validators.required],
    MrUserRelationshipCode: [''],
    OwnerMobilePhnNo: ['', Validators.required],
    OwnerName: ['', Validators.required],
    OwnerIdNo: ['', Validators.required],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    items: this.fb.array([]),
    ListAttr: this.fb.array([]),
    CopyFromLegal: [''],
    AppAttrName: ['']
  });
  UsageCodeList: any;
  ConditionCodeList: any;
  AgrmntId: any;
  items: any;
  appAssetObj: any;
  AppAssetId: any;
  AssetTypeCode: any;
  appCollateralDataObj: AppCollateralDataObj;
  listAppCollateralDocObj: ListAppCollateralDocObj;
  appCollateralDoc: AppCollateralDocObj;
  listRefAppAttr: any;

  HiddenState: string = "true";
  inputAddressObjForLegal: InputAddressObj;
  inputAddressObjForLoc: any;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.AppAssetId = params['AppAssetId']
    });
  }

  ngOnInit() {
    this.inputAddressObjForLegal = new InputAddressObj();
    this.inputAddressObjForLegal.showSubsection = false;
    this.inputAddressObjForLegal.showPhn1 = false;
    this.inputAddressObjForLegal.showPhn2 = false;
    this.inputAddressObjForLegal.showPhn3 = false;
    this.inputAddressObjForLegal.showFax = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showPhn1 = false;
    this.inputAddressObjForLoc.showPhn2 = false;
    this.inputAddressObjForLoc.showPhn3 = false;
    this.inputAddressObjForLoc.showFax = false;

    this.type = "Add";
    this.bindUcLookup();
    this.initAddrObj();
    this.bindAppData();
    var appAssetobj = {
      AgrmntId: this.AgrmntId
    }

    this.items = this.AddCollForm.get('items') as FormArray;

    this.http.post(URLConstant.GetAppAssetByAgrmntId, appAssetobj).subscribe(
      (response) => {
        this.appAssetObj = response;
        this.AppAssetId = this.appAssetObj.AppAssetId;
        this.AssetTypeCode = this.appAssetObj.AssetTypeCode;

        this.AddCollForm.patchValue({
          AssetTypeCode: this.appAssetObj.AssetTypeCode
        });

        var assetDocListobj = {
          AssetTypeCode: this.AddCollForm.controls.AssetTypeCode.value
        }
        var attrListobj = {
          AssetTypeCode: this.AddCollForm.controls.AssetTypeCode.value
        }

        this.http.post(URLConstant.GetRefAssetDocList, assetDocListobj).subscribe(
          (response) => {
            if (response[CommonConstant.ReturnObj].length > 0) {
              for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
                var assetDocumentDetail = this.fb.group({
                  DocCode: response[CommonConstant.ReturnObj][i].AssetDocCode,
                  AssetDocName: response[CommonConstant.ReturnObj][i].AssetDocName,
                  IsValueNeeded: response[CommonConstant.ReturnObj][i].IsValueNeeded,
                  IsMandatoryNew: response[CommonConstant.ReturnObj][i].IsMandatoryNew,
                  IsMandatoryUsed: response[CommonConstant.ReturnObj][i].IsMandatoryUsed,
                  IsReceived: response[CommonConstant.ReturnObj][i].IsReceived,
                  DocNo: response[CommonConstant.ReturnObj][i].DocNo,
                  ACDExpiredDt: response[CommonConstant.ReturnObj][i].ACDExpiredDt,
                  DocNotes: response[CommonConstant.ReturnObj][i].DocNotes
                }) as FormGroup;
                this.items.push(assetDocumentDetail);
              }
            }
          }
        );
      }
    );
  }

  bindAppData() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.OwnerRelationshipObj = response[CommonConstant.ReturnObj];
        if (this.type != "Edit") {
          if (this.OwnerRelationshipObj.length > 0) {
            this.AddCollForm.patchValue({
              MrOwnerRelationshipCode: this.OwnerRelationshipObj[0].Key,
              MrUserRelationshipCode: this.OwnerRelationshipObj[0].Key,
              CopyFromLegal: this.copyToLocationObj[0].Key
            });
          }
        }
      }
    );

    var attrobj = {};
    this.http.post(URLConstant.GetListRefAppAttrCollateral, attrobj).subscribe(
      (response) => {
        this.listRefAppAttr = response[CommonConstant.ReturnObj];
        for (let i = 0; i < this.listRefAppAttr["length"]; i++) {
          var Attr = this.fb.group({
            AppAttrValue: this.listRefAppAttr[i].AppAttrValue,
          }) as FormGroup;
          // this.ListAttr.push(Attr);
        }
      }
    )

    var appIdObj = { AppId: this.AppId }
    this.http.post(URLConstant.GetAppCollateralByAppCollateralId, appIdObj).subscribe(
      (response) => {
        this.listCollateralData = response[CommonConstant.ReturnObj];
      })

    var assetObj = {};
    this.http.post(URLConstant.GetListKeyValueByCode, assetObj).subscribe(
      (response) => {
        this.CollTypeList = response[CommonConstant.ReturnObj];
        if (this.type != "Edit") {
          this.AddCollForm.patchValue({
            AssetTypeCode: this.CollTypeList[0].Key
          });
          this.onItemChange(this.AddCollForm.controls.AssetTypeCode.value)
        }
      })

    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.IdTypeList = response[CommonConstant.ReturnObj];
        if (this.type != "Edit") {
          this.AddCollForm.patchValue({
            MrIdTypeCode: this.IdTypeList[0].Key
          });
        }
      })

    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.ConditionCodeList = response[CommonConstant.ReturnObj];
        if (this.type != "Edit") {
          this.AddCollForm.patchValue({
            MrCollateralConditionCode: this.ConditionCodeList[1].Key
          });
        }
      })


    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.UsageCodeList = response[CommonConstant.ReturnObj];
        if (this.type != "Edit") {
          this.AddCollForm.patchValue({
            MrCollateralUsageCode: this.UsageCodeList[0].Key
          });
        }
        this.AddCollForm.controls.MrCollateralConditionCode.disable();
      })

  }

  CopyUser() {
    this.AddCollForm.patchValue({
      OwnerName: this.AddCollForm.controls.UserName.value,
      MrOwnerRelationshipCode: this.AddCollForm.controls.MrUserRelationshipCode.value
    })
  }

  bindUcLookup() {//
    this.inputLookupObjCollateral = new InputLookupObj();
    this.inputLookupObjCollateral.isRequired = false;
    this.inputLookupObjCollateral.urlJson = "./assets/uclookup/NAP/lookupAppCollateral.json";
    this.inputLookupObjCollateral.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObjCollateral.urlEnviPaging = environment.losUrl;
    this.inputLookupObjCollateral.pagingJson = "./assets/uclookup/NAP/lookupAppCollateral.json";
    this.inputLookupObjCollateral.genericJson = "./assets/uclookup/NAP/lookupAppCollateral.json";

    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.addCritInput = new Array();

    if (this.collateralObj == undefined) {
      this.inputLookupObj.jsonSelect = { FullAssetName: "" }
    } else {
      this.inputLookupObj.jsonSelect = { FullAssetName: this.collateralObj.FullAssetName }
      this.onItemChange(this.collateralObj.AssetTypeCode);
    }

    this.inputLookupObj.isReady = true;
  }

  SetHiddenState(enjiForm: NgForm) {
    enjiForm.resetForm();
    this.AddCollForm.patchValue({
      CollateralValueAmt: 0
    })


    this.type = "Add";

    this.collateralRegistrationObj = undefined;
    this.collateralObj = undefined;

    this.initAddrObj();
    this.bindAppData();
  }

  initAddrObj() {
    this.initAddrLegalObj();
    this.initAddrLocationObj();
  }

  initAddrLegalObj() {
    this.ownerAddrObj = new AddrObj();
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
  }

  initAddrLocationObj() {
    this.locationAddrObj = new AddrObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();
  }

  getLookupCollateralTypeResponse(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });
  }

  getLookupAppCollateralResponse(event) {
    var AppCollateralIdObj = { AppCollateralId: event.AppCollateralId }
    var AppCollateralObj: any;
    this.http.post(URLConstant.GetAppCollateralByAppCollateralId, AppCollateralIdObj).subscribe(
      (response) => {
        AppCollateralObj = response;

        this.AddCollForm.patchValue({
          AppAssetId: AppCollateralObj.AppAssetId,
          AppCollateralId: AppCollateralObj.AppCollateralId,
          AppId: AppCollateralObj.AppId,
          AssetCategoryCode: AppCollateralObj.AssetCategoryCode,
          AssetTaxDt: formatDate(AppCollateralObj.AssetTaxDt, 'yyyy-MM-dd', 'en-US'),
          AssetTypeCode: AppCollateralObj.AssetTypeCode,
          CollateralNo: AppCollateralObj.CollateralNo,
          CollateralNotes: AppCollateralObj.CollateralNotes,
          CollateralPrcnt: AppCollateralObj.CollateralPrcnt,
          CollateralSeqNo: AppCollateralObj.CollateralSeqNo,
          CollateralStat: "EXISTING",
          CollateralValueAmt: AppCollateralObj.CollateralValueAmt,
          FullAssetCode: AppCollateralObj.FullAssetCode,
          FullAssetName: AppCollateralObj.FullAssetName,
          IsMainCollateral: AppCollateralObj.FullAssetName.IsMainCollateral,
          ManufacturingYear: AppCollateralObj.ManufacturingYear,
          MrCollateralConditionCode: AppCollateralObj.MrCollateralConditionCode,
          MrCollateralUsageCode: AppCollateralObj.MrCollateralUsageCode,
          SerialNo1: AppCollateralObj.SerialNo1,
          SerialNo2: AppCollateralObj.SerialNo2,
          SerialNo3: AppCollateralObj.SerialNo3,
        });
        this.inputLookupObj.nameSelect = AppCollateralObj.FullAssetName
      });
    var AppCollateralRegistration: any;
    this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, AppCollateralIdObj).subscribe(
      (response) => {

        AppCollateralRegistration = response;

        this.AddCollForm.patchValue({
          OwnerName: AppCollateralRegistration.OwnerName,
          MrIdTypeCode: AppCollateralRegistration.MrIdTypeCode,
          OwnerIdNo: AppCollateralRegistration.OwnerIdNo,
          OwnerMobilePhnNo: AppCollateralRegistration.OwnerMobilePhnNo,
          MrOwnerRelationshipCode: AppCollateralRegistration.MrOwnerRelationshipCode,
          UserName: AppCollateralRegistration.UserName,
          MrUserRelationshipCode: AppCollateralRegistration.MrUserRelationshipCode,
          CollateralNotes: AppCollateralRegistration.CollateralNotes
        })

        this.locationAddrObj = new AddrObj();
        this.locationAddrObj.Addr = AppCollateralRegistration.LocationAddr;
        this.locationAddrObj.AreaCode1 = AppCollateralRegistration.LocationAreaCode1;
        this.locationAddrObj.AreaCode2 = AppCollateralRegistration.LocationAreaCode2;
        this.locationAddrObj.AreaCode3 = AppCollateralRegistration.LocationAreaCode3;
        this.locationAddrObj.AreaCode4 = AppCollateralRegistration.LocationAreaCode4;
        this.locationAddrObj.City = AppCollateralRegistration.LocationCity;
        this.inputFieldLocationObj.inputLookupObj.nameSelect = AppCollateralRegistration.LocationZipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.LocationZipcode };
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;

        this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, AppCollateralIdObj).subscribe(
          (response) => {
            this.AppCollateralDocs = response["AppCollateralDocs"];
            if (this.AppCollateralDocs["length"] > 0) {
              for (var i = 0; i < this.AppCollateralDocs["length"]; i++) {
                this.AddCollForm.controls.items["controls"][i].patchValue({
                  DocNo: this.AppCollateralDocs[i].DocNo,
                  DocNotes: this.AppCollateralDocs[i].DocNotes,
                  ACDExpiredDt: formatDate(this.AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                  IsReceived: this.AppCollateralDocs[i].IsReceived
                })
              }
            }
          }
        );

        this.ownerAddrObj = new AddrObj();
        this.ownerAddrObj.Addr = AppCollateralRegistration.OwnerAddr;
        this.ownerAddrObj.AreaCode1 = AppCollateralRegistration.OwnerAreaCode1;
        this.ownerAddrObj.AreaCode2 = AppCollateralRegistration.OwnerAreaCode2;
        this.ownerAddrObj.AreaCode3 = AppCollateralRegistration.OwnerAreaCode3;
        this.ownerAddrObj.AreaCode4 = AppCollateralRegistration.OwnerAreaCode4;
        this.ownerAddrObj.City = AppCollateralRegistration.OwnerCity;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = AppCollateralRegistration.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.OwnerZipcode };
        this.inputAddressObjForLegal.default = this.ownerAddrObj;
        this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
      });

  }

  onItemChange(value) {
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = 'B.ASSET_TYPE_CODE';
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = value;
    arrAddCrit.push(addCrit);
    this.inputLookupObj.addCritInput = arrAddCrit;
    this.ucLookupCollateral.setAddCritInput();
  }

  SaveForm(enjiForm: NgForm) {
    this.appCollateralDataObj = new AppCollateralDataObj();
    this.setCollateralInfo();
    this.setCollateralOwner();
    this.setCollateralLocation();
    this.setCollateralPercentage();

    this.listAppCollateralDocObj = new ListAppCollateralDocObj();
    this.listAppCollateralDocObj.AppCollateralDocObj = new Array();

    for (var i = 0; i < this.AddCollForm.value.items["length"]; i++) {
      this.appCollateralDoc = new AppCollateralDocObj();
      this.appCollateralDoc.DocCode = this.AddCollForm.value.items[i].DocCode;
      this.appCollateralDoc.IsReceived = this.AddCollForm.value.items[i].IsReceived;
      this.appCollateralDoc.DocNo = this.AddCollForm.value.items[i].DocNo;
      this.appCollateralDoc.ExpiredDt = this.AddCollForm.value.items[i].ACDExpiredDt;
      this.appCollateralDoc.DocNotes = this.AddCollForm.value.items[i].DocNotes;
      this.listAppCollateralDocObj.AppCollateralDocObj.push(this.appCollateralDoc);
    }
    this.appCollateralDataObj.ListAppCollateralDocObj = this.listAppCollateralDocObj.AppCollateralDocObj;

    if (this.type == 'Add') {
      this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
        (response) => {

          this.HiddenState = "true";
          this.toastr.successMessage(response["message"]);
          enjiForm.resetForm();
          this.AddCollForm.patchValue({
            CollateralValueAmt: 0
          })
        });
    }
    else {
      this.http.post(URLConstant.AddEditAllCollateralDataFactoring, this.appCollateralDataObj).subscribe(
        (response) => {

          this.HiddenState = "true";
          this.toastr.successMessage(response["message"]);
          enjiForm.resetForm();
          this.AddCollForm.patchValue({
            CollateralValueAmt: 0
          })
        });
    }
    this.bindAppData();
    this.type = "Add";
  }

  setCollateralInfo() {//
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    // this.appCollateralDataObj.AppCollateralObj.AppAssetId = this.AppAssetId;
    this.appCollateralDataObj.AppCollateralObj.AppAssetId = null;
    this.appCollateralDataObj.AppCollateralObj.AgrmntId = this.AgrmntId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value.value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo1 = this.AddCollForm.controls["SerialNo1"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo2 = this.AddCollForm.controls["SerialNo2"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo3 = this.AddCollForm.controls["SerialNo3"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["CollateralNotes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    if (this.AddCollForm.controls["CollateralStat"].value == null) {
      this.appCollateralDataObj.AppCollateralObj.CollateralStat = "NEW";
    } else {
      this.appCollateralDataObj.AppCollateralObj.CollateralStat = this.AddCollForm.controls["CollateralStat"].value;
    }
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = this.AddCollForm.controls["MrCollateralConditionCode"].value;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = this.AddCollForm.controls["MrCollateralUsageCode"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    this.appCollateralDataObj.AppCollateralObj.ManufacturingYear = this.AddCollForm.controls["ManufacturingYear"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTaxDt = this.AddCollForm.controls["AssetTaxDt"].value;
    this.appCollateralDataObj.AppCollateralObj.IsMainCollateral = true;
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;

    if (this.type == 'Edit') {
      this.appCollateralDataObj.AppCollateralObj.AppCollateralId = this.collateralObj.AppCollateralId,
        this.appCollateralDataObj.AppCollateralObj.RowVersion = this.collateralObj.RowVersion,
        this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.collateralObj.AppCollateralRegistrationId,
        this.appCollateralDataObj.AppCollateralRegistrationObj.AppCollateralId = this.collateralRegistrationObj.AppCollateral,
        this.appCollateralDataObj.AppCollateralRegistrationObj.RowVersion = this.collateralRegistrationObj.RowVersion
    }

  }

  setCollateralOwner() {//
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls["MrOwnerRelationshipCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls["MrUserRelationshipCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.UserName = this.AddCollForm.controls["UserName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerName = this.AddCollForm.controls["OwnerName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls["MrIdTypeCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls["OwnerIdNo"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["ownerAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["ownerAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["ownerAddrObjZipcode"]["controls"].value.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AddCollForm.controls["OwnerMobilePhnNo"].value;
  }

  setCollateralLocation() {//
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["locationAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["locationAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["locationAddrObjZipcode"]["controls"].value.value;
  }

  setCollateralPercentage() {//
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
  }

  copyToLocation() {//
    this.locationAddrObj.Addr = this.AddCollForm.controls["ownerAddrObj"]["controls"].Addr.value;
    this.locationAddrObj.AreaCode1 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode1.value;
    this.locationAddrObj.AreaCode2 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode2.value;
    this.locationAddrObj.AreaCode3 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode3.value;
    this.locationAddrObj.AreaCode4 = this.AddCollForm.controls["ownerAddrObj"]["controls"].AreaCode4.value;
    this.locationAddrObj.City = this.AddCollForm.controls["ownerAddrObj"]["controls"].City.value;
    this.locationAddrObj.Fax = this.AddCollForm.controls["ownerAddrObj"]["controls"].Fax.value;
    this.locationAddrObj.FaxArea = this.AddCollForm.controls["ownerAddrObj"]["controls"].FaxArea.value;
    this.locationAddrObj.Phn1 = this.AddCollForm.controls["ownerAddrObj"]["controls"].Phn1.value;
    this.locationAddrObj.Phn2 = this.AddCollForm.controls["ownerAddrObj"]["controls"].Phn2.value;
    this.locationAddrObj.PhnArea1 = this.AddCollForm.controls["ownerAddrObj"]["controls"].PhnArea1.value;
    this.locationAddrObj.PhnArea2 = this.AddCollForm.controls["ownerAddrObj"]["controls"].PhnArea2.value;
    this.locationAddrObj.PhnExt1 = this.AddCollForm.controls["ownerAddrObj"]["controls"].PhnExt1.value;
    this.locationAddrObj.PhnExt2 = this.AddCollForm.controls["ownerAddrObj"]["controls"].PhnExt2.value;
    this.locationAddrObj.SubZipcode = this.AddCollForm.controls["ownerAddrObj"]["controls"].SubZipcode.value;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["ownerAddrObjZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["ownerAddrObjZipcode"]["controls"].value.value };
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
  }

  async editData(AppCollateralId) {
    this.HiddenState = "false";

    this.type = "Edit";

    var collObj = {
      AppCollateralId: AppCollateralId
    }
    await this.http.post(URLConstant.GetAppCollateralAndRegistrationByAppCollateralId, collObj).toPromise().then(
      (response) => {
        this.collateralObj = response['AppCollateral'];
        this.collateralRegistrationObj = response['AppCollateralRegistration'];

        this.AddCollForm.patchValue({
          AppCollateralId: this.collateralObj.AppCollateralId,
          AssetTypeCode: this.collateralObj.AssetTypeCode,
          FullAssetCode: this.collateralObj.FullAssetCode,
          AssetCategoryCode: this.collateralObj.AssetCategoryCode,
          MrCollateralConditionCode: this.collateralObj.MrCollateralConditionCode,
          MrCollateralUsageCode: this.collateralObj.MrCollateralUsageCode,
          CollateralStat: this.collateralObj.CollateralStat,
          SerialNo1: this.collateralObj.SerialNo1,
          SerialNo2: this.collateralObj.SerialNo2,
          SerialNo3: this.collateralObj.SerialNo3,
          CollateralValueAmt: this.collateralObj.CollateralValueAmt,
          CollateralNotes: this.collateralObj.CollateralNotes,
          AssetTaxDt: formatDate(this.collateralObj.AssetTaxDt, 'yyyy-MM-dd', 'en-US'),
          CollateralPrcnt: this.collateralObj.CollateralPrcnt,
          IsMainCollateral: this.collateralObj.IsMainCollateral,
          ManufacturingYear: this.collateralObj.ManufacturingYear,
          RowVersionCollateral: this.collateralObj.RowVersion,

          AppCollateralRegistrationId: this.collateralRegistrationObj.AppCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdTypeCode: this.collateralRegistrationObj.MrIdTypeCode,
          OwnerMobilePhnNo: this.collateralRegistrationObj.OwnerMobilePhnNo,
          MrOwnerRelationshipCode: this.collateralRegistrationObj.MrOwnerRelationshipCode,
          UserName: this.collateralRegistrationObj.UserName,
          MrUserRelationshipCode: this.collateralRegistrationObj.MrUserRelationshipCode,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        this.locationAddrObj = new AddrObj();
        this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
        this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
        this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
        this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
        this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
        this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
        this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.LocationZipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.LocationZipcode };
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
        this.ownerAddrObj = new AddrObj();
        this.ownerAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.ownerAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.ownerAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.ownerAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.ownerAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        this.ownerAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };
        this.inputAddressObjForLegal.default = this.ownerAddrObj;
        this.inputAddressObjForLegal.inputField = this.inputFieldLegalObj;
        this.bindUcLookup();
      })
  }

  Cancel() {
    this.HiddenState = "true"
    this.inputLookupObj.isReady = false;
  }

  delete(AppCustCollId) {
    var appCollObj = { AppCollateralId: AppCustCollId };
    this.http.post(URLConstant.DeleteAppCollateral, appCollObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
      });
  }

  outputValue(event) {
    if (event == "false") {
      this.HiddenState = "false";
    } else {
      this.editData(event)
    }
  }
}
