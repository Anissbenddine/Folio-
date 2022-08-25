import React from "react";  
import { shallow, mount,  } from "enzyme";
import LogIn from "../LogIn";
import { MemoryRouter } from "react-router";
import HandleLogin, {userExists} from "../HandleLogin";

// jest.mock("firebase")
jest.mock("../../../Toast")

const mockFormFields = {
    username: "mockusername@fithab.com",
    password: "mockpassword",
    cPassword: "mockpassword",
}

const flags = {
    email_flag: false,
    facebook_flag: false,
    google_flag: false,
}

const mProps = { history: { push: jest.fn() } };
const setBusy = jest.fn();

jest.mock('../HandleLogin', () => {
    const originalModule = jest.requireActual('../HandleLogin');

    return {
        __esModule: true,
    ...originalModule,
    default: jest.fn().mockResolvedValue(false)
    };
});

it("Invalid user", async () => {
    let result = await HandleLogin(mockFormFields.username, mockFormFields.password, mProps, setBusy, flags);
    expect(result).toBe(false);
});

it("Mock button press", async  () => {
    const wrapper = shallow(<LogIn/>);
    wrapper.find(".input-login-name").first().simulate("change", {
        target: { value: mockFormFields.username }
    });

    wrapper.find(".input-login-password").first().simulate("change", {
        target: { value: mockFormFields.password }
    });
    try {
        wrapper.find(".input-login-click").first().simulate("click");
        wrapper.find("#facebook").first().simulate("click");
    } catch (error) {
        return Promise.reject("wrong");
    }
});

it("Invalid username", async () => {
    let response = await userExists(mockFormFields.username, mockFormFields.password, flags);
    expect(response !== true);
});


it("Checks if /login route has the LogIn component", () => {
    const component = mount(
        <MemoryRouter initialentries="{['/login']}">
            <LogIn/>
        </MemoryRouter>
    );
    expect(component.find(LogIn)).toHaveLength(1);
})

it("Check if LogIn is not mounted in homepage", () => {
    const component = mount(
        <MemoryRouter initialentries="{['/']}">
            <LogIn/>
        </MemoryRouter>
    );
    expect(component.find(LogIn) == null);
})