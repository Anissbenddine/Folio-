 import React from 'react';
 import renderer from 'react-test-renderer';
 import Modifier from './Modifier.jsx'
 
 
 test('Modifier', ()=> {
 const component = renderer.create(<Modifier/>);
 const tree = component.toJSON();
 expect(tree).toMatchSnapshot();
 
 });
 
 
