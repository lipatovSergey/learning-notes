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
