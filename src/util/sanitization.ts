import { Ollama } from "ollama";

export const model = "dolphin-mixtral";

export const ollama = new Ollama({
	host:
		typeof window !== "undefined"
			? `${window.location.protocol}//${
					window.location.host.split(":")[0]
			  }:${
					!!window.location.host.split(":")[1]
						? window.location.host.split(":")[1]
						: window.location.protocol.startsWith("https")
						? 443
						: 80
			  }`
			: undefined,
});

export async function isAskingForAdvice(
	question: string,
	customModel: string = model
) {
	const res = await ollama.chat({
		model: customModel,
		messages: [
			{
				role: "system",
				content: `Return the word "true" with no additional output if the user is asking for advice or help with an issue, or if they provide a statement with. Otherwise, return "false".`,
			},
			{
				role: "user",
				content: "hi",
			},
			{
				role: "assistant",
				content: "false",
			},
			{
				role: "user",
				content: "how are you?",
			},
			{
				role: "assistant",
				content: "false",
			},
			{
				role: "user",
				content: "my pc won't start",
			},
			{
				role: "assistant",
				content: "true",
			},
			{
				role: "user",
				content: "what is the capital of France?",
			},
			{
				role: "assistant",
				content: "false",
			},
			{
				role: "user",
				content: question,
			},
		],
	});
	return res.message.content.includes("true");
}
