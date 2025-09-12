/*
 * Test cases:
 * - Render conversation list with title and items
 * - Add new conversation by clicking the add button
 * - Select conversation by clicking on one of the list
 * - Edit conversation label and check if it was saved
 */

import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import ConversationList from "./index";
import type { Conversation as ConversationType } from "@/types";

import "@testing-library/jest-dom";

// Mock Crypto API
Object.defineProperty(globalThis, "crypto", {
    value: {
        ...globalThis.crypto,
        randomUUID: () => "uuid-123",
    },
    writable: true
});

// Mock getOrCreateUserId helper
vi.mock("@/utils/helpers", () => ({
    getOrCreateUserId: vi.fn(() => "user-123")
}));

// Mock ApiRequests service
vi.mock("@/services/ApiRequests", () => {
    return {
        default: {
            fetchConversationLabels: vi.fn(),
            saveConversationLabel: vi.fn(),
            sendMessageToServer: vi.fn(),
            deleteConversation: vi.fn(),
            fetchConversations: vi.fn(),
        }
    };
});

import ApiRequests from "@/services/ApiRequests";
const mockApiRequests = ApiRequests as Record<string, any>;

describe("ConversationList", () => {
    const mockConversations = [
        {
            id: "conv-1",
            messages: [
                {
                    id: "msg-1",
                    text: "Olá! Sou o IzzyBot. Como posso te ajudar? 😊",
                    sender: "agent",
                    createdAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                }
            ]
        }
    ] as unknown as ConversationType[];

    const defaultProps = {
        conversations: mockConversations,
        activeConversationId: null,
        handleSelect: vi.fn(),
        setConversations: vi.fn(),
        setActiveConversationId: vi.fn()
    };

    // 1. Render conversation list with title and items
    test("Render conversation list with title and items", async() => {
        mockApiRequests.fetchConversationLabels.mockResolvedValueOnce({
            labels: { "conv-1": "IzzyBot" }
        });

        const { getByText, findByText } = render(<ConversationList { ...defaultProps } />);

        expect(getByText("Mensagens")).toBeInTheDocument();
        expect(await findByText("IzzyBot")).toBeInTheDocument();
        expect(getByText("Olá! Sou o Iz...")).toBeInTheDocument();
    });

    // 2. Add new conversation by clicking the add button
    test("Add new conversation when add button is clicked", async() => {
        const setConversations = vi.fn();

        mockApiRequests.fetchConversationLabels.mockResolvedValueOnce({
            labels: {}
        });

        const { getByRole } = render(
            <ConversationList
                {...defaultProps}
                conversations={[]}
                setConversations={setConversations}
            />
        );

        const addButton = getByRole("button");
        await userEvent.click(addButton);

        await waitFor(() => {
            expect(setConversations).toHaveBeenCalled();
        });
    });

    // 3. Select conversation by clicking on one of the list
    test("Select conversation by clicking on one of the list", async () => {
        mockApiRequests.fetchConversationLabels.mockResolvedValueOnce({
            labels: { "conv-1": "IzzyBot" }
        });

        const { findByText } = render(<ConversationList {...defaultProps} />);

        const conversationItem = await findByText("IzzyBot");
        await userEvent.click(conversationItem);

        expect(defaultProps.handleSelect).toHaveBeenCalledWith("conv-1");
    });

    // 4. Edit conversation label and check if it was saved
    test("Edit conversation label and check if it was saved", async() => {
        mockApiRequests.fetchConversationLabels.mockResolvedValueOnce({
            labels: { "conv-1": "IzzyBot" }
        });

        const {
            findByText,
            getAllByRole,
            getByDisplayValue
        } = render(<ConversationList {...defaultProps} />);

        await findByText("IzzyBot");
        
        const editButton = getAllByRole("button")[1];
        await userEvent.click(editButton);

        const input = getByDisplayValue("IzzyBot");

        await userEvent.clear(input);
        await userEvent.type(input, "NovoNome{enter}");

        await waitFor(() => {
            expect(mockApiRequests.saveConversationLabel).toHaveBeenCalledWith(
                "user-123",
                "conv-1",
                "NovoNome"
            );
        });
    });
    
    // 5. Delete conversation when delete button is clicked
    test("Delete conversation when delete button is clicked", async () => {
        mockApiRequests.fetchConversationLabels.mockResolvedValueOnce({
            labels: { "conv-1": "IzzyBot" }
        });

        const setConversations = vi.fn((updater) => {
            const newState = typeof updater === "function" ? updater([...mockConversations]) : updater;
            return newState;
        });

        const { getAllByRole } = render(<ConversationList {...defaultProps} setConversations={setConversations} />);
        
        const deleteIcon = getAllByRole("button")[2];

        await userEvent.click(deleteIcon);

        await waitFor(() => {
            expect(mockApiRequests.deleteConversation).toHaveBeenCalledWith(
                "user-123",
                "conv-1"
            );
        });
    });
});