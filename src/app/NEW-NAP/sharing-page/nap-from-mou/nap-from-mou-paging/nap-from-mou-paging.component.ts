import { Component, OnInit } from '@angular/core';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';

@Component({
  selector: 'app-nap-from-mou-paging',
  templateUrl: './nap-from-mou-paging.component.html',
  styleUrls: ['./nap-from-mou-paging.component.scss']
})
export class NapFromMouPagingComponent implements OnInit {

  inputPagingObj: UcPagingObj = new UcPagingObj();
  arrCrit: Array<any> = new Array();
  userAccess: any;
  BizTemplateCode: string;

  constructor(private http: HttpClient,
    private router: Router,
    private toastr: NGXToastrService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(params => {
        if (params["BizTemplateCode"] != null) {
          this.BizTemplateCode = params["BizTemplateCode"];
          localStorage.setItem("BizTemplateCode", this.BizTemplateCode);
        }
      });
     }

  ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem(CommonConstant.USER_ACCESS));

    this.arrCrit = new Array();    
    //this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchAppFromMou.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = URLConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchAppFromMou.json";

    this.inputPagingObj.ddlEnvironments = [
      {
        name: "MC.MR_MOU_TYPE_CODE",
        environment: environment.FoundationR3Url
      }
    ];

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria(){
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
    critObj.value = CommonConstant.FCTR;//this.BizTemplateCode;
    this.arrCrit.push(critObj);

    critObj = new CriteriaObj();
    critObj.DataType = 'text';
    critObj.restriction = AdInsConstant.RestrictionEq;
    critObj.propName = 'MOU_STAT';
    critObj.value = 'ACT';
    this.arrCrit.push(critObj);
  }

  AddApp(ev){
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    this.http.post(URLConstant.GetRefOfficeByOfficeCode, obj).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          AdInsHelper.RedirectUrl(this.router,["/Nap/Sharing/NapFromMou/Detail"], { "MouCustId": ev.RowObj.MouCustId});
        }else{
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      });
  }
}
