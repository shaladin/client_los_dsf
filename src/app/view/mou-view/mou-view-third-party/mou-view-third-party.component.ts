import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ThirdPartyRsltHObj } from 'app/shared/model/ThirdPartyRsltHObj.Model';

@Component({
  selector: 'app-mou-view-third-party',
  templateUrl: './mou-view-third-party.component.html',
  styleUrls: ['./mou-view-third-party.component.scss']
})
export class MouViewThirdPartyComponent implements OnInit {
  GetFraudResult: string;
  thirdPartyRsltHObj : ThirdPartyRsltHObj;
  ResultThirdPartyObj: Object;
  @Input() MouCustId: number;
  GetMouByMouId: string;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.GetMouByMouId = URLConstant.GetMouCustById;
    this.GetFraudResult = URLConstant.GetFraudResult;
    this.thirdPartyRsltHObj = new ThirdPartyRsltHObj();

    this.http.post(this.GetMouByMouId,  {"Id": this.MouCustId}).subscribe(
      (response) => {
    this.thirdPartyRsltHObj.TrxNo = response['MouCustNo'];
    this.http.post(this.GetFraudResult, this.thirdPartyRsltHObj).subscribe(
      (response) => {
        this.ResultThirdPartyObj = response;
      });
  });
  }
}
