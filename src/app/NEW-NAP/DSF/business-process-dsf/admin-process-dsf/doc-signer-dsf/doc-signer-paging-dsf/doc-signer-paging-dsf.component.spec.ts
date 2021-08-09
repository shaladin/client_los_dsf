import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocSignerPagingDsfComponent } from './doc-signer-paging-dsf.component';

describe('DocSignerPagingDsfComponent', () => {
  let component: DocSignerPagingDsfComponent;
  let fixture: ComponentFixture<DocSignerPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocSignerPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocSignerPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
