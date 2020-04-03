import { Component, OnInit, Input } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { AppGuarantorObj } from 'app/shared/model/AppGuarantorObj.Model';
import { HttpClient } from '@angular/common/http';
import { GuarantorObj } from 'app/shared/model/GuarantorObj.Model';

@Component({
  selector: 'app-guarantor-paging',
  templateUrl: './guarantor-paging.component.html',
  styleUrls: []
})
export class GuarantorPagingComponent implements OnInit {

  @Input() AppId: any;
  inputGridObj: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.inputGridObj = new InputGridObj();
    this.inputGridObj.pagingJson = "./assets/ucpaging/searchGuarantor.json";
    this.inputGridObj.deleteUrl = AdInsConstant.DeleteAppGuarantor;

    var guarantorObj = new GuarantorObj();
    guarantorObj.AppGuarantorObj.AppId = this.AppId;
    this.http.post(AdInsConstant.GetListAppGuarantor, guarantorObj).subscribe(
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
