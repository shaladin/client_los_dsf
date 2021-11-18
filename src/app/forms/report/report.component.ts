import { Component, OnInit } from '@angular/core';
import { InputSearchObj } from 'app/shared/model/input-search-obj.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  inputObj: InputSearchObj = new InputSearchObj();
  pageSize: number = 10;
  list = [];

  constructor() {
  }

  ngOnInit() {
    this.inputObj._url = "./assets/ucpaging/product/searchProductHO.json";
    this.inputObj.enviromentUrl = environment.losUrl + "/v2";
    this.inputObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;

    // select dropdown
    this.list = [
      {
        id: 1,
        display: "Xania"
      },
      {
        id: 2,
        display: "Edward"
      },
      {
        id: 3,
        display: "Hansen"
      },
      {
        id: 4,
        display: "Reynard"
      },
      {
        id: 5,
        display: "Hartono"
      },
      {
        id: 6,
        display: "Shafiq"
      }
    ];
  }

  getResult(ev) {
    console.log(ev);
  }

}
