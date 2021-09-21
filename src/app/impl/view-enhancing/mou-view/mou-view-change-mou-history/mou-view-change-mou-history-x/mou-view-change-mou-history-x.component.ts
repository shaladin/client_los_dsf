import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { GenericListObj } from 'app/shared/model/Generic/GenericListObj.Model';

@Component({
  selector: 'app-mou-view-change-mou-history-x',
  templateUrl: './mou-view-change-mou-history-x.component.html',
  styleUrls: ['./mou-view-change-mou-history-x.component.css']
})
export class MouViewChangeMouHistoryXComponent implements OnInit {
    @Input() MouCustId: number;
    listChangeMouTrx: Array<any>;
  
    constructor(private fb: FormBuilder, private http: HttpClient) { }
  
    ngOnInit() {
      this.http.post<GenericListObj>(URLConstantX.GetListChangeMouTrxByMouCustId, { Id: this.MouCustId }).subscribe(
        (response) => {
          this.listChangeMouTrx = response.ReturnObject;
        })
    }
  }
