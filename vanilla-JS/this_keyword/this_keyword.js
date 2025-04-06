// Ключевое слово this указывает на контекст выполнения функции. Чтобы лучше понять, что такое контекст исполнения функции, сравним контекст с областью видимости.
// Область видимости статична и зависит от места инициализации функции (место где она написана). При исполнении функция помнит и может использовать все переменные из своей области видимости
const word = "Hello";
export function sayWord() {
	console.log(word);
}
// Поэтому если мы экспортируем sayWord в другой файл (1.js) и вызовем его там то в console получим "Hello" даже если определим новую переменную word с новым значением в 1.js то функция sayWord помнит и видит переменную word в своей области видимости. То-есть в этом файле.

// this ссылается на контекст. То есть на то место где функция исполняется. Например:
export function screamWord() {
	console.log(this.word.toUpperCase());
}
let helloScreamer = {
	word: "hello",
	scream: screamWord,
	say: sayWord,
};
helloScreamer.scream(); // HELLO
helloScreamer.say(); // Hello

let hiScreamer = {
	word: "hi",
	scream: screamWord,
	say: sayWord,
};
hiScreamer.scream(); // HI
hiScreamer.say(); // Hello
// Тут заметно что функция screamWord использующая this.word использует word из своего контекста (объекта в данном случае) где она была вызванна. Поэтому она будет возвращать разные значения при вызове в helloScreamer и hiScreamer при этом функция sayWord так и будет возвращать word со значением Hello, неважно где мы будем её вызывать в другом файле или внутри объекта. Она уже в своей памяти зафиксировала. word это только Hello.

// Важный момент. В нестрогом режиме вызов функции использующей .this на верхнем уровне вызовет ошибкую. Так как this будет undefined. Поэтопу для примера выше я использовал объекты.
// screamWord(); - такой вызов приведёт к ошибке Cannot read properties of undefined (reading 'word')
// в нестрогом режиме this в таком случае будет ссылаться на Window или global (Node.js)

// this и прототипизация
export let thisAndPrototypes;
// В отличии от многих ООП языков программирования благодаря динамическому контексту this. Он будет ссылаться на объект в котором вызывается, а не на объект в котором был создан.
const homework = {
	topic: "Math",
	study() {
		console.log(`Our homework ${this.topic}`);
	},
};
const jsHomework = Object.create(homework);
const englishHomework = Object.create(homework);
englishHomework.topic = "English";
jsHomework.topic = "JS";
jsHomework.study(); // Our homework JS
englishHomework.study(); // Our homework English
// хотя у homework есть свойство topic, this из study() будет ссылаться на тот объект где была вызванна, а не созданна.
const noHomework = Object.create(homework);
noHomework.study(); // Our homework Math
// Но если объект не имеет своего свойства указанного в this то поиск продолжиться дальше по цепочке прототипов
// в случае с noHomework если бы у homework не было свойства topic то noHomework.study(); вывело бы Our homework undefined

const counter = {
	count: 0,
	incrementNormal: function () {
		// В обычной функции 'this' ссылается на объект, вызвавший метод (counter)
		setTimeout(function () {
			this.count++; // 'this' здесь будет ссылаться на глобальный объект (window) или undefined (в strict mode)
			console.log("Normal function:", this.count);
		}, 1000);
	},
	incrementArrow: function () {
		// В обычной функции 'this' ссылается на объект, вызвавший метод (counter)
		setTimeout(() => {
			this.count++; // 'this' здесь лексически захватывается из внешней функции (incrementArrow), поэтому ссылается на counter
			console.log("Arrow function:", this.count);
		}, 1500);
	},
	incrementNormalFixed: function () {
		console.log("this: ", this);
		const self = this; // Захватываем 'this' во внешней области видимости
		setTimeout(function () {
			self.count++; // Теперь 'self' корректно ссылается на counter
			console.log("Normal function (fixed):", self.count);
		}, 2000);
	},
};

counter.incrementNormal(); // Через 1 секунду: Normal function: NaN (или 1 в не strict mode)
counter.incrementArrow(); // Через 1.5 секунды: Arrow function: 1
counter.incrementNormalFixed(); // Через 2 секунды: Normal function (fixed): 2

console.log("Initial count:", counter.count); // Выведет: Initial count: 0
