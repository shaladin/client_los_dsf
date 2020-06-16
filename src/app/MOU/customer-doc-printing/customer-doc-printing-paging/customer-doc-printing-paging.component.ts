import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-doc-printing-paging',
  templateUrl: './customer-doc-printing-paging.component.html',
})
export class CustomerDocPrintingPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  user:any;

  constructor(private router: Router) { }
  // 1. menangkap param MouModel dari halaman paging
//   2. Get data Mou menggunakan param MouModel dari API GetMou(MouModel mouModel)
// 3. Get data dari rule menggunakan API GetRuleDocPrintList(ResRuleMouDocPrintingModel resRuleMouDocPrintingModel, String custType, String maritalStat)
// 4. Pada saat klik print hit API engine report dan hit API UpdateMouDocPrint(MouModel mouModel, Datetime PrintDt)
// 5. Tombol back redirect ke halaman paging
// 7. Pada saat klik button save memanggil API SaveMouDocPrint(MouDocPrintModel mouDocPrintModel)

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("UserAccess"));

    if (this.user.MrOfficeTypeCode != "HO") {
      this.router.navigate(["/Mou/UnauthorizedPage"]);
      return;
    }
    else
    {
      this.inputPagingObj = new UcPagingObj();
      this.inputPagingObj._url = "./assets/ucpaging/searchCustomerDocPrinting.json";
      this.inputPagingObj.enviromentUrl = environment.losUrl;
      this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
      this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCustomerDocPrinting.json";
  
      this.inputPagingObj.ddlEnvironments = [
        {
          name: "MC.MR_MOU_TYPE_CODE",
          environment: environment.FoundationR3Url
        }
      ];
    }
  }
}
