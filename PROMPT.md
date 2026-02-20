<task> Please fix the issue pointed out by the build. All imports must strictly follow ts syntax and installed at package.json. Adapt appropriately. 

tejs/ai:build: cache bypass, force executing 217628e625ca0410
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'fs' in src/lib/mammoth.js/lib/unzip.ts
@platejs/docx-io:build:     ╭─[ src/lib/mammoth.js/lib/unzip.ts:10:55 ]
@platejs/docx-io:build:     │
@platejs/docx-io:build:  10 │     var fs = typeof require !== 'undefined' ? require('fs') : null;
@platejs/docx-io:build:     │                                                       ──┬─  
@platejs/docx-io:build:     │                                                         ╰─── Module not found, treating it as an external dependency
@platejs/docx-io:build:     │ 
@platejs/docx-io:build:     │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ────╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'fs' in src/lib/mammoth.js/lib/docx/files.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/docx/files.ts:6:51 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  6 │   return typeof require !== 'undefined' ? require('fs') : null;
@platejs/docx-io:build:    │                                                   ──┬─  
@platejs/docx-io:build:    │                                                     ╰─── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'path' in src/lib/mammoth.js/lib/docx/files.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/docx/files.ts:9:51 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  9 │   return typeof require !== 'undefined' ? require('path') : null;
@platejs/docx-io:build:    │                                                   ───┬──  
@platejs/docx-io:build:    │                                                      ╰──── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'os' in src/lib/mammoth.js/lib/docx/files.ts
@platejs/docx-io:build:     ╭─[ src/lib/mammoth.js/lib/docx/files.ts:12:51 ]
@platejs/docx-io:build:     │
@platejs/docx-io:build:  12 │   return typeof require !== 'undefined' ? require('os') : null;
@platejs/docx-io:build:     │                                                   ──┬─  
@platejs/docx-io:build:     │                                                     ╰─── Module not found, treating it as an external dependency
@platejs/docx-io:build:     │ 
@platejs/docx-io:build:     │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ────╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'dingbat-to-unicode' in src/lib/mammoth.js/lib/docx/body-reader.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/docx/body-reader.ts:4:32 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  4 │ var dingbatToUnicode = require('dingbat-to-unicode');
@platejs/docx-io:build:    │                                ──────────┬─────────  
@platejs/docx-io:build:    │                                          ╰─────────── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve 'xmlbuilder' in src/lib/mammoth.js/lib/xml/writer.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/xml/writer.ts:2:26 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  2 │ var xmlbuilder = require('xmlbuilder');
@platejs/docx-io:build:    │                          ──────┬─────  
@platejs/docx-io:build:    │                                ╰─────── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve '@xmldom/xmldom' in src/lib/mammoth.js/lib/xml/xmldom.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/xml/xmldom.ts:2:22 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  2 │ var xmldom = require('@xmldom/xmldom');
@platejs/docx-io:build:    │                      ────────┬───────  
@platejs/docx-io:build:    │                              ╰───────── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: 
@platejs/docx-io:build: [UNRESOLVED_IMPORT] Warning: Could not resolve '@xmldom/xmldom/lib/dom' in src/lib/mammoth.js/lib/xml/xmldom.ts
@platejs/docx-io:build:    ╭─[ src/lib/mammoth.js/lib/xml/xmldom.ts:3:19 ]
@platejs/docx-io:build:    │
@platejs/docx-io:build:  3 │ var dom = require('@xmldom/xmldom/lib/dom');
@platejs/docx-io:build:    │                   ────────────┬───────────  
@platejs/docx-io:build:    │                               ╰───────────── Module not found, treating it as an external dependency
@platejs/docx-io:build:    │ 
@platejs/docx-io:build:    │ Help: The "main" field here was ignored. Main fields must be configured explicitly when using the "neutral" platform.
@platejs/docx-io:build: ───╯
@platejs/docx-io:build: <final_remarks>After you believe you are done, please run yarn install, yarn build and then strictly the command contained in railpack.json. Lint, typecheck and other errors must be addressed, regardless of anything else.</final_remarks></task>
