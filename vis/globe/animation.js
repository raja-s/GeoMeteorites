'use strict';

/*
	Variables
*/

let time;

let mainAnimationPlaying = false;
let mainAnimationDone    = true;
let droppingMeteorites   = false;

let mainAnimationTimeouts     = [];
let droppingMeteoritesTimeout = null;

let yearCallbackSchedule = {};
let yearMinimumDurations = {};

/*
	Functions
*/

function scheduleCallback(years, callback) {

	years.forEach(year => {

		if (!(year in yearCallbackSchedule)) {
			yearCallbackSchedule[year] = [];
		}

		yearCallbackSchedule[year].push(callback);

	});

}

function clearSchedule() {
	yearCallbackSchedule = {};
}

function setMinimumDuration(years, duration) {

	if (duration > 0) {

		years.forEach(year => {

			yearMinimumDurations[year] = (year in yearMinimumDurations) ?
				Math.max(yearMinimumDurations[year], duration) : duration;

		});

	}

}

function clearMinimumDurations() {
	yearMinimumDurations = {};
}

function setTime(newTime) {

	if (newTime < timelineStart() || newTime > timelineEnd()) {
		return;
	}

	// Set time
	time = newTime;

	// Update the timeline time indicator
	updateTimeIndicator();

	hideMessage();

	// Check if there are callbacks
	// scheduled for this year
	if (time in yearCallbackSchedule) {

		// Run the scheduled callbacks
		yearCallbackSchedule[time].forEach(callback => callback(time));

		// Remove the callbacks
		delete yearCallbackSchedule[time];

	}

}

function dropMeteorites() {

	clearMainAnimationTimeouts();

	if (droppingMeteoritesTimeout !== null) {
		clearTimeout(droppingMeteoritesTimeout);
		droppingMeteoritesTimeout = null;
		droppingMeteorites = false;
	}

	const FILTERED_DATA = meteoriteData.filter(entry => entry.year.getFullYear() === time);
	const COUNT = FILTERED_DATA.length;

	if (COUNT === 0) {
		return;
	}

	droppingMeteorites = true;

	const LOG = Math.log10(COUNT);

	const LAUNCH_DURATION = (LOG ** 3) * SECOND;

	const SQRT             = Math.sqrt(COUNT);
	const GROUP_COUNT      = Math.round(SQRT);
	const WHOLE_GROUP_SIZE = Math.ceil(SQRT);

	const DELTA_TIME = (GROUP_COUNT === 1) ? 0 : LAUNCH_DURATION / (GROUP_COUNT - 1);

	/*let index = 0;
	for (let i = 0 ; i < GROUP_COUNT ; i++) {
		setTimeout(() => {

			FILTERED_DATA.slice(index, index + WHOLE_GROUP_SIZE).forEach((meteorite, i) =>
				launchMeteorite(meteorite.long, meteorite.lat, meteorite.mass));

			index += WHOLE_GROUP_SIZE;

		}, DELTA_TIME * i);
	}*/

	let duration = 0;
	let largestDuration = 0;

	FILTERED_DATA.forEach((meteorite, i) => {

		mainAnimationTimeouts.push(setTimeout(() => {
			launchMeteorite(meteorite.long, meteorite.lat, meteorite.mass);
		}, duration));

		if (duration > largestDuration) {
			largestDuration = duration;
		}

		duration += 50;
		duration %= LAUNCH_DURATION;

	});

	/*FILTERED_DATA.forEach((meteorite, i) => {
		setTimeout(() => dropMeteorite(meteorite.long, meteorite.lat, meteorite.mass),
			i * 500);
	});*/

	droppingMeteoritesTimeout = setTimeout(() => {
		droppingMeteorites = false;
	}, largestDuration + FALL_DURATION);

}

function setYear(year) {

	setTime(year);

	dropMeteorites();

	if (time === timelineEnd()) {
		mainAnimationDone = true;
	}

}

function nextYear() {
	setYear(time + 1);
}

function resumeMainAnimation() {

	if (!mainAnimationPlaying) {

		mainAnimationPlaying = true;
		mainAnimationDone    = false;

		resumeGlobeAnimation();

	}

}

function startMainAnimation() {

	time = timelineStart() - 1;

	clearSchedule();

	const dates = Array.from(messageMap.keys());
	scheduleCallback(dates, showMessage);
	setMinimumDuration(dates, 5000);

	mainAnimationPlaying = true;
	mainAnimationDone    = false;
	droppingMeteorites   = false;

	resumeGlobeAnimation();

}

function pauseMainAnimation() {

	mainAnimationPlaying = false;

	pauseGlobeAnimation();

}

function backToGlobalView() {

	targetCameraDistance = CAMERA_BOUNDS.STD;

	updateTimeline(groupByYear(meteoriteData));

	resumeGlobeAnimation();

	showClassStatistics();

}

function clearMainAnimationTimeouts() {
	mainAnimationTimeouts.forEach(timeout => clearTimeout(timeout));
	mainAnimationTimeouts = [];
}
