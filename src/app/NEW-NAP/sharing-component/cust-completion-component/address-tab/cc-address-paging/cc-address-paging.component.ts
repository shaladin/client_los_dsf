import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/InputCustomAddrCustCmpltObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cc-address-paging',
  templateUrl: './cc-address-paging.component.html',
  styleUrls: ['./cc-address-paging.component.scss']
})
export class CcAddressPagingComponent implements OnInit {

  @Input() MrCustTypeCode: string;
  @Input() AppCustId: number;
  @Output() OutputTab: EventEmitter<object> = new EventEmitter();
  inputGridObj: InputGridObj = new InputGridObj();
  InputObj: InputCustomAddrCustCmpltObj = new InputCustomAddrCustCmpltObj();
  ListAddress: Array<any>;
  Mode: string = "add";
  IsDetail: boolean = false;
  IsReady: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/ucgridview/gridCustCompletionAddress.json";
    this.LoadListCustAddress();
  }

  LoadListCustAddress(){
    this.http.post(URLConstant.GetListAppCustAddrByAppCustId, { AppCustId: this.AppCustId }).subscribe(
      (response) => {
        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = response;
        this.ListAddress = this.inputGridObj.resultData.Data;
        this.IsReady = true;
      }
    );
  }

  Add() {
    this.IsDetail = true;
    this.InputObj.ListInputedAddr = this.ListAddress;
    this.InputObj.Mode = "Add";
    this.InputObj.IsDetail = true;
    this.InputObj.AppCustId = this.AppCustId;
    this.InputObj.AppCustAddrId = 0;
    this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
  }

  GetCallback(event){
    this.IsDetail = true;
    this.InputObj.ListInputedAddr = this.ListAddress;
    this.InputObj.Mode = "Edit";
    this.InputObj.IsDetail = true;
    this.InputObj.AppCustId = this.AppCustId;
    this.InputObj.AppCustAddrId = event.RowObj.AppCustAddrId;
    this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
  }

  GetEvent(event){
    this.IsDetail = event.IsDetail;
    this.IsReady = false;
    this.LoadListCustAddress();
  }

  Continue(){
    if(this.MrCustTypeCode == CommonConstant.CustTypePersonal){
      if(this.ListAddress.find(x=>x.MrCustAddrTypeCode == CommonConstant.AddrTypeResidence) != null) {
        this.OutputTab.emit();
      }else{
        this.toastr.warningMessage("Please input Legal Address And Residence Address Data!")
      }
    }else if(this.MrCustTypeCode == CommonConstant.CustTypeCompany){
      this.OutputTab.emit();
    }
  }
}
