import {Bericht} from '../../core/bericht';

export interface Evenementdetail {

  start: string;
  einde: string;
  naam: string;
  categorie: string;
  omschrijving: string[];
  deelname: boolean;
  deelnemers: string[];
  reacties: Bericht[];

}
