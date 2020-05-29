import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: ['./nap-paging.component.scss']
})
export class NapPagingComponent implements OnInit {
 
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        localStorage.setItem("BizTemplateCode",params['BizTemplateCode']);
      }
    });
  }  
  inputPagingObj : any;
  arrCrit : any;
  critObj : any;
  ngOnInit() { 
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    // this.inputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'a.LOB_CODE';
    critObj.value = AdInsConstant.FL4W;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;

  }

}
