# wbs-node-ts-gemini

This project is a Node.js and TypeScript template demonstrating how to interact with the Google Gemini API using both the REST API and the official SDK. It also includes examples for other providers like OpenAI and Anthropic.

## Features

-   **Gemini API Interaction**: Examples for both REST and SDK.
-   **Structured Responses**: Shows how to get structured JSON responses from the Gemini API.
-   **Provider-based CLI**: The main application allows you to choose a provider (e.g., `google`, `openai`, `anthropic`) and a prompt from the command line.
-   **TypeScript**: The project is written in TypeScript, providing type safety and better developer experience.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm
-   A Google Gemini API key.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/wbs-node-ts-gemini.git
    cd wbs-node-ts-gemini
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

## Usage

You can run the application using the `npm run dev` script, which uses `ts-node` to execute the TypeScript files directly. You need to provide a provider and a prompt as arguments.

### Run with Google Gemini

```bash
npm run dev -- google "What is the capital of Germany?"
```

This will output the responses from both the REST API and the SDK.

### Other Providers

The project is structured to easily add and use other providers. You can extend it by adding new files for other providers and updating the `app.ts` file.

## Project Structure

```
.
├── src
│   ├── app.ts                  # Main application entry point
│   ├── gemini-rest.ts          # Gemini REST API example
│   └── gemini-sdk-structured.ts # Gemini SDK example with structured output
├── package.json
├── tsconfig.json
└── .env.example
```

## Dependencies

-   `@google/genai`: The official Google GenAI SDK for Node.js.
-   `zod`: A TypeScript-first schema declaration and validation library.
-   `typescript`: The TypeScript compiler.
-   `@types/node`: Type definitions for Node.js.
