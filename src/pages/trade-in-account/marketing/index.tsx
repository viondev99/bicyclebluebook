import React, { FC } from 'react';
import { universalRedirect } from 'helpers/ssr.helper';
import { NextPageContext } from 'next';
import { ComponentStatic } from 'model/common';
import PartnerPortalLayout from 'layout/Account/Partner';
import { withInjectAllSaga } from '../../../hocs/withAllSagaInjected';

const Marketing: FC & ComponentStatic = () => {
  return (
    <PartnerPortalLayout titleMobile={'Marketing'}>
      <div>{` `}</div>
    </PartnerPortalLayout>
  );
};

Marketing.getInitialProps = async (ctx: NextPageContext) => {
  await universalRedirect(ctx)('/trade-in-account/marketing/digital');
};

export default withInjectAllSaga(Marketing);
