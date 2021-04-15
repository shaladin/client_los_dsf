import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { WizardComponent } from 'angular-archwizard';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ResGetKvpRefFinMapByLobCode } from 'app/shared/model/Response/Product/ResGetKvpRefFinMapByLobCode.model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { ReqGetProdCompntObj } from 'app/shared/model/Request/Product/ReqGetProdCompntObj.model';
import { ReqCopyProductObj, ReqListProductDetailObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { ResGetProdCmpntGroupedObj } from 'app/shared/model/Response/Product/ResGetProdCompntObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';


@Component({
  selector: 'app-ho-general-data',
  templateUrl: './ho-general-data.component.html'
})
export class HoGeneralDataComponent implements OnInit {

  FormProdComp: any;
  @Input() ProdHId: number;
  @Input() ProdId: number;
  StateSave: string;
  LOBSelected: string = "";
  LOBDescrSelected: string = "";
  source: string = "";
  dictOptions: { [key: string]: any; } = {};
  dictMultiOptions: { [key: string]: any; } = {};
  selectedMultiDDLItems: { [key: string]: any; } = {};
  GenericByCodeObj: GenericObj = new GenericObj();
  inputLookUpObj: InputLookupObj = new InputLookupObj();
  ReqGetProdCmpntObj: ReqGetProdCompntObj = new ReqGetProdCompntObj();
  ReqListProductDetailObj: ReqListProductDetailObj = new ReqListProductDetailObj();
  ReqCopyProductObj: ReqCopyProductObj = new ReqCopyProductObj();

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: NGXToastrService,
    private wizard: WizardComponent
  ) {
    this.route.queryParams.subscribe(params => {
      this.source = params["source"];
    })

  }

  ngOnInit() {
    this.FormProdComp = this.fb.group(
      {
        groups: this.fb.array([])
      }
    );

    this.LoadProdComponent(this.ProdHId, "GEN", true, "");

    this.inputLookUpObj.urlJson = "./assets/uclookup/product/lookupProduct.json";
    this.inputLookUpObj.urlEnviPaging = environment.losUrl;
    this.inputLookUpObj.pagingJson = "./assets/uclookup/product/lookupProduct.json";
    this.inputLookUpObj.genericJson = "./assets/uclookup/product/lookupProduct.json";
    this.inputLookUpObj.isRequired = false;

    var critObj = new CriteriaObj();
    critObj.propName = 'PROD_ID';
    critObj.restriction = AdInsConstant.RestrictionNeq;
    critObj.value = this.ProdId.toString();
    var arrCrit = new Array();
    arrCrit.push(critObj);
    this.inputLookUpObj.addCritInput = arrCrit;
  }

  addGroup(groupCode, groupName) {
    return this.fb.group({
      groupCode: groupCode,
      groupName: groupName,
      components: this.fb.array([])
    })
  }

  addComponent(obj) {
    var compValue, compDescr;
    if (obj.ProdCompntType == "DDL") {
      if (obj.RefProdCompntCode == "LOB") {
        if (this.LOBSelected != "") {
          compValue = this.LOBSelected;
          compDescr = this.LOBDescrSelected;
        }
        else {
          compValue = -1;
          compDescr = "-Select One-";
        }
      }
      else if (obj.CompntValue == "" || this.dictOptions[obj.RefProdCompntCode] == null || this.dictOptions[obj.RefProdCompntCode].find(f => f.Key == obj.CompntValue) == null) {
        compValue = -1;
        compDescr = "-Select One-";
      }
      else {
        compValue = obj.CompntValue;
        compDescr = obj.CompntValueDesc;
      }
    } else if (obj.ProdCompntType == "MULTI_DDL") {
      if (obj.CompntValue != "") {
        compValue = obj.CompntValue;
        compDescr = obj.CompntValueDesc;
        var selectedId = obj.CompntValue.split(";");
        var selectedText = obj.CompntValueDesc.split(",");

        this.selectedMultiDDLItems[obj.RefProdCompntCode] = new Array();

        for (var i = 0; i < selectedId.length; i++) {
          this.selectedMultiDDLItems[obj.RefProdCompntCode].push({ item_id: selectedId[i], item_text: selectedText[i] });
        }
      }
    }
    else {
      compValue = obj.CompntValue;
      compDescr = obj.CompntValueDesc;
    }
    return this.fb.group({
      RefProdCompntId: obj.RefProdCompntId,
      RefProdCompntCode: obj.RefProdCompntCode,
      ProdCompntName: obj.ProdCompntName,
      RefProdCompntGrpCode: obj.RefProdCompntGrpCode,
      ProdCompntType: obj.ProdCompntType,
      BehaviourType: obj.BehaviourType,
      ProdHId: obj.ProdHId,
      ProdDId: obj.ProdDId,
      CompntValue: [compValue, Validators.required],
      CompntValueDesc: compDescr,
      MrProdBehaviour: "LOCK"
    })
  }

  async PopulateDDL(obj) {
    if (obj.ProdCompntDtaSrcApi != "") {
      var payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(obj.ProdCompntDtaSrcApi, payload).toPromise().then(
        (response) => {
          this.dictOptions[obj.RefProdCompntCode] = response[CommonConstant.ReturnObj];
          var compValue, compDescr;
          if (obj.CompntValue == "") {
            compValue = this.dictOptions[obj.RefProdCompntCode][0].Key;
            compDescr = this.dictOptions[obj.RefProdCompntCode][0].Value;
          }
          else {
            compValue = obj.CompntValue;
            compDescr = obj.CompntValueDesc;
          }
          if (obj.RefProdCompntCode == "LOB" && obj.CompntValue != "" && this.LOBSelected == "") {
            this.LOBSelected = compValue;
            this.LOBDescrSelected = compDescr;
          }
        }
      )
    }
  }

  async PopulateMultiDDL(obj) {
    if (obj.ProdCompntDtaSrcApi != "") {
      var payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(obj.ProdCompntDtaSrcApi, payload).toPromise().then(
        (response) => {
          var result = response[CommonConstant.ReturnObj];
          this.dictMultiOptions[obj.RefProdCompntCode] = new Array();
          this.selectedMultiDDLItems[obj.RefProdCompntCode] = new Array();
          for (let i = 0; i < result.length; i++) {
            this.dictMultiOptions[obj.RefProdCompntCode].push({ item_id: result[i].Key, item_text: result[i].Value });
          }
        }
      )
    }
  }

  async PopulateFinMapFromLOB() {
    this.GenericByCodeObj.Code = this.LOBSelected;
    await this.http.post(URLConstant.GetKvpRefFinMapByLobCode, this.GenericByCodeObj).toPromise().then(
      (response: ResGetKvpRefFinMapByLobCode) => {
        this.dictOptions["WAY_OF_FINANCING"] = response.RefWayOfFin;
        this.dictOptions["PURPOSE_OF_FINANCING"] = response.RefPurposeOfFin;
        this.dictOptions["PROD_TYPE"] = response.RefProdType;

        for (var i = 0; i < this.FormProdComp.controls["groups"].controls.length; i++) {
          for (var j = 0; j < this.FormProdComp.controls["groups"].controls[i].controls["components"].length; j++) {
            var comp = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j] as FormGroup;
            var compCode = comp.value["RefProdCompntCode"];
            if (compCode == "PURPOSE_OF_FINANCING") {
              comp.patchValue({ CompntValueDesc: this.dictOptions["PURPOSE_OF_FINANCING"][0].Value, CompntValue: this.dictOptions["PURPOSE_OF_FINANCING"][0].Key })
            }
            else if (compCode == "WAY_OF_FINANCING") {
              comp.patchValue({ CompntValueDesc: this.dictOptions["WAY_OF_FINANCING"][0].Value, CompntValue: this.dictOptions["WAY_OF_FINANCING"][0].Key })
            }
            else if (compCode == "PROD_TYPE") {
              comp.patchValue({ CompntValueDesc: this.dictOptions["PROD_TYPE"][0].Value, CompntValue: this.dictOptions["PROD_TYPE"][0].Key })
            }
          }
        }
      }
    )
  }

  async PopulateInstallmentSchedule() {
    this.GenericByCodeObj.Code = this.LOBSelected;
    await this.http.post(URLConstant.GetListKvpInstSchmByLobCode, this.GenericByCodeObj).toPromise().then(
      (response: GenericKeyValueListObj) => {
        var result = response.ReturnObject;
        this.dictMultiOptions["INST_SCHM"] = new Array();
        this.selectedMultiDDLItems["INST_SCHM"] = new Array();

        for (let i = 0; i < result.length; i++) {
          this.dictMultiOptions["INST_SCHM"].push({ item_id: result[i].Key, item_text: result[i].Value });
        }
      }
    )
  }

  LoadProdComponent(ProdHId, CompGroups, IsFilterBizTmpltCode, Lob) {
    this.ReqGetProdCmpntObj.ProdHId = ProdHId;
    this.ReqGetProdCmpntObj.GroupCodes = CompGroups.split(",");
    this.ReqGetProdCmpntObj.IsFilterBizTmpltCode = IsFilterBizTmpltCode;
    this.ReqGetProdCmpntObj.Lob = Lob;
    this.ReqGetProdCmpntObj.RowVersion = "";

    this.http.post(URLConstant.GetProductHOComponentGrouped, this.ReqGetProdCmpntObj).toPromise().then(
      async (response: ResGetProdCmpntGroupedObj) => {
        var fa_group = this.FormProdComp.controls['groups'] as FormArray;
        while (fa_group.length) {
          fa_group.removeAt(0);
        }
        for (var i = 0; i < response.ReturnObject.length; i++) {
          var group = response.ReturnObject[i];
          var fa_group = this.FormProdComp.controls['groups'] as FormArray;
          fa_group.push(this.addGroup(group.GroupCode, group.GroupName));

          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            if (comp.ProdCompntType == "DDL") {
              await this.PopulateDDL(comp);
            }
            if (comp.ProdCompntType == "MULTI_DDL") {
              await this.PopulateMultiDDL(comp);
            }
          }
          await this.PopulateFinMapFromLOB();
          await this.PopulateInstallmentSchedule();
          var fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
          while (fa_comp.length) {
            fa_comp.removeAt(0);
          }
          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            var fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
            fa_comp.push(this.addComponent(comp));
          }
        }
      }
    )
  }

  onChangeEvent(val, event, index, indexparent) {
    if (val == "LOB") {
      this.LOBSelected = event.target.value;
      this.LOBDescrSelected = this.dictOptions[val].find(f => f.Key == event.target.value).Value;
      this.LoadProdComponent(this.ProdHId, "GEN", true, this.LOBSelected);
    }
    this.FormProdComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      CompntValueDesc: this.dictOptions[val].find(f => f.Key == event.target.value).Value
    })
  }

  onMultiDDLChangeEvent(refProdCompntCode, index, indexparent) {
    var selectedId = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
    var selectedText = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
    this.FormProdComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      CompntValue: selectedId.join(";"),
      CompntValueDesc: selectedText.join(",")
    })
  }

  BuildReqProdDetail() {
    var list = new Array();
    for (let i = 0; i < this.FormProdComp.controls.groups.length; i++) {
      for (let j = 0; j < this.FormProdComp.controls.groups.controls[i].controls["components"].length; j++) {
        var prodCompntType = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.ProdCompntType.value;

        if (prodCompntType == "AMT") {
          this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].patchValue({
            CompntValueDesc: this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.CompntValue.value
          });
        }
        if (prodCompntType == "MULTI_DDL") {
          var refProdCompntCode = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.RefProdCompntCode.value;
          var selectedId = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
          var selectedText = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
          this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].patchValue({
            CompntValue: selectedId.join(";"),
            CompntValueDesc: selectedText.join(", ")
          });
        }
        list.push(Object.assign({}, ...this.FormProdComp.controls.groups.controls[i].controls["components"].controls[j].value));
      }
    }

    for (let i = 0; i < list.length; i++) {
      list[i].RowVersion = "";
    }

    this.ReqListProductDetailObj = new ReqListProductDetailObj();
    this.ReqListProductDetailObj.ProdHId = this.ProdHId;
    this.ReqListProductDetailObj.ProductDetails = list;
  }

  SaveForm() {
    this.http.post(URLConstant.AddOrEditProductDetail, this.ReqListProductDetailObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.BackToPaging();
      }
    );
  }

  NextDetail() {
    this.http.post(URLConstant.AddOrEditProductDetail, this.ReqListProductDetailObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.wizard.goToNextStep();
      }
    );
  }

  ClickSave(state) {
    this.StateSave = state;
  }

  SubmitForm() {
    this.BuildReqProdDetail();
    if (this.StateSave == "save") {
      this.SaveForm();
    }
    else {
      this.NextDetail();
    }
  }

  reload() {
    if (this.inputLookUpObj.jsonSelect["ProdId"] == undefined) {
      this.toastr.warningMessage(ExceptionConstant.SELECT_PROD_TO_COPY);
    }
    else {
      if (confirm(ExceptionConstant.CONFIRM_PROD_TO_COPY)) {
        this.ReqCopyProductObj.ProdHId = this.ProdHId;
        this.ReqCopyProductObj.FromProdId = this.inputLookUpObj.jsonSelect["ProdId"]
        this.http.post(URLConstant.CopyProduct, this.ReqCopyProductObj).subscribe(
          (response) => {
            this.toastr.successMessage("Product Copied Successfully");
            window.location.reload();
          }
        );
      }
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_PAGING], {});
    }
  }
}
