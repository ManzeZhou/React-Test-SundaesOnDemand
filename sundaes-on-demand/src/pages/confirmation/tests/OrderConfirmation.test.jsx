import {server} from "../../../mocksServer/server";
import {rest} from "msw";
import {render, screen} from "@testing-library/react";
import OrderConfirmation from "../OrderConfirmation";


test('error response from server for submitting order', async () => {
    server.resetHandlers(
        rest.post("http://localhost:3000/order", (req, res, ctx) => {
            res(ctx.status(500))
        })
    )

    render(<OrderConfirmation setOrderPhase={jest.fn()}/>);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
        "An unexpected error occurred. Please try again later."
    )
})