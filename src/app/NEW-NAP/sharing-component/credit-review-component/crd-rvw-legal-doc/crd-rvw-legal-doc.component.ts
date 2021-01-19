import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';

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
    await this.GetListActiveRefMaster(CommonConstant.RefMasterTypeCodeLegalDocType);
    await this.LoadListLegalDocData();
    console.log(this.DictRefMaster);
  }

  ListLegalDoc: Array<AppCustCompanyLegalDocObj> = new Array<AppCustCompanyLegalDocObj>();
  async LoadListLegalDocData() {
    await this.http.post<{ ListCompanyLegalDoc: Array<AppCustCompanyLegalDocObj> }>(URLConstant.GetAppCustCompanyLegalDocsByAppCustCompanyId, { AppCustCompanyId: this.AppCustCompanyId }).toPromise().then(
      (response) => {
        console.log(response);
        this.ListLegalDoc = response.ListCompanyLegalDoc;
      }
    );
  }

  DictRefMaster: { [Id: string]: string } = {};
  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    await this.http.post<{RefMasterObjs: Array<RefMasterObj>}>(URLConstant.GetListActiveRefMasterByRefMasterTypeCode, { "RefMasterTypeCode": RefMasterTypeCode }).toPromise().then(
      (response) => {
        console.log(response);
        for (let index = 0; index < response.RefMasterObjs.length; index++) {
          const element = response.RefMasterObjs[index];
          
          this.DictRefMaster[element.MasterCode] = element.Descr;
        }
      }
    );
  }
}
