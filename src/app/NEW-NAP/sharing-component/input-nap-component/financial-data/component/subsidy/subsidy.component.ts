import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubsidyAddEditComponent } from '../subsidy-add-edit/subsidy-add-edit.component';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-subsidy',
  templateUrl: './subsidy.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SubsidyComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm : FormGroup;
  @Input() BizTemplateCode: string;
  @Output() emitData = new EventEmitter();
  @Output() emitDataWithRefresh = new EventEmitter();

  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  listAppFeeObj : Array<AppFeeObj> = new Array<AppFeeObj>();

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.LoadSubsidyData();
  }

  AddReason()
  {
    this.listAppFeeObj = this.ParentForm.get("AppFee").value;
    const modalRef = this.modalService.open(SubsidyAddEditComponent);
    modalRef.componentInstance.mode = "add";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.ParentForm = this.ParentForm;
    modalRef.componentInstance.listAppFeeObj = this.listAppFeeObj;
    modalRef.componentInstance.BizTemplateCode = this.BizTemplateCode;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.LoadSubsidyData(true);
      this.SetNeedReCalculate(true);
    })
  }

  editSubsidy(obj){
    this.listAppFeeObj = this.ParentForm.get("AppFee").value;
    const modalRef = this.modalService.open(SubsidyAddEditComponent);
    modalRef.componentInstance.mode = "edit";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.ParentForm = this.ParentForm;
    modalRef.componentInstance.AppSubsidyId = obj.AppSubsidyId;
    modalRef.componentInstance.listAppFeeObj = this.listAppFeeObj;
    modalRef.componentInstance.BizTemplateCode = this.BizTemplateCode;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.LoadSubsidyData(true);
      this.SetNeedReCalculate(true);
    })
  }

  deleteSubsidy(obj)
  {
      if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
        this.http.post(URLConstant.DeleteSubsidy, { Id : obj.AppSubsidyId }).subscribe(
          (response) => {
            this.LoadSubsidyDataWithoutRule();
            this.SetNeedReCalculate(true);
          }
        );
      }
  }

  LoadSubsidyData(isRefresh = false)
  {
    this.http.post(URLConstant.GetOrInitAppSubsidyByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
        if(isRefresh){
          this.emitDataWithRefresh.emit(this.listSubsidy);
        }else{
          this.emitData.emit(this.listSubsidy);
        }
      }
    );
  }

  LoadSubsidyDataWithoutRule()
  {
    this.http.post(URLConstant.GetListAppSubsidyByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
        this.emitDataWithRefresh.emit(this.listSubsidy);
      }
    );
  }

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }
}
