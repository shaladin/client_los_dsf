import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/InputCustomAddrCustCmpltObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-new-nap-cust-addr',
  templateUrl: './new-nap-cust-addr.component.html',
  styles: []
})
export class NewNapCustAddrComponent implements OnInit {
  @Input() MrCustTypeCode: string;
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  inputGridObj: InputGridObj = new InputGridObj();
  InputObj: InputCustomAddrCustCmpltObj = new InputCustomAddrCustCmpltObj();
  ListAddress: Array<AppCustAddrObj> = new Array<AppCustAddrObj>();
  Mode: string = "add";
  IsDetail: boolean = false;
  IsReady: boolean = false;

  constructor(private http: HttpClient, public formValidate: FormValidateService) { }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridAppCustAddrNewNap.json";
    this.LoadListCustAddress(new Array<AppCustAddrObj>(), true);
  }

  LoadListCustAddress(appCustAddrList: Array<AppCustAddrObj>, isOnInit: boolean){
    if(this.AppCustId && this.AppCustId > 0 && isOnInit) {
      this.http.post<Array<AppCustAddrObj>>(URLConstant.GetListAppCustAddrByAppCustId, { Id: this.AppCustId }).subscribe(
        (response) => {
          this.ListAddress = response[CommonConstant.ReturnObj];
          let idxEmergency = this.ListAddress.findIndex(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeEmergency);
          if(idxEmergency != -1) this.ListAddress.splice(idxEmergency, 1)
  
          this.inputGridObj.resultData = {
            Data: ""
          }
          this.inputGridObj.resultData["Data"] = new Array();
          this.inputGridObj.resultData.Data = this.ListAddress;
          this.OutputTab.emit({ ListAddress: this.ListAddress });
          this.IsReady = true;
        }
      );
    }
    else {
      this.ListAddress = appCustAddrList;     
      let idxEmergency = this.ListAddress.findIndex(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeEmergency);
      if(idxEmergency != -1) this.ListAddress.splice(idxEmergency, 1)

      this.inputGridObj.resultData = {
        Data: ""
      }
      this.inputGridObj.resultData["Data"] = new Array();
      this.inputGridObj.resultData.Data = this.ListAddress;
      this.IsReady = true;
    }
  }

  Add() {
    this.IsDetail = true;
    this.InputObj.ListInputedAddr = this.ListAddress;
    this.InputObj.Mode = "Add";
    this.InputObj.IsDetail = true;
    this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
  }

  GetCallback(event){
    this.IsDetail = true;
    this.InputObj.ListInputedAddr = this.ListAddress;
    this.InputObj.Mode = "Edit";
    this.InputObj.IsDetail = true;
    this.InputObj.InputedAddr = this.ListAddress.find(x => x.MrCustAddrTypeCode == event.RowObj.MrCustAddrTypeCode);
    this.InputObj.EditedIndex = this.ListAddress.findIndex(x => x.MrCustAddrTypeCode == event.RowObj.MrCustAddrTypeCode);
    this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
  }

  GetEvent(event){
    this.OutputTab.emit({ ListAddress: event.ListAddress });
    this.IsDetail = event.IsDetail;
    this.IsReady = false;
    this.LoadListCustAddress(event.ListAddress, false);
  }
}