import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { AllAssetDataObj } from 'app/shared/model/AllAssetDataObj.Model';
import { AppCollateralRegistrationObj } from 'app/shared/model/AppCollateralRegistrationObj.Model';
import { AppCollateralObj } from 'app/shared/model/AppCollateralObj.Model';
import { VendorObj } from 'app/shared/model/Vendor.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';

@Component({
  selector: 'app-asset-leasing-add-edit',
  templateUrl: './asset-leasing-add-edit.component.html'
})
export class AssetLeasingAddEditComponent implements OnInit {
  //@Input() type: string = "addAsset";
  @Input() mode: string;
  @Input() AppAssetId: number;
  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  @Output() assetValue: EventEmitter<object> = new EventEmitter();
  //AppAssetId: number = 0;
  //type: string = "addAsset";
  AppId: number;
  LobCode: string;
  pageType: string = "add";
  custType: string;
  listBranchObj: any;
  salesObj: any;
  listSalesObj: any;
  adminHeadObj: any;
  listAdminHeadObj: any;
  InputLookupSupplierObj: any;
  InputLookupAssetObj: any;
  inputAssetLocAddressObj: any;
  assetConditionObj: any;
  returnAssetConditionObj: any;
  downPaymentObj: any;
  returnDownPaymentObj: any;
  userRelationshipObj: any;
  returnUserRelationshipObj: any;
  inputFieldLocationAddrObj: InputFieldObj;
  locationAddrObj: AppCustAddrObj;
  AppCustAddrObj: any;
  appCustAddrObj: any;
  returnAppCustAddrObj: any;
  allAssetDataObj: AllAssetDataObj;
  returnRefCoyObj: any;
  appCustObj: any;
  assetUsageObj: any
  returnAssetUsageObj: any;
  appAssetObj: any;
  returnAppAssetObj: any;
  reqAssetMasterObj: any;
  resAssetMasterObj: any;
  appCollateralObj: any;
  returnAppCollateralObj: any;
  appCollateralRegistObj: any;
  returnAppCollateralRegistObj: any;
  appAssetSupplEmpObj: any;
  returnAppAssetSupplEmpObj: any;
  vendorObj: any;
  returnVendorObj: any;
  appAssetSupplEmpSalesObj: any;
  salesAppAssetSupplEmpObj: any;
  appAssetSupplEmpHeadObj: any;
  headAppAssetSupplEmpObj: any;
  appAssetSupplEmpBranchObj: any;
  branchAppAssetSupplEmpObj: any;
  items: FormArray;
  SerialNoList: any;

  AssetDataForm = this.fb.group({
    SupplName: [''],
    SupplCode: [''],

    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerCode: [''],

    SalesPersonName: [''],
    SalesPersonNo: [''],
    SalesPersonCode: [''],

    AdminHeadName: [''],
    AdminHeadNo: [''],
    AdminHeadCode: [''],

    FullAssetCode: [''],
    FullAssetName: [''],
    AssetCategoryCode: [''],
    AssetTypeCode: [''],
    MrDownPaymentTypeCode: [''],
    AssetPrice: [''],
    DownPayment: [''],
    MrAssetConditionCode: [''],
    AssetUsage: [''],
    LicensePlate: [''],
    ChassisNo: [''],
    ManufacturingYear: [''],
    EngineNo: [''],
    Notes: [''],

    SelfUsage: [false],
    Username: [''],
    UserRelationship: [''],
    OwnerName: [''],
    OwnerIdType: [''],
    OwnerIdNo: [''],
    OwnerAddr: [''],
    OwnerAreaCode1: [''],
    OwnerAreaCode2: [''],
    OwnerAreaCode3: [''],
    OwnerAreaCode4: [''],
    OwnerZipcode: [''],
    OwnerMobilePhn: [''],

    LocationAddrType: [''],
    items: this.fb.array([])
  });

  appObj = {
    Id: 0,
  };
  inputAddressObjForLoc: InputAddressObj;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      if (params["AppAssetId"] != null) {
        this.AppAssetId = params["AppAssetId"];
      }
      if (params["mode"] != null) {
        this.pageType = params["mode"];
      }
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["LobCode"] != null) {
        this.LobCode = params["LobCode"];
      }
    });
  }

  back() {
    this.assetValue.emit({ mode: 'paging' });
  }

  SetAsset(event) {
    this.AssetDataForm.patchValue({
      FullAssetCode: event.FullAssetCode,
      FullAssetName: event.FullAssetName,
      AssetCategoryCode: event.AssetCategoryCode,
      AssetTypeCode: event.AssetTypeCode
    });
  }

  GetListAddr() {
    this.appObj.Id = this.AppId;
    this.http.post(URLConstant.GetListAppCustAddrByAppId, this.appObj).toPromise().then(
      (response) => {
        this.AppCustAddrObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ LocationAddrType: response[CommonConstant.ReturnObj][0]['AppCustAddrId'] });
      }
    );
  }

  copyToLocationAddr() {
    // this.appCustAddrObj = new AppCustAddrObj();
    // this.appCustAddrObj.AppCustAddrId = this.AssetDataForm.controls["LocationAddrType"].value;
    var appCustAddrObj = { Id: this.AssetDataForm.controls["LocationAddrType"].value };
    this.http.post(URLConstant.GetAppCustAddrByAppCustAddrId, appCustAddrObj).subscribe(
      (response) => {
        this.returnAppCustAddrObj = response;

        this.locationAddrObj = new AppCustAddrObj();
        this.locationAddrObj.Addr = this.returnAppCustAddrObj.Addr;
        this.locationAddrObj.AreaCode3 = this.returnAppCustAddrObj.AreaCode3;
        this.locationAddrObj.AreaCode4 = this.returnAppCustAddrObj.AreaCode4;
        this.locationAddrObj.AreaCode1 = this.returnAppCustAddrObj.AreaCode1;
        this.locationAddrObj.AreaCode2 = this.returnAppCustAddrObj.AreaCode2;
        this.locationAddrObj.City = this.returnAppCustAddrObj.City;

        this.inputFieldLocationAddrObj = new InputFieldObj();
        this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
        this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;
        this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCustAddrObj.Zipcode;
        this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCustAddrObj.Zipcode };
        this.inputAddressObjForLoc.default = this.locationAddrObj;
        this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
      });
  }

  SetSupplier(event) {
    this.AssetDataForm.patchValue({
      SupplName: event.VendorName,
      SupplCode: event.VendorCode
    });

    let branchObj : GenericObj = new GenericObj();
    branchObj.Id = event.VendorId;
    branchObj.Code = 'BRANCH_MANAGER';
    this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, branchObj).subscribe(
      (response) => {
        this.listBranchObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          BranchManagerNo: response[CommonConstant.ReturnObj][0]['Key'],
          BranchManagerName: response[CommonConstant.ReturnObj][0]['Value']
        });
      });

    let salesObj : GenericObj = new GenericObj();
    salesObj.Id = event.VendorId;
    salesObj.Code = 'SALES_PERSON';
    this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, salesObj).subscribe(
      (response) => {
        this.listSalesObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          SalesPersonNo: response[CommonConstant.ReturnObj][0]['Key'],
          SalesPersonName: response[CommonConstant.ReturnObj][0]['Value']
        });
      });

    let adminHeadObj : GenericObj = new GenericObj();
    adminHeadObj.Id = event.VendorId;
    adminHeadObj.Code = 'ADMIN_HEAD';
    this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, adminHeadObj).subscribe(
      (response) => {
        this.listAdminHeadObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          AdminHeadNo: response[CommonConstant.ReturnObj][0]['Key'],
          AdminHeadName: response[CommonConstant.ReturnObj][0]['Value']
        });
      });
  }

  GetAppCust() {
    var appObj = {
      Id: this.AppId,
    };
    this.http.post(URLConstant.GetAppCustByAppId, appObj).subscribe(
      (response) => {
        this.appCustObj = response;
        this.AssetDataForm.patchValue({
          Username: this.appCustObj.CustName,
          UserRelationship: "SELF",
        });
      }
    );
  }

  SelfUsageChange(event) {
    if (event.checked == true) {
      this.GetAppCust();
      this.AssetDataForm.controls.Username.clearValidators();
      this.AssetDataForm.controls.Username.updateValueAndValidity();
      this.AssetDataForm.controls.UserRelationship.clearValidators();
      this.AssetDataForm.controls.UserRelationship.updateValueAndValidity();
      this.AssetDataForm.controls["Username"].disable();
      this.AssetDataForm.controls["UserRelationship"].disable();
    };

    if (event.checked == false) {
      this.AssetDataForm.controls.Username.setValidators([Validators.required, Validators.maxLength(100)]);
      this.AssetDataForm.controls.Username.updateValueAndValidity();
      this.AssetDataForm.controls.UserRelationship.setValidators([Validators.required, Validators.maxLength(50)]);
      this.AssetDataForm.controls.UserRelationship.updateValueAndValidity();
      this.AssetDataForm.controls["Username"].enable();
      this.AssetDataForm.controls["UserRelationship"].enable();
    };
  }

  BranchChanged(event) {
    this.AssetDataForm.patchValue({
      BranchManagerName: this.listBranchObj.find(x => x.Key == event.target.value).Value
    });
  }

  SalesChanged(event) {
    this.AssetDataForm.patchValue({
      SalesPersonName: this.listSalesObj.find(x => x.Key == event.target.value).Value
    });
  }

  AdminChanged(event) {
    this.AssetDataForm.patchValue({
      AdminHeadName: this.listAdminHeadObj.find(x => x.Key == event.target.value).Value
    });
  }

  ngOnInit() {
    this.inputAddressObjForLoc = new InputAddressObj();
    this.inputAddressObjForLoc.showSubsection = false;
    this.inputAddressObjForLoc.isRequired = false;
    this.inputAddressObjForLoc.title = "Asset Location";
    this.inputAddressObjForLoc.showAllPhn = false;
    this.inputAddressObjForLoc.showOwnership = false;

    if (this.mode == 'editAsset') {
      this.appAssetObj = new AppAssetObj();
      this.appAssetObj.AppAssetId = this.AppAssetId;
      var appAssetObj = { Id: this.AppAssetId };
      this.http.post(URLConstant.GetAppAssetByAppAssetId, appAssetObj).subscribe(
        (response) => {
          this.returnAppAssetObj = response;
          this.AssetDataForm.patchValue({
            MrAssetConditionCode: this.returnAppAssetObj.MrAssetConditionCode,
            AssetUsage: this.returnAppAssetObj.MrAssetUsageCode,
            ChassisNo: this.returnAppAssetObj.SerialNo1,
            EngineNo: this.returnAppAssetObj.SerialNo2,
            LicensePlate: this.returnAppAssetObj.SerialNo5,
            AssetPrice: this.returnAppAssetObj.AssetPriceAmt,
            DownPayment: this.returnAppAssetObj.DownPaymentAmt,
            Notes: this.returnAppAssetObj.AssetNotes,
            ManufacturingYear: this.returnAppAssetObj.ManufacturingYear,
            AssetTypeCode: this.returnAppAssetObj.AssetTypeCode,
            AssetCategoryCode: this.returnAppAssetObj.AssetCategoryCode,
          });

          this.items = this.AssetDataForm.get('items') as FormArray;
          this.http.post(URLConstant.GetListSerialNoLabelByAssetTypeCode, { Code: this.returnAppAssetObj.AssetTypeCode }).subscribe(
            (response: any) => {
              while (this.items.length) {
                this.items.removeAt(0);
              }

              this.SerialNoList = response[CommonConstant.ReturnObj];
              for (let i = 0; i < this.SerialNoList.length; i++) {
                let eachDataDetail = this.fb.group({
                  SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                  SerialNoValue: [''],
                  IsMandatory: [this.SerialNoList[i].IsMandatory]
                }) as FormGroup;
                this.items.push(eachDataDetail);
                if (this.items.controls[i]['controls']['IsMandatory'].value == true) {
                  this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                  this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
                }
              }
            }
          );

          var reqByCode = new GenericObj();
          reqByCode.Code = this.returnAppAssetObj.FullAssetCode;
          this.http.post(URLConstant.GetAssetMasterForLookup, reqByCode).subscribe(
            (response) => {
              this.resAssetMasterObj = response;
              this.InputLookupAssetObj.nameSelect = this.resAssetMasterObj.FullAssetName;
              this.InputLookupAssetObj.jsonSelect = this.resAssetMasterObj;
              this.AssetDataForm.patchValue({
                FullAssetCode: this.resAssetMasterObj.FullAssetCode,
                FullAssetName: this.resAssetMasterObj.FullAssetName,
              });
            });

          let ReqGetVendorLookup : GenericObj = new GenericObj();
          ReqGetVendorLookup.Code = this.returnAppAssetObj.SupplCode;
          this.http.post(URLConstant.GetVendorForLookup, ReqGetVendorLookup).subscribe(
            (response) => {
              this.returnVendorObj = response;
              this.InputLookupSupplierObj.nameSelect = this.returnVendorObj.VendorName;
              this.InputLookupSupplierObj.jsonSelect = this.returnVendorObj;
              this.AssetDataForm.patchValue({
                SupplCode: this.returnVendorObj.VendorCode,
                SupplName: this.returnVendorObj.VendorName,
              });

              let getAppAssetSupplEmpByBranchManager = new GenericObj();
              getAppAssetSupplEmpByBranchManager.Id = this.AppAssetId;
              getAppAssetSupplEmpByBranchManager.Code = CommonConstant.BRANCH_MANAGER_JOB_CODE;
              this.http.post(URLConstant.GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode, getAppAssetSupplEmpByBranchManager).subscribe(
                (response) => {
                  this.branchAppAssetSupplEmpObj = response;

                  let branchObj : GenericObj = new GenericObj();
                  branchObj.Id = this.returnVendorObj.VendorId;
                  branchObj.Code = 'BRANCH_MANAGER';
                  this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, branchObj).subscribe(
                    (response) => {
                      this.branchAppAssetSupplEmpObj = response;

                      let branchMngrObj : GenericObj = new GenericObj();
                      branchMngrObj.Id = this.returnVendorObj.VendorId;
                      branchMngrObj.Code = 'BRANCH_MANAGER';
                      this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, branchMngrObj).subscribe(
                        (response) => {
                          this.listBranchObj = response[CommonConstant.ReturnObj];
                          this.AssetDataForm.patchValue({
                            BranchManagerNo: this.branchAppAssetSupplEmpObj.SupplEmpNo,
                            BranchManagerName: this.branchAppAssetSupplEmpObj.SupplEmpName
                          });
                        });
                    }
                  );
                });

              let getAppAssetSupplEmpByAdminHead = new GenericObj();
              getAppAssetSupplEmpByAdminHead.Id = this.AppAssetId;
              getAppAssetSupplEmpByAdminHead.Code = CommonConstant.ADMIN_HEAD_JOB_CODE;
              this.http.post(URLConstant.GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode, getAppAssetSupplEmpByAdminHead).subscribe(
              (response) => {
                this.headAppAssetSupplEmpObj = response;

                let adminHeadObj : GenericObj = new GenericObj();
                adminHeadObj.Id = this.returnVendorObj.VendorId;
                adminHeadObj.Code = 'ADMIN_HEAD';
                this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, adminHeadObj).subscribe(
                (response) => {
                  this.headAppAssetSupplEmpObj = response;

                  let reqAdminHeadObj : GenericObj = new GenericObj();
                  reqAdminHeadObj.Id = this.returnVendorObj.VendorId;
                  reqAdminHeadObj.Code = 'ADMIN_HEAD';
                  this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, reqAdminHeadObj).subscribe(
                    (response) => {
                      this.listAdminHeadObj = response[CommonConstant.ReturnObj];
                      this.AssetDataForm.patchValue({
                        AdminHeadNo: this.headAppAssetSupplEmpObj.SupplEmpNo,
                        AdminHeadName: this.headAppAssetSupplEmpObj.SupplEmpName
                      });
                    });
                });
              });

              let getAppAssetSupplEmpBySalesPerson = new GenericObj();
              getAppAssetSupplEmpBySalesPerson.Id = this.AppAssetId;
              getAppAssetSupplEmpBySalesPerson.Code = CommonConstant.SALES_JOB_CODE;
              this.http.post(URLConstant.GetAppAssetSupplEmpByAppAssetIdAndMrSupplEmpPositionCode, getAppAssetSupplEmpBySalesPerson).subscribe(
              (response) => {
                this.salesAppAssetSupplEmpObj = response;

                let salesObj : GenericObj = new GenericObj();
                salesObj.Id = this.returnVendorObj.VendorId;
                salesObj.Code = 'SALES_PERSON';
                this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, salesObj).subscribe(
                (response) => {
                  this.salesAppAssetSupplEmpObj = response;

                  let reqSalesObj : GenericObj = new GenericObj();
                  reqSalesObj.Id = this.returnVendorObj.VendorId;
                  reqSalesObj.Code = 'SALES_PERSON';
                  this.http.post(URLConstant.GetListKeyValueVendorEmpByVendorIdAndPosition, reqSalesObj).subscribe(
                    (response) => {
                      this.listSalesObj = response[CommonConstant.ReturnObj];
                      this.AssetDataForm.patchValue({
                        SalesPersonNo: this.salesAppAssetSupplEmpObj.SupplEmpNo,
                        SalesPersonName: this.salesAppAssetSupplEmpObj.SupplEmpName
                      });
                    });
                });
              });
            });
        });

      this.appCollateralObj = new AppCollateralObj();
      this.appCollateralObj.AppId = this.AppId;
      this.appCollateralObj.Id = this.AppId;
      this.http.post(URLConstant.GetAppCollateralByAppId, this.appCollateralObj).subscribe(
        (response) => {
          this.returnAppCollateralObj = response;

          this.appCollateralRegistObj = new AppCollateralRegistrationObj();
          this.appCollateralRegistObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
          this.appCollateralRegistObj.Id = this.returnAppCollateralObj.AppCollateralId;
          this.http.post(URLConstant.GetAppCollateralRegistrationByAppCollateralId, this.appCollateralRegistObj).subscribe(
            (response) => {
              this.returnAppCollateralRegistObj = response;
              this.AssetDataForm.patchValue({
                Username: this.returnAppCollateralRegistObj.UserName,
                UserRelationship: this.returnAppCollateralRegistObj.MrUserRelationshipCode
              });

              this.locationAddrObj = new AppCustAddrObj();
              this.locationAddrObj.Addr = this.returnAppCollateralRegistObj.LocationAddr;
              this.locationAddrObj.AreaCode3 = this.returnAppCollateralRegistObj.LocationAreaCode3;
              this.locationAddrObj.AreaCode4 = this.returnAppCollateralRegistObj.LocationAreaCode4;
              this.locationAddrObj.AreaCode1 = this.returnAppCollateralRegistObj.LocationAreaCode1;
              this.locationAddrObj.AreaCode2 = this.returnAppCollateralRegistObj.LocationAreaCode2;
              this.locationAddrObj.City = this.returnAppCollateralRegistObj.LocationCity;

              this.inputFieldLocationAddrObj = new InputFieldObj();
              this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
              this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;
              this.inputFieldLocationAddrObj.inputLookupObj.nameSelect = this.returnAppCollateralRegistObj.LocationZipcode;
              this.inputFieldLocationAddrObj.inputLookupObj.jsonSelect = { Zipcode: this.returnAppCollateralRegistObj.LocationZipcode };
              this.inputAddressObjForLoc.default = this.locationAddrObj;
              this.inputAddressObjForLoc.inputField = this.inputFieldLocationAddrObj;
            });
        });
    }

    this.GetListAddr();

    this.inputFieldLocationAddrObj = new InputFieldObj();
    this.inputFieldLocationAddrObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationAddrObj.inputLookupObj.isRequired = false;

    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

    this.InputLookupAssetObj = new InputLookupObj();
    this.InputLookupAssetObj.urlJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupAssetObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupAssetObj.pagingJson = "./assets/uclookup/NAP/lookupAsset.json";
    this.InputLookupAssetObj.genericJson = "./assets/uclookup/NAP/lookupAsset.json";

    this.assetConditionObj = new RefMasterObj();
    this.assetConditionObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetCondition;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetConditionObj).subscribe(
      (response) => {
        this.returnAssetConditionObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ MrAssetConditionCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.downPaymentObj = new RefMasterObj();
    this.downPaymentObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeDownPaymentType;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.downPaymentObj).subscribe(
      (response) => {
        this.returnDownPaymentObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ MrDownPaymentTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.userRelationshipObj = new RefMasterObj();
    this.userRelationshipObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustPersonalRelationship;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.userRelationshipObj).subscribe(
      (response) => {
        this.returnUserRelationshipObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({ UserRelationship: response[CommonConstant.ReturnObj][0]['Key'] });
      }
    );

    this.assetUsageObj = new RefMasterObj();
    this.assetUsageObj.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeAssetUsage;
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, this.assetUsageObj).subscribe(
      (response) => {
        this.returnAssetUsageObj = response[CommonConstant.ReturnObj];
        this.AssetDataForm.patchValue({
          AssetUsage: response['ReturnObject'][0]['Key']
        });
      }
    );

    this.http.post(URLConstant.GetRefCoy, null).subscribe(
      (response) => {
        this.returnRefCoyObj = response;
        this.AssetDataForm.patchValue({
          OwnerName: this.returnRefCoyObj.FullName,
          OwnerIdType: "NPWP",
          OwnerIdNo: this.returnRefCoyObj.TaxIdNo,
          OwnerAddr: this.returnRefCoyObj.Addr,
          OwnerAreaCode1: this.returnRefCoyObj.AreaCode1,
          OwnerAreaCode2: this.returnRefCoyObj.AreaCode2,
          OwnerAreaCode3: this.returnRefCoyObj.AreaCode3,
          OwnerAreaCode4: this.returnRefCoyObj.AreaCode4,
          OwnerZipcode: this.returnRefCoyObj.Zipcode,
          OwnerMobilePhn: this.returnRefCoyObj.Phn1
        });
      }
    );
  }

  setSupplierInfo() {
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpName = this.AssetDataForm.controls["AdminHeadName"].value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.SupplEmpNo = this.AssetDataForm.controls["AdminHeadNo"].value;
    this.allAssetDataObj.AppAssetSupplEmpAdminObj.MrSupplEmpPositionCode = "ADMIN_HEAD";

    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpName = this.AssetDataForm.controls["SalesPersonName"].value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.SupplEmpNo = this.AssetDataForm.controls["SalesPersonNo"].value;
    this.allAssetDataObj.AppAssetSupplEmpSalesObj.MrSupplEmpPositionCode = "SALES_PERSON";

    if (this.AssetDataForm.controls["BranchManagerName"].value == "") {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = "-";
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = "-";
    } else {
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpName = this.AssetDataForm.controls["BranchManagerName"].value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.SupplEmpNo = this.AssetDataForm.controls["BranchManagerNo"].value;
      this.allAssetDataObj.AppAssetSupplEmpManagerObj.MrSupplEmpPositionCode = CommonConstant.BRANCH_MANAGER_JOB_CODE;
    }
  }

  // MrDownPaymentTypeCode:[''],

  setAssetInfo() {
    this.allAssetDataObj.AppAssetObj.AppId = this.AppId;
    this.allAssetDataObj.AppAssetObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    this.allAssetDataObj.AppAssetObj.MrAssetUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    this.allAssetDataObj.AppAssetObj.SerialNo1 = this.AssetDataForm.controls["ChassisNo"].value;
    this.allAssetDataObj.AppAssetObj.SerialNo2 = this.AssetDataForm.controls["EngineNo"].value;
    this.allAssetDataObj.AppAssetObj.SerialNo5 = this.AssetDataForm.controls["LicensePlate"].value;
    this.allAssetDataObj.AppAssetObj.SupplName = this.AssetDataForm.controls["SupplName"].value;
    this.allAssetDataObj.AppAssetObj.SupplCode = this.AssetDataForm.controls["SupplCode"].value;
    this.allAssetDataObj.AppAssetObj.AssetPriceAmt = this.AssetDataForm.controls["AssetPrice"].value;
    this.allAssetDataObj.AppAssetObj.DownPaymentAmt = this.AssetDataForm.controls["DownPayment"].value;
    this.allAssetDataObj.AppAssetObj.AssetNotes = this.AssetDataForm.controls["Notes"].value;
    this.allAssetDataObj.AppAssetObj.ManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;

    this.allAssetDataObj.AppAssetObj.AssetSeqNo = 1;
    this.allAssetDataObj.AppAssetObj.FullAssetCode = this.AssetDataForm.controls["FullAssetCode"].value;

    if (this.AppAssetId == 0) {
      this.allAssetDataObj.AppAssetObj.AssetStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.CollateralStat = "NEW";
    }
    else {
      this.allAssetDataObj.AppAssetObj.AssetStat = "NEW";
      this.allAssetDataObj.AppCollateralObj.CollateralStat = "NEW";
    }

    this.allAssetDataObj.AppAssetObj.AssetTypeCode = this.AssetDataForm.controls["AssetTypeCode"].value;
    this.allAssetDataObj.AppAssetObj.AssetCategoryCode = this.AssetDataForm.controls["AssetCategoryCode"].value;
    this.allAssetDataObj.AppAssetObj.IsCollateral = true;
    this.allAssetDataObj.AppAssetObj.IsInsurance = true;

    this.allAssetDataObj.AppCollateralObj.AppId = this.AppId;
    this.allAssetDataObj.AppCollateralObj.CollateralSeqNo = 1;
    this.allAssetDataObj.AppCollateralObj.FullAssetCode = this.AssetDataForm.controls["FullAssetCode"].value;
    this.allAssetDataObj.AppCollateralObj.FullAssetName = this.AssetDataForm.controls["FullAssetName"].value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralConditionCode = this.AssetDataForm.controls["MrAssetConditionCode"].value;
    this.allAssetDataObj.AppCollateralObj.MrCollateralUsageCode = this.AssetDataForm.controls["AssetUsage"].value;
    this.allAssetDataObj.AppCollateralObj.SerialNo1 = this.AssetDataForm.controls["ChassisNo"].value;
    this.allAssetDataObj.AppCollateralObj.SerialNo2 = this.AssetDataForm.controls["EngineNo"].value;
    this.allAssetDataObj.AppCollateralObj.SerialNo5 = this.AssetDataForm.controls["LicensePlate"].value;
    this.allAssetDataObj.AppCollateralObj.CollateralValueAmt = this.AssetDataForm.controls["AssetPrice"].value;
    this.allAssetDataObj.AppCollateralObj.AssetTypeCode = this.AssetDataForm.controls["AssetTypeCode"].value;
    this.allAssetDataObj.AppCollateralObj.AssetCategoryCode = this.AssetDataForm.controls["AssetCategoryCode"].value;
    this.allAssetDataObj.AppCollateralObj.ManufacturingYear = this.AssetDataForm.controls["ManufacturingYear"].value;

  }

  setAssetUser() {
    this.allAssetDataObj.AppCollateralRegistrationObj.UserName = this.AssetDataForm.controls["Username"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrUserRelationshipCode = this.AssetDataForm.controls["UserRelationship"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerName = this.AssetDataForm.controls["OwnerName"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.MrIdTypeCode = this.AssetDataForm.controls["OwnerIdType"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerIdNo = this.AssetDataForm.controls["OwnerIdNo"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAddr = this.AssetDataForm.controls["OwnerAddr"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode1 = this.AssetDataForm.controls["OwnerAreaCode1"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode2 = this.AssetDataForm.controls["OwnerAreaCode2"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode3 = this.AssetDataForm.controls["OwnerAreaCode3"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerAreaCode4 = this.AssetDataForm.controls["OwnerAreaCode4"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerZipcode = this.AssetDataForm.controls["OwnerZipcode"].value;
    this.allAssetDataObj.AppCollateralRegistrationObj.OwnerMobilePhnNo = this.AssetDataForm.controls["OwnerMobilePhn"].value;

  }

  setAssetLocation() {
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAddr = this.AssetDataForm.controls["assetLocationAddress"]["controls"].Addr.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode1 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode1.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode2 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode2.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode3 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode3.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationAreaCode4 = this.AssetDataForm.controls["assetLocationAddress"]["controls"].AreaCode4.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationCity = this.AssetDataForm.controls["assetLocationAddress"]["controls"].City.value;
    this.allAssetDataObj.AppCollateralRegistrationObj.LocationZipcode = this.AssetDataForm.controls["assetLocationAddressZipcode"]["controls"].value.value;
  }

  SaveForm() {
    if (this.mode == 'addAsset') {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.allAssetDataObj.AppAssetObj.AppAssetId = 0;
      this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          //this.router.navigate(["/Nap/AssetData/Paging"]);
          this.assetValue.emit({ mode: 'paging' });
        });
    }
    else {
      this.allAssetDataObj = new AllAssetDataObj();
      this.setSupplierInfo();
      this.setAssetInfo();
      this.setAssetUser();
      this.setAssetLocation();
      this.allAssetDataObj.AppAssetObj.RowVersion = this.returnAppAssetObj.RowVersion;
      this.allAssetDataObj.AppCollateralObj.RowVersion = this.returnAppCollateralObj.RowVersion;
      this.allAssetDataObj.AppCollateralRegistrationObj.RowVersion = this.returnAppCollateralRegistObj.RowVersion;
      this.allAssetDataObj.AppAssetObj.AppAssetId = this.AppAssetId;
      this.allAssetDataObj.AppCollateralObj.AppCollateralId = this.returnAppCollateralObj.AppCollateralId;
      this.allAssetDataObj.AppCollateralRegistrationObj.AppCollateralRegistrationId = this.returnAppCollateralRegistObj.AppCollateralRegistrationId;
      this.http.post(URLConstant.AddEditAllAssetData, this.allAssetDataObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          //this.router.navigate(["/Nap/AssetData/Paging"]);
          this.assetValue.emit({ mode: 'paging' });
        });
    }
  }
}
