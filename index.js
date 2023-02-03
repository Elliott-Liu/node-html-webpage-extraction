import { got } from "got";
import { JSDOM } from "jsdom";

const URL = "https://www.flowstate.fm/p/sadao-watanabe";
const QUERY = {
	element: "a",
	search_mode: 0,
	search_term: "Spotify",
};

got(URL)
	.then((response) => {
		let htmlString = String(response.body);
		htmlString = getHtmlElementAsString("body", htmlString);
		htmlString = setParentElementOfHtmlString("html", htmlString);
		htmlString = addHtmlDoctype(htmlString);

		const dom = new JSDOM(htmlString);
		dom.window.document.querySelectorAll(QUERY.element).forEach((element) => {
			if (
				matchesSearch(element.textContent, QUERY.search_mode, QUERY.search_term)
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
function getHtmlElementAsString(tag, tagOccurance, html) {
	let htmlString = String(html);

	const startTagBeginning = `<${tag}`;
	const startTagEnding = ">";
	const htmlTagStartIndexBeginning = htmlString.indexOf(startTagBeginning);
	const htmlTagStartIndexEnding =
		htmlString.indexOf(startTagEnding, htmlTagStartIndexBeginning) + 1;
	const startTag = htmlString.substring(
		htmlTagStartIndexBeginning,
		htmlTagStartIndexEnding
	);
	const htmlTagStartIndex = htmlString.indexOf(startTag);

	const endTag = `</${tag}>`;
	const htmlTagEndIndex =
		htmlString.indexOf(endTag, htmlTagStartIndex) + endTag.length;

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
	nestTagContent = startTag;
	nestTagContent += htmlString;
	nestTagContent += endTag;

	return nestTagContent;
}

// TODO ADD ERROR HANDLING FOR IF ALREADY EXISTS
function addHtmlDoctypeToHtmlString(html) {
	let htmlString;

	htmlString = "<!DOCTYPE html>";
	htmlString += String(html);

	return htmlString;
}

	dom.window.document.querySelectorAll(queryElement).forEach((element) => {
		if (matchesSearch(element.textContent, queryMode, queryTerm)) {
			elementArray.push(element);
		}
	});

	if (elementArray.length !== 0) {
		return elementArray;
	}

	return new Error("No search results were found.");
}

function getElementAttribute(element, attribute) {
	const attributeOptions = element.getAttributeNames();

	if (attributeOptions.includes(attribute)) {
		return element.getAttribute(attribute);
	}

	if (attribute === "textContent") {
		return element.textContent;
	}

	attributeOptions.push("textContent");
	attributeOptions.sort((a, b) => a > b);

	return new Error(
		`No attribute of the name "${attribute}" exits. Valid option(s) include: "${attributeOptions.join(
			'", "'
		)}".`
	);
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
