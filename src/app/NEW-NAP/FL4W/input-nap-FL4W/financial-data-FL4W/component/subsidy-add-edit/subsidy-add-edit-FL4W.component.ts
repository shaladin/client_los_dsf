import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/app-subsidy-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { ResultSubsidySchmMaxRuleObj } from 'app/shared/model/subsidy-schm/result-subsidy-schm-max-rule-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ReqGetListSubsidyDataByAppIdAndSubsidyFromTypeObj } from 'app/shared/model/app-subsidy/req-get-list-subsidy-data-by-app-id-and-subsidy-from-type-obj.model';
import { ReqGetSubsidySourceObj } from 'app/shared/model/app-subsidy/req-get-subsidy-source-obj.model';
import { ReqGetSubsidyValueTypeObj } from 'app/shared/model/app-subsidy/req-get-subsidy-value-type-obj.model';

@Component({
  selector: 'app-subsidy-add-edit-FL4W',
  templateUrl: './subsidy-add-edit-FL4W.component.html',
})
export class SubsidyAddEditFL4WComponent implements OnInit {
    @Input() mode: string = "add";
    @Input() AppSubsidyId: number;
    @Input() AppId: number;
    @Input() listAppFeeObj : Array<AppFeeObj>;
    @Input() ParentForm : FormGroup;
    @Output() emitData = new EventEmitter();

    FormAppSubsidy: FormGroup;
    isSubmitted: boolean = false;
    FromTypeCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    FromValueOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    AllocCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    SourceCodeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    ValueTypeOptions: Array<KeyValueObj> = new Array<KeyValueObj>();
    showFromValue: boolean = false;
    subsidyMaxRuleObj: ResultSubsidySchmMaxRuleObj = new ResultSubsidySchmMaxRuleObj();

    readonly CurrencyMaskPrct = CommonConstant.CurrencyMaskPrct;
    constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      public activeModal: NgbActiveModal
    ) { }
  
    ngOnInit() {
  
      this.InitForm();
      this.LoadDDLFromTypeCode();

      if(this.mode == "edit"){
        this.GetAppSubsidy();
      }
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
          subsidyPrcnt: [0,[Validators.min(0),Validators.max(100)]],
          subsidyAmt: [0],
          RowVersion: [''],
        }
      );
      this.isSubmitted = false;
    }

    GetAppSubsidy(){
      this.http.post<AppSubsidyObj>(URLConstant.GetAppSubsidyByAppSubsidyId, { Id: this.AppSubsidyId }).subscribe(
        (response) => {
          console.log(response)
          var subdObj = response;

          this.LoadDDLSubsidyAlloc(subdObj.MrSubsidyFromTypeCode);
  
          if (subdObj.MrSubsidyFromTypeCode != 'MF') {
            this.showFromValue = true;
            this.LoadDDLFromValue(subdObj.MrSubsidyFromTypeCode);
          }
          else {
            this.showFromValue = false;
          }

          this.LoadDDLSubsidySource(subdObj.MrSubsidyFromTypeCode, subdObj.MrSubsidyAllocCode);
          this.LoadDDLSubsidyValueType(subdObj.MrSubsidyFromTypeCode, subdObj.MrSubsidyAllocCode , subdObj.MrSubsidySourceCode);

          this.FormAppSubsidy.patchValue({
            fromTypeCode: subdObj.MrSubsidyFromTypeCode,
            fromValueCode: subdObj.MrSubsidyFromValueCode,
            allocCode: subdObj.MrSubsidyAllocCode,
            sourceCode: subdObj.MrSubsidySourceCode,
            valueType: subdObj.MrSubsidyValueTypeCode,
            subsidyPrcnt: subdObj.SubsidyPrcnt,
            subsidyAmt: subdObj.SubsidyAmt,
            RowVersion: subdObj.RowVersion,            
          });
        }
      );
    }

    LoadSubsidyMaxRule()
    {
      let GetRuleSubsidyMaxURL = environment.isCore ? URLConstant.GetRuleSubsidyMaxV2 : URLConstant.GetRuleSubsidyMax;
      this.http.post(GetRuleSubsidyMaxURL, { Id: this.AppId }).subscribe(
        (response) => {
          this.subsidyMaxRuleObj = response["ResultSubsidyMaxRuleObj"];
        }
      );
    }
  
    setSubmitted() {
      this.isSubmitted = true;
      return true;
    }
  
    SaveSubsidy() {
      var subdObj: AppSubsidyObj = new AppSubsidyObj();
      subdObj.AppId = this.FormAppSubsidy.get("appId").value;
      subdObj.MrSubsidyFromTypeCode = this.FormAppSubsidy.get("fromTypeCode").value;
      subdObj.MrSubsidyFromTypeName = (this.FormAppSubsidy.get("fromTypeCode").value == "") ? "" : this.FromTypeCodeOptions.find(f => f.Key == this.FormAppSubsidy.get("fromTypeCode").value).Value;
      subdObj.MrSubsidyFromValueCode = this.FormAppSubsidy.get("fromValueCode").value;
      subdObj.MrSubsidyFromValueName = (this.FormAppSubsidy.get("fromValueCode").value == "") ? "" : this.FromValueOptions.find(f => f.Key == this.FormAppSubsidy.get("fromValueCode").value).Value;
      subdObj.MrSubsidyAllocCode = this.FormAppSubsidy.get("allocCode").value;
      subdObj.MrSubsidyAllocName = (this.FormAppSubsidy.get("allocCode").value == "") ? "" : this.AllocCodeOptions.find(f => f.Key == this.FormAppSubsidy.get("allocCode").value).Value;
      subdObj.MrSubsidySourceCode = this.FormAppSubsidy.get("sourceCode").value;
      subdObj.MrSubsidySourceName = (this.FormAppSubsidy.get("sourceCode").value == "") ? "" : this.SourceCodeOptions.find(f => f.Key == this.FormAppSubsidy.get("sourceCode").value).Value;
      subdObj.MrSubsidyValueTypeCode = this.FormAppSubsidy.get("valueType").value;
      subdObj.MrSubsidyValueTypeName = (this.FormAppSubsidy.get("valueType").value == "") ? "" : this.ValueTypeOptions.find(f => f.Key == this.FormAppSubsidy.get("valueType").value).Value;
      subdObj.SubsidyAmt = this.FormAppSubsidy.get("subsidyAmt").value;
      subdObj.SubsidyPrcnt = this.FormAppSubsidy.get("subsidyPrcnt").value;
      subdObj.AppFees = this.listAppFeeObj;

      if(this.mode == "add"){
        let AddAppSubsidyURL = environment.isCore ? URLConstant.AddAppSubsidyV2 : URLConstant.AddAppSubsidy;
        this.http.post(AddAppSubsidyURL, subdObj ).subscribe(
          (response) => {
            var x = response[CommonConstant.ReturnObj];
            this.emitData.emit(x);
            this.activeModal.close();
          }
        );
      }
      if(this.mode == "edit"){
        subdObj.AppSubsidyId = this.AppSubsidyId;
        subdObj.RowVersion = this.FormAppSubsidy.get("RowVersion").value;
        
        let EditAppSubsidyURL = environment.isCore ? URLConstant.EditAppSubsidyV2 : URLConstant.EditAppSubsidy;
        this.http.post(EditAppSubsidyURL, subdObj ).subscribe(
          (response) => {
            var x = response[CommonConstant.ReturnObj];
            this.emitData.emit(x);
            this.activeModal.close();
          }
        );
      }
    }
  
    LoadDDLFromTypeCode() {
      this.http.post(URLConstant.GetListSubsidyFromTypeCode, { Id: this.AppId }).subscribe(
        (response) => {
          this.FromTypeCodeOptions = response[CommonConstant.ReturnObj];

          if(this.ParentForm.get("VendorAtpmCode").value == null){
            var atpmIndex = this.FromTypeCodeOptions.findIndex(x => x.Key == CommonConstant.SubsidyFromTypeAtpm);

            if(atpmIndex != -1){
              this.FromTypeCodeOptions.splice(atpmIndex, 1);
            }
          }
        }
      );
    }

    LoadDDLFromValue(fromTypeCode: string) {
      let reqObj: ReqGetListSubsidyDataByAppIdAndSubsidyFromTypeObj = { AppId: this.AppId, SubsidyFromType: fromTypeCode };
      this.http.post(URLConstant.GetListSubsidyFromValue, reqObj).subscribe(
        (response) => {
          this.FromValueOptions = response[CommonConstant.ReturnObj];
        }
      );
    }
    
    LoadDDLSubsidyAlloc(fromTypeCode: string) {
      let reqObj: ReqGetListSubsidyDataByAppIdAndSubsidyFromTypeObj = { AppId: this.AppId, SubsidyFromType: fromTypeCode };
      this.http.post(URLConstant.GetListSubsidyAllocation, reqObj).subscribe(
        (response) => {
          this.AllocCodeOptions = response[CommonConstant.ReturnObj];
        }
      );
    }

    LoadDDLSubsidySource(fromTypeCode: string, allocCode: string) {
      let reqObj: ReqGetSubsidySourceObj = { AppId: this.AppId, SubsidyFromType: fromTypeCode, SubsidyAllocCode: allocCode };
      this.http.post(URLConstant.GetListSubsidySource, reqObj).subscribe(
        (response) => {
          this.SourceCodeOptions = response[CommonConstant.ReturnObj];
        }
      );
    }
  
    LoadDDLSubsidyValueType(fromTypeCode: string, allocCode: string, sourceCode : string) {
      let reqObj: ReqGetSubsidyValueTypeObj = { AppId: this.AppId, SubsidyFromType: fromTypeCode, SubsidyAllocCode: allocCode, SubsidySourceCode: sourceCode };
      this.http.post(URLConstant.GetListSubsidyValueType, reqObj).subscribe(
        (response) => {
          this.ValueTypeOptions = response[CommonConstant.ReturnObj];

          if(this.ValueTypeOptions.length == 1)
          {
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

      this.FormAppSubsidy.patchValue({
        sourceCode: '',
        valueType: '',
      })

      this.LoadDDLSubsidySource(fromTypeCode, allocCode);
    }
  
    DDLSourceCode_OnChange(e) {
      var fromTypeCode = this.FormAppSubsidy.get("fromTypeCode").value;
      var allocCode = this.FormAppSubsidy.get("allocCode").value;
      var sourceCode = e.target.value;

      this.FormAppSubsidy.patchValue({
        valueType: ''
      })

      this.LoadDDLSubsidyValueType(fromTypeCode,allocCode,sourceCode);
    }

    DDLValueType_OnChange(e){
      this.FormAppSubsidy.patchValue({
        subsidyPrcnt: 0,
        subsidyAmt: 0,
      })
    }
  }
