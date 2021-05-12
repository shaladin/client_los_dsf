import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqDownloadRuleObj } from 'app/shared/model/Request/Product/ReqDownloadRuleObj.model';
import { ReqGetProdOffCompntObj } from 'app/shared/model/Request/Product/ReqGetProdCompntObj.model';

@Component({
  selector: 'uc-prod-offering-comp',
  templateUrl: './uc-prod-offering-comp.component.html'
})
export class UcProdOfferingCompComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  )
  {}

  FormProdOfferingComp : any;
  dictOptions: { [key: string]: any; } = {};
  dictBehaviour: {[key: string]: any;} = {};
  list = new Array();
  dictMultiOptions: { [key: string]: any; } = {};
  selectedMultiDDLItems: { [key: string]: any; } = {};
  DlRuleObj  : ReqDownloadRuleObj = new ReqDownloadRuleObj();
  
  @Input() CompGroups : string;
  @Input() ProdOfferingHId : number;
  @Input() ShowComparison : boolean;
  @Input() ShowBehaviour : boolean;
  @Input() IsFilterBizTmpltCode: boolean;

  @Output() Save: EventEmitter<any> = new EventEmitter();
  @Output() Next: EventEmitter<any> = new EventEmitter();
  @Output() OnCancel: EventEmitter<any> = new EventEmitter();

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  ngOnInit() {
    console.log("aosdifjosidfj");
    this.FormProdOfferingComp = this.fb.group(
      {
        groups: this.fb.array([])
      }
    );
    
    this.LoadProdComponent(this.ProdOfferingHId,this.CompGroups, this.IsFilterBizTmpltCode);
    
  }

  addGroup(groupCode, groupName) {
    return this.fb.group({
      groupCode: groupCode,
      groupName: groupName,
      components: this.fb.array([])
    })
  }

  addComponent(obj) {
    var offeringCompCode , offeringCompDescr, hoMrProdBehaviour, offeringMrProdBehaviour;

    if(obj.ProdCompntType=="DDL")
    {
      if(obj.OfferingCompntValue == "")
      {
        if(this.dictOptions[obj.RefProdCompntCode] != undefined){
          if(this.dictOptions[obj.RefProdCompntCode].length > 0){
            offeringCompCode = this.dictOptions[obj.RefProdCompntCode][0].Key;
            offeringCompDescr = this.dictOptions[obj.RefProdCompntCode][0].Value;
          }
        }  
      }
      else
      {
        offeringCompCode = obj.OfferingCompntValue;
        offeringCompDescr = obj.OfferingCompntValueDesc;
      }
    }
    else if (obj.ProdCompntType == "MULTI_DDL") {
      if (obj.OfferingCompntValue != "") {
        offeringCompCode = obj.OfferingCompntValue;
        offeringCompDescr = obj.OfferingCompntValueDesc;

        var selectedId = obj.OfferingCompntValue.split(";");
        var selectedText = obj.OfferingCompntValueDesc.split(",");

        this.selectedMultiDDLItems[obj.RefProdCompntCode] = new Array();

        for (var i = 0; i < selectedId.length; i++) {
          this.selectedMultiDDLItems[obj.RefProdCompntCode].push({ item_id: selectedId[i], item_text: selectedText[i] });
        }
      }
    }
    else
    {
      offeringCompCode = obj.OfferingCompntValue;
      offeringCompDescr = obj.OfferingCompntValueDesc;
    }

    if(this.ShowBehaviour == true){
      hoMrProdBehaviour = obj.HOMrProdBehaviour;
      offeringMrProdBehaviour = obj.OfferingMrProdBehaviour;

      if(hoMrProdBehaviour == "")
      {
        if(this.dictBehaviour[obj.RefProdCompntCode] != undefined){
          if(this.dictBehaviour[obj.RefProdCompntCode].length > 0){
            hoMrProdBehaviour = this.dictBehaviour[obj.RefProdCompntCode][0].Key;
          }
        }  
      }

      if(offeringMrProdBehaviour == "")
      {
        if(this.dictBehaviour[obj.RefProdCompntCode] != undefined){
          if(this.dictBehaviour[obj.RefProdCompntCode].length > 0){
            offeringMrProdBehaviour = this.dictBehaviour[obj.RefProdCompntCode][0].Key;
          }
        }  
      }
    }else{
      hoMrProdBehaviour = CommonConstant.BehaviourTypeDefault;
      offeringMrProdBehaviour = CommonConstant.BehaviourTypeLock;
    }

    return this.fb.group({
      RefProdCompntId:obj.RefProdCompntId,
      RefProdCompntCode: obj.RefProdCompntCode,
      ProdCompntName : obj.ProdCompntName,
      RefProdCompntGrpCode: obj.RefProdCompntGrpCode,
      ProdCompntType : obj.ProdCompntType,
      BehaviourType : obj.BehaviourType,
      ProdOfferingHId : obj.ProdOfferingHId,
      ProdOfferingDId : obj.ProdOfferingDId,
      IsProdHo: obj.IsProdHo,
      IsProdOffering: obj.IsProdOffering,
      HOCompntValue : obj.HOCompntValue,
      HOCompntValueDesc : obj.HOCompntValueDesc,
      HOMrProdBehaviour : hoMrProdBehaviour,
      OfferingCompntValue : obj.IsProdOffering == true && hoMrProdBehaviour == CommonConstant.BehaviourTypeLock == true ? [{ value: offeringCompCode, disabled: true }]
                            : obj.IsProdOffering == true && hoMrProdBehaviour == CommonConstant.BehaviourTypeMin == true ? [offeringCompCode, (Validators.required, Validators.min(obj.HOCompntValue))]
                            : obj.IsProdOffering == true && hoMrProdBehaviour == CommonConstant.BehaviourTypeMax == true ? [offeringCompCode, (Validators.required, Validators.max(obj.HOCompntValue))]                      
                            : obj.IsProdOffering == true ? [offeringCompCode, Validators.required]
                            : offeringCompCode,
      OfferingCompntValueDesc : offeringCompDescr,
      OfferingMrProdBehaviour : obj.IsProdOffering == true && hoMrProdBehaviour == CommonConstant.BehaviourTypeLock == true ? [{ value: offeringMrProdBehaviour, disabled: true }]                      
                              : obj.IsProdOffering == true ? [offeringMrProdBehaviour, Validators.required]
                              : offeringMrProdBehaviour
    })
  }
  
  async PopulateDDL(obj)
  {
    var url = obj.ProdCompntDtaSrcApi;
    var payload = JSON.parse(obj.ProdCompntDtaValue);
    await this.http.post(url, payload).toPromise().then(
      (response) => {
        this.dictOptions[obj.RefProdCompntCode] = response["ReturnObject"];
      }
    )
  }

  async PopulateMultiDDL(obj) {
    if (url != "") {
      var url = obj.ProdCompntDtaSrcApi;
      var payload = JSON.parse(obj.ProdCompntDtaValue);
      await this.http.post(url, payload).toPromise().then(
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

  onMultiDDLChangeEvent(refProdCompntCode, index, indexparent) {
    var selectedId = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
    var selectedText = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
    this.FormProdOfferingComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      OfferingCompntValue: selectedId.join(";"),
      OfferingCompntValueDesc: selectedText.join(",")
    })
  }

  async PopulateBehaviourDDL(obj, behaviourDDL)
  {
    this.dictBehaviour[obj.RefProdCompntCode] = behaviourDDL.filter(f=>f.BehaviourType == obj.BehaviourType);
  }

  LoadProdComponent(ProdOfferingHId, CompGroups, IsFilterBizTmpltCode)
  {

    var ProdOfferingComponent: ReqGetProdOffCompntObj = new ReqGetProdOffCompntObj();
    ProdOfferingComponent.ProdOfferingHId = ProdOfferingHId,
    ProdOfferingComponent.GroupCodes = CompGroups.split(","),
    ProdOfferingComponent.IsFilterBizTmpltCode = IsFilterBizTmpltCode

    this.http.post(URLConstant.GetProductOfferingComponentGrouped, ProdOfferingComponent).toPromise().then(
      async (response) => {
        console.log(response);
        for (var i = 0; i < response[CommonConstant.ReturnObj]["ProdOffComponents"].length; i++) {
          var group = response[CommonConstant.ReturnObj]["ProdOffComponents"][i];
          var fa_group = this.FormProdOfferingComp.controls['groups'] as FormArray;
          var behaviourDDL = response[CommonConstant.ReturnObj]["BehaviourDropDownList"];

          fa_group.push(this.addGroup(group.GroupCode, group.GroupName));

          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            if(comp.ProdCompntType=="DDL" && comp.IsProdOffering == true)
            {
              await this.PopulateDDL(comp)
            }
            if (comp.ProdCompntType == "MULTI_DDL" && comp.IsProdOffering == true) {
              await this.PopulateMultiDDL(comp);
            }
            if(this.ShowBehaviour == true){
              await this.PopulateBehaviourDDL(comp, behaviourDDL);
            }
          }

          for (var j = 0; j < group.Components.length; j++) {
            var comp = group.Components[j];
            var fa_comp = (<FormArray>this.FormProdOfferingComp.controls['groups']).at(i).get('components') as FormArray;
            fa_comp.push(this.addComponent(comp));
          }
        }
      }
    )
  }


  GetBehaviourValue(refProdCompntCode, behaviourCode) {
    return this.dictBehaviour[refProdCompntCode].find(f => f.Key == behaviourCode).Value
  }

  SaveForm()
  {
    this.generateListForm(this.FormProdOfferingComp);
    this.Save.emit(this.list);
  }

  NextDetail(){
    this.generateListForm(this.FormProdOfferingComp);
    this.Next.emit(this.list);
  }

  Cancel()
  {
    this.OnCancel.emit();
  }

  generateListForm(formProdOfferingComp){
    this.list = [];
    for (let i = 0; i < formProdOfferingComp.controls.groups.length; i++) {
      for (let j = 0; j < formProdOfferingComp.controls.groups.controls[i].controls["components"].length; j++) {
        if(this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].controls.ProdCompntType.value == "AMT"){
          this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].patchValue({
            OfferingCompntValueDesc : this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].controls.OfferingCompntValue.value
          });
        }
        if (this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].controls.ProdCompntType.value == "MULTI_DDL") {
          var refProdCompntCode = this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].controls.RefProdCompntCode.value;
          var selectedId = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_id);
          var selectedText = this.selectedMultiDDLItems[refProdCompntCode].map(x => x.item_text);
          this.FormProdOfferingComp.controls["groups"].controls[i].controls["components"].controls[j].patchValue({
            OfferingCompntValue: selectedId.join(";"),
            OfferingCompntValueDesc: selectedText.join(", ")
          });
        }
        this.list.push(Object.assign({}, ...formProdOfferingComp.controls.groups.controls[i].controls["components"].controls[j].getRawValue()));
      }
    }
  }

  onChangeCompntEvent(val,event,index,indexparent)
  {
    this.FormProdOfferingComp.controls["groups"].controls[indexparent].controls["components"].controls[index].patchValue({
      OfferingCompntValueDesc : this.dictOptions[val].find(f=>f.Key == event.target.value).Value
    })
  }
  DownloadRule(CompntValue, CompntValueDesc) {
    this.DlRuleObj.RuleSetName = CompntValue;
    this.http.post(URLConstant.DownloadProductRule, this.DlRuleObj, { responseType: 'blob' }).subscribe(
      response => {
        saveAs(response, CompntValueDesc + '.xlsx');
      }
    );
  }
}
