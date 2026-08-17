import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper';
import configureFakeBackend from './helpers/fake-backend';
import AppRouter from './routes/router';
import 'flatpickr/dist/flatpickr.min.css';
import '@/assets/scss/app.scss';
configureFakeBackend();
function App() {
  return <>
      <AppProvidersWrapper>
        <AppRouter />
      </AppProvidersWrapper>
    </>;
}
export default App;