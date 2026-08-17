import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import InvoicesCard from './components/InvoicesCard';
const InvoicesPage = () => {
  return <>
      <PageTitle title="Invoices" subTitle="Invoices" />
      <Row>
        <Col xs={12}>
          <InvoicesCard />
        </Col>
      </Row>
    </>;
};
export default InvoicesPage;