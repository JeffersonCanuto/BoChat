/*
* Test cases:
* - Render user message in user-bubble container properly
* - Render bot message in agent-bubble container properly
* - Apply correct class according to the sender (user or agent)
*/

import { render } from "@testing-library/react";
import Message from "./index";

import "@testing-library/jest-dom";

const createMessage = (sender: "user" | "agent", text:string) => {
    return {
        id: crypto.randomUUID(),
        text,
        sender,
        createdAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
}

describe("Message", () => {
    // 1. Render user message in user-bubble container properly
    test("Render user message properly", () => {
        const userMessage = createMessage("user", "Quanto é 2 + 2?");
        const { getByText, container } = render(
            <Message message={userMessage} />
        );

        expect(getByText(userMessage.text)).toBeInTheDocument();
        expect(getByText(userMessage.createdAt)).toBeInTheDocument();

        const userBubble = container.querySelector(".user-bubble");
        expect(userBubble).toBeInTheDocument();
    });

    // 2. Render bot message in agent-bubble container properly
    test("Render bot message properly", () => {
        const botMessage = createMessage("agent", "A resposta é: 4. Fácil! 😎");
        const { getByText, container } = render(
            <Message message={botMessage} />
        );

        expect(getByText(botMessage.text)).toBeInTheDocument();
        expect(getByText(botMessage.createdAt)).toBeInTheDocument();

        const botBubble = container.querySelector(".agent-bubble");
        expect(botBubble).toBeInTheDocument();
    });

    // 3. Apply correct class according to the sender (user or agent)
    test("Apply correct class according to the sender", () => {
        const userMessage = createMessage("user", "Quanto é 2 + 2?");
        const { container, rerender } = render(
            <Message message={userMessage} />
        );

        expect(container.querySelector(".user-bubble")).toBeInTheDocument();
        expect(container.querySelector(".agent-bubble")).not.toBeInTheDocument();

        const botMessage = createMessage("agent", "A resposta é: 4. Fácil! 😎");
        rerender(
            <Message message={botMessage} />
        );

        expect(container.querySelector(".agent-bubble")).toBeInTheDocument();
        expect(container.querySelector(".user-bubble")).not.toBeInTheDocument();
    });
});