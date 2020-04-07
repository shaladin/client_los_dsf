import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSubsidyObj } from 'app/shared/model/AppSubsidyObj.Model';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSubsidyAddEditComponent } from '../app-subsidy-add-edit/app-subsidy-add-edit.component';

@Component({
  selector: 'app-app-subsidy',
  templateUrl: './app-subsidy.component.html',
})
export class AppSubsidyComponent implements OnInit {
  @Input() AppId: number;
  
  listSubsidy: Array<AppSubsidyObj> = new Array<AppSubsidyObj>();

  constructor(
    private http: HttpClient,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.LoadSubsidyData();
  }

  AddReason()
  {
    const modalRef = this.modalService.open(AppSubsidyAddEditComponent, { size:'sm' });
    modalRef.componentInstance.mode = "add";
    modalRef.componentInstance.AppId = this.AppId;
    modalRef.componentInstance.emitData.subscribe(($e) => {
      // this.RefreshData($e);
    })
  }

  LoadSubsidyData()
  {
    this.http.post(environment.losUrl + "/AppSubsidy/GetListAppSubsidyByAppId", { AppId: this.AppId }).subscribe(
      (response) => {
        this.listSubsidy = response["AppSubsidies"];
      }
    );
  }
}
