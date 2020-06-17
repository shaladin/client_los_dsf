import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-view-commission-agrmnt',
  templateUrl: './view-commission.component.html'
})
export class ViewCommissionComponent implements OnInit {

  @Input() agrmntId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ListSupplData;
  ListSupplEmpData;
  ListReferantorData;
  SupplData: any = {};
  SupplEmpData: any = {};
  ReferantorData: any = {};
  SummaryData;
  initData(){
    this.ListSupplData = new Array();
    this.ListSupplEmpData = new Array();
    this.ListReferantorData = new Array();
    this.SummaryData={
      totalCommAmt: 0,
      totalTaxAmt: 0,
      totalVatAmt: 0,
    };
  }

  async ngOnInit() {
    this.initData();
    await this.GetCommissionData();
  }

  async GetCommissionData(){
    var obj: object = {AgrmntId: this.agrmntId};

    var url: string = AdInsConstant.GetListAgrmntCommissionWithDetailByAgrmntId;

    await this.http.post(url, obj).toPromise().then(
      (response) => {
        console.log(response);
        var tempResponse = response[AdInsConstant.ReturnObj];
        // console.log(tempResponse);
        for(var i=0;i<tempResponse.length;i++){
          var tempObj = tempResponse[i];
          // console.log(tempObj);
          tempObj.AgrmntCommDObjs.sort((a, b) => a.SeqNo - b.SeqNo);
          if(tempObj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplier)
            this.ListSupplData.push(tempObj);
          if(tempObj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeSupplierEmp)
            this.ListSupplEmpData.push(tempObj);
          if(tempObj.MrCommissionRecipientTypeCode == AdInsConstant.CommissionReceipientTypeCodeReferantor)
            this.ListReferantorData.push(tempObj);

          this.SummaryData.totalCommAmt+=tempObj.TotalCommissionAmt;
          this.SummaryData.totalTaxAmt+=tempObj.TaxAmt;
          this.SummaryData.totalVatAmt+=tempObj.VatAmt;
        }

        this.SupplData["title"]=AdInsConstant.TitleSupplier;
        this.SupplData["content"]=AdInsConstant.ContentSupplier;
        this.SupplData["listData"]=this.ListSupplData;
        this.SupplEmpData["title"]=AdInsConstant.TitleSupplierEmp;
        this.SupplEmpData["content"]=AdInsConstant.ContentSupplierEmp;
        this.SupplEmpData["listData"]=this.ListSupplEmpData;
        this.ReferantorData["title"]=AdInsConstant.TitleReferantor;
        this.ReferantorData["content"]=AdInsConstant.ContentReferantor;
        this.ReferantorData["listData"]=this.ListReferantorData;
        // console.log(this.SummaryData);
        // console.log(this.SupplData);
        // console.log(this.SupplEmpData);
        // console.log(this.ReferantorData);
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
