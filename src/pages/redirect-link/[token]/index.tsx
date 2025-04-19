import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Container from 'reactstrap/lib/Container';
import { ComponentStatic } from 'model/common';
import { pxToRem } from 'helpers/common.helper';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import { impersonate } from 'store/authenticate/authenticate.action';
import Card from '@ui/Cards';

const RedirectLink: FC & ComponentStatic = () => {
  const dispatch = useDispatch();
  const { query, replace } = useRouter();

  useEffect(() => {
    if (query.token) {
      dispatch(impersonate(query.token));
    } else {
      replace('/');
    }
    // eslint-disable-next-line
  }, [query.token, dispatch]);

  return (
    <Container>
      <Card style={{ maxWidth: 450, margin: '120px auto', padding: '40px' }}>
        <p style={{ textAlign: 'center', fontSize: pxToRem(37), marginTop: 30, marginBottom: 0, fontWeight: 700 }}>
          we are logging...
        </p>
      </Card>
    </Container>
  );
};

RedirectLink.getInitialProps = async () => {
  return {};
};

RedirectLink.renderLayout = renderMainLayout;

export default RedirectLink;
