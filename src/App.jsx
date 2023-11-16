import './App.css';
import Checkout from './components/checkoutdialog/Checkout';
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
        <Checkout />
      </Provider>
    </div>
  );
}

export default App;
