const catalogController = require('../catalog/Catalog_controller');
const ageGroup = require('..//age_group/Age_group.js');

const mongoose = require('mongoose');

// функция будет возвращать случайный элемент из массива возрастных групп с учетом пропорции вероятности, определенной значениями count каждого элемента.
function getRandomElementByCount(providerCategories) {
    // Подсчитываем общее количество элементов в массиве
    const totalCount = providerCategories.reduce((acc, curr) => acc + curr.count, 0);

    // Генерируем случайное число в диапазоне от 0 до общего количества элементов
    const randomNum = Math.floor(Math.random() * totalCount);

    // Находим элемент, соответствующий сгенерированному числу
    let cumulativeCount = 0;
    for (let i = 0; i < providerCategories.length; i++) {
        cumulativeCount += providerCategories[i].count;
        if (randomNum < cumulativeCount) {
            return providerCategories[i];
        }
    }
}
// пример рекурсии с делением родительского прямоугольника на 3 дочерних
function divideRectangles(rectangle, resMafList, maf_set, budjet, providerCategories) {
    const selectedAgeGroup = getRandomElementByCount(providerCategories); //поулчили индекс группы для подбора
    let subResMafList = resMafList || [];// обходим ошибку не существующего входящего массива MAF
    //const selectedAgeGroup = providerCategories[indexGroup];
    const mafListFilterByAgeGroup = maf_set.groupslist.filter(item => {
        //console.log(item);
        const flag = (item.groupName !== '' || item.groupName !== 'Без категории' || item.groupName !== 'Без категории') &&
        (selectedAgeGroup.ageGroup !== '1 до 100' ?  item.groupName.includes(selectedAgeGroup.ageGroup) : true );
        //console.log(flag);
        return flag;
    });
    const mafListFilterByBugjetAndDimensions = mafListFilterByAgeGroup[0].elementList.filter(item => item.price < budjet && item.dimensionsLength < rectangle.length && item.dimensionsWidth < rectangle.width);
   if(mafListFilterByBugjetAndDimensions.length === 0){
    return { rectangles: [], subResMafList };
   }
    
   
    const randomMafIndex = Math.floor(Math.random() * mafListFilterByBugjetAndDimensions.length);
    const selectedMaf = mafListFilterByBugjetAndDimensions[randomMafIndex];
    if (selectedMaf && !selectedMaf.hasOwnProperty('dimensionsLength')) {
        console.log(selectedMaf);
      }
    const p2 = { length: selectedMaf.dimensionsLength, width: selectedMaf.dimensionsWidth }; // задаем параметры наименьшего прямоугольника
 
    
    // Базовое условие: p2 помещается в родительскую площадь
    if (rectangle.length < p2.length || rectangle.width < p2.width) {
        return { rectangles: [], subResMafList };
    }

    // Расчет p3 и p4
    const p3 = { length: rectangle.length - p2.length, width: rectangle.width };
    const p4 = { length: p2.length, width: rectangle.width - p2.width };
    // корректируем бюджет
    const newBudjet = budjet - selectedMaf.price;
    // рекурсия p3
    const { rectangles: subRectanglesP3, resMafList: subResMafListP3 } = divideRectangles(p3, subResMafList, maf_set, newBudjet, providerCategories);

    // рекурсия p4
    const { rectangles: subRectanglesP4, resMafList: subResMafListP4 } = divideRectangles(p4, subResMafListP3, maf_set, newBudjet, providerCategories);

    // считаем общее  p2 кол-во
    subResMafList = subResMafList.push(selectedMaf);

    // Construct the result array with rectangle dimensions
    const resultRectangles = [
        { length: p3.length, width: p3.width },
        { length: p4.length, width: p4.width },
        ...subRectanglesP3,
        ...subRectanglesP4
    ];

    return { rectangles: resultRectangles, resMafList };
}



// получить отфильтрованный список МАФ по размеру и возрасту

//const catalogListGroupByProviderAndAgeLevel = await catalogController.getProviderList();

// фкункция рекурсии по подбору и "разрезанию" площади на простые формы
async function recomendation_maf_generate(attrObject){
  const attr = Object.create(attrObject);
  const baseCategories = attr.baseCategories;
  const arealength = parseInt(attr.length);
  const areaWidth  = parseInt(attr.width);
  const budjet = parseFloat(attr.budjet);
  let recomendetList = [];
  const resObj = {
    request
  };


   const source_maf_list_by_proveder_group = await catalogController.getProviderListByFilter({budjet: budjet, length: arealength, width: areaWidth});



   source_maf_list_by_proveder_group.forEach(element => {
   
    
    
    
    /*{
	Длина площадки: 18,
	Ширина площадки: 20,
	Возрастные группы: {...},
	Лимитбюджета: 200000,
	Рекомендованные комбинации МАФ: [
	{Поставщик: Поставщик 1,
	Список МАФ:[
	{МАФ},
	{МАФ},
	]
	},
	{Поставщик: Поставщик 1,
	Список МАФ:[
               {МАФ},
               {МАФ},
             ]
           }
	]
}*/
 // 1. соберем категрии возрастных групп
const providers_categories = element.groupslist.map(item => {
    const newItem = new Object();
    newItem.ageGroup = item.groupName;
    return newItem;
   });
// 2. определим пропорции кол-ва жителей
  const transformation_ageGroup = ageGroup.transferPopulation(baseCategories, providers_categories);
  const provider_categories = transformation_ageGroup;
  const maf_set = element;
 // console.log(transformation_ageGroup);
// 3. Запустим рекурсию по подбору относительно базовой площади
const subRes = divideRectangles({length: arealength, width: areaWidth},[],maf_set, budjet, provider_categories) //{budjet: budget, length: length, width: width}
console.log(subRes);

recomendetList.push(subRes);
  });

// 4. Соберем результат в итоговый obj
return recomendetList;
};
/*
//пример вызова
const length=500;
const width=10000;
const budget=120000;
const baseCategories = [
    { ageGroup: '1 до 9', count: 31 },
    { ageGroup: '10 до 14', count: 30 },
    { ageGroup: '15 до 18', count: 37 },
    { ageGroup: '19 до 35', count: 55 },
    { ageGroup: '36 до 55', count: 204 },
    { ageGroup: '56 до 75', count: 0 }
];
const call = recomendation_maf_generate({budjet: budget, length: length, width: width, baseCategories: baseCategories});
// функция получаемая на вход набор площадей в формате WGS84, на выходе массив прямоугольник с указанием их сторон
console.log(call);
*/
// 
module.exports = { recomendation_maf_generate};