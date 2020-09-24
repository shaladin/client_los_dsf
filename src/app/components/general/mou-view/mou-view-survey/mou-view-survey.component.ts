import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-mou-view-survey',
  templateUrl: './mou-view-survey.component.html',
})
export class MouViewSurveyComponent implements OnInit {
  @Input() MouCustId: number;
  listSrvyOrder: Array<any>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    var mouObj = { MouCustId: this.MouCustId }
    this.http.post<any>(URLConstant.GetSrvyResultDataByTrxRefNo, mouObj).subscribe(
      (response) => {
        this.listSrvyOrder = response[CommonConstant.ReturnObj];
      })
  }
}
