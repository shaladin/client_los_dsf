import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NGXToastrService } from 'app/components/extra/toastr/toastr.service';
import { AdInsHelper } from 'app/shared/AdInsHelper';
import { CommonConstant } from 'app/shared/constant/CommonConstant';
import { NavigationConstant } from 'app/shared/constant/NavigationConstant';
import { URLConstant } from 'app/shared/constant/URLConstant';
import { DocPickupRequestObj } from 'app/shared/model/DocPickupRequestObj.model';
import { SrvyTaskObj } from 'app/shared/model/SurveyTaskObj.model';
import { KeyValueObj } from 'app/shared/model/KeyValue/KeyValueObj.model';
import { UcDropdownListObj } from 'app/shared/model/library/UcDropdownListObj.model';
import { CookieService } from 'ngx-cookie';
import { AppCustAddrObj } from 'app/shared/model/AppCustAddrObj.Model';

@Component({
  selector: 'app-doc-pickup-request-detail',
  templateUrl: './doc-pickup-request-detail.component.html',
  styleUrls: ['./doc-pickup-request-detail.component.scss']
})
export class DocPickupRequestDetailComponent implements OnInit {
  readonly CancelLink: string = NavigationConstant.NAP_ADD_PRCS_DOC_PICKUP_REQUEST_PAGING;

  AppId: number;
  AppCustId: number;
  docPickUpRequestObj: DocPickupRequestObj;
  isntCustomer: boolean = false;
  isReady: boolean = false;

  isDdlAddressReady: boolean;
  AddressObj: Array<KeyValueObj> = new Array<KeyValueObj>();
  ddlAddressObj: UcDropdownListObj = new UcDropdownListObj();

  srvyTaskObj: SrvyTaskObj;

  appCustAddrListObj: Array<AppCustAddrObj> = new Array<AppCustAddrObj>();
  listCustAddr: Array<AppCustAddrObj>;
  custAddr: AppCustAddrObj;

  DocPickupReqForm = this.fb.group({
    AppNo: [],
    CustNo: [],
    CustName: [],
    CustId: [],
    OfficeName: [],
    OfficeId: [],
    OfficeCode: [],
    RequestBy: [],
    RequestDate: [],
    RequestById: [],
    Address: [],
    AddressValue: [],
    RoleCode: [],
    MrCustModelCode: [],
    MrSurveyTypeCode: [],
    Description: ['', Validators.required]
  })

  constructor(private route: ActivatedRoute,
    private httpClient: HttpClient,
    private toastr: NGXToastrService,
    private fb: FormBuilder,
    private cookieService: CookieService) {
    this.route.queryParams.subscribe(params => {
      if (params["AppId"] != null) {
        this.AppId = params["AppId"];
      }
      if (params["AppCustId"] != null) {
        this.AppCustId = params['AppCustId'];
      }
    });
  }

  changeAddress(address) {
    this.DocPickupReqForm.patchValue({
      AddressValue: address['Value']
    });
  }

  ngOnInit() {
    this.ddlAddressObj.isSelectOutput = true;
    this.ddlAddressObj.customKey = "Key";
    this.ddlAddressObj.customValue = "Value";
    this.httpClient.post(URLConstant.GetDocPickupRequestByAppId, { Id: this.AppId }).subscribe(
      (response) => {
        this.docPickUpRequestObj = new DocPickupRequestObj();
        this.docPickUpRequestObj.AppNo = response['AppNo'];
        this.docPickUpRequestObj.CustId = response['CustId'];
        this.docPickUpRequestObj.CustName = response['CustName'];
        this.docPickUpRequestObj.CustNo = response['CustNo'];
        this.docPickUpRequestObj.OfficeName = response['OfficeName'];
        this.docPickUpRequestObj.MrCustModelCode = response['MrCustModelCode'];
        this.docPickUpRequestObj.MrSurveyTypeCode = response['MrSurveyTypeCode'];

        this.DocPickupReqForm.patchValue({
          AppNo: response['AppNo'],
          CustNo: response['CustNo'],
          CustName: response['CustName'],
          OfficeName: response['OfficeName'],
          CustId: response['CustId'],
          MrCustModelCode: response['MrCustModelCode'],
          MrSurveyTypeCode: response['MrSurveyTypeCode']
        });
      }
    )

    let currentUserContext = JSON.parse(AdInsHelper.GetCookie(this.cookieService, CommonConstant.USER_ACCESS));

    this.DocPickupReqForm.patchValue({
      RequestDate: currentUserContext['BusinessDtStr'],
      RequestBy: currentUserContext['UserName'],
      RequestById: currentUserContext['RefUserId'],
      RoleCode: currentUserContext['RoleCode'],
      OfficeCode: currentUserContext['OfficeCode'],
      OfficeId: currentUserContext['OfficeId']
    })

    this.httpClient.post(URLConstant.GetListAppCustAddrByAppCustIdForDocPickupRequest, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.AddressObj = response[CommonConstant.ReturnObj];
        this.isDdlAddressReady = true;

        if (this.AddressObj.length == 1) {
          this.isDdlAddressReady = false;
          this.DocPickupReqForm.patchValue({
            Address: this.AddressObj['Value']
          })
        }
        else if (this.AddressObj.length == 0) {
          this.isntCustomer = true;
          this.isDdlAddressReady = false;
        }
      }
    )

    this.httpClient.post(URLConstant.GetListAppCustAddrByAppCustId, { Id: this.AppCustId }).subscribe(
      (response) => {
        this.listCustAddr = response[CommonConstant.ReturnObj];

        for (let i = 0; i < this.listCustAddr.length; i++) {
          this.custAddr = new AppCustAddrObj();
          this.custAddr.AppCustAddrId = this.listCustAddr[i].AppCustAddrId;
          this.custAddr.AppCustId = this.AppCustId;
          this.custAddr.Addr = this.listCustAddr[i].Addr;
          this.custAddr.AreaCode1 = this.listCustAddr[i].AreaCode1;
          this.custAddr.AreaCode2 = this.listCustAddr[i].AreaCode2;
          this.custAddr.AreaCode3 = this.listCustAddr[i].AreaCode3;
          this.custAddr.AreaCode4 = this.listCustAddr[i].AreaCode4;
          this.custAddr.City = this.listCustAddr[i].City;
          this.custAddr.CustAddrTypeName = this.listCustAddr[i].CustAddrTypeName;
          this.custAddr.Fax = this.listCustAddr[i].Fax;
          this.custAddr.FaxArea = this.listCustAddr[i].Fax;
          this.custAddr.FullAddr = this.listCustAddr[i].FullAddr;
          this.custAddr.HouseOwnershipName = this.listCustAddr[i].HouseOwnershipName;
          this.custAddr.MrCustAddrTypeCode = this.listCustAddr[i].MrCustAddrTypeCode;
          this.custAddr.Notes = this.listCustAddr[i].Notes;
          this.custAddr.Phn1 = this.listCustAddr[i].Phn1;
          this.custAddr.Phn2 = this.listCustAddr[i].Phn2;
          this.custAddr.Phn3 = this.listCustAddr[i].Phn3;
          this.custAddr.PhnArea1 = this.listCustAddr[i].PhnArea1;
          this.custAddr.PhnArea2 = this.listCustAddr[i].PhnArea2;
          this.custAddr.PhnArea3 = this.listCustAddr[i].PhnArea3;
          this.custAddr.PhnExt1 = this.listCustAddr[i].PhnExt1;
          this.custAddr.PhnExt2 = this.listCustAddr[i].PhnExt2;
          this.custAddr.PhnExt3 = this.listCustAddr[i].PhnExt3;
          this.custAddr.PhoneNo = this.listCustAddr[i].PhoneNo;
          this.custAddr.PhoneNo2 = this.listCustAddr[i].PhoneNo2;
          this.custAddr.Zipcode = this.listCustAddr[i].Zipcode;
          this.custAddr.SubZipcode = this.listCustAddr[i].SubZipcode;
          this.custAddr.RowVersion = this.listCustAddr[i].RowVersion;
          this.custAddr.StayLength = this.listCustAddr[i].StayLength;

          this.appCustAddrListObj.push(this.custAddr);
        }
      }
    )
  }

  SaveForm() {
    this.httpClient.post(URLConstant.GetAppCustAddrByAppCustAddrId, { Id: this.DocPickupReqForm.value.Address }).subscribe(
      (response) => {

        this.docPickUpRequestObj = new DocPickupRequestObj();
        this.docPickUpRequestObj.Zipcode = response['Zipcode'];
        this.docPickUpRequestObj.City = response['City'];
        this.docPickUpRequestObj.Kelurahan = response['AreaCode1'];
        this.docPickUpRequestObj.Kecamatan = response['AreaCode2'];
        this.docPickUpRequestObj.RT = response['AreaCode3'];
        this.docPickUpRequestObj.RW = response['AreaCode4'];
        this.docPickUpRequestObj.Addr = response['Addr'];
        this.docPickUpRequestObj.CustPhone = (response['PhnArea1'] == null ? "" : response['PhnArea1']) + "-" + (response['Phn1'] == null ? "" : response['Phn1']);

        this.docPickUpRequestObj.IsAddtReq = 1;
        this.docPickUpRequestObj.CustNo = this.DocPickupReqForm.value.CustNo;
        this.docPickUpRequestObj.CustId = this.DocPickupReqForm.value.CustId;
        this.docPickUpRequestObj.CustName = this.DocPickupReqForm.value.CustName;
        this.docPickUpRequestObj.MrSrvyObjTypeCode = "DOC_PCKP_REQ";
        this.docPickUpRequestObj.MrCustModelCode = this.DocPickupReqForm.value.MrCustModelCode;
        this.docPickUpRequestObj.MrSurveyTypeCode = this.DocPickupReqForm.value.MrSurveyTypeCode;
        this.docPickUpRequestObj.CustAddr = this.DocPickupReqForm.value.AddressValue;
        this.docPickUpRequestObj.MrSurveyTaskStatCode = "NEW";
        this.docPickUpRequestObj.Notes = this.DocPickupReqForm.value.Description;
        this.docPickUpRequestObj.RefNo = this.DocPickupReqForm.value.AppNo;

        this.docPickUpRequestObj.AppNo = this.DocPickupReqForm.value.AppNo;
        this.docPickUpRequestObj.RequestDate = this.DocPickupReqForm.value.RequestDate;
        this.docPickUpRequestObj.RequestBy = this.DocPickupReqForm.value.RequestById;
        this.docPickUpRequestObj.OfficeCode = this.DocPickupReqForm.value.OfficeCode;
        this.docPickUpRequestObj.OfficeId = this.DocPickupReqForm.value.OfficeId;
        this.docPickUpRequestObj.AppCustAddrObjs = this.appCustAddrListObj;

        this.httpClient.post(URLConstant.AddDocPickupRequest, this.docPickUpRequestObj).subscribe(
          (response) => {
            this.toastr.successMessage(response['message']);
          }
        )
      }
    )
  }
}