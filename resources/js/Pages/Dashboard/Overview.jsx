import ReactApexChart from 'react-apexcharts';
import { ArrowDownLeft, ArrowUpRight, BarChart3, Landmark, MoreVertical } from 'lucide-react';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../Components/ui/Breadcrumb';
import { useTranslation } from 'react-i18next';

const stats = [
    ['Total Revenue', '$1.25M', '15.34%', '#5ecca7', [50, 85, 60, 100, 70, 45, 90, 75]],
    ['Products Sold', '48.7k', '10.12%', '#348cd4', [30, 60, 35, 80, 50, 25, 70, 55]],
    ['New Customers', '1.2k', '5.47%', '#f36977', [20, 40, 25, 50, 35, 15, 45, 30], true],
    ['Profit Margin', '38.5%', '8.21%', '#f9c222', [40, 70, 50, 90, 60, 35, 80, 65]],
];

const sparkOptions = (color) => ({ chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: false } }, colors: [color], stroke: { curve: 'smooth', width: 1 }, fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1 } }, tooltip: { enabled: false }, dataLabels: { enabled: false } });
const lineOptions = { chart: { toolbar: { show: false }, zoom: { enabled: false } }, colors: ['#02c0ce', '#777edd'], stroke: { width: [4, 4], curve: 'smooth', dashArray: [0, 8] }, dataLabels: { enabled: false }, markers: { size: 5 }, legend: { position: 'top' }, xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'] } };
const lineSeries = [{ name: 'Conversion Rate', data: [45, 60, -20, 60, 0, 45, -80, 65, -30, 58] }, { name: 'Average Sale Value', data: [-80, 60, 80, -40, 15, 60, -40, 80, -50, 2] }];
const barOptions = { chart: { toolbar: { show: false } }, colors: ['#0acf97'], plotOptions: { bar: { columnWidth: '50%', borderRadius: 5 } }, dataLabels: { enabled: false }, xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] } };
const barSeries = [{ name: 'Open Campaign', data: [89, 98, 68, 108, 77, 84, 51, 28, 92, 42, 88, 36] }];

function PanelHeader({ title }) { return <div className="d-flex card-header justify-content-between align-items-center"><h4 className="header-title">{title}</h4><MoreVertical size={18} /></div>; }

export default function DashboardOverview() {
    const {t} = useTranslation();
    return <>
       <Breadcrumb title={t('Dashboard')}/>
        <Row className="row-cols-xxl-4 row-cols-md-2 row-cols-1">
            {stats.map(([title, value, change, color, data, down]) => <Col key={title}><Card><CardBody><div className="d-flex align-items-start gap-2 justify-content-between"><div><h5 className="text-muted fs-13 fw-bold text-uppercase">{title}</h5><h3 className="mt-2 mb-1 fw-bold">{value}</h3><p className="mb-0 text-muted"><span className={`${down ? 'text-danger' : 'text-success'} me-1`}>{down ? '↓' : '↑'} {change}</span><span className="text-nowrap">Since last month</span></p></div><div className="avatar-lg flex-shrink-0"><span className="avatar-title bg-primary-subtle text-primary rounded fs-28">●</span></div></div></CardBody><div className="apex-charts"><ReactApexChart options={sparkOptions(color)} series={[{ data }]} height={45} type="area" /></div></Card></Col>)}
        </Row>
        <Row>
            <Col xl={7}><Card><PanelHeader title="Statistics" /><CardBody className="px-0 pt-0"><div className="bg-light bg-opacity-50"><Row className="text-center"><Col md={3} xs={6}><p className="text-muted mt-3 mb-1">Monthly Income</p><h4 className="mb-3"><ArrowDownLeft className="text-success me-1" />$35,200</h4></Col><Col md={3} xs={6}><p className="text-muted mt-3 mb-1">Monthly Expenses</p><h4 className="mb-3"><ArrowUpRight className="text-danger me-1" />$18,900</h4></Col><Col md={3} xs={6}><p className="text-muted mt-3 mb-1">Invested Capital</p><h4 className="mb-3"><BarChart3 className="me-1" />$5,200</h4></Col><Col md={3} xs={6}><p className="text-muted mt-3 mb-1">Available Savings</p><h4 className="mb-3"><Landmark className="me-1" />$8,100</h4></Col></Row></div><ReactApexChart options={lineOptions} series={lineSeries} height={310} type="line" /></CardBody></Card></Col>
            <Col xl={5}><Card><PanelHeader title="Total Revenue" /><CardBody className="px-0 pt-0" style={{ height: 455 }}><div className="border-top border-bottom border-light border-dashed"><Row className="text-center"><Col md={4}><p className="text-muted mt-3 mb-1">Revenue</p><h4 className="mb-3 text-success">$29.5k</h4></Col><Col md={4} className="border-start border-light border-dashed"><p className="text-muted mt-3 mb-1">Expenses</p><h4 className="mb-3 text-danger">$15.07k</h4></Col><Col md={4} className="border-start border-end border-light border-dashed"><p className="text-muted mt-3 mb-1">Investment</p><h4 className="mb-3">$3.6k</h4></Col></Row></div><ReactApexChart options={barOptions} series={barSeries} height={310} type="bar" /></CardBody></Card></Col>
        </Row>
    </>;
}
