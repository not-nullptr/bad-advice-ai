import { json } from "@sveltejs/kit";
import { v4 } from "uuid";

const queue: {
	id: string;
	isVerified: boolean;
}[] = [];

export function POST() {
	const id = v4();
	queue.push({
		id,
		isVerified: true,
	});
	const interval = setInterval(() => {
		const item = queue.find((q) => q.id === id);
		if (!item) return clearInterval(interval);
		if (!item.isVerified) {
			clearInterval(interval);
			queue.splice(queue.indexOf(item), 1);
			return;
		}
		item.isVerified = false;
	}, 5000);
	return json({ id, index: queue.length - 1 });
}

export function GET({ url }) {
	const id = url.searchParams.get("id");
	if (!id)
		return json({
			code: "You have to specify the ID",
		});
	const index = queue.findIndex((v) => v.id === id);
	if (index === -1)
		return json({
			code: "The given ID is invalid",
		});
	const item = queue[index];
	item.isVerified = true;
	return json({ index });
}

export function DELETE({ url }) {
	const id = url.searchParams.get("id");
	if (!id)
		return json({
			code: "You have to specify the ID",
		});
	const index = queue.findIndex((v) => v.id === id);
	if (index === -1)
		return json({
			code: "The given ID is invalid",
		});
	queue.splice(index, 1);
	return new Response("{}", { status: 204 });
}
