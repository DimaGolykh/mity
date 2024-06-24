const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AgeGroup = require('./controller/age_group/Age_group'); 
const Catalog = require('./models/Catalog'); // Assuming you have a model for Catalog
const Rating = require('./models/Rating'); // Assuming you have a model for Rating
const catalogController = require('./controller/catalog/Catalog_controller');

// Middleware
app.use(bodyParser.json());

//Запросить возрастные группы по постащику
app.get('/api/age_group', async (req, res)  =>  {
    const { provider_name } = req.query;
    const rs = await AgeGroup.getAgeCategoryByProvider(provider_name);
    console.log(rs);
    res.json(rs);
});

// GET endpoint to find suitable combinations
app.get('/api/findCombinations', async (req, res)  =>  {
    const { length, width, budget, ageRange } = req.query;

    // Logic to find suitable combinations from Catalog based on Rating popularity
    // Implement logic to match Rating.name and Catalog.name substrings

    const age = ageRange; // Пример возраста для поиска
    //const rs2 = await catalogController.getProviderList();

    const rs2 = await catalogController.getProviderListByFilter({budjet: budget, length: length, width: width});
    console.log(rs2);
  // const rs = findCatalogByAge(age).then(result => {
 //       console.log(result);
  //  }).catch(err => {
  //      console.error(err);
 //   });

 //const a = rs2[0];
    const combinations = [
        { element: "Скамья", rating: 4517 },
        { element: "Качалка", rating: 2631 },
        { element: "Качели", rating: 2446 }
    ];

    res.json(rs2);
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


