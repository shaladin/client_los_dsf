import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
  selector: 'app-mou-view-change-mou-history',
  templateUrl: './mou-view-change-mou-history.component.html'
})
export class MouViewChangeMouHistoryComponent implements OnInit {
  @Input() MouCustId: number;
  listChangeMouTrx: Array<any>;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.http.post<GenericListObj>(URLConstant.GetListChangeMouTrxByMouCustId, { Id: this.MouCustId }).subscribe(
      (response) => {
        this.listChangeMouTrx = response.ReturnObject;
      })
  }
}