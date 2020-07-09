import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-document-paging',
  templateUrl: './document-paging.component.html',
  styleUrls: ['./document-paging.component.scss']
})
export class DocumentPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;


  constructor(private router: Router) { }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDocument.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocument.json";
  }

  GetCallback(ev: any){
    if(ev.Key == "ViewProdOffering"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion( ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);   
    }
  }

}
