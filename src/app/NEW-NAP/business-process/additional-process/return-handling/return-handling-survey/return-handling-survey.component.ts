import { Component, OnInit } from '@angular/core';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { ActivatedRoute, Router } from '@angular/router';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { CenterGrpOfficeMbrObj } from 'app/shared/model/RefOffice/CenterGrpOfficeMbrObj.Model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-return-handling-survey',
  templateUrl: './return-handling-survey.component.html',
  styleUrls: []
})
export class ReturnHandlingSurveyComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router,private http: HttpClient) { }
  TrxNo : any;
  TrxType : any = "APP";
  Token : any = localStorage.getItem("Token");
  inputPagingObj;
  userAccess;
  ngOnInit() {
    this.userAccess = JSON.parse(localStorage.getItem("UserAccess"));
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchReturnHandlingSurvey.json";
    this.inputPagingObj.addCritInput = this.ActAndOfficeCriteria();
  }

  ActAndOfficeCriteria() : Array<CriteriaObj>{
    var critObjs : Array<CriteriaObj> = new Array<CriteriaObj>();

    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'WTL.ACT_CODE';
    critObj.value = "ADD_SRVY";
    critObjs.push(critObj);
    
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
    critObjs.push(critObj);

    return critObjs;
  }

  event(ev){
    console.log(ev);
    this.TrxNo = ev.AppNo;
    this.router.navigate([environment.FoundationR3Web + "/Survey/TaskWF"], { queryParams: { "TrxNo": this.TrxNo, "TrxType" : this.TrxType, "Token" : this.Token  } });
  }

}
