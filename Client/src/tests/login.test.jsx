import {render,screen} from '@testing-library/react'
import LoginPage from '../Components/SignInPage/LoginPage/LoginPage'


describe("This is the login page test",()=>{

beforeAll(()=>{
    console.log("before all");
})

afterAll(()=>{
    console.log("after all");
})

beforeEach(()=>{
    console.log("Before each");
})
afterEach(()=>{
    console.log("After each");
})


test("should display the login page", () => {
	render(<LoginPage />)
	const image = screen.getByRole("background")
	const input = screen.getBy
	//Assertion
	expect(image).toBeInTheDocument()
})

test("should load the submit button on the screen", () => {
	render(<LoginPage />)
	const button = screen.getByRole("login-btn")

	//Assertion
	expect(button).toBeInTheDocument()
})

})

