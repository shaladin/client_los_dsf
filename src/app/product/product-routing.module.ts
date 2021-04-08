import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathConstant } from 'app/shared/constant/PathConstant';
import { ProdHoAddDetailComponent } from './product-ho/prod-ho-add-detail/prod-ho-add-detail.component';
import { ProdHoAddComponent } from './product-ho/prod-ho-add/prod-ho-add.component';
import { ProdHoApvDetailComponent } from './product-ho/prod-ho-apv/prod-ho-apv-detail/prod-ho-apv-detail.component';
import { ProdHoApvPagingComponent } from './product-ho/prod-ho-apv/prod-ho-apv-paging/prod-ho-apv-paging.component';
import { ProdHoDeactApvDetailComponent } from './product-ho/prod-ho-deact-apv/prod-ho-deact-apv-detail/prod-ho-deact-apv-detail.component';
import { ProdHoDeactApvPagingComponent } from './product-ho/prod-ho-deact-apv/prod-ho-deact-apv-paging/prod-ho-deact-apv-paging.component';
import { ProdHoDeactDetailComponent } from './product-ho/prod-ho-deact/prod-ho-deact-detail/prod-ho-deact-detail.component';
import { ProdHoDeactPagingComponent } from './product-ho/prod-ho-deact/prod-ho-deact-paging/prod-ho-deact-paging.component';
import { ProdHoPagingComponent } from './product-ho/prod-ho-paging/prod-ho-paging.component';
import { ProdHoReturnPagingComponent } from './product-ho/prod-ho-return-paging/prod-ho-return-paging.component';
import { ProdHoRvwDetailComponent } from './product-ho/prod-ho-review/prod-ho-rvw-detail/prod-ho-rvw-detail.component';
import { ProdHoRvwPagingComponent } from './product-ho/prod-ho-review/prod-ho-rvw-paging/prod-ho-rvw-paging.component';
import { ProdOfferingAddDetailComponent } from './product-offering/prod-offering-add-detail/prod-offering-add-detail.component';
import { ProdOfferingAddComponent } from './product-offering/prod-offering-add/prod-offering-add.component';
import { ProdOfferingApvDetailComponent } from './product-offering/prod-offering-apv-detail/prod-offering-apv-detail.component';
import { ProdOfferingApvPagingComponent } from './product-offering/prod-offering-apv-paging/prod-offering-apv-paging.component';
import { ProdOfferingDeactApvDetailComponent } from './product-offering/prod-offering-deact-apv/prod-offering-deact-apv-detail/prod-offering-deact-apv-detail.component';
import { ProdOfferingDeactApvPagingComponent } from './product-offering/prod-offering-deact-apv/prod-offering-deact-apv-paging/prod-offering-deact-apv-paging.component';
import { ProdOfferingDeactDetailComponent } from './product-offering/prod-offering-deact/prod-offering-deact-detail/prod-offering-deact-detail.component';
import { ProdOfferingDeactPagingComponent } from './product-offering/prod-offering-deact/prod-offering-deact-paging/prod-offering-deact-paging.component';
import { ProdOfferingPagingComponent } from './product-offering/prod-offering-paging/prod-offering-paging.component';
import { ProdOfferingReturnPagingComponent } from './product-offering/prod-offering-return-paging/prod-offering-return-paging.component';
import { ProdOfferingRvwDetailComponent } from './product-offering/prod-offering-review/prod-offering-rvw-detail/prod-offering-rvw-detail.component';
import { ProdOfferingRvwPagingComponent } from './product-offering/prod-offering-review/prod-offering-rvw-paging/prod-offering-rvw-paging.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: PathConstant.PROD_OFFERING_PAGING,
        component: ProdOfferingPagingComponent,
        data: {
          title: 'Paging'
        },
      },
      {
        path: PathConstant.PROD_OFFERING_RTN_PAGING,
        component: ProdOfferingReturnPagingComponent,
        data: {
          title: 'Return Paging'
        },
      },
      {
        path: PathConstant.PROD_OFFERING_ADD,
        component: ProdOfferingAddComponent,
        data: {
          title: 'Add'
        },
      },
      {
        path: PathConstant.PROD_OFFERING_ADD_DETAIL,
        component: ProdOfferingAddDetailComponent,
        data: {
          title: 'Add Detail'
        },
      },
      {
        path: PathConstant.HO_PAGING,
        component: ProdHoPagingComponent,
        data: {
            title: 'Product HO Paging'
        }
    },
    {
        path: PathConstant.HO_RTN_PAGING,
        component: ProdHoReturnPagingComponent,
        data: {
            title: 'Product Return HO Paging'
        }
    },
    {
        path: PathConstant.HO_ADD,
        component: ProdHoAddComponent,
        data: {
            title: 'Product HO Add'
        }
    },
    {
      path: PathConstant.HO_ADD_DETAIL,
      component: ProdHoAddDetailComponent,
      data: {
        title: 'Product HO Add Detail'
      }
    },
    {
      path: PathConstant.HO_DEACTIVATE,
      component: ProdHoDeactPagingComponent,
      data: {
        title: 'Product HO Deactivate Paging'
      }
    },
    {
      path: PathConstant.HO_DEACTIVATE_EDIT,
      component: ProdHoDeactDetailComponent,
      data: {
        title: 'Product HO Deactivate'
      }
    },
    {
      path: PathConstant.HO_APPRV,
      component: ProdHoApvPagingComponent,
      data: {
        title: 'Product HO Approval'
      }
    },
    {
      path: PathConstant.HO_APPRV_DETAIL,
      component: ProdHoApvDetailComponent,
      data: {
        title: 'Product HO Approval Detail'
      }
    },
    {
      path: PathConstant.OFFERING_APPRV,
      component: ProdOfferingApvPagingComponent,
      data: {
        title: 'Product Offering Approval'
      }
    },
    {
      path: PathConstant.OFFERING_APPRV_DETAIL,
      component: ProdOfferingApvDetailComponent,
      data: {
        title: 'Product Offering Approval Detail'
      }
    },
    {
      path: PathConstant.HO_DEACTIVATE_APPRV,
      component: ProdHoDeactApvPagingComponent,
      data: {
        title: 'Product HO Deactivate Approval'
      }
    },
    {
      path: PathConstant.HO_DEACTIVATE_APPRV_DETAIL,
      component: ProdHoDeactApvDetailComponent,
      data: {
        title: 'Product HO Deactivate Approval Detail'
      }
    },
    {
      path: PathConstant.OFFERING_DEACTIVATE,
      component: ProdOfferingDeactPagingComponent,
      data: {
        title: 'Product Offering Deactivate Paging'
      }
    },
    {
      path: PathConstant.OFFERING_DEACTIVATE_EDIT,
      component: ProdOfferingDeactDetailComponent,
      data: {
        title : 'Product Offering Deactivate'
      }
    },
    {
      path: PathConstant.OFFERING_DEACTIVATE_APPRV,
      component: ProdOfferingDeactApvPagingComponent,
      data: {
        title: 'Product Offering Deactivate Approval'
      }
    },
    {
      path: PathConstant.OFFERING_DEACTIVATE_APPRV_DETAIL,
      component: ProdOfferingDeactApvDetailComponent,
      data: {
        title: 'Product Offering Deactivate Approval Detail'
      }
    },
    {
      path: PathConstant.HO_REVIEW_DETAIL,
      component: ProdHoRvwDetailComponent,
      data: {
        title: 'Product HO Review'
      }
    },
    {
      path: PathConstant.HO_REVIEW,
      component: ProdHoRvwPagingComponent,
      data: {
        title: 'Product HO Review Paging'
      }
    },
    {
      path: PathConstant.OFFERING_REVIEW_DETAIL,
      component: ProdOfferingRvwDetailComponent,
      data: {
        title: 'Product Offering Review'
      }
    },
    {
      path: PathConstant.OFFERING_REVIEW,
      component: ProdOfferingRvwPagingComponent,
      data: {
        title: 'Product Offering Review Paging'
      }
    },
  ]
}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
