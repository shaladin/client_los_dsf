import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/CreditReview/CrdRvwDiffAppToInPrcAppCustObj.Model';
import { ResponseCrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/CreditReview/ResponseCrdRvwDiffAppToInPrcAppCustObj.Model';

@Component({
  selector: 'app-crd-rvw-diff-with-in-process-app',
  templateUrl: './crd-rvw-diff-with-in-process-app.component.html',
  styleUrls: ['./crd-rvw-diff-with-in-process-app.component.scss']
})
export class CrdRvwDiffWithInProcessAppComponent implements OnInit {

  @Input() ListCrdRvwDiffAppToInPrcAppCustObj: Array<CrdRvwDiffAppToInPrcAppCustObj> = new Array<CrdRvwDiffAppToInPrcAppCustObj>();
  @Input() responseCrdRvwDiffAppToInPrcAppCustObj: ResponseCrdRvwDiffAppToInPrcAppCustObj = new ResponseCrdRvwDiffAppToInPrcAppCustObj();
  constructor(
    private http: HttpClient) { }

  ListDiffTypeCustData: Array<string> = new Array<string>();
  ListAppNo: Array<string> = new Array<string>();
  DictDiffType: { [Type: string]: boolean } = {};
  DictDiffAppNo: { [AppNo: string]: boolean } = {};
  DictDiffAppNoIndicator: { [AppNo: string]: boolean } = {};
  DictDiffValue: { [AppNo_DiffType: string]: CrdRvwDiffAppToInPrcAppCustObj } = {};
  ngOnInit() {
    // this.SetDictDiffValue();
    this.SetupData();
    console.log(this.DictDiffValue);
  }

  SetDictDiffValue() {
    for (let index = 0; index < this.ListCrdRvwDiffAppToInPrcAppCustObj.length; index++) {
      const element = this.ListCrdRvwDiffAppToInPrcAppCustObj[index];
      if (this.DictDiffType[element.FieldName] == undefined) {
        this.DictDiffType[element.FieldName] = true;
        this.ListDiffTypeCustData.push(element.FieldName);
      }
      if (this.DictDiffAppNo[element.AppNo] == undefined) {
        this.DictDiffAppNo[element.AppNo] = true;
        this.DictDiffAppNoIndicator[element.AppNo] = element.IsRvwApp;
        this.ListAppNo.push(element.AppNo);
      }
      this.DictDiffValue[element.AppNo + element.FieldName] = element;
    }
  }

  SetupData(){
    this.ListDiffTypeCustData=this.responseCrdRvwDiffAppToInPrcAppCustObj.ListDiffTypeCustData;
    this.ListAppNo=this.responseCrdRvwDiffAppToInPrcAppCustObj.ListAppNo;
    this.DictDiffAppNoIndicator=this.responseCrdRvwDiffAppToInPrcAppCustObj.DictDiffAppNoIndicator;
    this.DictDiffValue = this.responseCrdRvwDiffAppToInPrcAppCustObj.DictDiffValue;
  }

  async ClickLinkApp(AppNo: string){
    await this.http.post<any>(URLConstant.GetAppByAppNo, {AppNo: AppNo}).toPromise().then(
      (response) => {
        AdInsHelper.OpenAppViewByAppId(response.AppId);
      }
    )
  }
}

