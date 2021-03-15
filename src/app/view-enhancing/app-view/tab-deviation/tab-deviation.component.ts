import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DeviationResultObj } from 'app/shared/model/DeviationResultObj.Model';

@Component({
  selector: 'app-tab-deviation',
  templateUrl: './tab-deviation.component.html',
  styleUrls: []
})
export class TabDeviationComponent implements OnInit {
  @Input() AppId: number;
  @Input() Type: string;

  AutoDeviationData: Array<any> = new Array<any>();
  ManualDeviationData: Array<any> = new Array<any>();
  
  constructor(private http: HttpClient) { }

  async ngOnInit() {
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
        for(var i = 0; i < temp.length; i++) {
          if(temp[i].MrDeviationType == CommonConstant.DeviationTypeAutomaticDev) {
            var tempObj = {
              SeqNo: temp[i].SeqNo,
              DeviationType: temp[i].MrDeviationTypeDesc,
              OriValue: temp[i].OriginalValue,
              CurrValue: temp[i].CurrentValue,
              AppvAt: temp[i].ApvAt,
              Notes: temp[i].Notes
            };
            this.AutoDeviationData.push(tempObj);
          }
          else if(temp[i].MrDeviationType == CommonConstant.DeviationTypeManualDev) {
            this.BindManualDeviationData(temp[i]);
          }
        }
        
        if(this.AutoDeviationData.length > 0) {
          this.AutoDeviationData.sort((a,b) => a.SeqNo - b.SeqNo);
        }
        if(this.ManualDeviationData.length > 0) {
          this.ManualDeviationData.sort((a,b) => a.SeqNo - b.SeqNo);
        }
        this.PassData();
      }
    );
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
  }

  PassData() {
    this.ReSeqNo();
  }

  ReSeqNo() {
    for(var i = 0; i < this.ManualDeviationData.length; i++) {
      if((i + 1) != this.ManualDeviationData[i].SeqNo) {
        this.ManualDeviationData[i].DeviationResultId = 0;
        this.ManualDeviationData[i].SeqNo = i + 1;
      }
    }
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
}