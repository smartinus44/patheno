const _ = require('lodash');

import BookMark from '../src/Bookmark.class'

const expect = require('chai').expect;
const approvals = require('approvals');
approvals.mocha();

require('jsdom-global')();

describe("Bookmark", function () {

	let bookmark;

	beforeEach(() => {

		// Create a new Rectangle object before every test.
		bookmark = new BookMark(
			1,
			1063,
			100,
			[],
			23,
			true,
			null,
			null,
			false,
			3,
			true,
			[],
			12,
			false,
			false,
			false,
			false
		);
	});

	it("should work", function () {

		const loggedLines = [];
		const oldLog = console.log;
		console.log = function (arg) {
			loggedLines.push(arg);
		};

		console.log(bookmark);

		console.log = oldLog;

		this.verifyAsJSON(loggedLines)

	});

});
