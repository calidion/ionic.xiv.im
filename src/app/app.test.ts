import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

let app: MyApp;
let fixture: ComponentFixture<MyApp>;

describe('Component: Root Component', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp],

      providers: [

      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(MyApp);
    app = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    app = null;
  });

  it('is created', () => {

    expect(fixture).toBeTruthy();
    expect(app).toBeTruthy();

  });

  it('initialises with a root page of HomePage', () => {
    // console.log(app);
    expect(app['rootPage']).toBe(TabsPage);
  });

});