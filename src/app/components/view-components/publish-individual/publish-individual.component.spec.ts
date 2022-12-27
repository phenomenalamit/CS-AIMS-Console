import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishIndividualComponent } from './publish-individual.component';

describe('PublishIndividualComponent', () => {
  let component: PublishIndividualComponent;
  let fixture: ComponentFixture<PublishIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishIndividualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
