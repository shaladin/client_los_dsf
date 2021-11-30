import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/app-cust-company-legal-doc-obj.model';
import { RefMasterObj } from 'app/shared/model/ref-master-obj.model';

@Component({
  selector: 'app-crd-rvw-legal-doc',
  templateUrl: './crd-rvw-legal-doc.component.html',
  styleUrls: ['./crd-rvw-legal-doc.component.scss']
})
export class CrdRvwLegalDocComponent implements OnInit {

  @Input() AppCustCompanyId: number = 0;
  constructor(
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    await this.LoadListLegalDocData();
  }

  ListLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();
  async LoadListLegalDocData() {
    await this.http.post<{ ListCompanyLegalDoc: Array<AppCustCompanyLegalDocObj> }>(URLConstant.GetAppCustCompanyLegalDocsByAppCustCompanyId, { Id: this.AppCustCompanyId }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListLegalDoc = response.ListCompanyLegalDoc;
      }
    );
  }
}
