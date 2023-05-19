import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailregisterComponent } from './mailregister.component';

describe('MailregisterComponent', () => {
  let component: MailregisterComponent;
  let fixture: ComponentFixture<MailregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
