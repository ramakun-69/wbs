import FallbackLoading from '@/components/FallbackLoading';
import { Suspense } from 'react';
const OtherLayout = ({
  children
}) => {
  return <Suspense fallback={<FallbackLoading />}>{children}</Suspense>;
};
export default OtherLayout;