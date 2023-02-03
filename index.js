import { got } from "got";
import { JSDOM } from "jsdom";

const URL = "https://www.flowstate.fm/p/sadao-watanabe";
const EXTRACTION = {
	element: "a",
	search_mode: 5,
	search_term: "Hi",
};

got(URL)
	.then((response) => {
		let htmlString = String(response.body);
		htmlString = getHtmlElementAsString("body", htmlString);
		htmlString = setParentElementOfHtmlString("html", htmlString);
		htmlString = addHtmlDoctype(htmlString);

		const dom = new JSDOM(htmlString);
		dom.window.document
			.querySelectorAll(EXTRACTION.element)
			.forEach((element) => {
				if (
					matchesSearch(
						element.textContent,
						EXTRACTION.search_mode,
						EXTRACTION.search_term
					)
				) {
					const href = element.href;
					console.log(href);
				}
			});
	})
	.catch((error) => {
		console.error(error);
	});

// TODO ADD ERROR HANDLING FOR NO TAG FOUND
function getHtmlElementAsString(tag, html) {
	let htmlString = String(html);

	const startTag = `<${tag}>`;
	const endTag = `</${tag}>`;

	const htmlTagStartIndex = htmlString.indexOf(startTag);
	const htmlTagEndIndex = htmlString.indexOf(endTag) + endTag.length;
	const htmlTagString = htmlString.substring(
		htmlTagStartIndex,
		htmlTagEndIndex
	);
	return htmlTagString;
}

// TODO ADD ERROR HANDLING FOR SINGLE USE ELEMENTS
function setParentElementOfHtmlString(tag, html) {
	let htmlString = String(html);

	const startTag = `<${tag}>`;
	const endTag = `</${tag}>`;

	let nestTagContent;
	nestTagContent += startTag;
	nestTagContent += htmlString;
	nestTagContent += endTag;

	return nestTagContent;
}

// TODO ADD ERROR HANDLING FOR IF ALREADY EXISTS
function addHtmlDoctype(html) {
	let htmlString;

	htmlString = "<!DOCTYPE html>";
	htmlString += String(html);

	return htmlString;
}

function matchesSearch(string, searchMode, searchValue) {
	const returnAll =
		searchValue === "" ||
		typeof searchValue === "undefined" ||
		!isNaN(searchValue);

	searchMode = stringToInteger(searchMode);

	if (returnAll) {
		return true;
	}

	if (isString(searchMode))
		throw new Error(
			`Invalid search_mode value provided (value: ${searchMode}, typeof: ${typeof searchMode}). search_mode should be a number.`
		);

	switch (searchMode || isNaN(searchMode)) {
		case false:
		case undefined:
		case 0:
			return stringContains(searchValue, string);
			break;

		case 1:
			return stringEquals(searchValue, string);
			break;

		case 2:
			return stringStartsWith(searchValue, string);
			break;

		case 3:
			return stringEndsWith(searchValue, string);
			break;

		default:
			throw new Error(
				`Invalid search_mode value provided (value: ${searchMode}, typeof: ${typeof searchMode}). search_mode should range between 0 and 3.`
			);
			break;
	}
}

function stringContains(searchvalue, string) {
	if (string.includes(searchvalue)) return true;
	return false;
}

function stringEquals(searchvalue, string) {
	if (string === searchvalue) return true;
	return false;
}

function stringStartsWith(searchvalue, string) {
	if (string.startsWith(searchvalue)) return true;
	return false;
}

function stringEndsWith(searchvalue, string) {
	if (string.endsWith(searchvalue)) return true;
	return false;
}

function isString(value) {
	const parseIntValue = parseInt(value);
	const numberValue = Number(value);

	if (isNaN(parseIntValue) || isNaN(numberValue)) return true;

	return false;
}

function stringToInteger(value) {
	const parseIntValue = parseInt(value);
	const numberValue = Number(value);

	if (typeof parseIntValue === "number" && !isNaN(parseIntValue))
		return parseIntValue;
	if (typeof numberValue === "number" && !isNaN(numberValue))
		return numberValue;

	return value;
}
