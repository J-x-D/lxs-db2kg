/**
 * This function is deprecated. It is not used anymore.
 * Handles the click on a triple. If the triple is already selected, everything gets unselected.
 * @param index The index of the triple, which was clicked. Can only be a number.
 * @param selected The index of the currently selected triple. Can be null.
 * @param setSelected The function to set the selected triple.
 */
export default function handleClickTriple({
  index,
  selected,
  
}: {
  index: number;
  selected: number | null;
  
}) {
  if (index < 0) {
    throw new Error("Index must be a positive number");
  }
  if (index === selected) {
    
  } else {
  
  }
}
