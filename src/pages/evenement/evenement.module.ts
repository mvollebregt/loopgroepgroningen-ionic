import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EvenementPage} from './evenement';
import {EvenementdetailClient} from './evenementdetail.client';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    EvenementPage,
  ],
  imports: [
    IonicPageModule.forChild(EvenementPage),
    SharedModule
  ],
  providers: [
    EvenementdetailClient
  ]
})
export class EvenementPageModule {}
