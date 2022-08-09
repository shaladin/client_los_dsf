import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { CommonConstant } from 'app/shared/constant/CommonConstant';

@Component({
  selector: 'app-crd-rvw-financial-data',
  templateUrl: './crd-rvw-financial-data.component.html'
})
export class CrdRvwFinancialDataComponent implements OnInit {

  @Input() appId;
  @Input() custType;
  
  TitleCustFinDataSuffix:string = '';
  IsShowCustFinDataDetail:boolean = false;
  ListCustFinData : Array<any> = new Array<any>();
  CustFinData : any;
  currentCustFinDataIndex: number;
  
  readonly CustTypePersonal = CommonConstant.CustTypePersonal;
  readonly CustTypeCompany = CommonConstant.CustTypeCompany;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    await this.getCustData();
  }

  async getCustData() {
    if(this.custType == CommonConstant.CustTypePersonal)
    {
      await this.http.post(URLConstantX.GetCustDataPersonalXForViewByAppId,  {AppId: this.appId, IsForNapCompletionVersion: true }).toPromise().then(
        (response) => {
          this.ListCustFinData = response["ListAppCustPersonalFinDataXObjs"];
        }
      )
    }
    else
    {
      await this.http.post(URLConstantX.GetCustDataCompanyForViewXByAppId, {AppId: this.appId, IsForNapCompletionVersion: true }).toPromise().then(
        (response) => {
          this.ListCustFinData = response["ListAppCustCompanyFinDataX"];
        }
      )
    }
  }

  showDetailCustFinData(index:number){
    let datePipe = new DatePipe("en-US");
    this.currentCustFinDataIndex = index;
    this.CustFinData = this.ListCustFinData[this.currentCustFinDataIndex];
    this.TitleCustFinDataSuffix = 'Date as of '+datePipe.transform(this.CustFinData['DateAsOf'], 'dd-MMM-yyyy')
    this.IsShowCustFinDataDetail = true;
  }
  
  hideDetailCustFinData()
  {
    this.TitleCustFinDataSuffix = '';
    this.IsShowCustFinDataDetail = false;
    this.CustFinData = null;
  }
}
