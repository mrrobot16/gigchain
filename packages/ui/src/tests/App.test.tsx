import React from "react";
import { render, screen } from "@testing-library/react";
import App from "App";
import { Organization } from "containers";

test("renders learn react link", () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Create an Organization/i);
  expect(welcomeElement).toBeInTheDocument();
});

test("renders learn react link", () => {
  render(<Organization />);
  // const organizationName = screen.getByText(/Organization name/i);
  // expect(organizationName).toBeInTheDocument();
  // const organizationAddress = screen.getByText(/Organization Address/i);
  // expect(organizationAddress).toBeInTheDocument();
  // const organizationBalance = screen.getByText(/Organization Balance/i);
  // expect(organizationBalance).toBeInTheDocument();
});