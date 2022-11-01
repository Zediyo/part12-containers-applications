import { render, screen } from '@testing-library/react';
import Todo from './Todo'

test("single todo renders correctly", () =>
{
	render(<Todo todo={ { text: "This is a text", done: false } } />)

	const e = screen.getByText("This is a text")
	expect(e).toBeDefined()
})