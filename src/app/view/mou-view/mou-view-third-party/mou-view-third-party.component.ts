import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
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
    this.thirdPartyRsltHObj = new ThirdPartyRsltHObj();

    this.http.post(URLConstant.GetMouCustById,  {"Id": this.MouCustId}).subscribe(
      (response: MouCustObj) => {
    this.thirdPartyRsltHObj.TrxNo = response.MouCustNo;
    this.http.post(URLConstant.GetFraudResult, this.thirdPartyRsltHObj).subscribe(
      (response) => {
        this.ResultThirdPartyObj = response;
      });
  });
  }
}
