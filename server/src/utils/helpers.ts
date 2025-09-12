import sanitizeHtml from "sanitize-html";

// Controller helpers
class ControllerHelpers {
    static sanitizedMessage(message:string):string {
        return sanitizeHtml(message);
    }
}

// Agent helpers
class AgentHelpers {
    static isMathQuery(message: string):boolean {
        // Normalize message to lowercase
        const lowerMessage = message.toLowerCase();

        // Check for at least one digit
        const hasDigit = /\d/.test(lowerMessage);

        // Check for common symbols or word-based operators
        const hasOperator = /[+\-*/^%()]/.test(lowerMessage) ||
            /\b(mais|menos|vezes|multiplicado por|dividido por|mod|elevado a)\b/.test(lowerMessage);
        
        return hasDigit && hasOperator;
    }
}

export { AgentHelpers, ControllerHelpers };