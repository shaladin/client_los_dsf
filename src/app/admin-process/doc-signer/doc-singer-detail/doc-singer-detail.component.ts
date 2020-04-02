import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-doc-singer-detail',
  templateUrl: './doc-singer-detail.component.html',
  styleUrls: ['./doc-singer-detail.component.scss']
})
export class DocSingerDetailComponent implements OnInit {
  viewObj: string;
  AppId: number;
  inputLookupBranchEmpObj: any;
  inputLookupOfficeEmp1Obj: any;
  inputLookupOfficeEmp2Obj: any;
  inputLookupCustCoyShareHolderObj: any;
  inputLookupCustCoyShareHolder2Obj: any;
  inputLookupCustCoyShareHolder3Obj: any;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private route: ActivatedRoute, private router: Router, private toastr: NGXToastrService) {
    this.route.queryParams.subscribe(params => {
      this.AppId = params['AppId'];
    });
  }

  DocSignerForm = this.fb.group({

  });

  ngOnInit() {
    this.viewObj = "./assets/ucviewgeneric/viewDocSigner.json";

    this.inputLookupBranchEmpObj = new InputLookupObj();
    this.inputLookupBranchEmpObj.urlJson = "./assets/uclookup/vendor/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupBranchEmpObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupBranchEmpObj.pagingJson = "./assets/uclookup/vendor/lookupBranchEmp.json";
    this.inputLookupBranchEmpObj.genericJson = "./assets/uclookup/vendor/lookupBranchEmp.json";

    this.inputLookupOfficeEmp1Obj = new InputLookupObj();
    this.inputLookupOfficeEmp1Obj.urlJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupOfficeEmp1Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp1Obj.pagingJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp1Obj.genericJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";

    this.inputLookupOfficeEmp2Obj = new InputLookupObj();
    this.inputLookupOfficeEmp2Obj.urlJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupOfficeEmp2Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupOfficeEmp2Obj.pagingJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";
    this.inputLookupOfficeEmp2Obj.genericJson = "./assets/uclookup/vendor/lookupOfficeEmp.json";

    this.inputLookupCustCoyShareHolderObj = new InputLookupObj();
    this.inputLookupCustCoyShareHolderObj.urlJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolderObj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolderObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCustCoyShareHolderObj.pagingJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolderObj.genericJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";

    this.inputLookupCustCoyShareHolder2Obj = new InputLookupObj();
    this.inputLookupCustCoyShareHolder2Obj.urlJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder2Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolder2Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCustCoyShareHolder2Obj.pagingJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder2Obj.genericJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";

    this.inputLookupCustCoyShareHolder3Obj = new InputLookupObj();
    this.inputLookupCustCoyShareHolder3Obj.urlJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder3Obj.urlQryPaging = AdInsConstant.GetPagingObjectBySQL;
    this.inputLookupCustCoyShareHolder3Obj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupCustCoyShareHolder3Obj.pagingJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
    this.inputLookupCustCoyShareHolder3Obj.genericJson = "./assets/uclookup/vendor/CustCoyShareHolder.json";
  }

}
