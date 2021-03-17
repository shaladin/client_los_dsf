import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ThirdPartyRsltHObj } from 'app/shared/model/ThirdPartyRsltHObj.Model';


@Component({
  selector: 'app-fraud-detection-data',
  templateUrl: './fraud-detection-data.component.html',
  styleUrls: ['./fraud-detection-data.component.scss']
})
export class FraudDetectionDataComponent implements OnInit {

  GetFraudResult: string;
  thirdPartyRsltHObj: ThirdPartyRsltHObj;
  ResultThirdPartyObj: Object;
  @Input() AppId: number;


  constructor(private http: HttpClient) { }


  ngOnInit() {
    this.GetFraudResult = URLConstant.GetFraudResult;
    this.thirdPartyRsltHObj = new ThirdPartyRsltHObj();

    this.http.post(URLConstant.GetAppById, { "Id": this.AppId }).subscribe(
      (response) => {
        this.thirdPartyRsltHObj.TrxNo = response['AppNo'];
        this.http.post(this.GetFraudResult, this.thirdPartyRsltHObj).subscribe(
          (response) => {
            this.ResultThirdPartyObj = response;
          });
      });
  }

}
