import { render, screen} from "@testing-library/react";
import SummaryForm from "../summary/SummaryForm";
import userEvent from '@testing-library/user-event'


test('Initial conditions', ()=> {
    render(<SummaryForm />);
    const checkbox = screen.getByRole('checkbox', {
        name:/terms and conditions/i
    });
    expect(checkbox).not.toBeChecked();

    const confirmButton= screen.getByRole('button', {name:/confirm order/i})
    expect(confirmButton).toBeDisabled();
});

test('Checkbox disables btn on first click and enables on second click', async ()=> {
// user event setup instead of fire event
    const user = userEvent.setup();


    render(<SummaryForm />);
    const checkbox = screen.getByRole('checkbox', {
        name:/terms and conditions/i
    });
    const confirmButton= screen.getByRole('button', {name:/confirm order/i});

    // user event always need to await, otherwise expect can be done before user event
    await user.click(checkbox);
    expect(confirmButton).toBeEnabled();

    await user.click(checkbox);
    expect(confirmButton).toBeDisabled();

});

test("popover responds to hover", async () =>{
    const user = userEvent.setup();
    render(<SummaryForm />);

    //popover starts out hidden/not on the page: test sth that is not showing can not use getByRole
    const nullPopover = screen.queryByText(/no ice cream will actually be delivered/i);
    expect(nullPopover).not.toBeInTheDocument();


    //popover appears on mouseover of checkbox label
    const termsAndConditions = screen.getByText(/terms and conditions/i);
    await user.hover(termsAndConditions);

    // find popover again by using get
    const popover = screen.getByText(/no ice cream will actually be delivered/i)
    expect(popover).toBeInTheDocument();

    //popover disappears when mouse out
    await user.unhover(termsAndConditions);
    expect(popover).not.toBeInTheDocument();
})