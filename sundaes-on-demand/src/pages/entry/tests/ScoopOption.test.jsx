import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import ScoopOption from "../ScoopOption";



test('indicate if scoop count is non-int or out of range', async () => {
    const user = userEvent.setup();
    render(<ScoopOption />);

    //expect input to be invalid with negative number
    const vanillaInput = screen.getByRole('spinbutton');
    await user.clear(vanillaInput);
    await user.type(vanillaInput);
    expect(vanillaInput).toHaveClass('is-invalid');

    // replace with decimal input
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '2.5');
    expect(vanillaInput).toHaveClass('is-invalid');

    // replace with input that's too high
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '11');
    expect(vanillaInput).toHaveClass('is-invalid');
})