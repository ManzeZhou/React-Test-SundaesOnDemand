import {server} from "../../../mocksServer/server";
import {rest} from "msw";
import {render, screen, waitFor} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";

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

    render(<OrderEntry />);

    // situation: await for only one alterBanner and then run the following code without finding the second
    // solution: wait for
    await waitFor(async () => {
        const alerts = await screen.findAllByRole('alert');

        expect(alerts).toHaveLength(2);
    })
});


// run other test but skip one test
test.skip('not a real test', () => {

})

