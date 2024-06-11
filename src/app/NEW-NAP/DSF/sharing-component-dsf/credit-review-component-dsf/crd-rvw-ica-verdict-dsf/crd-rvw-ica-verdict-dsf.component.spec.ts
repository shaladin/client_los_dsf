import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwIcaVerdictDsfComponent } from './crd-rvw-ica-verdict-dsf.component';

describe('CrdRvwIcaVerdictDsfComponent', () => {
  let component: CrdRvwIcaVerdictDsfComponent;
  let fixture: ComponentFixture<CrdRvwIcaVerdictDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwIcaVerdictDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwIcaVerdictDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
