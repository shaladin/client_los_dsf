import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-view-agrmnt-tc',
  templateUrl: './view-agrmnt-tc.component.html',
  styleUrls: []
})
export class ViewAgrmntTcComponent implements OnInit {
  @Input() AgrmntId: number;
  @Input() BizTemplateCode: string;
  inputGridObj: InputGridObj;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAgrmntTc.json";

    var reqObj = {
      Id: this.AgrmntId
    }

    this.http.post(URLConstant.GetListAgrmntTcbyAgrmntId, reqObj).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ReturnObject"]
      }
    );
  }
}
