import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import App from "../App";


test('order phases for happy path', async () => {
    const user = userEvent.setup();
    // render app

    // destructure unmount from return value to use at the end of the test
    const {unmount} = render(<App />);

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    const chocolateInput = screen.getByRole("spinbutton", { name: "Chocolate" });
    await user.clear(chocolateInput);
    await user.type(chocolateInput, "2");

    const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
    });
    await user.click(cherriesCheckbox);


    // find and click order button
    const orderSummaryButton = screen.getByRole('button',{
        name: /order sundae/i,
    });
    await user.click(orderSummaryButton);

    // check summary info based on order is correct
    const summaryHeading = screen.getByRole('heading', {
        name:'Order Summary'
    });
    expect(summaryHeading).toBeInTheDocument();

    const scoopsHeading = screen.getByRole('heading', {
        name: 'Scoops: $6.00'
    });
    expect(scoopsHeading).toBeInTheDocument();

    const toppingsHeading = screen.getByRole('heading', {
        name: 'Toppings: $1.50'
    });
    expect(toppingsHeading).toBeInTheDocument();

    // accept terms and conditions and click button to confirm order
    const tcCheckbox = screen.getByRole('checkbox', {
        name:/terms and conditions/i,
    });
    await user.click(tcCheckbox);

    const confirmOrderButton = screen.getByRole('button', {
        name: /confirm order/i,
    });
    await user.click(confirmOrderButton);

    // expect loading to show
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();


    // check confirmation page text
    // this is async because there is a POST request to server
    const orderNumber = await screen.findByText(/order number/i);
    expect(orderNumber).toBeInTheDocument();

    const thankYouHeader = await screen.findByRole("heading", {
        name: /thank you/i,
    });
    expect(thankYouHeader).toBeInTheDocument();

    // // expect loading has disappeared;
    const notLoading = screen.queryByText('loading');
    expect(notLoading).not.toBeInTheDocument();



    // confirm order number on confirmation page

    // click new order button on confirmation page
    const newOrderButton = screen.getByRole('button', {
        name: /new order/i,
    });
    await user.click(newOrderButton);


    // check that scoops and toppings subtotals have been reset
    const scoopsTotal = await screen.findByText('Scoops total: $0.00');
    expect(scoopsTotal).toBeInTheDocument();
    const toppingsTotal = screen.getByText('Toppings total: $0.00');
    expect(toppingsTotal).toBeInTheDocument();

    // do we need to await anything to avoid test errors?
    unmount();
});


test('Toppings header is not on summary page if no toppings ordered', async () => {
    const user = userEvent.setup();
    render(<App />);

    // add ice cream scoops but no toppings
    const vanillaInput = await screen.findByRole('spinbutton', {
        name: 'Vanilla',
    });
    await  user.clear(vanillaInput);
    await user.type(vanillaInput, '1');

    const chocolateInput = screen.getByRole('spinbutton', {
        name: 'Chocolate'
    });
    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');

    // find and click order summary button
    const orderSummaryButton = screen.getByRole('button', {
        name:/order sundae/i,
    });
    await user.click(orderSummaryButton);

    const scoopsHeading = screen.getByRole('heading', {
        name: 'Scoops: $6.00'
    });
    expect(scoopsHeading).toBeInTheDocument();

    const toppingsHeading = screen.queryByRole('heading', {
        name: /toppings/i
    });
    expect(toppingsHeading).not.toBeInTheDocument();

});

test('Toppings header is not on summary page if toppings ordered, then removed', async () => {
   const user = userEvent.setup();

   render(<App />);

   // add ice cream scoops
    const vanillaInput = await screen.findByRole('spinbutton', {
        name: 'Vanilla',
    });
    await  user.clear(vanillaInput);
    await user.type(vanillaInput, '1');

    // add a topping and confirm
    const cherriesTopping = await screen.findByRole('checkbox', {
        name: 'Cherries',
    });
    await user.click(cherriesTopping);
    expect(cherriesTopping).toBeChecked();
    const toppingsTotal = screen.getByText('Toppings total: $', {exact: false});
    expect(toppingsTotal).toHaveTextContent('1.50');

    //remove topping
    await user.click(cherriesTopping);
    expect(cherriesTopping).not.toBeChecked();
    expect(toppingsTotal).toHaveTextContent('0.00');

    // find and click order summary button
    const orderSummaryButton = screen.getByRole('button', {
        name: /order sundae/i
    });
    await user.click(orderSummaryButton);

    const scoopsHeading = screen.getByRole('heading', {
        name: 'Scoops: $2.00'
    });
    expect(scoopsHeading).toBeInTheDocument();

    const toppingsHeading = screen.queryByRole('heading', {
        name: /toppings/i
    });
    expect(toppingsHeading).not.toBeInTheDocument();


});