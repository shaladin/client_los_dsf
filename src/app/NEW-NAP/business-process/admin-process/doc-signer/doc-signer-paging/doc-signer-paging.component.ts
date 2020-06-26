import { Component, OnInit } from '@angular/core';
import { UcPagingObj, WhereValueObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';

@Component({
  selector: 'app-doc-signer-paging',
  templateUrl: './doc-signer-paging.component.html',
  styleUrls: ['./doc-signer-paging.component.scss']
})
export class DocSignerPagingComponent implements OnInit {
  inputPagingObj: UcPagingObj;
  link: string;
  BizTemplateCode: string;
  
  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
      }
  });
  }

  ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchDocSigner.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchDocSigner.json";
    var whereValueObj = new WhereValueObj();
    whereValueObj.property = "BizTemplateCode";
    whereValueObj.value = this.BizTemplateCode;
    this.inputPagingObj.whereValue.push(whereValueObj);

    // this.inputPagingObj.whereValue.push({property: "BizTemplateCode", value: ""});
    // this.inputPagingObj.whereValue.find(x => x.property == "BizTemplateCode").value = this.BizTemplateCode;
  }

  getEvent(ev){
    if(ev.Key == "prodOff"){
      this.http.post(AdInsConstant.GetProdOfferingHByCode, {ProdOfferingCode : ev.RowObj.ProdOfferingCode}).subscribe(
        response => {
          window.open(environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=" + response['ProdOfferingHId'], '_blank');
        },
        (error) => {
          console.log(error);
        }
      );
    }else if(ev.Key == "agrmnt"){
      var bizTemplateCode = ev.RowObj.BizTemplateCode;

      if(bizTemplateCode == "CF4W" || bizTemplateCode == "CFRFN4W" || bizTemplateCode == "FACTORING"){
        window.open( environment.losR3Web + "/Nap/View/AgrmntView?AgrmntId=" + ev.RowObj.AgrmntId, "_blank");
      }
      else if(bizTemplateCode == "FL4W"){
        window.open( environment.losR3Web + "/Nap/FinanceLeasing/ViewAgrmnt?AgrmntId=" + ev.RowObj.AgrmntId, "_blank");
      }
    }
  }
}
