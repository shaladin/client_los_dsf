import { Component, OnInit, ViewChild } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcpagingComponent } from '@adins/ucpaging';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-copy-cancelled-application',
  templateUrl: './copy-cancelled-application.component.html'
})
export class CopyCancelledApplicationComponent implements OnInit {
  @ViewChild(UcpagingComponent) paging: UcpagingComponent;
  inputPagingObj: UcPagingObj = new UcPagingObj();
  link: string;
  BizTemplateCode: string;
  IsNapVersionMainData: boolean = false;

  constructor(private http: HttpClient, private toastr: NGXToastrService, private router: Router,
    private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (params["BizTemplateCode"] != null) {
        this.BizTemplateCode = params["BizTemplateCode"];
        localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
      }
      if (params["IsNapVersionMainData"] != null) {
        this.IsNapVersionMainData = params["IsNapVersionMainData"];
      }
    });
  }

  ngOnInit() {
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.BIZ_TEMPLATE_CODE';
    critObj.value = this.BizTemplateCode;
    
    this.inputPagingObj._url = "./assets/ucpaging/searchCancelledApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchCancelledApp.json";

    this.inputPagingObj.addCritInput.push(critObj);
  }

  getEvent(ev) {
    if(ev.Key == "prodOff"){
      AdInsHelper.OpenProdOfferingViewByCodeAndVersion(ev.RowObj.ProdOfferingCode, ev.RowObj.ProdOfferingVersion);
    }else if(ev.Key == "copy"){
      if (confirm("Are you sure to copy this application?")) {
        var url = this.IsNapVersionMainData ? URLConstant.CopyCancelledAppForMainData : URLConstant.CopyCancelledApp;
        this.http.post(url, { AppId: ev.RowObj.AppId }).subscribe(
          response => {
            this.toastr.successMessage(response["message"]);
            this.paging.searchPagination(1);
          });
      }
    }
  }
}
