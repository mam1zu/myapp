import logo from './logo.svg';
import './App.css';
import { LoginPage } from './LoginPage';
import { Home } from './Home';
import { handle } from 'express/lib/application';
function App() {

  //status: ログインしているかどうか
  const [status, setStatus] = useState(false);
  const [id, setId] = useState(null);

  function handleStatusChange(status) {
    setStatus(status);
  }

  const content = (status) => {
    return status ? <Home handleStatusChange={status => handleStatusChange(status)}/> : <LoginPage handleStatusChange={status => handleStatusChange(status)}/>
  }
  /*
  useEffect( () => {

  }
  , [status]
  ); */

  return (
    <div className="App">
      {content}
    </div>
  );
}

export default App;
