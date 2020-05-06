import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';

@Component({
  selector: 'agrmnt-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: []
})
export class AgrmntLifeInsuranceComponent implements OnInit {

  @Input() agrmntId: any;


  agrmntObj = {
    AgrmntId: 0,
  };

  AgrmntLifeInsObj: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.agrmntObj.AgrmntId = this.agrmntId;
    this.GetAgrmntLifeInsData();

  }
  GetAgrmntLifeInsData() {
    this.http.post(AdInsConstant.GetAgrmntLifeInsDataByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        console.log(response);
        this.AgrmntLifeInsObj = response;
      }
    );
  }


}
