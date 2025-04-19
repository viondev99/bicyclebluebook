import React from 'react';
import { renderMainLayout } from 'layout/MainLayout/MainLayout';
import AboutGuide from 'components/Article/AboutValueGuide';

function About() {
  return <AboutGuide />;
}

export default About;
About.renderLayout = renderMainLayout;
