// // eslint-disable-next-line import/no-cycle
import { addGTM, loadScript } from './aem.js';

const gtmSrc = 'https://www.googletagmanager.com/gtm.js?id=GTM-WJFTM96J';

await loadScript(gtmSrc, {
  async: 'true',
});

addGTM();
