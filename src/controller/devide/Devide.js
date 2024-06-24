const Catalog = require('../../models/Catalog'); // Import the Catalog model
const mongoose = require('mongoose');

//const catalogListGroupByProviderAndAgeLevel = await catalogController.getProviderList();

  // пример рекурсии с делением родительского прямоугольника на 3 дочерних
  function divideRectangles(rectangle, countP2) {
    const p1 = { length: 10, width: 5 };
    const p2 = { length: 10, width: 5 }; // задаем параметры наименьшего прямоугольника
    let p2Count = countP2 || 0;
    
    // Базовое условие: p2 помещается в родительскую площадь
    if (rectangle.length < p2.length || rectangle.width < p2.width) {
        return { rectangles: [], p2Count };
    }

    // Расчет p3 и p4
    const p3 = { length: rectangle.length - p2.length, width: rectangle.width };
    const p4 = { length: p2.length, width: rectangle.width - p2.width };

    // рекурсия p3
    const { rectangles: subRectanglesP3, p2Count: p2CountP3 } = divideRectangles(p3, p2Count);

    // рекурсия p4
    const { rectangles: subRectanglesP4, p2Count: p2CountP4 } = divideRectangles(p4, p2CountP3);

    // считаем общее  p2 кол-во
    p2Count = p2CountP4 + 1;

    // Construct the result array with rectangle dimensions
    const resultRectangles = [
        { length: p3.length, width: p3.width },
        { length: p4.length, width: p4.width },
        ...subRectanglesP3,
        ...subRectanglesP4
    ];

    return { rectangles: resultRectangles, p2Count };
}


// инициация вызова
const initialRectangle = { length: 10, width: 5 };
const initialP2Count = 0;
const result = divideRectangles(initialRectangle, initialP2Count);
 console.log(result);

 module.exports =  {divideRectangles};
