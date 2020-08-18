import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

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
    this.http.post(URLConstant.GetAgrmntLifeInsDataByAgrmntId, this.agrmntObj).subscribe(
      (response) => {
        this.AgrmntLifeInsObj = response;
      }
    );
  }


}
