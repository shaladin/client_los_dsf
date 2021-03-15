import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwDiffWithMasterCustComponent } from './crd-rvw-diff-with-master-cust.component';

describe('CrdRvwDiffWithMasterCustComponent', () => {
  let component: CrdRvwDiffWithMasterCustComponent;
  let fixture: ComponentFixture<CrdRvwDiffWithMasterCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwDiffWithMasterCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwDiffWithMasterCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
