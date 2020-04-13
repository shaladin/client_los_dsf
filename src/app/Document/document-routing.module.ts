import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentPagingComponent } from './document-paging/document-paging.component';
import { DocumentViewComponent } from './document-view/document-view.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'DocPrint/Paging',
        component: DocumentPagingComponent,
        data: {
          title: 'Document Printing Paging'
        }
      },
    {
      path: 'DocPrint/View',
      component: DocumentViewComponent,
      data: {
        title: 'Document Printing View'
      }
    },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule { }
