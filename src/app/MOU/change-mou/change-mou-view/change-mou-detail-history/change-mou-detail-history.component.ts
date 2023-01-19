import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { UcViewGenericObj } from 'app/shared/model/uc-view-generic-obj.model';
import { environment } from 'environments/environment';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { GenericObj } from 'app/shared/model/generic/generic-obj.model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { VendorObj } from 'app/shared/model/vendor-obj.model';

@Component({
  selector: 'app-change-mou-detail-history',
  templateUrl: './change-mou-detail-history.component.html'
})
export class ChangeMouDetailHistoryComponent implements OnInit {
  @Input() ChangeMouTrxId: number;
  @Input() MouCustId: number;
  @Input() MouType: string;
  @Input() TrxType: string; //CHNGMOU OR REQEXP
  // listedCustFctrIsReady: boolean = false;
  // listedCustFctr: Array<any>;
  // ReqByIdObj: GenericObj = new GenericObj();

  isDataAlreadyLoaded: boolean = false;

  viewMainDataObj: UcViewGenericObj = new UcViewGenericObj();
  arrValue = [];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService) {

  }

  ngOnInit() {
    // this.ReqByIdObj.Id = this.MouCustId ;
    // if(this.MouType == 'FACTORING'){
    //   this.getListedMouCustFctr(this.ReqByIdObj);
    //   }
    this.arrValue.push(this.ChangeMouTrxId);
    this.arrValue.push(this.MouCustId);


    if (this.TrxType == CommonConstant.CHANGE_MOU_TRX_TYPE_CHANGE_MOU) {
      if (this.MouType == CommonConstant.DEALERFINANCING) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFinancing.json";
      }
      else if (this.MouType == CommonConstant.FACTORING) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailFactoring.json";
      }
      else if (this.MouType == CommonConstant.GENERAL) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDetailGeneral.json";
      }
    } else if (CommonConstant.CHANGE_MOU_TRX_TYPE_REQ_EXP) {
      if (this.MouType == CommonConstant.DEALERFINANCING) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChgMouDtlFinancingExpType.json";
      }
      else if (this.MouType == CommonConstant.FACTORING) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChgMouDtlFctrForExpType.json";
      }
      else if (this.MouType == CommonConstant.GENERAL) {
        this.viewMainDataObj.viewInput = "./assets/ucviewgeneric/viewChangeMouDtlGenrReqExpType.json";
      }
    }
    this.viewMainDataObj.whereValue = this.arrValue;

    this.isDataAlreadyLoaded = true;
  }

  ClickLinkManufacturer(vendorCode: string) {
    this.http.post(URLConstant.GetVendorByVendorCode, { Code: vendorCode }).subscribe(
      (responseLink: VendorObj) => {
        console.log(responseLink);
        AdInsHelper.OpenVendorBranchViewByVendorId(responseLink.VendorId);
      });
  }

  GetCallBack(ev: any) {
    if (ev.Key == "manufacturer") {
      this.ClickLinkManufacturer(ev.ViewObj.manufacturerCode)
    } else if (ev.Key == "dealer") {
      this.ClickLinkManufacturer(ev.ViewObj.dealerCode)
    }
  }
  // openView(custNo) {
  //   this.ReqByIdObj.CustNo = custNo;
  //   this.http.post(URLConstant.GetCustByCustNo, this.ReqByIdObj).subscribe(
  //     response => {
  //       if(response["MrCustTypeCode"] == 'PERSONAL'){
  //         AdInsHelper.OpenCustomerViewByCustId(response["CustId"]);
  //       }
  //       else if(response["MrCustTypeCode"] == 'COMPANY'){
  //         AdInsHelper.OpenCustomerCoyViewByCustId(response["CustId"]);
  //       }
  //     }
  //   );
  // }

  // getListedMouCustFctr(ReqByIdObj){
  //   this.http.post(URLConstant.GetListMouCustListedCustFctrByMouCustId, ReqByIdObj).subscribe(
  //     (response) => {
  //       this.listedCustFctr = response[CommonConstant.ReturnObj];
  //       this.listedCustFctrIsReady = true;
  //   });
  // }
}
