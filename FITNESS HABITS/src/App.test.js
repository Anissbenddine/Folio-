import React from "react";
import {render} from "@testing-library/react";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {BrowserRouter} from "react-router-dom";

const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: BrowserRouter });
}

/*


test('renders without crashing', async() => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeDefined();
});

test('Verifier si le mot LBS existe', async() => {
    renderWithRouter(<App /> , { route: '/ConfigurationPoids' });
    const mot = screen.getByText('LBS');
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en anglais', async() => {
    localStorage.setItem('userLanguage', 'en');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Init/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en espagnol', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Peso inicial/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Initial Poids en francais', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, { route: '/ConfigurationPoids' });
    const mot = screen.getByText(/Poids initial/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en anglais page dashboard', async() => {
    localStorage.setItem('userLanguage', 'en');
    //render(<Poids poids="dailyPoids: 50"/>);
    renderWithRouter(<App />, {route: '/dashboard'});
    const mot = screen.getByText(/Weight/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en espagnol page dashboard', async() => {
    localStorage.setItem('userLanguage', 'es');
    renderWithRouter(<App />, { route: '/dashboard' });
    //render(<Poids poids="dailyPoids: 50"/>);
    const mot = screen.getByText(/Peso/i);
    expect(mot).toBeDefined();
});

test('Traduction du mot Poids en francais page dashboard', async() => {
    localStorage.setItem('userLanguage', 'fr');
    renderWithRouter(<App />, { route: '/dashboard' });
    //render(<Poids poids="dailyPoids: 50"/>);
    const mot = screen.getByText(/Poids/i);
    expect(mot).toBeDefined();
});
*/

test("Check hydratation value", async() => {
    var attendu = 5;
    var something = { "hydratation": { "dailyTarget": { "value": 5, "unit": "", "globalConsumption": 0 }, "hydrates": ["0"] }, "alcool": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "alcools": [] }, "nourriture": { "globalConsumption": 0 }, "gras": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "grass": [] }, "proteines": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "proteines": [] }, "legumes": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "legumes": [] }, "cereales": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "cereales": [] }, "glycemie": { "dailyGlycemie": 0 }, "poids": { "dailyPoids": 0 }, "toilettes": { "feces": 0, "urine": 0 }, "sommeil": { "heure": 0, "minute": 0 }, "activities": { "heure": 0, "minute": 0 } };
    expect(something.hydratation.dailyTarget.value).toEqual(attendu);
});

test("Check alcool value", async() => {
    var attendu = 10;
    var something = { "hydratation": { "dailyTarget": { "value": 5, "unit": "", "globalConsumption": 0 }, "hydrates": [] }, "alcool": { "dailyTarget": { "value": 10, "unit": "", "globalConsumption": 0 }, "alcools": [] }, "nourriture": { "globalConsumption": 0 }, "gras": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "grass": [] }, "proteines": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "proteines": [] }, "legumes": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "legumes": [] }, "cereales": { "dailyTarget": { "value": 0, "unit": "", "globalConsumption": 0 }, "cereales": [] }, "glycemie": { "dailyGlycemie": 0 }, "poids": { "dailyPoids": 0 }, "toilettes": { "feces": 0, "urine": 0 }, "sommeil": { "heure": 0, "minute": 0 }, "activities": { "heure": 0, "minute": 0 } };
    expect(something.alcool.dailyTarget.value).toEqual(attendu);
});

