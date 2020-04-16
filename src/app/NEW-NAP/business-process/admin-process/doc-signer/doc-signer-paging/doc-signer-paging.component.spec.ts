import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSignerPagingComponent } from './doc-signer-paging.component';

describe('DocSignerPagingComponent', () => {
  let component: DocSignerPagingComponent;
  let fixture: ComponentFixture<DocSignerPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSignerPagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSignerPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
