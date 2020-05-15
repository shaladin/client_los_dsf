import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubsidyAddEditComponent } from '../subsidy-add-edit/subsidy-add-edit.component';
import { AppFeeObj } from 'app/shared/model/AppFeeObj.Model';

@Component({
  selector: 'app-subsidy',
  templateUrl: './subsidy.component.html',
})
export class SubsidyComponent implements OnInit {
  @Input() AppId: number;
  @Input() ParentForm : FormGroup;

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
    const modalRef = this.modalService.open(SubsidyAddEditComponent, { size:'sm' });
    modalRef.componentInstance.mode = "add";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.listAppFeeObj = this.listAppFeeObj;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      this.LoadSubsidyData();
      this.SetNeedReCalculate(true);
    })
  }

  deleteSubsidy(obj)
  {
      if (confirm('Are you sure to delete this record?')) {
        console.log(obj)
        this.http.post(environment.losUrl + "/AppSubsidy/DeleteSubsidy", { AppSubsidyId : obj.AppSubsidyId }).subscribe(
          (response) => {
            this.LoadSubsidyData();
            this.SetNeedReCalculate(true);
          },
          (error) => {
            console.log(error);
          }
        );
      }
  }

  LoadSubsidyData()
  {
    this.http.post(environment.losUrl + "/AppSubsidy/GetOrInitAppSubsidyByAppId", { AppId: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
      }
    );
  }

  SetNeedReCalculate(value) {
    this.ParentForm.patchValue({
      NeedReCalculate: value
    });
  }
}
