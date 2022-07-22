import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { URLConstantX } from 'app/impl/shared/constant/URLConstantX';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { AddrObj } from 'app/shared/model/addr-obj.model';
import { AppCustBankAccObj } from 'app/shared/model/app-cust-bank-acc-obj.model';
import { AppOtherInfoObj } from 'app/shared/model/app-other-info.model';
import { CurrentUserContext } from 'app/shared/model/current-user-context.model';
import { GenericListObj } from 'app/shared/model/generic/generic-list-obj.model';
import { InputAddressObj } from 'app/shared/model/input-address-obj.model';
import { InputLookupObj } from 'app/shared/model/input-lookup-obj.model';
import { KeyValueObj } from 'app/shared/model/key-value/key-value-obj.model';
import { ReqRefMasterByTypeCodeAndMappingCodeObj } from 'app/shared/model/ref-master/req-ref-master-by-type-code-and-mapping-code-obj.model';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-edit-app-after-approval-bank-acc',
  templateUrl: './edit-app-after-approval-bank-acc.component.html'
})
export class EditAppAfterApprovalBankAccComponent implements OnInit {

  @Input() AppId: number;
  @Input() editedBankAccData;
  @Output() outputPage: EventEmitter<object> = new EventEmitter();
  EditBankAccForm = this.fb.group({
    CustBankAcc: [''],
    MrCustTypeOwnerBnkAcc: [''],
    MrIdTypeOwnerBnkAcc: [''],
    PrsdntDirectorOwnerBnkAcc: [''],
    IdNoOwnerBankAcc: ['', [Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16)]],
    BirthPlaceOwnerBankAcc: [''],
    BirthDtOwnerBankAcc: [''],
  });
  CustBankAccList: Array<AppCustBankAccObj>;
  isMrCustTypeCompany: boolean = false;
  DictRefMaster: Array<KeyValueObj> = new Array<KeyValueObj>();
  MasterCustType: string = "";
  MasterIdNoType: string = "";
  GetBankInfo: AppOtherInfoObj = new AppOtherInfoObj();
  BankAccRelatedOutput: any;

  UserAccess: CurrentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));
  MaxDate: Date;
  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private cookieService: CookieService) { }

  async ngOnInit() {
    this.MaxDate = this.UserAccess.BusinessDt;
    this.initCustBankAccDetail();
    this.initAddressCustBankAcc();
    await this.GetData();
    await this.getRefMaster();
  }

  inputAddressOwnerBankAccObj: InputAddressObj = new InputAddressObj();
  inputAddrObj: AddrObj = new AddrObj();
  inputAddrObjDefault: AddrObj = new AddrObj();
  initAddressCustBankAcc() {
    this.inputAddressOwnerBankAccObj.showSubsection = false;
    this.inputAddressOwnerBankAccObj.title = "Customer Bank Acc Owner Address";
    this.inputAddressOwnerBankAccObj.showAllPhn = false;
    this.inputAddressOwnerBankAccObj.inputField.inputLookupObj = new InputLookupObj();
    this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.isRequired = false;
    this.inputAddressOwnerBankAccObj.isRequired = false;
  }

  initCustBankAccDetail() {
    this.EditBankAccForm.get('MrIdTypeOwnerBnkAcc').disable();
    this.EditBankAccForm.patchValue({
      MrIdTypeOwnerBnkAcc: CommonConstant.MrIdTypeCodeEKTP,
      MrCustTypeOwnerBnkAcc: CommonConstant.CustTypePersonal,
    });
  }

  async GetData()
  {
    await this.http.post(URLConstant.GetAppCustByAppId, { Id : this.AppId }).toPromise().then(
      async (response) => {
        await this.http.post<GenericListObj>(URLConstant.GetListAppCustBankAccByAppCustId, { Id : response["AppCustId"] }).toPromise().then(
          (response) => {
            this.CustBankAccList = response.ReturnObject['AppCustBankAccObjs'];
          }
        );
      }
    );

    await this.GetBankAccCust();

    await this.http.post(URLConstantX.GetAppXDataByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        if (response["AppId"] != 0) {
          let datePipe = new DatePipe("en-US");
          this.EditBankAccForm.patchValue({
            MrCustTypeOwnerBnkAcc: response["MrCustTypeOwnerBnkAcc"],
            PrsdntDirectorOwnerBnkAcc: response["PrsdntDirectorOwnerBnkAcc"],
            MrIdTypeOwnerBnkAcc: response["MrIdTypeOwnerBnkAcc"],
            IdNoOwnerBankAcc: response["IdNoOwnerBankAcc"],
            BirthDtOwnerBankAcc: datePipe.transform(response['BirthDtOwnerBankAcc'], 'yyyy-MM-dd'),
            BirthPlaceOwnerBankAcc: response["BirthPlaceOwnerBankAcc"],
          });

          this.inputAddrObj.Addr = response["AddrOwnerBankAcc"];
          this.inputAddrObj.AreaCode1 = response["AreaCode1OwnerBankAcc"];
          this.inputAddrObj.AreaCode2 = response["AreaCode2OwnerBankAcc"];
          this.inputAddrObj.AreaCode3 = response["AreaCode3OwnerBankAcc"];
          this.inputAddrObj.AreaCode4 = response["AreaCode4OwnerBankAcc"];
          this.inputAddrObj.City = response["CityOwnerBankAcc"];

          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.nameSelect = response["ZipcodeOwnerBankAcc"];
          this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.jsonSelect = { Zipcode: response["ZipcodeOwnerBankAcc"] };
          this.inputAddressOwnerBankAccObj.default = this.inputAddrObj;

          if (response["MrCustTypeOwnerBnkAcc"] != null && response["MrIdTypeOwnerBnkAcc"] != null) {
            this.EditBankAccForm.patchValue({
              MrCustTypeOwnerBnkAcc: response["MrCustTypeOwnerBnkAcc"],
              MrIdTypeOwnerBnkAcc: response["MrIdTypeOwnerBnkAcc"],
            });
          }
        }
        this.isCustomerTypeCompany();
      }
    );

    if(this.editedBankAccData)
    {
      this.EditBankAccForm.patchValue({
        MrCustTypeOwnerBnkAcc: this.editedBankAccData.AppXObj.MrCustTypeOwnerBnkAcc,
        PrsdntDirectorOwnerBnkAcc: this.editedBankAccData.AppXObj.PrsdntDirectorOwnerBnkAcc,
        MrIdTypeOwnerBnkAcc: this.editedBankAccData.AppXObj.MrIdTypeOwnerBnkAcc,
        IdNoOwnerBankAcc: this.editedBankAccData.AppXObj.IdNoOwnerBankAcc,
        BirthDtOwnerBankAcc: this.editedBankAccData.AppXObj.BirthDtOwnerBankAcc,
        BirthPlaceOwnerBankAcc: this.editedBankAccData.AppXObj.BirthPlaceOwnerBankAcc
      });

      this.inputAddrObj.Addr = this.editedBankAccData.AppXObj.AddrOwnerBankAcc;
      this.inputAddrObj.AreaCode1 = this.editedBankAccData.AppXObj.AreaCode1OwnerBankAcc
      this.inputAddrObj.AreaCode2 = this.editedBankAccData.AppXObj.AreaCode2OwnerBankAcc
      this.inputAddrObj.AreaCode3 = this.editedBankAccData.AppXObj.AreaCode3OwnerBankAcc
      this.inputAddrObj.AreaCode4 = this.editedBankAccData.AppXObj.AreaCode4OwnerBankAcc
      this.inputAddrObj.City = this.editedBankAccData.AppXObj.CityOwnerBankAcc

      this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.nameSelect = this.editedBankAccData.AppXObj.ZipcodeOwnerBankAcc
      this.inputAddressOwnerBankAccObj.inputField.inputLookupObj.jsonSelect = { Zipcode: this.editedBankAccData.AppXObj.ZipcodeOwnerBankAcc};
      this.inputAddressOwnerBankAccObj.default = this.inputAddrObj;
    }
  }

  changeCustomerType(custType: string = CommonConstant.CustTypePersonal) {
    this.EditBankAccForm.patchValue({
      MrCustTypeOwnerBnkAcc: custType
    });
    if (custType == CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
      this.EditBankAccForm.patchValue({
        PrsdntDirectorOwnerBnkAcc: ''
      });
    }
  }

  async GetListActiveRefMaster(RefMasterTypeCode: string) {
    let tempReq: ReqRefMasterByTypeCodeAndMappingCodeObj = { RefMasterTypeCode: RefMasterTypeCode, MappingCode: null };
    await this.http.post(URLConstant.GetRefMasterListKeyValueActiveByCode, tempReq).toPromise().then(
      (response) => {
        this.DictRefMaster[RefMasterTypeCode] = response[CommonConstant.ReturnObj];
      });
  }

  async GetBankAccCust() {
    await this.http.post<AppOtherInfoObj>(URLConstant.GetAppOtherInfoByAppId, { Id: this.AppId }).toPromise().then(
      (response) => {
        this.GetBankInfo = response;
        if (this.GetBankInfo.AppOtherInfoId != 0) {
          let selectedBankAcc: AppCustBankAccObj = this.CustBankAccList.find(x => x.BankAccNo == this.GetBankInfo.BankAccNo);
          this.EditBankAccForm.patchValue({
            CustBankAcc: selectedBankAcc.AppCustBankAccId
          });

          this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
          this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
          this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
          this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
        }
      }
    );
    if(this.editedBankAccData)
    {
      if(this.editedBankAccData.AgrmntOtherInfoObj.BankAccNo)
      {
        let selectedBankAcc: AppCustBankAccObj = this.CustBankAccList.find(x => x.BankAccNo == this.editedBankAccData.AgrmntOtherInfoObj.BankAccNo);
        console.log(selectedBankAcc)
        this.EditBankAccForm.patchValue({
          CustBankAcc: selectedBankAcc.AppCustBankAccId
        });
        this.EditBankAccForm.updateValueAndValidity();
  
        this.GetBankInfo.BankCode = this.editedBankAccData.AgrmntOtherInfoObj.BankCode;
        this.GetBankInfo.BankBranch = this.editedBankAccData.AgrmntOtherInfoObj.BankBranch;
        this.GetBankInfo.BankAccNo = this.editedBankAccData.AgrmntOtherInfoObj.BankAccNo;
        this.GetBankInfo.BankAccName = this.editedBankAccData.AgrmntOtherInfoObj.BankAccName;
      }
    }
  }

  async getRefMaster() {
    this.MasterCustType = CommonConstant.RefMasterTypeCodeCustType;
    this.MasterIdNoType = CommonConstant.RefMasterTypeCodeIdType;
    await this.GetListActiveRefMaster(this.MasterCustType);
    await this.GetListActiveRefMaster(this.MasterIdNoType);
  }

  
  isCustomerTypeCompany() {
    if (this.EditBankAccForm.controls.MrCustTypeOwnerBnkAcc.value == CommonConstant.CustTypeCompany) {
      this.isMrCustTypeCompany = true;
    } else {
      this.isMrCustTypeCompany = false;
    }
  }

  selectedBank() {
    if(this.EditBankAccForm.get("CustBankAcc").value == "")
    {
      this.GetBankInfo.BankCode = "";
      this.GetBankInfo.BankBranch = "";
      this.GetBankInfo.BankAccNo = "";
      this.GetBankInfo.BankAccName = "";
      return;
    }

    let custBankAccId: number = this.EditBankAccForm.get("CustBankAcc").value;
    let selectedBankAcc: AppCustBankAccObj = this.CustBankAccList.find(x => x.AppCustBankAccId == custBankAccId);
    this.GetBankInfo.BankCode = selectedBankAcc.BankCode;
    this.GetBankInfo.BankBranch = selectedBankAcc.BankBranch;
    this.GetBankInfo.BankAccNo = selectedBankAcc.BankAccNo;
    this.GetBankInfo.BankAccName = selectedBankAcc.BankAccName;
  }

  CancelClick() {
    this.outputPage.emit({ pageType: "cancelBankAccData" });
  }

  SaveData() {
    this.BankAccRelatedOutput = 
      {
        AgrmntOtherInfoObj: 
          {
            BankCode: this.GetBankInfo.BankCode,
            BankBranch: this.GetBankInfo.BankBranch,
            BankAccNo: this.GetBankInfo.BankAccNo,
            BankAccName: this.GetBankInfo.BankAccName
          },
        AppXObj:
          {
            MrCustTypeOwnerBnkAcc: this.EditBankAccForm.controls.MrCustTypeOwnerBnkAcc.value,
            PrsdntDirectorOwnerBnkAcc: this.EditBankAccForm.controls.PrsdntDirectorOwnerBnkAcc.value,
            MrIdTypeOwnerBnkAcc: this.EditBankAccForm.controls.MrIdTypeOwnerBnkAcc.value,
            IdNoOwnerBankAcc: this.EditBankAccForm.controls.IdNoOwnerBankAcc.value,
            BirthPlaceOwnerBankAcc: this.EditBankAccForm.controls.BirthPlaceOwnerBankAcc.value,
            BirthDtOwnerBankAcc: this.EditBankAccForm.controls.BirthDtOwnerBankAcc.value,
            AddrOwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].Addr.value,
            AreaCode1OwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].AreaCode1.value,
            AreaCode2OwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].AreaCode2.value,
            AreaCode3OwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].AreaCode3.value,
            AreaCode4OwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].AreaCode4.value,
            CityOwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddress']['controls'].City.value,
            ZipcodeOwnerBankAcc: this.EditBankAccForm.controls['BankAccOwnerAddressZipcode']['controls'].value.value,
          }
      }

      this.outputPage.emit({ BankAccRelatedOutput: this.BankAccRelatedOutput, pageType: "submitBankAccData" });
  }
}
