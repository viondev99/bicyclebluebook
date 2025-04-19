import React, { FC } from 'react';
import { ComponentStatic } from '../../model/common';
import { renderMainLayout } from '../../layout/MainLayout/MainLayout';

const Development: FC & ComponentStatic = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-center flex-column"
      style={{ minHeight: 400 }}>
      <h1>404!!</h1>
      <h3 className="mt-4">The page you requested was not found!</h3>
    </div>
  );
};

Development.renderLayout = renderMainLayout;

export default Development;
