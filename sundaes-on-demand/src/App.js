import Container from "react-bootstrap/Container";
import OrderEntry from "./pages/entry/OrderEntry";
import {OrderDetailsProvider} from "./context/OrderDetails";
import {useState} from "react";
import OrderSummary from "./pages/summary/OrderSummary";
import OrderConfirmation from "./pages/confirmation/OrderConfirmation";


function App() {
    const [orderPhase, setOrderPhase] = useState('inProgress');
    let Component = OrderEntry;
    switch (orderPhase){
        case 'inProgress':
            Component = OrderEntry;
            break;
        case 'review':
            Component = OrderSummary;
            break;
        case 'completed':
            Component = OrderConfirmation;
            break;
        default:
    }

    return (
        <OrderDetailsProvider>
            <Container>

                {/* Summary page and entry page need provider */}
                {<Component setOrderPhase={setOrderPhase}/>}

            </Container>
        </OrderDetailsProvider>

    );
}

export default App;
