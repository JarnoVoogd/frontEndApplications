// eyeColorUtils.js

// Creating arrays to store eye colors, separated into human and extraterrestrial colors.
const human = ["blue", "brown", "blue-gray", "hazel"];
const ext = ["yellow", "red", "black", "orange", "pink", "silver", "red-blue", "gold", "green-yellow", "white"];

// Object storing which colors belong to different categories.
export const colorMap = {
  human: human,
  ext: ext,
  all: [...human, ...ext]
};

// Function to filter data based on the selected race
export function filterData(selectedRace, somPerSoort, filterValue) {
  const validColors = colorMap[selectedRace];
  return Object.keys(somPerSoort)
    .filter((key) => validColors.includes(key) && somPerSoort[key] >= filterValue)
    .map((key) => ({
      key,
      value: somPerSoort[key],
    }));
}
