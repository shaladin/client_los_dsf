import { Component, OnInit, Input } from '@angular/core';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { HttpClient } from '@angular/common/http';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-invoice-data-fctr',
  templateUrl: './invoice-data-fctr.component.html'
})
export class InvoiceDataFctrComponent implements OnInit {
  
  @Input() AppId: number;
  gridObj: InputGridObj;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.gridObj = new InputGridObj();
    this.gridObj.pagingJson = "./assets/ucgridview/gridInvoiceDataFCTR.json";

    var AppObj = {
      AppId: this.AppId
    }
    this.http.post(URLConstant.AddAppCrdInvstg, AppObj).subscribe(
      (response) => {
        var DetailDataForGrid ={
          Data: response["AppInvoiceFctrObjs"],
          Count: "0"
        }
        
        this.gridObj.resultData = DetailDataForGrid;
      });
  }

}
