import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrdRvwAdditionalCollComponent } from './crd-rvw-additional-coll.component';

describe('CrdRvwAdditionalCollComponent', () => {
  let component: CrdRvwAdditionalCollComponent;
  let fixture: ComponentFixture<CrdRvwAdditionalCollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrdRvwAdditionalCollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrdRvwAdditionalCollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
