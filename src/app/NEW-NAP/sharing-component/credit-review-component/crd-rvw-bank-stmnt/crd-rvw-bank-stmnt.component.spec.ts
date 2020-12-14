import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwBankStmntComponent } from './crd-rvw-bank-stmnt.component';

describe('CrdRvwBankStmntComponent', () => {
  let component: CrdRvwBankStmntComponent;
  let fixture: ComponentFixture<CrdRvwBankStmntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwBankStmntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwBankStmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
