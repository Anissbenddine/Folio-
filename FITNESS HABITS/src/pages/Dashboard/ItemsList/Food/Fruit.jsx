import React from "react"
import Food from './Food';

const Fruit = (props) => {
  return (
    <Food
      categoryKey = 'fruit'
      updateFoodConsumptionCallback = {props.updateFoodConsumptionCallback}
      macroNutrientConsumption = {props.macroNutrientConsumption}
      foodItems = {props.foodItems}
      currentDate = {props.currentDate}
      foodItemToEdit = {undefined}
      itemContainerDisplayStatus = {false}
    />   
  );
}
export default Fruit;