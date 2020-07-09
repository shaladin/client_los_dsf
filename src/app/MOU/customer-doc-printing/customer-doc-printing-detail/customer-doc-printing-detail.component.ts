import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustObj } from 'app/shared/model/MouCustObj.Model';
import { environment } from 'environments/environment';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-customer-doc-printing-detail',
  templateUrl: './customer-doc-printing-detail.component.html',
})
export class CustomerDocPrintingDetailComponent implements OnInit {
  viewObj: string;
  MouCustId: number;
  GetListMouCustDocPrintForViewByMouCustIdUrl: string = AdInsConstant.GetListMouCustDocPrintForViewByMouCustId;
  responseObj: Array<any> = new Array<any>();
  EditMouCustDocPrintSequenceNoUrl: string =  AdInsConstant.EditMouCustDocPrintSequenceNo;
  link : any;
  mouCustObj : any;
  resultData : any;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['MouCustId'] != null) {
        this.MouCustId = params['MouCustId'];
      }
    });
  }

  ngOnInit(): void {
    this.viewObj = "./assets/ucviewgeneric/viewMouHeader.json";
    this.mouCustObj = new MouCustObj();
    this.mouCustObj.MouCustId = this.MouCustId;
    this.http.post(AdInsConstant.GetMouCustById, this.mouCustObj).subscribe(
      (response: MouCustObj) => {
        this.resultData = response; 
      } 
    ); 
    var mouObj = { "MouCustId": this.MouCustId };
    this.http.post(this.GetListMouCustDocPrintForViewByMouCustIdUrl, mouObj).subscribe(
      response => {
        this.responseObj = response['ReturnObject'];
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
  }

  searchRowVersion(MouCustDocPrintId){
    for(var i=0;i< this.responseObj.length;i++){
      if(this.responseObj[i]["MouCustDocPrintId"] == MouCustDocPrintId){
        return this.responseObj[i]["RowVersion"];
      }
    }
    return null;
  }

  print(MouCustDocPrintId){
    var mouObj = { "MouCustDocPrintId": MouCustDocPrintId, "RowVersion" : this.searchRowVersion(MouCustDocPrintId) };
    this.http.post(this.EditMouCustDocPrintSequenceNoUrl, mouObj).subscribe(
      response => {
        var message = response['Message'];
        var mouCustObj = { "MouCustId": this.MouCustId };
        this.http.post(this.GetListMouCustDocPrintForViewByMouCustIdUrl, mouCustObj).subscribe(
          response => {
            this.responseObj = response['ReturnObject'];
          },
          error => {
            this.router.navigateByUrl('Error');
          }
        );
      },
      error => {
        this.router.navigateByUrl('Error');
      }
    );
  }
  GetCallBack(event)
  {
    if(event.Key == "customer"){
      var custObj = { CustNo: this.resultData['CustNo'] };
      this.http.post(AdInsConstant.GetCustByCustNo, custObj).subscribe(
        response => {
          AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
  }
}
 