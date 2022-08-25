import React from 'react';
import Food from './Food';

const DairyProducts = (props) => {
  return (
    <Food
      categoryKey = 'dairyProducts'
      updateFoodConsumptionCallback = {props.updateFoodConsumptionCallback}
      macroNutrientConsumption = {props.macroNutrientConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default DairyProducts;
