const ObjectId = require('mongoose').Types.ObjectId;
const isValidObjectId = (id) => {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) return true;
		return false;
	}
	return false;
};

//

const isEmptyOrUndefined = (value) => !value || value.trim() === '';
const isAtLeastOneValueEmpty = (arrayOfValues) =>
	arrayOfValues.some(isEmptyOrUndefined);

//

const isEmailValid = (email) => {
	const emailRegEx = /\S+@\S+\.\S+/;
	return emailRegEx.test(String(email).toLowerCase());
};

module.exports = {
	isValidObjectId,
	isAtLeastOneValueEmpty,
	isEmailValid,
};
