import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppPagingComponent } from "./app-paging/app-paging.component";
import { AppAddComponent } from "./app-add/app-add.component";
import { AppAddDetailComponent } from "./app-add-detail/app-add-detail.component";
import { AppReferantorComponent } from "./nap-tab/app-referantor/app-referantor.component";
import { AppModelComponent } from "./nap-tab/app-model/app-model.component";
import { CustomerDataComponent } from "./nap-tab/customer-data/customer-data.component";
import { AppGuarantorComponent } from "./nap-tab/app-guarantor/app-guarantor.component";
import { GuarantorCompanyComponent } from "./nap-tab/app-guarantor/guarantor-company/guarantor-company.component";
import { GuarantorPagingComponent } from "./nap-tab/app-guarantor/guarantor-paging/guarantor-paging.component";
import { GuarantorPersonalComponent } from "./nap-tab/app-guarantor/guarantor-personal/guarantor-personal.component";
import { AppLifeInsComponent } from "./nap-tab/app-life-ins/app-life-ins.component";
import { CommissionPagingComponent } from "./commission-paging/commission-paging.component";
import { CommissionAddComponent } from "./commission-add/commission-add.component";
import { AppTcComponent } from "./nap-tab/app-tc/app-tc.component";
import { AppFinDataComponent } from "./nap-tab/app-fin-data/app-fin-data.component";
import { InsuranceDataComponent } from "./nap-tab/insurance-data/insurance-data.component";
import { AssetDataComponent } from "./nap-tab/asset-data/asset-data.component";
import { RsvFundPagingComponent } from "./reserved-fund/reserved-fund-paging/reserved-fund-paging.component";
import { RsvFundViewComponent } from "./reserved-fund/reserved-fund-view/reserved-fund-view.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'AppPaging',
        component: AppPagingComponent,
        data: {
          title: 'Paging'
        }
      },
      {
        path: 'AppAdd',
        component: AppAddComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'AppAddDetail',
        component: AppAddDetailComponent,
        data: {
          title: 'AddDetail'
        }
      },
      {
        path: 'AppReferantor',
        component: AppReferantorComponent,
        data: {
          title: 'Referantor'
        }
      },
      {
        path: 'AppModel',
        component: AppModelComponent,
        data: {
          title: 'Model'
        }
      },
      {
        path: 'CustData',
        component: CustomerDataComponent,
        data: {
          title: 'Customer Data'
        }
      },
      {
          path: 'InsuranceData',
          component: InsuranceDataComponent,
          data: {
              title: 'Insurance Data'
          }
      },
      {
        path: 'Guarantor/paging',
        component: GuarantorPagingComponent,
        data: {
          title: 'Paging'
        },
      },
      {
        path: 'Guarantor/personal',
        component: GuarantorPersonalComponent,
        data: {
          title: 'Personal'
        },
      },
      {
        path: 'Guarantor/company',
        component: GuarantorCompanyComponent,
        data: {
          title: 'Company'
        },
      },
      {
        path: 'Guarantor/Main',
        component: AppGuarantorComponent,
        data: {
          title: 'Main'
        },
      },
      {
        path: 'LifeIns',
        component: AppLifeInsComponent,
        data: {
          title: 'Life Insurance'
        },
      },
      {
        path: 'CommissionPaging',
        component: CommissionPagingComponent,
        data: {
          title: 'Commission Paging'
        }
      },
      {
        path: 'CommissionAdd',
        component: CommissionAddComponent,
        data: {
          title: 'Commission Add'
        }
      },
      {
        path: 'AppTC',
        component: AppTcComponent,
        data: {
          title: 'APP TC'
        },
      },
      {
      path: 'AssetData',
      component: AssetDataComponent,
      data: {
          title: 'Asset Data'
        },
      },
      {
          path: 'ReservedFund',
          component: RsvFundPagingComponent,
          data: {
              title: 'Reserved Fund Paging'
          }
      },
      {
          path: 'ReservedFund/View',
          component: RsvFundViewComponent,
          data: {
              title: 'Reserved Fund View'
          }
      },
      {
          path: 'AppFinData',
          component: AppFinDataComponent,
          data: {
              title: 'Commission Add'
          }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NapRoutingModule { }
