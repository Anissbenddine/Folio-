import React from "react";
import {render} from "@testing-library/react";
import firebase from "firebase";
import "firebase/auth";
import TakePicture from "./TakePicture";

const testProfile = {
    pseudo: "testUser",
    email: "testUser@fitnesshabit.com",
    size: "999",
    gender: "T",
    dateFormat: "dd-LLL-yyyy",
};

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn(),
        storage: jest.fn(),
    };
});

describe("How <TakePicture> behaves", () => {

    it("should show the cached image by default", () => {
        const testURL = "test.jpg";
        localStorage.setItem("profile-picture-cache", testURL);

        const { getByTestId } = render(<TakePicture />);
        const profilePicture = getByTestId("profile-picture");

        expect(profilePicture.src).toEqual(testURL);

        localStorage.removeItem("profile-picture-cache")
    });
});

jest.clearAllMocks();