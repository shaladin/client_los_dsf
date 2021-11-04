import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AgrmntLifeInsObj } from 'app/shared/model/agrmnts/agrmnt-life-ins.model';

@Component({
  selector: 'agrmnt-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: []
})
export class AgrmntLifeInsuranceComponent implements OnInit {
  @Input() agrmntId: number;
  agrmntObj = {
    Id: 0,
  };
  AgrmntLifeInsObj: AgrmntLifeInsObj = new AgrmntLifeInsObj();

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.agrmntObj.Id = this.agrmntId;
    await this.GetAgrmntLifeInsData();
  }

  async GetAgrmntLifeInsData() {
    await this.http.post<AgrmntLifeInsObj>(URLConstant.GetAgrmntLifeInsDataByAgrmntId, this.agrmntObj).toPromise().then(
      (response) => {
        this.AgrmntLifeInsObj = response;
      }
    );
  }
}