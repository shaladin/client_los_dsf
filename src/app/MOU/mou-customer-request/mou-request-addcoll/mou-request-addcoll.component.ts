import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { MouCustCollateralObj } from 'app/shared/model/MouCustCollateralObj.Model';
import { MouCustCollateralRegistrationObj } from 'app/shared/model/MouCustCollateralRegistrationObj.Model';
import { UcgridfooterComponent } from '@adins/ucgridfooter';
import { UCSearchComponent } from '@adins/ucsearch';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';

@Component({
  selector: 'app-mou-request-addcoll',
  templateUrl: './mou-request-addcoll.component.html',
  providers: [NGXToastrService]
})
export class MouRequestAddcollComponent implements OnInit {
  @Input() MouCustId: number;
  @Output() ResponseMouAddColl: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(UcgridfooterComponent) UCGridFooter;
  @ViewChild(UCSearchComponent) UCSearchComponent;

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

  mouCustCollateralObj: MouCustCollateralObj;
  mouCustCollateralRegistrationObj: MouCustCollateralRegistrationObj;
  OwnerRelationshipObj: any;

  closeResult: string;
  listCollateralData: any;
  inputLookupObj: InputLookupObj;
  criteriaList: Array<CriteriaObj>;
  criteriaObj: CriteriaObj;

  legalAddrObj: AddrObj;
  inputFieldLegalObj: InputFieldObj;

  locationAddrObj: AddrObj;
  inputFieldLocationObj: InputFieldObj;
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

  constructor(private modalService: NgbModal, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) { }

  async ngOnInit() {
    await this.bindUcLookup();
    await this.bindUcSearch();
    await this.initAddrObj();
    await this.bindMouData();
  }

  bindMouData()
  {
    var refMasterObj = { RefMasterTypeCode: "CUST_PERSONAL_RELATIONSHIP" };
    this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, refMasterObj).subscribe(
      (response) => {
        this.OwnerRelationshipObj = response["ReturnObject"];
        if (this.OwnerRelationshipObj.length > 0) {
          this.AddCollForm.patchValue({
            OwnerRelationship: this.OwnerRelationshipObj[0].Key,
            CopyFromLegal : this.copyToLocationObj[0].Key
          });
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
  }

  bindUcLookup()
  {
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
    
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.IS_FINAL';
    this.criteriaObj.value = "1";
    this.criteriaList.push(this.criteriaObj);
 
    this.inputLookupObj.addCritInput = this.criteriaList;
  }

  bindUcSearch()
  {
    this.arrCrit = new Array();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();
    
    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/ucpaging/mou/searchMouCustCollateral.json";
    this.inputObj.enviromentUrl = environment.FoundationR3Url; 
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;

    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.FoundationR3Url + AdInsConstant.GetPagingObjectBySQL;
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
    this.UCGridFooter.pageNow = event.pageNow;
    this.UCGridFooter.totalData = this.totalData;
    this.UCGridFooter.resultData = this.resultData;
  }

  onSelect(event) {
    this.pageNow = event.pageNow;
    this.pageSize = event.pageSize;
    this.totalData = event.Count;
    this.searchPagination(this.pageNow);
  }

  SelectAll(condition) {
    this.checkboxAll = condition;
    console.log(condition);
    if (condition) {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        if (this.listSelectedId.indexOf(this.resultData.Data[i].CollateralId) < 0) {
          this.listSelectedId.push(this.resultData.Data[i].CollateralId);
        }
      }

    } else {
      for (let i = 0; i < this.resultData.Data.length; i++) {
        let index = this.listSelectedId.indexOf(this.resultData.Data[i].CollateralId);
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
        var object = this.resultData.Data.find(x => x.CollateralId == this.listSelectedId[i]);
        this.tempData.push(object);
      }

      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "CL.COLLATERAL_ID";
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

  deleteFromTemp(CollateralId: any) {
    if (confirm('Are you sure to delete this record?')) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }

      var index = this.tempListId.indexOf(CollateralId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "numeric";
      addCrit.propName = "CL.COLLATERAL_ID";
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
    this.type = "Add";
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

  AddCollDataForm = this.fb.group({
  })

  AddCollForm = this.fb.group({
    MouCustCollateralId: [''],
    MouCustCollateralRegistrationId: [''],
    CopyFromLegal: [''],
    AssetTypeCode: ['', [Validators.required]],
    CollateralValueAmt: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
    FullAssetCode: [''],
    OwnerName: ['', [Validators.required]],
    OwnerRelationship: ['', [Validators.required]],
    OwnerIdNo: ['', [Validators.required]],
    MrIdType: ['', [Validators.required]],
    Notes: [''],
    SerialNo1: ['', [Validators.required]],
    SerialNo2: ['', [Validators.required]],
    SerialNo3: ['', [Validators.required]],
    SerialNo4: ['', [Validators.required]],
    SerialNo5: [''],
    RowVersionCollateral: [''],
    RowVersionCollateralRegistration: ['']
  })

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
      FullAssetCode: e.AssetTypeCode,
      FullAssetName: e.FullAssetName
    });
  }

  onItemChange(value) {
    console.log(value);
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";

    this.criteriaList = new Array();
    this.criteriaObj = new CriteriaObj();
    this.criteriaObj.restriction = AdInsConstant.RestrictionEq;
    this.criteriaObj.propName = 'A.FULL_ASSET_CODE';
    this.criteriaObj.value = value;
    this.criteriaList.push(this.criteriaObj);
  }

  SaveForm() {
    this.setCollateralObjForSave();

    var custCollObj = {
      MouCustCollateral: this.mouCustCollateralObj,
      MouCustCollateralRegistration: this.mouCustCollateralRegistrationObj
    }

    if (this.type == 'Add') {
      this.http.post(AdInsConstant.AddMouCustCollateralData, custCollObj).subscribe(
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
    else
    {
      this.http.post(AdInsConstant.EditMouCustCollateralData, custCollObj).subscribe(
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
    this.bindMouData();
  }

  setCollateralObjForSave() {
    this.mouCustCollateralObj = new MouCustCollateralObj;
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.AssetTypeCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.mouCustCollateralObj.FullAssetCode = this.AddCollForm.controls.AssetTypeCode.value;
    this.mouCustCollateralObj.FullAssetName = this.AddCollForm.controls.FullAssetName.value.value;
    this.mouCustCollateralObj.AssetCategoryCode = "";
    this.mouCustCollateralObj.MrCollateralConditionCode = "NEW";
    this.mouCustCollateralObj.MrCollateralUsageCode = "COMMERCIAL";
    this.mouCustCollateralObj.CollateralStat = "NEW";
    this.mouCustCollateralObj.SerialNo1 = this.AddCollForm.controls.SerialNo1.value;
    this.mouCustCollateralObj.SerialNo2 = this.AddCollForm.controls.SerialNo2.value;
    this.mouCustCollateralObj.SerialNo3 = this.AddCollForm.controls.SerialNo3.value;
    this.mouCustCollateralObj.SerialNo4 = this.AddCollForm.controls.SerialNo4.value;
    this.mouCustCollateralObj.CollateralValueAmt = this.AddCollForm.controls.CollateralValueAmt.value;
    this.mouCustCollateralObj.CollateralNotes = this.AddCollForm.controls.Notes.value;

    this.mouCustCollateralRegistrationObj = new MouCustCollateralRegistrationObj;
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

    if (this.type == 'Edit')
    {
      this.mouCustCollateralObj.MouCustCollateralId = this.AddCollForm.controls.MouCustCollateralId;
      this.mouCustCollateralRegistrationObj.MouCustCollateralRegistrationId = this.AddCollDataForm.controls.MouCustCollateralRegistrationId;
      this.mouCustCollateralRegistrationObj.MouCustCollateralId = this.AddCollForm.controls.MouCustCollateralId;

      this.mouCustCollateralObj.RowVersion = this.AddCollForm.controls.RowVersionCollateral;
      this.mouCustCollateralRegistrationObj.RowVersion = this.AddCollForm.controls.RowVersionCollateralRegistration;
    }
  }

  copyToLocation()
  {
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
    this.inputFieldLocationObj.inputLookupObj.jsonSelect = {Zipcode: this.AddCollForm.controls["legalAddrZipcode"]["controls"].value.value};
  }

  editData(content, MouCustCollId) {
    this.type = "Edit";
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    var collObj = { MouCustCollateralId: MouCustCollId };
    this.http.post(AdInsConstant.GetMouCustCollateralDataForUpdateByMouCustCollateralId, collObj).subscribe(
      (response) => {
        this.collateralObj = response['MouCustCollateral'];
        this.collateralRegistrationObj = response['MouCustCollateralRegistration'];

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
          CollateralNotes: this.collateralObj.Notes,
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

        this.inputFieldLegalObj.inputLookupObj.nameSelect = this.collateralRegistrationObj.Zipcode;
        this.inputFieldLegalObj.inputLookupObj.jsonSelect = {Zipcode: this.collateralRegistrationObj.Zipcode};

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
        this.inputFieldLocationObj.inputLookupObj.jsonSelect = {Zipcode: this.collateralRegistrationObj.Zipcode};
      })
  }

  Cancel() {
    this.modalService.dismissAll();
  }

  SaveExistingCollateral()
  {
    this.mouCustCollateralObj = new MouCustCollateralObj();
    this.mouCustCollateralObj.MouCustId = this.MouCustId;
    this.mouCustCollateralObj.ListCollateralId =  new Array();

    for (let index = 0; index < this.tempData.length; index++) {
      console.log(this.tempData);
      var mouColtr = {
        CollateralId: this.tempData[index].CollateralId
      }
      this.mouCustCollateralObj.ListCollateralId.push(mouColtr.CollateralId);
    }

    if (this.mouCustCollateralObj.ListCollateralId.length == 0) {
      this.toastr.typeErrorCustom('Please Add At Least One Data');
      return;
    }

    this.http.post(AdInsConstant.AddExistingCustCollateralData, this.mouCustCollateralObj).subscribe(
      response => {
        this.toastr.successMessage(response['message']);
        this.modal.dismissAll();
      },
      error => {
        console.log(error);
      }
    );
  }

  delete(MouCustCollId) {
    var custCollObj = { MouCustCollateralId: MouCustCollId };
    this.http.post(AdInsConstant.DeleteMouCustCollateral, custCollObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  next(){
    this.ResponseMouAddColl.emit({StatusCode: "200"});
  }

  back(){
    this.ResponseMouAddColl.emit({StatusCode: "-1"});
  }
}
