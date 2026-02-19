var assert = require("assert");
var fs = require("fs");
var path = require("path");

var test = require("./test.ts")(module);


test("package dependencies do not include removed trivial deps", function() {
    var packageJsonPath = path.join(__dirname, "..", "package.json");
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    assert.equal(packageJson.dependencies["path-is-absolute"], undefined);
    assert.equal(packageJson.dependencies["base64-js"], undefined);
});

test("runtime lib source does not import removed trivial deps", function() {
    var libPath = path.join(__dirname, "..", "lib");
    var filePaths = listTsFiles(libPath);

    filePaths.forEach(function(filePath) {
        var contents = fs.readFileSync(filePath, "utf8");
        assert.equal(contents.indexOf("path-is-absolute"), -1, "found path-is-absolute in " + filePath);
        assert.equal(contents.indexOf("base64-js"), -1, "found base64-js in " + filePath);
    });
});

function listTsFiles(rootPath) {
    var entries = fs.readdirSync(rootPath, {withFileTypes: true});

    return entries.reduce(function(result, entry) {
        var entryPath = path.join(rootPath, entry.name);

        if (entry.isDirectory()) {
            return result.concat(listTsFiles(entryPath));
        } else if (entry.isFile() && path.extname(entry.name) === ".ts") {
            result.push(entryPath);
        }

        return result;
    }, []);
}
