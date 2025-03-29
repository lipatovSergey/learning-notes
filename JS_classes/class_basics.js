// @ts-nocheck
class User {
	#age = 0;
	constructor(name, age) {
		this.name = name;
		this.age = age; // calls setter
	}
	set age(value) {
		if (value < 0) return;
		this.#age = value;
	}
	get age() {
		return this.#age;
	}
	sayHi() {
		console.log(`Hi! My name is ${this.name}, I am ${this.age} years old`);
	}
}

const user = new User("John", 22);
user.sayHi();
user.age = -5;
user.sayHi(); // age was not chaged

class Admin extends User {
	constructor(name, age, role = "admin") {
		super(name, age);
		this.role = role;
	}
	sayHi() {
		console.log(
			`Hi. I am administrator ${this.name}, I am ${this.age} years old`
		);
	}
}

const admin = new Admin("Dan", 27);
admin.sayHi();
admin.age = -1;
admin.sayHi(); // admin age was not chaged
