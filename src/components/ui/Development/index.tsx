import React, { FC } from 'react';
import { renderMainLayout } from '../../../layout/MainLayout/MainLayout';
import { ComponentStatic } from '../../../model/common';

const Development: FC & ComponentStatic = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
      <h3>This page is under development!!</h3>
    </div>
  );
};

Development.renderLayout = renderMainLayout;

export default Development;
