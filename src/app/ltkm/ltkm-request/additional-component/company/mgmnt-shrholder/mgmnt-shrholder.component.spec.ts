import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MgmntShrholderComponent } from 'app/NEW-NAP/sharing-component/cust-completion-component/mgmnt-shrholder/mgmnt-shrholder.component';

describe('MgmntShrholderComponent', () => {
  let component: MgmntShrholderComponent;
  let fixture: ComponentFixture<MgmntShrholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmntShrholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmntShrholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
