var greeting = "Hello"

console.log(greeting)

// greeting = ."Hi"

// Программа не выведет "Hello", а выведет ошибку SyntaxError
// это противоречит тому, как работают интерпретируемые языки


// Ещё один пример 
console.log("Howdy")
saySomething("Hello", "Hi")

function saySomething(greeting, greeting) {
  "use strict"
  console.log(greeting)
}
// Тут тоже console.log не отработает. Так как  допущена ошибка
// в параметры функции saySomething передано два параметра с одиновымим
// названиями, что запрещено в strict mode

// Пример с поднятием 
function saySomething() {
  var greeting = "Hello";
  {
    greeting = "Howdy"; // здесь происходит ошибка
    let greeting = "Hi";
    console.log(greeting);
  }
}

saySomething()
// То  что мы сразу получаем ошибки а не вывод в консоль указывает на то, что JS
// по своему поведению относиться к компелируемому языку. Но только в том смысле, 
// что  код сначала разбирается (компелируется) а уже только потом исполняется. 
// НО! Классификация js как компелируемого не имеет отношения  к модели распространения
// в двоичном исполняемом представлении (или байт-коде)
