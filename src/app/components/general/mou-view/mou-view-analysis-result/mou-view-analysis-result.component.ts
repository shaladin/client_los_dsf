import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.Model';
import { UcViewGenericObj } from 'app/shared/model/UcViewGenericObj.model';
import { ApvViewInfo } from 'app/shared/model/ApvViewInfo.Model';

@Component({
  selector: 'app-mou-view-analysis-result',
  templateUrl: './mou-view-analysis-result.component.html'
})
export class MouViewAnalysisResultComponent implements OnInit {
  viewGenericObj: UcViewGenericObj = new UcViewGenericObj();
  @Input() inputObj: ApvViewInfo;
  ;
  RFAInformation: Array<KeyValueObj>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.viewGenericObj.viewInput = "./assets/ucviewgeneric/viewNapDetailMainData.json";

    var GetApvInfoReq = {
      TaskId: this.inputObj.taskId,
      instanceId: this.inputObj.instanceId,
      isNeedRFAInfo: false,
      isNeedPossibleResults: false,
      isNeedRecommendations: true,
      isNeedSummaryView: false
    }

    this.http.post(URLConstant.GetApprovalScreenViewInfo, GetApvInfoReq).subscribe(
      (response) => {
        this.RFAInformation = response["RecomendationObj"]
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
