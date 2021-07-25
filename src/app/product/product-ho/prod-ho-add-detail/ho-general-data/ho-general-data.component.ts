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
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';


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
  Source: string = "";
  DictOptions: { [key: string]: Array<KeyValueObj>; } = {};
  DictMultiOptions: { [key: string]: Array<any>; } = {};
  SelectedMultiDDLItems: { [key: string]: Array<any>; } = {};
  GenericByCodeObj: GenericObj = new GenericObj();
  InputLookUpObj: InputLookupObj = new InputLookupObj();
  ArrCrit: Array<CriteriaObj> = new Array<CriteriaObj>();
  ReqGetProdCmpntObj : ReqGetProdCompntObj = new ReqGetProdCompntObj();
  ReqListProductDObj: ReqListProductDetailObj = new ReqListProductDetailObj();
  ReqCopyProdObj: ReqCopyProductObj = new ReqCopyProductObj();

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
      this.Source = params["source"];
    })

  }

  ngOnInit() {
    this.FormProdComp = this.fb.group(
      {
        groups: this.fb.array([])
      }
    );

    this.LoadProdComponent(this.ProdHId, "GEN", true, "");

    this.InputLookUpObj.urlJson = "./assets/uclookup/product/lookupProduct.json";
    this.InputLookUpObj.urlEnviPaging = environment.losUrl;
    this.InputLookUpObj.pagingJson = "./assets/uclookup/product/lookupProduct.json";
    this.InputLookUpObj.genericJson = "./assets/uclookup/product/lookupProduct.json";
    this.InputLookUpObj.isRequired = false;

    let critObj = new CriteriaObj();
    critObj.propName = 'PROD_ID';
    critObj.restriction = AdInsConstant.RestrictionNeq;
    critObj.value = this.ProdId.toString();
    this.ArrCrit.push(critObj);
    this.InputLookUpObj.addCritInput = this.ArrCrit;
  }

  addGroup(groupCode, groupName) {
    return this.fb.group({
      groupCode: groupCode,
      groupName: groupName,
      components: this.fb.array([])
    })
  }

  addComponent(obj) {
    let compValue, compDescr;
    if (obj.ProdCompntType == "DDL") {
      if (obj.RefProdCompntCode == "LOB") {
        if (this.LOBSelected != "") {
          compValue = this.LOBSelected;
          compDescr = this.LOBDescrSelected;
        }
        else {
          compValue = "";
          compDescr = "-Select One-";
        }
      }
      else if (obj.CompntValue == "" || this.DictOptions[obj.RefProdCompntCode] == null || this.DictOptions[obj.RefProdCompntCode].find(f => f.Key == obj.CompntValue) == null) {
        compValue = "";
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
        let selectedId = obj.CompntValue.split(";");
        let selectedText = obj.CompntValueDesc.split(",");

        this.SelectedMultiDDLItems[obj.RefProdCompntCode] = new Array();

        for (var i = 0; i < selectedId.length; i++) {
          this.SelectedMultiDDLItems[obj.RefProdCompntCode].push({ item_id: selectedId[i], item_text: selectedText[i] });
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
      let payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(obj.ProdCompntDtaSrcApi, payload).toPromise().then(
        (response) => {
          this.DictOptions[obj.RefProdCompntCode] = response[CommonConstant.ReturnObj];
          let compValue, compDescr;
          if (obj.CompntValue == "") {
            compValue = this.DictOptions[obj.RefProdCompntCode][0].Key;
            compDescr = this.DictOptions[obj.RefProdCompntCode][0].Value;
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
      let payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(obj.ProdCompntDtaSrcApi, payload).toPromise().then(
        (response) => {
          let result = response[CommonConstant.ReturnObj];
          this.DictMultiOptions[obj.RefProdCompntCode] = new Array();
          this.SelectedMultiDDLItems[obj.RefProdCompntCode] = new Array();
          for (let i = 0; i < result.length; i++) {
            this.DictMultiOptions[obj.RefProdCompntCode].push({ item_id: result[i].Key, item_text: result[i].Value });
          }
        }
      )
    }
  }

  async PopulateFinMapFromLOB() {
    this.GenericByCodeObj.Code = this.LOBSelected;
    await this.http.post(URLConstant.GetKvpRefFinMapByLobCode, this.GenericByCodeObj).toPromise().then(
      (response: ResGetKvpRefFinMapByLobCode) => {
        this.DictOptions["WAY_OF_FINANCING"] = response.RefWayOfFin;
        this.DictOptions["PURPOSE_OF_FINANCING"] = response.RefPurposeOfFin;
        this.DictOptions["PROD_TYPE"] = response.RefProdType;

        for (var i = 0; i < this.FormProdComp.controls["groups"].controls.length; i++) {
          for (var j = 0; j < this.FormProdComp.controls["groups"].controls[i].controls["components"].length; j++) {
            let comp = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j] as FormGroup;
            let compCode = comp.value["RefProdCompntCode"];
            if (compCode == "PURPOSE_OF_FINANCING") {
              comp.patchValue({ CompntValueDesc: this.DictOptions["PURPOSE_OF_FINANCING"][0].Value, CompntValue: this.DictOptions["PURPOSE_OF_FINANCING"][0].Key })
            }
            else if (compCode == "WAY_OF_FINANCING") {
              comp.patchValue({ CompntValueDesc: this.DictOptions["WAY_OF_FINANCING"][0].Value, CompntValue: this.DictOptions["WAY_OF_FINANCING"][0].Key })
            }
            else if (compCode == "PROD_TYPE") {
              comp.patchValue({ CompntValueDesc: this.DictOptions["PROD_TYPE"][0].Value, CompntValue: this.DictOptions["PROD_TYPE"][0].Key })
            }
          }
        }
      }
    )
  }

  async PopulateInstallmentSchedule() {
    this.GenericByCodeObj.Code = this.LOBSelected;
    await this.http.post(URLConstant.GetListKvpInstSchmByLobCode, this.GenericByCodeObj).toPromise().then(
      (response : GenericKeyValueListObj) => {
        let result = response.ReturnObject;
        this.DictMultiOptions["INST_SCHM"] = new Array();
        this.SelectedMultiDDLItems["INST_SCHM"] = new Array();

        for (let i = 0; i < result.length; i++) {
          this.DictMultiOptions["INST_SCHM"].push({ item_id: result[i].Key, item_text: result[i].Value });
        }
      }
    )
  }

  LoadProdComponent(ProdHId: number, CompGroups: string, IsFilterBizTmpltCode: boolean, Lob: string) {
    this.ReqGetProdCmpntObj.ProdHId = ProdHId;
    this.ReqGetProdCmpntObj.GroupCodes = CompGroups.split(",");
    this.ReqGetProdCmpntObj.IsFilterBizTmpltCode = IsFilterBizTmpltCode;
    this.ReqGetProdCmpntObj.Lob = Lob;

    this.http.post(URLConstant.GetProductHOComponentGrouped, this.ReqGetProdCmpntObj).toPromise().then(
      async (response : ResGetProdCmpntGroupedObj) => {
        let fa_group = this.FormProdComp.controls['groups'] as FormArray;
        while (fa_group.length) {
          fa_group.removeAt(0);
        }
        for (var i = 0; i < response.ReturnObject.length; i++) {
          let group = response.ReturnObject[i];
          let fa_group = this.FormProdComp.controls['groups'] as FormArray;
          fa_group.push(this.addGroup(group.GroupCode, group.GroupName));

          for (var j = 0; j < group.Components.length; j++) {
            let comp = group.Components[j];
            if (comp.ProdCompntType == "DDL") {
              await this.PopulateDDL(comp);
            }
            if (comp.ProdCompntType == "MULTI_DDL") {
              await this.PopulateMultiDDL(comp);
            }
          }
          await this.PopulateFinMapFromLOB();
          await this.PopulateInstallmentSchedule();
          let fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
          while (fa_comp.length) {
            fa_comp.removeAt(0);
          }
          for (var j = 0; j < group.Components.length; j++) {
            let comp = group.Components[j];
            let fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
            fa_comp.push(this.addComponent(comp));
          }
        }
      }
    )
  }

  onChangeEvent(val: string, event, index: number, indexparent: number) {
    if (val == "LOB") {
      this.LOBSelected = event.target.value;
      this.LOBDescrSelected = this.DictOptions[val].find(f => f.Key == event.target.value).Value;
      this.LoadProdComponent(this.ProdHId, "GEN", true, this.LOBSelected);
    }
    this.FormProdComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      CompntValueDesc: this.DictOptions[val].find(f => f.Key == event.target.value).Value
    })
  }

  onMultiDDLChangeEvent(refProdCompntCode: string, index: number, indexparent: number) {
    let selectedId = this.SelectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
    let selectedText = this.SelectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
    this.FormProdComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      CompntValue: selectedId.join(";"),
      CompntValueDesc: selectedText.join(",")
    })
  }

  BuildReqProdDetail() {
    let list = new Array();
    for (let i = 0; i < this.FormProdComp.controls.groups.length; i++) {
      for (let j = 0; j < this.FormProdComp.controls.groups.controls[i].controls["components"].length; j++) {
        let prodCompntType = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.ProdCompntType.value;

        if (prodCompntType == "AMT") {
          this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].patchValue({
            CompntValueDesc: this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.CompntValue.value
          });
        }
        if (prodCompntType == "MULTI_DDL") {
          let refProdCompntCode = this.FormProdComp.controls["groups"].controls[i].controls["components"].controls[j].controls.RefProdCompntCode.value;
          let selectedId = this.SelectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
          let selectedText = this.SelectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
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

    this.ReqListProductDObj = new ReqListProductDetailObj();
    this.ReqListProductDObj.ProdHId = this.ProdHId;
    this.ReqListProductDObj.ProductDetails = list;
  }

  SaveForm() {
    this.http.post(URLConstant.AddOrEditProductDetail, this.ReqListProductDObj).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.wizard.goToNextStep();
      }
    );
  }

  ClickSave(state: string) {
    this.StateSave = state;
  }

  SubmitForm() {
    this.BuildReqProdDetail();
    this.SaveForm();
  }

  reload() {
    if (this.InputLookUpObj.jsonSelect["ProdId"] == undefined) {
      this.toastr.warningMessage(ExceptionConstant.SELECT_PROD_TO_COPY);
    }
    else {
      if (confirm(ExceptionConstant.CONFIRM_PROD_TO_COPY)) {
        this.ReqCopyProdObj.ProdHId = this.ProdHId;
        this.ReqCopyProdObj.FromProdId = this.InputLookUpObj.jsonSelect["ProdId"]
        this.http.post(URLConstant.CopyProduct, this.ReqCopyProdObj).subscribe(
          (response) => {
            this.LoadProdComponent(this.ProdHId, "GEN", true, "");
            this.toastr.successMessage("Product Copied Successfully");
          }
        );
      }
    }
  }

  Cancel() {
    this.BackToPaging();
  }

  BackToPaging() {
    if (this.Source == "return") {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_RTN_PAGING], {});
    }
    else {
      AdInsHelper.RedirectUrl(this.router, [NavigationConstant.PRODUCT_HO_PAGING], {});
    }
  }
}
