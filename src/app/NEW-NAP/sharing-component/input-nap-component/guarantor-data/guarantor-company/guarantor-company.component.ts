import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { UcLookupObj } from 'app/shared/model/UcLookupObj.Model';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { AddrObj } from 'app/shared/model/AddrObj.Model';
import { AppGuarantorCompanyObj } from 'app/shared/model/AppGuarantorCompanyObj.Model';
import { GuarantorCompanyObj } from 'app/shared/model/GuarantorCompanyObj.Model';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { environment } from 'environments/environment';
import { formatDate } from '@angular/common';
import { AppCustCompanyLegalDocObj } from 'app/shared/model/AppCustCompanyLegalDocObj.Model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guarantor-company',
  templateUrl: './guarantor-company.component.html',
  styleUrls: [],
  providers: [NGXToastrService]
})

export class GuarantorCompanyComponent implements OnInit {

  @Input() AppGuarantorId : any;
  @Input() mode : any;
  @Input() AppId: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  param:any;
  key: any;
  criteria: CriteriaObj[] = [];
  resultData : any;
  inputLookupObj: any;
  MrCompanyTypeCode:any;
  MrCustRelationshipCode:any;
  inputLookupObj1 : any;
  MrJobPositionCode: any;
  inputFieldObj: InputFieldObj;
  AddrObj: AddrObj;
  appGuarantorCompanyObj : AppGuarantorCompanyObj;
  guarantorCompanyObj : GuarantorCompanyObj ;
  AppGuarantorCompanyId : any;
  companyLegalDocObj : Array<AppCustCompanyLegalDocObj>;
  DocObjs : any;
  
  CompanyForm = this.fb.group({
    GuarantorName:['', [Validators.required, Validators.maxLength(500)]],
    MrCustRelationshipCode: ['', [Validators.required, Validators.maxLength(50)]],
    MrCompanyTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    TaxIdNo: ['', [Validators.maxLength(50)]],
    IndustryTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
    ContactName: ['', [Validators.required, Validators.maxLength(500)]],
    MrJobPositionCode: ['', [Validators.required, Validators.maxLength(50)]],
    ContactEmail: ['', [Validators.required, Validators.maxLength(50)]],
    MobilePhnNo1: ['', [Validators.required, Validators.maxLength(50)]],
    MobilePhnNo2: ['', [Validators.maxLength(50)]],
    FaxArea: ['', [Validators.maxLength(5)]],
    Fax: ['', [Validators.maxLength(20)]],
    PhnArea1: ['', [Validators.required, Validators.maxLength(5)]],
    Phn1: ['', [Validators.required, Validators.maxLength(20)]],
    PhnExt1: ['', [Validators.maxLength(10)]],
    PhnArea2: ['', [ Validators.maxLength(5)]],
    Phn2: ['', [ Validators.maxLength(20)]],
    PhnExt2: ['', [ Validators.maxLength(10)]],
    Addr: [''],
    AreaCode1: [''],
    AreaCode2: [''],
    AreaCode3: [''],
    AreaCode4: [''],
    City: [''],
    Zipcode: [''],
    Subzipcode:[''],
    LegalDocForm: this.fb.array([])
  });

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,private fb:FormBuilder, private toastr: NGXToastrService, private modalService: NgbModal) { 
  }

  ngOnInit() {
    console.log("company");
    this.initLookup();
    this.initAddr();

    if (this.mode == "edit") {
      var guarantorCompanyObj = new GuarantorCompanyObj();
      guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.http.post(AdInsConstant.GetAppGuarantorCompanyByAppGuarantorId, guarantorCompanyObj).subscribe(
        (response) => {
          console.log("response: ");
          console.log(response);
          this.resultData=response;
          this.AppGuarantorCompanyId = this.resultData.appGuarantorCompanyObj.AppGuarantorCompanyId;
          this.inputLookupObj.jsonSelect = {CustName: this.resultData.appGuarantorObj.GuarantorName};
          this.inputLookupObj1.jsonSelect = {IndustryTypeName: this.resultData.appGuarantorCompanyObj.IndustryTypeCode};
          this.CompanyForm.patchValue({
            MrCustRelationshipCode : this.resultData.appGuarantorObj.MrCustRelationshipCode,
            TaxIdNo : this.resultData.appGuarantorObj.TaxIdNo,
            MrCompanyTypeCode : this.resultData.appGuarantorCompanyObj.MrCompanyTypeCode,
            IndustryTypeCode : this.resultData.appGuarantorCompanyObj.IndustryTypeCode,
            ContactName : this.resultData.appGuarantorCompanyObj.ContactName,
            MrJobPositionCode : this.resultData.appGuarantorCompanyObj.MrJobPositionCode,
            MobilePhnNo1 : this.resultData.appGuarantorCompanyObj.MobilePhnNo1,
            ContactEmail : this.resultData.appGuarantorCompanyObj.ContactEmail,
            MobilePhnNo2 : this.resultData.appGuarantorCompanyObj.MobilePhnNo2,
            FaxArea : this.resultData.appGuarantorCompanyObj.FaxArea,
            Fax : this.resultData.appGuarantorObj.Fax,
            PhnArea1 : this.resultData.appGuarantorCompanyObj.PhnArea1,
            Phn1 : this.resultData.appGuarantorCompanyObj.Phn1,
            PhnExt1 : this.resultData.appGuarantorCompanyObj.PhnExt1,
            PhnArea2 : this.resultData.appGuarantorCompanyObj.PhnArea2,
            Phn2 : this.resultData.appGuarantorObj.Phn2,
            PhnExt2 : this.resultData.appGuarantorCompanyObj.PhnExt2
          })
          this.setAddrLegalObj();
          this.companyLegalDocObj = this.resultData.appGuarantorCompanyObj.ListAppGuarantorCompanyLegalDoc;
          console.log(this.companyLegalDocObj);
          this.bindLegalDoc();
        },
        (error) => {
          console.log(error);
        }
      );
    }else{
      this.ClearForm();
    }


    var refCompObj ={
      RefMasterTypeCode:"COMPANY_TYPE",
      RowVersion:""
    }
    var refCustRelObj ={
      RefMasterTypeCode:"CUST_COMPANY_RELATIONSHIP",
      RowVersion:""
    }
    var refJobObj ={
      RefMasterTypeCode:"JOB_POSITION",
      RowVersion:""
    }
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCompObj).subscribe(
      (response) => {
          this.MrCompanyTypeCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrCompanyTypeCode: this.MrCompanyTypeCode[0].MasterCode
          });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refCustRelObj).subscribe(
      (response) => {
          this.MrCustRelationshipCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrCustRelationshipCode: this.MrCustRelationshipCode[0].MasterCode
          });
      }
    );
    this.http.post(AdInsConstant.GetListActiveRefMaster, refJobObj).subscribe(
      (response) => {
          this.MrJobPositionCode = response["ReturnObject"];
          this.CompanyForm.patchValue({
            MrJobPositionCode: this.MrJobPositionCode[0].MasterCode
          });
      }
    );

    this.CompanyForm.removeControl("LegalDocForm");
    this.CompanyForm.addControl("LegalDocForm", this.fb.array([]));

  }

  initLookup(){
    this.inputLookupObj = new InputLookupObj();
    this.inputLookupObj.urlJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj.pagingJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.genericJson = "./assets/uclookup/lookupGuarantorCompany.json";
    this.inputLookupObj.isReadonly =false;

    this.inputLookupObj1 = new InputLookupObj();
    this.inputLookupObj1.urlJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.urlEnviPaging = environment.FoundationR3Url;
    this.inputLookupObj1.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.inputLookupObj1.pagingJson = "./assets/uclookup/lookupIndustryType.json";
    this.inputLookupObj1.genericJson = "./assets/uclookup/lookupIndustryType.json";

  }

  initAddr(){

    this.inputFieldObj = new InputFieldObj();
    this.inputFieldObj.inputLookupObj = new InputLookupObj();

  }

  // GuarantorName="";
  lookupGuarantor(event){
    console.log(event);
    this.inputLookupObj.isReadonly = true;
    this.http.post(AdInsConstant.GetCustByCustId, { CustId: event.CustId }).subscribe(
      (response) => {
        console.log(response);
        this.resultData = response;
        this.CompanyForm.patchValue(
          {
            GuarantorName: event.CustName,
            TaxIdNo: this.resultData.TaxIdNo
          }
        );
        this.http.post(AdInsConstant.GetCustCompanyByCustId, { CustId: event.CustId }).subscribe(
          (response) => {
              console.log(response);
              this.resultData = response;
              this.CompanyForm.patchValue({
                MrCompanyTypeCode: this.resultData.MrCompanyTypeCode
              });
              this.http.post(AdInsConstant.GetRefIndustryTypeByRefIndustryTypeId, { RefIndustryTypeId: this.resultData.RefIndustryTypeId }).subscribe(
                (response) => {
                  this.inputLookupObj1.nameSelect = response["IndustryTypeName"];
                }
              );
              this.http.post(AdInsConstant.GetCustCompanyContactPersonByCustCompanyId, { CustCompanyId: this.resultData.CustCompanyId }).subscribe(
                (response) => {
                  this.resultData = response;
                  this.CompanyForm.patchValue({
                    ContactName: this.resultData.ContactPersonName,
                    MrJobPositionCode : this.resultData.MrJobPositionCode,
                    MobilePhnNo1 : this.resultData.MobilePhnNo1,
                    MobilePhnNo2 : this.resultData.MobilePhnNo2,
                    ContactEmail : this.resultData.Email1,
                    Phn1 : this.resultData.Phn1,
                    Phn2 : this.resultData.Phn2,
                    PhnArea1 : this.resultData.PhnArea1,
                    PhnArea2 : this.resultData.PhnArea2,
                    PhnExt1 : this.resultData.PhnExt1,
                    PhnExt2 : this.resultData.PhnExt2
                  });
                }
              );
          }
        );
        this.http.post(AdInsConstant.GetCustAddrByMrCustAddrType, { CustId: event.CustId, MrCustAddrTypeCode: "LEGAL" }).subscribe(
          (response) => {
            console.log(response);
            this.resultData = response;
            this.CompanyForm.patchValue({
              FaxArea: this.resultData.FaxArea,
              Fax : this.resultData.Fax
            });
            this.AddrObj = new AddrObj();
            this.AddrObj.Addr = this.resultData.Addr;
            this.AddrObj.AreaCode1 = this.resultData.AreaCode1;
            this.AddrObj.AreaCode2 = this.resultData.AreaCode2;
            this.AddrObj.AreaCode3 = this.resultData.AreaCode3;
            this.AddrObj.AreaCode4 = this.resultData.AreaCode4;
            this.AddrObj.City = this.resultData.City;
            this.AddrObj.Phn1 = this.resultData.Phn1;
            this.AddrObj.Phn2 = this.resultData.Phn2;
            this.AddrObj.PhnArea1 = this.resultData.PhnArea1;
            this.AddrObj.PhnArea2 = this.resultData.PhnArea2;
            this.AddrObj.PhnExt1 = this.resultData.PhnExt1;
            this.AddrObj.PhnExt2 = this.resultData.PhnExt2;
            this.AddrObj.Fax = this.resultData.Fax;
            this.AddrObj.FaxArea = this.resultData.FaxArea;
            this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.Zipcode;
            this.inputFieldObj.inputLookupObj.jsonSelect = { Zipcode: this.resultData.Zipcode };
          }
        );
      }
    );
    console.log(this.CompanyForm);
  }

  // IndustryTypeCode="";
  handleOutput1(event){
    console.log(event);
    this.CompanyForm.patchValue(
      {
        IndustryTypeCode: event.IndustryTypeCode
      }
    );
    console.log(this.CompanyForm);
  }
  
  setAddrLegalObj(){
      this.AddrObj = new AddrObj();
      this.AddrObj.Addr = this.resultData.appGuarantorCompanyObj.Addr;
      this.AddrObj.AreaCode1 = this.resultData.appGuarantorCompanyObj.AreaCode1;
      this.AddrObj.AreaCode2 = this.resultData.appGuarantorCompanyObj.AreaCode2;
      this.AddrObj.AreaCode3 = this.resultData.appGuarantorCompanyObj.AreaCode3;
      this.AddrObj.AreaCode4 = this.resultData.appGuarantorCompanyObj.AreaCode4;
      this.AddrObj.City = this.resultData.appGuarantorCompanyObj.City;

      this.inputFieldObj.inputLookupObj.nameSelect = this.resultData.appGuarantorCompanyObj.Zipcode;
      this.inputFieldObj.inputLookupObj.jsonSelect = {Zipcode: this.resultData.appGuarantorCompanyObj.Zipcode};
  }

  Add(){
    this.setAppGuarantor();
    this.setAppGuarantorCompany();
  }

  setAppGuarantor(){
    this.guarantorCompanyObj.AppGuarantorObj.GuarantorName = this.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorObj.MrGuarantorTypeCode = "COMPANY";
    this.guarantorCompanyObj.AppGuarantorObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorObj.MrCustRelationshipCode = this.CompanyForm.controls.MrCustRelationshipCode.value;
    this.guarantorCompanyObj.AppGuarantorObj.RowVersion = "";
    this.guarantorCompanyObj.AppGuarantorObj.AppId = this.AppId;
  }

  setAppGuarantorCompany(){
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrCompanyTypeCode = this.CompanyForm.controls.MrCompanyTypeCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.TaxIdNo = this.CompanyForm.controls.TaxIdNo.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.IndustryTypeCode = this.inputLookupObj1.nameSelect;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactName = this.CompanyForm.controls.ContactName.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MrJobPositionCode = this.CompanyForm.controls.MrJobPositionCode.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.ContactEmail = this.CompanyForm.controls.ContactEmail.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo1 = this.CompanyForm.controls.MobilePhnNo1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.MobilePhnNo2 = this.CompanyForm.controls.MobilePhnNo2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.FaxArea = this.CompanyForm.controls.FaxArea.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Fax = this.CompanyForm.controls.Fax.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea1 = this.CompanyForm.controls.PhnArea1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn1 = this.CompanyForm.controls.Phn1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt1 = this.CompanyForm.controls.PhnExt1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnArea2 = this.CompanyForm.controls.PhnArea2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Phn2 = this.CompanyForm.controls.Phn2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.PhnExt2 = this.CompanyForm.controls.PhnExt2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Addr = this.CompanyForm.controls["AddrObj"]["controls"].Addr.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode1 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode1.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode2 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode2.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode3 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode3.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.AreaCode4 = this.CompanyForm.controls["AddrObj"]["controls"].AreaCode4.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.City = this.CompanyForm.controls["AddrObj"]["controls"].City.value;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.Zipcode = this.inputFieldObj.inputLookupObj.nameSelect;
    this.guarantorCompanyObj.AppGuarantorCompanyObj.RowVersion = "";

    
    this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs = new Array<AppCustCompanyLegalDocObj>();
    for (let i = 0; i < this.CompanyForm.controls["LegalDocForm"].value.length; i++) {
      var legalDocObj = new AppCustCompanyLegalDocObj();
      legalDocObj.MrLegalDocTypeCode = this.CompanyForm.controls["LegalDocForm"].value[i].MrLegalDocTypeCode;
      legalDocObj.DocNo = this.CompanyForm.controls["LegalDocForm"].value[i].DocNo;
      legalDocObj.DocDt = this.CompanyForm.controls["LegalDocForm"].value[i].DocDt;
      legalDocObj.DocExpiredDt = this.CompanyForm.controls["LegalDocForm"].value[i].DocExpiredDt;
      legalDocObj.DocNotes = this.CompanyForm.controls["LegalDocForm"].value[i].DocNotes;
      legalDocObj.ReleaseBy = this.CompanyForm.controls["LegalDocForm"].value[i].ReleaseBy;
      legalDocObj.ReleaseLocation = this.CompanyForm.controls["LegalDocForm"].value[i].ReleaseLocation;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.LegalDocObjs.push(legalDocObj);
    }
  }

  SaveForm(){
    console.log(this.CompanyForm);
    this.guarantorCompanyObj = new GuarantorCompanyObj();
    this.Add();
    if (this.mode == "edit") {
      this.guarantorCompanyObj.RowVersion = this.resultData.RowVersion;
      this.guarantorCompanyObj.AppGuarantorObj.AppGuarantorId = this.AppGuarantorId;
      this.guarantorCompanyObj.AppGuarantorCompanyObj.AppGuarantorCompanyId = this.AppGuarantorCompanyId;
      this.http.post(AdInsConstant.EditAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
        response => {
          this.toastr.successMessage(response["message"]);
          this.close.emit(1);
        },
        error => {
          console.log(error);
        }
      );
    }else{
    this.http.post(AdInsConstant.AddAppGuarantorCompany, this.guarantorCompanyObj).subscribe(
      (response) => {
        console.log(response);
        this.toastr.successMessage(response["message"]);
        this.close.emit(1);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

ClearForm(){
  this.CompanyForm = this.fb.group({
    MrCustRelationshipCode : [''],
    TaxIdNo : [''],
    MrCompanyTypeCode : [''],
    IndustryTypeCode : [''],
    ContactName : [''],
    MrJobPositionCode : [''],
    MobilePhnNo1 : [''],
    ContactEmail : [''],
    MobilePhnNo2 : [''],
    FaxArea : [''],
    Fax : [''],
    PhnArea1 : [''],
    Phn1 : [''],
    PhnExt1 : [''],
    PhnArea2 : [''],
    Phn2 : [''],
    PhnExt2 : ['']
  });
  this.initLookup();
  this.initAddr();
}

legalDocObj : Array<AppCustCompanyLegalDocObj>;

addLegalDoc(){
  var legalDocObjs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
  var length = this.CompanyForm.value["LegalDocForm"].length;
  var max = 0;
  if(length > 0){
    max = this.CompanyForm.value["LegalDocForm"].length[length - 1];
  }
  legalDocObjs.push(this.addGroup(undefined, max + 1));
  this.getDocType(max);
 
}

getDocType(i){ 
  var legalDocObj ={
  RefMasterTypeCode:"LEGAL_DOC_TYPE",
  RowVersion:""
}
this.http.post(AdInsConstant.GetListActiveRefMaster, legalDocObj).subscribe(
  (response) => {
      this.DocObjs = response["ReturnObject"];
      this.CompanyForm.controls["LegalDocForm"]["controls"][i]["controls"].MrLegalDocTypeCode.patchValue({
        MrLegalDocTypeCode: this.DocObjs[0].MasterCode
      });
  }
);

}

addGroup(legalDocObj, i){
  if(legalDocObj == undefined){
    return this.fb.group({
      MrLegalDocTypeCode:['', [Validators.required, Validators.maxLength(50)]],
      DocNo: ['', [Validators.required, Validators.maxLength(50)]],
      DocDt: ['', [Validators.required]],
      DocExpiredDt: ['', [Validators.required]],
      DocNotes: ['', [Validators.maxLength(4000)]],
      ReleaseBy: ['', [Validators.required, Validators.maxLength(500)]],
      ReleaseLocation: ['', [Validators.required, Validators.maxLength(4000)]]
    })
  }else{
    return this.fb.group({
      No: [i],
      MrLegalDocTypeCode:[legalDocObj.MrLegalDocTypeCode, [Validators.required, Validators.maxLength(50)]],
      DocNo: [legalDocObj.DocNo, [Validators.required, Validators.maxLength(50)]],
      DocDt: [formatDate(legalDocObj.DocDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
      DocExpiredDt: [formatDate(legalDocObj.DocDt, 'yyyy-MM-dd', 'en-US'), [Validators.required]],
      DocNotes: [legalDocObj.DocNotes, [Validators.maxLength(4000)]],
      ReleaseBy: [legalDocObj.ReleaseBy, [Validators.required, Validators.maxLength(500)]],
      ReleaseLocation: [legalDocObj.ReleaseLocation, [Validators.required, Validators.maxLength(4000)]]
    })
  } 
}  

deleteLegalDoc(i) {
  var legalDocObjs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
  legalDocObjs.removeAt(i);
}

bindLegalDoc() {
  if (this.companyLegalDocObj != undefined) {
    for (let i = 0; i < this.companyLegalDocObj.length; i++) {
      var listLegalDocs = this.CompanyForm.controls["LegalDocForm"] as FormArray;
      listLegalDocs.push(this.addGroup(this.companyLegalDocObj[i], i));
      this.getDocType(i);
    }
  }
}

  cancel() {
    this.modalService.dismissAll();
  }
}
