const Catalog = require('../../models/Catalog'); // Import the Catalog model
const mongoose = require('mongoose');
const MongoClient = require('mongodb');
 
 // функция регруппировки возрастных групп населения

 async function getAgeCategoryByProvider(provider_name){
    const providerName = provider_name;
    try {
        const aggregationResult = await Catalog.aggregate([
            {
              '$match': {
                'provider': providerName
              }
            }, {
              '$group': {
                '_id': '$ageCategory'
              }
            }, {
              '$project': {
                'group_name': '$_id', 
                '_id': 0
              }
            }
          ],
          { maxTimeMS: 60000, allowDiskUse: true });
  
        const result = aggregationResult;
        console.log(JSON.stringify(result));
      return result
  } catch (error) {
      console.error(error);
  } finally {
     // mongoose.disconnect();
  }
};

function transferPopulation(baseCategories, providers_categories) {
    const updatedCategories = [];
    
    //заменить обще групповые категории на возрастные, уберем дубли
    const newCategoriesUpdated = providers_categories.map(item =>  {
        item.ageGroup === '' ? item.ageGroup='1 до 100' : item.ageGroup;
        item.ageGroup === 'Без категории' ? item.ageGroup='1 до 100' : item.ageGroup;//'Без категории'
        item.ageGroup === 'Без категории' ? item.ageGroup='1 до 100' : item.ageGroup;
        return item;
    });
    
    const newCategoriesUpdatedUniqueObj = Array.from(new Set(newCategoriesUpdated.map(obj => JSON.stringify(obj))))
        .map(str => JSON.parse(str));

        newCategoriesUpdatedUniqueObj.forEach(newCategory => {

        const { ageGroup: newAgeGroup } = newCategory;
        const newAgeGrSubStr = newAgeGroup.toLowerCase().replace('от ', '');
        
        let transferredCount = 0;

        baseCategories.forEach(baseCategory => {
            const { ageGroup: baseAgeGroup, count } = baseCategory;
            
            const baseMinAge = parseInt(baseAgeGroup.split(' ')[0]);
            const baseMaxAge = parseInt(baseAgeGroup.split(' ')[2]);
            const newMinAge = parseInt(newAgeGrSubStr.split(' ')[0]);
            const newMaxAge = parseInt(newAgeGrSubStr.split(' ')[2]);

            if ((baseMinAge <= newMinAge && baseMinAge <= newMaxAge) || (baseMaxAge >= newMinAge && baseMaxAge <= newMaxAge)) {
                transferredCount += count;
            }
        });

        updatedCategories.push({ ageGroup: newAgeGrSubStr, count: transferredCount });
    });

    return updatedCategories;
};
// Пример вызова функции
 /*
// Исходные данные
const baseCategories = [
    { ageGroup: '1 до 9', count: 31 },
    { ageGroup: '10 до 14', count: 30 },
    { ageGroup: '15 до 18', count: 37 },
    { ageGroup: '19 до 35', count: 55 },
    { ageGroup: '36 до 55', count: 204 },
    { ageGroup: '56 до 75', count: 0 }
];

const newCategories = [
    { ageGroup: '1 до 30', count: 0 },
    { ageGroup: '31 до 50', count: 0 },
    { ageGroup: '51 до 100', count: 0 },
    { ageGroup: '', count: 0 },
    { ageGroup: '', count: 0 }
];

// Вызов функции с исходными данными
const updatedCategories = transferPopulation(baseCategories, newCategories);
console.log(updatedCategories);*/

module.exports =  {transferPopulation, getAgeCategoryByProvider};
