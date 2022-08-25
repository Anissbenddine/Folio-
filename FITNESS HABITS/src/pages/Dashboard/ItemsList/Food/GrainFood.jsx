import React from 'react';
import Food from './Food';

const GrainFood = (props) => {
  return (
    <Food
      categoryKey = 'grainFood'
      updateFoodConsumptionCallback = {props.updateFoodConsumptionCallback}
      macroNutrientConsumption = {props.macroNutrientConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default GrainFood;
