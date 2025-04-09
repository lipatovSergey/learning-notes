/*
Функция scheduleMeeting(..) должна получать время
начала встречи (строка «чч:мм» в 24-часовом форма-
те) и ее продолжительность (в минутах). Функция
должна вернуть true, если встреча приходится полно-
стью на рабочий день (в соответствии с временем,
заданным в dayStart и dayEnd); если встреча выходит
за рамки рабочего дня, возвращается false.
*/

const dayStart = "07:30";
const dayEnd = "17:45";

function toNum(time) {
	const splited = time.split(":");
	return Number(splited[0]) * 60 + Number(splited[1]);
}

const dayStartNum = toNum(dayStart);
const dayEndNum = toNum(dayEnd);
function scheduleMeeting(startTime, durationMinutes) {
	const start = toNum(startTime);
	const end = toNum(startTime) + durationMinutes;

	if (start >= dayStartNum && end <= dayEndNum) {
		return true;
	} else {
		return false;
	}
}

const testCases = [
	{ start: "7:00", duration: 15, expected: false },
	{ start: "07:15", duration: 30, expected: false },
	{ start: "7:30", duration: 30, expected: true },
	{ start: "11:30", duration: 60, expected: true },
	{ start: "17:00", duration: 45, expected: true },
	{ start: "17:30", duration: 30, expected: false },
	{ start: "18:00", duration: 15, expected: false },
];

testCases.forEach(({ start, duration, expected }, index) => {
	const result = scheduleMeeting(start, duration);

	if (result === expected) {
		console.log(`Test ${index + 1} passed ✅`);
	} else {
		console.error(`Test ${index + 1} failed ❌`);
		console.error(`Input: ${start}, ${duration}min`);
		console.error(`Expected: ${expected}, Got: ${result}\n`);
	}
});
