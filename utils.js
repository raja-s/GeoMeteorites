'use strict';

function modulo(a, n) {
	return ((a % n) + n) % n;
}

function clamp(value, min, max) {
	return (value <= min) ? min : (value >= max) ? max : value;
}

function sphericalToCartesian(r, phi, theta) {
	let COS_THETA = Math.cos(theta);
	return {
		x : r * COS_THETA * Math.sin(phi),
		y : r * Math.sin(theta),
		z : r * COS_THETA * Math.cos(phi)
	};
}

function cartesianToSpherical(x, y, z) {
	const R    = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
	const R_XZ = Math.sqrt(R ** 2 - y ** 2);
	return {
		r     : R,
		phi   : Math.acos(z / R_XZ) * Math.sign(x),
		theta : Math.asin(y / R)
	};
}

function sphericalToGeographical(phi, theta) {
	return {
		long : phi   * 180 / Math.PI,
		lat  : theta * 180 / Math.PI
	};
}

/**
 * Removes all the children of an HTML element.
 */
function removeChildren(element) {
	// Keep removing the first child of the
	// element until there are no more children
	while (element.hasChildNodes()) {
		element.removeChild(element.firstChild);
	}
}

function fillUpDataHoles(data, accessor, constructor, min, max) {

	const RESULT_DATA = data.slice();

	// Fill up empty holes in the data
	let previous = accessor(RESULT_DATA[0]);
	for (let i = 1 ; i < RESULT_DATA.length ; i++) {
		const CURRENT = accessor(RESULT_DATA[i]);
		const DIFF = CURRENT - previous;
		if (DIFF > 1) {
			for (let k = 1 ; k < DIFF ; k++) {
				RESULT_DATA.splice(i + k - 1, 0, constructor(previous + k));
			}
			i += DIFF - 1;
		}
		previous = CURRENT;
	}

	for (let i = accessor(RESULT_DATA[0]) - 1 ; i >= min ; i--) {
		RESULT_DATA.unshift(constructor(i));
	}

	for (let i = accessor(RESULT_DATA[RESULT_DATA.length - 1]) + 1; i <= max ; i++) {
		RESULT_DATA.push(constructor(i));
	}

	return RESULT_DATA;

}

function limitedIntegerTicks(max, limit) {

	const RATIO = max / (limit - 1);
	const TICK_STEP = (Math.floor(RATIO) === RATIO) ? RATIO + 1 : Math.ceil(RATIO);

	const MAX = TICK_STEP * limit;
	const TICKS = [];

	for (let tick = 0 ; tick < MAX ; tick += TICK_STEP) {
		TICKS.push(tick);
		if (tick > max) {
			break;
		}
	}

	return TICKS;

}

function groupByYear(data) {

	const GROUPED_DATA = [];

	const YEAR_INDICES = {};

	data.forEach(entry => {

		if (entry.year in YEAR_INDICES) {

			const GROUPED_ENTRY = GROUPED_DATA[YEAR_INDICES[entry.year]];

			GROUPED_ENTRY.number++;
			GROUPED_ENTRY.totalMass += entry.mass;

		} else {

			YEAR_INDICES[entry.year] = GROUPED_DATA.push({
				year      : entry.year,
				number    : 1,
				totalMass : entry.mass
			}) - 1;

		}

	});

	return GROUPED_DATA.sort((entry1, entry2) => {

		const YEAR1 = entry1.year.getFullYear();
		const YEAR2 = entry2.year.getFullYear();

		return (YEAR1 < YEAR2) ? -1 : (YEAR1 > YEAR2) ? 1 : 0;

	});

}
