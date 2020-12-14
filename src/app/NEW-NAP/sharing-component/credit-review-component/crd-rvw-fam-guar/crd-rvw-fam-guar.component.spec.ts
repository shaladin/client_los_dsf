import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwFamGuarComponent } from './crd-rvw-fam-guar.component';

describe('CrdRvwFamGuarComponent', () => {
  let component: CrdRvwFamGuarComponent;
  let fixture: ComponentFixture<CrdRvwFamGuarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwFamGuarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwFamGuarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
