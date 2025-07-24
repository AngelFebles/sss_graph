let sheetData = []
let no_adults, no_infants, no_preschoolers, no_schoolagers, no_teenagers, housing_type, food_plan = 0;
let food_cost = 0
let family_cost = []
let chart;

function get_values(){

    no_adults = parseInt(document.getElementById('adults').value)
    no_infants = parseInt(document.getElementById('infants').value)
    no_preschoolers= parseInt(document.getElementById('preschoolers').value)
    no_schoolagers = parseInt(document.getElementById('schoolagers').value)
    no_teenagers = parseInt(document.getElementById('teenagers').value)

    housing_type = document.getElementById('housing').value;
    
    food_plan = document.getElementById('food_plan').value;

    family_cost = []
    return readCoefficients()
}


async function readCoefficients() {
    const response = await fetch('data/coefficients.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, {type: 'array'});
    workbook.SheetNames.forEach(function(sheetName) {
        sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
    // console.log(`Sheet: ${sheetName}`);
    // console.log(sheetData);
    });

    let family_cost_json = {};

    for (let i = 1; i < sheetData.length - 1; i++) {
        let cost_by_size = sheetData[i][1] + (
            (sheetData[i][2] * no_adults) +
            (sheetData[i][3] * no_infants) +
            (sheetData[i][4] * no_preschoolers) +
            (sheetData[i][5] * no_schoolagers) +
            (sheetData[i][6] * no_teenagers)
        );
        family_cost_json[sheetData[i][0]] = cost_by_size;
    }

    family_cost_json["housing_cost"] = await read_housing_plans();
    family_cost_json["food_cost"] = await read_food_plans();

    family_cost = family_cost_json;

    // console.log(family_cost)
    return family_cost;
}


async function read_food_plans() {
    const response = await fetch('data/food_costs.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, {type: 'array'});
    workbook.SheetNames.forEach(function(sheetName) {
        food_plans_sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
    });
    
        if(food_plan == "Thrifty"){
            food_cost = (
                (food_plans_sheetData[1][1] * no_adults) +
                (food_plans_sheetData[1][2] * no_infants) +
                (food_plans_sheetData[1][3] * no_preschoolers) +
                (food_plans_sheetData[1][4] * no_schoolagers) +
                (food_plans_sheetData[1][5] * no_teenagers)
            );
        } else if (food_plan == "Low") {
            food_cost = (
                (food_plans_sheetData[2][1] * no_adults) +
                (food_plans_sheetData[2][2] * no_infants) +
                (food_plans_sheetData[2][3] * no_preschoolers) +
                (food_plans_sheetData[2][4] * no_schoolagers) +
                (food_plans_sheetData[2][5] * no_teenagers)
            );
        } else if (food_plan == "Moderate") {
            food_cost = (
                (food_plans_sheetData[3][1] * no_adults) +
                (food_plans_sheetData[3][2] * no_infants) +
                (food_plans_sheetData[3][3] * no_preschoolers) +
                (food_plans_sheetData[3][4] * no_schoolagers) +
                (food_plans_sheetData[3][5] * no_teenagers)
            );
        } else if (food_plan == "Liberal") {
            food_cost = (
                (food_plans_sheetData[4][1] * no_adults) +
                (food_plans_sheetData[4][2] * no_infants) +
                (food_plans_sheetData[4][3] * no_preschoolers) +
                (food_plans_sheetData[4][4] * no_schoolagers) +
                (food_plans_sheetData[4][5] * no_teenagers)
            );
        }
    // console.log(food_cost)
    // console.log(`Sheet: ${sheetName}`);
    // console.log(sheetData);

    return food_cost
}

async function read_housing_plans() {
    const response = await fetch('data/housing_cost.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, {type: 'array'});
    workbook.SheetNames.forEach(function(sheetName) {
        housing_plans_sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
    });

    
    let housing_cost = 0;

    if(housing_type == "Efficiency"){
        housing_cost = housing_plans_sheetData[1][2];
        } else if (housing_type == "One_Bedroom") {
        housing_cost = housing_plans_sheetData[2][2];
        } else if (housing_type == "Two_Bedroom") {
        housing_cost = housing_plans_sheetData[3][2];
        } else if (housing_type == "Three_Bedroom") {
        housing_cost = housing_plans_sheetData[4][2];
        } else if (housing_type == "Four_Bedroom") {
        housing_cost = housing_plans_sheetData[5][2];
        }

    

    // console.log(housing_cost)

    return housing_cost;
}


async function make_table(){
    data = await get_values()
    // console.log("AAA")
    // console.log(Object.values(data))

    let table = {
    labels: Object.keys(data),
    datasets: [{
        label: 'Monthly Costs ($)',
        data: Object.values(data)}]
    } 

    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
    type: 'bar',
    data: table,
    // options: {
    //   scales: {y: {beginAtZero: true}}
    // }
});
}

// get_values()
// readCoefficients()