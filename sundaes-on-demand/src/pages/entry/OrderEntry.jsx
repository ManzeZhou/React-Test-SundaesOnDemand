import Options from "./Options";
import useOrderDetails from "../../context/OrderDetails";
import {formatCurrency} from "../../utilities";

export default function OrderEntry({setOrderPhase}) {

    const { totals } = useOrderDetails();
    return (<div>
        <Options optionType='scoops' />
        <Options optionType='toppings' />
            <h2>Grand total: {formatCurrency(totals.scoops + totals.toppings)}</h2>
    </div>
)}