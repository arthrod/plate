exports.Parser = require("./lib/parser.ts").Parser;
exports.rules = require("./lib/rules.ts");
exports.errors = require("./lib/errors.ts");
exports.results = require("./lib/parsing-results.ts");
exports.StringSource = require("./lib/StringSource.ts");
exports.Token = require("./lib/Token.ts");
exports.bottomUp = require("./lib/bottom-up.ts");
exports.RegexTokeniser = require("./lib/regex-tokeniser.ts").RegexTokeniser;

exports.rule = function(ruleBuilder) {
    var rule;
    return function(input) {
        if (!rule) {
            rule = ruleBuilder();
        }
        return rule(input);
    };
};
