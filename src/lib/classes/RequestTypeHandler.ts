import { error, type HttpError } from "@sveltejs/kit";


/** Extremely type unsafe, but is actually quite safe at run time */
export default class RequestTypeHandler {

	constructor (
		private path: string,
		private variableName: string,
		private variable: string | undefined,
		private validTypes: ("string"|"number"|"boolean"|"null")[],
		private restrictedValues: (string|number|boolean|null)[])
	{
		let x = typeof 9;
		x
	}

	isUndefined() { return typeof this.variable === "undefined" || this.variable === undefined }
	isString() { return typeof this.variable === "string" }
	isNumber() { return !isNaN(parseFloat(this.variable || "")) && parseFloat(this.variable || "") == this.variable as any} // loose type check
	isBoolean() { return this.variable === "true" || this.variable === "false" || typeof this.variable === "boolean" }
	isNull() { return this.variable === "null" || this.variable === null }
	isRestrictedValue() { return this.restrictedValues.includes(this.variable || "") }

	getTrueTypedVariable() {
		if (this.isUndefined()) { return undefined }
		if (this.isNull()) { return null }
		if (this.isNumber()) { return parseFloat(this.variable || "") }
		if (this.isString()) { return this.variable }
	}

	formattedError(invalidType: string, validTypes: ("string"|"number"|"boolean"|"null")[] | (string|number|boolean|null)[]) {
		return error(422, { message: 
			`${this.path}: The variable '${this.variableName}' is ${this.restrictedValues.length == 0 ? "typeof ": ""}${invalidType}. Expected ${this.restrictedValues.length == 0 ? "typeof ": ""}${JSON.stringify(validTypes)?.replace(/"/g, "'")}. Variable contents: ${JSON.stringify(this.variable)?.replace(/"/g, "'")}` })
	}
	validate(cb: (error: HttpError | undefined) => void) {

		if (this.restrictedValues.length > 0) {
			let trueVariable = this.getTrueTypedVariable()
			if (!trueVariable) { return cb(this.formattedError("undefined", this.restrictedValues)) }
			if (!this.restrictedValues.includes(trueVariable)) {
				return cb(this.formattedError(JSON.stringify(this.variable)?.replace(/"/g, "'"), this.restrictedValues))
			}
		}
		if (this.isUndefined()) { return cb(this.formattedError("undefined", this.validTypes)) }

		let hasValidType = false;
		for (let validType of this.validTypes) {
			let isValidType = false;
			switch (validType) {
				case "string": 
					isValidType = this.isString()
					break
				case "number":
					isValidType = this.isNumber()
					break
				case "boolean":
					isValidType = this.isBoolean()
					break
				case "null":
					isValidType = this.isNull()
					break
			}

			if (isValidType) {
				hasValidType = true
				break
			}

		}

		if (hasValidType) { cb(undefined) }
		else {
			cb(this.formattedError(typeof this.variable, this.validTypes))
		}

	}

}