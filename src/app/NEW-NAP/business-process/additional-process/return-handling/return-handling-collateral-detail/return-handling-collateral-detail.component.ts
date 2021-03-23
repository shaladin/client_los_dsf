import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AllCollateralDataObj } from '../../../../../shared/model/AllCollateralDataObj.Model';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';


@Component({
  selector: 'app-return-handling-collateral-detail',
  templateUrl: './return-handling-collateral-detail.component.html',
})

export class ReturnHandlingCollateralDetailComponent implements OnInit {

  @ViewChild('lookupAsset') ucLookupAsset: UclookupgenericComponent;
  AppId: number;
  wfTaskListId: number;
  returnHandlingHId: number;
  isReturnHandling: boolean = false;
  BranchManagerName: string;
  inputFieldOwnerAddrObj: InputFieldObj;
  ownerAddrObj: AddrObj;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AddrObj;
  //appAssetAccessoriesObjs: Array<AppAssetAccessoryObj>;
  AppCollateralId: number;
  AppAssetId: number = null;
  AgrmntId: number = null;

  CollateralDataForm = this.fb.group({

    FullAssetName: ['', [Validators.required, Validators.maxLength(1000)]],
    MrCollateralConditionCode: ['USED', [Validators.required, Validators.maxLength(50)]],
    MrCollateralUsageCode: ['', [Validators.required, Validators.maxLength(50)]],
    SerialNo1: [''],
    IsSerialNo1: [false],
    SerialNo2: [''],
    IsSerialNo2: [false],
    SerialNo3: [''],
    IsSerialNo3: [false],
    SerialNo4: [''],
    IsSerialNo4: [false],
    SerialNo5: [''],
    IsSerialNo5: [false],
    CollateralValueAmt: ['0', Validators.required],
    CollateralPrcnt: ['', [Validators.required, Validators.max(100)]],
    CollateralNotes: ['', Validators.maxLength(4000)],
    AssetTaxDt: [''],
    ManufacturingYear: ['', Validators.pattern("^[0-9]+$")],

    CollateralSeqNo: ['1', Validators.required],
    FullAssetCode: ['', [Validators.required, Validators.maxLength(500)]],
    CollateralStat: ['NEW', [Validators.required, Validators.maxLength(50)]],
    AssetTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    AssetCategoryCode: ['', [Validators.required, Validators.maxLength(50)]],
    IsMainCollateral: [false, Validators.required],

    UserName: ['', Validators.maxLength(50)],
    MrUserRelationshipCode: ['', Validators.maxLength(4)],
    OwnerName: ['', Validators.maxLength(50)],
    MrIdTypeCode: ['', Validators.maxLength(50)],
    OwnerIdNo: ['', Validators.maxLength(50)],
    MrOwnerRelationshipCode: ['', Validators.maxLength(50)],
    OwnerAddr: [''],
    OwnerAreaCode1: ['', Validators.maxLength(50)],
    OwnerAreaCode2: ['', Validators.maxLength(50)],
    OwnerAreaCode3: ['', Validators.maxLength(50)],
    OwnerAreaCode4: ['', Validators.maxLength(50)],
    OwnerCity: ['', Validators.maxLength(50)],
    OwnerZipcode: ['', Validators.maxLength(50)],
    OwnerMobilePhnNo: ['', [Validators.maxLength(50), Validators.pattern("^[0-9]+$")]],
    LocationAddr: [''],
    LocationAreaCode1: ['', Validators.maxLength(50)],
    LocationAreaCode2: ['', Validators.maxLength(50)],
    LocationAreaCode3: ['', Validators.maxLength(50)],
    LocationAreaCode4: ['', Validators.maxLength(50)],
    LocationCity: ['', Validators.maxLength(50)],
    LocationZipcode: ['', Validators.maxLength(50)],

    LocationAddrType: [''],
    OwnerAddrType: [''],
    selectedDpType: [''],
    SelfUsage: [false],
    //AssetAccessoriesObjs: this.fb.array([])

  });


  refMasterObj = {
    RefMasterTypeCode: "",
  };
  appObj = {
    Id: 0,
  };

  assetMasterObj = {
    FullAssetCode: "",
  };

  allCollateralDataObj: AllCollateralDataObj;

  InputLookupAssetObj: InputLookupObj;

  UserRelationObj: any;
  OwnerRelationObj: any;
  IdTypeObj: any;
  AssetUsageObj: any;
  AssetConditionObj: any;
  DpObj: any;
  AppObj: any;
  AssetMasterObj: any;
  AppCustAddrObj: any;
  AddrLegalObj: any;
  AddrObj: any;
  AssetTypeObj: any;
  AssetTypeDllObj: any;
  appCollateral: any;
  appCollateralRegist: any;


  AppCustObj: any;

  getRefMasterUrl: any;
  AddEditAllCollateralDataUrl: any;
  GetAppCollateralUrl: any;
  GetAppCollateralRegistUrl: any;
  getAppUrl: any;
  getAssetMasterTypeUrl: any;
  getAppCustAddrUrl: any;
  getAppCustUrl: any;
  getAssetTypeUrl: any;


  copyFromAppCustAddrForOwner: any;
  copyFromAppCustAddrForLocation: any;
  typeCrit: any;



  appCollateralObj = {
    Id: 0,
  };
  inputAddressObjForOwner: InputAddressObj;
  inputAddressObjForLoc: InputAddressObj;


  //AllAssetObjs: [{
  //  list: []
  //}] = [{ list: [] }];

  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.AppCollateralId = params["AppCollateralId"];
      if (params['ReturnHandlingHId'] != null) {
        this.returnHandlingHId = params['ReturnHandlingHId'];
        this.isReturnHandling = true;
      }
      if (params['WfTaskListId'] != null) {
        this.wfTaskListId = params['WfTaskListId'];
      }
    })
  }

  async ngOnInit(): Promise<void> {
    //this.appCollateralObj = {
    //  AppCollateralId = 0,
    //}
    this.inputAddressObjForOwner = new InputAddressObj();
    this.inputAddressObjForOwner.showSubsection = false;
    this.inputAddressObjForOwner.showAllPhn = false;

    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.showAllPhn = false;

    this.appCollateralObj.Id = this.AppCollateralId;
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    this.InputLookupAssetObj = new InputLookupObj();
    this.initUrl();
    this.initLookup();
    this.bindAllRefMasterObj();
    this.GetAppData();
    await this.GetListAddr();
    //this.GetAssetMaster(this.assetMasterObj);

    //this.CollateralDataForm.removeControl("AssetAccessoriesObjs");
    //this.CollateralDataForm.addControl("AssetAccessoriesObjs", this.fb.array([]));
    //this.AllAssetObjs.splice(0, 1);

    await this.getAllCollateralData();
    this.CollateralDataForm.controls["MrCollateralConditionCode"].disable();
  }

  initUrl() {
    this.getAppUrl = URLConstant.GetAppById;
    this.getAppCustUrl = URLConstant.GetAppCustByAppId;
    this.getAssetTypeUrl = URLConstant.GetAssetTypeKeyValueCode;
    this.getAppCustAddrUrl = URLConstant.GetListAppCustAddrByAppId;
    this.getRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.GetAppCollateralUrl = URLConstant.GetAppCollateralByAppCollateralId;
    this.getAssetMasterTypeUrl = URLConstant.GetAssetMasterTypeByFullAssetCode;
    this.AddEditAllCollateralDataUrl = URLConstant.AddEditAllCollateralDataByAppCollateraId;
    this.GetAppCollateralRegistUrl = URLConstant.GetAppCollateralRegistrationByAppCollateralId;
  }

  SaveForm() {
    this.allCollateralDataObj = new AllCollateralDataObj();
    this.setAllCollateralObj();
    this.http.post(this.AddEditAllCollateralDataUrl, this.allCollateralDataObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        AdInsHelper.RedirectUrl(this.router, [NavigationConstant.NAP_ADD_PRCS_RETURN_HANDLING_COLL_EDIT], { "AppId": this.AppId, "ReturnHandlingHId": this.returnHandlingHId, "WfTaskListId": this.wfTaskListId });
      });

  }

  setAllCollateralObj() {

    if (this.AppCollateralId == 0) {

      this.allCollateralDataObj.AppCollateralObj.CollateralStat = "NEW";
    }
    else {

      this.allCollateralDataObj.AppCollateralObj.CollateralStat = this.CollateralDataForm.controls.CollateralStat.value;
      this.allCollateralDataObj.AppCollateralObj.RowVersion = this.appCollateral.RowVersion;
      this.allCollateralDataObj.AppCollateralRegistrationObj.RowVersion = this.appCollateralRegist.RowVersion
    }
    this.allCollateralDataObj.AppCollateralObj.AppCollateralId = this.AppCollateralId;
    this.allCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.allCollateralDataObj.AppCollateralObj.AppAssetId = this.AppAssetId;
    this.allCollateralDataObj.AppCollateralObj.AgrmntId = this.AgrmntId;
    this.allCollateralDataObj.AppCollateralObj.CollateralSeqNo = this.CollateralDataForm.controls.CollateralSeqNo.value;
    this.allCollateralDataObj.AppCollateralObj.FullAssetCode = this.CollateralDataForm.controls.FullAssetCode.value;
    this.allCollateralDataObj.AppCollateralObj.FullAssetName = this.CollateralDataForm.controls.FullAssetName.value;
    this.allCollateralDataObj.AppCollateralObj.MrCollateralConditionCode = this.CollateralDataForm.controls.MrCollateralConditionCode.value;
    this.allCollateralDataObj.AppCollateralObj.MrCollateralUsageCode = this.CollateralDataForm.controls.MrCollateralUsageCode.value;
    this.allCollateralDataObj.AppCollateralObj.SerialNo1 = this.CollateralDataForm.controls.SerialNo1.value;
    this.allCollateralDataObj.AppCollateralObj.SerialNo2 = this.CollateralDataForm.controls.SerialNo2.value;
    this.allCollateralDataObj.AppCollateralObj.SerialNo3 = this.CollateralDataForm.controls.SerialNo3.value;
    this.allCollateralDataObj.AppCollateralObj.SerialNo4 = this.CollateralDataForm.controls.SerialNo4.value;
    this.allCollateralDataObj.AppCollateralObj.SerialNo5 = this.CollateralDataForm.controls.SerialNo5.value;
    this.allCollateralDataObj.AppCollateralObj.CollateralValueAmt = this.CollateralDataForm.controls.CollateralValueAmt.value;
    this.allCollateralDataObj.AppCollateralObj.AssetTypeCode = this.CollateralDataForm.controls.AssetTypeCode.value;
    this.allCollateralDataObj.AppCollateralObj.AssetCategoryCode = this.CollateralDataForm.controls.AssetCategoryCode.value;
    this.allCollateralDataObj.AppCollateralObj.ManufacturingYear = this.CollateralDataForm.controls.ManufacturingYear.value;
    this.allCollateralDataObj.AppCollateralObj.AssetTaxDt = this.CollateralDataForm.controls.AssetTaxDt.value;
    this.allCollateralDataObj.AppCollateralObj.CollateralNotes = this.CollateralDataForm.controls.CollateralNotes.value;
    this.allCollateralDataObj.AppCollateralObj.CollateralPrcnt = this.CollateralDataForm.controls.CollateralPrcnt.value;


    this.allCollateralDataObj.AppCollateralRegistrationObj.UserName = this.CollateralDataForm.controls.UserName.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.CollateralDataForm.controls.MrUserRelationshipCode.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerName = this.CollateralDataForm.controls.OwnerName.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.CollateralDataForm.controls.MrIdTypeCode.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.CollateralDataForm.controls.OwnerIdNo.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.MrOwnerRelationshipCode = this.CollateralDataForm.controls.MrOwnerRelationshipCode.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerAddr = this.CollateralDataForm.controls["ownerData"]["controls"].Addr.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.CollateralDataForm.controls["ownerData"]["controls"].AreaCode1.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.CollateralDataForm.controls["ownerData"]["controls"].AreaCode2.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.CollateralDataForm.controls["ownerData"]["controls"].AreaCode3.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.CollateralDataForm.controls["ownerData"]["controls"].AreaCode4.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerCity = this.CollateralDataForm.controls["ownerData"]["controls"].City.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.CollateralDataForm.controls["ownerDataZipcode"]["controls"].value.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.CollateralDataForm.controls.OwnerMobilePhnNo.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationAddr = this.CollateralDataForm.controls["locationData"]["controls"].Addr.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.CollateralDataForm.controls["locationData"]["controls"].AreaCode1.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.CollateralDataForm.controls["locationData"]["controls"].AreaCode2.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.CollateralDataForm.controls["locationData"]["controls"].AreaCode3.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.CollateralDataForm.controls["locationData"]["controls"].AreaCode4.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationCity = this.CollateralDataForm.controls["locationData"]["controls"].City.value;
    this.allCollateralDataObj.AppCollateralRegistrationObj.LocationZipcode = this.CollateralDataForm.controls["locationDataZipcode"]["controls"].value.value;

    //this.allCollateralDataObj.AppAssetAccessoryObjs = new Array<AppAssetAccessoryObj>();
    //for (let i = 0; i < this.CollateralDataForm.controls["AssetAccessoriesObjs"].value.length; i++) {
    //  var appAssetAccObj = new AppAssetAccessoryObj();
    //  appAssetAccObj.AssetAccessoryCode = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryCode;
    //  appAssetAccObj.AssetAccessoryName = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].AssetAccessoryName;
    //  appAssetAccObj.SupplCode = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].SupplCodeAccessory;
    //  appAssetAccObj.SupplName = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].SupplNameAccessory;
    //  appAssetAccObj.AccessoryPriceAmt = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryPriceAmt;
    //  appAssetAccObj.CollateralPrcnt = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryDownPaymentAmt;
    //  appAssetAccObj.AccessoryNotes = this.CollateralDataForm.controls["AssetAccessoriesObjs"].value[i].AccessoryNotes;
    //  this.allCollateralDataObj.AppAssetAccessoryObjs.push(appAssetAccObj);
    //}
  }


  SetAsset(event) {
    this.assetMasterObj.FullAssetCode = event.FullAssetCode;
    //this.GetAssetMaster(this.assetMasterObj);
    this.CollateralDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode
    });
  }




  async SelfUsageChange(event) {
    if (event.checked == true) {
      await this.GetAppCust();
      this.CollateralDataForm.patchValue({
        OwnerAddr: this.AddrLegalObj[0].Addr,
        OwnerAreaCode1: this.AddrLegalObj[0].AreaCode1,
        OwnerAreaCode2: this.AddrLegalObj[0].AreaCode2,
        OwnerAreaCode3: this.AddrLegalObj[0].AreaCode3,
        OwnerAreaCode4: this.AddrLegalObj[0].AreaCode4,
        OwnerCity: this.AddrLegalObj[0].City,
        OwnerZipcode: this.AddrLegalObj[0].Zipcode
      });

      this.inputFieldOwnerAddrObj = new InputFieldObj();
      this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();
      this.ownerAddrObj = new AddrObj();
      this.ownerAddrObj.Addr = this.AddrLegalObj[0].Addr;
      this.ownerAddrObj.AreaCode1 = this.AddrLegalObj[0].AreaCode1;
      this.ownerAddrObj.AreaCode2 = this.AddrLegalObj[0].AreaCode2;
      this.ownerAddrObj.AreaCode3 = this.AddrLegalObj[0].AreaCode3;
      this.ownerAddrObj.AreaCode4 = this.AddrLegalObj[0].AreaCode4;
      this.ownerAddrObj.City = this.AddrLegalObj[0].City;
      this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.AddrLegalObj[0].Zipcode;
      this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.AddrLegalObj[0].Zipcode };
      this.inputAddressObjForOwner.default = this.ownerAddrObj;
      this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;

      this.CollateralDataForm.controls.UserName.clearValidators();
      this.CollateralDataForm.controls.UserName.updateValueAndValidity();
      this.CollateralDataForm.controls.MrUserRelationshipCode.clearValidators();
      this.CollateralDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.CollateralDataForm.controls["UserName"].disable();
      this.CollateralDataForm.controls["MrUserRelationshipCode"].disable();
    };
    if (event.checked == false) {
      this.CollateralDataForm.controls.UserName.setValidators([Validators.required, Validators.maxLength(100)]);
      this.CollateralDataForm.controls.UserName.updateValueAndValidity();
      this.CollateralDataForm.controls.MrUserRelationshipCode.setValidators([Validators.required, Validators.maxLength(50)]);
      this.CollateralDataForm.controls.MrUserRelationshipCode.updateValueAndValidity();
      this.CollateralDataForm.controls["UserName"].enable();
      this.CollateralDataForm.controls["MrUserRelationshipCode"].enable();
    };

  }


  async getAllCollateralData() {
    if (this.AppCollateralId != 0) {
      await this.http.post(this.GetAppCollateralUrl, this.appCollateralObj).subscribe(
        (response) => {
          this.appCollateral = response;
          if (this.appCollateral != "" && this.appCollateral != null) {
            this.CollateralDataForm.patchValue({

              FullAssetCode: this.appCollateral.FullAssetCode,
              FullAssetName: this.appCollateral.FullAssetName,
              MrCollateralConditionCode: this.appCollateral.MrCollateralConditionCode,
              MrCollateralUsageCode: this.appCollateral.MrCollateralUsageCode,
              SerialNo1: this.appCollateral.SerialNo1,
              SerialNo2: this.appCollateral.SerialNo2,
              SerialNo3: this.appCollateral.SerialNo3,
              SerialNo4: this.appCollateral.SerialNo4,
              SerialNo5: this.appCollateral.SerialNo5,
              ManufacturingYear: this.appCollateral.ManufacturingYear,
              CollateralValueAmt: this.appCollateral.CollateralValueAmt,
              CollateralPrcnt: this.appCollateral.CollateralPrcnt,
              CollateralNotes: this.appCollateral.CollateralNotes,
              AssetTaxDt: formatDate(this.appCollateral.AssetTaxDt, 'yyyy-MM-dd', 'en-US'),
              CollateralSeqNo: this.appCollateral.CollateralSeqNo,
              CollateralStat: this.appCollateral.CollateralStat,
              AssetTypeCode: this.appCollateral.AssetTypeCode,
              AssetCategoryCode: this.appCollateral.AssetCategoryCode,
              IsMainCollateral: this.appCollateral.IsMainCollateral

            });

            //this.appAssetAccessoriesObjs = this.appCollateral.ResponseAppAssetAccessoryObjs
            this.AppCollateralId = this.appCollateral.AppCollateralId;
            this.AppAssetId = this.appCollateral.AppAssetId;
            this.AgrmntId = this.appCollateral.AgrmntId;
            this.assetMasterObj.FullAssetCode = this.appCollateral.FullAssetCode;
            this.GetAssetMaster(this.assetMasterObj);
            this.AssetTypeChanged(this.appCollateral.AssetTypeCode);
          }

        });

      this.http.post(this.GetAppCollateralRegistUrl, this.appCollateralObj).subscribe(
        (response) => {
          this.appCollateralRegist = response;
          if (this.appCollateralRegist != "" && this.appCollateralRegist != null) {
            this.CollateralDataForm.patchValue({

              UserName: this.appCollateralRegist.UserName,
              MrUserRelationshipCode: this.appCollateralRegist.MrUserRelationshipCode,
              OwnerName: this.appCollateralRegist.OwnerName,
              MrIdTypeCode: this.appCollateralRegist.MrIdTypeCode,
              OwnerIdNo: this.appCollateralRegist.OwnerIdNo,
              MrOwnerRelationshipCode: this.appCollateralRegist.MrOwnerRelationshipCode,
              OwnerAddr: this.appCollateralRegist.OwnerAddr,
              OwnerAreaCode1: this.appCollateralRegist.OwnerAreaCode1,
              OwnerAreaCode2: this.appCollateralRegist.OwnerAreaCode2,
              OwnerAreaCode3: this.appCollateralRegist.OwnerAreaCode3,
              OwnerAreaCode4: this.appCollateralRegist.OwnerAreaCode4,
              OwnerCity: this.appCollateralRegist.OwnerCity,
              OwnerZipcode: this.appCollateralRegist.OwnerZipcode,
              OwnerMobilePhnNo: this.appCollateralRegist.OwnerMobilePhnNo,
              LocationAddr: this.appCollateralRegist.LocationAddr,
              LocationAreaCode1: this.appCollateralRegist.LocationAreaCode1,
              LocationAreaCode2: this.appCollateralRegist.LocationAreaCode2,
              LocationAreaCode3: this.appCollateralRegist.LocationAreaCode3,
              LocationAreaCode4: this.appCollateralRegist.LocationAreaCode4,
              LocationCity: this.appCollateralRegist.LocationCity,
              LocationZipcode: this.appCollateralRegist.LocationZipcode,

            });

            //this.appAssetAccessoriesObjs = this.appCollateral.ResponseAppAssetAccessoryObjs
            this.setAddrOwnerObj();
            this.setAddrLocationObj();

          }

        });
    }

  }


  initLookup() {

    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAssetCollateral.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAssetCollateral.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAssetCollateral.json";
  }

  bindAllRefMasterObj() {
    this.bindAssetUsageObj();
    this.bindIdTypeObj();
    this.bindUserOwnerRelationshipObj();
    this.bindAsseConditionObj();
    this.bindAssetTypeObj();
  }

  bindAssetUsageObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.AssetUsageObj = response[CommonConstant.ReturnObj];
        if (this.AssetUsageObj.length > 0) {
          this.CollateralDataForm.patchValue({
            MrCollateralUsageCode: this.AssetUsageObj[0].Key
          });

        }
      }
    );
  }

  bindAssetTypeObj() {
    var obj = {

    };
    this.http.post(this.getAssetTypeUrl, obj).subscribe(
      (response) => {
        this.AssetTypeDllObj = response[CommonConstant.ReturnObj];
        if (this.AssetTypeDllObj.length > 0) {
          this.CollateralDataForm.patchValue({
            AssetTypeCode: this.AssetTypeDllObj[0].Key
          });
          this.AssetTypeChanged(this.AssetTypeDllObj[0].Key);
        }
      }
    );

  }

  bindAsseConditionObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.AssetConditionObj = response[CommonConstant.ReturnObj];
        //if (this.AssetConditionObj.length > 0) {
        //  this.CollateralDataForm.patchValue({
        //    MrCollateralConditionCode: this.AssetConditionObj[0].Key
        //  });

        //}
      }
    );
  }

  bindIdTypeObj() {
    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.IdTypeObj = response[CommonConstant.ReturnObj];
        if (this.IdTypeObj.length > 0) {
          this.CollateralDataForm.patchValue({
            MrIdTypeCode: this.IdTypeObj[0].Key
          });
        }
      }
    );
  }

  bindUserOwnerRelationshipObj() {

    this.refMasterObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(this.getRefMasterUrl, this.refMasterObj).subscribe(
      (response) => {
        this.UserRelationObj = response[CommonConstant.ReturnObj];
        this.OwnerRelationObj = response[CommonConstant.ReturnObj];
        if (this.UserRelationObj.length > 0) {
          this.CollateralDataForm.patchValue({
            MrUserRelationshipCode: this.UserRelationObj[0].Key,
            MrOwnerRelationshipCode: this.UserRelationObj[0].Key
          });
        }
      }
    );
  }

  GetAppData() {
    this.appObj.Id = this.AppId;
    this.http.post(this.getAppUrl, this.appObj).subscribe(
      (response) => {
        this.AppObj = response;
      }
    );
  }


  GetAssetMaster(assetMasterObj) {
    this.http.post(this.getAssetMasterTypeUrl, {Code: assetMasterObj.FullAssetCode}).subscribe(
      (response) => {
        this.AssetMasterObj = response;
        this.CollateralDataForm.patchValue({
          FullAssetCode: this.AssetMasterObj.FullAssetCode,
          FullAssetName: this.AssetMasterObj.FullAssetName,
        });
        this.InputLookupAssetObj.jsonSelect = this.AssetMasterObj;
        this.InputLookupAssetObj.nameSelect = this.AssetMasterObj.FullAssetName;

      }
    );
  }

  async AssetTypeChanged(Code) {
    var assetTypeObj = {
      AssetTypeCode: Code
    };
    await this.http.post(URLConstant.GetAssetTypeByCode, {Code: Code}).toPromise().then(
      (response) => {
        this.AssetTypeObj = response;
      }
    );
    this.typeCrit = new Array();
    var critTypeObj = new CriteriaObj();
    critTypeObj.DataType = "string";
    critTypeObj.restriction = AdInsConstant.RestrictionIn;
    critTypeObj.propName = "B.ASSET_TYPE_CODE";
    critTypeObj.listValue = [Code];
    this.typeCrit.push(critTypeObj);
    this.InputLookupAssetObj.addCritInput = this.typeCrit;
    this.ucLookupAsset.setAddCritInput();

    if (this.AssetTypeObj.SerialNo1Label != "" && this.AssetTypeObj.SerialNo1Label != null) {
      if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == "USED") {
        this.CollateralDataForm.controls.SerialNo1.setValidators([Validators.required, Validators.maxLength(50)]);
        this.CollateralDataForm.controls.SerialNo1.updateValueAndValidity();
      }
      else {
        this.CollateralDataForm.controls.SerialNo1.clearValidators;
        this.CollateralDataForm.controls.SerialNo1.updateValueAndValidity();
      }
    }
    else {
      this.CollateralDataForm.controls.SerialNo1.clearValidators;
      this.CollateralDataForm.controls.SerialNo1.updateValueAndValidity();
    }

    if (this.AssetTypeObj.SerialNo2Label != "" && this.AssetTypeObj.SerialNo2Label != null) {
      if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
        this.CollateralDataForm.controls.SerialNo2.setValidators([Validators.required, Validators.maxLength(50)]);
        this.CollateralDataForm.controls.SerialNo2.updateValueAndValidity();
      }
      else {
        this.CollateralDataForm.controls.SerialNo2.clearValidators;
        this.CollateralDataForm.controls.SerialNo2.updateValueAndValidity();
      }
    }
    else {
      this.CollateralDataForm.controls.SerialNo2.clearValidators;
      this.CollateralDataForm.controls.SerialNo3.updateValueAndValidity();
    }
    if (this.AssetTypeObj.SerialNo3Label != "" && this.AssetTypeObj.SerialNo3Label != null) {
      if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
        this.CollateralDataForm.controls.SerialNo3.setValidators([Validators.required, Validators.maxLength(50)]);
        this.CollateralDataForm.controls.SerialNo3.updateValueAndValidity();
      }
      else {
        this.CollateralDataForm.controls.SerialNo3.clearValidators;
        this.CollateralDataForm.controls.SerialNo3.updateValueAndValidity();
      }
    }
    else {
      this.CollateralDataForm.controls.SerialNo3.clearValidators;
      this.CollateralDataForm.controls.SerialNo3.updateValueAndValidity();
    }
    if (this.AssetTypeObj.SerialNo4Label != "" && this.AssetTypeObj.SerialNo4Label != null) {
      if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
        this.CollateralDataForm.controls.SerialNo4.setValidators([Validators.required, Validators.maxLength(50)]);
        this.CollateralDataForm.controls.SerialNo4.updateValueAndValidity();
      }
      else {
        this.CollateralDataForm.controls.SerialNo4.clearValidators;
        this.CollateralDataForm.controls.SerialNo4.updateValueAndValidity();
      }
    }
    else {
      this.CollateralDataForm.controls.SerialNo4.clearValidators;
      this.CollateralDataForm.controls.SerialNo4.updateValueAndValidity();
    }
    if (this.AssetTypeObj.SerialNo5Label != "" && this.AssetTypeObj.SerialNo5Label != null) {
      if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
        this.CollateralDataForm.controls.SerialNo5.setValidators([Validators.required, Validators.maxLength(50)]);
        this.CollateralDataForm.controls.SerialNo5.updateValueAndValidity();
      }
      else {
        this.CollateralDataForm.controls.SerialNo5.clearValidators;
        this.CollateralDataForm.controls.SerialNo5.updateValueAndValidity();
      }
    }
    else {
      this.CollateralDataForm.controls.SerialNo5.clearValidators;
      this.CollateralDataForm.controls.SerialNo5.updateValueAndValidity();
    }
    if (this.CollateralDataForm.controls.MrCollateralConditionCode.value == CommonConstant.AssetConditionUsed) {
      this.CollateralDataForm.controls.AssetTaxDt.setValidators([Validators.required]);
      this.CollateralDataForm.controls.AssetTaxDt.updateValueAndValidity();
    }
    else {
      this.CollateralDataForm.controls.AssetTaxDt.clearValidators;
      this.CollateralDataForm.controls.AssetTaxDt.updateValueAndValidity();
    }
    //this.CollateralDataForm.patchValue({
    //  AssetTypeCode: Code,
    //});
  }

  setAddrOwnerObj() {
    this.inputFieldOwnerAddrObj = new InputFieldObj();
    this.inputFieldOwnerAddrObj.inputLookupObj = new InputLookupObj();

    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.appCollateralRegist.OwnerAddr;
    this.ownerAddrObj.AreaCode1 = this.appCollateralRegist.OwnerAreaCode1;
    this.ownerAddrObj.AreaCode2 = this.appCollateralRegist.OwnerAreaCode2;
    this.ownerAddrObj.AreaCode3 = this.appCollateralRegist.OwnerAreaCode3;
    this.ownerAddrObj.AreaCode4 = this.appCollateralRegist.OwnerAreaCode4;
    this.ownerAddrObj.City = this.appCollateralRegist.OwnerCity;

    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.appCollateralRegist.OwnerZipcode;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appCollateralRegist.OwnerZipcode };
    this.inputAddressObjForOwner.default = this.ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
  }

  setAddrLocationObj() {
    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();

    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.appCollateralRegist.LocationAddr;
    this.locationAddrObj.AreaCode1 = this.appCollateralRegist.LocationAreaCode1;
    this.locationAddrObj.AreaCode2 = this.appCollateralRegist.LocationAreaCode2;
    this.locationAddrObj.AreaCode3 = this.appCollateralRegist.LocationAreaCode3;
    this.locationAddrObj.AreaCode4 = this.appCollateralRegist.LocationAreaCode4;
    this.locationAddrObj.City = this.appCollateralRegist.LocationCity;

    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.appCollateralRegist.LocationZipcode;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.appCollateralRegist.LocationZipcode };
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
  }

  async GetListAddr() {
    this.appObj.Id = this.AppId;
    this.http.post(this.getAppCustAddrUrl, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AddrLegalObj = this.AppCustAddrObj.filter(
          emp => emp.MrCustAddrTypeCode === CommonConstant.AddrTypeLegal);

      }
    );
  }

  copyToOwnerAddr() {
    this.AddrObj = this.AppCustAddrObj.filter(
      emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForOwner);

    this.CollateralDataForm.patchValue({
      OwnerAddr: this.AddrObj[0].Addr,
      OwnerAreaCode1: this.AddrObj[0].AreaCode1,
      OwnerAreaCode2: this.AddrObj[0].AreaCode2,
      OwnerAreaCode3: this.AddrObj[0].AreaCode3,
      OwnerAreaCode4: this.AddrObj[0].AreaCode4,
      OwnerCity: this.AddrObj[0].City,
      OwnerZipcode: this.AddrObj[0].Zipcode
    });
    this.ownerAddrObj = new AddrObj();
    this.ownerAddrObj.Addr = this.AddrObj[0].Addr;
    this.ownerAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
    this.ownerAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
    this.ownerAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
    this.ownerAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
    this.ownerAddrObj.City = this.AddrObj[0].City;
    this.inputFieldOwnerAddrObj.inputLookupObj.nameSelect = this.CollateralDataForm.controls.OwnerZipcode.value;
    this.inputFieldOwnerAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.CollateralDataForm.controls.OwnerZipcode.value };
    this.inputAddressObjForOwner.default = this.ownerAddrObj;
    this.inputAddressObjForOwner.inputField = this.inputFieldOwnerAddrObj;
  }

  copyToLocationAddr() {
    this.AddrObj = this.AppCustAddrObj.filter(
      emp => emp.MrCustAddrTypeCode === this.copyFromAppCustAddrForLocation);

    this.CollateralDataForm.patchValue({
      LocationAddr: this.AddrObj[0].Addr,
      LocationAreaCode1: this.AddrObj[0].AreaCode1,
      LocationAreaCode2: this.AddrObj[0].AreaCode2,
      LocationAreaCode3: this.AddrObj[0].AreaCode3,
      LocationAreaCode4: this.AddrObj[0].AreaCode4,
      LocationCity: this.AddrObj[0].City,
      LocationZipcode: this.AddrObj[0].Zipcode
    });
    this.locationAddrObj = new AddrObj();
    this.locationAddrObj.Addr = this.AddrObj[0].Addr;
    this.locationAddrObj.AreaCode1 = this.AddrObj[0].AreaCode1;
    this.locationAddrObj.AreaCode2 = this.AddrObj[0].AreaCode2;
    this.locationAddrObj.AreaCode3 = this.AddrObj[0].AreaCode3;
    this.locationAddrObj.AreaCode4 = this.AddrObj[0].AreaCode4;
    this.locationAddrObj.City = this.AddrObj[0].City;

    this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.CollateralDataForm.controls.LocationZipcode.value;
    this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.CollateralDataForm.controls.LocationZipcode.value };
    this.inputAddressObjForLoc.default = this.locationAddrObj;
    this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
  }

  test() {
    this.allCollateralDataObj = new AllCollateralDataObj();
    this.setAllCollateralObj();
  }
  SetLocationAddrType(event) {
    this.copyFromAppCustAddrForLocation = event;
  }

  SetOwnerAddrType(event) {
    this.copyFromAppCustAddrForOwner = event;
  }

  async GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    this.http.post(this.getAppCustUrl, appObj).toPromise().then(
      (response) => {
        this.AppCustObj = response;
        this.CollateralDataForm.patchValue({
          UserName: this.AppCustObj.CustName,
          MrUserRelationshipCode: CommonConstant.SelfCustomer,
          OwnerName: this.AppCustObj.CustName,
          MrIdTypeCode: this.AppCustObj.MrIdTypeCode,
          OwnerIdNo: this.AppCustObj.IdNo,
          MrOwnerRelationshipCode: CommonConstant.SelfCustomer
        });
      }
    );
  }
}
