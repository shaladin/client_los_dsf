import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-app-subsidy-add-edit',
  templateUrl: './app-subsidy-add-edit.component.html',
})
export class AppSubsidyAddEditComponent implements OnInit {
    @Input() AppId: number;
    @Output() emitData = new EventEmitter();

    FormAppSubsidy: FormGroup;
    listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
    isSubmitted: boolean = false;
    FromTypeCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    FromValueOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    AllocCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    SourceCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    ValueTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    showFromValue: boolean = false;
    constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      public activeModal: NgbActiveModal
    ) { }
  
    ngOnInit() {
  
      this.InitForm();
      this.LoadDDLFromTypeCode();
      console.log(this.AppId);
    }

    InitForm() {
      this.FormAppSubsidy = this.fb.group(
        {
          appId: [this.AppId, Validators.required],
          fromTypeCode: ['', Validators.required],
          fromValueCode: [''],
          allocCode: ['', Validators.required],
          sourceCode: ['', Validators.required],
          valueType: [''],
          subsidyPrcnt: [0],
          subsidyAmt: [0],
        }
      );
      this.isSubmitted = false;
    }
  
    delete(i) {
      if (confirm("Are you sure to delete this record?")) {
        this.listSubsidy.splice(i, 1);
      }
    }
  
    
  
    setSubmitted() {
      this.isSubmitted = true;
      return true;
    }
  
    SaveSubsidy() {
      var subdObj: AppSubsidyObj = new AppSubsidyObj();
      subdObj.AppId = this.FormAppSubsidy.get("appId").value
      subdObj.MrSubsidyFromTypeCode = this.FormAppSubsidy.get("fromTypeCode").value;
      subdObj.MrSubsidyFromTypeName = (this.FormAppSubsidy.get("fromTypeCode").value == "") ? "" : this.FromTypeCodeOptions.find(f => f.Key == this.FormAppSubsidy.get("fromTypeCode").value).Value;
      subdObj.MrSubsidyFromValueCode = this.FormAppSubsidy.get("fromValueCode").value;
      subdObj.MrSubsidyFromValueName = (this.FormAppSubsidy.get("fromValueCode").value == "") ? "" : this.FromValueOptions.find(f => f.Key == this.FormAppSubsidy.get("fromValueCode").value).Value;
      subdObj.MrSubsidyAllocCode = this.FormAppSubsidy.get("allocCode").value;
      subdObj.MrSubsidyAllocName = this.FormAppSubsidy.get("allocCode").value;
      subdObj.MrSubsidySourceCode = this.FormAppSubsidy.get("sourceCode").value;
      subdObj.MrSubsidySourceName = this.FormAppSubsidy.get("sourceCode").value;
      subdObj.MrSubsidyValueTypeCode = this.FormAppSubsidy.get("valueType").value;
      subdObj.MrSubsidyValueTypeName = this.FormAppSubsidy.get("valueType").value;
      subdObj.SubsidyAmt = this.FormAppSubsidy.get("subsidyAmt").value;
      subdObj.SubsidyPrcnt = this.FormAppSubsidy.get("subsidyPrcnt").value;
      // this.listSubsidy.push(subdObj);
      // this.InitForm();
      this.activeModal.close();
    }
  
    LoadDDLFromTypeCode() {
      this.http.post(AdInsConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: "SUBSIDY_FROM_TYPE" }).subscribe(
        (response) => {
          this.FromTypeCodeOptions = response["ReturnObject"];
        }
      );
    }

    LoadDDLFromValue(fromTypeCode: string) {
      this.http.post(environment.losUrl + "/AppSubsidy/GetListSubsidyFromValue", { AppId: this.AppId }).subscribe(
        (response) => {
          this.FromValueOptions = response["ReturnObject"];
        }
      );
    }
    
    LoadDDLSubsidyAlloc(fromTypeCode: string) {
      this.http.post(environment.losUrl + "/AppSubsidy/GetListSubsidyAllocation", { SubsidyFromType: fromTypeCode }).subscribe(
        (response) => {
          this.AllocCodeOptions = response["ReturnObject"];
        }
      );
    }

    LoadDDLSubsidySource(fromTypeCode: string, allocCode: string) {
      this.http.post(environment.losUrl + "/AppSubsidy/GetListSubsidySource", { SubsidyFromType: fromTypeCode, SubsidyAllocCode: allocCode }).subscribe(
        (response) => {
          this.SourceCodeOptions = response["ReturnObject"];
        }
      );
    }
  
    LoadDDLSubsidyValueType(fromTypeCode: string, allocCode: string, sourceCode : string) {
      this.http.post(environment.losUrl + "/AppSubsidy/GetListSubsidyValueType", 
                      { SubsidyFromType: fromTypeCode, 
                        SubsidyAllocCode: allocCode,
                        SubsidySourceCode: sourceCode
                      }).subscribe(
        (response) => {
          this.ValueTypeOptions = response["ReturnObject"];

          if(this.ValueTypeOptions.length == 1)
          {
            console.log(this.SourceCodeOptions)
          }

        }
      );
    }

    DDLFromTypeCode_OnChange(e) {
      var selected_type = e.target.value;
      this.LoadDDLSubsidyAlloc(selected_type);
  
      if (selected_type != 'MF') {
        this.showFromValue = true;
        this.LoadDDLFromValue(selected_type);
      }
      else {
        this.showFromValue = false;
      }

      this.FormAppSubsidy.patchValue({
        fromValue: '',
        allocCode: '',
        sourceCode: '',
        valueType: '',
      })
    }
  
    DDLFromValue_OnChange(e) {
  
    }
  
    DDLAllocCode_OnChange(e) {
      var fromTypeCode = this.FormAppSubsidy.get("fromTypeCode").value;
      var allocCode = e.target.value;
      this.LoadDDLSubsidySource(fromTypeCode, allocCode);
    }
  
    DDLSourceCode_OnChange(e) {
      var fromTypeCode = this.FormAppSubsidy.get("fromTypeCode").value;
      var allocCode = this.FormAppSubsidy.get("allocCode").value;
      var sourceCode = e.target.value;
      this.LoadDDLSubsidyValueType(fromTypeCode,allocCode,sourceCode);
    }

    DDLValueType_OnChange(e){

    }
  }