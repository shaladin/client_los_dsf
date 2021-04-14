import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-doc-signer-cfna',
  templateUrl: './doc-signer-cfna.component.html',
  styles: []
})
export class DocSignerCfnaComponent implements OnInit {
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
  });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/ucpaging/searchNewDocSigner.json";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchNewDocSigner.json";
    let whereValueObj = new WhereValueObj();
    whereValueObj.property = "BizTemplateCode";
    whereValueObj.value = this.BizTemplateCode;
    this.inputPagingObj.whereValue.push(whereValueObj);
  }

  getEvent(ev){
    if(ev.Key == "prodOff"){
      this.http.post(URLConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          AdInsHelper.OpenProdOfferingViewByProdOfferingHId(response['ProdOfferingHId']);
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(ev.Key == "agrmnt"){
      AdInsHelper.OpenAgrmntViewByAgrmntId(ev.RowObj.AgrmntId);
    }
  }

}
