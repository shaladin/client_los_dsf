import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-mou-view-change-mou-history',
  templateUrl: './mou-view-change-mou-history.component.html'
})
export class MouViewChangeMouHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  listChangeMouTrx: Array<any>;
  trxType: any;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    var Obj = { MouCustId: this.MouCustId }
    this.http.post<any>(URLConstant.GetListChangeMouTrxByMouCustId, Obj).subscribe(
      (response) => {
        this.listChangeMouTrx = response["ReturnObject"];
      })
  }
  
  ChangeMouCustomerForm = this.fb.group({
  })  
}



  // openView(SurveyTaskNo) {
  //   this.http.post(URLConstant.GetLatestChangeMouCustVersionById, { SurveyTaskNo: SurveyTaskNo }).subscribe(
  //     response => {
  //       AdInsHelper.OpenSrvyTaskViewBySrvyTaskId(response["SrvyTaskId"]);
  //     });
  // }