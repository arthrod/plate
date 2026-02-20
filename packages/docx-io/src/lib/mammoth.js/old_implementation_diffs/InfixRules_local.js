// lib/vendor/lop/lib/bottom-up.ts:49
function InfixRules(infixRules) {
    function untilExclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name)));
    }

    function untilInclusive(name) {
        return new InfixRules(infixRules.slice(0, ruleNames().indexOf(name) + 1));
    }

    function ruleNames() {
        return infixRules.map(function(rule) {
            return rule.name;
        });
    }

    function apply(leftResult) {
        var currentResult;
        var source;
        while (true) {
            currentResult = applyToTokens(leftResult.remaining());
            if (currentResult.isSuccess()) {
                source = leftResult.source().to(currentResult.source());
                leftResult = results.success(
                    currentResult.value()(leftResult.value(), source),
                    currentResult.remaining(),
                    source
                )
            } else if (currentResult.isFailure()) {
                return leftResult;
            } else {
                return currentResult;
            }
        }
    }

    function applyToTokens(tokens) {
        return rules.firstOf("infix", infixRules.map(function(infix) {
            return infix.rule;
        }))(tokens);
    }

    return {
        apply: apply,
        untilExclusive: untilExclusive,
        untilInclusive: untilInclusive
    }
}
