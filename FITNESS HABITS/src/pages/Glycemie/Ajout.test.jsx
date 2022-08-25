 import React from 'react';
 import renderer from 'react-test-renderer';
 import Ajout from './Ajout.jsx'
 
 
 test('Ajout', ()=> {
 const component = renderer.create(<Ajout/>);
 const tree = component.toJSON();
 expect(tree).toMatchSnapshot();
 
 });
 
 
