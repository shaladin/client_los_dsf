import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppAssetObj } from 'app/shared/model/AppAssetObj.model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { VendorEmpObj } from 'app/shared/model/VendorEmp.Model';

@Component({
  selector: 'app-asset-data-add-edit',
  templateUrl: './asset-data-add-edit.component.html'
})
export class AssetDataAddEditComponent implements OnInit {

  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  pageType: string = "add";
  AppAssetId: any;
  branchObj : any;
  listBranchObj: any;
  getListAppAssetData: any;
  getListVendorEmp: any;
  InputLookupSupplierObj: any;
  AssetDataForm = this.fb.group({
    OfficeCode: [''],
    OfficeName: [''],
    CrtOfficeCode: [''],
    CrtOfficeName: [''],
    OrderNo:[''],
    LobCode: [''],
    LobName:[''],
    LeadSource: [''],

    BranchManagerName: [''],
    BranchManagerNo: [''],
    BranchManagerPosition: ['']
  });

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private fb: FormBuilder) { 
    this.getListAppAssetData = AdInsConstant.GetListAppAssetData;
    this.getListVendorEmp = AdInsConstant.GetListVendorEmpByVendorIdAndPosition;

    this.route.queryParams.subscribe(params => {
      if (params["AppAssetId"] != null) {
         this.AppAssetId = params["AppAssetId"];
       }
       if (params["mode"] != null) {
        this.pageType = params["mode"];
      } 
    });
  }

//   SetAsset(event) {
//     this.LeadDataForm.patchValue({
//       FullAssetCode: event.FullAssetCode,
//       FullAssetName: event.FullAssetName
//     });
//     this.assetTypeId = event.AssetTypeId;
//   }

  SetSupplier(event){
    this.branchObj = new VendorEmpObj();
    this.branchObj.VendorId = event.VendorId;
    this.branchObj.MrVendorEmpPositionCode = 'BRANCH_MANAGER';
    this.http.post(this.getListVendorEmp, this.branchObj).subscribe(
    (response) => {
        this.listBranchObj = response["ReturnObject"];
        this.AssetDataForm.patchValue({
            BranchManagerName: this.listBranchObj.find(x => x.Key == event.target.value).Value
          });
    });
  }

  BranchChanged(event){
    this.AssetDataForm.patchValue({
      OfficeName: this.listBranchObj.find(x => x.Key == event.target.value).Value
    });
  }

  ngOnInit() {
    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";
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
