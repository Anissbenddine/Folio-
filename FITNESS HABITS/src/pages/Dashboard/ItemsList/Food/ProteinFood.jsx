import React from "react"
import Food from './Food';

const ProteinFood = (props) => {
  return (
    <Food
      categoryKey = 'proteinFood'
      updateFoodConsumptionCallback = {props.updateFoodConsumptionCallback}
      macroNutrientConsumption = {props.macroNutrientConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default ProteinFood;