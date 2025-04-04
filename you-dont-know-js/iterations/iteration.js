// Итератор это объект который умеет выдавать значения по одному и запоминать на каком элементе он остановился
// У итератора есть метод next(), next() возвращает объект вида { value, done }.
// Для примера возьмём цикл
const fruits = ["🍎", "🍌", "🍊"];
// Применим к нему цикл for of
for (const fruit of fruits) {
	console.log(fruit); // 🍎, затем 🍌, затем 🍊
}
// for of вызывает fruits[Symbol.iterator]()

// немного о [Symbol.iterator](). Это метод, вызов которого возвращает новый объект итератор
const arr = [1, 2, 3];
// Создаём итератор. Он запоминает что ещё не начал перебирать элементы
const iterator = arr[Symbol.iterator]();
console.log("iterator", iterator);
// Затем цикл последовательно вызывает у итератора метод next, пока не получит done: true

// Первый вызов next(). Итератор берёт первый элемент массива (1) и возвращает объект {value: 1, done false}
console.log(iterator.next());
// Второй вызов next(). Итератор берёт второй элемент массива (2) и возвращает объект {value: 2, done false}
console.log(iterator.next());
// Третий вызов next(). Итератор берёт третий элемент массива (3) и возвращает объект {value: 3, done false}
console.log(iterator.next());
// Четвёртый вызов next(). Так как элементы кончились вернёт {value: undefined, done: true}
console.log(iterator.next());

// Итераторы дают очень большие возможнсти и контроль в отличчи от обычных циклов. Например можно обрабатывать поступающие данные получая их постепенно. С for такое не сработает. Он требует заранее знать все элементы.

// Итераторы это фундаментальная концепция JS. Они лежат в основе многих возможностей языка.

// Spread опреатор. Пример со строкой
const arr1 = [..."hello"]; // String → Итератор → Массив
console.log(arr); // ['h', 'e', 'l', 'l', 'o']
// Вот что происходит под капотом
const str = "hello";
const iterator1 = str[Symbol.iterator](); // Получаем итератор строки
const arr2 = [];
let result = iterator1.next();
while (!result.done) {
	arr.push(result.value); // Добавляем символ в массив
	result = iterator1.next(); // Получаем следующий символ
}

// Rest оператор. Пример с аргументами функции
function sum(...nums) {
	// Итератор аргументов
	return nums.reduce((a, b) => a + b);
}
// Тоже самое но с итераторами
function sum() {
	// Получаем итератор для arguments (псевдомассив)
	const iterator = arguments[Symbol.iterator]();
	const nums = [];
	let result = iterator.next(); // Получаем первый элемент
	// Перебираем все элементы с помощью next()
	while (!result.done) {
		nums.push(result.value); // Добавляем элемент в массив
		result = iterator.next(); // Переходим к следующему элементу
	}
	return nums.reduce((a, b) => a + b); // Суммируем все элементы
}
// Array.from(). С итератором строки
Array.from("abc"); // ['a', 'b', 'c']
const str3 = "abc";
const iterator3 = str[Symbol.iterator](); // Получаем итератор строки

const arr3 = [];
let result3 = iterator.next();
while (!result3.done) {
	arr.push(result3.value); // Добавляем символ в массив
	result3 = iterator.next(); // Получаем следующий символ
}

// Большинство современных методов использующих перебор используют итераторы
// Итераторы — современный стандарт (ES6+) для ленивых вычислений и работы с потоками.
// for..of, Spread, Rest, Array.from(), деструкторизация, Promise.All/Promice.race, генераторы function*, коллекции Map, Set, WeakMap

// Методы которые НЕ используют итераторы
// Старые методы работают только с полными коллекциями в памяти.
// Классические циклы, Array.prototype.forEach, Object.keys/Object.values, старые методы массивов map filter reduce

// Итератор сам по себе является объектом который имеет метод [Symbol.iterator](). А значит является итерируемым, его можно передавать в методы работающие только с итерируемыми данными. Это открывает много возможностей.
// Например terator после создания и кажого применённого next останавливается на том элементе на котором next ещё небыл использован,  значит мы можем создать итератор. Передать его в какой нибудь цикл который напрмер обработает первые три значения. Потом заверщить этот цикл с break  и оставшиеся данные обработать в другом цикле. При этом нам не нужно будет придумывать никаких дополнительных костылей типо удаления из массива уже отработанных элементов или сохранения индекса элемента на котором остановился первый цикл чтобы знать откуда начинать второй
const arr4 = ["🍎", "🍌", "🍊", "🍉", "🍇"];
const iterator4 = arr4[Symbol.iterator]();

// Первый цикл обрабатывает только 2 элемента
for (let i = 0; i < 2; i++) {
	console.log("Первый цикл:", iterator4.next().value);
}

// Второй цикл продолжает с того же места
console.log("Второй цикл начинает работу...");
for (const fruit of iterator4) {
	console.log("Второй цикл:", fruit);
}
