import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwThirdPartyCheckingDsfComponent } from './crd-rvw-third-party-checking-dsf.component';

describe('CrdRvwThirdPartyCheckingDsfComponent', () => {
  let component: CrdRvwThirdPartyCheckingDsfComponent;
  let fixture: ComponentFixture<CrdRvwThirdPartyCheckingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwThirdPartyCheckingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwThirdPartyCheckingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
