import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {Observable} from "rxjs/Observable";
import {AlertController} from 'ionic-angular';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {CANCELLED} from './CustomErrorHandler';
import {Login} from './login';
import {WachtwoordkluisService} from './wachtwoordkluis.service';

@Injectable()
export class LoginService {

  constructor(
    private alertController: AlertController,
    private httpService: HttpService,
    private wachtwoordkluisService: WachtwoordkluisService) {
  }

  login(): Observable<void> {
    return this.wachtwoordkluisService.haalLoginOp()
      .switchMap(login => this.probeerLogin(login))
      .map(() => {});
  }

  private probeerLogin(login: Login): Observable<void> {
    return this.submitLogin(login)
      .switchMap(success => {
        if (success) {
          return Observable.of(null);
        } else {
          // TODO: foutmelding tonen bij mislukte login
          return this.promptLogin(login)
            .do(login => this.wachtwoordkluisService.slaLoginOp(login))
            .switchMap(login => this.probeerLogin(login))
        }
      });
  }

  // Submit de login naar de website.
  // De observable geeft true terug als de gebruiker is ingelogd, en false als de inloggegevens onjuist waren.
  private submitLogin(login: Login): Observable<boolean> {
    if (!login) {
      // TODO: TOCH proberen in te loggen?!? (of in ieder geval als we in de browser zitten)
      return Observable.of(false);
    } else {
      return this.httpService
        .post(
          'index.php/loopgroep-groningen-ledeninfo',
          '#login-form',
          {
            username: login.username,
            password: login.password
          }, formData => formData['task'] === "user.login"
        )
        .map(this.httpService.extract(
          '#login-form input[name="task"]',
          node => {
            return node.getAttribute('value') !== 'user.login'
          }))
        .map(results => results && results[0]);
    }
  }

  // Toont een login prompt die vraagt om gebruikers en wachtwoord.
  // De observable geeft een Login-object terug als de gebruiker op de inloggen-knop drukt.
  // De observable gooit een error CANCELED als de gebruiker op Annuleren drukt.
  private promptLogin(login: Login) : Observable<Login> {
    const observable = new ReplaySubject<Login>();
    const alert = this.alertController.create({
      title: 'Inloggen',
      message: "Log in om alles te kunnen",
      inputs: [
        // TODO: opgeslagen dingen voorinvullen
        {name: 'username', placeholder: 'Gebruikersnaam', value: login ? login.username: ''},
        {name: 'password', placeholder: 'Wachtwoord', type: 'password', value: login ? login.password: ''}
      ],
      buttons: [
        {text: 'Annuleren', handler: () => { alert.dismiss(); observable.error(CANCELLED)}},
        {text: 'Inloggen', handler: login => observable.next(login)}
      ]
    });
    alert.present();
    return observable;
  }
}
