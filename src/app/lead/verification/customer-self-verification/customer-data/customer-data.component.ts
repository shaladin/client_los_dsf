import { Component, OnInit, Input, ViewChild, ViewContainerRef, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { CriteriaObj } from 'app/shared/model/CriteriaObj.model';
import { environment } from 'environments/environment';
import { AdInsConstant } from 'app/shared/AdInstConstant';
import { InputFieldObj } from 'app/shared/model/InputFieldObj.Model';
import { RefMasterObj } from 'app/shared/model/RefMasterObj.Model';
import { LeadCustAddrObj } from 'app/shared/model/Request/LEAD/LeadCustAddrObj.model';
import { LeadCustSocmedObj } from 'app/shared/model/Request/LEAD/LeadCustSocmedObj.model';
import { LeadCustObj } from 'app/shared/model/Request/LEAD/LeadCustObj.model';
import { LeadCustPersonalObj } from 'app/shared/model/Request/LEAD/LeadCustPersonalObj.model';
import { LeadCustPersonalJobDataObj } from 'app/shared/model/Request/LEAD/LeadCustPersonalJobDataObj.model';
import { LeadCustPersonalFinDataObj } from 'app/shared/model/Request/LEAD/LeadCustPersonalFinDataObj.model';
import { RefProfessionObj } from 'app/shared/model/RefProfessionObj.Model';
import { formatDate } from '@angular/common';
import { UclookupgenericComponent } from '@adins/uclookupgeneric';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { InputAddressObj } from 'app/shared/model/InputAddressObj.Model';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CookieService } from 'ngx-cookie';
import { ReqInputLeadCustPersonalObj } from 'app/shared/model/Request/LEAD/ReqAddEditInputLeadCustPersonalObj.model';

@Component({
  selector: 'app-lead-customer-data',
  templateUrl: './customer-data.component.html',
  providers: [NGXToastrService]
})
export class CustomerDataComponent implements OnInit {
  @Input() LeadId: string;
  @Output() outputTab: EventEmitter<object> = new EventEmitter();
  businessDt: Date = new Date();
  CopyFrom: string;
  rowVersion: any;
  typePage: string;
  addLeadCustPersonal: string;
  editLeadCustPersonal: string;
  inputLegalAddressObj: InputFieldObj;
  inputResidenceAddressObj: InputFieldObj;
  tempProfession: string;
  professionLookUpObj: InputLookupObj;
  legalAddressObj: LeadCustAddrObj;
  residenceAddressObj: LeadCustAddrObj;
  idTypeCode: RefMasterObj;
  tempIdType: any;
  maritalStatCode: RefMasterObj;
  tempMrMaritalStatCode: any;
  getListActiveRefMasterUrl: string;
  getListActiveRefMasterWithMappingCodeAll: string;
  custModel: RefMasterObj;
  listCustModel: any;
  leadInputObj: ReqInputLeadCustPersonalObj = new ReqInputLeadCustPersonalObj();
  leadCustFacebookObj: LeadCustSocmedObj;
  leadCustInstagramObj: LeadCustSocmedObj;
  leadCustTwitterObj: LeadCustSocmedObj;
  genderType: RefMasterObj;
  tempGender: any;
  getLeadByLeadId: string;
  getLeadCustByLeadId: string;
  getLeadCustAddr: string;
  getLeadCustPersonal: string;
  getLeadCustPersonalFinData: string;
  getLeadCustPersonalJobData: string;
  getRefProfessionByCode: string;
  getListLeadCustSocmed: string;
  reqLeadCustObj: LeadCustObj;
  resLeadCustObj: any;
  reqLeadCustPersonalObj: LeadCustPersonalObj;
  resLeadCustPersonalObj: any;
  reqLeadCustPersonalJobDataObj: LeadCustPersonalJobDataObj;
  resLeadCustPersonalJobDataObj: any;
  reqLeadCustPersonalFinDataObj: LeadCustPersonalFinDataObj;
  resLeadCustPersonalFinDataObj: any;
  reqLeadCustAddrLegalObj: LeadCustAddrObj;
  resLeadCustAddrLegalObj: any;
  reqLeadCustAddrResObj: LeadCustAddrObj;
  resLeadCustAddrResObj: any;
  refProfessionObj: RefProfessionObj;
  returnRefProfessionObj: any;
  reqLeadCustSocmedObj: LeadCustSocmedObj;
  resLeadCustSocmedObj: any;
  CustModelKey: string = "";
  @ViewChild("ProfessionModal", { read: ViewContainerRef }) professionModal: ViewContainerRef;
  @ViewChild("enjiForm") enjiForm: NgForm;
  CustomerDataForm = this.fb.group({
    CustType: [''],
    Gender: [''],
    CustName: [''],
    BirthPlace: [''],
    BirthDate: [''],
    MrIdTypeCode: [''],
    MotherName: ['', [Validators.required]],
    IdNo: [''],
    MrMaritalStatCode: ['', [Validators.required]],
    Npwp: ['', Validators.pattern("^[0-9]+$"), Validators.minLength(15), Validators.maxLength(15)],
    Email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
    MobilePhone1: [''],
    MobilePhone2: [''],
    Facebook: [''],
    Instagram: [''],
    Twitter: [''],
    CustModel: [''],
    CompanyName: [''],
    MonthlyIncome: [0, [Validators.required, Validators.min(1.00)]],
    MonthlyExpense: [0]
  });
  inputAddressObjForLegalAddr: InputAddressObj;
  inputAddressObjForResidenceAddr: InputAddressObj;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookieService: CookieService) {
    this.getListActiveRefMasterUrl = URLConstant.GetRefMasterListKeyValueActiveByCode;
    this.getListActiveRefMasterWithMappingCodeAll = URLConstant.GetListActiveRefMasterWithMappingCodeAll;
    this.addLeadCustPersonal = URLConstant.AddLeadCustPersonal;
    this.editLeadCustPersonal = URLConstant.EditLeadCustPersonal;
    this.getLeadByLeadId = URLConstant.GetLeadByLeadId;
    this.getLeadCustByLeadId = URLConstant.GetLeadCustByLeadId;
    this.getLeadCustAddr = URLConstant.GetLeadCustAddrByLeadCustIdAndAddrTypeCode;
    this.getLeadCustPersonal = URLConstant.GetLeadCustPersonalByLeadCustId;
    this.getLeadCustPersonalFinData = URLConstant.GetLeadCustPersonalFinDataByLeadCustPersonalId;
    this.getLeadCustPersonalJobData = URLConstant.GetLeadCustPersonalJobDataByLeadCustPersonalId;
    this.getRefProfessionByCode = URLConstant.GetRefProfessionByCode;
    this.getListLeadCustSocmed = URLConstant.GetListLeadCustSocmedByLeadCustId;
    this.route.queryParams.subscribe(params => {
      if (params["LeadId"] != null) {
        this.LeadId = params["LeadId"];
      }
      if (params["mode"] != null) {
        this.typePage = params["mode"];
      }
      if (params["CopyFrom"] != null) {
        this.CopyFrom = params["CopyFrom"];
      }
    });
  }

  getLookUpProfession(event) {
    this.tempProfession = event.ProfessionCode;
  }

  custModelChange(event) {
    this.CustModelKey = this.listCustModel.find(x => x.Key == event.target.value).Key;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
    this.professionModal.clear();
    this.professionLookUpObj.nameSelect = "";
    this.professionLookUpObj.jsonSelect = "";
    this.tempProfession = "";
    const component = this.professionModal.createComponent(componentFactory);
    component.instance.lookupInput = this.professionLookUpObj;
    component.instance.parentForm = this.CustomerDataForm;
    component.instance.enjiForm = this.enjiForm;
    component.instance.identifier = 'MrJobProfessionCode';
    component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
    var arrAddCrit = new Array();
    var addCrit = new CriteriaObj();
    addCrit.DataType = "text";
    addCrit.propName = "MR_CUST_MODEL_CODE";
    addCrit.restriction = AdInsConstant.RestrictionEq;
    addCrit.value = this.CustModelKey;
    arrAddCrit.push(addCrit);
    this.professionLookUpObj.addCritInput = arrAddCrit;
  }

  ngOnInit() {
    this.inputAddressObjForLegalAddr = new InputAddressObj();
    this.inputAddressObjForLegalAddr.showSubsection = false;
    this.inputAddressObjForLegalAddr.title = "Legal Address";
    this.inputAddressObjForLegalAddr.showPhn3 = false;
    this.inputAddressObjForLegalAddr.showOwnership = false;

    this.inputAddressObjForResidenceAddr = new InputAddressObj();
    this.inputAddressObjForResidenceAddr.showSubsection = false;
    this.inputAddressObjForResidenceAddr.title = "Residence Address";
    this.inputAddressObjForResidenceAddr.showPhn3 = false;
    this.inputAddressObjForResidenceAddr.showOwnership = false;

    var context = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
    if (context != null && context != undefined) // TOLONG JANGAN DIHAPUS, SUPAYA BISA DIAKSES EXTERNAL PAGE TANPA PERLU LOGIN!!!
    {
      this.businessDt = new Date(context[CommonConstant.BUSINESS_DT]);
      this.businessDt.setDate(this.businessDt.getDate() - 1);
    }
    this.reqLeadCustObj = new LeadCustObj();
    this.reqLeadCustObj.LeadId = this.LeadId;
    var objLeadCust = { Id: this.LeadId };
    this.http.post(this.getLeadCustByLeadId, objLeadCust).subscribe(
      (response) => {
        this.resLeadCustObj = response;
        if (this.resLeadCustObj.LeadCustId != 0) {
          this.CustomerDataForm.patchValue({
            CustName: this.resLeadCustObj.CustName,
            MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
            CustModel: this.resLeadCustObj.MrCustModelCode,
            IdNo: this.resLeadCustObj.IdNo,
            Npwp: this.resLeadCustObj.TaxIdNo,
          });
          this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
          this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          var objListLeadCustSocmed = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(this.getListLeadCustSocmed, objListLeadCustSocmed).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
              });
            });

          this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
          this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
          this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
            (response) => {
              this.resLeadCustAddrLegalObj = response;
              this.legalAddressObj = new LeadCustAddrObj();
              this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
              this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
              this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
              this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
              this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
              this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
              this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
              this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
              this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
              this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
              this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
              this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
              this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
              this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
              this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;

              this.inputLegalAddressObj = new InputFieldObj();
              this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
              this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
              this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };
              this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
              this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
            });

          this.reqLeadCustAddrResObj = new LeadCustAddrObj();
          this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
          this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
            (response) => {
              this.resLeadCustAddrResObj = response;
              this.residenceAddressObj = new LeadCustAddrObj();
              this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
              this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
              this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
              this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
              this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
              this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
              this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
              this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
              this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
              this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
              this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
              this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
              this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
              this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
              this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;
              this.inputResidenceAddressObj = new InputFieldObj();
              this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
              this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
              this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };
              this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
              this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
            });

          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          var objLeadCustPersonal = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(this.getLeadCustPersonal, objLeadCustPersonal).subscribe(
            (response) => {
              this.resLeadCustPersonalObj = response;
              this.CustomerDataForm.patchValue({
                Gender: this.resLeadCustPersonalObj.MrGenderCode,
                BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                Email: this.resLeadCustPersonalObj.Email1,
                MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
              });
              this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
              this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              var objLeadCustPersonalJobData = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(this.getLeadCustPersonalJobData, objLeadCustPersonalJobData).subscribe(
                (response) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });
                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  this.http.post(this.getRefProfessionByCode, {Code : this.resLeadCustPersonalJobDataObj.MrProfessionCode}).subscribe(
                    (response) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });
              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              var objCustPersonalFinData = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(this.getLeadCustPersonalFinData, objCustPersonalFinData).subscribe(
                (response) => {
                  this.resLeadCustPersonalFinDataObj = response;
                  this.CustomerDataForm.patchValue({
                    MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                    MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                  });
                });
            });
        }
      });

    this.inputLegalAddressObj = new InputFieldObj();
    this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
    this.inputResidenceAddressObj = new InputFieldObj();
    this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
    this.professionLookUpObj = new InputLookupObj();
    this.professionLookUpObj.isRequired = false;
    this.professionLookUpObj.urlJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.urlQryPaging = "/Generic/GetPagingObjectBySQL";
    this.professionLookUpObj.urlEnviPaging = environment.FoundationR3Url;
    this.professionLookUpObj.pagingJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.genericJson = "./assets/uclookup/lookupProfession.json";
    this.professionLookUpObj.isRequired = true;

    this.genderType = new RefMasterObj();
    this.genderType.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeGender;
    this.http.post(this.getListActiveRefMasterUrl, this.genderType).subscribe(
      (response) => {
        this.tempGender = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ Gender: this.tempGender[0].Key });
      }
    );

    this.idTypeCode = new RefMasterObj();
    this.idTypeCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeIdType;
    this.http.post(this.getListActiveRefMasterUrl, this.idTypeCode).subscribe(
      (response) => {
        this.tempIdType = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ MrIdTypeCode: response[CommonConstant.ReturnObj][0]['Key'] });
      });

    this.maritalStatCode = new RefMasterObj();
    this.maritalStatCode.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeMaritalStat;
    this.http.post(this.getListActiveRefMasterUrl, this.maritalStatCode).subscribe(
      (response) => {
        this.tempMrMaritalStatCode = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ MrMaritalStatCode: response[CommonConstant.ReturnObj][0]['Key'] });
        // if (this.tempCustPersonalObj.MrMaritalStatCode != null) {
        //   this.CustomerDataForm.patchValue({
        //     MrMaritalStatCode: this.tempCustPersonalObj.MrMaritalStatCode
        //   });
        // } else {
        //   this.CustomerDataForm.patchValue({
        //     MrMaritalStatCode: response[CommonConstant.ReturnObj][0]['Key']
        //   });
        // }
      }
    );

    this.custModel = new RefMasterObj();
    this.custModel.RefMasterTypeCode = CommonConstant.RefMasterTypeCodeCustModel;
    this.custModel.MappingCode = CommonConstant.CustTypePersonal;
    this.http.post(this.getListActiveRefMasterWithMappingCodeAll, this.custModel).subscribe(
      (response) => {
        this.listCustModel = response[CommonConstant.ReturnObj];
        this.CustomerDataForm.patchValue({ CustModel: response[CommonConstant.ReturnObj][0]['Key'] });
        this.CustModelKey = response[CommonConstant.ReturnObj][0]['Key'];
        var arrAddCrit = new Array();
        var addCrit = new CriteriaObj();
        addCrit.DataType = "text";
        addCrit.propName = "MR_CUST_MODEL_CODE";
        addCrit.restriction = AdInsConstant.RestrictionEq;
        addCrit.value = this.CustModelKey;
        arrAddCrit.push(addCrit);
        this.professionLookUpObj.addCritInput = arrAddCrit;

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
        this.professionModal.clear();
        this.professionLookUpObj.nameSelect = "";
        const component = this.professionModal.createComponent(componentFactory);
        component.instance.lookupInput = this.professionLookUpObj;
        component.instance.parentForm = this.CustomerDataForm;
        component.instance.enjiForm = this.enjiForm;
        component.instance.identifier = 'MrJobProfessionCode';
        component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
      });

    if (this.CopyFrom != null) {
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.CopyFrom;
      var objLeadCust1 = { Id: this.CopyFrom };
      this.http.post(this.getLeadCustByLeadId, objLeadCust1).subscribe(
        (response) => {
          this.resLeadCustObj = response;
          this.CustomerDataForm.patchValue({
            CustName: this.resLeadCustObj.CustName,
            MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
            CustModel: this.resLeadCustObj.MrCustModelCode,
            IdNo: this.resLeadCustObj.IdNo,
            Npwp: this.resLeadCustObj.TaxIdNo,
          });
          this.CustModelKey = this.resLeadCustObj.MrCustModelCode;
          var arrAddCrit = new Array();
          var addCrit = new CriteriaObj();
          addCrit.DataType = "text";
          addCrit.propName = "MR_CUST_MODEL_CODE";
          addCrit.restriction = AdInsConstant.RestrictionEq;
          addCrit.value = this.CustModelKey;
          arrAddCrit.push(addCrit);
          this.professionLookUpObj.addCritInput = arrAddCrit;

          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
          this.professionModal.clear();
          this.professionLookUpObj.nameSelect = "";
          const component = this.professionModal.createComponent(componentFactory);
          component.instance.lookupInput = this.professionLookUpObj;
          component.instance.parentForm = this.CustomerDataForm;
          component.instance.enjiForm = this.enjiForm;
          component.instance.identifier = 'MrJobProfessionCode';
          component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));

          this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
          this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          var objListLeadCustSocmed1 = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(this.getListLeadCustSocmed, objListLeadCustSocmed1).subscribe(
            (response) => {
              this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
              this.CustomerDataForm.patchValue({
                Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
              });
            });

          this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
          this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
          this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
            (response) => {
              this.resLeadCustAddrLegalObj = response;
              this.legalAddressObj = new LeadCustAddrObj();
              this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
              this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
              this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
              this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
              this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
              this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
              this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
              this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
              this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
              this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
              this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
              this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
              this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
              this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
              this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;

              this.inputLegalAddressObj = new InputFieldObj();
              this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
              this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
              this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };

              this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
              this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
            });

          this.reqLeadCustAddrResObj = new LeadCustAddrObj();
          this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
          this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
            (response) => {
              this.resLeadCustAddrResObj = response;
              this.residenceAddressObj = new LeadCustAddrObj();
              this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
              this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
              this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
              this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
              this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
              this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
              this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
              this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
              this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
              this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
              this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
              this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
              this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
              this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
              this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;

              this.inputResidenceAddressObj = new InputFieldObj();
              this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
              this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
              this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };
              this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
              this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
            });

          this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
          this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
          var objLeadCustPersonal1 = { Id: this.resLeadCustObj.LeadCustId };
          this.http.post(this.getLeadCustPersonal, objLeadCustPersonal1).subscribe(
            (response) => {
              this.resLeadCustPersonalObj = response;
              this.CustomerDataForm.patchValue({
                Gender: this.resLeadCustPersonalObj.MrGenderCode,
                BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                Email: this.resLeadCustPersonalObj.Email1,
                MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
              });

              this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
              this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              var objLeadCustPersonalJobData1 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(this.getLeadCustPersonalJobData, objLeadCustPersonalJobData1).subscribe(
                (response) => {
                  this.resLeadCustPersonalJobDataObj = response;
                  this.CustomerDataForm.patchValue({
                    CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                  });

                  this.refProfessionObj = new RefProfessionObj();
                  this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                  this.http.post(this.getRefProfessionByCode, {Code : this.resLeadCustPersonalJobDataObj.MrProfessionCode}).subscribe(
                    (response) => {
                      this.returnRefProfessionObj = response;
                      this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                      this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                      this.tempProfession = this.returnRefProfessionObj.ProfessionCode;
                    });
                });

              this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
              this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
              var objCustPersonalFinData1 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
              this.http.post(this.getLeadCustPersonalFinData, objCustPersonalFinData1).subscribe(
                (response) => {
                  this.resLeadCustPersonalFinDataObj = response;
                  this.CustomerDataForm.patchValue({
                    MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                    MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                  });
                });
            });
        });
    }

    if (this.typePage == "edit" || this.typePage == "update") {
      this.reqLeadCustObj = new LeadCustObj();
      this.reqLeadCustObj.LeadId = this.LeadId;
      var objLeadCust2 = { Id: this.LeadId };
      this.http.post(this.getLeadCustByLeadId, objLeadCust2).subscribe(
        (response) => {
          this.resLeadCustObj = response;

          if (this.resLeadCustObj.LeadId != 0) {
            this.CustomerDataForm.patchValue({
              CustName: this.resLeadCustObj.CustName,
              MrIdTypeCode: this.resLeadCustObj.MrIdTypeCode,
              CustModel: this.resLeadCustObj.MrCustModelCode,
              IdNo: this.resLeadCustObj.IdNo,
              Npwp: this.resLeadCustObj.TaxIdNo,
            });

            this.CustModelKey = this.resLeadCustObj.MrCustModelCode;
            var arrAddCrit = new Array();
            var addCrit = new CriteriaObj();
            addCrit.DataType = "text";
            addCrit.propName = "MR_CUST_MODEL_CODE";
            addCrit.restriction = AdInsConstant.RestrictionEq;
            addCrit.value = this.CustModelKey;
            arrAddCrit.push(addCrit);
            this.professionLookUpObj.addCritInput = arrAddCrit;

            this.reqLeadCustSocmedObj = new LeadCustSocmedObj();
            this.reqLeadCustSocmedObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            var objListLeadCustSocmed2 = { Id: this.resLeadCustObj.LeadCustId };
            this.http.post(this.getListLeadCustSocmed, objListLeadCustSocmed2).subscribe(
              (response) => {
                this.resLeadCustSocmedObj = response[CommonConstant.ReturnObj];
                this.CustomerDataForm.patchValue({
                  Facebook: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "FB").SocmedId,
                  Instagram: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "IG").SocmedId,
                  Twitter: this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW") == undefined ? "" : this.resLeadCustSocmedObj.find(x => x.MrSocmedCode == "TW").SocmedId,
                });
              });

            this.reqLeadCustAddrLegalObj = new LeadCustAddrObj();
            this.reqLeadCustAddrLegalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            this.reqLeadCustAddrLegalObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
            this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrLegalObj).subscribe(
              (response) => {
                this.resLeadCustAddrLegalObj = response;

                this.legalAddressObj = new LeadCustAddrObj();
                this.legalAddressObj.Addr = this.resLeadCustAddrLegalObj.Addr;
                this.legalAddressObj.AreaCode3 = this.resLeadCustAddrLegalObj.AreaCode3;
                this.legalAddressObj.AreaCode4 = this.resLeadCustAddrLegalObj.AreaCode4;
                this.legalAddressObj.AreaCode1 = this.resLeadCustAddrLegalObj.AreaCode1;
                this.legalAddressObj.AreaCode2 = this.resLeadCustAddrLegalObj.AreaCode2;
                this.legalAddressObj.City = this.resLeadCustAddrLegalObj.City;
                this.legalAddressObj.PhnArea1 = this.resLeadCustAddrLegalObj.PhnArea1;
                this.legalAddressObj.Phn1 = this.resLeadCustAddrLegalObj.Phn1;
                this.legalAddressObj.PhnExt1 = this.resLeadCustAddrLegalObj.PhnExt1;
                this.legalAddressObj.PhnArea2 = this.resLeadCustAddrLegalObj.PhnArea2;
                this.legalAddressObj.Phn2 = this.resLeadCustAddrLegalObj.Phn2;
                this.legalAddressObj.PhnExt2 = this.resLeadCustAddrLegalObj.PhnExt2;
                this.legalAddressObj.FaxArea = this.resLeadCustAddrLegalObj.FaxArea;
                this.legalAddressObj.Fax = this.resLeadCustAddrLegalObj.Fax;
                this.legalAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrLegalObj.MrBuildingOwnershipCode;

                this.inputLegalAddressObj = new InputFieldObj();
                this.inputLegalAddressObj.inputLookupObj = new InputLookupObj();
                this.inputLegalAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrLegalObj.Zipcode;
                this.inputLegalAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrLegalObj.Zipcode };
                this.inputAddressObjForLegalAddr.default = this.legalAddressObj;
                this.inputAddressObjForLegalAddr.inputField = this.inputLegalAddressObj;
              });

            this.reqLeadCustAddrResObj = new LeadCustAddrObj();
            this.reqLeadCustAddrResObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            this.reqLeadCustAddrResObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence;
            this.http.post(this.getLeadCustAddr, this.reqLeadCustAddrResObj).subscribe(
              (response) => {
                this.resLeadCustAddrResObj = response;

                this.residenceAddressObj = new LeadCustAddrObj();
                this.residenceAddressObj.Addr = this.resLeadCustAddrResObj.Addr;
                this.residenceAddressObj.AreaCode3 = this.resLeadCustAddrResObj.AreaCode3;
                this.residenceAddressObj.AreaCode4 = this.resLeadCustAddrResObj.AreaCode4;
                this.residenceAddressObj.AreaCode1 = this.resLeadCustAddrResObj.AreaCode1;
                this.residenceAddressObj.AreaCode2 = this.resLeadCustAddrResObj.AreaCode2;
                this.residenceAddressObj.City = this.resLeadCustAddrResObj.City;
                this.residenceAddressObj.PhnArea1 = this.resLeadCustAddrResObj.PhnArea1;
                this.residenceAddressObj.Phn1 = this.resLeadCustAddrResObj.Phn1;
                this.residenceAddressObj.PhnExt1 = this.resLeadCustAddrResObj.PhnExt1;
                this.residenceAddressObj.PhnArea2 = this.resLeadCustAddrResObj.PhnArea2;
                this.residenceAddressObj.Phn2 = this.resLeadCustAddrResObj.Phn2;
                this.residenceAddressObj.PhnExt2 = this.resLeadCustAddrResObj.PhnExt2;
                this.residenceAddressObj.FaxArea = this.resLeadCustAddrResObj.FaxArea;
                this.residenceAddressObj.Fax = this.resLeadCustAddrResObj.Fax;
                this.residenceAddressObj.MrHouseOwnershipCode = this.resLeadCustAddrResObj.MrBuildingOwnershipCode;

                this.inputResidenceAddressObj = new InputFieldObj();
                this.inputResidenceAddressObj.inputLookupObj = new InputLookupObj();
                this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.resLeadCustAddrResObj.Zipcode;
                this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.resLeadCustAddrResObj.Zipcode };
                this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
                this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
              });

            this.reqLeadCustPersonalObj = new LeadCustPersonalObj();
            this.reqLeadCustPersonalObj.LeadCustId = this.resLeadCustObj.LeadCustId;
            var objLeadCustPersonal2 = { Id: this.resLeadCustObj.LeadCustId };
            this.http.post(this.getLeadCustPersonal, objLeadCustPersonal2).subscribe(
              (response) => {
                this.resLeadCustPersonalObj = response;
                this.CustomerDataForm.patchValue({
                  Gender: this.resLeadCustPersonalObj.MrGenderCode,
                  BirthPlace: this.resLeadCustPersonalObj.BirthPlace,
                  BirthDate: formatDate(this.resLeadCustPersonalObj.BirthDt, 'yyyy-MM-dd', 'en-US'),
                  MotherName: this.resLeadCustPersonalObj.MotherMaidenName,
                  MrMaritalStatCode: this.resLeadCustPersonalObj.MrMaritalStatCode,
                  Email: this.resLeadCustPersonalObj.Email1,
                  MobilePhone1: this.resLeadCustPersonalObj.MobilePhnNo1,
                  MobilePhone2: this.resLeadCustPersonalObj.MobilePhnNo2,
                });

                this.reqLeadCustPersonalJobDataObj = new LeadCustPersonalJobDataObj();
                this.reqLeadCustPersonalJobDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                var objLeadCustPersonalJobData2 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
                this.http.post(this.getLeadCustPersonalJobData, objLeadCustPersonalJobData2).subscribe(
                  (response) => {
                    this.resLeadCustPersonalJobDataObj = response;
                    this.CustomerDataForm.patchValue({
                      CompanyName: this.resLeadCustPersonalJobDataObj.CompanyName,
                    });
                    this.refProfessionObj = new RefProfessionObj();
                    this.refProfessionObj.ProfessionCode = this.resLeadCustPersonalJobDataObj.MrProfessionCode;
                    this.http.post(this.getRefProfessionByCode, {Code : this.resLeadCustPersonalJobDataObj.MrProfessionCode}).subscribe(
                      (response) => {
                        this.returnRefProfessionObj = response;
                        this.professionLookUpObj.nameSelect = this.returnRefProfessionObj.ProfessionName;
                        this.professionLookUpObj.jsonSelect = this.returnRefProfessionObj;
                        this.tempProfession = this.returnRefProfessionObj.ProfessionCode;

                        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UclookupgenericComponent);
                        this.professionModal.clear();
                        const component = this.professionModal.createComponent(componentFactory);
                        component.instance.lookupInput = this.professionLookUpObj;
                        component.instance.parentForm = this.CustomerDataForm;
                        component.instance.enjiForm = this.enjiForm;
                        component.instance.identifier = 'MrJobProfessionCode';
                        component.instance.lookup.subscribe((e) => this.getLookUpProfession(e));
                      });
                  });

                this.reqLeadCustPersonalFinDataObj = new LeadCustPersonalFinDataObj();
                this.reqLeadCustPersonalFinDataObj.LeadCustPersonalId = this.resLeadCustPersonalObj.LeadCustPersonalId;
                var objCustPersonalFinData2 = { Id: this.resLeadCustPersonalObj.LeadCustPersonalId };
                this.http.post(this.getLeadCustPersonalFinData, objCustPersonalFinData2).subscribe(
                  (response) => {
                    this.resLeadCustPersonalFinDataObj = response;
                    this.CustomerDataForm.patchValue({
                      MonthlyIncome: this.resLeadCustPersonalFinDataObj.MonthlyIncomeAmt,
                      MonthlyExpense: this.resLeadCustPersonalFinDataObj.MonthlyExpenseAmt,
                    });
                  });
              });
          }

        });
    }
  }

  copyAddress() {
    this.residenceAddressObj = new LeadCustAddrObj();
    this.residenceAddressObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.residenceAddressObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.residenceAddressObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.residenceAddressObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.residenceAddressObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.residenceAddressObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.residenceAddressObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.residenceAddressObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.residenceAddressObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.residenceAddressObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.residenceAddressObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.residenceAddressObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.residenceAddressObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.residenceAddressObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.residenceAddressObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;

    this.inputResidenceAddressObj.inputLookupObj.nameSelect = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.inputResidenceAddressObj.inputLookupObj.jsonSelect = { Zipcode: this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value };
    this.inputAddressObjForResidenceAddr.default = this.residenceAddressObj;
    this.inputAddressObjForResidenceAddr.inputField = this.inputResidenceAddressObj;
  }

  setLegalAddr() {
    //this.legalAddressObj = new LeadCustAddrObj();
    this.leadInputObj.LeadCustLegalAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeLegal;
    this.leadInputObj.LeadCustLegalAddrObj.Addr = this.CustomerDataForm.controls["legalAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode3 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode4 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustLegalAddrObj.Zipcode = this.CustomerDataForm.controls["legalAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode1 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustLegalAddrObj.AreaCode2 = this.CustomerDataForm.controls["legalAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustLegalAddrObj.City = this.CustomerDataForm.controls["legalAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn1 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt1 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnArea2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustLegalAddrObj.Phn2 = this.CustomerDataForm.controls["legalAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustLegalAddrObj.PhnExt2 = this.CustomerDataForm.controls["legalAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustLegalAddrObj.FaxArea = this.CustomerDataForm.controls["legalAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustLegalAddrObj.Fax = this.CustomerDataForm.controls["legalAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustLegalAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["legalAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setResidenceAddr() {
    //this.residenceAddressObj = new LeadCustAddrObj();
    this.leadInputObj.LeadCustResidenceAddrObj.MrCustAddrTypeCode = CommonConstant.AddrTypeResidence
    this.leadInputObj.LeadCustResidenceAddrObj.Addr = this.CustomerDataForm.controls["residenceAddress"]["controls"].Addr.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode3 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode3.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode4 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode4.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Zipcode = this.CustomerDataForm.controls["residenceAddressZipcode"]["controls"].value.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.AreaCode2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].AreaCode2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.City = this.CustomerDataForm.controls["residenceAddress"]["controls"].City.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt1 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt1.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnArea2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnArea2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Phn2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].Phn2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.PhnExt2 = this.CustomerDataForm.controls["residenceAddress"]["controls"].PhnExt2.value;
    this.leadInputObj.LeadCustResidenceAddrObj.FaxArea = this.CustomerDataForm.controls["residenceAddress"]["controls"].FaxArea.value;
    this.leadInputObj.LeadCustResidenceAddrObj.Fax = this.CustomerDataForm.controls["residenceAddress"]["controls"].Fax.value;
    this.leadInputObj.LeadCustResidenceAddrObj.MrHouseOwnershipCode = this.CustomerDataForm.controls["residenceAddress"]["controls"].MrHouseOwnershipCode.value;
  }

  setLeadCust() {
    this.leadInputObj.LeadCustObj.MrCustTypeCode = CommonConstant.CustTypePersonal;
    this.leadInputObj.LeadCustObj.LeadId = this.LeadId;
    this.leadInputObj.LeadCustObj.CustName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustObj.MrIdTypeCode = this.CustomerDataForm.controls["MrIdTypeCode"].value;
    this.leadInputObj.LeadCustObj.MrCustModelCode = this.CustomerDataForm.controls["CustModel"].value;
    this.leadInputObj.LeadCustObj.IdNo = this.CustomerDataForm.controls["IdNo"].value;
    this.leadInputObj.LeadCustObj.TaxIdNo = this.CustomerDataForm.controls["Npwp"].value;
  }

  setLeadCustPersonal() {
    this.leadInputObj.LeadCustPersonalObj.CustFullName = this.CustomerDataForm.controls["CustName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrGenderCode = this.CustomerDataForm.controls["Gender"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthPlace = this.CustomerDataForm.controls["BirthPlace"].value;
    this.leadInputObj.LeadCustPersonalObj.BirthDt = this.CustomerDataForm.controls["BirthDate"].value;
    this.leadInputObj.LeadCustPersonalObj.MotherMaidenName = this.CustomerDataForm.controls["MotherName"].value;
    this.leadInputObj.LeadCustPersonalObj.MrMaritalStatCode = this.CustomerDataForm.controls["MrMaritalStatCode"].value;
    this.leadInputObj.LeadCustPersonalObj.Email1 = this.CustomerDataForm.controls["Email"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo1 = this.CustomerDataForm.controls["MobilePhone1"].value;
    this.leadInputObj.LeadCustPersonalObj.MobilePhnNo2 = this.CustomerDataForm.controls["MobilePhone2"].value;
  }

  setLeadCustSocmed() {
    this.leadCustFacebookObj = new LeadCustSocmedObj();
    this.leadCustFacebookObj.MrSocmedCode = "FB";
    this.leadCustFacebookObj.MrSocmedName = "Facebook";
    this.leadCustFacebookObj.SocmedId = this.CustomerDataForm.controls["Facebook"].value;

    this.leadCustInstagramObj = new LeadCustSocmedObj();
    this.leadCustInstagramObj.MrSocmedCode = "IG";
    this.leadCustInstagramObj.MrSocmedName = "Instagram";
    this.leadCustInstagramObj.SocmedId = this.CustomerDataForm.controls["Instagram"].value;

    this.leadCustTwitterObj = new LeadCustSocmedObj();
    this.leadCustTwitterObj.MrSocmedCode = "TW";
    this.leadCustTwitterObj.MrSocmedName = "Twitter";
    this.leadCustTwitterObj.SocmedId = this.CustomerDataForm.controls["Twitter"].value;

    if (this.CustomerDataForm.controls["Facebook"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustFacebookObj);
    }
    if (this.CustomerDataForm.controls["Instagram"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustInstagramObj);
    }
    if (this.CustomerDataForm.controls["Twitter"].value != "") {
      this.leadInputObj.LeadCustSocmedObj.push(this.leadCustTwitterObj);
    }
  }

  setLeadCustPersonalJobData() {
    this.leadInputObj.LeadCustPersonalJobDataObj.MrProfessionCode = this.tempProfession;
    this.leadInputObj.LeadCustPersonalJobDataObj.CompanyName = this.CustomerDataForm.controls["CompanyName"].value;
  }

  setLeadCustPersonalFinData() {
    this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyIncomeAmt = this.CustomerDataForm.controls["MonthlyIncome"].value;
    var monthlyExpense = this.CustomerDataForm.controls["MonthlyExpense"].value;
    if (monthlyExpense == '') {
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = 0;
    }
    else {
      this.leadInputObj.LeadCustPersonalFinDataObj.MonthlyExpenseAmt = monthlyExpense;
    }

  }

  SaveForm() {
    if (this.typePage == "edit" || this.typePage == "update") {
      if (this.resLeadCustObj.LeadId != 0) {
        this.leadInputObj = new ReqInputLeadCustPersonalObj();
        this.leadInputObj.LeadCustObj.LeadCustId = this.resLeadCustObj.LeadCustId;
        this.leadInputObj.LeadCustObj.RowVersion = this.resLeadCustObj.RowVersion;
        this.setLeadCust();
        this.leadInputObj.LeadCustPersonalObj.RowVersion = this.resLeadCustPersonalObj.RowVersion;
        this.setLeadCustPersonal();
        this.setLeadCustSocmed();
        this.leadInputObj.LeadCustLegalAddrObj.RowVersion = this.resLeadCustAddrLegalObj.RowVersion;
        this.setLegalAddr();
        this.leadInputObj.LeadCustResidenceAddrObj.RowVersion = this.resLeadCustAddrResObj.RowVersion;
        this.setResidenceAddr();
        this.leadInputObj.LeadCustPersonalJobDataObj.RowVersion = this.resLeadCustPersonalJobDataObj.RowVersion;
        this.setLeadCustPersonalJobData();
        this.leadInputObj.LeadCustPersonalFinDataObj.RowVersion = this.resLeadCustPersonalFinDataObj.RowVersion;
        this.setLeadCustPersonalFinData();
        this.http.post(this.editLeadCustPersonal, this.leadInputObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            // AdInsHelper.RedirectUrl(this.router,["/Customer/CustomerPersonal/Address"],{ "IdCust": this.IdCust });
            this.outputTab.emit({ stepMode: "next" });
          },
          (error) => {
          }
        );
      } else {
        this.leadInputObj = new ReqInputLeadCustPersonalObj();
        this.setLeadCust();
        this.setLeadCustPersonal();
        this.setLeadCustSocmed();
        this.setLegalAddr();
        this.setResidenceAddr();
        this.setLeadCustPersonalJobData();
        this.setLeadCustPersonalFinData();
        this.http.post(this.addLeadCustPersonal, this.leadInputObj).subscribe(
          (response) => {
            this.toastr.successMessage(response["message"]);
            // AdInsHelper.RedirectUrl(this.router,["/Customer/CustomerPersonal/Address"],{ "IdCust": this.IdCust });
            this.outputTab.emit({ stepMode: "next" });
          },
          (error) => {
          }
        );
      }
    }
    else {
      this.leadInputObj = new ReqInputLeadCustPersonalObj();
      this.setLeadCust();
      this.setLeadCustPersonal();
      this.setLeadCustSocmed();
      this.setLegalAddr();
      this.setResidenceAddr();
      this.setLeadCustPersonalJobData();
      this.setLeadCustPersonalFinData();

      this.http.post(this.addLeadCustPersonal, this.leadInputObj).subscribe(
        (response) => {
          this.toastr.successMessage(response["message"]);
          // AdInsHelper.RedirectUrl(this.router,["/Customer/CustomerPersonal/Address"],{ "IdCust": this.IdCust });
          this.outputTab.emit({ stepMode: "next" });
        },
        (error) => {
        }
      );
    }
  }
}
