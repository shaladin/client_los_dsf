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
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';

@Component({
  selector: 'app-collateral-add-edit',
  templateUrl: './collateral-add-edit.component.html'
})
export class CollateralAddEditComponent implements OnInit {

  @Output() outputValue: EventEmitter<object> = new EventEmitter();
  pageType: string = "add";
  AppAssetId: any;
  branchObj : any;
  listBranchObj: any;
  getListAppAssetData: any;
  getListVendorEmp: any;
  InputLookupSupplierObj: any;
  inputLookupCollNameObj: any;
  inputFieldLegalObj: any;
  inputFieldLocationObj: any;
  AddCollForm = this.fb.group({
    AssetTypeCode: [''],
    SerialNo1: [''],
    SerialNo2: [''],
    CollateralValueAmt: [''],
    SerialNo3: [''],
    Notes: [''],
    SerialNo4:[''],

    OwnerName:[''],
    MrIdType:[''],
    OwnerRelationship:[''],
    OwnerIdNo:[''],

    AssetRegion:[''],
    Transmition:[''],
    BpkpIssuer:[''],
    Category:[''],
    CopyFromLegal:[''],
    BpkpIssueDate:[''],

    CollPercentage:[''],

    FullAssetCode: [''],
    FullAssetName:[''],

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
        this.AddCollForm.patchValue({
            BranchManagerName: this.listBranchObj.find(x => x.Key == event.target.value).Value
          });
    });
  }

  // BranchChanged(event){
  //   this.AddCollForm.patchValue({
  //     OfficeName: this.listBranchObj.find(x => x.Key == event.target.value).Value
  //   });
  // }

  getLookupCollateralName(event) {
    this.AddCollForm.patchValue({
      FullAssetCode: event.AssetTypeCode,
      //FullAssetName: event.FullAssetName
    });
  }

  ngOnInit() {
    this.inputFieldLegalObj = new InputFieldObj();
    this.inputFieldLegalObj.inputLookupObj = new InputLookupObj();
    this.inputFieldLocationObj = new InputFieldObj();
    this.inputFieldLocationObj.inputLookupObj = new InputLookupObj();

    this.InputLookupSupplierObj = new InputLookupObj();
    this.InputLookupSupplierObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.InputLookupSupplierObj.urlEnviPaging = environment.FoundationR3Url;
    this.InputLookupSupplierObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.InputLookupSupplierObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

    this.inputLookupCollNameObj = new InputLookupObj();
    this.inputLookupCollNameObj.urlJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupCollNameObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupCollNameObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCollNameObj.pagingJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
    this.inputLookupCollNameObj.genericJson = "./assets/uclookup/Collateral/lookupCollateralType.json";
  }

  editItem(custAddrObj: any) {
    this.outputValue.emit({ mode: 'edit', AddrId: custAddrObj.CustAddrId });
  }

}
