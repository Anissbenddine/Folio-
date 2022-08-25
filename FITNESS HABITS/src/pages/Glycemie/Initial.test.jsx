 import React from 'react';
 import renderer from 'react-test-renderer';
 import Initial from './Initial.jsx'
 
 
 test('Initial', ()=> {
 const component = renderer.create(<Initial/>);
 const tree = component.toJSON();
 expect(tree).toMatchSnapshot();
 
 });
 
 
