import {useEffect, useState} from "react";
import axios from "axios";
import ScoopOption from "./ScoopOption";
import Row from "react-bootstrap/Row";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import {pricePerItem} from "../../constants";
import {formatCurrency} from "../../utilities";
import useOrderDetails from "../../context/OrderDetails";


export default function Options({ optionType }) {
    const [items, setItems] = useState([]);

    // if have an error
    const [error, setError] = useState(false);

    const { totals } = useOrderDetails();


    // optionType is 'scoops' or 'toppings
    useEffect(() => {
        // create an abortController to attach to network request
        // network call can be canceled when component exits
        const controller = new AbortController();
        axios
            .get(`http://localhost:3030/${optionType}`, {
                signal: controller.signal,
            })
            .then((response) => setItems(response.data))
            .catch((error) => {
                if(error.name !== 'CanceledError') {
                    setError(true)
                }
                }
              //  setError(true)
            );

        // abort axios call on component unmount
        return () => {
            controller.abort();
        };
    }, [optionType]);

    if (error) {
        // @ts-ignore
        return <AlertBanner />;
    }

    const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
    const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

    const optionItems = items.map((item) => (
        <ItemComponent
            key={item.name}
            name={item.name}
            imagePath={item.imagePath}
        />
    ));

    return (
        <>
            <h2>{title}</h2>
            <p>{formatCurrency(pricePerItem[optionType])} each</p>
            <p>{title} total: {formatCurrency(totals[optionType])}</p>
            <Row>{optionItems}</Row>
        </>

    );
}