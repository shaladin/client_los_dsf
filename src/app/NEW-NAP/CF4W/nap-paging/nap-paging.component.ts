import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router } from '@angular/router';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: []
})
export class NapPagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit: any;
  userAccess: any;
  token : any = localStorage.getItem("Token");
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router  ) {
  }

  makeCriteria(){
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "NAP_"+AdInsConstant.CF4W;
    this.arrCrit.push(critObj);
  }
  
  async ngOnInit() {
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.userAccess = JSON.parse(localStorage.getItem("UserAccess"));
    
    this.arrCrit = new Array();    
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.ddlEnvironments = [
      {
        name: "a.ORI_OFFICE_CODE",
        environment: environment.FoundationR3Url
      }
    ];
    this.inputPagingObj.addCritInput = this.arrCrit;
  }
  
  AddApp(){
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    this.http.post(AdInsConstant.GetRefOfficeByOfficeCode, obj).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          this.router.navigate(["Nap/ConsumerFinance/Add"]);
        }else{
          this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetCallBack(ev: any){
    if(ev.Key == "ViewProdOffering"){
      var link = environment.FoundationR3Web + "/Product/OfferingView?prodOfferingHId=0&prodOfferingCode=" + ev.RowObj.prodOfferingCode + "&prodOfferingVersion=" + ev.RowObj.prodOfferingVersion + "&Token=" + this.token;
      this.router.navigate([]).then(result => { window.open(link, '_blank'); });
    }
    if(ev.Key == "Edit"){
      this.router.navigate(["Nap/ConsumerFinance/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId" : ev.RowObj.WfTaskListId } });
    }
  }
}
