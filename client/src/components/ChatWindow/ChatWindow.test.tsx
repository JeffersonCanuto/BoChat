/*
* Test cases:
* - Render fixed header containing avatar, name and bot status
* - Display all the received messages that are passed via props
* - Apply correct class to each message according to the sender (user or agent)
*/

import { render } from "@testing-library/react";
import ChatWindow from "./index";

import "@testing-library/jest-dom";

const createMessage = (sender: "user" | "agent", text:string) => {
    return {
        id: crypto.randomUUID(),
        text,
        sender,
        createdAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }
}

describe("ChatWindow", () => {
    const allMessages = [
        createMessage("user", "Quanto é 2 + 2?"),
        createMessage("agent", "A resposta é: 4. Fácil! 😎")
    ];

    // 1. Render fixed header containing avatar, name and bot status
    test("Render header containing avatar, name and bot status", () => {
        const { getByText, getByAltText } = render(<ChatWindow messages={allMessages} />);

        expect(getByText("IzzyBot")).toBeInTheDocument();
        expect(getByText("Online")).toBeInTheDocument();
        expect(getByAltText("IzzyBot")).toBeInTheDocument();
    });

    // 2. Display all the received messages that are passed via props
    test("Render all the received messages via props", () => {
        const { getByText, getAllByText } = render(<ChatWindow messages={allMessages} />);

        allMessages.forEach(message => {
            expect(getByText(message.text)).toBeInTheDocument();
            const times = getAllByText(message.createdAt);
            expect(times.length).toBeGreaterThan(0);
        });
    });

    // 3. Apply correct class to each message according to the sender (user or agent)
    test("Apply correct class to each message according to the sender", () => {
        const { container } = render(<ChatWindow messages={allMessages} />);

        allMessages.forEach(message => {
            const bubble = container.querySelector(`.${message.sender}-bubble`);
            expect(bubble).toBeInTheDocument();
            expect(bubble).toHaveTextContent(message.text);
        });
    });
});