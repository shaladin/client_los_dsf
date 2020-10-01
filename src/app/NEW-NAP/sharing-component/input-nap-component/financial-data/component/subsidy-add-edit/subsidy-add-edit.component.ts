import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { ResultSubsidySchmMaxRuleObj } from 'app/shared/model/SubsidySchm/ResultSubsidySchmMaxRuleObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { AppObj } from 'app/shared/model/App/App.Model';

@Component({
  selector: 'app-subsidy-add-edit',
  templateUrl: './subsidy-add-edit.component.html',
})
export class SubsidyAddEditComponent implements OnInit {
  @Input() mode: string = "add";
  @Input() AppSubsidyId: number;
  @Input() AppId: number;
  @Input() listAppFeeObj: Array<AppFeeObj>;
  @Input() ParentForm: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.InitForm();
    this.LoadDDLFromTypeCode();

    if (this.mode == "edit") {
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
        subsidyPrcnt: [0, [Validators.min(0), Validators.max(100)]],
        subsidyAmt: [0],
      }
    );
    this.isSubmitted = false;
  }

  GetAppSubsidy() {
    this.http.post<AppSubsidyObj>(URLConstant.GetAppSubsidyByAppSubsidyId, { AppSubsidyId: this.AppSubsidyId }).subscribe(
      (response) => {
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
        this.LoadDDLSubsidyValueType(subdObj.MrSubsidyFromTypeCode, subdObj.MrSubsidyAllocCode, subdObj.MrSubsidySourceCode);

        this.FormAppSubsidy.patchValue({
          fromTypeCode: subdObj.MrSubsidyFromTypeCode,
          fromValueCode: subdObj.MrSubsidyFromValueCode,
          allocCode: subdObj.MrSubsidyAllocCode,
          sourceCode: subdObj.MrSubsidySourceCode,
          valueType: subdObj.MrSubsidyValueTypeCode,
          subsidyPrcnt: subdObj.SubsidyPrcnt,
          subsidyAmt: subdObj.SubsidyAmt,
        });
      }
    );
  }

  LoadSubsidyMaxRule() {
    this.http.post(URLConstant.GetRuleSubsidyMax, { AppId: this.AppId }).subscribe(
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

    if (this.mode == "add") {
      this.http.post(URLConstant.AddAppSubsidy, subdObj).subscribe(
        (response) => {
          var x = response[CommonConstant.ReturnObj];
          this.emitData.emit(x);
          this.activeModal.close();
        }
      );
    }
    if (this.mode == "edit") {
      subdObj.AppSubsidyId = this.AppSubsidyId;

      this.http.post(URLConstant.EditAppSubsidy, subdObj).subscribe(
        (response) => {
          var x = response[CommonConstant.ReturnObj];
          this.emitData.emit(x);
          this.activeModal.close();
        }
      );
    }
  }

  LoadDDLFromTypeCode() {
    this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, { RefMasterTypeCode: CommonConstant.RefMasterTypeCodeSubsidyFromType }).subscribe(
      (response) => {
        this.FromTypeCodeOptions = response[CommonConstant.ReturnObj];

        if (this.ParentForm.get("VendorAtpmCode").value == null) {
          var atpmIndex = this.FromTypeCodeOptions.findIndex(x => x.Key == CommonConstant.SubsidyFromTypeAtpm);

          if (atpmIndex != -1) {
            this.FromTypeCodeOptions.splice(atpmIndex, 1);
          }
        }

        this.http.post<AppObj>(URLConstant.GetAppById, { AppId: this.AppId }).subscribe(
          (response) => {
            if (response.BizTemplateCode == CommonConstant.CFRFN4W) {
              let supplierIndex = this.FromTypeCodeOptions.findIndex(x => x.Key == CommonConstant.SubsidyFromTypeSupplier);
              if (supplierIndex != -1) {
                this.FromTypeCodeOptions.splice(supplierIndex, 1);
              }
            }
          });
      }
    );
  }

  LoadDDLFromValue(fromTypeCode: string) {
    this.http.post(URLConstant.GetListSubsidyFromValue, { AppId: this.AppId, SubsidyFromType: fromTypeCode }).subscribe(
      (response) => {
        this.FromValueOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadDDLSubsidyAlloc(fromTypeCode: string) {
    this.http.post(URLConstant.GetListSubsidyAllocation, { SubsidyFromType: fromTypeCode, AppId : this.AppId }).subscribe(
      (response) => {
        this.AllocCodeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadDDLSubsidySource(fromTypeCode: string, allocCode: string) {
    this.http.post(URLConstant.GetListSubsidySource, { SubsidyFromType: fromTypeCode, SubsidyAllocCode: allocCode, AppId : this.AppId }).subscribe(
      (response) => {
        this.SourceCodeOptions = response[CommonConstant.ReturnObj];
      }
    );
  }

  LoadDDLSubsidyValueType(fromTypeCode: string, allocCode: string, sourceCode: string) {
    this.http.post(URLConstant.GetListSubsidyValueType,
      {
        SubsidyFromType: fromTypeCode,
        SubsidyAllocCode: allocCode,
        SubsidySourceCode: sourceCode,
        AppId : this.AppId
      }).subscribe(
        (response) => {
          this.ValueTypeOptions = response[CommonConstant.ReturnObj];

          if (this.ValueTypeOptions.length == 1) {
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

  DDLFromValue_OnChange() {

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

    this.LoadDDLSubsidyValueType(fromTypeCode, allocCode, sourceCode);
  }

  DDLValueType_OnChange() {
    this.FormAppSubsidy.patchValue({
      subsidyPrcnt: 0,
      subsidyAmt: 0,
    })
  }
}