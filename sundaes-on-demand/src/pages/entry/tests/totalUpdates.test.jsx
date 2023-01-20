import {screen, render} from "../../../test-utils/testing-library-utils";
import Options from "../Options";
import userEvent from "@testing-library/user-event";
import OrderEntry from "../OrderEntry";


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

});

describe('grand total', () => {
    test('grand total starts at $0.00', () => {
        // test the total starts out at $0

        // unmount the component before test exits
        const {unmount} = render(<OrderEntry />);
        const grandTotal = screen.getByRole('heading', {name: /Grand total: \$/ });
        expect(grandTotal).toHaveTextContent('0.00');

        unmount();
    });

    test('grand total updates properly if scoop is added first', async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);
        const grandTotal = screen.getByRole('heading', {name: /Grand total: \$/ });

        // update vanilla scoops to 2 and check grand total
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'});
        await user.clear(vanillaInput);
        await user.type(vanillaInput, '2');
        expect(grandTotal).toHaveTextContent('4.00');

        // add cherries and check grand total
        const cherriesCheckbox = await screen.findByRole('checkbox', {name: 'Cherries'});
        await user.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent('5.50');
    });

    test('grand total updates properly if toppings is added first', async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);

        // add cherries and check grand total
        const cherriesCheckbox = await screen.findByRole('checkbox', {name : 'Cherries'});
        await user.click(cherriesCheckbox);
        const grandTotal = screen.getByRole('heading', {name: /Grand total: \$/ });
        expect(grandTotal).toHaveTextContent('1.50');

        // update vanilla scoops to 2 and check grand total
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'});
        await user.clear(vanillaInput);
        await user.type(vanillaInput, '2');
        expect(grandTotal).toHaveTextContent('5.50');
    });

    test('grand total updates properly if item is removed', async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);

        // add cherries
        const cherriesCheckbox = await screen.findByRole('checkbox', {name : 'Cherries'});
        await user.click(cherriesCheckbox);
        // grand total 1.50

        // update vanilla scoops to 2, grand total: 5.50
        const vanillaInput = await screen.findByRole('spinbutton', {name: 'Vanilla'});
        await user.clear(vanillaInput);
        await user.type(vanillaInput, '2');

        // remove 1 scoop of vanilla and check grand total
        await user.click(vanillaInput);
        await user.type(vanillaInput, '1')
        const grandTotal = screen.getByRole('heading', {name: /Grand total: \$/ });
        expect(grandTotal).toHaveTextContent('3.50');

        // remove cherries and check grand total
        await user.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent('2.00');

    });
})