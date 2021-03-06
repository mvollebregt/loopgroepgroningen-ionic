import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {PrikbordService} from "../core/prikbord.service";
import * as moment from 'moment';
import {InstellingenService} from '../core/instellingen/instellingen.service';
import {NotificatieService} from '../core/notificatie.service';
import {UpgradeService} from '../core/upgrade.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) private nav: Nav;

  rootPage: string;
  pages = [];

  constructor(private instellingenService: InstellingenService,
              private notificatieService: NotificatieService,
              private platform: Platform,
              private prikbordService: PrikbordService,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private upgradeService: UpgradeService) {
    this.platform.ready().then(() => this.onPlatformReady());
    this.platform.resume.subscribe(() => this.onPlatformResume());
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private onPlatformReady(): void {
    moment.locale('nl');
    this.prikbordService.synchroniseer();
    this.upgradeService.upgrade().subscribe(null, null,() => {
      this.instellingenService.getInstellingen().subscribe(instellingen => this.ingelogdGewijzigd(instellingen.ingelogd, instellingen.demoModus));
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    })
  }

  private onPlatformResume(): void {
    this.prikbordService.synchroniseer();
  }

  private ingelogdGewijzigd(ingelogd: boolean, demoModus: boolean) {
    this.rootPage = ingelogd || demoModus ? 'PrikbordPage' : 'WelkomPage';
    this.toonMenuOpties(ingelogd);
    this.notificatieService.setNotificatiesOntvangen(ingelogd);
  }

  private toonMenuOpties(ingelogd: boolean) {
    this.pages = [];
    if (ingelogd) {
      this.pages.push({title: 'Laatste nieuws', component: 'NieuwsoverzichtPage', icon: 'paper'});
    }
    this.pages.push({title: 'Prikbord', component: 'PrikbordPage', icon: 'chatboxes'});
    this.pages.push({title: 'Agenda', component: 'AgendaPage', icon: 'calendar'});
    if (ingelogd) {
      this.pages.push({title: 'Trainingsschema', component: 'TrainingsschemaPage', icon: 'grid'});
    } else {
      this.pages.push({title: 'Inloggen', component: 'WelkomPage', icon: 'log-in'});
    }
  }
}
