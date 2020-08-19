import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { AppCollateralDataObj } from 'app/shared/model/AppCollateralDataObj.Model';
import { ListAppCollateralDocObj } from 'app/shared/model/ListAppCollateralDocObj.Model';
import { AppCollateralDocObj } from 'app/shared/model/AppCollateralDocObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { UCSearchComponent } from '@adins/ucsearch';
import { formatDate } from '@angular/common';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';

@Component({
  selector: 'app-collateral-add-edit-single',
  templateUrl: './collateral-add-edit-single.component.html'
})
export class CollateralAddEditSingleComponent implements OnInit {

  @Input() AppId: number;
  @Output() outputTab: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

  IsOpenExisting: boolean = false;
  AppCollateralDocs: any = [];
  inputObj: any;
  arrCrit: any[];
  checkboxAll = false;
  listSelectedId: any;
  tempListId: any;
  orderByKey: any;
  orderByValue: any;
  pageNow: number;
  pageSize: number;
  apiUrl: any;
  totalData: any;
  resultData: any;
  tempData: any;
  arrAddCrit: any[];
  viewObj: any;
  Data = [];

  appCollateralObj: AppCollateralObj;
  appCollateralObjRegistration: AppCollateralRegistrationObj;

  OwnerRelationshipObj: any;

  closeResult: string;
  listCollateralData: any;
  inputLookupObj: InputLookupObj;
  inputLookupObjCollateral: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  OwnerAddrObj: AddrObj = new AddrObj();
  inputFieldLegalObj: InputFieldObj = new InputFieldObj();

  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj = new InputFieldObj();

  copyFromLegal: any;

  collateralObj: any;
  collateralRegistrationObj: any;
  listCollExisting: any;

  copyToLocationObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  CollTypeList: any;
  IdTypeList: any;
  modal: any;
  type: any;
  AddCollDataForm = this.fb.group({
  })
  AddCollForm = this.fb.group({
    AppCollateralId: [''],
    FullAssetCode: ['', Validators.required],
    MrCollateralConditionCode: ['', Validators.required],
    MrCollateralUsageCode: ['', Validators.required],
    CollateralStat: ['NEW', Validators.required],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    CollateralValueAmt: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    AssetTypeCode: ['', Validators.required],
    AssetCategoryCode: ['', Validators.required],
    AssetTaxCode: [''],
    CollateralNotes: [''],
    CollateralPrcnt: [''],
    IsMainCollateral: true,
    ManufacturingYear: ['', Validators.pattern("^[0-9]*$")],
    CollateralNo: [''],
    AssetTaxDt: [''],
    UserName: [''],
    MrUserRelationshipCode: [''],
    OwnerMobilePhnNo: [''],
    OwnerName: [''],
    OwnerIdNo: [''],
    MrIdTypeCode: [''],
    MrOwnerRelationshipCode: [''],
    Notes: [''],
    items: this.fb.array([]),
    ListAttr: this.fb.array([]),
    OwnerRelationship: [''],
    MrIdType: [''],
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
  ListAttr: any;
  AddrObj: AddrObj;

  AppCollateralId: any;
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.AppAssetId = params['AppAssetId']
    });
  }
  async ngOnInit() {
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showPhn1 = false;
    this.inputAddressObjForOwner.showPhn2 = false;
    this.inputAddressObjForOwner.showPhn3 = false;
    this.inputAddressObjForOwner.showFax = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showPhn1 = false;
    this.inputAddressObjForLoc.showPhn2 = false;
    this.inputAddressObjForLoc.showPhn3 = false;
    this.inputAddressObjForLoc.showFax = false;

    await this.bindUcLookup();
    await this.bindUcSearch();
    await this.bindAppData();


    this.GetListAppCollateralByAppId();
    var appAssetobj = {
      AppId: this.AppId
    }

    this.items = this.AddCollForm.get('items') as FormArray;
    this.ListAttr = this.AddCollForm.get('ListAttr') as FormArray;

    this.http.post(URLConstant.GetAppAssetByAppId, appAssetobj).subscribe(
      (response) => {
        this.appAssetObj = response;
        this.AppAssetId = this.appAssetObj.AppAssetId;
        this.AgrmntId = this.appAssetObj.AgrmntId;
        this.AssetTypeCode = this.appAssetObj.AssetTypeCode;

        this.AddCollForm.patchValue({
          AssetTypeCode: this.appAssetObj.AssetTypeCode
        });

        var assetDocListobj = {
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

        var AppIdObj = {
          AppId: this.AppId
        }
        this.http.post(URLConstant.GetAppCollateralByAppId, AppIdObj).subscribe(
          (response) => {
            var AppCollateralObj: any;

            AppCollateralObj = response;
            this.AppCollateralId = AppCollateralObj.AppCollateralId;
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
              CollateralStat: AppCollateralObj.CollateralStat,
              CollateralValueAmt: AppCollateralObj.CollateralValueAmt,
              FullAssetCode: AppCollateralObj.FullAssetCode,
              FullAssetName: AppCollateralObj.FullAssetName,
              IsMainCollateral: AppCollateralObj.IsMainCollateral,
              ManufacturingYear: AppCollateralObj.ManufacturingYear,
              MrCollateralConditionCode: AppCollateralObj.MrCollateralConditionCode,
              MrCollateralUsageCode: AppCollateralObj.MrCollateralUsageCode,
              SerialNo1: AppCollateralObj.SerialNo1,
              SerialNo2: AppCollateralObj.SerialNo2,
              SerialNo3: AppCollateralObj.SerialNo3,
            });
            this.inputLookupObj.nameSelect = AppCollateralObj.FullAssetName
            this.changeSerialNoValidators(AppCollateralObj.MrCollateralConditionCode.value);
            var AppCollateralRegistration: any;
            this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, AppCollateralObj).subscribe(
              (response) => {
                AppCollateralRegistration = response;

                this.AddCollForm.patchValue({
                  OwnerName: AppCollateralRegistration.OwnerName,
                  MrIdType: AppCollateralRegistration.MrIdTypeCode,
                  OwnerIdNo: AppCollateralRegistration.OwnerIdNo,
                  OwnerMobilePhnNo: AppCollateralRegistration.OwnerMobilePhnNo,
                  MrOwnerRelationshipCode: AppCollateralRegistration.MrOwnerRelationshipCode,
                  UserName: AppCollateralRegistration.UserName,
                  MrUserRelationshipCode: AppCollateralRegistration.MrUserRelationshipCode,
                  Notes: AppCollateralRegistration.Notes
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
                this.OwnerAddrObj = new AddrObj();
                this.OwnerAddrObj.Addr = AppCollateralRegistration.OwnerAddr;
                this.OwnerAddrObj.AreaCode1 = AppCollateralRegistration.OwnerAreaCode1;
                this.OwnerAddrObj.AreaCode2 = AppCollateralRegistration.OwnerAreaCode2;
                this.OwnerAddrObj.AreaCode3 = AppCollateralRegistration.OwnerAreaCode3;
                this.OwnerAddrObj.AreaCode4 = AppCollateralRegistration.OwnerAreaCode4;
                this.OwnerAddrObj.City = AppCollateralRegistration.OwnerCity;

                this.inputFieldLegalObj.inputLookupObj.nameSelect = AppCollateralRegistration.OwnerZipcode;
                this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.OwnerZipcode };
                this.inputAddressObjForOwner.default = this.OwnerAddrObj;
                this.inputAddressObjForOwner.inputField = this.inputFieldLegalObj;
              });
            var Obj2 = {
              AppCollateralId: this.AppCollateralId
            }
            this.http.post(URLConstant.GetListAppCollateralDocsByAppCollateralId, Obj2).subscribe(
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
          });
      }
    );
  }

  bindAppData() {
    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeCustPersonalRelationship };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.OwnerRelationshipObj = response[CommonConstant.ReturnObj];
        if (this.OwnerRelationshipObj.length > 0) {
          this.AddCollForm.patchValue({
            OwnerRelationship: this.OwnerRelationshipObj[0].Key,
            CopyFromLegal: this.copyToLocationObj[0].Key
          });
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
          this.ListAttr.push(Attr);
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
        this.AddCollForm.patchValue({
          AssetTypeCode: this.CollTypeList[0].Key
        });
      })

    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeIdType };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.IdTypeList = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          MrIdType: this.IdTypeList[0].Key
        });
      })

    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetCondition };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.ConditionCodeList = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          MrCollateralConditionCode: this.ConditionCodeList[0].Key
        });
      })


    var refMasterObj = { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeAssetUsage };
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.UsageCodeList = response[CommonConstant.ReturnObj];
        this.AddCollForm.patchValue({
          MrCollateralUsageCode: this.UsageCodeList[0].Key
        });
      })

  }

  bindUcLookup() {
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

    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.IS_ACTIVE';
    this.criteriaObj.value = "1";
    this.criteriaList.push(this.criteriaObj);
  }

  bindUcSearch() {
    this.arrCrit = new Array();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();

    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/ucpaging/searchAppCollateral.json";
    this.inputObj.enviromentUrl = environment.losUrl;
    this.inputObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + URLConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = new Array();

  }

  GetListAppCollateralByAppId() {
    var obj = {
      AppId: this.AppId,
    }
    var getListUrl = URLConstant.GetListAppCollateralByAppId;
    this.http.post(getListUrl, obj).subscribe(
      (response) => {
        this.listCollExisting = response[CommonConstant.ReturnObj];
      });
  }

  getLookupCollateralTypeResponse(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });
  }

  onItemChange(value) {

    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.FULL_ASSET_CODE';
    this.criteriaObj.value = value;
    this.criteriaList.push(this.criteriaObj);

    this.changeSerialNoValidators(value);
  }

  changeSerialNoValidators(value) {
    if (value == "USED" || value == "Used") {
      this.AddCollForm.controls.SerialNo1.setValidators(Validators.required);
      this.AddCollForm.controls.SerialNo2.setValidators(Validators.required);
    }
    else if (value == "NEW" || value == "New") {
      this.AddCollForm.controls.SerialNo1.clearValidators();
      this.AddCollForm.controls.SerialNo2.clearValidators();
    }

    this.AddCollForm.controls.SerialNo1.updateValueAndValidity();
    this.AddCollForm.controls.SerialNo2.updateValueAndValidity();
  }

  SaveForm() {
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

    var appCollObj = {
      AppCollateralObj: this.appCollateralDataObj,
      ListAppCollateralDocObj: this.listAppCollateralDocObj.AppCollateralDocObj
    }

    if (this.type == 'Add') {
      this.http.post(URLConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);

        });
    }
    else {
      this.http.post(URLConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
        (response) => {

          this.toastr.successMessage(response["message"]);
          this.modalService.dismissAll();
        });
    }
    this.bindAppData();
    this.outputTab.emit({ StatusCode: "200" });
  }

  setCollateralInfo() {
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.AppAssetId = this.AppAssetId;
    this.appCollateralDataObj.AppCollateralObj.AgrmntId = this.AgrmntId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.appCollateralDataObj.AppCollateralObj.FullAssetCode = this.AddCollForm.controls["FullAssetCode"].value;
    this.appCollateralDataObj.AppCollateralObj.FullAssetName = this.AddCollForm.controls["FullAssetName"].value.value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo1 = this.AddCollForm.controls["SerialNo1"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo2 = this.AddCollForm.controls["SerialNo2"].value;
    this.appCollateralDataObj.AppCollateralObj.SerialNo3 = this.AddCollForm.controls["SerialNo3"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.AddCollForm.controls["CollateralValueAmt"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralNotes = this.AddCollForm.controls["Notes"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTypeCode = this.AddCollForm.controls["AssetTypeCode"].value;
    this.appCollateralDataObj.AppCollateralObj.CollateralStat = this.AddCollForm.controls["CollateralStat"].value;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = this.AddCollForm.controls["MrCollateralConditionCode"].value;
    this.appCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = this.AddCollForm.controls["MrCollateralUsageCode"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.AddCollForm.controls["AssetCategoryCode"].value;
    this.appCollateralDataObj.AppCollateralObj.ManufacturingYear = this.AddCollForm.controls["ManufacturingYear"].value;
    this.appCollateralDataObj.AppCollateralObj.AssetTaxDt = this.AddCollForm.controls["AssetTaxDt"].value;
    this.appCollateralDataObj.AppCollateralObj.IsMainCollateral = true;

    if (this.type == 'Edit') {
      this.appCollateralObj.AppCollateralId = this.AddCollForm.value.AppCollateralId;
      this.appCollateralObjRegistration.AppCollateralRegistrationId = this.AddCollDataForm.value.AppCollateralRegistrationId;
      this.appCollateralObjRegistration.AppCollateralId = this.AddCollForm.value.AppCollateralId;

      this.appCollateralObj.RowVersion = this.AddCollForm.value.RowVersionCollateral;
      this.appCollateralObjRegistration.RowVersion = this.AddCollForm.value.RowVersionCollateralRegistration;
    }

  }

  setCollateralOwner() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls["OwnerRelationship"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls["MrUserRelationshipCode"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.UserName = this.AddCollForm.controls["UserName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerName = this.AddCollForm.controls["OwnerName"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls["MrIdType"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls["OwnerIdNo"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["OwnerAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AddCollForm.controls["OwnerMobilePhnNo"].value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.Notes = this.AddCollForm.controls["Notes"].value;
  }
  setCollateralLocation() {
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["locationAddrObj"]["controls"].Addr.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode1.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode2.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode3.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["locationAddrObj"]["controls"].AreaCode4.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["locationAddrObj"]["controls"].City.value;
    this.appCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["locationAddrObjZipcode"]["controls"].value.value;
  }

  setCollateralPercentage() {
    this.appCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.AddCollForm.controls["CollateralPrcnt"].value;
  }


  copyToLocation() {
    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Addr.value;
    this.locationAddrObj.AreaCode1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode1.value;
    this.locationAddrObj.AreaCode2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode2.value;
    this.locationAddrObj.AreaCode3 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode3.value;
    this.locationAddrObj.AreaCode4 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode4.value;
    this.locationAddrObj.City = this.AddCollForm.controls["OwnerAddrObj"]["controls"].City.value;
    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value };
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationObj;
  }

  back() {
    this.outputTab.emit({ StatusCode: "-1" });
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
          MrIdType: AppCollateralRegistration.MrIdTypeCode,
          OwnerIdNo: AppCollateralRegistration.OwnerIdNo,
          OwnerMobilePhnNo: AppCollateralRegistration.OwnerMobilePhnNo,
          MrOwnerRelationshipCode: AppCollateralRegistration.MrOwnerRelationshipCode,
          UserName: AppCollateralRegistration.UserName,
          MrUserRelationshipCode: AppCollateralRegistration.MrUserRelationshipCode,
          Notes: AppCollateralRegistration.Notes

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

        this.OwnerAddrObj = new AddrObj();
        this.OwnerAddrObj.Addr = AppCollateralRegistration.OwnerAddr;
        this.OwnerAddrObj.AreaCode1 = AppCollateralRegistration.OwnerAreaCode1;
        this.OwnerAddrObj.AreaCode2 = AppCollateralRegistration.OwnerAreaCode2;
        this.OwnerAddrObj.AreaCode3 = AppCollateralRegistration.OwnerAreaCode3;
        this.OwnerAddrObj.AreaCode4 = AppCollateralRegistration.OwnerAreaCode4;
        this.OwnerAddrObj.City = AppCollateralRegistration.OwnerCity;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = AppCollateralRegistration.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.OwnerZipcode };
        this.inputAddressObjForOwner.default = this.OwnerAddrObj;
        this.inputAddressObjForOwner.inputField = this.inputFieldLegalObj;
      });

  }
  openExistingLookup() {
    this.IsOpenExisting = true;
  }
}
