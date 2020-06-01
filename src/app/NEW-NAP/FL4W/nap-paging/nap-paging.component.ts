import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: ['./nap-paging.component.scss']
})
export class NapPagingComponent implements OnInit {

  inputPagingObj: any;
  arrCrit: any;
  userAccess: any;
  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['BizTemplateCode'] != null) {
        localStorage.setItem("BizTemplateCode", params['BizTemplateCode']);
      }
    });
  }

  ngOnInit() {
    console.log("User Access");
    console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.userAccess = JSON.parse(localStorage.getItem("UserAccess"));
    
    this.arrCrit = new Array();    
    this.makeCriteria();

    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url = "./assets/ucpaging/searchApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";

    this.inputPagingObj.addCritInput = this.arrCrit;
  }

  makeCriteria(){
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
    critObj.value = AdInsConstant.FL4W;
    this.arrCrit.push(critObj);
    
    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    if(this.userAccess.MrOfficeTypeCode!=AdInsConstant.CENTER_GROUP_CODE){
      critObj.propName = 'a.ORI_OFFICE_CODE';
      critObj.listValue = [this.userAccess.OfficeCode];
    }else{
      critObj.propName = 'a.ORI_OFFICE_CODE';
      var obj = { CenterGrpCode: AdInsConstant.CENTER_GROUP_CODE };
      this.http.post(AdInsConstant.GetListCenterGrpMemberByCenterGrpCode, obj).subscribe(
        (response) => {
          // console.log(response);
          var CenterGrpOfficeMbrObjs : Array<CenterGrpOfficeMbrObj> = response["ListCenterGrpOfficeMbr"];

          var listDataTemp = new Array();
          for(var i=0;i<CenterGrpOfficeMbrObjs.length;i++){
            listDataTemp.push(CenterGrpOfficeMbrObjs[i].RefOfficeCode);
          } 
          critObj.listValue = listDataTemp;
        },
        (error) => {
          console.log(error);
        }
      )
    }
    // critObj.value = localStorage.getItem("LobCode");
    this.arrCrit.push(critObj);
  }
  
  AddApp(){
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    this.http.post(AdInsConstant.GetRefOfficeByOfficeCode, obj).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          this.router.navigate(["Nap/FinanceLeasing/Add"]);
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
    // console.log(ev);
    // if(!ev.RowObj.IsAllowAppCreated){
    //   this.toastr.typeErrorCustom('Office Is Not Allowed to Create App');
    //   return;
    // }else{
      this.router.navigate(["Nap/FinanceLeasing/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId" : ev.RowObj.WfTaskListId } });
    // }
  }
<<<<<<< HEAD
=======

>>>>>>> a67bf74999ddad239bfe613db888dc5749873dc6
}
