import React, { useState } from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { act } from "react-dom/test-utils";
import App from '../../../App';

beforeEach(() => {
  var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
  var poids={
    dailyPoids:"77",
    datePoids:"2022-03-17T15:24:10.792Z"
  }
  var size="160";
  const pseudo_dashboard = {
    userUID,
    poids,
    size
  };
  localStorage.setItem('userUid', userUID);
  localStorage.setItem('dashboard', JSON.stringify(pseudo_dashboard));
  localStorage.setItem("prefUnitePoids", 'KG');
  localStorage.setItem('userLanguage', 'fr');
});

afterEach(() => {
  localStorage.clear();
});

//Méthode générique à mettre dans Test.utils (ref: ExportTeam BooleanBurritos)
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
}

test('Traduction du mot Initial Poids en anglais', async() => {
  localStorage.setItem('userLanguage', 'en')
  renderWithRouter(<App />, { route: '/ConfigurationPoids'});
  const mot = screen.getByText(/Initial weight/i);
  const mot1 = screen.getByText(/Weight target/i);
  const mot2 = screen.getByText(/Weight unit/i);
  const mot3 = screen.getByText(/Target date/i);
  expect(mot).toBeDefined();
  expect(mot1).toBeDefined();
  expect(mot2).toBeDefined();
  expect(mot3).toBeDefined();
});
/**
 * 
 ne pas marcher...
test('element dans le page', async() => {
  act(() => {
    render(<Initialisation />);

    const option = screen.getByTestId('pop_up_unite');
    //fireEvent.click(option);
    
    fireEvent.change(option , { target: { value: "LBS" } });
    const mot = screen.getByTestId('poids_init').value;
    expect(mot).toBe(106*2.2);
    
  })
});

test('poids initial', async() => {
  act(() => {
    render(<Initialisation />);

    const mot = screen.getByTestId('poids_init').value;
    //expect(mot).toBeDefined();
    expect(mot).toBe(106.0)
  })
});
*/
