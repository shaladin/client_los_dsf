import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AgrmntLifeInsObj } from 'app/shared/model/Agrmnt/AgrmntLifeIns.Model';

@Component({
  selector: 'agrmnt-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: []
})
export class AgrmntLifeInsuranceComponent implements OnInit {
  @Input() agrmntId: number;
  AgrmntLifeInsObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetAgrmntLifeInsData();
  }

  GetAgrmntLifeInsData() {
    this.http.post(URLConstant.GetAgrmntLifeInsDataByAgrmntId, { Id: this.agrmntId }).subscribe(
      (response: AgrmntLifeInsObj) => {
        this.AgrmntLifeInsObj = response;
      }
    );
  }
}