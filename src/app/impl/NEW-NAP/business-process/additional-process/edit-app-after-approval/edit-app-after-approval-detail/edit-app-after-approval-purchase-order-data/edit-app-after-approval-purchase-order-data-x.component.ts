import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CommonConstantX } from 'app/impl/shared/constant/CommonConstantX';
import { URLConstant } from 'app/shared/constant/URLConstant';

@Component({
  selector: 'app-edit-app-after-approval-purchase-order-data-x',
  templateUrl: './edit-app-after-approval-purchase-order-data-x.component.html'
})
export class EditAppAfterApprovalPurchaseOrderDataXComponent implements OnInit {

  @Input() PurchaseOrderHObj: any;
  @Input() LobCode: string = "";
  @Input() CustBankAccList: Array<Object> = new Array<Object>();
  @Output() outputPage: EventEmitter<object> = new EventEmitter();
  EditPoForm = this.fb.group({
    BankAccountDestination: []
  });

  PurchaseOrderHOutput: any;

  
  constructor(private fb: FormBuilder) { }

  async ngOnInit() {
    if(this.LobCode != CommonConstantX.SLB){
      if(this.PurchaseOrderHObj.EditedVendorBankAccId != 0 && this.PurchaseOrderHObj.EditedVendorBankAccId != undefined){
        this.EditPoForm.patchValue({
          BankAccountDestination: this.PurchaseOrderHObj.EditedVendorBankAccId
        }); 
      }else{
        let existingBankAcc = this.PurchaseOrderHObj.VendorBankAccObjs.filter(x => x.VendorCode == this.PurchaseOrderHObj.SupplCode)[0];
        
        this.EditPoForm.patchValue({
          BankAccountDestination: existingBankAcc.VendorBankAccId
        }); 
      }
    }
    else{
      if(this.PurchaseOrderHObj.EditedVendorBankAccId != 0 && this.PurchaseOrderHObj.EditedVendorBankAccId != undefined){
        this.EditPoForm.patchValue({
          BankAccountDestination: this.PurchaseOrderHObj.EditedVendorBankAccId
        }); 
      }else{
        let existingBankAcc = this.CustBankAccList.find(x => x["BankCode"] == this.PurchaseOrderHObj.BankCode && x["BankBranch"] == this.PurchaseOrderHObj.BankBranch && x["BankAccNo"] == this.PurchaseOrderHObj.BankAccNo);
        if(existingBankAcc != null){
          this.EditPoForm.patchValue({
            BankAccountDestination: existingBankAcc["AppCustBankAccId"]
          }); 
        }
        else{
          this.EditPoForm.patchValue({
            BankAccountDestination: this.CustBankAccList[0]["AppCustBankAccId"]
          }); 
        }
      }
    }
  }

  async CancelClick(){
    await this.SaveBankInfo("Cancel");
    this.outputPage.emit({ PurchaseOrderHOutput: this.PurchaseOrderHOutput, pageType: "cancelPoData"});
  }
  
  SaveBankInfo(state: string = "Submit"){
    if(this.LobCode != CommonConstantX.SLB){
      let selectedVendorBankAccId = 0;
      if(state == "Submit"){
        selectedVendorBankAccId = this.EditPoForm.controls["BankAccountDestination"].value;
      }else{
        selectedVendorBankAccId = this.PurchaseOrderHObj.EditedVendorBankAccId == 0? this.EditPoForm.controls["BankAccountDestination"].value : this.PurchaseOrderHObj.EditedVendorBankAccId;
      }
  
      let selectedVendorBankAcc = this.PurchaseOrderHObj.VendorBankAccObjs.filter(x => x.VendorBankAccId == selectedVendorBankAccId)[0];
      this.PurchaseOrderHOutput = 
      {
        PurchaseOrderHId: this.PurchaseOrderHObj.PurchaseOrderHId == null ? '' :this.PurchaseOrderHObj.PurchaseOrderHId,
        BankCode: selectedVendorBankAcc.BankCode == null ? '' : selectedVendorBankAcc.BankCode,
        BankBranch: selectedVendorBankAcc.BankBranch == null ? '' : selectedVendorBankAcc.BankBranch,
        BankAccountNo: selectedVendorBankAcc.BankAccountNo == null ? '' : selectedVendorBankAcc.BankAccountNo,
        BankAccountName: selectedVendorBankAcc.BankAccountName == null ? '' : selectedVendorBankAcc.BankAccountName,
        VendorBankAccId: selectedVendorBankAccId == null ? '' : selectedVendorBankAccId
      };
    }
    else{
      let selectedCustBankAccId = 0;
      if(state == "Submit"){
        selectedCustBankAccId = this.EditPoForm.controls["BankAccountDestination"].value;
      }else{
        selectedCustBankAccId = this.PurchaseOrderHObj.EditedVendorBankAccId == 0? this.EditPoForm.controls["BankAccountDestination"].value : this.PurchaseOrderHObj.EditedVendorBankAccId;
      }
  
      let selectedVendorBankAcc = this.CustBankAccList.filter(x => x["AppCustBankAccId"] == selectedCustBankAccId)[0];
      this.PurchaseOrderHOutput = 
      {
        PurchaseOrderHId: this.PurchaseOrderHObj.PurchaseOrderHId == null ? '' :this.PurchaseOrderHObj.PurchaseOrderHId,
        BankCode: selectedVendorBankAcc["BankCode"] == null ? '' : selectedVendorBankAcc["BankCode"] ,
        BankBranch: selectedVendorBankAcc["BankBranch"] == null ? '' : selectedVendorBankAcc["BankBranch"],
        BankAccountNo: selectedVendorBankAcc["BankAccNo"] == null ? '' : selectedVendorBankAcc["BankAccNo"],
        BankAccountName: selectedVendorBankAcc["BankAccName"] == null ? '' : selectedVendorBankAcc["BankAccName"],
        VendorBankAccId: selectedCustBankAccId == null ? '' : selectedCustBankAccId
      };
    }

  }

  SaveData(){
    this.SaveBankInfo();
    this.outputPage.emit({ PurchaseOrderHOutput: this.PurchaseOrderHOutput,  pageType: "submitPoData"});
  }

}
