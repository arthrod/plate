// Lines 5413-5418 in old_implementation.js
function arrayIncludes (list) {
	return function(element) {
		return list && list.indexOf(element) !== -1;
	}
}
