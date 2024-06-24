# mity
Moscow in the yard
"Москва во дворе"
Для установки решения требуется выполнить следующие шаги:
Шаг 1: скопируйте репозиторий в папку backend
git clone https://github.com/DimaGolykh/mity.git
 
Шаг 2: ИНсталяция nodejs и БД mongodb
Для инсталяции окружения Node JS необходимо скачать инсталяционный пакет https://nodejs.org/en
Для инсталяции MongoDB необходимо скачать инсталяционный пакет https://www.mongodb.com/try/download/community
Создайте новую базу данных или кластер, следуя инструкциям, приведенным в документации MongoDB. 

Шаг 3: Укажите параметры подключения
 В файле  src\setup\setup.js найдите mongoose.connect('mongodb://localhost:27017/mity') и укажите свои параметры подключения
 В файле src\controller\catalog\Catalog_controller.js найдите mongoose.connect('mongodb://localhost:27017/mity') и укажите свои параметры подключения

Шаг 4: Настройки папки источника xml   
Скопируйте в любую папку xml файлы МАФ.
в файле /src/setup/setup.js найдите строчку const xmlFolder = "D:/Project/спорт площадки/Новая папка/МАФ 2024" и укажите путь к папке, где у вас хранятся xml документы

Шаг 5: 
Перейдите в папку backend и выполните инициацию проекта nodejs
npm install

Шаг 6: Проливка базовых настроек
в териминале перейдите в папку src\setup\
и выполните команду
node setup.js

Шаг 7: запуск приложения
В терминале перейдите в папку backend/src и выполните команду 
node app.js


Для испольщования контруктора для получения JSON результата необходимо вызвать POST API
Пример: http://127.0.0.1:3000/api/recomendet_maf_list
Параметры передаваемые в json:
   {
  "baseCategories": [
    { "ageGroup": "1 до 9", "count": 31 },
    { "ageGroup": "10 до 14", "count": 30 },
    { "ageGroup": "15 до 18", "count": 37 },
    { "ageGroup": "19 до 35", "count": 55 },
    { "ageGroup": "36 до 55", "count": 204 },
    { "ageGroup": "56 до 75", "count": 0 }
  ],
  "budget": 1000000,
  "width": 10000,
  "length": 10000
}

В ответе АПИ возвращается набор Массивов по каждому поставщику пободраны наборы МАФ.
Структура ответа:
 {
    rectangles: [], //список итераций деления площадок и все полученыне дочерние прямоугольные площадки
    resMafList: []  // наборы МАФ подобраныне в разре каждого поставщика
 }

Для испольщования контруктора для получения excel результата необходимо вызвать POST API
Пример: http://127.0.0.1:3000/api/generateExcel
Параметры передаваемые в json:
   {
  "baseCategories": [
    { "ageGroup": "1 до 9", "count": 31 },
    { "ageGroup": "10 до 14", "count": 30 },
    { "ageGroup": "15 до 18", "count": 37 },
    { "ageGroup": "19 до 35", "count": 55 },
    { "ageGroup": "36 до 55", "count": 204 },
    { "ageGroup": "56 до 75", "count": 0 }
  ],
  "budget": 1000000,
  "width": 10000,
  "length": 10000
}
результат будет в виде excel файла с листами:
 - Base Categories, лист с входными параметрами по запросу
 - Список листов по каждому поставщику.