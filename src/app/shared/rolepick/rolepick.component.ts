import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstant } from '../constant/CommonConstant';
import { AdInsConstant } from '../AdInstConstant';
import { StorageService } from '../services/StorageService';
import { UcDropdownSearchConstant, UcDropdownSearchObj } from '../model/library/uc-dropdown-search-obj.model';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-rolepick',
  templateUrl: './rolepick-new.component.html',
  styleUrls: ['./rolepick.component.css']
})
export class RolepickComponent implements OnInit, AfterViewInit {
  listRole: any;
  refUser: any;
  officeDropdownSearchObj: UcDropdownSearchObj = new UcDropdownSearchObj();
  rolesDropdownSearchObj: UcDropdownSearchObj = new UcDropdownSearchObj();
  selectedOffice: number = -1;
  selectedRole: number= -1;
  tempList: Array<any> = new Array<any>();
  sizeDropdown: number = 3;

  RolepickForm = this.fb.group({
    Office: ['', [Validators.required]],
    Role: ['', [Validators.required]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private http: HttpClient, private router: Router, public dialog: MatDialog, private cookieService: CookieService, private strService: StorageService) {
    this.refUser = data["response"];
    this.listRole = data["response"]["RefUserRoles"];
  }

  ngOnInit() {
    this.officeDropdownSearchObj.ddsType = UcDropdownSearchConstant.DDL_TYPE_ONE;
    this.officeDropdownSearchObj.isObject = true;
    this.officeDropdownSearchObj.placeholder = "Choose your office";
    this.officeDropdownSearchObj.isSelectOutput = true;
    this.officeDropdownSearchObj.customKey = "OfficeCode";
    this.officeDropdownSearchObj.customValue = "OfficeName";
    this.officeDropdownSearchObj.isCustomList = true;

    this.rolesDropdownSearchObj.ddsType = UcDropdownSearchConstant.DDL_TYPE_ONE;
    this.rolesDropdownSearchObj.isObject = true;
    this.rolesDropdownSearchObj.placeholder = "Choose your role";
    this.rolesDropdownSearchObj.isSelectOutput = true;
    this.rolesDropdownSearchObj.customKey = "JobTitleAndRoleName";
    this.rolesDropdownSearchObj.customValue = "JobTitleAndRoleName";
    this.rolesDropdownSearchObj.isCustomList = true;
  }

  ngAfterViewInit(): void {
  }

  setRole(event) {
    this.selectedRole = event.selectedObj.Index;
  }

  setOffice(event) {
    this.selectedOffice = event.selectedObj.Index;
    this.selectedRole = 0;
    this.rolesDropdownSearchObj.size = (this.listRole[event.selectedObj.Index].Roles.length) + 1;;
    this.RolepickForm.patchValue({
      Office: event.selectedObj.OfficeName,
      Role: this.listRole[event.selectedObj.Index].Roles[0].JobTitleAndRoleName
    });
    this.rolesDropdownSearchObj.ddsValue = this.listRole[event.selectedObj.Index].Roles[0].JobTitleAndRoleName;
  }

  SpinnerHeaders = new HttpHeaders({
    'IsLoading': "true"
  });
  SpinnerOptions = { headers: this.SpinnerHeaders, withCredentials: true };
  chooseRole() {
    var UserIdentityObj = {
      RefUserId: this.refUser.RefUserId,
      UserName: this.refUser.Username,
      EmpNo: this.refUser.EmpNo,
      EmpName: this.refUser.EmpName,
      OfficeId: this.listRole[this.selectedOffice].RefOfficeId,
      OfficeCode: this.listRole[this.selectedOffice].OfficeCode,
      OfficeName: this.listRole[this.selectedOffice].OfficeName,
      MrOfficeTypeCode: this.listRole[this.selectedOffice].MrOfficeTypeCode,
      RoleId: this.listRole[this.selectedOffice].Roles[this.selectedRole].RefRoleId,
      RoleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].RoleCode,
      RoleName: this.listRole[this.selectedOffice].Roles[this.selectedRole].RoleName,
      JobTitleId: this.listRole[this.selectedOffice].Roles[this.selectedRole].RefJobTitleId,
      JobTitleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].JobTitleCode,
      JobTitleName: this.listRole[this.selectedOffice].Roles[this.selectedRole].JobTitleName,
      BusinessDt: this.refUser.BusinessDt,
      BusinessDtStr: this.refUser.BusinessDtStr,
      Email: this.refUser.Email1,
      CoyName: this.refUser.CoyName
    }
    var roleObject = {
      UserName: this.refUser.Username,
      Password: this.data.pwd,
      OfficeCode: this.listRole[this.selectedOffice].OfficeCode,
      RoleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].RoleCode,
      JobTitleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].JobTitleCode,
      RequestDateTime: this.refUser.BusinessDt,
      ModuleCode: environment.Module,
      RowVersion: "",
      UserIdentityObj: UserIdentityObj
    };

    if (this.data.pwd == null) {
      this.http.post(AdInsConstant.UpdateTokenV2_1, roleObject, this.SpinnerOptions).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)
          var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
          AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "XSRF-TOKEN", response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
          AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
          AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
          AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));
          AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);

          this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).subscribe(
            (response) => {
              AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
              this.strService.set(AdInsConstant.WatchRoleState, true);
              this.router.navigateByUrl(NavigationConstant.DASHEMPTY, { skipLocationChange: true }).then(() => {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {}, true);
              });
              this.dialog.closeAll();
            });
        }
      );

    }
    else {
      this.http.post(AdInsConstant.LoginByRoleV2, roleObject, this.SpinnerOptions).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)

          this.http.post(AdInsConstant.CheckUserSessionLog, roleObject, this.SpinnerOptions).subscribe(
            (response) => {});
          
          var DateParse = formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US');
          AdInsHelper.SetCookie(this.cookieService, CommonConstant.TOKEN, response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "XSRF-TOKEN", response['Token']);
          AdInsHelper.SetCookie(this.cookieService, "BusinessDateRaw", formatDate(response["Identity"].BusinessDt, 'yyyy/MM/dd', 'en-US'));
          AdInsHelper.SetCookie(this.cookieService, "BusinessDate", DateParse);
          AdInsHelper.SetCookie(this.cookieService, "UserAccess", JSON.stringify(response["Identity"]));
          AdInsHelper.SetCookie(this.cookieService, "Username", JSON.stringify(response["Identity"]["UserName"]));
          AdInsHelper.SetLocalStorage(CommonConstant.ENVIRONMENT_MODULE, environment.Module);

          this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: this.listRole[this.selectedOffice].Roles[this.selectedRole].RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).subscribe(
            (response) => {
              AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
              this.router.navigate([NavigationConstant.DASHBOARD]);
              this.dialog.closeAll();
            });
        }
      );
    }
  }
}
