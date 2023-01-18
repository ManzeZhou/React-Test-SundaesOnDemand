import {screen, render} from "../../../test-utils/testing-library-utils";
import Options from "../Options";
import userEvent from "@testing-library/user-event";
import {OrderDetailsProvider} from "../../../context/OrderDetails";


test('updates scoop subtotal when scoops change', async () => {
    const user = userEvent.setup();

    render(<Options optionType='scoops' />);

    // make sure total starts out at $0.00
    const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
    expect(scoopsSubtotal).toHaveTextContent("0.00");

    // update vanilla scoop to 1 and check subtotal
    const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'});

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');
    expect(scoopsSubtotal).toHaveTextContent('2.00');

    // update chocolate scoop to 2 and check subtotal
    const chocolateInput = await screen.findByRole('spinbutton', {name: 'Chocolate'});

    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');
    // scoop is $2 each
    expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('updates toppings subtotal when toppings change', async () => {
    const user = userEvent.setup();
    render(<Options optionType='toppings' /> );

    // make sure subtotal starts out at 0.00
    const toppingsTotal = screen.getByText('Toppings total: $', {exact: false});
    expect(toppingsTotal).toHaveTextContent('0.00');

    // add cherries and check subtotal
    const cherriesCheckbox = await screen.findByRole('checkbox', { name: 'Cherries'});
    await user.click(cherriesCheckbox);
    // each topping costs $1.50
    expect(toppingsTotal).toHaveTextContent('1.50');

    // add hot fudge and check subtotal
    // do not need to await since the page is loaded after finding cherry
    const hotFudgeCheckbox =  screen.getByRole('checkbox', {name: 'Hot fudge'});
    await user.click(hotFudgeCheckbox);
    expect(toppingsTotal).toHaveTextContent('3.00');

    //remove hot fudge and check subtotal
    await user.click(hotFudgeCheckbox);
    expect(toppingsTotal).toHaveTextContent('1.50');

})