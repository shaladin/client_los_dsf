import { Component, OnInit, Input } from '@angular/core';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { environment } from 'environments/environment';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { AppLoanPurposeObj } from 'app/shared/model/AppLoanPurpose.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { ExceptionConstant } from 'app/shared/constant/ExceptionConstant';

@Component({
  selector: 'app-loan-object',
  templateUrl: './loan-object.component.html'
})
export class LoanObjectComponent implements OnInit {
  @Input() AppId: number;
  @Input() mode: string;
  @Input() isCollateral: boolean;

  modal: any;
  loanObjectInputLookupObj: any;
  AppLoanPurposeId: number;
  supplierInputLookupObj: any;
  title: string = "Add Loan Object";
  objEdit: any;
  AppLoanPurposeObj: AppLoanPurposeObj = new AppLoanPurposeObj();
  IsDisburseToCust: boolean;
  AppObj: any;
  OfficeCode: string;
  RefProdCmptSupplSchm: any;
  isCFNA : boolean = false;

  MainInfoForm = this.fb.group({
    IsDisburseToCust: [false],
    BudgetPlanAmount: ['', [Validators.required, Validators.min(1)]],
    SelfFinancing: ['', [Validators.required, Validators.min(-1)]],
    FinancingAmount: ['']
  })
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
    this.MainInfoForm.controls.FinancingAmount.disable();

    var obj = {
      AppLoanPurposeId: this.AppLoanPurposeId
    };

    await this.http.post(URLConstant.GetAppLoanPurposeByAppLoanPurposeId, obj).toPromise().then(response => {
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
      this.AppLoanPurposeObj.MrLoanPurposeCode = this.objEdit.MrLoanPurposeCode;
      this.AppLoanPurposeObj.SupplCode = this.objEdit.SupplCode;
      this.GetAppData();
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
    this.mode = "add";
    this.objEdit = undefined;
    this.GetAppData();
    this.setLookup();
    this.MainInfoForm.patchValue({
      IsDisburseToCust: "",
      BudgetPlanAmount: 0,
      SelfFinancing: 0,
      FinancingAmount: 0,
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
    this.GetAppData();
    this.setLookup();
    this.MainInfoForm.controls.FinancingAmount.disable();
  }

  CalculateFinancingAmt() {
    var BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
    var SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;

    if (SelfFinancingAmt > BudgetPlanAmt) {
      this.toastr.warningMessage("Self Financing Amount Must Be Lower Than Budget Plan Amount!");
      return;
    }

    var FinancingAmt = BudgetPlanAmt - SelfFinancingAmt;
    this.MainInfoForm.patchValue({
      FinancingAmount: FinancingAmt
    })
  }

  async GetAppData() {
    await this.http.post(URLConstant.GetAppById, { AppId: this.AppId }).toPromise().then(
      (response) => {
        this.AppObj = response;
        this.OfficeCode = this.AppObj.OriOfficeCode;
        if(this.AppObj.LobCode == CommonConstant.CFNA){
          this.isCFNA = true;
        }
        if(this.AppObj.BizTemplateCode == CommonConstant.CFRFN4W){
          this.MainInfoForm.controls.IsDisburseToCust.setValue(true);
          this.MainInfoForm.controls.IsDisburseToCust.disable();
          this.AppLoanPurposeObj.IsDisburseToCust = true;
          this.CheckIsDisburseToCust();
        }
      }
    );

    var appObj = {
      ProdOfferingCode: this.AppObj.ProdOfferingCode,
      RefProdCompntCode: CommonConstant.RefProdCompntSupplSchm,
      ProdOfferingVersion: this.AppObj.ProdOfferingVersion,
    };
    await this.http.post(URLConstant.GetProdOfferingDByProdOfferingCodeAndRefProdCompntCode, appObj).toPromise().then(
      (response) => {
        this.RefProdCmptSupplSchm = response;
      }
    );
  }

  setLookup() {
    this.loanObjectInputLookupObj = new InputLookupObj();
    this.loanObjectInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.loanObjectInputLookupObj.urlEnviPaging = environment.losUrl;
    this.loanObjectInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupLoanObject.json";
    this.loanObjectInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupLoanObject.json";

    this.supplierInputLookupObj = new InputLookupObj();
    this.supplierInputLookupObj.urlQryPaging = URLConstant.GetPagingObjectBySQL;
    this.supplierInputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.supplierInputLookupObj.addCritInput = new Array();
    
    if (this.isCollateral) {
      this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
      this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
      this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplierRefinancingLoanObj.json";
    } else {
      this.supplierInputLookupObj.urlJson = "./assets/uclookup/NAP/lookupSupplier.json";
      this.supplierInputLookupObj.pagingJson = "./assets/uclookup/NAP/lookupSupplier.json";
      this.supplierInputLookupObj.genericJson = "./assets/uclookup/NAP/lookupSupplier.json";

      var critSuppSupplSchmObj = new CriteriaObj();
      critSuppSupplSchmObj.DataType = 'text';
      critSuppSupplSchmObj.restriction = AdInsConstant.RestrictionEq;
      critSuppSupplSchmObj.propName = 'VS.VENDOR_SCHM_CODE';
      critSuppSupplSchmObj.value = this.RefProdCmptSupplSchm.CompntValue;
      this.supplierInputLookupObj.addCritInput.push(critSuppSupplSchmObj);
    }

    var critSuppObj = new CriteriaObj();
    critSuppObj.DataType = 'text';
    critSuppObj.restriction = AdInsConstant.RestrictionEq;
    critSuppObj.propName = 'RO.OFFICE_CODE';
    critSuppObj.value = this.OfficeCode;
    this.supplierInputLookupObj.addCritInput.push(critSuppObj);

    if (this.objEdit != null) {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: this.objEdit.MrLoanPurposeDescr };
      this.supplierInputLookupObj.jsonSelect = { VendorName: this.objEdit.SupplName };
    } else {
      this.loanObjectInputLookupObj.jsonSelect = { Descr: "" };
      this.supplierInputLookupObj.jsonSelect = { VendorName: "" };
    }
  }

  getSupplierInputLookupValue(event) {
    this.AppLoanPurposeObj.SupplCode = event.VendorCode;
  }

  getLoanInputLookupValue(event) {
    this.AppLoanPurposeObj.MrLoanPurposeCode = event.MasterCode;
  }

  SaveForm(enjiForm: NgForm) {
    this.AppLoanPurposeObj.AppId = this.AppId;
    if (this.MainInfoForm.controls.IsDisburseToCust.value == true) {
      this.AppLoanPurposeObj.IsDisburseToCust = true;
    } else {
      this.AppLoanPurposeObj.IsDisburseToCust = false;
    }
    this.AppLoanPurposeObj.BudgetPlanAmt = this.MainInfoForm.controls.BudgetPlanAmount.value;
    this.AppLoanPurposeObj.SelfFinancingAmt = this.MainInfoForm.controls.SelfFinancing.value;
    this.AppLoanPurposeObj.FinancingAmt = this.MainInfoForm.controls.FinancingAmount.value;

    if (this.mode == "edit") {
      this.AppLoanPurposeObj.AppLoanPurposeId = this.objEdit.AppLoanPurposeId;
      this.AppLoanPurposeObj.RowVersion = this.objEdit.RowVersion;
      if(this.isCFNA){
      this.http.post(URLConstant.CheckFinAmtAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.http.post(URLConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
            (response) => {
              this.modal.close();
              this.toastr.successMessage(response["message"]);
              enjiForm.reset();
              this.loadDataTable();
            });
        },
        (error) => {
          return;
        });
      }else{
        this.http.post(URLConstant.EditAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          (response) => {
            this.modal.close();
            this.toastr.successMessage(response["message"]);
            enjiForm.reset();
            this.loadDataTable();
          });
      }
    }
    else {
      if(this.isCFNA){
      this.http.post(URLConstant.CheckFinAmtAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
        (response) => {
          this.http.post(URLConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
            (response) => {
              this.modal.close();
              this.toastr.successMessage(response["message"]);
              enjiForm.reset();
              this.loadDataTable();
            });
        },
        (error) => {
          return;
        });
      }else{
        this.http.post(URLConstant.AddAppLoanPurpose, this.AppLoanPurposeObj).subscribe(
          (response) => {
            this.modal.close();
            this.toastr.successMessage(response["message"]);
            enjiForm.reset();
            this.loadDataTable();
          });
      }
    }
  }

  deleteLoanObject(AppLoanPurposeId) {
    if (confirm(ExceptionConstant.DELETE_CONFIRMATION)) {
      var obj = {
        AppLoanPurposeId: AppLoanPurposeId
      };

      this.http.post(URLConstant.DeleteAppLoanPurpose, obj).subscribe(response => {
        this.toastr.successMessage(response["Message"]);
        this.loadDataTable();
      });
    }
  }

  loadDataTable() {
    var obj = {
      AppId: this.AppId
    }
    this.http.post(URLConstant.GetListAppLoanPurposeByAppId, obj).subscribe(
      (response) => {
        this.resultData = response["listResponseAppLoanPurpose"];
      });
  }

  CheckIsDisburseToCust() {
    if (this.MainInfoForm.controls.IsDisburseToCust.value == true) {
      this.supplierInputLookupObj.isRequired = false;
      this.MainInfoForm.controls.lookupValueSupplier["controls"].value.clearValidators();
    } else {
      this.supplierInputLookupObj.isRequired = true;
      this.MainInfoForm.controls.lookupValueSupplier.setValidators(Validators.required)
    }
    this.MainInfoForm.controls.lookupValueSupplier.updateValueAndValidity();
  }
}
