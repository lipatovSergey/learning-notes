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

// Call()
// Вызывая функцию использующую this с методом call() то первый аргумент переданный в call будет определять на какой объект будет указывать this во время выполнения функции. Остальные аргументы работают как обычно.
function greet(greeting) {
	console.log(`${greeting}, ${this.name} ${this.lastName}`);
}
const person1 = { name: "John", lastName: "Doe" };
const person2 = { name: "Alan", lastName: "Smith" };
greet.call(person1, "Hello"); // Hello, John Doe
greet.call(person2, "Hi"); // Hi, Alan Smith
// В call можно передавать null или undefined в нестрогом режиме. Тогда this будет ссылаться на Window или global(Node.js). Но в строгом режиме это вызовет оштибку

// метод apply() работает схоже с call(), но аргументы передаються в виде единственного массива(псевдомассива).
function introduce(age, profession) {
	console.log(
		`My name is ${this.name}, I am ${age} years old, I work as ${profession}`
	);
}
const person = { name: "Charlie" };
const details = [25, "Engineer"];
// Объект который будет использоваться для this должен передавать первым, как и в call()
introduce.apply(person, details); // My name is Charlie, I am 25 years old, I work as Engineer

// bind() в отличие от call() и apply() не вызывает функцию немедленно. Он создаёт новую функцию, у которой значение this навсегда привязанно к указанному значению, также можно предварительно задать аргументы для новой функции
function showInfo() {
	console.log(`Name: ${this.name}, age: ${this.age}`);
}
const user = { name: "Din", age: 45 };
const showDinInfo = showInfo.bind(user);
showDinInfo(); // Name: Din, age: 45
showDinInfo(); // Name: Din, age: 45
showDinInfo(); // Name: Din, age: 45
// showDinInfo всегда будет вызываться с тем же значением
function multiply(a, b) {
	return a * b;
}
const multiplyByFive = multiply.bind(null, 5); // this тут неважен поэтому null
console.log(multiplyByFive(3)); // 5 * 3 = 15
console.log(multiplyByFive(7)); // 5 * 7 = 35
