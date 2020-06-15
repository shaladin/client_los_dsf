import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { InputSearchObj } from 'app/shared/model/InputSearchObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { UCSearchComponent } from '@adins/ucsearch';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-search-cross-app',
  templateUrl: './search-cross-app.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})
export class SearchCrossAppComponent implements OnInit {

  @ViewChild(UCSearchComponent) UCSearchComponent;
  @Output() objTempOutput: EventEmitter<any> = new EventEmitter();
  @Input() ListCrossAppObjInput: any;
  constructor(
    private toastr:NGXToastrService,
    private modalService: NgbModal,
  ) { }

  tempData = [];
  inputObj;
  arrAddCrit;
  pageNow;
  pageSize;
  apiUrl;
  listSelectedId;
  tempListId;
  ngOnInit() {
    
    this.MakeSearchInputObj();

    this.listSelectedId = new Array();
    this.tempListId = new Array();
    this.tempData = new Array();
    this.arrCrit = new Array();
    
    this.pageNow = 1;
    this.pageSize = 10;
    this.apiUrl = environment.losUrl + AdInsConstant.GetPagingObjectBySQL;
  }

  addCritAppId;
  MakeSearchInputObj(){
    this.arrAddCrit = new Array();
    this.addCritAppId = new CriteriaObj();
    this.addCritAppId.DataType = "numeric";
    this.addCritAppId.propName = "ap.APP_ID";
    this.addCritAppId.restriction = AdInsConstant.RestrictionNotIn;
    this.addCritAppId.listValue = [this.ListCrossAppObjInput["appId"]];
    
    // addCrit.listValue = [11];

    this.arrAddCrit.push(this.addCritAppId);

    if(this.ListCrossAppObjInput["result"].length>0){
      var addCrit = new CriteriaObj();
      addCrit.DataType = "string";
      addCrit.propName = "ag.AGRMNT_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      addCrit.listValue = this.ListCrossAppObjInput["result"];
      // console.log(addCrit);
      // console.log(this.arrAddCrit);
      this.arrAddCrit.push(addCrit);
    }

    this.inputObj = new InputSearchObj();
    this.inputObj._url = "./assets/search/searchCrossApp.json";
    this.inputObj.enviromentUrl = environment.losUrl;
    this.inputObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputObj.addCritInput = this.arrAddCrit;
  }

  resultData = { Data: new Array() };
  getResult(ev) {
    this.resultData=ev["response"];
    console.log(this.resultData);
  }

  checkboxAll;
  SelectAll(ev: any){
    // console.log(ev);
    // console.log(this.resultData);
    this.checkboxAll=ev;
    if(this.checkboxAll){
      for(var i=0;i<this.resultData.Data.length;i++){
        var idx = this.resultData.Data[i].AgrmntId;
        if(this.listSelectedId.indexOf(idx)<0){
          this.listSelectedId.push(idx);
        }
      }
    }else{
      for(var i=0;i<this.resultData.Data.length;i++){
        var index = this.resultData.Data[i].AgrmntId;
        var idx = this.listSelectedId.indexOf(index);
        if(idx > -1){
          this.listSelectedId.splice(idx, 1);
        }
        // console.log(this.resultData.Data[i]);
      }
    }
    // console.log(this.listSelectedId);
  }

  Checked(AgrmntId: any, isChecked: any){
    if(isChecked){
      this.listSelectedId.push(AgrmntId);
    }else{
      var idx = this.listSelectedId.indexOf(AgrmntId);
      if(idx > -1){
        this.listSelectedId.splice(idx, 1);
        this.checkboxAll = false;
      }
    }
  }

  orderByKey;
  orderByValue;
  searchSort(ev: any){
    console.log(ev);
    if (this.resultData != null) {
      if (this.orderByKey == ev.target.attributes.name.nodeValue) {
        this.orderByValue = !this.orderByValue
      } else {
        this.orderByValue = true
      }
      this.orderByKey = ev.target.attributes.name.nodeValue
      let order = {
        key: this.orderByKey,
        value: this.orderByValue
      }
      this.UCSearchComponent.search(this.apiUrl, this.pageNow, this.pageSize, order)
    }
  }

  arrCrit;
  addToTemp(){
    console.log("ADD to TEMP");
    if(this.listSelectedId.length != 0){
      for (var i = 0; i < this.listSelectedId.length; i++) {
        this.tempListId.push(this.listSelectedId[i]);
        var object = this.resultData.Data.find(x => x.AgrmntId == this.listSelectedId[i]);
        object["IsAllowedCrt"]=false;
        this.tempData.push(object);
      }

      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "string";
      addCrit.propName = "ag.AGRMNT_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      var tempList = [];
      for(var i=0;i<this.tempListId.length;i++){
        var temp = this.tempData.find(x => x.AgrmntId == this.tempListId[i]);
        tempList.push(temp["AgrmntNo"]);
      }
      for(var i=0;i<this.ListCrossAppObjInput["result"].length;i++){
        tempList.push(this.ListCrossAppObjInput["result"][i]);
      }
      console.log(tempList);
      addCrit.listValue = tempList;
      this.arrAddCrit.push(addCrit);
      this.arrAddCrit.push(this.addCritAppId);

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
      console.log("temp data");
      console.log(this.tempData);
      this.checkboxAll = false;
    }else{
      this.toastr.typeErrorCustom("Please select at least one Aggreement");
    }
  }

  deleteFromTemp(AgrmntId: any){
    if (confirm('Are you sure to delete this record?')) {
      this.arrAddCrit = new Array();
      if (this.arrCrit.length != 0) {
        for (var i = 0; i < this.arrCrit.length; i++) {
          this.arrAddCrit.push(this.arrCrit[i]);
        }
      }

      var index = this.tempListId.indexOf(AgrmntId);
      if (index > -1) {
        this.tempListId.splice(index, 1);
        this.tempData.splice(index, 1);
      }
      var addCrit = new CriteriaObj();
      addCrit.DataType = "string";
      addCrit.propName = "ag.AGRMNT_NO";
      addCrit.restriction = AdInsConstant.RestrictionNotIn;
      var tempList = [];
      for(var i=0;i<this.tempListId.length;i++){
        var temp = this.tempData.find(x => x.AgrmntId == this.tempListId[i]);
        tempList.push(temp["AgrmntNo"]);
      }
      for(var i=0;i<this.ListCrossAppObjInput["result"].length;i++){
        tempList.push(this.ListCrossAppObjInput["result"][i]);
      }
      console.log(tempList);
      addCrit.listValue = tempList;
      this.arrAddCrit.push(this.addCritAppId);

      if (this.tempListId.length != 0 || this.ListCrossAppObjInput["result"].length != 0) {
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

  SaveToTemp(){
    this.objTempOutput.emit(this.tempData);
    this.modalService.dismissAll();
  }
}
