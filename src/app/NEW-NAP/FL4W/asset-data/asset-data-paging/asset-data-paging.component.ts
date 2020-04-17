import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';

@Component({
  selector: 'app-asset-data-paging',
  templateUrl: './asset-data-paging.component.html'
})
export class AssetDataPagingComponent implements OnInit {

  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  IdCust: any;
  appAssetObj : any;
  listAppAssetObj: any;
  getListAppAssetData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.getListAppAssetData = AdInsConstant.GetListAppAssetData;

    this.route.queryParams.subscribe(params => {
      if (params["IdCust"] != null) {
         this.IdCust = params["IdCust"];
       }
     });
  }

  ngOnInit() {
      this.appAssetObj = new AppAssetObj();
      this.appAssetObj.AppAssetId = "-";
      this.http.post(this.getListAppAssetData, this.appAssetObj).subscribe(
        (response) => {
            this.listAppAssetObj = response["ReturnObject"];
        });
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

  // deleteItem(custAddrObj: any) {
  //   var custAddr = new CustAddrObj();
  //   custAddr.CustAddrId = custAddrObj.CustAddrId;
  //   this.http.post(this.deleteCustAddr, custAddr).subscribe(
  //     (response: any) => {
  //       this.toastr.successMessage(response["message"]);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   //this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  // }

}
