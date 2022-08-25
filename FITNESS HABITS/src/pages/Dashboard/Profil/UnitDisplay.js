
/* Converts a unit size to CM depending on current display value
 * ("M",1.78,null)
 * returns 178,  (1.78 * 100) .
 */
export const convertToCM = (currentUnitDisplay, value, imperial) => {
    switch (currentUnitDisplay) {
    case "CM":
        return value;    
    case "M":
        return value *100;    
    default:
        return Math.round(Number(2.54)*(Number(imperial.feet*12)+Number(imperial.inches)));
    }
}



/* Converts a unit size to Imperial depending on current display value
 * ("CM",168,null)
 * returns obecjt {feet:5,inches:6}
 */
export const convertToImperial = (currentDisplay, value) => {
    if (currentDisplay === "M") {
        value = Number(value*100);
    }
    var inches = value/2.54;
    var feet = Math.floor(inches / 12);
    var restant = Math.round(inches - (feet * 12));
    return {feet:feet, inches:restant};
}