import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-app-after-approval-purchase-order-data',
  templateUrl: './edit-app-after-approval-purchase-order-data.component.html',
  styleUrls: ['./edit-app-after-approval-purchase-order-data.component.css']
})
export class EditAppAfterApprovalPurchaseOrderDataComponent implements OnInit {

  @Input() PurchaseOrderHObj: any;
  @Output() outputPage: EventEmitter<object> = new EventEmitter();

  EditPoForm = this.fb.group({
    BankAccountDestination: []
  });

  PurchaseOrderHOutput: any;

  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
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

  async CancelClick(){
    await this.SaveBankInfo("Cancel");
    this.outputPage.emit({ PurchaseOrderHOutput: this.PurchaseOrderHOutput, pageType: "cancelPoData"});
  }
  
  SaveBankInfo(state: string = "Submit"){
    var selectedVendorBankAccId = 0;
    if(state == "Submit"){
      selectedVendorBankAccId = this.EditPoForm.controls["BankAccountDestination"].value;
    }else{
      selectedVendorBankAccId = this.PurchaseOrderHObj.EditedVendorBankAccId == 0? this.EditPoForm.controls["BankAccountDestination"].value : this.PurchaseOrderHObj.EditedVendorBankAccId;
    }

    var selectedVendorBankAcc = this.PurchaseOrderHObj.VendorBankAccObjs.filter(x => x.VendorBankAccId == selectedVendorBankAccId)[0];

    this.PurchaseOrderHOutput = 
    {
      PurchaseOrderHId: this.PurchaseOrderHObj.PurchaseOrderHId,
      BankCode: selectedVendorBankAcc.BankCode,
      BankBranch: selectedVendorBankAcc.BankBranch,
      BankAccountNo: selectedVendorBankAcc.BankAccountNo,
      BankAccountName: selectedVendorBankAcc.BankAccountName,
      VendorBankAccId: selectedVendorBankAccId
    };
  }

  SaveData(){
    this.SaveBankInfo();
    this.outputPage.emit({ PurchaseOrderHOutput: this.PurchaseOrderHOutput,  pageType: "submitPoData"});
  }

}
