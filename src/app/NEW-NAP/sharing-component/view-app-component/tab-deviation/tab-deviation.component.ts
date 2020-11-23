import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Sort } from '@angular/material';
import { DeviationResultObj } from 'app/shared/model/DeviationResultObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-tab-deviation',
  templateUrl: './tab-deviation.component.html',
  styleUrls: []
})
export class TabDeviationComponent implements OnInit {

  @Input() AppId;
  @Input() IsEditManualDeviation: boolean = true;

  @Output("GetData") DataEmit: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder) { }

  InitData() {
    this.AutoDeviationData = new Array();
    this.ManualDeviationData = new Array();
    this.DDLApproveAtData = new Array();
    this.DDLDeviationCriteriaData = new Array();
    this.tempDDLData = new Array();
  }

  FormObjManualDeviationData = this.fb.group({
    DeviationCrit: [''],
    ApvAt: [''],
    Notes: ['']
  });

  AutoDeviationData;
  ManualDeviationData;
  DDLDeviationCriteriaData;
  DDLApproveAtData;
  tempDDLData;
  async ngOnInit() {
    this.InitData();
    await this.GetDeviationData();
  }

  async GetDeviationData() {
    var obj = {
      AppId: this.AppId,
      RowVersion: ""
    };

    await this.http.post(URLConstant.GetListDeviationResultForDeviationDataByAppId, obj).toPromise().then(
      (response) => {
        var temp = response["deviationResultObjs"];
        this.DDLDeviationCriteriaData = response["DeviationCategory"];
        this.DDLApproveAtData = response["ApproveAt"];
        for (var i = 0; i < temp.length; i++) {
          var tempObj;
          if (temp[i].MrDeviationType == CommonConstant.DeviationTypeManualDev) {
            this.BindManualDeviationData(temp[i]);
          } else {
            tempObj = {
              SeqNo: temp[i].SeqNo,
              DeviationType: temp[i].MrDeviationTypeDesc,
              DeviationCategory: temp[i].DeviationCategory,
              OriValue: temp[i].OriginalValue,
              CurrValue: temp[i].CurrentValue,
              AppvAt: temp[i].ApvAt,
              Notes: temp[i].Notes
            };
            this.AutoDeviationData.push(tempObj);
          }
        }

        if (this.AutoDeviationData.length > 0)
          this.AutoDeviationData.sort((a, b) => a.SeqNo - b.SeqNo);
        if (this.ManualDeviationData.length > 0)
          this.ManualDeviationData.sort((a, b) => a.SeqNo - b.SeqNo);
        this.PassData();
      });
  }

  BindManualDeviationData(objData) {
    var temp = new DeviationResultObj();
    temp.DeviationResultId = objData.DeviationResultId;
    temp.SeqNo = objData.SeqNo;
    temp.DeviationCategory = objData.DeviationCategory;
    temp.MrDeviationType = objData.MrDeviationType;
    temp.RefNo = objData.RefNo;
    temp.TrxTypeCode = objData.TrxTypeCode;
    temp.ApvAt = objData.ApvAt;
    temp.OriginalValue = objData.OriginalValue;
    temp.CurrentValue = objData.CurrentValue;
    temp.BehaviourValue = objData.BehaviourValue;
    temp.IsFatal = objData.IsFatal;
    temp.Notes = objData.Notes;
    temp.RowVersion = objData.RowVersion;

    this.ManualDeviationData.push(temp);

    this.BindTempDDLData(objData.DeviationCategory);
  }

  sortAutoDeviationData(sort: Sort) {
    const data = this.AutoDeviationData.slice();
    if (!sort.active || sort.direction === '') {
      this.AutoDeviationData = data;
      return;
    }

    this.AutoDeviationData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'DeviationType': return this.compare(a.DeviationType, b.DeviationType, isAsc);
        case 'OriValue': return this.compare(a.OriValue, b.OriValue, isAsc);
        case 'CurrValue': return this.compare(a.CurrValue, b.CurrValue, isAsc);
        case 'AppvAt': return this.compare(a.AppvAt, b.AppvAt, isAsc);
        case 'Notes': return this.compare(a.Notes, b.Notes, isAsc);
        default: return 0;
      }
    });
  }

  sortManualDeviationData(sort: Sort) {
    const data = this.ManualDeviationData.slice();
    if (!sort.active || sort.direction === '') {
      this.ManualDeviationData = data;
      return;
    }

    this.ManualDeviationData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'DeviationCategory': return this.compare(a.DeviationCategory, b.DeviationCategory, isAsc);
        case 'ApvAt': return this.compare(a.ApvAt, b.ApvAt, isAsc);
        case 'Notes': return this.compare(a.Notes, b.Notes, isAsc);
        default: return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  BindDDLDataFromTempDDLData(data) {
    var idx = this.tempDDLData.indexOf(this.tempDDLData.find(x => x.DDLDeviationCriteriaData == data));
    this.DDLDeviationCriteriaData.push(this.tempDDLData[idx].DDLDeviationCriteriaData);
    this.DDLApproveAtData.push(this.tempDDLData[idx].DDLApproveAtData);
    this.tempDDLData.splice(idx, 1);
  }

  BindTempDDLData(data) {
    var idx = this.DDLDeviationCriteriaData.indexOf(data);
    var temp = {
      DDLDeviationCriteriaData: this.DDLDeviationCriteriaData[idx],
      DDLApproveAtData: this.DDLApproveAtData[idx],
    };

    this.tempDDLData.push(temp);

    this.ClearFormObj();

    this.DDLDeviationCriteriaData.splice(idx, 1);
    this.DDLApproveAtData.splice(idx, 1);
  }

  ClearFormObj() {
    this.FormObjManualDeviationData.patchValue({
      DeviationCrit: "",
      ApvAt: "",
      Notes: "",
    });
  }

  DeleteFromManualDeviationData(idxData) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      this.BindDDLDataFromTempDDLData(this.ManualDeviationData[idxData].DeviationCategory);
      this.ManualDeviationData.splice(idxData, 1);

      this.PassData();
    }
  }

  onChange(ev) {
    var idx = ev.target.selectedIndex;
    this.FormObjManualDeviationData.patchValue({
      ApvAt: this.DDLApproveAtData[idx],
    });
  }

  AddNewForm() {
    if (this.FormObjManualDeviationData.value.DeviationCrit == "") return;
    var idx = this.ManualDeviationData.length;
    var temp = new DeviationResultObj();
    temp.DeviationResultId = 0;
    temp.SeqNo = idx + 1;
    temp.DeviationCategory = this.FormObjManualDeviationData.value.DeviationCrit;
    temp.MrDeviationType = "MANUAL_DEV";
    temp.RefNo = "";
    temp.TrxTypeCode = "APP";
    temp.ApvAt = this.FormObjManualDeviationData.value.ApvAt;
    temp.OriginalValue = "-";
    temp.CurrentValue = "-";
    temp.BehaviourValue = "-";
    temp.IsFatal = false;
    temp.Notes = this.FormObjManualDeviationData.value.Notes;
    temp.RowVersion = "";

    this.ManualDeviationData.push(temp);

    this.BindTempDDLData(this.FormObjManualDeviationData.value.DeviationCrit);
    this.PassData();
  }

  ReSeqNo() {
    for (var i = 0; i < this.ManualDeviationData.length; i++) {
      if ((i + 1) != this.ManualDeviationData[i].SeqNo) {
        this.ManualDeviationData[i].DeviationResultId = 0;
        this.ManualDeviationData[i].SeqNo = i + 1;
      }
    }
  }

  PassData() {
    this.ReSeqNo();
    this.DataEmit.emit(this.ManualDeviationData);
  }

}
