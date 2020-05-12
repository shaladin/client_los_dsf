import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { UcPagingObj } from 'app/shared/model/UcPagingObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.inputPagingObj = new UcPagingObj();
    this.inputPagingObj._url="./assets/ucpaging/searchApp.json";
    this.inputPagingObj.enviromentUrl = environment.losUrl;
    this.inputPagingObj.apiQryPaging = AdInsConstant.GetPagingObjectBySQL;
    // this.inputPagingObj.deleteUrl = "/RefBank/DeleteRefBank";
    this.inputPagingObj.pagingJson = "./assets/ucpaging/searchApp.json";

    this.arrCrit = new Array();
    var critObj = new CriteriaObj();
    critObj.restriction = AdInsConstant.RestrictionLike;
    critObj.propName = 'RL.BL_CODE';
    critObj.value = AdInsConstant.CF4W;
    this.arrCrit.push(critObj);
    this.inputPagingObj.addCritInput = this.arrCrit;
    
    // console.log("User Access");
    // console.log(JSON.parse(localStorage.getItem("UserAccess")));
    this.isAllowedCrt = false;
    this.userAccess = JSON.parse(localStorage.getItem("UserAccess"));
    await this.GetOfficeData();
  }

  isAllowedCrt: boolean;
  async GetOfficeData(){
    var obj = { OfficeCode: this.userAccess.OfficeCode };
    await this.http.post(AdInsConstant.GetRefOfficeByOfficeCode, obj).toPromise().then(
      (response) => {
        // console.log(response);
        if(response["IsAllowAppCreated"] == true)
          this.isAllowedCrt = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
