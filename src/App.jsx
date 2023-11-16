import './App.css';
import RestaurantDialog from './components/restaurantDialog/RestaurantDialog';
import Home from './screens/Home';
import { store } from './store/store';
import { Provider } from 'react-redux';
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Home />
        <RestaurantDialog />
      </Provider>
    </div>
  );
}

export default App;
