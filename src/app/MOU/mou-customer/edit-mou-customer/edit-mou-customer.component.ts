import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-edit-mou-customer',
  templateUrl: './edit-mou-customer.component.html',
  styleUrls: ['./edit-mou-customer.component.scss'],
  providers: [NGXToastrService]
})
export class EditMouCustomerComponent implements OnInit {
  @ViewChild(UcpagingComponent) ucpaging;
  inputPagingObj: any;
  
  constructor(private http: HttpClient, private toastr: NGXToastrService) { }
  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchMouCustomerRequest.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputPagingObj.deleteUrl = "";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchMouCustomerRequest.json";
  }
}