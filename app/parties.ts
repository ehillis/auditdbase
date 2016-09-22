/* import {DemocratListPage} from './pages/preslist/democrat';
import {RepublicanListPage} from './pages/preslist/republican';
import {AmIndListPage} from './pages/preslist/amind';
import {GreenListPage} from './pages/preslist/green';
import {LibertarianListPage} from './pages/preslist/libertarian';
import {PeaceFreeListPage} from './pages/preslist/peacefree';
import {NppListPage} from './pages/preslist/npp';
*/
import {DEMOCRATS} from './democrat';
import {REPUBLICANS} from './republican';
import {NPPS} from './npp';
import {GREENS} from './green';
import {LIBERTARIANS} from './libertarian';
import {PEACEFREES} from './peacefree';
import {AMINDS} from './amind';
import {PROVS} from './prov';
import {DEMOCRATSDC} from './democratdc';

export var PARTIES: any[] = [
    { "mid": "democrat", "title": "Democratic", /* "page": DemocratListPage, */ "candidates": DEMOCRATS },
    { "mid": "republican", "title": "Republican", /* "page": RepublicanListPage, */ "candidates":REPUBLICANS },
    { "mid": "npp", "title": "No Party Preference", /* "page": NppListPage, */ "candidates":NPPS },
    { "mid": "green", "title": "Green", /* "page": GreenListPage, */ "candidates":GREENS },
    { "mid": "libertarian", "title": "Libertarian", /* "page": LibertarianListPage, */ "candidates":LIBERTARIANS },
    { "mid": "peacefree", "title": "Peace and Freedom", /* "page": PeaceFreeListPage, */ "candidates":PEACEFREES },
    { "mid": "amind", "title": "American Independent", /* "page": AmIndListPage, */ "candidates":AMINDS },
    { "mid": "prov", "title": "Provisional Ballots", /* "page": NppListPage, */ "candidates":PROVS },
    { "mid": "democrat-dc", "title": "Democratic", /* "page": DemocratListPage, */ "candidates": DEMOCRATSDC },
];
