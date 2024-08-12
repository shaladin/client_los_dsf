import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AdInsHelper } from '../AdInsHelper';
import { URLConstant } from '../constant/URLConstant';
import { NavigationConstant } from '../constant/NavigationConstant';
import { CookieService } from 'ngx-cookie';
import { formatDate } from '@angular/common';
import { CommonConstant } from '../constant/CommonConstant';
import { AdInsConstant } from '../AdInstConstant';
import { StorageService } from '../services/StorageService';
import { FormBuilder, Validators } from '@angular/forms';
import { UcDropdownSearchConstant, UcDropdownSearchObj } from '../model/library/uc-dropdown-search-obj.model';
@Component({
  selector: 'app-rolepick',
  templateUrl: './rolepick.component.html',
  styleUrls: ['./rolepick.component.css']
})
export class RolepickComponent implements OnInit, AfterViewInit {

  listRole: any;

  isUseNewRolepick: string = '';
  refUser: any;
  officeDropdownSearchObj: UcDropdownSearchObj = new UcDropdownSearchObj();
  rolesDropdownSearchObj: UcDropdownSearchObj = new UcDropdownSearchObj();
  selectedOffice: number = -1;
  selectedRole: number= -1;
  tempList: Array<any> = new Array<any>();
  sizeDropdown: number = 3;
  isReady: boolean = false;

  RolepickForm = this.fb.group({
    Office: ['', [Validators.required]],
    Role: ['', [Validators.required]],
  });


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private http: HttpClient, private router: Router, public dialog: MatDialog, private cookieService: CookieService, private strService: StorageService) {
      this.isUseNewRolepick = AdInsHelper.GetLocalStorage(CommonConstant.IS_USE_NEW_ROLEPICK);
      if(this.isUseNewRolepick == '0') {
        this.listRole = data["response"];
        console.log(this.listRole);
      }
      else {
        this.refUser = data["response"];
        this.listRole = data["response"]["RefUserRoles"];
      }
      this.isReady = true;
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

  chooseRole(item) {
    var UserIdentityObj = {
      RefUserId: item.RefUserId,
      UserName: item.UserName,
      EmpNo: item.EmpNo,
      EmpName: item.EmpName,
      OfficeId: item.RefOfficeId,
      OfficeCode: item.OfficeCode,
      OfficeName: item.OfficeName,
      MrOfficeTypeCode: item.MrOfficeTypeCode,
      RoleId: item.RefRoleId,
      RoleCode: item.RoleCode,
      RoleName: item.RoleName,
      JobTitleId: item.RefJobTitleId,
      JobTitleCode: item.JobTitleCode,
      JobTitleName: item.JobTitleName,
      BusinessDt: item.BusinessDt,
      BusinessDtStr: item.BusinessDtStr,
      Email: item.Email1,
      CoyName: item.CoyName
    }

    var roleObject = {
      UserName: this.data.user,
      Password: this.data.pwd,
      OfficeCode: item.OfficeCode,
      RoleCode: item.RoleCode,
      JobTitleCode: item.JobTitleCode,
      RequestDateTime: item.BusinessDt,
      ModuleCode: environment.Module,
      RowVersion: "",
      UserIdentityObj: UserIdentityObj
    };
    if (this.data.pwd == null) {
      this.http.post(AdInsConstant.UpdateTokenV2, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)

          AdInsHelper.StoreSession(response, this.cookieService);

          this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: item.RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).subscribe(
            (response) => {
              AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
              this.strService.set(AdInsConstant.WatchRoleState, true);
              this.router.navigateByUrl(NavigationConstant.DASHEMPTY, { skipLocationChange: true }).then(() => {
                AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {}, true);
              });
              this.dialog.closeAll();
            });
        });
    }
    else {
      this.http.post(AdInsConstant.LoginByRole, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)
          
          this.http.post(AdInsConstant.CheckUserSessionLog, roleObject, { withCredentials: true }).subscribe(
            (response) => {});

          AdInsHelper.StoreSession(response, this.cookieService);


          this.http.post(AdInsConstant.GetAllActiveRefFormByRoleCodeAndModuleCode, { RoleCode: item.RoleCode, ModuleCode: environment.Module }, { withCredentials: true }).subscribe(
            (response) => {
              AdInsHelper.SetLocalStorage(CommonConstant.MENU, JSON.stringify(response[CommonConstant.ReturnObj]));
              AdInsHelper.RedirectUrl(this.router, [NavigationConstant.DASHBOARD], {});
              this.dialog.closeAll();
            });
        }
      );
    }
  }

  chooseRoleNew() {
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
      this.http.post(AdInsConstant.UpdateTokenV2_1, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)
          AdInsHelper.StoreSession(response, this.cookieService);

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
      this.http.post(AdInsConstant.LoginByRoleV2, roleObject).subscribe(
        (response) => {
          //Cookie sudah diambil dari BE (Di set manual dulu)

          this.http.post(AdInsConstant.CheckUserSessionLog, roleObject).subscribe(
            (response) => {});
          
          AdInsHelper.StoreSession(response, this.cookieService);


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
