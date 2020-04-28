import { Component, OnInit, Input } from '@angular/core';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppLoanPurposeObj } from 'app/shared/model/AppLoanPurpose.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loan-object',
  templateUrl: './loan-object.component.html',
  styleUrls: ['./loan-object.component.scss']
})
export class LoanObjectComponent implements OnInit {

  @Input() AppId: any;
  @Input() mode : any;
  modal : any;
  loanObjectInputLookupObj: any;
  AppLoanPurposeId: any;
  supplierInputLookupObj: any;

  MainInfoForm = this.fb.group({
    IsDisburseToCust: [false],
    BudgetPlanAmount: [''],
    SelfFinancing: [''],
    FinancingAmount: [''],
    MrLoanPurposeCode: [''],
    SupplierCode: ['']

  })
  AppLoanPurposeObj: AppLoanPurposeObj;
  resultData: any;
  title: string;
  result: any;
  closeResult: string;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: NGXToastrService, private modalService: NgbModal) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params["AppId"];
      this.mode = params["mode"];
    });
    if (this.mode == "edit") {
      this.route.queryParams.subscribe(params => {
        this.AppLoanPurposeId = params["AppLoanPurposeid"];
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  editLoanObject(id){
    this.AppLoanPurposeId = id; 
    this.mode = "edit";
  }

  open(content){
    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modal.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modal.close();
    });
  }

  ngOnInit() {
    this.loadDataTable();
    this.loanObjectInputLookupObj = new InputLookupObj();
    this.loanObjectInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.loanObjectInputLookupObj.urlEnviPaging = environment.losUrl;
    this.loanObjectInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.isRequired = false;
    this.loanObjectInputLookupObj.addCritInput = new Array();

    var critMasterObj = new CriteriaObj();
    critMasterObj.propName = 'REF_MASTER_TYPE_CODE';
    critMasterObj.restriction = AdInsConstant.RestrictionEq;
    critMasterObj.value = "LOAN_PURPOSE";
    this.loanObjectInputLookupObj.addCritInput.push(critMasterObj);

    this.supplierInputLookupObj = new InputLookupObj();
    this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.supplierInputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.supplierInputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

    if (this.mode == "edit") {
      this.title = "Edit Loan Object";
      var appLoanPurposeObj = new AppLoanPurposeObj();
      appLoanPurposeObj.AppLoanPurposeId = this.AppLoanPurposeId;

      this.http.post(AdInsConstant.GetAppLoanPurposeByAppLoanPurposeId, appLoanPurposeObj).subscribe(
        (response) => {
          this.result = response;
          this.MainInfoForm.patchValue({
            IsDisburseToCust: this.result.IsDisburseToCust,
            BudgetPlanAmount: this.result.BankName,
            SelfFinancing: this.result.RegRptCode,
            FinancingAmount: this.result.FinancingAmount
          })
          this.supplierInputLookupObj.jsonSelect = { VendorCode: this.result.SupplCode };
          this.loanObjectInputLookupObj.jsonSelect = { MasterCode: this.result.MrLoanPurposeCode };
        },
        (error) => {
          console.log(error);
        }
      );
    }

  }

  getSupplierInputLookupValue(event) {
    this.MainInfoForm.patchValue({
      SupplierCode: event.VendorCode
    });
  }

  getLoanInputLookupValue(event) {
    this.MainInfoForm.patchValue({
      MrLoanPurposeCode: event.MrLoanPurposeCode
    })
  }

  SaveForm() {
    if (this.mode == "edit") {
      this.AppLoanPurposeObj = new AppLoanPurposeObj();
      this.AppLoanPurposeObj.AppId = this.AppId;
      this.AppLoanPurposeObj.BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
      this.AppLoanPurposeObj.FinancingAmt = this.MainInfoForm.controls.FinancingAmount.value;
      this.AppLoanPurposeObj.IsDisburseToCust = this.MainInfoForm.controls.IsDisburseToCust.value;
      this.AppLoanPurposeObj.SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;
      // this.AppLoanPurposeObj.MrLoanPurposeCode = this.MainInfoForm.controls.MrLoanPurposeCode.value;
      this.AppLoanPurposeObj.MrLoanPurposeCode = "testing";

      this.AppLoanPurposeObj.SupplCode = this.MainInfoForm.controls.SupplierCode.value;
      this.AppLoanPurposeObj.RowVersion
      this.http.post(AdInsConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(['/Nap/LoanObject'], { queryParams: { "AppId": this.AppId } });
        },
        (error) => {
          console.log(error);
        });
    }
    else {
      this.AppLoanPurposeObj = new AppLoanPurposeObj();
      this.AppLoanPurposeObj.AppId = this.AppId;
      this.AppLoanPurposeObj.BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
      this.AppLoanPurposeObj.IsDisburseToCust = this.MainInfoForm.controls.IsDisburseToCust.value;
      this.AppLoanPurposeObj.FinancingAmt = this.MainInfoForm.controls.FinancingAmount.value;
      this.AppLoanPurposeObj.MrLoanPurposeCode = this.MainInfoForm.controls.MrLoanPurposeCode.value;
      this.AppLoanPurposeObj.SupplCode = this.MainInfoForm.controls.SupplierCode.value;

      this.http.post(AdInsConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          this.router.navigate(['/Nap/ApplicationDataRefinancing'], { queryParams: { "AppId": this.AppId } });
        },
        (error) => {
          console.log(error);
        });
    }
  }

  loadDataTable() {
    this.AppLoanPurposeObj = new AppLoanPurposeObj();
    this.AppLoanPurposeObj.AppId = this.AppId;

    console.log(this.AppLoanPurposeObj);
    this.http.post(AdInsConstant.GetListAppLoanPurposeByAppId, this.AppLoanPurposeObj).subscribe(
      (response) => {
        console.log("ResponseLoadDataTable")
        console.log(response);
        this.resultData = response["listResponseAppLoanPurpose"];
        console.log(this.resultData)
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
