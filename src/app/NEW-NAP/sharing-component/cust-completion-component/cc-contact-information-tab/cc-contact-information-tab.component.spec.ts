import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcContactInformationTabComponent } from './cc-contact-information-tab.component';

describe('CcContactInformationTabComponent', () => {
  let component: CcContactInformationTabComponent;
  let fixture: ComponentFixture<CcContactInformationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcContactInformationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcContactInformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
