import PageTitle from '@/components/PageTitle';
import { Row } from 'react-bootstrap';
import CalendarPage from './components/CalendarPage';
const CalendarPageMain = () => {
  return <>
      <PageTitle title="Calendar" />
      <Row>
        <CalendarPage />
      </Row>
    </>;
};
export default CalendarPageMain;