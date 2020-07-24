export default function reOrganizeItems(items, itemType) {
	const redoneItems = [];
	items.forEach((element) => {
		switch (itemType) {
		case 'tag': { redoneItems.push(element.Tag); break; }
		case 'document': { redoneItems.push(element.Document); break; }
		case 'event': { redoneItems.push(element.Event); break; }
		case 'location': { redoneItems.push(element.Location); break; }
		case 'stakeholder': { redoneItems.push(element.Stakeholder); break; }
		default: { redoneItems.push(element); break; }
		}
	});
	return redoneItems;
}
