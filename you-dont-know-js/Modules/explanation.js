// Note the key difference between ES6 and classical modules
// Classical module
function createModule() {
	let localState = 0; // ← Inside the function!

	return {
		increment() {
			localState++;
		},
		getValue() {
			return localState;
		},
	};
}
// It is itself a function, meaning localState will have scope within this function.
// Each new call to createModule() will create a new localState with a new scope.

// ES6 modules are files
// es-module.js
let sharedState = 0; // ← Outside exported functions!

export function increment() {
	sharedState++;
}

export function getValue() {
	return sharedState;
}
// This means sharedState is in the scope of the es-module.js file itself.
// This means sharedState will be shared for all instances created using this module.

// It's perfectly reasonable to export a factory function from ES6 module when needed
// multiInstance.js
export function createInstance() {
	let privateData = 0;

	return {
		getData() {
			return privateData;
		},
		setData(value) {
			privateData = value;
		},
	};
}
// Now the multiInstance.js singleton loads once, but createInstance creates independent instances each time

// In React, both patterns are used everywhere. For example for API client
let authToken = null; // Module's shared state

export function setToken(token) {
	authToken = token;
}

export async function fetchData() {
	const response = await fetch("/api/data", {
		headers: { Authorization: authToken },
	});
	return response.json();
}

// ComponentA.jsx
import { setToken } from "./api";

function ComponentA() {
	useEffect(() => {
		setToken("abc123"); // Will set token for all components
	}, []);
}

// ComponentB.jsx
import { fetchData } from "./api";
function ComponentB() {
	const handleClick = async () => {
		const data = await fetchData(); // Uses the shared token
	};
}
// Meaning the same token will be used by fetchData.

// Context is an analog of singletons
const AuthContext = createContext(); // Created once

function App() {
	return (
		<AuthContext.Provider value={{ token: "abc123" }}>
			<Component />
		</AuthContext.Provider>
	);
}

function Component() {
	const { token } = useContext(AuthContext); // All components get the same value
}

// Hooks are analogs of factories
function Component() {
	const [state, setState] = useState(0); // Own state for each component
	// Each useRef call creates a new object
	const ref = useRef(null);
}

// In React we use singletons for services and factories for components.
// But this is not a strict rule. Exceptions exist.
