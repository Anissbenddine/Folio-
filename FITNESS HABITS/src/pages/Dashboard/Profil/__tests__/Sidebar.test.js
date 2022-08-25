import React from "react";
import { render } from "@testing-library/react";
import firebase from "firebase";
import "firebase/auth";
import Sidebar from "../Sidebar";
import { ionFireEvent } from "@ionic/react-test-utils";

const testProfile = {
    pseudo: "testUser",
    email: "testUser@fitnesshabit.com",
    size: "999",
    gender: "N",
    dateFormat: "dd-LLL-yyyy",
};

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn(),
    };
});

describe("How <Sidebar> is rendered", () => {
    beforeAll(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    it("should not crash", () => {
        const { baseElement } = render(<Sidebar pictureDisabled={true} />);
        expect(baseElement).toBeDefined();
    });

    it("should close as expected", () => {
        const mockCloseHandler = jest.mock().fn();
        const { baseElement, getByTestId } = render(<Sidebar handleClose={mockCloseHandler} pictureDisabled={true} />);

        const sidebar = getByTestId("sidebar");
        const btnClose = getByTestId("btn-close");
        btnClose.click();

        expect(sidebar.classList).toContain("sidebarClose");
        expect(mockCloseHandler).toBeCalledTimes(1);

    });

    it("should be open by default", () => {
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);
        const sidebar = getByTestId("sidebar");
        expect(sidebar.classList).toContain("sidebar");
    });

    it("should display profile information", () => {
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);
        const usernameElement = getByTestId("username");
        const heightElement = getByTestId("height");
        const genderElement = getByTestId("gender");
        const emailElement = getByTestId("email");
        const dateFormatElement = getByTestId("dateFormat");

        expect(usernameElement.textContent).toEqual(testProfile.pseudo);
        expect((heightElement.value*100).toString()).toEqual(testProfile.size);
        expect(genderElement.value).toEqual(testProfile.gender);
        expect(emailElement.value).toEqual(testProfile.email);
        expect(dateFormatElement.value).toEqual(testProfile.dateFormat);
    });
});

describe("How <Sidebar> behaves", () => {

    beforeEach(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    it("should save inputs on change", () => {
        const mockUpdate = jest.fn().mockResolvedValue(true);
        const mockRef = jest.fn().mockReturnValue({ update: mockUpdate });
        firebase.database.mockReturnValue({ ref: mockRef });
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);

        const inputEmail = getByTestId("email");
        ionFireEvent.ionBlur(inputEmail);
        const inputHeight = getByTestId("height");
        ionFireEvent.ionBlur(inputHeight);
        //expect(mockUpdate).toBeCalledTimes(3);
        expect(mockUpdate).toBeCalledTimes(2);
    });

    it("should sign out on click", () => {
        const mockSignout = jest.fn().mockResolvedValue(true);
        firebase.auth.mockReturnValueOnce({ signOut: mockSignout });
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);

        const btnSignout = getByTestId("btn-signout");
        btnSignout.click();

        expect(mockSignout).toBeCalledTimes(1);
        expect(window.location.pathname).toEqual("/");
    });
});

jest.clearAllMocks();