import {server} from "../../../mocksServer/server";
import {rest} from "msw";
import {render, screen, waitFor} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import userEvent from "@testing-library/user-event";

//run only one test in a file to isolate a test
test.only('handles errors for scoops and toppings routes', async () => {
// overwrite handlers
    server.resetHandlers(
        rest.get('http://localhost:3030/scoops', (req,res,ctx) =>
            res(ctx.status(500))
        ),
        rest.get('http://localhost:3030/toppings', (req,res,ctx) =>
            res(ctx.status(500))
        )
    );

    render(<OrderEntry setOrderPhase={jest.fn()}/>);

    // situation: await for only one alterBanner and then run the following code without finding the second
    // solution: wait for
    await waitFor(async () => {
        const alerts = await screen.findAllByRole('alert');

        expect(alerts).toHaveLength(2);
    })
});


// run other test but skip one test
test.skip('not a real test', () => {

});

test('disable order button if there are no scoops ordered', async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={jest.fn()}/>);

    // order button should be disabled at first, even before options load
    const orderButton = screen.getByRole('button', {
        name: /order sumdae/i,
    });
    expect(orderButton).toBeDisabled();

    //expect button to be enabled after adding scoop
    const vanillaInput = await screen.findByRole('spinbutton', {
        name: 'Vanilla',
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');
    expect(orderButton).toBeEnabled();

    // expect button to be disabled again after removing scoop
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '0');
    expect(orderButton).toBeDisabled();

})

