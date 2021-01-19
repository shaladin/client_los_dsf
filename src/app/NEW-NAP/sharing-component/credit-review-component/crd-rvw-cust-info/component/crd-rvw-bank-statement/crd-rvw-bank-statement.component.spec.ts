import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwBankStatementComponent } from './crd-rvw-bank-statement.component';

describe('CrdRvwBankStatementComponent', () => {
  let component: CrdRvwBankStatementComponent;
  let fixture: ComponentFixture<CrdRvwBankStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwBankStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
