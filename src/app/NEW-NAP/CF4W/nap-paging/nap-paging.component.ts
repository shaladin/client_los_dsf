import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nap-paging',
  templateUrl: './nap-paging.component.html',
  styleUrls: []
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
  }

  makeCriteria(){
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BIZ_TMPLT_CODE';
    critObj.value = AdInsConstant.CF4W;
    this.arrCrit.push(critObj);
    
    critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionIn;
    if(this.userAccess.MrOfficeTypeCode!="CG"){
      critObj.propName = 'a.ORI_OFFICE_CODE';
      critObj.listValue = [this.userAccess.MrOfficeTypeCode];
    }else{
      critObj.propName = 'a.ORI_OFFICE_NAME';
      var obj = { CenterGrpCode: "CG" };
      this.http.post(AdInsConstant.GetListCenterGrpMemberByCenterGrpCode, obj).subscribe(
        (response) => {
          // console.log(response);
          var listDataTemp = new Array();
          for(var i=0;i<response["ListCenterGrpOfficeMbr"].length;i++){
            listDataTemp.push(response["ListCenterGrpOfficeMbr"][i].RefOfficeName);
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

    this.inputPagingObj.addCritInput = this.arrCrit;
  }
  
  AddApp(){
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    this.http.post(AdInsConstant.GetRefOfficeByOfficeCode, obj).subscribe(
      (response) => {
        if(response["IsAllowAppCreated"] == true){
          this.router.navigate(["Nap/ConsumerFinance/InputNap/Add"]);
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
      this.router.navigate(["Nap/ConsumerFinance/InputNap/Add/Detail"], { queryParams: { "AppId": ev.RowObj.AppId, "WfTaskListId" : ev.RowObj.WfTaskListId } });
    // }
  }
}
