import logoDark from '@/assets/images/logo-dark.png';
import logo from '@/assets/images/logo.png';
import { currentYear, developedBy } from '@/context/constants';
import { Card, Col, Row } from 'react-bootstrap';
import CreatePass from './components/CreatePass';
import { Link } from 'react-router-dom';
const CreatePasswordPage = () => {
  return <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xl={4} lg={5} md={6}>
          <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
            <Link to="/" className="auth-brand mb-4">
              <img src={logoDark} alt="dark logo" height={26} className="logo-dark" />
              <img src={logo} alt="logo light" height={26} className="logo-light" />
            </Link>
            <h4 className="fw-semibold mb-2 fs-20">Create New Password</h4>
            <p className="text-muted mb-2">Please create your new password.</p>
            <p className="mb-4">
              Need password suggestion ?
              <Link to="" className="link-dark fw-semibold text-decoration-underline">
                Suggestion
              </Link>
            </p>
            <CreatePass />
            <p className="text-muted fs-14 mb-4">
              Back To
              <Link to="/auth/login" className="fw-semibold text-danger ms-1">
                Login !
              </Link>
            </p>
            <p className="mt-auto mb-0">
              {currentYear} © Abstack - By <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">{developedBy}</span>
            </p>
          </Card>
        </Col>
      </Row>
    </div>;
};
export default CreatePasswordPage;