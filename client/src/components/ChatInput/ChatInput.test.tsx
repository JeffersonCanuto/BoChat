/*
* Test cases:
* - The Input and Button elements must be rendered and enabled
* - The Button element must trigger sending a message action when clicked
* - The Enter key in the input field must trigger sending a message action when pressed 
* - Other pressed keys in the input field must not trigger sending a message action
* - The Input element must be disabled whenever the chatbot's answer is loading
*/

import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ChatInput from "./index";

import "@testing-library/jest-dom";

describe("ChatInput", () => {
    // 1. The Input and Button elements must be rendered and enabled
    test("Input and Button elements are rendered and enabled", () => {
        const handleSend = vi.fn();
        const { getByPlaceholderText, getByRole } = render(<ChatInput isLoadingAnswer={false} handleSend={handleSend} />);

        const input = getByPlaceholderText("Escreva sua mensagem...");
        const button = getByRole("button");

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(input).toBeEnabled();
    });

    // 2. The Button element must trigger sending a message when clicked
    test("Button element triggers sending a message when clicked", async () => {
        const handleSend = vi.fn();
        const { getByRole } = render(<ChatInput isLoadingAnswer={false} handleSend={handleSend} />);

        const button = getByRole("button");
        await userEvent.click(button);

        expect(handleSend).toHaveBeenCalledTimes(1);
    });

    // 3. The Enter key in the input field must trigger sending a message when pressed
    test("Enter key in the input field triggers sending a message when pressed", async () => {
        const handleSend = vi.fn();
        const { getByPlaceholderText } = render(<ChatInput isLoadingAnswer={false} handleSend={handleSend} />);

        const input = getByPlaceholderText("Escreva sua mensagem...");
        await userEvent.type(input, "Olá{Enter}");

        expect(handleSend).toHaveBeenCalledTimes(1);
    });

    // 4. Other pressed keys in the input field must not trigger sending a message
    test("Other pressed keys in the input field do not trigger sending a message", async () => {
        const handleSend = vi.fn();
        const { getByPlaceholderText } = render(<ChatInput isLoadingAnswer={false} handleSend={handleSend} />);

        const input = getByPlaceholderText("Escreva sua mensagem...");
        await userEvent.type(input, "Olá"); // sem Enter

        expect(handleSend).not.toHaveBeenCalled();
    });

    // 5. The Input element must be disabled whenever the chatbot's answer is loading
    test("Input element is disabled whenever the chatbot's answer is loading", () => {
        const handleSend = vi.fn();
        const { getByPlaceholderText } = render(<ChatInput isLoadingAnswer={true} handleSend={handleSend} />);

        const input = getByPlaceholderText("Escreva sua mensagem...");
        expect(input).toBeDisabled();
    });
});