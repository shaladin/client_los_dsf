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

@Component({
  selector: 'app-collateral-add-edit-single',
  templateUrl: './collateral-add-edit-single.component.html',
  styleUrls: ['./collateral-add-edit-single.component.scss']
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
    FullAssetCode: ['',Validators.required],
    MrCollateralConditionCode: ['',Validators.required],
    MrCollateralUsageCode: ['',Validators.required],
    CollateralStat: ['NEW', Validators.required],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    CollateralValueAmt: ['', Validators.required],
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
    Notes: ['', Validators.required],
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

  AppCollateralId : any;

  constructor(private modalService: NgbModal, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
      this.AgrmntId = params['AgrmntId'];
      this.AppAssetId = params['AppAssetId']
    });
  }
   async ngOnInit() {
    await this.bindUcLookup();
    await this.bindUcSearch();
    await this.bindAppData();


    this.GetListAppCollateralByAppId();
    console.log(this.listCollateralData);
    var appAssetobj = {
      AppId: this.AppId
    }

    this.items = this.AddCollForm.get('items') as FormArray;
    this.ListAttr = this.AddCollForm.get('ListAttr') as FormArray;

    this.http.post(AdInsConstant.GetAppAssetByAppId, appAssetobj).subscribe(
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
        var attrListobj = {
          AssetTypeCode: this.AddCollForm.controls.AssetTypeCode.value
        }
        
        this.http.post(AdInsConstant.GetRefAssetDocList, assetDocListobj).subscribe(
          (response) => {
            if (response["ReturnObject"].length > 0) {
              for (var i = 0; i < response["ReturnObject"].length; i++) {
                var assetDocumentDetail = this.fb.group({
                  DocCode: response["ReturnObject"][i].AssetDocCode,
                  AssetDocName: response["ReturnObject"][i].AssetDocName,
                  IsValueNeeded: response["ReturnObject"][i].IsValueNeeded,
                  IsMandatoryNew: response["ReturnObject"][i].IsMandatoryNew,
                  IsMandatoryUsed: response["ReturnObject"][i].IsMandatoryUsed,
                  IsReceived: response["ReturnObject"][i].IsReceived,
                  DocNo: response["ReturnObject"][i].DocNo,
                  ACDExpiredDt: response["ReturnObject"][i].ACDExpiredDt,
                  DocNotes: response["ReturnObject"][i].DocNotes
                }) as FormGroup;
                this.items.push(assetDocumentDetail);
              }
            }
          }
        );
        
        var AppIdObj = {
          AppId : this.AppId
        }
        this.http.post(AdInsConstant.GetAppCollateralByAppId, AppIdObj).subscribe(
          (response) => {
    
            var AppCollateralObj : any;
    
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
    
    
            var AppCollateralRegistration : any;
            this.http.post(AdInsConstant.GetAppCollateralRegistrationByAppCollateralId, AppCollateralObj).subscribe(
              (response) => {
      
                AppCollateralRegistration = response;
      
                this.AddCollForm.patchValue({
                  OwnerName : AppCollateralRegistration.OwnerName,
                  MrIdType : AppCollateralRegistration.MrIdTypeCode,
                  OwnerIdNo : AppCollateralRegistration.OwnerIdNo,
                  OwnerMobilePhnNo : AppCollateralRegistration.OwnerMobilePhnNo,
                  MrOwnerRelationshipCode : AppCollateralRegistration.MrOwnerRelationshipCode,
                  UserName : AppCollateralRegistration.UserName,
                  MrUserRelationshipCode : AppCollateralRegistration.MrUserRelationshipCode,
                  Notes : AppCollateralRegistration.Notes
                  
                })
      
                this.locationAddrObj = new AddrObj();
                this.locationAddrObj.Addr = AppCollateralRegistration.LocationAddr;
                this.locationAddrObj.AreaCode1 =AppCollateralRegistration.LocationAreaCode1;
                this.locationAddrObj.AreaCode2 = AppCollateralRegistration.LocationAreaCode2;
                this.locationAddrObj.AreaCode3 = AppCollateralRegistration.LocationAreaCode3;
                this.locationAddrObj.AreaCode4 = AppCollateralRegistration.LocationAreaCode4;
                this.locationAddrObj.City =AppCollateralRegistration.LocationCity;
                this.inputFieldLocationObj.inputLookupObj.nameSelect = AppCollateralRegistration.LocationZipcode;
                this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.LocationZipcode };
      
      
                this.OwnerAddrObj = new AddrObj();
                this.OwnerAddrObj.Addr = AppCollateralRegistration.OwnerAddr;
                this.OwnerAddrObj.AreaCode1 =AppCollateralRegistration.OwnerAreaCode1;
                this.OwnerAddrObj.AreaCode2 = AppCollateralRegistration.OwnerAreaCode2;
                this.OwnerAddrObj.AreaCode3 = AppCollateralRegistration.OwnerAreaCode3;
                this.OwnerAddrObj.AreaCode4 = AppCollateralRegistration.OwnerAreaCode4;
                this.OwnerAddrObj.City =AppCollateralRegistration.OwnerCity;
            
                this.inputFieldLegalObj.inputLookupObj.nameSelect = AppCollateralRegistration.OwnerZipcode;
                this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.OwnerZipcode };
                  console.log(AppCollateralRegistration)
              });
              var Obj2 = {
                AppCollateralId : this.AppCollateralId
              }
              this.http.post(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, Obj2).subscribe(
                (response) => {
                   this.AppCollateralDocs = response["AppCollateralDocs"];
                  if (this.AppCollateralDocs["length"] > 0) {
                    for (var i = 0; i < this.AppCollateralDocs["length"]; i++) {
                      this.AddCollForm.controls.items["controls"][i].patchValue({
                          DocNo : this.AppCollateralDocs[i].DocNo,
                          DocNotes : this.AppCollateralDocs[i].DocNotes,
                          ACDExpiredDt: formatDate(this.AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                          IsReceived : this.AppCollateralDocs[i].IsReceived
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
    var refMasterObj = { RefMasterTypeCode: "CUST_PERSONAL_RELATIONSHIP" };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.OwnerRelationshipObj = response["ReturnObject"];
        if (this.OwnerRelationshipObj.length > 0) {
          this.AddCollForm.patchValue({
            OwnerRelationship: this.OwnerRelationshipObj[0].Key,
            CopyFromLegal: this.copyToLocationObj[0].Key
          });
        }
      }
    );

    var attrobj = {};
    this.http.post(AdInsConstant.GetListRefAppAttrCollateral, attrobj).subscribe(
      (response) => {
        this.listRefAppAttr = response['ReturnObject'];
        console.log("this.listRefAppAttr");
        console.log(this.listRefAppAttr);
        for (let i = 0; i < this.listRefAppAttr["length"]; i++) {
          var Attr = this.fb.group({
            AppAttrValue: this.listRefAppAttr[i].AppAttrValue,
          }) as FormGroup;
          this.ListAttr.push(Attr);
        }
      }
    )

    var appIdObj = { AppId: this.AppId }
    console.log(appIdObj);
    this.http.post(AdInsConstant.GetAppCollateralByAppCollateralId, appIdObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })

    var assetObj = {};
    this.http.post(AdInsConstant.GetListKeyValueByCode, assetObj).subscribe(
      (response) => {
        this.CollTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          AssetTypeCode: this.CollTypeList[0].Key
        });
      })

    var refMasterObj = { RefMasterTypeCode: 'ID_TYPE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.IdTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          MrIdType: this.IdTypeList[0].Key
        });
      })

    var refMasterObj = { RefMasterTypeCode: 'ASSET_CONDITION' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        console.log(response);
        this.ConditionCodeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          MrCollateralConditionCode: this.ConditionCodeList[0].Key
        });
      })


    var refMasterObj = { RefMasterTypeCode: 'ASSET_USAGE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.UsageCodeList = response['ReturnObject'];
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
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + AdInsConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = new Array();

  }

  searchSort(event: any) {
    if (this.resultData != null) {
      if (this.orderByKey == event.target.attributes.name.nodeValue) {
        this.orderByValue = !this.orderByValue
      } else {
        this.orderByValue = true
      }
      this.orderByKey = event.target.attributes.name.nodeValue
      let order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
    }
  }

  Checked(VerfQuestionAnswerId: any, isChecked: any): void {
    console.log(VerfQuestionAnswerId);
    if (isChecked) {
      this.listSelectedId.push(VerfQuestionAnswerId);
    } else {
      const index = this.listSelectedId.indexOf(VerfQuestionAnswerId)
      console.log(index);
      if (index > -1) { this.listSelectedId.splice(index, 1); }
    }
    console.log('Sel', this.listSelectedId);
  }

  searchPagination(event: number) {
    this.pageNow = event;
    let order = null;
    if (this.orderByKey != null) {
      order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
    }
    this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
  }

  getResult(event) {
    this.resultData = event.response;
    this.totalData = event.response.Count;
    // this.UCGridFooter.pageNow = event.pageNow;
    // this.UCGridFooter.totalData = this.totalData;
    // this.UCGridFooter.resultData = this.resultData;
  }

  onSelect(event) {
    this.pageNow = event.pageNow;
    this.pageSize = event.pageSize;
    this.totalData = event.Count;
    this.searchPagination(this.pageNow);
  }

  GetListAppCollateralByAppId() {
    var obj = {
      AppId: this.AppId,
    }
    var getListUrl = AdInsConstant.GetListAppCollateralByAppId;
    this.http.post(getListUrl, obj).subscribe(
      (response) => {
        console.log(response);
        this.listCollExisting = response['ReturnObject'];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  SelectAll(condition) {
    this.checkboxAll = condition;
    console.log(condition);
    if (condition) {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        if (this.listSelectedId.indexOf(this.resultData.Data[i].AppCollateralId) < 0) {
          this.listSelectedId.push(this.resultData.Data[i].AppCollateralId);
        }
      }

    } else {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        let index = this.listSelectedId.indexOf(this.resultData.Data[i].AppCollateralId);
        if (index > -1) {
          this.listSelectedId.splice(index, 1);
        }
        console.log(this.resultData.Data[i]);
      }
    }
    console.log(this.checkboxAll);
    console.log(this.listSelectedId);
  }

  addToTemp() {
    if (this.listSelectedId.length != 0) {
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
      }
      for (var i = 0; i < this.listSelectedId.length; i++) {
        var object = this.resultData.Data.find(x => x.AppCollateralId == this.listSelectedId[i]);
        this.tempData.push(object);
        console.log(this.tempData);
      }

      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "APP_COLLATERAL_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      this.arrAddCrit.push(addCrit);

      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
      this.listSelectedId = [];
      this.checkboxAll = false;
    } else {
      this.toastr.typeErrorCustom("Please select at least one Collateral");
    }
  }

  deleteFromTemp(AppCollateralId: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }

      var index = this.tempListId.indexOf(AppCollateralId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "APP_COLLATERAL_ID";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.tempListId;
      if (this.tempListId.length != 0) {
        this.arrAddCrit.push(addCrit);
      }
      var order = null;
      if (this.orderByKey != null) {
        order = {
          key: this.orderByKey,
          value: this.orderByValue
        };
      }
      this.inputObj.addCritInput = this.arrAddCrit;
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order, this.arrAddCrit);
    }
  }

  open(content) {
    // this.type = "Add";
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getLookupCollateralTypeResponse(e) {
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName
    });
  }

  onItemChange(value) {
    // console.log(value);
    // this.inputLookupObj = new InputLookupObj();
    // this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    // this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    // this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    // this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    // this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";

    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.FULL_ASSET_CODE';
    this.criteriaObj.value = value;
    this.criteriaList.push(this.criteriaObj);
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

    // console.log(appCollObj);
    console.log(this.appCollateralDataObj);
    if (this.type == 'Add') {
      this.http.post(AdInsConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          //this.router.navigate(["/Nap/AssetData/Paging"]);

        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.http.post(AdInsConstant.AddEditAllCollateralData, this.appCollateralDataObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    this.bindAppData();
    this.outputTab.emit({ StatusCode: "200" });
  }

  setCollateralInfo() {
    this.appCollateralDataObj.AppCollateralObj.AppId = this.AppId;
    this.appCollateralDataObj.AppCollateralObj.AppAssetId = this.AppAssetId;
    this.appCollateralDataObj.AppCollateralObj.AgrmntId = this.AgrmntId;
    this.appCollateralDataObj.AppCollateralObj.CollateralSeqNo = "1";
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
    this.appCollateralDataObj.AppCollateralObj.IsMainCollateral = 1;

    if (this.type == 'Edit') {
      this.appCollateralObj.AppCollateralId = this.AddCollForm.controls.AppCollateralId;
      this.appCollateralObjRegistration.AppCollateralRegistrationId = this.AddCollDataForm.controls.AppCollateralRegistrationId;
      this.appCollateralObjRegistration.AppCollateralId = this.AddCollForm.controls.AppCollateralId;

      this.appCollateralObj.RowVersion = this.AddCollForm.controls.RowVersionCollateral;
      this.appCollateralObjRegistration.RowVersion = this.AddCollForm.controls.RowVersionCollateralRegistration;
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
    this.locationAddrObj.Addr = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Addr.value;
    this.locationAddrObj.AreaCode1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode1.value;
    this.locationAddrObj.AreaCode2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode2.value;
    this.locationAddrObj.AreaCode3 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode3.value;
    this.locationAddrObj.AreaCode4 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].AreaCode4.value;
    this.locationAddrObj.City = this.AddCollForm.controls["OwnerAddrObj"]["controls"].City.value;
    this.locationAddrObj.Fax = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Fax.value;
    this.locationAddrObj.FaxArea = this.AddCollForm.controls["OwnerAddrObj"]["controls"].FaxArea.value;
    this.locationAddrObj.Phn1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Phn1.value;
    this.locationAddrObj.Phn2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].Phn2.value;
    this.locationAddrObj.PhnArea1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnArea1.value;
    this.locationAddrObj.PhnArea2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnArea2.value;
    this.locationAddrObj.PhnExt1 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnExt1.value;
    this.locationAddrObj.PhnExt2 = this.AddCollForm.controls["OwnerAddrObj"]["controls"].PhnExt2.value;
    this.locationAddrObj.SubZipcode = this.AddCollForm.controls["OwnerAddrObj"]["controls"].SubZipcode.value;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["OwnerAddrObjZipcode"]["controls"].value.value };
  }

  editData(content, AppCollId) {
    this.type = "Edit";
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    var collObj = { AppCollateralId: AppCollId };
    this.http.post(AdInsConstant.AddEditAllCollateralData, collObj).subscribe(
      (response) => {
        this.collateralObj = response['AppCollateral'];
        this.collateralRegistrationObj = response['AppCollateralRegistration'];

        this.AddCollForm.patchValue({
          AppCollateralId: this.collateralObj.AppCollateralId,
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
          CollateralValueAmt: this.collateralObj.CollateralValueAmt,
          CollateralNotes: this.collateralObj.Notes,
          AssetTaxDt: this.collateralObj.AssetTaxDt,
          CollateralPrcnt: this.collateralObj.CollateralPrcnt,
          IsMainCollateral: this.collateralObj.IsMainCollateral,
          ManufacturingYear: this.collateralObj.ManufacturingYear,
          RowVersionCollateral: this.collateralObj.RowVersion,

          AppCollateralRegistrationId: this.collateralRegistrationObj.AppCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdTypeCode: this.collateralRegistrationObj.MrIdType,
          MrOwnerRelationshipCode: this.collateralRegistrationObj.OwnerRelationship,
          MrUserRelationshipCode: this.collateralRegistrationObj.MrUserRelationshipCode,
          Notes: this.collateralRegistrationObj.Notes,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        this.OwnerAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.OwnerAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.OwnerAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.OwnerAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.OwnerAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.OwnerAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null) this.OwnerAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null) this.OwnerAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.OwnerAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.OwnerAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.Zipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.Zipcode };

        this.locationAddrObj.Addr = this.collateralRegistrationObj.LocationAddr;
        this.locationAddrObj.City = this.collateralRegistrationObj.LocationCity;
        this.locationAddrObj.AreaCode1 = this.collateralRegistrationObj.LocationAreaCode1;
        this.locationAddrObj.AreaCode2 = this.collateralRegistrationObj.LocationAreaCode2;
        this.locationAddrObj.AreaCode3 = this.collateralRegistrationObj.LocationAreaCode3;
        this.locationAddrObj.AreaCode4 = this.collateralRegistrationObj.LocationAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.locationAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.Zipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.Zipcode };
      })
  }

  Cancel() {
    this.modalService.dismissAll();
  }

  delete(AppCustCollId) {
    var appCollObj = { AppCollateralId: AppCustCollId };
    this.http.post(AdInsConstant.DeleteAppCollateral, appCollObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  next() {
    
  }

  back() {
    this.outputTab.emit({ StatusCode: "-1" });
  }
  checkIsiForm() {
    console.log(this.AddCollForm);
  }
  getLookupAppCollateralResponse(event) {
    var AppCollateralIdObj = { AppCollateralId: event.AppCollateralId }
    var AppCollateralObj: any;
    this.http.post(AdInsConstant.GetAppCollateralByAppCollateralId, AppCollateralIdObj).subscribe(
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
      var AppCollateralRegistration : any;
      this.http.post(AdInsConstant.GetAppCollateralRegistrationByAppCollateralId, AppCollateralIdObj).subscribe(
        (response) => {

          AppCollateralRegistration = response;

          this.AddCollForm.patchValue({
            OwnerName : AppCollateralRegistration.OwnerName,
            MrIdType : AppCollateralRegistration.MrIdTypeCode,
            OwnerIdNo : AppCollateralRegistration.OwnerIdNo,
            OwnerMobilePhnNo : AppCollateralRegistration.OwnerMobilePhnNo,
            MrOwnerRelationshipCode : AppCollateralRegistration.MrOwnerRelationshipCode,
            UserName : AppCollateralRegistration.UserName,
            MrUserRelationshipCode : AppCollateralRegistration.MrUserRelationshipCode,
            Notes : AppCollateralRegistration.Notes
            
          })

          this.locationAddrObj = new AddrObj();
          this.locationAddrObj.Addr = AppCollateralRegistration.LocationAddr;
          this.locationAddrObj.AreaCode1 =AppCollateralRegistration.LocationAreaCode1;
          this.locationAddrObj.AreaCode2 = AppCollateralRegistration.LocationAreaCode2;
          this.locationAddrObj.AreaCode3 = AppCollateralRegistration.LocationAreaCode3;
          this.locationAddrObj.AreaCode4 = AppCollateralRegistration.LocationAreaCode4;
          this.locationAddrObj.City = AppCollateralRegistration.LocationCity;
          this.inputFieldLocationObj.inputLookupObj.nameSelect = AppCollateralRegistration.LocationZipcode;
          this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.LocationZipcode };

          this.http.post(AdInsConstant.GetListAppCollateralDocsByAppCollateralId, AppCollateralIdObj).subscribe(
            (response) => {
               this.AppCollateralDocs = response["AppCollateralDocs"];
              if (this.AppCollateralDocs["length"] > 0) {
                for (var i = 0; i < this.AppCollateralDocs["length"]; i++) {
                  this.AddCollForm.controls.items["controls"][i].patchValue({
                      DocNo : this.AppCollateralDocs[i].DocNo,
                      DocNotes : this.AppCollateralDocs[i].DocNotes,
                      ACDExpiredDt: formatDate(this.AppCollateralDocs[i].ExpiredDt, 'yyyy-MM-dd', 'en-US'),
                      IsReceived : this.AppCollateralDocs[i].IsReceived
                  })
                }
              }
            }
          );

          this.OwnerAddrObj = new AddrObj();
          this.OwnerAddrObj.Addr = AppCollateralRegistration.OwnerAddr;
          this.OwnerAddrObj.AreaCode1 =AppCollateralRegistration.OwnerAreaCode1;
          this.OwnerAddrObj.AreaCode2 = AppCollateralRegistration.OwnerAreaCode2;
          this.OwnerAddrObj.AreaCode3 = AppCollateralRegistration.OwnerAreaCode3;
          this.OwnerAddrObj.AreaCode4 = AppCollateralRegistration.OwnerAreaCode4;
          this.OwnerAddrObj.City = AppCollateralRegistration.OwnerCity;
      
          this.inputFieldLegalObj.inputLookupObj.nameSelect = AppCollateralRegistration.OwnerZipcode;
          this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: AppCollateralRegistration.OwnerZipcode };
            console.log(AppCollateralRegistration)
        });
      
  }
  openExistingLookup() {
    this.IsOpenExisting = true;
  }
}
