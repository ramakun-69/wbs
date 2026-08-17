import React from 'react';
import Slope from './components/Slope';
import PageTitle from '@/components/PageTitle';
const slopePage = () => {
  return <>
      <PageTitle title="Slope Charts" subTitle="Apex" />
      <Slope />
    </>;
};
export default slopePage;