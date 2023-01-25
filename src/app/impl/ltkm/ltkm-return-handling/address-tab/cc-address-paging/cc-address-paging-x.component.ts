import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputCustomAddrLtkmObj } from 'app/impl/shared/model/ltkm/input-custom-addr-ltkm-return-objX.model';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AppCustAddrObj } from 'app/shared/model/app-cust-addr-obj.model';
import { InputCustomAddrCustCmpltObj } from 'app/shared/model/input-custom-addr-cust-cmplt-obj.model';
import { InputGridObj } from 'app/shared/model/input-grid-obj.model';
import { LtkmCustAddrObj } from 'app/shared/model/ltkm/ltkm-cust-addr-obj.model';
import { FormValidateService } from 'app/shared/services/formValidate.service';

@Component({
  selector: 'app-cc-address-paging-x',
  templateUrl: './cc-address-paging-x.component.html'
})
export class CcAddressPagingLtkmXComponent implements OnInit {

  @Input() MrCustTypeCode: string;
  @Input() LtkmCustId: number;
  @Output() OutputAddr: EventEmitter<Object> = new EventEmitter();
  inputGridObj: InputGridObj = new InputGridObj();
  InputObj: InputCustomAddrLtkmObj = new InputCustomAddrLtkmObj();
  ListAddress: Array<LtkmCustAddrObj> = new Array();
  Mode: string = "add";
  IsDetail: boolean = false;
  IsReady: boolean = false;

  constructor(
    private http: HttpClient,
    private toastr: NGXToastrService,
    public formValidate: FormValidateService) {
  }

  ngOnInit() {
    this.inputGridObj.pagingJson = "./assets/impl/ucgridview/gridLtkmAddressX.json";
    this.LoadListCustAddress();
  }

  LoadListCustAddress(){
    this.http.post<Array<LtkmCustAddrObj>>(URLConstant.GetListLtkmCustAddrByLtkmCustId, { Id: this.LtkmCustId }).subscribe(
      (response) => {
        this.ListAddress = response[CommonConstant.ReturnObj];
        let idxEmergency = this.ListAddress.findIndex(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeEmergency);
        if(idxEmergency != -1) this.ListAddress.splice(idxEmergency, 1)

        this.inputGridObj.resultData = {
          Data: ""
        }
        this.inputGridObj.resultData["Data"] = new Array();
        this.inputGridObj.resultData.Data = this.ListAddress;
        this.IsReady = true;
        this.OutputAddr.emit({ IsDetail: this.IsDetail, listLtkmAddress: this.ListAddress});
      }
    );
  }

  // Add() {
  //   this.IsDetail = true;
  //   this.InputObj.ListInputedAddr = this.ListAddress;
  //   this.InputObj.Mode = "Add";
  //   this.InputObj.IsDetail = true;
  //   this.InputObj.LtkmCustId = this.LtkmCustId;
  //   this.InputObj.LtkmCustAddrId = 0;
  //   this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
  // }

  GetCallback(event){
    this.IsDetail = true;
    this.InputObj.ListInputedAddr = this.inputGridObj.resultData.Data;
    this.InputObj.Mode = "Edit";
    this.InputObj.IsDetail = true;
    this.InputObj.LtkmCustId = this.LtkmCustId;
    this.InputObj.LtkmCustAddrId = event.RowObj.LtkmCustAddrId;
    this.InputObj.MrCustTypeCode = this.MrCustTypeCode;
    this.InputObj.InputedAddr = event.RowObj;
    this.OutputAddr.emit({ IsDetail: this.IsDetail, listLtkmAddress: this.ListAddress});
  }

  GetEvent(event){
    this.IsDetail = event.IsDetail;
    this.IsReady = false;
    this.ListAddress = event.ListAddress;
    let idxEmergency = this.ListAddress.findIndex(x => x.MrCustAddrTypeCode == CommonConstant.AddrTypeEmergency);
    if(idxEmergency != -1) this.ListAddress.splice(idxEmergency, 1)
    this.inputGridObj.resultData = {
      Data: ""
    }
    this.inputGridObj.resultData["Data"] = new Array();
    this.inputGridObj.resultData.Data = this.ListAddress;
    if(event.Save == true){
      for (let i = 0; i < this.inputGridObj.resultData.Data.length; i++){
        if (this.inputGridObj.resultData.Data[i].LtkmCustAddrId == event.CustAddress.LtkmCustAddrId){
          this.inputGridObj.resultData.Data[i].LtkmCustAddrId = event.CustAddress.LtkmCustAddrId;
          this.inputGridObj.resultData.Data[i].LtkmCustId = event.CustAddress.LtkmCustId;
          this.inputGridObj.resultData.Data[i].MrCustAddrTypeCode = event.CustAddress.MrCustAddrTypeCode;
          this.inputGridObj.resultData.Data[i].Addr = event.CustAddress.Addr;
          this.inputGridObj.resultData.Data[i].AreaCode1 = event.CustAddress.AreaCode1;
          this.inputGridObj.resultData.Data[i].AreaCode2 = event.CustAddress.AreaCode2;
          this.inputGridObj.resultData.Data[i].AreaCode3 = event.CustAddress.AreaCode3;
          this.inputGridObj.resultData.Data[i].AreaCode4 = event.CustAddress.AreaCode4;
          this.inputGridObj.resultData.Data[i].City = event.CustAddress.City;
          this.inputGridObj.resultData.Data[i].Zipcode = event.CustAddress.Zipcode;
          this.inputGridObj.resultData.Data[i].SubZipcode = event.CustAddress.SubZipcode;
          this.inputGridObj.resultData.Data[i].PhnArea1 = event.CustAddress.PhnArea1;
          this.inputGridObj.resultData.Data[i].Phn1 = event.CustAddress.Phn1;
          this.inputGridObj.resultData.Data[i].PhnExt1 = event.CustAddress.PhnExt1;
          this.inputGridObj.resultData.Data[i].PhnArea2 = event.CustAddress.PhnArea2;
          this.inputGridObj.resultData.Data[i].Phn2 = event.CustAddress.Phn2;
          this.inputGridObj.resultData.Data[i].PhnExt2 = event.CustAddress.PhnExt2;
          this.inputGridObj.resultData.Data[i].PhnArea3 = event.CustAddress.PhnArea3;
          this.inputGridObj.resultData.Data[i].Phn3 = event.CustAddress.Phn3;
          this.inputGridObj.resultData.Data[i].PhnExt3 = event.CustAddress.PhnExt3;
          this.inputGridObj.resultData.Data[i].FaxArea = event.CustAddress.FaxArea;
          this.inputGridObj.resultData.Data[i].Fax = event.CustAddress.Fax;
          this.inputGridObj.resultData.Data[i].FullAddr = event.CustAddress.Addr + " RT/RW " + event.CustAddress.AreaCode4 + "/" + event.CustAddress.AreaCode3 + " " + event.CustAddress.AreaCode1 + " " + event.CustAddress.AreaCode2 + " " + event.CustAddress.City + " " + event.CustAddress.Zipcode
          this.inputGridObj.resultData.Data[i].StayLength = event.CustAddress.StayLength;
          this.inputGridObj.resultData.Data[i].RowVersion = event.CustAddress.RowVersion;
          this.inputGridObj.resultData.Data[i].Notes = event.CustAddress.Notes;
          this.inputGridObj.resultData.Data[i].CustAddrTypeName = event.CustAddress.CustAddrTypeName;
          this.inputGridObj.resultData.Data[i].PhoneNo = event.CustAddress.PhoneNo;
          this.inputGridObj.resultData.Data[i].PhoneNo2 = event.CustAddress.PhoneNo2;
          this.ListAddress[i].MrHouseOwnershipCode = event.CustAddress.MrHouseOwnershipCode;
          this.ListAddress[i].HouseOwnershipName = event.CustAddress.HouseOwnershipName;
          this.ListAddress[i].LtkmCustAddrId = event.CustAddress.LtkmCustAddrId;
          this.ListAddress[i].LtkmCustId = event.CustAddress.LtkmCustId;
          this.ListAddress[i].MrCustAddrTypeCode = event.CustAddress.MrCustAddrTypeCode;
          this.ListAddress[i].Addr = event.CustAddress.Addr;
          this.ListAddress[i].AreaCode1 = event.CustAddress.AreaCode1;
          this.ListAddress[i].AreaCode2 = event.CustAddress.AreaCode2;
          this.ListAddress[i].AreaCode3 = event.CustAddress.AreaCode3;
          this.ListAddress[i].AreaCode4 = event.CustAddress.AreaCode4;
          this.ListAddress[i].City = event.CustAddress.City;
          this.ListAddress[i].Zipcode = event.CustAddress.Zipcode;
          this.ListAddress[i].SubZipcode = event.CustAddress.SubZipcode;
          this.ListAddress[i].PhnArea1 = event.CustAddress.PhnArea1;
          this.ListAddress[i].Phn1 = event.CustAddress.Phn1;
          this.ListAddress[i].PhnExt1 = event.CustAddress.PhnExt1;
          this.ListAddress[i].PhnArea2 = event.CustAddress.PhnArea2;
          this.ListAddress[i].Phn2 = event.CustAddress.Phn2;
          this.ListAddress[i].PhnExt2 = event.CustAddress.PhnExt2;
          this.ListAddress[i].PhnArea3 = event.CustAddress.PhnArea3;
          this.ListAddress[i].Phn3 = event.CustAddress.Phn3;
          this.ListAddress[i].PhnExt3 = event.CustAddress.PhnExt3;
          this.ListAddress[i].FaxArea = event.CustAddress.FaxArea;
          this.ListAddress[i].Fax = event.CustAddress.Fax;
          this.ListAddress[i].FullAddr = event.CustAddress.Addr + " RT/RW " + event.CustAddress.AreaCode4 + "/" + event.CustAddress.AreaCode3 + " " + event.CustAddress.AreaCode1 + " " + event.CustAddress.AreaCode2 + " " + event.CustAddress.City + " " + event.CustAddress.Zipcode
          this.ListAddress[i].StayLength = event.CustAddress.StayLength;
          this.ListAddress[i].RowVersion = event.CustAddress.RowVersion;
          this.ListAddress[i].Notes = event.CustAddress.Notes;
          this.ListAddress[i].CustAddrTypeName = event.CustAddress.CustAddrTypeName;
          this.ListAddress[i].PhoneNo = event.CustAddress.PhoneNo;
          this.ListAddress[i].PhoneNo2 = event.CustAddress.PhoneNo2;
          this.ListAddress[i].MrHouseOwnershipCode = event.CustAddress.MrHouseOwnershipCode;
          this.ListAddress[i].HouseOwnershipName = event.CustAddress.HouseOwnershipName;
        }
      }
    }
    this.OutputAddr.emit({ IsDetail: this.IsDetail, listLtkmAddress: this.ListAddress});
    this.IsReady = true;
  }
}
