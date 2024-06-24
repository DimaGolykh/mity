const express = require('express');
const bodyParser = require('body-parser');
const AgeGroup = require('./controller/age_group/Age_group'); 
const catalogController = require('./controller/catalog/Catalog_controller');
const ConstructorMaf = require('./controller/constructor_maf/Constructor_maf');
const json2xls = require('json2xls');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

//создать и вернуть рекомендательную модель в виде итогового ексель
app.post('/api/generateExcel', async (req, res) => {
    const { baseCategories, length, width, budget } = req.body;
  
    const arealength = parseInt(length);
    const areaWidth = parseInt(width);
    const budjet = parseFloat(budget);
    
    const recomendetMafList = await ConstructorMaf.recomendation_maf_generate({budjet: budjet, length: length, width: width, baseCategories: baseCategories});

    const baseCategoriesData = baseCategories.map(category => Object.values(category));
    const wsBaseCategories = XLSX.utils.aoa_to_sheet([Object.keys(baseCategories[0]), ...baseCategoriesData]);
    // Добавление заголовка "budget" и его значения в колонку C на лист 'Base Categories'
    wsBaseCategories['C1'] = { t: 's', v: 'budjet' };
    wsBaseCategories['D1'] = { t: 's', v: 'arealength' };
    wsBaseCategories['E1'] = { t: 's', v: 'areaWidth' };
    XLSX.utils.sheet_add_json(wsBaseCategories, [{ budget }], { header: ['budget'], skipHeader: true, origin: 'C2' });
    XLSX.utils.sheet_add_json(wsBaseCategories, [{ arealength }], { header: ['arealength'], skipHeader: true, origin: 'D2' });
    XLSX.utils.sheet_add_json(wsBaseCategories, [{ areaWidth }], { header: ['areaWidth'], skipHeader: true, origin: 'E2' });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsBaseCategories, 'Base Categories');

    recomendetMafList.forEach(maf => {
        const sheetName = maf.provider;
        if (maf.recomendetList && maf.recomendetList.resMafList && maf.recomendetList.resMafList.length > 0) {
            const headers = Object.keys(maf.recomendetList.resMafList[0]);
            const data = maf.recomendetList.resMafList.map(item => Object.values(item));
            const wsData = [headers, ...data];
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
    });

    const excelFilePath = 'recomendetMafList.xlsx';
    XLSX.writeFile(wb, excelFilePath);

    const file = fs.readFileSync(excelFilePath);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename=' + excelFilePath);
    res.send(file);
});


//создать и вернуть рекомендательную модель

app.post('/api/recomendet_maf_list',async (req, res) => {
    const { baseCategories, length, width, budget } = req.body;
  
    const arealength = parseInt(length);
    const areaWidth = parseInt(width);
    const budjet = parseFloat(budget);
    
    const recomendetMafList = await ConstructorMaf.recomendation_maf_generate({budjet: budjet, length: length, width: width, baseCategories: baseCategories});
    // Далее можно проводить операции с полученными данными
  
    //res.send('Данные успешно обработаны');
    res.json(recomendetMafList);
  });


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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


