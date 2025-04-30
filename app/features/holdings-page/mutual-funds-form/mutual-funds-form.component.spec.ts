import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundsFormComponent } from './mutual-funds-form.component';

describe('MutualFundsFormComponent', () => {
  let component: MutualFundsFormComponent;
  let fixture: ComponentFixture<MutualFundsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualFundsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualFundsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
