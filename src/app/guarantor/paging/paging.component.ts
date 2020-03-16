import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss']
})
export class PagingComponent implements OnInit {

  inputGridObj: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantor.json";

    var appGuarantorObj = new AppGuarantorObj();
    appGuarantorObj.AppId = "11";
    this.http.post(AdInsConstant.GetListAppGuarantor, appGuarantorObj).subscribe(
      (response) => {
        console.log("response: ");
        console.log(response);
        console.log(this.inputGridObj);
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response["ReturnObject"]

      },
      (error) => {
        console.log(error);
      }
    );
  }

}
