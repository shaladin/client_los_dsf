import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwCmoInfoComponent } from './crd-rvw-cmo-info.component';

describe('CrdRvwCmoInfoComponent', () => {
  let component: CrdRvwCmoInfoComponent;
  let fixture: ComponentFixture<CrdRvwCmoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwCmoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwCmoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
