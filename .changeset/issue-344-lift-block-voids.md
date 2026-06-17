---
"@platejs/docx-io": patch
---

Lift block-void elements (`img`, `hr`, etc.) and nested paragraphs out of inline-only parents (`p`, `h1`-`h6`, `lic`) on DOCX import. Mammoth emits `<p><img/></p>` for inline drawings; the resulting tree now matches Plate's schema instead of trapping a block-void inside a paragraph and breaking selection / suggestion anchors.
