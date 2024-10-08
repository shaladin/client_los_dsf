import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, FormGroupDirective } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/app-subsidy-obj.model';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubsidyAddEditCFNAComponent } from '../subsidy-add-edit/subsidy-add-edit-cfna.component';
import { AppFeeObj } from 'app/shared/model/app-fee-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-subsidy-cfna',
  templateUrl: './subsidy-cfna.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SubsidyCFNAComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm : FormGroup;
  @Output() emitData = new EventEmitter();


  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();
  listAppFeeObj : Array<AppFeeObj> = new Array<AppFeeObj>();

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    console.log("on init");
    this.LoadSubsidyData();
  }

  AddReason()
  {
    this.listAppFeeObj = this.ParentForm.get("AppFee").value;
    const modalRef = this.modalService.open(SubsidyAddEditCFNAComponent);
    modalRef.componentInstance.mode = "add";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.ParentForm = this.ParentForm;
    modalRef.componentInstance.listAppFeeObj = this.listAppFeeObj;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.LoadSubsidyData();
      this.SetNeedReCalculate(true);
    })
  }

  editSubsidy(obj){
    this.listAppFeeObj = this.ParentForm.get("AppFee").value;
    const modalRef = this.modalService.open(SubsidyAddEditCFNAComponent);
    modalRef.componentInstance.mode = "edit";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.ParentForm = this.ParentForm;
    modalRef.componentInstance.AppSubsidyId = obj.AppSubsidyId;
    modalRef.componentInstance.listAppFeeObj = this.listAppFeeObj;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.LoadSubsidyData();
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

  LoadSubsidyData()
  {
    let InitAppSubsidyUrl = environment.isCore ? URLConstant.GetOrInitAppSubsidyByAppIdV2 : URLConstant.GetOrInitAppSubsidyByAppId;
    this.http.post(InitAppSubsidyUrl, { Id: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
        this.emitData.emit(this.listSubsidy);
      }
    );
  }

  LoadSubsidyDataWithoutRule()
  {
    this.http.post(URLConstant.GetListAppSubsidyByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
        this.emitData.emit(this.listSubsidy);
      }
    );
  }

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }
}
