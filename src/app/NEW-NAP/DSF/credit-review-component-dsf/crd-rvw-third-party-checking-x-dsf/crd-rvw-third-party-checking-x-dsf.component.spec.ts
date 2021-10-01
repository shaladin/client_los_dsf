import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwThirdPartyCheckingXDsfComponent } from './crd-rvw-third-party-checking-x-dsf.component';

describe('CrdRvwThirdPartyCheckingXDsfComponent', () => {
  let component: CrdRvwThirdPartyCheckingXDsfComponent;
  let fixture: ComponentFixture<CrdRvwThirdPartyCheckingXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwThirdPartyCheckingXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwThirdPartyCheckingXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
