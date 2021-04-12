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
@Component({
  selector: 'app-ho-prod-compnt',
  templateUrl: './ho-prod-compnt.component.html'
})
export class HoProdCompntComponent implements OnInit {

  @Input() ProdHId: number;
  source: string = "";
  FormProdComp: any;
  dictOptions: { [key: string]: any; } = {};
  StateSave: string;
  dictBehaviour: { [key: string]: any; } = {};
  DlRuleObj: ReqDownloadRuleObj = new ReqDownloadRuleObj();

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
    var compCode, compDescr;
    if (obj.ProdCompntType == "DDL") {
      if (obj.CompntValue == "") {
        var dict = this.dictOptions[obj.RefProdCompntCode];
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

    var mrProdBehaviour = obj.MrProdBehaviour;

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
    var url = obj.ProdCompntDtaSrcApi;
    if (url != "") {
      var payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(url, payload).toPromise().then(
        (response) => {
          this.dictOptions[obj.RefProdCompntCode] = response[CommonConstant.ReturnObj];
        }
      )
    }
  }

  async PopulateRefBehaviour(obj) {
    var bhvrTypeCode = obj.BehaviourType;
    if (this.dictBehaviour[bhvrTypeCode] == undefined) {
      var url = URLConstant.GetRefBehaviourByBehaviourTypeCode;
      await this.http.post(url, { Code: bhvrTypeCode }).toPromise().then(
        (response) => {
          this.dictBehaviour[bhvrTypeCode] = response[CommonConstant.ReturnObj];
        }
      )
    }
  }

  LoadProdComponent(ProdHId, CompGroups, IsFilterBizTmpltCode) {
    var ProdHOComponent = {
      ProdHId: ProdHId,
      GroupCodes: CompGroups.split(","),
      IsFilterBizTmpltCode: IsFilterBizTmpltCode,
      RowVersion: ""
    }
    this.http.post(URLConstant.GetProductHOComponentGrouped, ProdHOComponent).toPromise().then(
      async (response) => {
        for (var i = 0; i < response[CommonConstant.ReturnObj].length; i++) {
          var group = response[CommonConstant.ReturnObj][i];
          var fa_group = this.FormProdComp.controls['groups'] as FormArray;
          fa_group.push(this.addGroup(group.GroupCode, group.GroupName));

          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            if (comp.ProdCompntType == "DDL") {
              await this.PopulateDDL(comp);

            }
            if (comp.BehaviourType != "") {
              await this.PopulateRefBehaviour(comp);
            }
          }

          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            var fa_comp = (<FormArray>this.FormProdComp.controls['groups']).at(i).get('components') as FormArray;
            var comp_group = this.addComponent(comp) as FormGroup;
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
    var list = new Array();
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

    var objPost = {
      ProdHId: this.ProdHId,
      ProductDetails: list
    }

    return objPost;
  }

  SaveForm() {
    var objPost = this.BuildReqProdDetail();
    this.http.post(URLConstant.AddOrEditProductDetail, objPost).subscribe(
      (response) => {
        this.toastr.successMessage(response["message"]);
        this.BackToPaging();
      }
    );
  }

  NextDetail() {
    var objPost = this.BuildReqProdDetail();
    this.http.post(URLConstant.AddOrEditProductDetail, objPost).subscribe(
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
    if (this.StateSave == "save") {
      this.SaveForm();
    }
    else {
      this.NextDetail();
    }
  }

  DownloadRule(CompntValue, CompntValueDesc) {
    this.DlRuleObj.RuleSetName = CompntValue;
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj, { responseType: 'blob' }).subscribe(
      response => {
        saveAs(response, CompntValueDesc + '.xlsx');
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
