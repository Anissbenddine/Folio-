import React from "react";
import Register from "../Register";
import { cleanup, render, screen } from "@testing-library/react";
import { registerUser, signUp, validateFieldsEmpty, validatePasswordsMatching } from "../Register.Utilities";
import toast from "../../../Toast";
import { firebaseCreateUser } from "../firebase.helper";

jest.mock("../../../Toast")
jest.mock("../firebase.helper")


const mockFormFields = {
    username: "mockUsername",
    password: "mockPassword",
    confirmPassword: "mockPassword",

    resetMockFormFields() {
        mockFormFields.username = "mockUsername"
        mockFormFields.password = "mockPassword"
        mockFormFields.confirmPassword = "mockPassword"
    },

    setEmptyFormFields() {
        mockFormFields.username = ""
        mockFormFields.password = ""
        mockFormFields.confirmPassword = ""
    }
}


describe("Register function", () => {
    const mockToast = jest.fn(() => Promise.resolve())
    let mockFirebaseCreateUser = jest.fn(() => Promise.resolve())

    afterEach(cleanup)

    beforeEach(() => {
        toast.mockImplementation(mockToast)
        firebaseCreateUser.mockImplementation(mockFirebaseCreateUser)
    })

    test("Component renders without crashing", async () => {
        const { registerPage } = render(<Register />)
        await screen.findByTestId("btn-register")
    })

    describe("When a form field is empty", () => {

        beforeEach(() => {
            mockFormFields.setEmptyFormFields()
        })

        describe("When user name field is empty", () => {


            test("Should return confirmation of empty fields", () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test("Should not send call to register user to firebase", () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(toast).toHaveBeenCalled()
                expect(mockFirebaseCreateUser).not.toHaveBeenCalled()
            })
        })

        describe("When password field is empty", () => {


            test("Should return confirmation of empty fields", () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test("Should not send call to register user to firebase", () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(toast).toHaveBeenCalled()
                expect(mockFirebaseCreateUser).not.toHaveBeenCalled()
            })
        })


        describe("When confirmation password field is empty", () => {
            const mockFirebaseCreateUser = jest.fn(() => Promise.resolve())

            test("Should return confirmation of empty fields", () => {
                expect(validateFieldsEmpty(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })

            test("Should not send call to register user to firebase", () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(toast).toHaveBeenCalled()
                expect(mockFirebaseCreateUser).not.toHaveBeenCalled()
            })
        })
    })


    describe("When fields have data", () => {

        beforeEach(() => {
            mockFormFields.resetMockFormFields()
        })

        describe("When password and confirmation password do not match", () => {


            test("Should return confirmation of missmatching passwords", () => {
                mockFormFields.password = "password"
                mockFormFields.confirmPassword = "notthesamepassword"
                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
            })

            test("Should not send call to register user to firebase", () => {
                mockFormFields.password = "password"
                mockFormFields.confirmPassword = "notthesamepassword"

                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(toast).toHaveBeenCalled()
                expect(mockFirebaseCreateUser).not.toHaveBeenCalled()
            })
        })

        describe("When username field has data", () => {

            test("Should return confirmation of matching passwords", () => {
                expect(validateFieldsEmpty(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
            })
        })

        describe("When password and confirmation password match", () => {

            test("Should return confirmation of matching passwords", () => {
                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
            })
        })


        describe("When userName field is filled and passwords match", () => {

            test("Should send call to register user to firebase", () => {
                signUp(mockFormFields.username, mockFormFields.password, mockFormFields.confirmPassword)

                expect(validatePasswordsMatching(mockFormFields.password, mockFormFields.confirmPassword)).toBe(true)
                expect(validateFieldsEmpty(mockFormFields.password, mockFormFields.confirmPassword)).toBe(false)
                expect(mockFirebaseCreateUser).toHaveBeenCalled()
            })
        })

    })

    describe("When register user is called", () => {
        mockFormFields.resetMockFormFields()

        describe("When there is no error", () => {

            test("Should return true", () => {
                mockFirebaseCreateUser = jest.fn(() => Promise.resolve(true))
                firebaseCreateUser.mockImplementation(mockFirebaseCreateUser)

                return registerUser(mockFormFields.username, mockFormFields.password).then(data => {
                    expect(data).toBe(true)
                })

            })
        })


        describe("When there is an error", () => {
           
            test("Should return false and the error message", () => {
                mockFirebaseCreateUser = jest.fn(() => { throw new Error() })
                firebaseCreateUser.mockImplementation(mockFirebaseCreateUser)

                return registerUser(mockFormFields.username, mockFormFields.password).then(data => {
                    expect(data).toBe(false)
                })
            })
        })

    })
})