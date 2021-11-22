 function filterData (selectedRace){
    const validColors = colorMap[selectedRace];
    const filtered_data = barChartData.filter(c =>
      validColors.find(vc => vc === c.color)
    );
    return filtered_data;

  };


  
const filterData = selectedRace => {
  const validColors = colorMap[selectedRace];
  const filtered_data = barChartData.filter(c =>
    validColors.find(vc => vc === c.color)
  );
  return filtered_data;
};

