import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { MouCustCollateralObj } from 'app/shared/model/MouCustCollateralObj.Model';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/MouCustCollateralRegistrationObj.Model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { UcTempPagingObj } from 'app/shared/model/TempPaging/UcTempPagingObj.model';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';

@Component({
  selector: 'app-mou-request-addcoll',
  templateUrl: './mou-request-addcoll.component.html',
  providers: [NGXToastrService]
})
export class MouRequestAddcollComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter<any>();
  @Output() modeDetail: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;
  @ViewChild('LookupCollateral') ucLookupCollateral: UclookupgenericComponent;

  listSelectedId: Array<number> = new Array<number>();
  tempPagingObj: UcTempPagingObj = new UcTempPagingObj();

  mouCustCollateralObj: MouCustCollateralObj;
  mouCustCollateralRegistrationObj: MouCustCollateralRegistrationObj;
  OwnerRelationshipObj: any;

  listCollateralData: any;
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;

  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj;

  collateralObj: MouCustCollateralObj;
  collateralRegistrationObj: any;
  listCollExisting: Array<string> = new Array<string>();

  copyToLocationObj: any = [
    {
      Key: "LEGAL",
      Value: "Legal"
    },
  ];

  CollTypeList: any;
  AssetConditionList: any;
  IdTypeList: any;
  type: any;
  SerialNoList: any;
  items: FormArray;
  isUsed: boolean;
  custNo: string;
  mouCustObj: MouCustObj = new MouCustObj();

  AddCollDataForm = this.fb.group({
  })

  AddCollForm = this.fb.group({
    MouCustCollateralId: [''],
    MouCustCollateralRegistrationId: [''],
    CopyFromLegal: [''],
    AssetTypeCode: ['', [Validators.required]],
    CollateralValueAmt: [0, [Validators.required]],
    FullAssetCode: [''],
    AssetCategoryCode: [''],
    OwnerName: ['', [Validators.required]],
    OwnerRelationship: ['', [Validators.required]],
    OwnerIdNo: ['', [Validators.required]],
    MrIdType: ['', [Validators.required]],
    Notes: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    SerialNo3: [''],
    SerialNo4: [''],
    SerialNo5: [''],
    RowVersionCollateral: [''],
    RowVersionCollateralRegistration: [''],
    items: this.fb.array([]),
    MrCollateralConditionCode: ['']
  })

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { this.type = 'Paging'; }

  ngOnInit() {
    this.items = this.AddCollForm.get('items') as FormArray;
    this.bindUcLookup()
    this.initAddrObj();
    this.bindMouData();
    this.bindUcAddToTempData();
    this.tempPagingObj.isReady = true;
  }

  bindUcAddToTempData() {
    this.tempPagingObj.urlJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";
    this.tempPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.tempPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.tempPagingObj.pagingJson = "./assets/ucpaging/ucTempPaging/MouExistingCollateralTempPaging.json";

    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'CU.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);
  }

  bindMouData() {
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(AdInsConstant.GetMouCustById, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        var returnMouCust = response;
        this.custNo = returnMouCust["CustNo"];
      });

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
    var refMasterObj = { RefMasterTypeCode: "ASSET_CONDITION" };

    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.AssetConditionList = response["ReturnObject"];
        this.AddCollForm.patchValue({ MrCollateralConditionCode: response['ReturnObject'][0]['Key'] });

        if (response['ReturnObject'][0]['Key'] == "USED") {
          this.isUsed = true;
        } else {
          this.isUsed = false;
        }
      }
    );

    var mouCustObj = { MouCustId: this.MouCustId }
    console.log(mouCustObj);
    this.http.post(AdInsConstant.GetMouCustCollateralByMouCustId, mouCustObj).subscribe(
      (response) => {
        this.listCollateralData = response['ReturnObject'];
      })

    var assetObj = {};
    this.http.post(AdInsConstant.GetListAssetTypeByCode, assetObj).subscribe(
      (response) => {
        this.CollTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          AssetTypeCode: this.CollTypeList[0].Key
        });
        this.updateUcLookup(this.CollTypeList[0].Value, true);
      })

    var refMasterObj = { RefMasterTypeCode: 'ID_TYPE' };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.IdTypeList = response['ReturnObject'];
        this.AddCollForm.patchValue({
          MrIdType: this.IdTypeList[0].Key
        });
      })
  }

  bindUcLookup() {
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
  }

  updateUcLookup(value, firstBind) {
    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.IS_ACTIVE';
    this.criteriaObj.value = "1";
    this.criteriaList.push(this.criteriaObj);

    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.IS_FINAL';
    this.criteriaObj.value = "1";
    this.criteriaList.push(this.criteriaObj);

    if (value != null) {
      this.criteriaObj = new CriteriaObj();
      this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
      this.criteriaObj.propName = 'B.ASSET_TYPE_CODE';
      this.criteriaObj.value = value;
      this.criteriaList.push(this.criteriaObj);
    }

    this.inputLookupObj.addCritInput = this.criteriaList;
    if (!firstBind) this.ucLookupCollateral.setAddCritInput();
  }

  getListTemp(ev) {
    this.listSelectedId = ev.TempListId;
  }

  open(pageType) {
    this.tempPagingObj.isReady = false;
    this.type = pageType;
    if (pageType == 'AddExisting') {
      this.clearList();
      var listCollateralNo: Array<string> = new Array();
      for (let index = 0; index < this.listCollateralData.length; index++) {
        if (this.listCollateralData[index].CollateralStat == 'EXISTING')
          listCollateralNo.push(this.listCollateralData[index].CollateralNo);
      }

      if (listCollateralNo.length > 0)
        this.BindExistingCollateralSavedData(listCollateralNo);
    }
  }

  BindExistingCollateralSavedData(listCollateralNo: any) {
    const addCritCustNo = new CriteriaObj();
    addCritCustNo.DataType = 'text';
    addCritCustNo.propName = 'CU.CUST_NO';
    addCritCustNo.restriction = AdInsConstant.RestrictionEq;
    addCritCustNo.value = this.custNo;
    this.tempPagingObj.addCritInput.push(addCritCustNo);

    const addCritCollateralNo = new CriteriaObj();
    addCritCollateralNo.DataType = 'text';
    addCritCollateralNo.propName = 'CL.COLLATERAL_NO';
    addCritCollateralNo.restriction = AdInsConstant.RestrictionNotIn;
    addCritCollateralNo.listValue = listCollateralNo;
    this.tempPagingObj.addCritInput.push(addCritCollateralNo);
    this.tempPagingObj.isReady = true;
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
    this.AddCollForm.patchValue({
      FullAssetCode: e.FullAssetCode,
      FullAssetName: e.FullAssetName,
      AssetCategoryCode: e.AssetCategoryCode
    });

    var AssetTypeCode = { 'AssetTypeCode': e.AssetTypeCode };
    this.http.post(AdInsConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
      (response: any) => {
        while (this.items.length) {
          this.items.removeAt(0);
        }
        this.SerialNoList = response['ReturnObject'];
        for (var i = 0; i < this.SerialNoList["length"]; i++) {
          var eachDataDetail = this.fb.group({
            SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
            SerialNoValue: [''],
            IsMandatory: [this.SerialNoList[i].IsMandatory]
          }) as FormGroup;
          this.items.push(eachDataDetail);
          if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
            this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
            this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
          }
        }
      });
  }

  onItemChange(value) {
    this.updateUcLookup(value, false);
  }

  radioChange(event) {
    if (event.target.value == "USED") {
      this.isUsed = true;
    } else {
      this.isUsed = false;
    }
    for (var i = 0; i < this.items["length"]; i++) {
      if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
        this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      } else {
        this.items.controls[i]['controls']['SerialNoValue'].clearValidators();
        this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
      }
    }
  }
  SaveForm() {
    this.setCollateralObjForSave();
    var custCollObj = {
      MouCustCollateral: this.mouCustCollateralObj,
      MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj
    }

    if (this.collateralObj == null) {

      this.http.post(AdInsConstant.AddMouCustCollateralData, custCollObj).subscribe(
        (response) => {
          console.log(response);
          this.AddCollForm.reset();
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.bindMouData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.http.post(AdInsConstant.EditMouCustCollateralData, custCollObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.type = 'Paging';
          this.collateralObj = null;
          this.bindMouData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  setCollateralObjForSave() {
    this.mouCustCollateralObj = new MouCustCollateralObj;
    this.mouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj;

    if (this.collateralObj != null) {
      this.mouCustCollateralObj = this.collateralObj;
      this.mouCustCollateralRegistrationObj = this.collateralRegistrationObj;
    }
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.AssetTypeCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.mouCustCollateralObj.FullAssetCode = this.AddCollForm.controls.FullAssetCode.value;
    this.mouCustCollateralObj.FullAssetName = this.AddCollForm.controls.FullAssetName.value.value;
    this.mouCustCollateralObj.AssetCategoryCode = this.AddCollForm.controls.AssetCategoryCode.value;
    this.mouCustCollateralObj.MrCollateralConditionCode = this.AddCollForm.controls.MrCollateralConditionCode.value;
    this.mouCustCollateralObj.MrCollateralUsageCode = "COMMERCIAL";
    this.mouCustCollateralObj.CollateralStat = "NEW";

    if (this.items.controls[0] != null) {
      this.mouCustCollateralObj.SerialNo1 = this.items.controls[0]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[1] != null) {
      this.mouCustCollateralObj.SerialNo2 = this.items.controls[1]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[2] != null) {
      this.mouCustCollateralObj.SerialNo3 = this.items.controls[2]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[3] != null) {
      this.mouCustCollateralObj.SerialNo4 = this.items.controls[3]["controls"]["SerialNoValue"].value;
    }
    if (this.items.controls[4] != null) {
      this.mouCustCollateralObj.SerialNo5 = this.items.controls[4]["controls"]["SerialNoValue"].value;
    }

    this.mouCustCollateralObj.CollateralValueAmt = this.AddCollForm.controls.CollateralValueAmt.value;
    this.mouCustCollateralObj.CollateralNotes = this.AddCollForm.controls.Notes.value;

    this.mouCustCollateralRegistrationObj.OwnerName = this.AddCollForm.controls.OwnerName.value;
    this.mouCustCollateralRegistrationObj.OwnerIdNo = this.AddCollForm.controls.OwnerIdNo.value;
    this.mouCustCollateralRegistrationObj.MrIdTypeCode = this.AddCollForm.controls.MrIdType.value;
    this.mouCustCollateralRegistrationObj.MrOwnerRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.MrUserRelationshipCode = this.AddCollForm.controls.OwnerRelationship.value;
    this.mouCustCollateralRegistrationObj.Notes = this.AddCollForm.controls.Notes.value;

    this.mouCustCollateralRegistrationObj.OwnerAddr = this.AddCollForm.controls["legalAddr"]["controls"].Addr.value;
    this.mouCustCollateralRegistrationObj.OwnerCity = this.AddCollForm.controls["legalAddr"]["controls"].City.value;
    this.mouCustCollateralRegistrationObj.OwnerZipcode = this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode1 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode2 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode3 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.mouCustCollateralRegistrationObj.OwnerAreaCode4 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.value;

    this.mouCustCollateralRegistrationObj.LocationAddr = this.AddCollForm.controls["locationAddr"]["controls"].Addr.value;
    this.mouCustCollateralRegistrationObj.LocationCity = this.AddCollForm.controls["locationAddr"]["controls"].City.value;
    this.mouCustCollateralRegistrationObj.LocationZipcode = this.AddCollForm.controls["locationAddrZipcode"]["controls"].value.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode1 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode1.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode2 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode2.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode3 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode3.value;
    this.mouCustCollateralRegistrationObj.LocationAreaCode4 = this.AddCollForm.controls["locationAddr"]["controls"].AreaCode4.value;
  }

  copyToLocation() {
    this.locationAddrObj.Addr = this.AddCollForm.controls["legalAddr"]["controls"].Addr.value;
    this.locationAddrObj.AreaCode1 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode1.value;
    this.locationAddrObj.AreaCode2 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode2.value;
    this.locationAddrObj.AreaCode3 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode3.value;
    this.locationAddrObj.AreaCode4 = this.AddCollForm.controls["legalAddr"]["controls"].AreaCode4.value;
    this.locationAddrObj.City = this.AddCollForm.controls["legalAddr"]["controls"].City.value;
    this.locationAddrObj.Fax = this.AddCollForm.controls["legalAddr"]["controls"].Fax.value;
    this.locationAddrObj.FaxArea = this.AddCollForm.controls["legalAddr"]["controls"].FaxArea.value;
    this.locationAddrObj.Phn1 = this.AddCollForm.controls["legalAddr"]["controls"].Phn1.value;
    this.locationAddrObj.Phn2 = this.AddCollForm.controls["legalAddr"]["controls"].Phn2.value;
    this.locationAddrObj.PhnArea1 = this.AddCollForm.controls["legalAddr"]["controls"].PhnArea1.value;
    this.locationAddrObj.PhnArea2 = this.AddCollForm.controls["legalAddr"]["controls"].PhnArea2.value;
    this.locationAddrObj.PhnExt1 = this.AddCollForm.controls["legalAddr"]["controls"].PhnExt1.value;
    this.locationAddrObj.PhnExt2 = this.AddCollForm.controls["legalAddr"]["controls"].PhnExt2.value;
    this.locationAddrObj.SubZipcode = this.AddCollForm.controls["legalAddr"]["controls"].SubZipcode.value;

    this.inputFieldLocationObj.inputLookupObj.nameSelect = this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value;
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value };
  }

  editData(MouCustCollId) {
    this.type = "AddEdit";
    var collObj = { MouCustCollateralId: MouCustCollId };
    this.http.post(AdInsConstant.GetMouCustCollateralDataForUpdateByMouCustCollateralId, collObj).subscribe(
      (response) => {

        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];
        if (this.collateralObj.MrCollateralConditionCode == "USED") {
          this.isUsed = true;
        } else {
          this.isUsed = false;
        }

        this.inputLookupObj.nameSelect = this.collateralObj.FullAssetName;
        this.inputLookupObj.jsonSelect = this.collateralObj;
        var AssetTypeCode = { 'AssetTypeCode': this.collateralObj.AssetTypeCode };
        this.http.post(AdInsConstant.GetListSerialNoLabelByAssetTypeCode, AssetTypeCode).subscribe(
          (response: any) => {
            while (this.items.length) {
              this.items.removeAt(0);
            }
            this.SerialNoList = response['ReturnObject'];
            for (var i = 0; i < this.SerialNoList["length"]; i++) {
              var eachDataDetail = this.fb.group({
                SerialNoLabel: [this.SerialNoList[i].SerialNoLabel],
                SerialNoValue: ['', Validators.required],
                IsMandatory: [this.SerialNoList[i].IsMandatory]
              }) as FormGroup;
              this.items.push(eachDataDetail);
              if (this.isUsed == true && this.items.controls[i]['controls']['IsMandatory'].value == true) {
                this.items.controls[i]['controls']['SerialNoValue'].setValidators([Validators.required]);
                this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }
              else {
                this.items.controls[i]['controls']['SerialNoValue'].clearValidators();
                this.items.controls[i]['controls']['SerialNoValue'].updateValueAndValidity();
              }

              if (this.items.controls[0] != null) {
                this.items['controls'][0].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo1,
                });
              }
              if (this.items.controls[1] != null) {
                this.items['controls'][1].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo2,
                });
              }
              if (this.items.controls[2] != null) {
                this.items['controls'][2].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo3,
                });
              }
              if (this.items.controls[3] != null) {
                this.items['controls'][3].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
              if (this.items.controls[4] != null) {
                this.items['controls'][4].patchValue({
                  SerialNoValue: this.collateralObj.SerialNo4,
                });
              }
            }
          });

        this.AddCollForm.patchValue({
          MouCustCollateralId: this.collateralObj.MouCustCollateralId,
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
          // CollateralNotes: this.collateralObj.Notes,
          CollateralNotes: this.collateralObj.CollateralNotes,
          RowVersionCollateral: this.collateralObj.RowVersion,

          MouCustCollateralRegistrationId: this.collateralRegistrationObj.MouCustCollateralRegistrationId,
          OwnerName: this.collateralRegistrationObj.OwnerName,
          OwnerIdNo: this.collateralRegistrationObj.OwnerIdNo,
          MrIdTypeCode: this.collateralRegistrationObj.MrIdType,
          MrOwnerRelationshipCode: this.collateralRegistrationObj.OwnerRelationship,
          MrUserRelationshipCode: this.collateralRegistrationObj.OwnerRelationship,
          Notes: this.collateralRegistrationObj.Notes,
          RowVersionCollateralRegistration: this.collateralRegistrationObj.RowVersion
        });

        this.legalAddrObj.Addr = this.collateralRegistrationObj.OwnerAddr;
        this.legalAddrObj.City = this.collateralRegistrationObj.OwnerCity;
        this.legalAddrObj.AreaCode1 = this.collateralRegistrationObj.OwnerAreaCode1;
        this.legalAddrObj.AreaCode2 = this.collateralRegistrationObj.OwnerAreaCode2;
        this.legalAddrObj.AreaCode3 = this.collateralRegistrationObj.OwnerAreaCode3;
        this.legalAddrObj.AreaCode4 = this.collateralRegistrationObj.OwnerAreaCode4;
        if (this.collateralRegistrationObj.Phn1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.Phn2 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.Phn1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;
        if (this.collateralRegistrationObj.PhnArea1 != null) this.legalAddrObj.Phn1 = this.collateralRegistrationObj.PhnArea1;

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };

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

        this.inputFieldLocationObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.OwnerZipcode;
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = { Zipcode: this.collateralRegistrationObj.OwnerZipcode };
      })
  }

  Cancel() {
    this.clearList();
    this.type = 'Paging';
  }

  SaveExistingCollateral() {
    this.mouCustCollateralObj = new MouCustCollateralObj();
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.ListCollateralId = new Array();

    if (this.listSelectedId.length == 0) {
      this.toastr.errorMessage('Please add at least one data');
      return;
    }
    this.mouCustCollateralObj.ListCollateralId = this.listSelectedId;

    this.http.post(AdInsConstant.AddExistingCustCollateralData, this.mouCustCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
        this.type = 'Paging';
        this.bindMouData();
        this.clearList();
      },
      error => {
        console.log(error);
      }
    );
  }

  clearList() {
    this.listSelectedId = [];
    this.tempPagingObj.addCritInput = new Array<CriteriaObj>();
  }

  delete(MouCustCollId) {
    if (confirm('Are you sure to delete this record?')) {
      var custCollObj = { MouCustCollateralId: MouCustCollId };
      this.http.post(AdInsConstant.DeleteMouCustCollateral, custCollObj).subscribe(
        (response) => {
          console.log(response);
          this.toastr.successMessage(response["message"]);
          this.bindMouData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  next() {
    this.ResponseMouAddColl.emit({ StatusCode: "200" });
  }

  back() {
    this.modeDetail.emit({ mode: "edit" });
    this.ResponseMouAddColl.emit({ StatusCode: "-1" });
  }
}
