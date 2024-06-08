import './page.style.css';

import { Fragment } from 'react';

export default function AboutPage() {
  return (
    <Fragment>
      Ranked Voting Online is an <a href='https://github.com/FemenSB/voting_client'target='_blank' rel='noreferrer'>open-source</a> project developed by Felipe Borsato
      <br />
      Elements from its UI are based on <a href='https://www.figma.com/community/file/958198956095698455/tini-design-system' target='_blank' rel='noreferrer'>Tini Design System</a>, licensed under <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank' rel='noreferrer'>CC BY 4.0</a>
      <br />
      This project uses the Inter typeface, licensed under the <a href='/open_font_license.txt' target='_blank' rel='noreferrer'>SIL Open Font License</a>.
    </Fragment>
  );
}
