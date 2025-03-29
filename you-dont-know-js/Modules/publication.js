// function for console.log()
function printDetails(title, author, pubDate) {
	console.log(`
	Title: ${title}
	By: ${author}
	${pubDate}
	`);
}
// function that creates and exports publicAPI with print method
export function create(title, author, pubDate) {
	var publicAPI = {
		print() {
			printDetails(title, author, pubDate);
		},
	};
	return publicAPI;
}
