import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
  styleUrls: ['./customer-doc-printing-paging.component.css']
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: any;

  constructor() { }
  // 1. menangkap param MouModel dari halaman paging
//   2. Get data Mou menggunakan param MouModel dari API GetMou(MouModel mouModel)
// 3. Get data dari rule menggunakan API GetRuleDocPrintList(ResRuleMouDocPrintingModel resRuleMouDocPrintingModel, String custType, String maritalStat)
// 4. Pada saat klik print hit API engine report dan hit API UpdateMouDocPrint(MouModel mouModel, Datetime PrintDt)
// 5. Tombol back redirect ke halaman paging
// 7. Pada saat klik button save memanggil API SaveMouDocPrint(MouDocPrintModel mouDocPrintModel)

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
    // this.inputPagingObj.enviromentUrl = "http://localhost:5000";
    this.inputPagingObj.enviromentUrl = environment.FoundationR3Url;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";
  }

}
