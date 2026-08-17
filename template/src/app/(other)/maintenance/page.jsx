import logoDark from '@/assets/images/logo-dark.png';
import logo from '@/assets/images/logo.png';
import maintenance from '@/assets/images/png/maintenance.png';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const MaintenancePage = () => {
  return <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xl={3} lg={4} md={6}>
          <Card className="overflow-hidden text-center rounded-4 p-xxl-4 p-3 mb-0">
            <Link to="/" className="auth-brand mb-3">
              <img src={logoDark} alt="dark logo" height={26} className="logo-dark" />
              <img src={logo} alt="logo light" height={26} className="logo-light" />
            </Link>
            <div>
              <h3 className="fw-semibold text-dark">Ooop's ! </h3>
            </div>
            <img src={maintenance} alt="maintenance" className="img-fluid mt-3" height={320} />
            <h5 className="fw-semibold my-3 fs-20 text-dark lh-base">We are under scheduled maintenance</h5>
            <Link to="/" className="btn btn-primary fw-medium">
              Contact Site Owner
            </Link>
          </Card>
        </Col>
      </Row>
    </div>;
};
export default MaintenancePage;