const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const xml2js = require('xml2js');
const Catalog = require('../models/Catalog'); 
const Rating = require('../models/Rating'); 

const xmlFolder = "D:/Project/спорт площадки/Новая папка/МАФ 2024";

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mity')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

function parseXmlData(xmlData) {
    // Реализация парсинга XML данных и преобразования их в объект для сохранения в MongoDB
    // Возвращаем объект с данными для каталога
    let jsonResult = {};
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            jsonResult = result;
        }
    });
    return jsonResult;
}

fs.readdirSync(xmlFolder).forEach(file => {
    if (path.extname(file) === '.xml') {
        const xmlData = fs.readFileSync(path.join(xmlFolder, file), 'utf8');
        const jsonObj = parseXmlData(xmlData);

//Catalog
        if (jsonObj.Catalog.dimensions.split('x').length < 3){
            if (jsonObj.Catalog.dimensions.split('x').length === 2){
                const strA = jsonObj.Catalog.dimensions.split('x').slice(0)[0].toString().replace(/\D/g, '');
                const strB = jsonObj.Catalog.dimensions.split('x').slice(1)[0].toString().replace(/\D/g, '');
                constResStr= strA + 'x' + strB + 'x0';
                jsonObj.Catalog.dimensions = constResStr;
            }else{
                if(jsonObj.Catalog.dimensions.split('×').length > 1) {
                    const strA = jsonObj.Catalog.dimensions.split('×').slice(0)[0].toString().replace(/\D/g, '');
                    const strB = jsonObj.Catalog.dimensions.split('×').slice(1)[0].toString().replace(/\D/g, '');
                    constResStr= strA + 'x' + strB + 'x0';
                    jsonObj.Catalog.dimensions = constResStr; 
                } else {
                    if(jsonObj.Catalog.dimensions.split('х').length > 1) {
                        const strA = jsonObj.Catalog.dimensions.split('х').slice(0)[0].toString().replace(/\D/g, '');
                        const strB = jsonObj.Catalog.dimensions.split('х').slice(1)[0].toString().replace(/\D/g, '');
                        constResStr= strA + 'x' + strB + 'x0';
                        jsonObj.Catalog.dimensions = constResStr; 
                    } else {
                        if (jsonObj.Catalog.dimensions.split('=').length > 1){
                        const strA = jsonObj.Catalog.dimensions.split('=').slice(1)[0].toString().replace(/\D/g, '');
                        constResStr= strA + 'x' + strA + 'x0';
                        jsonObj.Catalog.dimensions = constResStr; 
                        }else {
                            if (jsonObj.Catalog.dimensions.split(',').length > 1){
                                const strA = jsonObj.Catalog.dimensions.split(',').slice(0)[0].toString().replace(/\D/g, '');
                                const strB = jsonObj.Catalog.dimensions.split(',').slice(1)[0].toString().replace(/\D/g, '');
                                constResStr= strA + 'x' + strB + 'x0';
                                jsonObj.Catalog.dimensions = constResStr; 
                                }else {
                                    if (jsonObj.Catalog.dimensions === ''){
                                        jsonObj.Catalog.dimensions = '0x0x0';
                                    }else{
                                    }           
                                }
                        }
                    }  
                }
            }
        }else{
            if (jsonObj.Catalog.dimensions.split('x').slice(0)[0].toString().replace(/\D/g, '') === '' && jsonObj.Catalog.dimensions.split('x').slice(1)[0].toString().replace(/\D/g, '') != '') {
                const strA = jsonObj.Catalog.dimensions.split('x').slice(1)[0].toString().replace(/\D/g, '');
                const strB = jsonObj.Catalog.dimensions.split('x').slice(1)[0].toString().replace(/\D/g, '');
                constResStr= strA + 'x' + strB + 'x0';
                jsonObj.Catalog.dimensions = constResStr;
            }
            if (jsonObj.Catalog.dimensions.split('x').slice(0)[0].toString().replace(/\D/g, '') === '' && jsonObj.Catalog.dimensions.split('x').slice(1)[0].toString().replace(/\D/g, '') === ''){
                const strA = jsonObj.Catalog.dimensions.split('x').slice(2)[0].toString().replace(/\D/g, '');
                const strB = jsonObj.Catalog.dimensions.split('x').slice(2)[0].toString().replace(/\D/g, '');
                constResStr= strA + 'x' + strB + 'x0'; 
                jsonObj.Catalog.dimensions = constResStr;
            }
        }

        const newCatalog = new Catalog({
            image: jsonObj.Catalog.image,
            catalogName: jsonObj.Catalog.catalogName,
            vendorCode: jsonObj.Catalog.vendorCode,
            analogSample: jsonObj.Catalog.analogSample,
            sampleCode: jsonObj.Catalog.sampleCode,
            dimensions: jsonObj.Catalog.dimensions,
            dimensionsLength:jsonObj.Catalog.dimensions.split('x').slice(0).map(Number)[0],
            dimensionsWidth:jsonObj.Catalog.dimensions.split('x').slice(1).map(Number)[0],
            description: jsonObj.Catalog.description,
            price: jsonObj.Catalog.price,
            name: jsonObj.Catalog.name,
            provider: jsonObj.Catalog.provider,
            type: jsonObj.Catalog.type,
            units: jsonObj.Catalog.units,
            typeEquipment: jsonObj.Catalog.typeEquipment,
            safetyZones: jsonObj.Catalog.safetyZones,
            techDocumentation: jsonObj.Catalog.techDocumentation,
            ageCategory: jsonObj.Catalog.ageCategory,
            ageStart:jsonObj.Catalog.ageCategory.split(' ').slice(1).map(Number)[0],
            ageEnd: jsonObj.Catalog.ageCategory.split(' ').slice(3).map(Number)[0],
            territoryType: jsonObj.Catalog.territoryType 
        });
      newCatalog.save();
    }
});

// Rating
const ratingsData = [
    { name: "Скамья", rating: 4517 },
    { name: "Качалка", rating: 2631 },
    { name: "Качели", rating: 2446 },
    { name: "Комплекс детский", rating: 2094 },
    { name: "Тренажер спортивный", rating: 1994 },
    { name: "Песочница", rating: 1580 },
    { name: "Игровая форма", rating: 1229 },
    { name: "Карусель", rating: 991 },
    { name: "Горка", rating: 487 },
    { name: "Ворота игровые", rating: 411 },
    { name: "Баскетбольная стойка", rating: 372 },
    { name: "Турник", rating: 174 },
    { name: "Шведская стенка", rating: 141 },
    { name: "Волейбольная стойка", rating: 65 },
    { name: "Баскетбольный щит", rating: 33 },
    { name: "Гимнастический комплекс", rating: 33 },
    { name: "Лабиринт", rating: 14 },
    { name: "Грибок", rating: 2 }
];

Rating.insertMany(ratingsData);