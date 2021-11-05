import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { ResGetAppCountAndMappingStepObj } from 'app/shared/model/response/dashboard/res-get-app-count-and-mapping-step-obj.model';

@Component({
  selector: 'app-dashboard-bm',
  templateUrl: './dashboard-bm.component.html'
})
export class DashboardBmComponent implements OnInit {
  ReqByLobCodeObj: GenericObj = new GenericObj();
  TempList: Array<ResGetAppCountAndMappingStepObj> = new Array<ResGetAppCountAndMappingStepObj>();
  DropDownList: Array<string> = new Array<string>();
  UserList: any[] = [];
  done: boolean = false;
  data: any;
  TotalApp: number = 0;
  LobCode: string = "";

  // options
  view: any[] = [600, 400];
  showXAxis = true;
  showYAxis = true;
  showDataLabel = true;

  colorScheme = {
    domain: ['#b0e0ff']
  };

  constructor(private http: HttpClient,) {

  }
  async displayAllUsers(LobCode: string) {

    this.ReqByLobCodeObj.Code = LobCode;
    await this.http.post(URLConstant.GetAppCountAndMappingStep, this.ReqByLobCodeObj).toPromise().then(
      (response) => {
        this.TempList = response["ListAppCountAndMappingStep"];
        this.TotalApp = response["TotalApp"];

        for(var i=0;i<this.TempList.length ;i++){
          this.UserList.push({ "name": this.TempList[i].MappingStep, "value": this.TempList[i].AppCount});
          // nanti pake kayak gini buat SLA
          // this.UserList.push({ "name": this.TempList[i].MappingStep, "value": this.TempList[i].AppCount, "extra": {"red": this.TempList[i].AppCount, "blue": 1 }});
        }
      });

      this.done = true;
  }
  ngOnInit() {
    this.getDropdown();
    this.displayAllUsers("");
  }

  async getDropdown(){
    await this.http.post(URLConstant.GetListRefLob, {}).toPromise().then(
      (response) => {
        this.DropDownList = response[CommonConstant.ReturnObj];
      });
  }

  Refresh(){
    this.UserList = [];
    this.done = false;
    if(this.LobCode == "All"){
      this.LobCode = "";
    }
    this.displayAllUsers(this.LobCode);
  }

  radioChange(event){
    this.LobCode = event.target.value;
    this.UserList = [];
    this.done = false;
    if(event.target.value == "All"){
      this.displayAllUsers("");
    }else{
      this.displayAllUsers(event.target.value);
    }
  }

}
