const Catalog = require('../../models/Catalog'); // Import the Catalog model
const mongoose = require('mongoose');
const MongoClient = require('mongodb');

mongoose.connect('mongodb://localhost:27017/mity')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

function processPlanes(planeCoordinates) {
    let result = {
        areaList: planeCoordinates,
        largestRectangleDimensions: {},
        catalogItems: []
    };

    // Process each plane
    for (let plane of planeCoordinates) {
        // Расчет наибольшего прямоугольника в плоскости
        let largestRectangle = calculateLargestRectangle(plane);
        result.largestRectangleDimensions = largestRectangle;

        // Divide the plane into two areas
        let dividedAreas = dividePlane(plane);

        // Select Catalog items for each area
        let catalogItems = [];
        for (let area of dividedAreas) {
            let catalogItem = selectCatalogItem(area);
            catalogItems.push({ provider: catalogItem.provider, items: [catalogItem] });
        }

        result.catalogItems.push(catalogItems);
    }

    return result;
}

function calculateLargestRectangle(plane) {
    // Логика расчета наибольшего прямоугольника
    let maxX = -Infinity;
    let minX = Infinity;
    let maxY = -Infinity;
    let minY = Infinity;

    for (const point of coordinates.flat()) {
        const [x, y] = point;
        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
        maxY = Math.max(maxY, y);
        minY = Math.min(minY, y);
    }

    const width = Math.abs(maxX - minX);
    const height = Math.abs(maxY - minY);

    return { length: Math.max(width, height), width: Math.min(width, height) };// 
}

async function getProviderList(){
    const agg = [
        {
          '$group': {
            '_id': '$provider'
          }
        }
      ];

      try {
       
        const aggregationResult = await Catalog.aggregate([
            {
              $group: {
                _id: {
                  provider: '$provider',
                  ageCategory: '$ageCategory'
                },
                elementList: { $push: '$$ROOT' }
              }
            },
            {
              $group: {
                _id: '$_id.provider',
                groupslist: {
                  $push: {
                    groupName: '$_id.ageCategory',
                    elementList: '$elementList'
                  }
                }
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
        mongoose.disconnect();
    }
}

async function getProviderListByFilter(attrObject){

  const attr = Object.create(attrObject);
  //const age = parseInt(attr.age);
  const arealength = parseInt(attr.length);
  const areaWidth  = parseInt(attr.width);
  const budjet = parseFloat(attr.budjet);

    try {
     
      const aggregationResult = await Catalog.aggregate([
        {
          $match: {
            dimensionsLength: {
              $lte: arealength
            },
            dimensionsWidth: {
              $lte: areaWidth
            },
            price: {
              $lte: budjet
            }
          }
        },
        {
          $group: {
            _id: {
              provider: "$provider",
              ageCategory: "$ageCategory"
            },
            elementList: {
              $push: "$$ROOT"
            }
          }
        },
        {
          $group: {
            _id: "$_id.provider",
            groupslist: {
              $push: {
                groupName: "$_id.ageCategory",
                elementList: "$elementList"
              }
            }
          }
        }
      ],
        { maxTimeMS: 60000, allowDiskUse: true });

      const result = aggregationResult;

      return result
  } catch (error) {
      console.error(error);
  } finally {
     // mongoose.disconnect();
  }
}


function dividePlane(plane) {

    return [plane.slice(0, Math.floor(plane.length / 2)), plane.slice(Math.floor(plane.length / 2))];
}

function selectCatalogItem(area) {

    return Catalog.findOne({}); // 
}

//const  a = await getProviderList();
//onst b = a[0]('_id');
//console.log(b);
// Module exports
module.exports = { processPlanes, getProviderList, getProviderListByFilter};