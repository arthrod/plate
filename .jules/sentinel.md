## 2024-05-18 - Reverse Tabnabbing via Target Blank Links
**Vulnerability:** Links with `target="_blank"` rendered by the editor without `rel="noopener noreferrer"` attributes.
**Learning:** This is a classic reverse tabnabbing vector in user-generated content applications like Plate. We can centralize link safety in the `getLinkAttributes` function for the entire Plate editor instance.
**Prevention:** Automatically append `noopener noreferrer` to the `rel` attribute in `getLinkAttributes` whenever `attributes.target === '_blank'`.
