import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { MouCustRvwHObj } from 'app/shared/model/MouCustRvwHObj.Model';
import { MouCustRvwDObj } from 'app/shared/model/MouCustRvwDObj.Model';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-mou-view-approval-history',
  templateUrl: './mou-view-approval-history.component.html',
})
export class MouViewApprovalHistoryComponent implements OnInit {
  @Input() MouCustId: number; 
  MouCustNo: string;
  MrMouTypeCode : string;
  result : any;
  constructor(private http: HttpClient) { }

  RfaLogObj :{
    RfaNo: any
  }
  ListRfaLogObj : any = new Array(this.RfaLogObj); 
  inputObj:  any;
  listMouAppvrObj : any = new Array(this.inputObj);
   
  count1 : number = 0;
 

  ngOnInit() {

    this.http.post(AdInsConstant.GetMouCustById, {MouCustID : this.MouCustId}).subscribe(
      (response) => {
        this.MouCustNo = response["MouCustNo"];
        this.MrMouTypeCode = response["MrMouTypeCode"];
        console.log("test");
        console.log(response);
        console.log(this.MouCustNo);
        this.http.post(AdInsConstant.GetRfaLogByTrxNo, {TrxNo : this.MouCustNo}).subscribe(
          (response) => {
            console.log(response);
            this.result = response;
            this.ListRfaLogObj = response["ListRfaLogObj"];
            console.log(this.ListRfaLogObj);
            for(let i =0;i<this.ListRfaLogObj.length;i++){
              if(this.ListRfaLogObj[i]["ApvCategory"]=="MOUC_GEN_APV" && this.MrMouTypeCode == "GENERAL"){
                console.log(this.ListRfaLogObj[i]["RfaNo"])
                this.listMouAppvrObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"]
                };
                this.count1++;
              }else if(this.ListRfaLogObj[i]["ApvCategory"]=="MOUC_FCTR_APV" && this.MrMouTypeCode == "FACTORING"){
                console.log(this.ListRfaLogObj[i]["RfaNo"])
                this.listMouAppvrObj[i] = {
                  approvalBaseUrl: environment.ApprovalR3Url,
                  type: 'task',
                  refId: this.ListRfaLogObj[i]["RfaNo"]
                };
                this.count1++;
              } 
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }



}
