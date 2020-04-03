import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';

@Component({
  selector: 'app-form-add-dynamic',
  templateUrl: './form-add-dynamic.component.html',
  styleUrls: ['./form-add-dynamic.component.scss'],
  providers: [NGXToastrService]
})
export class FormAddDynamicComponent implements OnInit {

  @Output('update') DataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() FormInputObj;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NGXToastrService
  ) { }

  FormObj = this.fb.group({
    arr: this.fb.array([])
  });

  arr;
  DDLContentName = new Array();
  DDLBankAccount = new Array();
  ngOnInit() {
    this.arr = this.FormObj.get('arr') as FormArray;
    // console.log(this.FormInputObj);
    this.GetDDLContentName();
  }

  lenDDLContentName = 0;
  tempDDLContentName;
  GetDDLContentName(){
    this.DDLContentName = this.FormInputObj["contentObj"];
    console.log(this.DDLContentName);
    this.tempDDLContentName = new Array();
    this.lenDDLContentName = this.DDLContentName.length;
  }

  GetDDLBankAccount(code){
    var content = this.FormInputObj["content"];
    var url;
    var obj;
    if(content == "Supplier"){
      url = environment.FoundationR3Url + AdInsConstant.GetListVendorBankAccByVendorCode;
      obj = {
        VendorCode: code,
        RowVersion: ""
      };

    }else if(content == "Supplier Employee"){
      url = environment.FoundationR3Url + AdInsConstant.GetListVendorBankByVendorEmpNo;
      obj = {
        VendorEmpNo: code,
        RowVersion: ""
      }
    }else if(content == "Referantor"){
      
    }
  }

  AddNewDataForm(){
    var NewDataForm = this.fb.group({
      ContentName: [''],
      ContentNameValue: [''],
      BankAccount: [''],
      TaxAmount: [0, Validators.pattern("^[0-9]+$")],
      TotalCommisionAmount: [0, Validators.pattern("^[0-9]+$")],
      VATAmount: [0, Validators.pattern("^[0-9]+$")],
      AllocateFromUppingRate: [0, Validators.pattern("^[0-9]+$")],
      AllocateFromFeeOrUppingFee: [0, Validators.pattern("^[0-9]+$")],
      AllocateFromInsuranceIncome: [0, Validators.pattern("^[0-9]+$")],
      AllocateFromLifeInsuranceIncome: [0, Validators.pattern("^[0-9]+$")],
      AllocateFromOther: [0, Validators.pattern("^[0-9]+$")]
    }) as FormGroup;
    this.arr.push(NewDataForm);
    console.log(this.FormObj);
    this.lenDDLContentName--;
  }

  DeleteDataForm(idx){
    // console.log(idx);
    if (confirm('Are you sure to delete this record?')) {
      var tempContentName = this.FormObj.controls.arr["controls"][idx].controls.ContentName.value;
      if(tempContentName != ""){
        var obj = this.tempDDLContentName.find(x => x.Key == tempContentName);
        var i = this.tempDDLContentName.indexOf(this.tempDDLContentName.find(x => x.Key == tempContentName));
        this.tempDDLContentName.splice(i,1);
        console.log(obj);
        this.DDLContentName.push(obj);
        console.log(this.DDLContentName);
      }
      this.lenDDLContentName++;
      this.arr.removeAt(idx);
      this.PassData();

    }
  }

  CheckData(){
    console.log(this.FormObj);
  }

  PassData(){
    // console.log("change data");
    this.DataEmit.emit(this.FormObj);
  }
  
  ChooseContentName(ev){
    console.log(ev);
    var idx = ev.target.selectedIndex - 1;
    this.FormObj.controls.arr["controls"][idx].patchValue({
      ContentName: ev.target.selectedOptions[0].value,
      ContentNameValue: ev.target.selectedOptions[0].text
    });
    var obj = {
      Key: ev.target.selectedOptions[0].value,
      Value: ev.target.selectedOptions[0].text
    };
    this.tempDDLContentName.push(obj);
    this.DDLContentName.splice(idx,1);
    this.GetDDLBankAccount(this.FormObj.controls.arr["controls"][idx].controls.ContentName.value);
    this.PassData();
  }

  ChangeDataLabel(idx){
    console.log(idx);
    var tempUppRate: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromUppingRate.value;
    var tempInsuranceIncome: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromInsuranceIncome.value;
    var tempLifeInsuranceIncome: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromLifeInsuranceIncome.value;
    var tempOther: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromOther.value;
    var tempFeeOrUppFee: number = +this.FormObj.controls.arr["controls"][idx].controls.AllocateFromFeeOrUppingFee.value;
    var tempTotal = tempFeeOrUppFee + tempUppRate + tempInsuranceIncome + tempLifeInsuranceIncome + tempOther;
    
    this.FormObj.controls.arr["controls"][idx].patchValue({
      TotalCommisionAmount: tempTotal
    });
    this.PassData();
  }
}
