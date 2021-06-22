import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { WizardComponent } from 'angular-archwizard';
import { saveAs } from 'file-saver';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { ReqDownloadRuleObj } from 'app/shared/model/Request/Product/ReqDownloadRuleObj.model';
import { ReqListProductDetailObj } from 'app/shared/model/Request/Product/ReqAddEditProductObj.model';
import { ReqGetProdCompntObj } from 'app/shared/model/Request/Product/ReqGetProdCompntObj.model';
import { GenericObj } from 'app/shared/model/Generic/GenericObj.Model';
import { GenericKeyValueListObj } from 'app/shared/model/Generic/GenericKeyValueListObj.model';
import { ResGetProdCmpntGroupedObj } from 'app/shared/model/Response/Product/ResGetProdCompntObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
@Component({
  selector: 'app-ho-prod-compnt',
  templateUrl: './ho-prod-compnt.component.html'
})
export class HoProdCompntComponent implements OnInit {

  @Input() ProdHId: number;
  source: string = "";
  FormProdComp: any;
  StateSave: string;
  dictOptions: { [key: string]: Array<KeyValueObj>; } = {};
  dictBehaviour: { [key: string]: Array<KeyValueObj>; } = {};
  GenericByCodeObj : GenericObj = new GenericObj();
  DlRuleObj: ReqDownloadRuleObj = new ReqDownloadRuleObj();
  ReqListProductDetailObj: ReqListProductDetailObj = new ReqListProductDetailObj();
  ReqGetProdHCompntGroupedObj: ReqGetProdCompntObj = new ReqGetProdCompntObj();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

    this.LoadProdComponent(this.ProdHId, "SCORE,RULE,OTHR,LOS", true);
  }

  addGroup(groupCode, groupName) {
    return this.fb.group({
      groupCode: groupCode,
      groupName: groupName,
      components: this.fb.array([])
    })
  }

  addComponent(obj) {
    let compCode, compDescr;
    if (obj.ProdCompntType == "DDL") {
      if (obj.CompntValue == "") {
        let dict = this.dictOptions[obj.RefProdCompntCode];
        if (dict != undefined) {
          compCode = this.dictOptions[obj.RefProdCompntCode][0].Key;
          compDescr = this.dictOptions[obj.RefProdCompntCode][0].Value;
        }
      }
      else {
        compCode = obj.CompntValue;
        compDescr = obj.CompntValueDesc;
      }
    }
    else {
      compCode = obj.CompntValue;
      compDescr = obj.CompntValueDesc;
    }

    let mrProdBehaviour = obj.MrProdBehaviour;

    if (mrProdBehaviour == "") {
      if (this.dictBehaviour[obj.BehaviourType] != undefined) {
        if (this.dictBehaviour[obj.BehaviourType].length > 0) {
          mrProdBehaviour = this.dictBehaviour[obj.BehaviourType][0].Key;
        }
      }
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
      CompntValue: [compCode, Validators.required],
      CompntValueDesc: compDescr,
      MrProdBehaviour: mrProdBehaviour
    })
  }

  async PopulateDDL(obj) {
    let url = obj.ProdCompntDtaSrcApi;
    if (url != "") {
      let payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(url, payload).toPromise().then(
        (response) => {
          this.dictOptions[obj.RefProdCompntCode] = response[CommonConstant.ReturnObj];
        }
      )
    }
  }

  async PopulateRefBehaviour(obj) {
    let bhvrTypeCode = obj.BehaviourType;
    if (this.dictBehaviour[bhvrTypeCode] == undefined) {
      this.GenericByCodeObj.Code = bhvrTypeCode;
      await this.http.post(URLConstant.GetRefBehaviourByBehaviourTypeCode, this.GenericByCodeObj).toPromise().then(
        (response: GenericKeyValueListObj) => {
          this.dictBehaviour[bhvrTypeCode] = response.ReturnObject;
        }
      )
    }
  }

  LoadProdComponent(ProdHId, CompGroups, IsFilterBizTmpltCode) {
    this.ReqGetProdHCompntGroupedObj.ProdHId = ProdHId,
    this.ReqGetProdHCompntGroupedObj.GroupCodes = CompGroups.split(","),
    this.ReqGetProdHCompntGroupedObj.IsFilterBizTmpltCode = IsFilterBizTmpltCode,

    this.http.post(URLConstant.GetProductHOComponentGrouped, this.ReqGetProdHCompntGroupedObj).toPromise().then(
      async (response : ResGetProdCmpntGroupedObj) => {
        for (var i = 0; i < response.ReturnObject.length; i++) {
          let group = response.ReturnObject[i];
          let fa_group = this.FormProdComp.controls['groups'] as FormArray;
          fa_group.push(this.addGroup(group.GroupCode, group.GroupName));

          for (var j = 0; j < group.Components.length; j++) {
            let comp = group.Components[j];
            if (comp.ProdCompntType == "DDL") {
              await this.PopulateDDL(comp);

            }
            if (comp.BehaviourType != "") {
              await this.PopulateRefBehaviour(comp);
            }
          }

          for (var j = 0; j < group.Components.length; j++) {
            let comp = group.Components[j];
            let fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
            let comp_group = this.addComponent(comp) as FormGroup;
            if (comp.ProdCompntType == "AMT") {
              comp_group.controls['CompntValue'].setValidators([Validators.required, Validators.pattern("^[0-9]+$")]);
            }
            fa_comp.push(comp_group);
          }
        }
      }
    )
  }

  onChangeEvent(val, event, index, indexparent) {
    this.FormProdComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      CompntValueDesc: this.dictOptions[val].find(f => f.Key == event.target.value).Value
    })
  }

  BuildReqProdDetail() {
    let list = new Array();
    for (let i = 0; i < this.FormProdComp.controls.groups.length; i++) {
      for (let j = 0; j < this.FormProdComp.controls.groups.controls[i].controls["components"].length; j++) {
        list.push(Object.assign({}, ...this.FormProdComp.controls.groups.controls[i].controls["components"].controls[j].value));
      }
    }

    for (let i = 0; i < list.length; i++) {
      if (list[i].ProdCompntType == "AMT") {
        list[i].CompntValueDesc = list[i].CompntValue;
      }
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

  DownloadRule(CompntValue, CompntValueDesc) {
    this.DlRuleObj.RuleSetName = CompntValue;
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj).subscribe(
      response => {
        // saveAs(response, CompntValueDesc + '.xls');
        let linkSource: string = "";
        let fileName: string = "";

        let type = response["ReturnObject"][0].Key.substring(response["ReturnObject"][0].Key.length - 4);
        if(type == ".xls"){
          linkSource = 'data:application/xls;base64,' + response["ReturnObject"][0].Value;
        }else {
          linkSource = 'data:application/xlsx;base64,' + response["ReturnObject"][0].Value;
        }
        fileName = response["ReturnObject"][0].Key;
        
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }
    );
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
