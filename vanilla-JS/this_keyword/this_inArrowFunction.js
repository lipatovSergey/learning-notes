// this стрелочных функциях в отличие от обычных использует лексическую облать видимости. То есть ссылается на this в области видимости в которой была создана, а не вызвана. Это очень полезно например в callbacks
// тема вообзе не простая. Но я более менее разобрался. Но нужно будет в это ещё погружаться. Думаю с практикой мне станет проще
const counter = {
	count: 0,
	incrementNormal: function () {
		// В обычной функции 'this' ссылается на объект, вызвавший метод (counter)
		setTimeout(function () {
			// анонимная функция вызывается не counter а setTimeout.Поэтому у неё нет доступа к this.count
			// анонимная функция создаёться во время исполнения incrementNormal
			// и ищет значение для своего this  в тот момент когда исполняется
			this.count++; // 'this' здесь будет ссылаться на глобальный объект (window) или undefined (в strict mode)
			console.log("Normal function:", this.count);
		}, 1000);
	},
	incrementArrow: function () {
		// В обычной функции 'this' ссылается на объект, вызвавший метод (counter)
		// и благодаря тому что стрелочная функция имеет лексическую область видимости, она запоминает что в том месте где её создали значение у this.count равно counter.count и использует это значение в момент своего исполнения
		setTimeout(() => {
			this.count++; // 'this' здесь лексически захватывается из внешней функции (incrementArrow), поэтому ссылается на counter
			console.log("Arrow function:", this.count);
		}, 1500);
	},
	incrementNormalFixed: function () {
		// В обычной функции 'this' ссылается на объект, вызвавший метод (counter)
		const self = this; // Захватываем 'this' во внешней области видимости
		setTimeout(function () {
			// хотя анонимная функция вызванна в глобальной области видимости это неважно. В ней храниться self который уже сохранил значение this
			self.count++; // Теперь 'self' корректно ссылается на counter
			console.log("Normal function (fixed):", self.count);
		}, 2000);
	},
};

counter.incrementNormal(); // Через 1 секунду: Normal function: NaN (или 1 в не strict mode)
counter.incrementArrow(); // Через 1.5 секунды: Arrow function: 1
counter.incrementNormalFixed(); // Через 2 секунды: Normal function (fixed): 2

console.log("Initial count:", counter.count); // Выведет: Initial count: 0
