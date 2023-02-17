import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuratkonfirmasipersetujuanV2Component } from './suratkonfirmasipersetujuan-v2.component';

describe('SuratkonfirmasipersetujuanV2Component', () => {
  let component: SuratkonfirmasipersetujuanV2Component;
  let fixture: ComponentFixture<SuratkonfirmasipersetujuanV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuratkonfirmasipersetujuanV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuratkonfirmasipersetujuanV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
