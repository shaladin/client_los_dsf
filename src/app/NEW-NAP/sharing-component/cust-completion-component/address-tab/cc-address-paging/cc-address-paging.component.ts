import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/InputCustomAddrCustCmpltObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { KeyValueObj } from 'app/shared/model/KeyValueObj.Model';
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
      }
    );
  }

  Add() {
    this.IsDetail = true;
    this.InputObj.Mode = "Add";
    this.InputObj.IsDetail = true;
    this.InputObj.AppCustId = this.AppCustId;
    this.InputObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
  }
}
