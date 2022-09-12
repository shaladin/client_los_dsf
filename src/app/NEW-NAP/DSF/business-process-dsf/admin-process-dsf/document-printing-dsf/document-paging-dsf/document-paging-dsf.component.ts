import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/uc-paging-obj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CriteriaObj } from 'app/shared/model/criteria-obj.model';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { HttpClient } from '@angular/common/http';
import { URLConstantDsf } from 'app/shared/constant/URLConstantDsf';
import { AgrmntDocDsfObj } from 'app/shared/model/agrmnt-doc-dsf-obj.model';

@Component({
  selector: 'app-document-paging-dsf',
  templateUrl: './document-paging-dsf.component.html',
  styleUrls: ['./document-paging-dsf.component.css']
})
export class DocumentPagingDsfComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  BizTemplateCode: string;
  LobCode: string;
  agrmntDoc: AgrmntDocDsfObj;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient,) {
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
    });
  }

  ngOnInit() {
    this.inputPagingObj._url = "./assets/dsf/ucpaging/searchDocumentDsf.json";
    this.inputPagingObj.pagingJson = "./assets/dsf/ucpaging/searchDocumentDsf.json";

    this.inputPagingObj.addCritInput = new Array();
    var critLobObj = new CriteriaObj();
    critLobObj.restriction = AdInsConstant.RestrictionEq;
    critLobObj.propName = 'A.BIZ_TEMPLATE_CODE';
    critLobObj.value = this.BizTemplateCode;
    this.inputPagingObj.addCritInput.push(critLobObj);
  }

  GetCallback(ev) {
    if (ev.Key == "ViewProdOffering") {
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }

    if (ev.Key = "ViewAgrmntDocDsf") {
      this.agrmntDoc = new AgrmntDocDsfObj();
      this.agrmntDoc.AgrmntId = ev.RowObj.AgrmntId;
      this.agrmntDoc.WOF = ev.RowObj.WOF;

      if (ev.RowObj.WOF == "LB" || ev.RowObj.WOF == "IF"  || ev.RowObj.WOF == "SP")
      {
      this.http.post(URLConstantDsf.AddListDocumentPrintingLBByAgrmntIdDsf, this.agrmntDoc).subscribe(
        (response) => {
          this.router.navigate([NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_VIEW_DSF], { queryParams: { "AgrmntId": ev.RowObj.AgrmntId, "BizTemplateCode": ev.RowObj.BizTemplateCode, "WOF": ev.RowObj.WOF } });
        });
      }

      else
      {
        this.router.navigate([NavigationConstant.NAP_ADM_PRCS_NAP_DOC_PRINT_VIEW_DSF], { queryParams: { "AgrmntId": ev.RowObj.AgrmntId, "BizTemplateCode": ev.RowObj.BizTemplateCode } });
      }
    }
  }

}
