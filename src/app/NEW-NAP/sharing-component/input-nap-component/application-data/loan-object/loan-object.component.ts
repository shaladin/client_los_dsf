import { Component, OnInit, Input } from '@angular/core';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { InputGridObj } from 'app/shared/model/InputGridObj.Model';
import { FormBuilder, NgForm } from '@angular/forms';
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
  @Input() AppId: number;
  @Input() mode: string;
  modal: any;
  loanObjectInputLookupObj: any;
  AppLoanPurposeId: number;
  supplierInputLookupObj: any;
  title: string = "Add Loan Object";
  objEdit: any;

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

  async editLoanObject(id, content) {
    this.mode = "edit";
    this.AppLoanPurposeId = id;
    this.title = "Edit Loan Object";
    
    var obj = {
      AppLoanPurposeId: this.AppLoanPurposeId
    };

    await this.http.post(AdInsConstant.GetAppLoanPurposeByAppLoanPurposeId, obj).toPromise().then(response => {
      this.objEdit = response;
      this.MainInfoForm.patchValue({
        IsDisburseToCust: response["IsDisburseToCust"],
        BudgetPlanAmount: response["BudgetPlanAmt"],
        SelfFinancing: response["SelfFinancingAmt"],
        FinancingAmount: response["FinancingAmt"],
        MrLoanPurposeCode: response["MrLoanPurposeCode"],
        SupplierCode: response["SupplCode"],
        SupplierName: response["SupplName"]
      });
      this.setLookup();
    })

    this.modal = this.modalService.open(content);
    this.modal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modal.close();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modal.close();
    });
  }

  open(content) {
    this.setLookup();
    this.MainInfoForm.patchValue({
      IsDisburseToCust: "",
      BudgetPlanAmount: "",
      SelfFinancing: "",
      FinancingAmount: "",
      MrLoanPurposeCode: "",
      SupplierCode: "",
    });


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
    this.setLookup();
  }

  setLookup() {
    this.loanObjectInputLookupObj = new InputLookupObj();
    this.loanObjectInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.loanObjectInputLookupObj.urlEnviPaging = environment.losUrl;
    this.loanObjectInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.isRequired = false;

    this.supplierInputLookupObj = new InputLookupObj();
    this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.supplierInputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.supplierInputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
    this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

    if (this.objEdit != null) {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: this.objEdit.MrLoanPurposeDescr };
      this.supplierInputLookupObj.jsonSelect = {VendorName: this.objEdit.SupplName};
    } else {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: "" };
      this.supplierInputLookupObj.jsonSelect = { VendorName: "" };
    }
  }

  getSupplierInputLookupValue(event) {
    this.MainInfoForm.patchValue({
      SupplierCode: event.VendorCode
    });
  }

  getLoanInputLookupValue(event) {
    this.MainInfoForm.patchValue({
      MrLoanPurposeCode: event.MasterCode
    })
  }

  SaveForm(enjiForm:NgForm) {
    this.AppLoanPurposeObj = new AppLoanPurposeObj();
    this.AppLoanPurposeObj.AppLoanPurposeId = this.objEdit.AppLoanPurposeId;
    this.AppLoanPurposeObj.AppId = this.AppId;
    this.AppLoanPurposeObj.MrLoanPurposeCode = this.MainInfoForm.controls.MrLoanPurposeCode.value;
    this.AppLoanPurposeObj.IsDisburseToCust = this.MainInfoForm.controls.IsDisburseToCust.value;
    this.AppLoanPurposeObj.SupplCode = this.MainInfoForm.controls.SupplierCode.value;
    this.AppLoanPurposeObj.BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
    this.AppLoanPurposeObj.SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;
    this.AppLoanPurposeObj.FinancingAmt = this.MainInfoForm.controls.FinancingAmount.value;

    if (this.mode == "edit") {
      this.AppLoanPurposeObj.RowVersion = this.objEdit.RowVersion;
      this.http.post(AdInsConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.loadDataTable();
          this.modal.close();
          this.toastr.successMessage(response["message"]);
          this.router.navigate(['/Nap/ApplicationDataRefinancing'], { queryParams: { "AppId": this.AppId } });
          enjiForm.reset();
        },
        (error) => {
          console.log(error);
        });
    }
    else {
      this.http.post(AdInsConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.modal.close();
          this.toastr.successMessage(response["message"]);
          this.router.navigate(['/Nap/ApplicationDataRefinancing'], { queryParams: { "AppId": this.AppId } });
          enjiForm.reset();
        },
        (error) => {
          console.log(error);
        });
    }
    this.loadDataTable();
  }

  deleteLoanObject(AppLoanPurposeId) {
    if (confirm("Are you sure to delete this record?")) {
      var obj = {
        AppLoanPurposeId: AppLoanPurposeId
      };

      this.http.post(AdInsConstant.DeleteAppLoanPurpose, obj).subscribe(response => {
        this.toastr.successMessage(response["Message"]);
        this.loadDataTable();
      },
        error => {
          console.log(error);
        });
    }
  }
  
  loadDataTable() {
    var obj = {
      AppId: this.AppId
    }
    this.http.post(AdInsConstant.GetListAppLoanPurposeByAppId, obj).subscribe(
      (response) => {
        this.resultData = response["listResponseAppLoanPurpose"];
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
