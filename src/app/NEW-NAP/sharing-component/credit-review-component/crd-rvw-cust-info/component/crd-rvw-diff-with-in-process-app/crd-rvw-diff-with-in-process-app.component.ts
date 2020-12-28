import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppObj } from 'app/shared/model/App/App.Model';
import { CrdRvwDiffAppToInPrcAppCustObj } from 'app/shared/model/CreditReview/CrdRvwDiffAppToInPrcAppCustObj.Model';

@Component({
  selector: 'app-crd-rvw-diff-with-in-process-app',
  templateUrl: './crd-rvw-diff-with-in-process-app.component.html',
  styleUrls: ['./crd-rvw-diff-with-in-process-app.component.scss']
})
export class CrdRvwDiffWithInProcessAppComponent implements OnInit {

  @Input() ListCrdRvwDiffAppToInPrcAppCustObj: Array<CrdRvwDiffAppToInPrcAppCustObj> = new Array<CrdRvwDiffAppToInPrcAppCustObj>();
  constructor(
    private http: HttpClient) { }

  ListDiffTypeCustData: Array<string> = new Array<string>();
  ListAppNo: Array<string> = new Array<string>();
  DictDiffType: { [Type: string]: boolean } = {};
  DictDiffAppNo: { [AppNo: string]: boolean } = {};
  DictDiffAppNoIndicator: { [AppNo: string]: boolean } = {};
  DictDiffValue: { [AppNo_DiffType: string]: CrdRvwDiffAppToInPrcAppCustObj } = {};
  ngOnInit() {
    // this.makeTestObj();
    // this.makeTestObj2();
    // this.makeTestObj3();
    // console.log(this.ListCrdRvwDiffAppToInPrcAppCustObj);
    this.SetDictDiffValue();
    // console.log(this.DictDiffValue);
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

  async ClickLinkApp(AppNo: string){
    // console.log(AppNo);
    await this.http.post<any>(URLConstant.GetAppByAppNo, {AppNo: AppNo}).toPromise().then(
      (response) => {
        // console.log(response);
        AdInsHelper.OpenAppViewByAppId(response.AppId);
      }
    )
  }

  makeTestObj() {
    let temp1: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp1.AppNo = "0002APP20201200164";
    temp1.AppValue = "123";
    temp1.FieldName = "CustName";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp1);
    let temp2: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp2.AppNo = "0002APP20201200164";
    temp2.AppValue = "1234";
    temp2.FieldName = "LegalAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp2);
    let temp3: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp3.AppNo = "0002APP20201200164";
    temp3.AppValue = "12345";
    temp3.FieldName = "ResidenceAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp3);
  }

  makeTestObj2() {
    let temp1: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp1.AppNo = "App2";
    temp1.AppValue = "1234";
    temp1.FieldName = "CustName";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp1);
    let temp2: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp2.AppNo = "App2";
    temp2.AppValue = "12345";
    temp2.FieldName = "LegalAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp2);
    let temp3: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp3.AppNo = "App2";
    temp3.AppValue = "123456";
    temp3.FieldName = "ResidenceAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp3);
  }

  makeTestObj3() {
    let temp1: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp1.AppNo = "App3";
    temp1.AppValue = "12345";
    temp1.FieldName = "CustName";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp1);
    let temp2: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp2.AppNo = "App3";
    temp2.AppValue = "123456";
    temp2.FieldName = "LegalAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp2);
    let temp3: CrdRvwDiffAppToInPrcAppCustObj = new CrdRvwDiffAppToInPrcAppCustObj();
    temp3.AppNo = "App3";
    temp3.AppValue = "1234567";
    temp3.FieldName = "ResidenceAddr";
    this.ListCrdRvwDiffAppToInPrcAppCustObj.push(temp3);
  }
}

